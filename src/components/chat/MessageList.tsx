
import React, { useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { MessageItem } from './MessageItem';
import { useChatContext } from '@/contexts/ChatContext';

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

export const MessageList = () => {
  const { state } = useChatContext();
  const { messages, isProcessing } = state;
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const smoothScroll = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    setTimeout(smoothScroll, 100);
  }, [messages]);

  return (
    <div className="h-[40vh] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
      {messages.map((message) => (
        <MessageItem
          key={message.id}
          id={message.id}
          text={message.text}
          sender={message.sender}
          timestamp={message.timestamp}
          isTyping={message.isTyping}
        />
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
  );
};
