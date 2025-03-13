
import React, { createContext, useContext, ReactNode } from 'react';
import { useChat, ChatState } from '../hooks/useChat';
import { Message } from '../components/chat/MessageList';

// Create the context
type ChatContextType = {
  state: ChatState;
  sendMessage: (text: string) => Promise<void>;
  toggleListening: () => void;
  handleSpeechResult: (text: string) => void;
  toggleCalendarView: () => void;
  toggleNotesView: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create the provider component
export const ChatProvider: React.FC<{ children: ReactNode; onProcessingStateChange?: (state: boolean) => void }> = ({ 
  children, 
  onProcessingStateChange 
}) => {
  const chatHook = useChat(onProcessingStateChange);

  return (
    <ChatContext.Provider value={chatHook}>
      {children}
    </ChatContext.Provider>
  );
};

// Create a hook to use the chat context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
