
import React from 'react';
import { Calendar, BookText } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';

export const ChatHeader = () => {
  const { state, toggleCalendarView, toggleNotesView } = useChatContext();
  const { showCalendar, showNotes } = state;
  
  return (
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
  );
};
