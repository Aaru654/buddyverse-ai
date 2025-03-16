
import { TaskResponse } from '../types/taskTypes';

export const handleFileCommand = async (text: string): Promise<TaskResponse> => {
  // Check if running in Electron
  const isElectron = !!window.electronAPI;
  
  if (!isElectron) {
    return {
      message: `I need desktop app permissions to perform file operations. This feature is only available in the desktop app version.`,
      success: false
    };
  }
  
  try {
    if (text.includes('create') || text.includes('new')) {
      // Detect if we're creating a file or folder
      const isFolder = text.includes('folder') || text.includes('directory');
      const nameMatch = text.match(/(?:create|new)\s+(?:file|folder|directory)?\s+(?:called|named)?\s+"?([^"]+)"?/i);
      const name = nameMatch ? nameMatch[1].trim() : 'untitled';
      
      const platform = window.electronAPI.getPlatform();
      const command = isFolder 
        ? (platform === 'win32' ? `mkdir "${name}"` : `mkdir -p "${name}"`)
        : (platform === 'win32' ? `type nul > "${name}"` : `touch "${name}"`);
      
      const result = await window.electronAPI.executeTerminalCommand(command);
      
      return {
        message: `I've created a new ${isFolder ? 'folder' : 'file'} named "${name}".`,
        success: true,
        data: result
      };
    } else if (text.includes('delete') || text.includes('remove')) {
      const nameMatch = text.match(/(?:delete|remove)\s+(?:file|folder|directory)?\s+(?:called|named)?\s+"?([^"]+)"?/i);
      const name = nameMatch ? nameMatch[1].trim() : null;
      
      if (!name) {
        return {
          message: `Please specify what file or folder you want to delete.`,
          success: false
        };
      }
      
      const platform = window.electronAPI.getPlatform();
      const isFolder = text.includes('folder') || text.includes('directory');
      const command = isFolder
        ? (platform === 'win32' ? `rmdir /S /Q "${name}"` : `rm -rf "${name}"`)
        : (platform === 'win32' ? `del "${name}"` : `rm "${name}"`);
      
      const result = await window.electronAPI.executeTerminalCommand(command);
      
      return {
        message: `I've deleted the ${isFolder ? 'folder' : 'file'} "${name}".`,
        success: true,
        data: result
      };
    } else if (text.includes('rename')) {
      const match = text.match(/rename\s+(?:file|folder|directory)?\s+"?([^"]+)"?\s+to\s+"?([^"]+)"?/i);
      
      if (!match || !match[1] || !match[2]) {
        return {
          message: `Please specify both the old and new names for renaming.`,
          success: false
        };
      }
      
      const oldName = match[1].trim();
      const newName = match[2].trim();
      const platform = window.electronAPI.getPlatform();
      const command = platform === 'win32' 
        ? `ren "${oldName}" "${newName}"`
        : `mv "${oldName}" "${newName}"`;
      
      const result = await window.electronAPI.executeTerminalCommand(command);
      
      return {
        message: `I've renamed "${oldName}" to "${newName}".`,
        success: true,
        data: result
      };
    } else if (text.includes('open')) {
      const nameMatch = text.match(/open\s+(?:file|folder|directory)?\s+"?([^"]+)"?/i);
      const name = nameMatch ? nameMatch[1].trim() : null;
      
      if (!name) {
        return {
          message: `Please specify what file or folder you want to open.`,
          success: false
        };
      }
      
      const platform = window.electronAPI.getPlatform();
      const command = platform === 'win32'
        ? `start "" "${name}"`
        : platform === 'darwin'
          ? `open "${name}"`
          : `xdg-open "${name}"`;
      
      const result = await window.electronAPI.executeTerminalCommand(command);
      
      return {
        message: `I've opened "${name}" for you.`,
        success: true,
        data: result
      };
    } else if (text.includes('list') || text.includes('show')) {
      const platform = window.electronAPI.getPlatform();
      const command = platform === 'win32' ? 'dir' : 'ls -la';
      
      const result = await window.electronAPI.executeTerminalCommand(command);
      
      return {
        message: `Here's the current directory listing:\n\n${result.stdout}`,
        success: true,
        data: result
      };
    }
    
    return {
      message: `I can help with file operations. Try saying "create file notes.txt", "delete file temp.log", "rename file old.txt to new.txt", or "open file document.pdf".`,
      success: true
    };
  } catch (error) {
    return {
      message: `Sorry, I encountered an error while performing that file operation: ${error.message || error}`,
      success: false
    };
  }
};
