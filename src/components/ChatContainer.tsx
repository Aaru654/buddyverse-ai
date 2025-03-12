
import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { processCommand } from '../utils/taskProcessor';
import { speak, stopSpeaking, initSpeechSynthesis } from '../utils/speechSynthesis';
import { VoiceRecognition } from './VoiceRecognition';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
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

  // Initialize speech synthesis on component mount
  useEffect(() => {
    initSpeechSynthesis();
  }, []);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update parent component about processing state
  useEffect(() => {
    if (onProcessingStateChange) {
      onProcessingStateChange(isProcessing || isSpeaking);
    }
  }, [isProcessing, isSpeaking, onProcessingStateChange]);

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    
    // Clear input and set processing state
    setInput('');
    setIsProcessing(true);
    if (onProcessingStateChange) onProcessingStateChange(true);
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Process the command
    const response = processCommand(text);
    
    // Simulate processing delay for a more natural feel
    setTimeout(() => {
      // Add assistant response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.message,
        sender: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
      
      // Speak the response
      setIsSpeaking(true);
      speak(
        response.message,
        undefined,
        () => setIsSpeaking(false)
      );
    }, 1000);
  };

  const toggleListening = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    
    setIsListening(!isListening);
  };

  const handleSpeechResult = (text: string) => {
    setIsListening(false);
    handleSendMessage(text);
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
              <p>{message.text}</p>
              <span className="text-xs text-gray-400 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white p-3 rounded-lg max-w-[85%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 rounded-full bg-buddy-neon animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-buddy-neon animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 rounded-full bg-buddy-neon animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
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
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={() => handleSendMessage()}
            className="bg-buddy-neon hover:bg-buddy-neon/80 text-black p-2 rounded-r-md transition-colors"
            disabled={isProcessing}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
