
import React, { useState, useRef, useEffect } from 'react';
import { Send, Loader2, Calendar, BookText } from 'lucide-react';
import { processCommand } from '../utils/taskProcessor';
import { speak, stopSpeaking, initSpeechSynthesis } from '../utils/speechSynthesis';
import { VoiceRecognition } from './VoiceRecognition';
import { useToast } from "@/hooks/use-toast";
import { learningSystem } from '@/utils/learningSystem';
import { calendarManager } from '@/utils/calendarManager';
import { noteManager } from '@/utils/noteManager';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatContainerProps {
  onProcessingStateChange?: (state: boolean) => void;
}

export const ChatContainer = ({ onProcessingStateChange }: ChatContainerProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    initSpeechSynthesis();
    
    if (!('speechSynthesis' in window)) {
      toast({
        title: "Speech Synthesis Unavailable",
        description: "Your browser doesn't support text-to-speech functionality.",
        variant: "destructive"
      });
    }
    
    // Initialize with a personalized welcome message
    const initialGreeting = learningSystem.getPersonalizedGreeting();
    setMessages([{
      id: '1',
      text: initialGreeting,
      sender: 'assistant',
      timestamp: new Date()
    }]);
  }, []);

  useEffect(() => {
    const smoothScroll = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };
    
    setTimeout(smoothScroll, 100);
  }, [messages]);

  const simulateTyping = async (text: string) => {
    const assistantMessage: Message = {
      id: Date.now().toString(),
      text: '',
      sender: 'assistant',
      timestamp: new Date(),
      isTyping: true
    };
    
    setMessages(prev => [...prev, assistantMessage]);
    
    const words = text.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      currentText += (i === 0 ? '' : ' ') + words[i];
      setMessages(prev => 
        prev.map(msg => 
          msg.id === assistantMessage.id 
            ? { ...msg, text: currentText } 
            : msg
        )
      );
      await new Promise(resolve => setTimeout(resolve, 50));
    }
    
    setMessages(prev => 
      prev.map(msg => 
        msg.id === assistantMessage.id 
          ? { ...msg, isTyping: false } 
          : msg
      )
    );
    
    return assistantMessage.id;
  };

  const handleSendMessage = async (text: string = input) => {
    if (!text.trim()) return;
    
    setInput('');
    setIsProcessing(true);
    if (onProcessingStateChange) onProcessingStateChange(true);
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text: text,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    try {
      const response = processCommand(text);
      const messageId = await simulateTyping(response.message);
      
      setIsProcessing(false);
      setIsSpeaking(true);
      
      speak(
        response.message,
        undefined,
        () => {
          setIsSpeaking(false);
          if (onProcessingStateChange) onProcessingStateChange(false);
        }
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process your request. Please try again.",
        variant: "destructive"
      });
      setIsProcessing(false);
      if (onProcessingStateChange) onProcessingStateChange(false);
    }
  };

  const handleSpeechResult = (text: string) => {
    if (text.trim()) {
      handleSendMessage(text);
      setIsListening(false);
    }
  };

  const toggleListening = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    }
    
    setIsListening(!isListening);
    
    if (!isListening) {
      toast({
        title: "Voice Recognition Active",
        description: "I'm listening... Speak clearly into your microphone.",
      });
    }
  };
  
  const toggleCalendarView = () => {
    setShowCalendar(!showCalendar);
    if (showNotes) setShowNotes(false);
  };
  
  const toggleNotesView = () => {
    setShowNotes(!showNotes);
    if (showCalendar) setShowCalendar(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-black/30 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden">
      <div className="p-2 bg-gray-900/70 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-sm font-medium text-gray-300">Conversation</h2>
        <div className="flex space-x-2">
          <button 
            onClick={toggleCalendarView}
            className={`p-1.5 rounded-md transition-colors ${
              showCalendar ? 'bg-buddy-neon/20 text-buddy-neon' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Calendar"
          >
            <Calendar className="w-4 h-4" />
          </button>
          <button 
            onClick={toggleNotesView}
            className={`p-1.5 rounded-md transition-colors ${
              showNotes ? 'bg-buddy-neon/20 text-buddy-neon' : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
            title="Notes"
          >
            <BookText className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="h-[40vh] overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-buddy-purple text-white'
                  : 'bg-gray-800 text-gray-200'
              }`}
            >
              <p>{message.text}
                {message.isTyping && (
                  <span className="inline-flex ml-2">
                    <span className="animate-pulse">.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.2s' }}>.</span>
                    <span className="animate-pulse" style={{ animationDelay: '0.4s' }}>.</span>
                  </span>
                )}
              </p>
              <span className="text-xs text-gray-400 mt-1 block">
                {message.timestamp.toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </span>
            </div>
          </div>
        ))}
        {isProcessing && !messages.some(m => m.isTyping) && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-white p-3 rounded-lg">
              <Loader2 className="w-5 h-5 animate-spin" />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {showCalendar && (
        <div className="border-t border-gray-800 bg-gray-900/80 p-4 max-h-[250px] overflow-y-auto">
          <h3 className="text-sm font-medium text-buddy-neon mb-2">Upcoming Events</h3>
          <CalendarPreview />
        </div>
      )}
      
      {showNotes && (
        <div className="border-t border-gray-800 bg-gray-900/80 p-4 max-h-[250px] overflow-y-auto">
          <h3 className="text-sm font-medium text-buddy-neon mb-2">Recent Notes</h3>
          <NotesPreview />
        </div>
      )}
      
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
            onClick={() => handleSendMessage()}
            className={`bg-buddy-neon hover:bg-buddy-neon/80 text-black p-2 rounded-r-md transition-colors ${
              isProcessing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isProcessing}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Calendar Preview Component
const CalendarPreview = () => {
  const events = calendarManager.getUpcomingEvents();
  
  if (events.length === 0) {
    return <div className="text-gray-400 text-sm italic">No upcoming events</div>;
  }
  
  return (
    <div className="space-y-2">
      {events.map(event => (
        <div key={event.id} className="bg-gray-800/60 p-2 rounded-md border border-gray-700 flex justify-between">
          <div>
            <div className="text-sm font-medium text-white">{event.title}</div>
            <div className="text-xs text-gray-400">
              {event.date.toLocaleDateString()} {event.time && `• ${event.time}`}
            </div>
          </div>
          <div className="flex items-center">
            <input 
              type="checkbox" 
              checked={event.isCompleted} 
              onChange={() => calendarManager.toggleEventCompletion(event.id)}
              className="rounded-sm bg-gray-700 border-gray-600 text-buddy-neon focus:ring-buddy-neon/50"
            />
          </div>
        </div>
      ))}
    </div>
  );
};

// Notes Preview Component
const NotesPreview = () => {
  const notes = noteManager.getNotes()
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 5);
  
  if (notes.length === 0) {
    return <div className="text-gray-400 text-sm italic">No notes yet</div>;
  }
  
  return (
    <div className="space-y-2">
      {notes.map(note => (
        <div key={note.id} className="bg-gray-800/60 p-2 rounded-md border border-gray-700">
          <div className="text-sm font-medium text-white">{note.title}</div>
          <div className="text-xs text-gray-300 line-clamp-2">{note.content}</div>
          <div className="flex gap-1 mt-1">
            {note.tags.map(tag => (
              <span key={tag} className="bg-buddy-purple/50 text-[10px] px-1.5 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
