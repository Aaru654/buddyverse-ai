
import React, { useState } from 'react';
import { Mic, MicOff } from 'lucide-react';

interface VoiceRecognitionProps {
  onSpeechResult: (text: string) => void;
  isListening: boolean;
  toggleListening: () => void;
}

export const VoiceRecognition = ({ 
  onSpeechResult, 
  isListening, 
  toggleListening 
}: VoiceRecognitionProps) => {
  // For demo purposes, we'll simulate speech recognition with predefined phrases
  const simulateSpeechRecognition = () => {
    if (!isListening) return;
    
    const demoSpeechResults = [
      "Open my documents folder",
      "Play some music",
      "What time is it?",
      "Take a note: remember to finish the project",
      "Tell me a joke"
    ];
    
    const randomResult = demoSpeechResults[Math.floor(Math.random() * demoSpeechResults.length)];
    
    // Simulate processing delay
    setTimeout(() => {
      onSpeechResult(randomResult);
    }, 1500);
  };

  return (
    <div className="flex items-center justify-center mt-4">
      <button
        onClick={() => {
          toggleListening();
          if (!isListening) {
            simulateSpeechRecognition();
          }
        }}
        className={`relative p-4 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-buddy-accent/20 text-buddy-accent animate-pulse' 
            : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/80'
        }`}
      >
        <div className="relative z-10">
          {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </div>
        
        {isListening && (
          <div className="absolute inset-0 rounded-full border border-buddy-accent/50 animate-ping"></div>
        )}
      </button>
      
      <div className="ml-3 text-sm text-gray-400">
        {isListening ? 'Listening...' : 'Click to speak'}
      </div>
    </div>
  );
};
