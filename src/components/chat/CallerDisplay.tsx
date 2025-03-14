
import React from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import { Avatar } from '@/components/ui/avatar';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX
} from 'lucide-react';

export const CallerDisplay = () => {
  const { state, toggleListening } = useChatContext();
  const { isProcessing, isListening } = state;
  
  // Get the most recent message (if any)
  const lastMessage = state.messages.length > 0 
    ? state.messages[state.messages.length - 1] 
    : null;
    
  const isOngoing = isProcessing || isListening;
  
  return (
    <div className={`py-8 flex flex-col items-center justify-center space-y-6 transition-all duration-300 ${isOngoing ? 'opacity-100' : 'opacity-80'}`}>
      {/* Avatar Circle */}
      <div className={`relative ${isOngoing ? 'animate-pulse-slow' : ''}`}>
        <div className="absolute inset-0 rounded-full bg-buddy-neon/20 animate-ping" 
          style={{ animationDuration: '3s' }}></div>
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border-2 border-buddy-neon/30">
          <span className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-buddy-neon to-buddy-purple">
            B
          </span>
        </div>
      </div>

      {/* Caller Name */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white">BUDDY</h2>
        <p className="text-gray-400 text-sm mt-1">
          {isProcessing ? 'Processing...' : isListening ? 'Listening...' : 'AI Assistant'}
        </p>
      </div>

      {/* Call Duration / Status */}
      <div className="text-gray-400 text-sm">
        {isOngoing ? (
          <span className="animate-pulse">Active</span>
        ) : (
          <span>Ready</span>
        )}
      </div>

      {/* Call Controls */}
      <div className="flex justify-center space-x-8 pt-4">
        <button
          onClick={() => toggleListening()}
          className={`rounded-full p-4 ${
            isListening ? 'bg-red-500/80' : 'bg-gray-800'
          } transition-colors`}
        >
          {isListening ? (
            <MicOff className="w-6 h-6 text-white" />
          ) : (
            <Mic className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          className={`rounded-full p-4 ${
            isProcessing ? 'bg-buddy-neon/80' : 'bg-gray-800'
          } transition-colors`}
          disabled
        >
          {isProcessing ? (
            <Phone className="w-6 h-6 text-black" />
          ) : (
            <Phone className="w-6 h-6 text-white" />
          )}
        </button>

        <button
          className="rounded-full p-4 bg-gray-800 transition-colors"
          disabled
        >
          {true ? (
            <Volume2 className="w-6 h-6 text-white" />
          ) : (
            <VolumeX className="w-6 h-6 text-white" />
          )}
        </button>
      </div>
    </div>
  );
};
