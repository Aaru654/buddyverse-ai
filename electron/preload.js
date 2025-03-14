
const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Terminal operations
  executeTerminalCommand: (command) => ipcRenderer.invoke('execute-terminal-command', command),
  
  // System information
  getPlatform: () => process.platform,
  
  // Add more API methods as needed
});
