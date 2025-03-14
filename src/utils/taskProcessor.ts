
// Enhanced task processor with more sophisticated command handling
import { calendarManager } from './calendarManager';
import { noteManager } from './noteManager';
import { learningSystem } from './learningSystem';
import { TaskType, TaskResponse, CommandPatterns } from './types/taskTypes';

// Import all command handlers
import { handleAppCommand } from './commands/appCommand';
import { handleFileCommand } from './commands/fileCommand';
import { handleSearchCommand } from './commands/searchCommand';
import { handleNoteCommand } from './commands/noteCommand';
import { handleMusicCommand } from './commands/musicCommand';
import { handleTimerCommand } from './commands/timerCommand';
import { handleChatCommand } from './commands/chatCommand';
import { handleWeatherCommand } from './commands/weatherCommand';
import { handleCalculation } from './commands/calculationCommand';
import { handleCalendarCommand } from './commands/calendarCommand';
import { handleLearningCommand } from './commands/learningCommand';

// Process commands based on intent recognition
export const processCommand = async (text: string): Promise<TaskResponse> => {
  const lowerText = text.toLowerCase().trim();
  
  // Log the interaction for learning
  const logInteractionAfterResponse = (response: TaskResponse) => {
    learningSystem.logInteraction(text, response.message);
    return response;
  };
  
  // Enhanced intent matching patterns
  const patterns: CommandPatterns = {
    app: /open|launch|start|run\s+(\w+)/i,
    file: /file|folder|document|create|delete|rename|list|show/i,
    search: /search|find|look for|google|search for/i,
    note: /note|write down|remember|save|take a note|remind me about/i,
    music: /play|pause|stop|music|song|volume|turn up|turn down/i,
    timer: /timer|remind|alert|alarm|set a timer|set a reminder/i,
    weather: /weather|temperature|forecast|rain|sunny/i,
    calculation: /calculate|compute|what is|how much is|math|sum of|add|subtract|multiply|divide/i,
    calendar: /calendar|schedule|event|appointment|meeting|add event|create event|plan/i,
    learning: /remember|learn|forget|my name|i am|i like|i love|call me/i
  };
  
  // First check if it's a calendar event request
  const eventDetails = calendarManager.extractEventFromText(text);
  if (eventDetails && eventDetails.title && eventDetails.date) {
    return logInteractionAfterResponse(handleCalendarCommand(text, eventDetails));
  }
  
  // Check if it's a note-taking request
  const noteDetails = noteManager.extractNoteFromText(text);
  if (noteDetails && noteDetails.content) {
    return logInteractionAfterResponse(handleNoteCommand(text, noteDetails));
  }
  
  // Determine the task type based on the command
  let taskType: TaskType = 'chat';
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(lowerText)) {
      taskType = type as TaskType;
      break;
    }
  }
  
  // Process calculations right away if detected
  if (taskType === 'calculation') {
    const result = handleCalculation(lowerText);
    if (result.success) return logInteractionAfterResponse(result);
  }
  
  // Process based on task type
  let response: TaskResponse;
  try {
    switch (taskType) {
      case 'app':
        response = await handleAppCommand(lowerText);
        break;
      case 'file':
        response = await handleFileCommand(lowerText);
        break;
      case 'note':
        response = handleNoteCommand(lowerText);
        break;
      case 'music':
        response = handleMusicCommand(lowerText);
        break;
      case 'search':
        response = handleSearchCommand(lowerText);
        break;
      case 'timer':
        response = handleTimerCommand(lowerText);
        break;
      case 'weather':
        response = handleWeatherCommand(lowerText);
        break;
      case 'calendar':
        response = handleCalendarCommand(lowerText);
        break;
      case 'learning':
        response = handleLearningCommand(lowerText);
        break;
      case 'calculation':
        // If we get here, the standard calculation handling failed
        response = {
          message: "I couldn't perform that calculation. Could you rephrase it?",
          success: false
        };
        break;
      case 'chat':
      default:
        response = handleChatCommand(lowerText);
        break;
    }
  } catch (error) {
    response = {
      message: `I encountered an error: ${error.message || error}`,
      success: false
    };
  }
  
  return logInteractionAfterResponse(response);
};
