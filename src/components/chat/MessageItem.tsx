
import React from 'react';

interface MessageProps {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

export const MessageItem = ({ id, text, sender, timestamp, isTyping }: MessageProps) => {
  return (
    <div
      className={`flex ${
        sender === 'user' ? 'justify-end' : 'justify-start'
      } mb-1`}
    >
      <div
        className={`max-w-[85%] p-2 rounded-lg text-sm ${
          sender === 'user'
            ? 'bg-buddy-purple/80 text-white'
            : 'bg-gray-800/80 text-gray-200'
        }`}
      >
        <p className="text-sm">{text}
          {isTyping && (
            <span className="inline-flex ml-1">
              <span className="animate-pulse">.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
              <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
            </span>
          )}
        </p>
        <span className="text-xs text-gray-400 block">
          {timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
          })}
        </span>
      </div>
    </div>
  );
};
