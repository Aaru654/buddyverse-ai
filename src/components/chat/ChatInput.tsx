
import React, { useState } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
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
    <div className="p-3 border-t border-gray-800 bg-gray-900/70">      
      <div className="flex items-center rounded-full bg-gray-800 px-3 py-1 overflow-hidden">
        <button
          onClick={() => toggleListening()}
          className={`p-2 rounded-full ${
            isListening ? 'text-buddy-neon' : 'text-gray-400'
          }`}
          title={isListening ? "Stop listening" : "Start listening"}
        >
          {isListening ? (
            <MicOff className="w-5 h-5" />
          ) : (
            <Mic className="w-5 h-5" />
          )}
        </button>
        
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-transparent border-none p-2 text-white focus:outline-none text-sm"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        
        <button
          onClick={handleSendMessage}
          className={`p-2 rounded-full ${
            isProcessing ? 'text-gray-500 cursor-not-allowed' : 'text-buddy-neon hover:text-buddy-neon/80'
          } transition-colors`}
          disabled={isProcessing}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
      
      <VoiceRecognition 
        onSpeechResult={handleSpeechResult} 
        isListening={isListening}
        toggleListening={toggleListening}
      />
    </div>
  );
};
