
import { TaskResponse } from '../types/taskTypes';
import { calendarManager, CalendarEvent } from '../calendarManager';

export const handleCalendarCommand = (text: string, eventDetails?: Partial<CalendarEvent>): TaskResponse => {
  // Add event if details were successfully extracted
  if (eventDetails && eventDetails.title && eventDetails.date) {
    const event = calendarManager.addEvent(eventDetails as Omit<CalendarEvent, 'id'>);
    return {
      message: `I've added "${event.title}" to your calendar for ${event.date.toLocaleDateString()} ${event.time ? `at ${event.time}` : ''}.`,
      success: true,
      data: { event }
    };
  }
  
  // Handle other calendar commands
  if (text.match(/what('s| is) (on )?my calendar today/i)) {
    const events = calendarManager.getEventsByDate(new Date());
    if (events.length === 0) {
      return {
        message: "You don't have any events scheduled for today.",
        success: true
      };
    }
    
    const eventList = events.map(e => `- ${e.title} ${e.time ? `at ${e.time}` : ''}`).join('\n');
    return {
      message: `Here's your schedule for today:\n${eventList}`,
      success: true,
      data: { events }
    };
  }
  
  if (text.match(/upcoming events|what('s| is) coming up/i)) {
    const events = calendarManager.getUpcomingEvents();
    if (events.length === 0) {
      return {
        message: "You don't have any upcoming events in the next 7 days.",
        success: true
      };
    }
    
    const eventList = events.map(e => 
      `- ${e.title} on ${e.date.toLocaleDateString()} ${e.time ? `at ${e.time}` : ''}`
    ).join('\n');
    
    return {
      message: `Here are your upcoming events for the next 7 days:\n${eventList}`,
      success: true,
      data: { events }
    };
  }
  
  return {
    message: "I can help manage your calendar. Try saying 'Add an event called \"Team Meeting\" on Friday at 2pm' or 'What's on my calendar today?'",
    success: true
  };
};
