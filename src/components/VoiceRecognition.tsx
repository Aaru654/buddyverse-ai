
import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Waves } from 'lucide-react';
import { cn } from '@/lib/utils';

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
  const [audioLevel, setAudioLevel] = useState(0);
  const recognitionRef = useRef<any | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setErrorMessage("Speech recognition is not supported in your browser.");
      return;
    }

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
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [onSpeechResult, toggleListening]);

  // Set up audio visualization
  useEffect(() => {
    if (isListening) {
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
          const audioContext = new AudioContext();
          const source = audioContext.createMediaStreamSource(stream);
          const analyser = audioContext.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);
          analyserRef.current = analyser;

          const updateAudioLevel = () => {
            const dataArray = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            setAudioLevel(average / 128); // Normalize to 0-1
            animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
          };

          updateAudioLevel();
        })
        .catch(err => console.error('Error accessing microphone:', err));
    }
  }, [isListening]);

  return (
    <div className="flex items-center justify-center mt-4 relative">
      <button
        onClick={toggleListening}
        className={cn(
          "relative p-6 rounded-full transition-all duration-300",
          isListening 
            ? "bg-buddy-accent/20 text-buddy-accent" 
            : "bg-gray-800/60 text-gray-400 hover:bg-gray-700/80"
        )}
        title={isListening ? "Stop listening" : "Start listening"}
      >
        <div className="relative z-10">
          {isListening ? (
            <div className="relative">
              <Waves 
                className={cn(
                  "w-6 h-6 absolute top-0 left-0 transition-opacity",
                  audioLevel > 0.3 ? "opacity-100" : "opacity-30"
                )} 
              />
              <Mic className="w-6 h-6" />
            </div>
          ) : (
            <MicOff className="w-6 h-6" />
          )}
        </div>
        
        {isListening && (
          <>
            <div className="absolute inset-0 rounded-full border border-buddy-accent/50 animate-ping"></div>
            <div 
              className="absolute inset-0 rounded-full bg-buddy-accent/10"
              style={{
                transform: `scale(${1 + audioLevel * 0.5})`,
                transition: 'transform 0.1s ease-out'
              }}
            ></div>
          </>
        )}
      </button>
      
      <div className="ml-3 text-sm text-gray-400">
        {errorMessage ? (
          <span className="text-red-400">{errorMessage}</span>
        ) : isListening ? (
          <span className="animate-pulse">Listening...</span>
        ) : (
          'Click to speak'
        )}
      </div>
    </div>
  );
};

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
