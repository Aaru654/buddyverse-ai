
import { Note } from '../noteManager';
import { CalendarEvent } from '../calendarManager';

export type TaskType = 'app' | 'file' | 'search' | 'note' | 'music' | 'timer' | 'chat' | 'weather' | 'calculation' | 'calendar' | 'learning';

export interface TaskResponse {
  message: string;
  success: boolean;
  data?: any;
}

export interface CommandPatterns {
  [key: string]: RegExp;
}
