
import React, { useState, useEffect } from 'react';
import { processCommand } from '../utils/taskProcessor';
import { speak, stopSpeaking, initSpeechSynthesis } from '../utils/speechSynthesis';
import { useToast } from "@/hooks/use-toast";
import { learningSystem } from '@/utils/learningSystem';

import { MessageList, Message } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
import { SidePanel } from './chat/SidePanel';

interface ChatContainerProps {
  onProcessingStateChange?: (state: boolean) => void;
}

export const ChatContainer = ({ onProcessingStateChange }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    initSpeechSynthesis();
    
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech Synthesis Unavailable",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
    }
    
    // Initialize with a personalized welcome message
    const initialGreeting = learningSystem.getPersonalizedGreeting();
    setMessages([{
      id: '1',
      text: initialGreeting,
      sender: 'assistant',
      timestamp: new Date()
    }]);
  }, []);

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

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;
    
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
  
  const toggleCalendarView = () => {
    setShowCalendar(!showCalendar);
    if (showNotes) setShowNotes(false);
  };
  
  const toggleNotesView = () => {
    setShowNotes(!showNotes);
    if (showCalendar) setShowCalendar(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
      <ChatHeader 
        showCalendar={showCalendar}
        showNotes={showNotes}
        toggleCalendarView={toggleCalendarView}
        toggleNotesView={toggleNotesView}
      />
      
      <MessageList 
        messages={messages}
        isProcessing={isProcessing}
      />
      
      <SidePanel 
        showCalendar={showCalendar}
        showNotes={showNotes}
      />
      
      <ChatInput 
        onSendMessage={handleSendMessage}
        isProcessing={isProcessing}
        isSpeaking={isSpeaking}
        isListening={isListening}
        toggleListening={toggleListening}
        onSpeechResult={handleSpeechResult}
      />
    </div>
  );
};
