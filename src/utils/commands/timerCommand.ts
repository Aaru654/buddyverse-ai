
import { TaskResponse } from '../types/taskTypes';

export const handleTimerCommand = (text: string): TaskResponse => {
  // Extract time information
  const timeRegex = /(\d+)\s*(second|minute|hour|day)s?/i;
  const timeMatch = text.match(timeRegex);
  
  if (timeMatch) {
    const amount = parseInt(timeMatch[1]);
    const unit = timeMatch[2].toLowerCase();
    return {
      message: `I've set a timer for ${amount} ${unit}${amount !== 1 ? 's' : ''}. In a full implementation, I would use the notification API to alert you when the time is up.`,
      success: true,
      data: { amount, unit }
    };
  }
  
  return {
    message: `I can set timers and reminders for you. Try saying "Set a timer for 5 minutes" or "Remind me to check the oven in 20 minutes".`,
    success: true
  };
};
