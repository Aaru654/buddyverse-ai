
// Enhanced task processor with more sophisticated command handling

type TaskType = 'app' | 'file' | 'search' | 'note' | 'music' | 'timer' | 'chat' | 'weather' | 'calculation';

interface TaskResponse {
  message: string;
  success: boolean;
  data?: any;
}

// Process commands based on intent recognition
export const processCommand = (text: string): TaskResponse => {
  const lowerText = text.toLowerCase().trim();
  
  // Enhanced intent matching patterns
  const patterns = {
    app: /open|launch|start|run\s+(\w+)/i,
    file: /file|folder|document|create|delete|rename/i,
    search: /search|find|look for|google|search for/i,
    note: /note|write down|remember|save|take a note|remind me about/i,
    music: /play|pause|stop|music|song|volume|turn up|turn down/i,
    timer: /timer|remind|alert|alarm|set a timer|set a reminder/i,
    weather: /weather|temperature|forecast|rain|sunny/i,
    calculation: /calculate|compute|what is|how much is|math|sum of|add|subtract|multiply|divide/i
  };
  
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
    if (result.success) return result;
  }
  
  // Process based on task type
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
    case 'weather':
      return handleWeatherCommand(lowerText);
    case 'calculation':
      // If we get here, the standard calculation handling failed
      return {
        message: "I couldn't perform that calculation. Could you rephrase it?",
        success: false
      };
    case 'chat':
    default:
      return handleChatCommand(lowerText);
  }
};

// Enhanced app handler with more detailed responses
function handleAppCommand(text: string): TaskResponse {
  const appMatches = [
    { regex: /open\s+(browser|chrome|firefox|edge|safari)/i, app: 'browser' },
    { regex: /open\s+(mail|email|outlook|gmail)/i, app: 'email' },
    { regex: /open\s+(word|document|docs)/i, app: 'word processor' },
    { regex: /open\s+(excel|spreadsheet|sheets)/i, app: 'spreadsheet' },
    { regex: /open\s+(powerpoint|presentation|slides)/i, app: 'presentation' },
    { regex: /open\s+(calendar|schedule)/i, app: 'calendar' },
    { regex: /open\s+(terminal|command|prompt|console)/i, app: 'terminal' },
    { regex: /open\s+(settings|preferences|control panel)/i, app: 'settings' },
    { regex: /open\s+(calculator)/i, app: 'calculator' },
    { regex: /open\s+(camera)/i, app: 'camera' },
    { regex: /open\s+(photos|gallery|images)/i, app: 'photos' },
    { regex: /open\s+(video|movies|player)/i, app: 'video player' },
  ];
  
  // Try to match with specific apps
  for (const match of appMatches) {
    if (match.regex.test(text)) {
      return {
        message: `I would open the ${match.app} for you if this were a full implementation. In a native app, I would use system APIs to launch this application.`,
        success: true,
        data: { appName: match.app }
      };
    }
  }
  
  // Generic app match as fallback
  const appMatch = text.match(/open\s+(\w+)/i);
  const appName = appMatch ? appMatch[1] : 'the app';
  
  return {
    message: `I would open ${appName} for you, but I'm currently running in a web browser. In a native implementation, I would use system APIs to launch applications.`,
    success: true,
    data: { appName }
  };
}

function handleFileCommand(text: string): TaskResponse {
  if (text.includes('create') || text.includes('new')) {
    return {
      message: `I would create a new file or folder for you. In a full implementation, I would use the File System Access API or system-level APIs for this operation.`,
      success: true
    };
  } else if (text.includes('delete') || text.includes('remove')) {
    return {
      message: `I would delete the specified file or folder for you. In a full implementation, this would use secure file system operations.`,
      success: true
    };
  } else if (text.includes('rename')) {
    return {
      message: `I would rename your file or folder. In a full implementation, this would use file system APIs to safely rename files.`,
      success: true
    };
  } else if (text.includes('open')) {
    return {
      message: `I would open the file or folder for you. In a full implementation, I would access your file system to open the requested item.`,
      success: true
    };
  }
  
  return {
    message: `I can help with file operations like creating, opening, renaming, or deleting files in a full implementation. Currently, I'm running in a web browser with limited file system access.`,
    success: true
  };
}

function handleNoteCommand(text: string): TaskResponse {
  // Extract the note content after keywords
  const noteRegex = /(note|write down|remember|save|take a note|remind me about)[:\s]+(.*)/i;
  const noteMatch = text.match(noteRegex);
  const noteContent = noteMatch ? noteMatch[2].trim() : '';
  
  if (noteContent) {
    const timestamp = new Date().toLocaleString();
    return {
      message: `I've saved your note: "${noteContent}" (created at ${timestamp}). In a full implementation, this would be saved to your local storage or a file.`,
      success: true,
      data: { note: noteContent, timestamp }
    };
  }
  
  return {
    message: `I can save notes for you. Just say something like "Take a note: remember to call John tomorrow" or "Remember that my meeting is at 3 PM."`,
    success: false
  };
}

function handleMusicCommand(text: string): TaskResponse {
  if (text.includes('play')) {
    const songMatch = text.match(/play\s+(.*)/i);
    const songRequest = songMatch ? songMatch[1].trim() : 'music';
    
    return {
      message: `I would play ${songRequest} from your local library. In a full implementation, I would access your music files and play the requested content.`,
      success: true,
      data: { request: songRequest }
    };
  } else if (text.includes('pause') || text.includes('stop')) {
    return {
      message: `Music paused. In a full implementation, I would control your media playback.`,
      success: true
    };
  } else if (text.includes('volume up') || text.includes('turn up')) {
    return {
      message: `I've increased the volume. In a full implementation, I would adjust your system volume.`,
      success: true
    };
  } else if (text.includes('volume down') || text.includes('turn down')) {
    return {
      message: `I've decreased the volume. In a full implementation, I would adjust your system volume.`,
      success: true
    };
  }
  
  return {
    message: `I can control your music playback in a full implementation. Try saying "Play some rock music", "Pause the music", or "Turn up the volume".`,
    success: true
  };
}

function handleSearchCommand(text: string): TaskResponse {
  // Extract search query more precisely
  const searchRegex = /(search|find|look for|google|search for)[:\s]+(.*)/i;
  const searchMatch = text.match(searchRegex);
  const searchQuery = searchMatch ? searchMatch[2].trim() : text.replace(/search|find|look for|google/i, '').trim();
  
  if (searchQuery) {
    return {
      message: `I would search for "${searchQuery}". In a full implementation, I would search your local files, knowledge base, or help you search the web safely.`,
      success: true,
      data: { query: searchQuery }
    };
  }
  
  return {
    message: `I can help you search for information. Try saying "Search for recent documents" or "Find information about quantum physics".`,
    success: true
  };
}

function handleTimerCommand(text: string): TaskResponse {
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
}

function handleWeatherCommand(text: string): TaskResponse {
  return {
    message: `In a full implementation, I would provide weather information by either accessing a local weather API or using offline weather data. Currently, I'm a demo running in a web browser with limited access to external services.`,
    success: true
  };
}

function handleCalculation(text: string): TaskResponse {
  // Extract math expressions
  const calculationRegex = /(?:calculate|compute|what is|how much is)\s+([\d\+\-\*\/\(\)\.\s]+)/i;
  const calcMatch = text.match(calculationRegex);
  
  if (calcMatch) {
    const expression = calcMatch[1].replace(/[^0-9+\-*/().]/g, '');
    
    try {
      // WARNING: eval is generally not safe, but for this demo it's contained
      // In a real app, use a proper math parsing library instead
      const result = eval(expression);
      return {
        message: `The result of ${expression} is ${result}.`,
        success: true,
        data: { expression, result }
      };
    } catch (error) {
      return {
        message: `I couldn't calculate "${expression}". Please check if the expression is valid.`,
        success: false
      };
    }
  }
  
  // Check for common math phrases
  const simpleMathRegex = /what is (\d+) (plus|minus|times|divided by) (\d+)/i;
  const mathMatch = text.match(simpleMathRegex);
  
  if (mathMatch) {
    const num1 = parseInt(mathMatch[1]);
    const operation = mathMatch[2].toLowerCase();
    const num2 = parseInt(mathMatch[3]);
    
    let result: number;
    switch (operation) {
      case 'plus': result = num1 + num2; break;
      case 'minus': result = num1 - num2; break;
      case 'times': result = num1 * num2; break;
      case 'divided by': result = num1 / num2; break;
      default: return { message: "I couldn't understand that calculation.", success: false };
    }
    
    return {
      message: `${num1} ${operation} ${num2} equals ${result}.`,
      success: true,
      data: { num1, operation, num2, result }
    };
  }
  
  return {
    message: "",
    success: false
  };
}

function handleChatCommand(text: string): TaskResponse {
  // Enhanced chat responses
  if (text.includes('hello') || text.includes('hi') || text.match(/^hey/i)) {
    return {
      message: 'Hello! How can I help you today?',
      success: true
    };
  } else if (text.includes('how are you')) {
    return {
      message: 'I\'m functioning optimally! How are you doing today?',
      success: true
    };
  } else if (text.includes('joke')) {
    const jokes = [
      'Why do programmers prefer dark mode? Because light attracts bugs!',
      'Why did the AI go to therapy? It had too many deep learning issues!',
      'I asked the computer to solve a problem, but it said "That\'s not in my domain."',
      'Why did the developer go broke? Because they lost their cache!',
      'What do you call a computer that sings? A Dell!',
      'I told my computer I needed a break, and now it won\'t stop sending me vacation ads.',
      'Why was the computer cold? It left its Windows open!',
      'What\'s a computer\'s favorite snack? Microchips!',
      'Why don\'t programmers like nature? It has too many bugs and no debugging tool.'
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
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return {
      message: `Today is ${new Date().toLocaleDateString(undefined, options)}.`,
      success: true
    };
  } else if (text.includes('thank')) {
    return {
      message: "You're welcome! Is there anything else I can help you with?",
      success: true
    };
  } else if (text.includes('who are you') || text.includes('what are you')) {
    return {
      message: "I'm BUDDY, your offline AI assistant. I'm designed to help you with various tasks without sending your data to any servers. Everything I do stays on your device.",
      success: true
    };
  } else if (text.includes('can you do')) {
    return {
      message: "I can help with tasks like taking notes, finding files, opening apps, setting timers, playing music, answering questions, and just chatting with you. Since I'm an offline assistant, I process everything locally on your device for privacy.",
      success: true
    };
  }
  
  return {
    message: "I'm here to help with various tasks. You can ask me to open apps, manage files, take notes, play music, search for information, perform calculations, or just chat!",
    success: true
  };
}
