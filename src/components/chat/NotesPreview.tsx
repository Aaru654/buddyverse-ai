
import React from 'react';
import { noteManager } from '@/utils/noteManager';

export const NotesPreview = () => {
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
