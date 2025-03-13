
import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { VoiceRecognition } from '../VoiceRecognition';
import { useChatContext } from '@/contexts/ChatContext';

export const ChatInput = () => {
  const [input, setInput] = useState('');
  const { state, sendMessage, toggleListening, handleSpeechResult } = useChatContext();
  const { isProcessing, isListening } = state;

  const handleSendMessage = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput('');
  };

  return (
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
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <button
          onClick={handleSendMessage}
          className={`bg-buddy-neon hover:bg-buddy-neon/80 text-black p-2 rounded-r-md transition-colors ${
            isProcessing ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isProcessing}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
