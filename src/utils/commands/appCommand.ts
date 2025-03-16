
import { TaskResponse } from '../types/taskTypes';

// Instead of declaring a conflicting window.electronAPI interface, use the one from vite-env.d.ts
export const handleAppCommand = async (text: string): Promise<TaskResponse> => {
  // Check if running in Electron
  const isElectron = !!window.electronAPI;
  
  if (!isElectron) {
    return {
      message: `I need desktop app permissions to open applications. This feature is only available in the desktop app version.`,
      success: false
    };
  }

  const appMatches = [
    { regex: /open\s+(browser|chrome|firefox|edge|safari)/i, app: 'browser', 
      win: 'start chrome', mac: 'open -a "Google Chrome"', linux: 'google-chrome' },
    { regex: /open\s+(mail|email|outlook|gmail)/i, app: 'email',
      win: 'start outlook', mac: 'open -a "Mail"', linux: 'thunderbird' },
    { regex: /open\s+(word|document|docs)/i, app: 'word processor',
      win: 'start winword', mac: 'open -a "Microsoft Word"', linux: 'libreoffice --writer' },
    { regex: /open\s+(excel|spreadsheet|sheets)/i, app: 'spreadsheet',
      win: 'start excel', mac: 'open -a "Microsoft Excel"', linux: 'libreoffice --calc' },
    { regex: /open\s+(powerpoint|presentation|slides)/i, app: 'presentation',
      win: 'start powerpnt', mac: 'open -a "Microsoft PowerPoint"', linux: 'libreoffice --impress' },
    { regex: /open\s+(calendar|schedule)/i, app: 'calendar',
      win: 'start outlookcal:', mac: 'open -a "Calendar"', linux: 'gnome-calendar' },
    { regex: /open\s+(terminal|command|prompt|console)/i, app: 'terminal',
      win: 'start cmd', mac: 'open -a "Terminal"', linux: 'gnome-terminal' },
    { regex: /open\s+(settings|preferences|control panel)/i, app: 'settings',
      win: 'start ms-settings:', mac: 'open "System Preferences"', linux: 'gnome-control-center' },
    { regex: /open\s+(calculator)/i, app: 'calculator',
      win: 'start calc', mac: 'open -a "Calculator"', linux: 'gnome-calculator' },
    { regex: /open\s+(camera)/i, app: 'camera',
      win: 'start microsoft.windows.camera:', mac: 'open -a "Photo Booth"', linux: 'cheese' },
    { regex: /open\s+(photos|gallery|images)/i, app: 'photos',
      win: 'start ms-photos:', mac: 'open -a "Photos"', linux: 'eog' },
    { regex: /open\s+(video|movies|player)/i, app: 'video player',
      win: 'start wmplayer', mac: 'open -a "QuickTime Player"', linux: 'vlc' },
  ];
  
  try {
    const platform = window.electronAPI.getPlatform();
    let platformKey;
    
    switch (platform) {
      case 'win32': platformKey = 'win'; break;
      case 'darwin': platformKey = 'mac'; break;
      default: platformKey = 'linux';
    }
    
    // Try to match with specific apps
    for (const match of appMatches) {
      if (match.regex.test(text)) {
        const command = match[platformKey];
        const result = await window.electronAPI.executeTerminalCommand(command);
        
        return {
          message: `I've opened the ${match.app} for you.`,
          success: true,
          data: { appName: match.app, result }
        };
      }
    }
    
    // Generic app match as fallback
    const appMatch = text.match(/open\s+(\w+)/i);
    const appName = appMatch ? appMatch[1] : 'the app';
    
    let command;
    switch (platformKey) {
      case 'win': command = `start ${appName}`; break;
      case 'mac': command = `open -a "${appName}"`; break;
      default: command = appName.toLowerCase();
    }
    
    const result = await window.electronAPI.executeTerminalCommand(command);
    
    return {
      message: `I've opened ${appName} for you.`,
      success: true,
      data: { appName, result }
    };
  } catch (error) {
    return {
      message: `I couldn't open that application. The error was: ${error.message || error}`,
      success: false
    };
  }
};
