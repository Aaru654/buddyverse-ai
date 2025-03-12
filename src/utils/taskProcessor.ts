
// Simple task processor to handle different types of commands

type TaskType = 'app' | 'file' | 'search' | 'note' | 'music' | 'timer' | 'chat';

interface TaskResponse {
  message: string;
  success: boolean;
  data?: any;
}

// Process commands based on intent recognition
export const processCommand = (text: string): TaskResponse => {
  const lowerText = text.toLowerCase();
  
  // Simple intent matching patterns
  const patterns = {
    app: /open|launch|start|run\s+(\w+)/i,
    file: /file|folder|document|create|delete|rename/i,
    search: /search|find|look for/i,
    note: /note|write down|remember|save/i,
    music: /play|pause|stop|music|song|volume/i,
    timer: /timer|remind|alert|alarm/i,
  };
  
  // Determine the task type based on the command
  let taskType: TaskType = 'chat';
  for (const [type, pattern] of Object.entries(patterns)) {
    if (pattern.test(lowerText)) {
      taskType = type as TaskType;
      break;
    }
  }
  
  // Process based on task type (in a real app, these would be handled by specific modules)
  switch (taskType) {
    case 'app':
      return handleAppCommand(lowerText);
    case 'file':
      return handleFileCommand(lowerText);
    case 'note':
      return handleNoteCommand(lowerText);
    case 'music':
      return handleMusicCommand(lowerText);
    case 'search':
      return handleSearchCommand(lowerText);
    case 'timer':
      return handleTimerCommand(lowerText);
    case 'chat':
    default:
      return handleChatCommand(lowerText);
  }
};

// Mock handlers for different command types
function handleAppCommand(text: string): TaskResponse {
  // In a real implementation, this would use the OS API to open applications
  const appMatch = text.match(/open\s+(\w+)/i);
  const appName = appMatch ? appMatch[1] : 'the app';
  
  return {
    message: `I would open ${appName} for you, but this is a demo. In a real implementation, I would use system APIs to launch the application.`,
    success: true,
    data: { appName }
  };
}

function handleFileCommand(text: string): TaskResponse {
  return {
    message: `I can help with file operations in a full implementation. This would use the File System Access API or similar APIs for file operations.`,
    success: true
  };
}

function handleNoteCommand(text: string): TaskResponse {
  // Extract the note content after keywords like "note" or "remember"
  const noteMatch = text.match(/note|write down|remember|save\s*:?\s*(.*)/i);
  const noteContent = noteMatch ? noteMatch[1] : '';
  
  if (noteContent) {
    return {
      message: `I've saved your note: "${noteContent}". In a full implementation, this would be saved to local storage or a file.`,
      success: true,
      data: { note: noteContent }
    };
  }
  
  return {
    message: `What would you like me to note down?`,
    success: false
  };
}

function handleMusicCommand(text: string): TaskResponse {
  if (text.includes('play')) {
    return {
      message: `Playing music from your local library. In a full implementation, this would access your music files.`,
      success: true
    };
  } else if (text.includes('pause') || text.includes('stop')) {
    return {
      message: `Music paused.`,
      success: true
    };
  }
  
  return {
    message: `I can control your music playback in a full implementation.`,
    success: true
  };
}

function handleSearchCommand(text: string): TaskResponse {
  const searchQuery = text.replace(/search|find|look for/i, '').trim();
  
  return {
    message: `Searching for "${searchQuery}". In a full implementation, this would search your local files and knowledge base.`,
    success: true,
    data: { query: searchQuery }
  };
}

function handleTimerCommand(text: string): TaskResponse {
  return {
    message: `I can set timers and reminders in a full implementation. This would use the local notification API.`,
    success: true
  };
}

function handleChatCommand(text: string): TaskResponse {
  // Simple responses for common chat queries
  if (text.includes('hello') || text.includes('hi')) {
    return {
      message: 'Hello! How can I help you today?',
      success: true
    };
  } else if (text.includes('how are you')) {
    return {
      message: 'I\'m functioning perfectly! How are you doing?',
      success: true
    };
  } else if (text.includes('joke')) {
    const jokes = [
      'Why do programmers prefer dark mode? Because light attracts bugs!',
      'Why did the AI go to therapy? It had too many deep learning issues!',
      'I asked the computer to solve a problem, but it said "That\'s not in my domain."'
    ];
    return {
      message: jokes[Math.floor(Math.random() * jokes.length)],
      success: true
    };
  } else if (text.includes('time')) {
    return {
      message: `The current time is ${new Date().toLocaleTimeString()}.`,
      success: true
    };
  } else if (text.includes('date')) {
    return {
      message: `Today is ${new Date().toLocaleDateString()}.`,
      success: true
    };
  }
  
  return {
    message: "I'm here to help with various tasks. You can ask me to open apps, manage files, take notes, play music, search for information, or just chat!",
    success: true
  };
}
