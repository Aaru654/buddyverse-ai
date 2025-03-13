
import React from 'react';
import { CalendarPreview } from './CalendarPreview';
import { NotesPreview } from './NotesPreview';

interface SidePanelProps {
  showCalendar: boolean;
  showNotes: boolean;
}

export const SidePanel = ({ showCalendar, showNotes }: SidePanelProps) => {
  if (!showCalendar && !showNotes) return null;
  
  return (
    <>
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
    </>
  );
};
