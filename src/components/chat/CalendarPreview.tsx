
import React from 'react';
import { calendarManager } from '@/utils/calendarManager';

export const CalendarPreview = () => {
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
