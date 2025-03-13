import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2 } from 'lucide-react';
import { processCommand } from '../utils/taskProcessor';
import { speak, stopSpeaking, initSpeechSynthesis } from '../utils/speechSynthesis';
import { VoiceRecognition } from './VoiceRecognition';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatContainerProps {
  onProcessingStateChange?: (state: boolean) => void;
}

export const ChatContainer = ({ onProcessingStateChange }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m BUDDY, your offline AI assistant. How can I help you today?',
      sender: 'assistant',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    initSpeechSynthesis();
    
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech Synthesis Unavailable",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
    }
  }, []);

  useEffect(() => {
    const smoothScroll = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    setTimeout(smoothScroll, 100);
  }, [messages]);

  const simulateTyping = async (text: string) => {
    const assistantMessage: Message = {
      id: Date.now().toString(),
      text: '',
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, text: currentText } 
            : msg
        )
      );
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setMessages(prev => 
      prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, isTyping: false } 
          : msg
      )
    );
    
    return assistantMessage.id;
  };

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    
    setInput('');
    setIsProcessing(true);
    if (onProcessingStateChange) onProcessingStateChange(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = processCommand(text);
      const messageId = await simulateTyping(response.message);
      
      setIsProcessing(false);
      setIsSpeaking(true);
      
      speak(
        response.message,
        undefined,
        () => {
          setIsSpeaking(false);
          if (onProcessingStateChange) onProcessingStateChange(false);
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
      if (onProcessingStateChange) onProcessingStateChange(false);
    }
  };

  const handleSpeechResult = (text: string) => {
    if (text.trim()) {
      handleSendMessage(text);
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    
    setIsListening(!isListening);
    
    if (!isListening) {
      toast({
        title: "Voice Recognition Active",
        description: "I'm listening... Speak clearly into your microphone.",
      });
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-2 bg-gray-900/70 border-b border-gray-800">
        <h2 className="text-sm font-medium text-gray-300 text-center">Conversation</h2>
      </div>
      
      <div className="h-[40vh] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-buddy-purple text-white'
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              <p>{message.text}
                {message.isTyping && (
                  <span className="inline-flex ml-2">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                  </span>
                )}
              </p>
              <span className="text-xs text-gray-400 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        ))}
        {isProcessing && !messages.some(m => m.isTyping) && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white p-3 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t border-gray-800 bg-gray-900/50">
        <VoiceRecognition 
          onSpeechResult={handleSpeechResult} 
          isListening={isListening}
          toggleListening={toggleListening}
        />
        
        <div className="mt-4 flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded-l-md p-2 text-white focus:outline-none focus:ring-1 focus:ring-buddy-neon"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            className={`bg-buddy-neon hover:bg-buddy-neon/80 text-black p-2 rounded-r-md transition-colors ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isProcessing}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
