
import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { processCommand } from '../utils/taskProcessor';
import { speak, stopSpeaking, initSpeechSynthesis } from '../utils/speechSynthesis';
import { useToast } from "@/hooks/use-toast";
import { learningSystem } from '@/utils/learningSystem';
import { Message } from '../components/chat/MessageList';

// Define the state shape
interface ChatState {
  messages: Message[];
  isProcessing: boolean;
  isListening: boolean;
  isSpeaking: boolean;
  showCalendar: boolean;
  showNotes: boolean;
}

// Define the actions
type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_PROCESSING'; payload: boolean }
  | { type: 'SET_LISTENING'; payload: boolean }
  | { type: 'SET_SPEAKING'; payload: boolean }
  | { type: 'TOGGLE_CALENDAR' }
  | { type: 'TOGGLE_NOTES' }
  | { type: 'UPDATE_MESSAGE'; payload: { id: string; updates: Partial<Message> } };

// Create the initial state
const initialState: ChatState = {
  messages: [{
    id: '1',
    text: '',  // Will be set with personalized greeting
    sender: 'assistant',
    timestamp: new Date()
  }],
  isProcessing: false,
  isListening: false,
  isSpeaking: false,
  showCalendar: false,
  showNotes: false,
};

// Create the reducer
const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    case 'UPDATE_MESSAGE':
      return {
        ...state,
        messages: state.messages.map(msg =>
          msg.id === action.payload.id ? { ...msg, ...action.payload.updates } : msg
        ),
      };
    case 'SET_PROCESSING':
      return {
        ...state,
        isProcessing: action.payload,
      };
    case 'SET_LISTENING':
      return {
        ...state,
        isListening: action.payload,
      };
    case 'SET_SPEAKING':
      return {
        ...state,
        isSpeaking: action.payload,
      };
    case 'TOGGLE_CALENDAR':
      return {
        ...state,
        showCalendar: !state.showCalendar,
        showNotes: state.showCalendar ? state.showNotes : false,
      };
    case 'TOGGLE_NOTES':
      return {
        ...state,
        showNotes: !state.showNotes,
        showCalendar: state.showNotes ? state.showCalendar : false,
      };
    default:
      return state;
  }
};

// Create the context
type ChatContextType = {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (text: string) => Promise<void>;
  toggleListening: () => void;
  handleSpeechResult: (text: string) => void;
  toggleCalendarView: () => void;
  toggleNotesView: () => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Create the provider component
export const ChatProvider: React.FC<{ children: ReactNode; onProcessingStateChange?: (state: boolean) => void }> = ({ 
  children, 
  onProcessingStateChange 
}) => {
  const [state, dispatch] = useReducer(chatReducer, initialState);
  const { toast } = useToast();

  useEffect(() => {
    initSpeechSynthesis();
    
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech Synthesis Unavailable",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
    }
    
    // Set the initial personalized greeting
    const initialGreeting = learningSystem.getPersonalizedGreeting();
    dispatch({ 
      type: 'UPDATE_MESSAGE', 
      payload: { 
        id: '1', 
        updates: { text: initialGreeting } 
      } 
    });
  }, []);

  // Effect to notify parent component about processing state changes
  useEffect(() => {
    if (onProcessingStateChange) {
      onProcessingStateChange(state.isProcessing);
    }
  }, [state.isProcessing, onProcessingStateChange]);

  const simulateTyping = async (text: string) => {
    const assistantMessage: Message = {
      id: Date.now().toString(),
      text: '',
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: assistantMessage });
    
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      dispatch({ 
        type: 'UPDATE_MESSAGE', 
        payload: { 
          id: assistantMessage.id, 
          updates: { text: currentText } 
        } 
      });
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    dispatch({ 
      type: 'UPDATE_MESSAGE', 
      payload: { 
        id: assistantMessage.id, 
        updates: { isTyping: false } 
      } 
    });
    
    return assistantMessage.id;
  };

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;
    
    dispatch({ type: 'SET_PROCESSING', payload: true });
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    dispatch({ type: 'ADD_MESSAGE', payload: userMessage });
    
    try {
      const response = processCommand(text);
      const messageId = await simulateTyping(response.message);
      
      dispatch({ type: 'SET_PROCESSING', payload: false });
      dispatch({ type: 'SET_SPEAKING', payload: true });
      
      speak(
        response.message,
        undefined,
        () => {
          dispatch({ type: 'SET_SPEAKING', payload: false });
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
      dispatch({ type: 'SET_PROCESSING', payload: false });
    }
  };

  const toggleListening = () => {
    if (state.isSpeaking) {
      stopSpeaking();
      dispatch({ type: 'SET_SPEAKING', payload: false });
    }
    
    const newListeningState = !state.isListening;
    dispatch({ type: 'SET_LISTENING', payload: newListeningState });
    
    if (newListeningState) {
      toast({
        title: "Voice Recognition Active",
        description: "I'm listening... Speak clearly into your microphone.",
      });
    }
  };

  const handleSpeechResult = (text: string) => {
    if (text.trim()) {
      sendMessage(text);
      dispatch({ type: 'SET_LISTENING', payload: false });
    }
  };
  
  const toggleCalendarView = () => {
    dispatch({ type: 'TOGGLE_CALENDAR' });
  };
  
  const toggleNotesView = () => {
    dispatch({ type: 'TOGGLE_NOTES' });
  };

  return (
    <ChatContext.Provider value={{ 
      state, 
      dispatch, 
      sendMessage, 
      toggleListening, 
      handleSpeechResult,
      toggleCalendarView,
      toggleNotesView 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

// Create a hook to use the chat context
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChatContext must be used within a ChatProvider');
  }
  return context;
};
