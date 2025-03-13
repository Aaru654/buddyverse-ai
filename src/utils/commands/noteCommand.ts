
import { TaskResponse } from '../types/taskTypes';
import { noteManager, Note } from '../noteManager';

export const handleNoteCommand = (text: string, noteDetails?: Partial<Note>): TaskResponse => {
  if (noteDetails && noteDetails.content) {
    const note = noteManager.addNote(noteDetails as any);
    return {
      message: `I've saved your note: "${note.content.substring(0, 100)}${note.content.length > 100 ? '...' : ''}"`,
      success: true,
      data: { note }
    };
  }
  
  if (text.match(/show( me)? my notes/i)) {
    const notes = noteManager.getNotes();
    if (notes.length === 0) {
      return {
        message: "You don't have any saved notes yet.",
        success: true
      };
    }
    
    // Show recent notes
    const recentNotes = notes
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .slice(0, 3);
    
    const noteList = recentNotes.map(n => `- ${n.title} (${n.updatedAt.toLocaleDateString()})`).join('\n');
    
    return {
      message: `Here are your most recent notes:\n${noteList}\n\nYou have ${notes.length} notes in total.`,
      success: true,
      data: { recentNotes }
    };
  }
  
  if (text.match(/search notes for (.*)/i)) {
    const match = text.match(/search notes for (.*)/i);
    const query = match ? match[1] : '';
    
    if (query) {
      const results = noteManager.searchNotes(query);
      if (results.length === 0) {
        return {
          message: `I couldn't find any notes matching "${query}".`,
          success: true
        };
      }
      
      const noteList = results.map(n => `- ${n.title} (${n.updatedAt.toLocaleDateString()})`).join('\n');
      return {
        message: `Found ${results.length} note${results.length > 1 ? 's' : ''} matching "${query}":\n${noteList}`,
        success: true,
        data: { results }
      };
    }
  }
  
  return {
    message: `I can help you take and manage notes. Try saying "Take a note: Remember to buy groceries" or "Show me my notes".`,
    success: true
  };
};
