
import React from 'react';
import { ChatProvider } from '../contexts/ChatContext';
import { MessageList } from './chat/MessageList';
import { ChatInput } from './chat/ChatInput';
import { ChatHeader } from './chat/ChatHeader';
import { SidePanel } from './chat/SidePanel';
import { CallerDisplay } from './chat/CallerDisplay';

interface ChatContainerProps {
  onProcessingStateChange?: (state: boolean) => void;
}

export const ChatContainer = ({ onProcessingStateChange }: ChatContainerProps) => {
  return (
    <ChatProvider onProcessingStateChange={onProcessingStateChange}>
      <div className="w-full max-w-2xl mx-auto bg-black/70 backdrop-blur-lg rounded-xl border border-gray-800 overflow-hidden flex flex-col">
        <ChatHeader />
        <CallerDisplay />
        <MessageList />
        <SidePanel />
        <ChatInput />
      </div>
    </ChatProvider>
  );
};
