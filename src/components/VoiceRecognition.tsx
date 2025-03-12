
import React, { useState, useEffect, useRef } from 'react';
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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any | null>(null);

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setErrorMessage("Speech recognition is not supported in your browser.");
      return;
    }

    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    
    const recognition = recognitionRef.current;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      if (event.results[0].isFinal) {
        onSpeechResult(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setErrorMessage(`Error: ${event.error}`);
      toggleListening();
    };

    recognition.onend = () => {
      if (isListening) {
        toggleListening();
      }
    };

    return () => {
      if (recognition) {
        recognition.abort();
      }
    };
  }, [onSpeechResult, toggleListening]);

  useEffect(() => {
    if (isListening && recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Failed to start speech recognition', error);
      }
    } else if (!isListening && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Failed to stop speech recognition', error);
      }
    }
  }, [isListening]);

  return (
    <div className="flex items-center justify-center mt-4">
      <button
        onClick={toggleListening}
        className={`relative p-4 rounded-full transition-all duration-300 ${
          isListening 
            ? 'bg-buddy-accent/20 text-buddy-accent animate-pulse' 
            : 'bg-gray-800/60 text-gray-400 hover:bg-gray-700/80'
        }`}
        title={isListening ? "Stop listening" : "Start listening"}
      >
        <div className="relative z-10">
          {isListening ? <Mic className="w-6 h-6" /> : <MicOff className="w-6 h-6" />}
        </div>
        
        {isListening && (
          <div className="absolute inset-0 rounded-full border border-buddy-accent/50 animate-ping"></div>
        )}
      </button>
      
      <div className="ml-3 text-sm text-gray-400">
        {errorMessage ? (
          <span className="text-red-400">{errorMessage}</span>
        ) : isListening ? (
          'Listening...'
        ) : (
          'Click to speak'
        )}
      </div>
    </div>
  );
};

// Add TypeScript declaration for the Web Speech API 
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
