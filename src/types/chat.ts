
import { Message } from '../components/chat/MessageList';

export interface ChatState {
  messages: Message[];
  isProcessing: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  showCalendar: boolean;
  showNotes: boolean;
}

export interface ChatContextType {
  state: ChatState;
  sendMessage: (text: string) => Promise<void>;
  toggleListening: () => void;
  handleSpeechResult: (text: string) => void;
  toggleCalendarView: () => void;
  toggleNotesView: () => void;
}
