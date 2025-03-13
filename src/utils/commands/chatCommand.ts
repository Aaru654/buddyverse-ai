
import { TaskResponse } from '../types/taskTypes';
import { learningSystem } from '../learningSystem';

export const handleChatCommand = (text: string): TaskResponse => {
  const userName = learningSystem.getUserName();
  const personalizedGreeting = userName ? `Hello, ${userName}! ` : 'Hello! ';
  
  // Enhanced chat responses
  if (text.includes('hello') || text.includes('hi') || text.match(/^hey/i)) {
    return {
      message: learningSystem.getPersonalizedGreeting(),
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
      message: `You're welcome${userName ? ', ' + userName : ''}! Is there anything else I can help you with?`,
      success: true
    };
  } else if (text.includes('who are you') || text.includes('what are you')) {
    return {
      message: "I'm BUDDY, your offline AI assistant. I'm designed to help you with various tasks without sending your data to any servers. Everything I do stays on your device.",
      success: true
    };
  } else if (text.includes('can you do')) {
    return {
      message: "I can help with tasks like taking notes, managing your calendar, finding files, opening apps, setting timers, playing music, answering questions, and just chatting with you. Since I'm an offline assistant, I process everything locally on your device for privacy.",
      success: true
    };
  }
  
  return {
    message: `I'm here to help with various tasks. You can ask me to manage your calendar, take notes, open apps, manage files, play music, search for information, perform calculations, or just chat!`,
    success: true
  };
};
