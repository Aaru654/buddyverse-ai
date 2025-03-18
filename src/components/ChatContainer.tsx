
import React from 'react';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
import { SidePanel } from './chat/SidePanel';
import { CallerDisplay } from './chat/CallerDisplay';
import { useChatContext } from '../contexts/ChatContext';

interface ChatContainerProps {
  onProcessingStateChange?: (state: boolean) => void;
}

export const ChatContainer = ({ onProcessingStateChange }: ChatContainerProps) => {
  // Get access to the chat context
  const chatContext = useChatContext();
  
  // Set up an effect to notify about processing state changes
  React.useEffect(() => {
    if (onProcessingStateChange && chatContext) {
      onProcessingStateChange(chatContext.state.isProcessing);
    }
  }, [chatContext?.state.isProcessing, onProcessingStateChange]);

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/70 backdrop-blur-lg rounded-xl border border-gray-800 overflow-hidden flex flex-col">
      <ChatHeader />
      <CallerDisplay />
      <MessageList />
      <SidePanel />
      <ChatInput />
    </div>
  );
};
