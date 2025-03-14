import { useState, useEffect, useCallback } from 'react';
import { processCommand } from '../utils/taskProcessor';
import { speak, stopSpeaking, initSpeechSynthesis } from '../utils/speechSynthesis';
import { useToast } from "@/hooks/use-toast";
import { learningSystem } from '@/utils/learningSystem';
import { Message } from '../components/chat/MessageList';
import type { ChatState, ChatContextType } from '../types/chat';

export type { ChatState };

export const useChat = (onProcessingStateChange?: (state: boolean) => void): ChatContextType => {
  const [state, setState] = useState<ChatState>({
    messages: [{
      id: '1',
      text: '',  // Will be set with personalized greeting
      sender: 'assistant',
      timestamp: new Date()
    }],
    isProcessing: false,
    isListening: false,
    isSpeaking: false,
    showCalendar: false,
    showNotes: false,
  });
  
  const { toast } = useToast();

  // Initialize speech synthesis and set initial greeting
  useEffect(() => {
    initSpeechSynthesis();
    
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech Synthesis Unavailable",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
    }
    
    // Set the initial personalized greeting
    const initialGreeting = learningSystem.getPersonalizedGreeting();
    updateMessage('1', { text: initialGreeting });
  }, []);

  // Effect to notify parent component about processing state changes
  useEffect(() => {
    if (onProcessingStateChange) {
      onProcessingStateChange(state.isProcessing);
    }
  }, [state.isProcessing, onProcessingStateChange]);

  // Helper function to update message
  const updateMessage = useCallback((id: string, updates: Partial<Message>) => {
    setState(prevState => ({
      ...prevState,
      messages: prevState.messages.map(msg =>
        msg.id === id ? { ...msg, ...updates } : msg
      )
    }));
  }, []);

  // Helper function to add message
  const addMessage = useCallback((message: Message) => {
    setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message]
    }));
  }, []);

  // Helper function for setting state properties
  const updateState = useCallback((updates: Partial<ChatState>) => {
    setState(prevState => ({
      ...prevState,
      ...updates
    }));
  }, []);

  // Simulate typing effect
  const simulateTyping = useCallback(async (text: string) => {
    const assistantMessage: Message = {
      id: Date.now().toString(),
      text: '',
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    
    addMessage(assistantMessage);
    
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      updateMessage(assistantMessage.id, { text: currentText });
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    updateMessage(assistantMessage.id, { isTyping: false });
    
    return assistantMessage.id;
  }, [addMessage, updateMessage]);

  // Send message function
  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim()) return;
    
    updateState({ isProcessing: true });
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    addMessage(userMessage);
    
    try {
      const response = processCommand(text);
      const messageId = await simulateTyping(response.message);
      
      updateState({ isProcessing: false });
      updateState({ isSpeaking: true });
      
      speak(
        response.message,
        undefined,
        () => {
          updateState({ isSpeaking: false });
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
      updateState({ isProcessing: false });
    }
  }, [addMessage, simulateTyping, toast, updateState]);

  // Toggle listening state
  const toggleListening = useCallback(() => {
    if (state.isSpeaking) {
      stopSpeaking();
      updateState({ isSpeaking: false });
    }
    
    const newListeningState = !state.isListening;
    updateState({ isListening: newListeningState });
    
    if (newListeningState) {
      toast({
        title: "Voice Recognition Active",
        description: "I'm listening... Speak clearly into your microphone.",
      });
    }
  }, [state.isListening, state.isSpeaking, toast, updateState]);

  // Handle speech result
  const handleSpeechResult = useCallback((text: string) => {
    if (text.trim()) {
      sendMessage(text);
      updateState({ isListening: false });
    }
  }, [sendMessage, updateState]);

  // Toggle calendar view
  const toggleCalendarView = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      showCalendar: !prevState.showCalendar,
      showNotes: prevState.showCalendar ? prevState.showNotes : false,
    }));
  }, []);

  // Toggle notes view
  const toggleNotesView = useCallback(() => {
    setState(prevState => ({
      ...prevState,
      showNotes: !prevState.showNotes,
      showCalendar: prevState.showNotes ? prevState.showCalendar : false,
    }));
  }, []);

  return {
    state,
    sendMessage,
    toggleListening,
    handleSpeechResult,
    toggleCalendarView,
    toggleNotesView
  };
};
