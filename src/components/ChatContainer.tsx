
import React from 'react';
import { ChatProvider } from '../contexts/ChatContext';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
import { SidePanel } from './chat/SidePanel';

interface ChatContainerProps {
  onProcessingStateChange?: (state: boolean) => void;
}

export const ChatContainer = ({ onProcessingStateChange }: ChatContainerProps) => {
  return (
    <ChatProvider onProcessingStateChange={onProcessingStateChange}>
      <div className="w-full max-w-2xl mx-auto bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
        <ChatHeader />
        <MessageList />
        <SidePanel />
        <ChatInput />
      </div>
    </ChatProvider>
  );
};
