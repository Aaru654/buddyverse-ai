
import React, { createContext, useContext, ReactNode } from 'react';
import { useChat } from '../hooks/useChat';
import { ChatContextType } from '../types/chat';

// Create the context
const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create the provider component
export const ChatProvider: React.FC<{ 
  children: ReactNode; 
  onProcessingStateChange?: (state: boolean) => void 
}> = ({ 
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
