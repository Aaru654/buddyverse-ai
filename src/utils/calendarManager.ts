
// Calendar management utilities
import { format, parse, isValid } from 'date-fns';

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  time?: string;
  description?: string;
  isCompleted?: boolean;
}

class CalendarManager {
  private storageKey = 'buddy_calendar_events';
  
  // Get all events
  getEvents(): CalendarEvent[] {
    const storedEvents = localStorage.getItem(this.storageKey);
    if (!storedEvents) return [];
    try {
      return JSON.parse(storedEvents, (key, value) => {
        if (key === 'date') return new Date(value);
        return value;
      });
    } catch (error) {
      console.error('Error parsing calendar events:', error);
      return [];
    }
  }
  
  // Add a new event
  addEvent(event: Omit<CalendarEvent, 'id'>): CalendarEvent {
    const events = this.getEvents();
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
      isCompleted: false
    };
    
    events.push(newEvent);
    this.saveEvents(events);
    return newEvent;
  }
  
  // Delete an event
  deleteEvent(id: string): boolean {
    const events = this.getEvents();
    const filteredEvents = events.filter(event => event.id !== id);
    
    if (filteredEvents.length < events.length) {
      this.saveEvents(filteredEvents);
      return true;
    }
    return false;
  }
  
  // Update an event
  updateEvent(updatedEvent: CalendarEvent): boolean {
    const events = this.getEvents();
    const index = events.findIndex(event => event.id === updatedEvent.id);
    
    if (index !== -1) {
      events[index] = updatedEvent;
      this.saveEvents(events);
      return true;
    }
    return false;
  }
  
  // Mark event as completed
  toggleEventCompletion(id: string): boolean {
    const events = this.getEvents();
    const event = events.find(e => e.id === id);
    
    if (event) {
      event.isCompleted = !event.isCompleted;
      this.saveEvents(events);
      return true;
    }
    return false;
  }
  
  // Get events for a specific date
  getEventsByDate(date: Date): CalendarEvent[] {
    const events = this.getEvents();
    const formattedTargetDate = format(date, 'yyyy-MM-dd');
    
    return events.filter(event => {
      const formattedEventDate = format(event.date, 'yyyy-MM-dd');
      return formattedEventDate === formattedTargetDate;
    });
  }
  
  // Get upcoming events (next 7 days)
  getUpcomingEvents(): CalendarEvent[] {
    const events = this.getEvents();
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate >= today && eventDate <= nextWeek;
    }).sort((a, b) => a.date.getTime() - b.date.getTime());
  }
  
  // Save events to localStorage
  private saveEvents(events: CalendarEvent[]): void {
    localStorage.setItem(this.storageKey, JSON.stringify(events));
  }
  
  // Parse date from natural language
  parseDate(text: string): Date | null {
    // Try to extract date from text using various patterns
    const datePatterns = [
      { regex: /today/i, parse: () => new Date() },
      { regex: /tomorrow/i, parse: () => { 
        const tomorrow = new Date(); 
        tomorrow.setDate(tomorrow.getDate() + 1); 
        return tomorrow; 
      }},
      { regex: /next (monday|tuesday|wednesday|thursday|friday|saturday|sunday)/i, parse: (match: RegExpMatchArray) => {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const targetDay = dayNames.indexOf(match[1].toLowerCase());
        const today = new Date();
        const currentDay = today.getDay();
        const daysUntilTarget = (targetDay + 7 - currentDay) % 7 || 7; // If today, then next week
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + daysUntilTarget);
        return targetDate;
      }},
      { regex: /(\d{1,2})[\/\-\.](\d{1,2})(?:[\/\-\.](\d{2,4}))?/, parse: (match: RegExpMatchArray) => {
        const day = parseInt(match[1]);
        const month = parseInt(match[2]) - 1;
        const year = match[3] ? parseInt(match[3]) : new Date().getFullYear();
        // Adjust two-digit years
        const fullYear = year < 100 ? (year < 50 ? 2000 + year : 1900 + year) : year;
        const date = new Date(fullYear, month, day);
        return isValid(date) ? date : null;
      }}
    ];
    
    for (const pattern of datePatterns) {
      const match = text.match(pattern.regex);
      if (match) {
        return pattern.parse(match);
      }
    }
    
    // Try standard date formats if no pattern matched
    const standardFormats = ['MM/dd/yyyy', 'MM-dd-yyyy', 'yyyy-MM-dd', 'dd MMM yyyy'];
    for (const formatStr of standardFormats) {
      try {
        const date = parse(text, formatStr, new Date());
        if (isValid(date)) return date;
      } catch (error) {
        // Parsing failed for this format, try next one
      }
    }
    
    return null;
  }
  
  // Extract event details from text
  extractEventFromText(text: string): Partial<CalendarEvent> | null {
    // Simple extraction of event title and date
    const eventRegex = /(?:add|create|schedule|set)(?:\s+an?)?\s+event(?:\s+called|\s+titled|\s+named|\s+for)?\s+"([^"]+)"(?:\s+on|\s+at|\s+for)?\s+(.+?)(?:\s+at\s+(\d{1,2}(?::\d{2})?(?:\s*[ap]m)?)|$)/i;
    const reminderRegex = /(?:remind me|set a reminder|add a reminder)(?:\s+to)?\s+(.+?)(?:\s+on|\s+at|\s+by)?\s+(.+?)(?:\s+at\s+(\d{1,2}(?::\d{2})?(?:\s*[ap]m)?)|$)/i;
    
    let match = text.match(eventRegex) || text.match(reminderRegex);
    if (!match) return null;
    
    const title = match[1];
    const dateText = match[2];
    const timeText = match[3];
    
    const date = this.parseDate(dateText);
    if (!date) return null;
    
    return {
      title,
      date,
      time: timeText,
      description: `Created from: "${text}"`
    };
  }
}

export const calendarManager = new CalendarManager();
