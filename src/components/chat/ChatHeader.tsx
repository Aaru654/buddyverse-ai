
import React from 'react';
import { Calendar, BookText, ChevronDown } from 'lucide-react';
import { useChatContext } from '@/contexts/ChatContext';

export const ChatHeader = () => {
  const { state, toggleCalendarView, toggleNotesView } = useChatContext();
  const { showCalendar, showNotes } = state;
  
  return (
    <div className="p-3 bg-gray-900/90 border-b border-gray-800 flex justify-between items-center">
      <div className="flex items-center">
        <div className="h-3 w-3 rounded-full bg-buddy-neon mr-2 animate-pulse"></div>
        <h2 className="text-xs font-medium text-gray-300">BUDDY CALL</h2>
      </div>
      
      <div className="flex space-x-3">
        <button 
          onClick={toggleCalendarView}
          className={`p-1.5 rounded-md transition-colors ${
            showCalendar ? 'bg-buddy-neon/20 text-buddy-neon' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          title="Calendar"
        >
          <Calendar className="w-3.5 h-3.5" />
        </button>
        <button 
          onClick={toggleNotesView}
          className={`p-1.5 rounded-md transition-colors ${
            showNotes ? 'bg-buddy-neon/20 text-buddy-neon' : 'text-gray-400 hover:text-white hover:bg-gray-800'
          }`}
          title="Notes"
        >
          <BookText className="w-3.5 h-3.5" />
        </button>
        <button className="text-gray-400 p-1.5 rounded-md hover:text-white hover:bg-gray-800">
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
