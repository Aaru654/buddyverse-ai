
// Note-taking utilities
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  source?: string;
}

class NoteManager {
  private storageKey = 'buddy_notes';
  
  // Get all notes
  getNotes(): Note[] {
    const storedNotes = localStorage.getItem(this.storageKey);
    if (!storedNotes) return [];
    try {
      return JSON.parse(storedNotes, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt') return new Date(value);
        return value;
      });
    } catch (error) {
      console.error('Error parsing notes:', error);
      return [];
    }
  }
  
  // Add a new note
  addNote(note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>): Note {
    const notes = this.getNotes();
    const timestamp = new Date();
    
    const newNote: Note = {
      ...note,
      id: Date.now().toString(),
      createdAt: timestamp,
      updatedAt: timestamp,
      tags: note.tags || []
    };
    
    notes.push(newNote);
    this.saveNotes(notes);
    return newNote;
  }
  
  // Delete a note
  deleteNote(id: string): boolean {
    const notes = this.getNotes();
    const filteredNotes = notes.filter(note => note.id !== id);
    
    if (filteredNotes.length < notes.length) {
      this.saveNotes(filteredNotes);
      return true;
    }
    return false;
  }
  
  // Update a note
  updateNote(id: string, updates: Partial<Omit<Note, 'id' | 'createdAt' | 'updatedAt'>>): boolean {
    const notes = this.getNotes();
    const index = notes.findIndex(note => note.id === id);
    
    if (index !== -1) {
      notes[index] = {
        ...notes[index],
        ...updates,
        updatedAt: new Date()
      };
      this.saveNotes(notes);
      return true;
    }
    return false;
  }
  
  // Search notes
  searchNotes(query: string): Note[] {
    const notes = this.getNotes();
    const lowerQuery = query.toLowerCase();
    
    return notes.filter(note => 
      note.title.toLowerCase().includes(lowerQuery) || 
      note.content.toLowerCase().includes(lowerQuery) ||
      note.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }
  
  // Get notes by tag
  getNotesByTag(tag: string): Note[] {
    const notes = this.getNotes();
    return notes.filter(note => 
      note.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }
  
  // Save notes to localStorage
  private saveNotes(notes: Note[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(notes));
  }
  
  // Process text to extract note content
  extractNoteFromText(text: string): Partial<Note> | null {
    // Check if the text is a note command
    const noteRegex = /(?:take|make|create|add)(?:\s+a)?\s+note(?:\s+about|\s+on)?\s+(?:"([^"]+)"|(.*))$/i;
    const match = text.match(noteRegex);
    
    if (!match) return null;
    
    const content = match[1] || match[2];
    if (!content) return null;
    
    // Extract tags with hashtag format
    const tagRegex = /#(\w+)/g;
    const tags: string[] = [];
    let tagMatch;
    
    while ((tagMatch = tagRegex.exec(content)) !== null) {
      tags.push(tagMatch[1]);
    }
    
    // Create a title from the first 30 chars of content
    const title = content.replace(/#\w+/g, '').trim().slice(0, 30) + (content.length > 30 ? '...' : '');
    
    return {
      title,
      content,
      tags
    };
  }
}

export const noteManager = new NoteManager();
