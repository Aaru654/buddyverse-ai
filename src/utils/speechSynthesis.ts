
// Wrapper for browser's SpeechSynthesis API to simulate offline TTS

let voices: SpeechSynthesisVoice[] = [];

// Initialize voices
export const initSpeechSynthesis = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      resolve();
      return;
    }
    
    // If voices are already loaded
    if (window.speechSynthesis.getVoices().length > 0) {
      voices = window.speechSynthesis.getVoices();
      resolve();
      return;
    }

    // Wait for voices to be loaded
    window.speechSynthesis.onvoiceschanged = () => {
      voices = window.speechSynthesis.getVoices();
      resolve();
    };
  });
};

// Get the best voice for our assistant
export const getBuddyVoice = (): SpeechSynthesisVoice | null => {
  if (voices.length === 0) return null;
  
  // Prefer a female voice with high quality if available
  const preferredVoices = voices.filter(
    voice => voice.lang.includes('en') && voice.localService
  );
  
  if (preferredVoices.length > 0) {
    return preferredVoices[0];
  }
  
  return voices[0];
};

export const speak = (text: string, onStart?: () => void, onEnd?: () => void): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) {
    console.error('Speech synthesis not supported');
    return;
  }
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  const voice = getBuddyVoice();
  
  if (voice) {
    utterance.voice = voice;
  }
  
  utterance.rate = 1.0;
  utterance.pitch = 1.0;
  utterance.volume = 1.0;
  
  if (onStart) utterance.onstart = onStart;
  if (onEnd) utterance.onend = onEnd;
  
  window.speechSynthesis.speak(utterance);
};

export const stopSpeaking = (): void => {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  window.speechSynthesis.cancel();
};
