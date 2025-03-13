
import { TaskResponse } from '../types/taskTypes';

// Enhanced app handler with more detailed responses
export const handleAppCommand = (text: string): TaskResponse => {
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
};
