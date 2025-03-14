
const { contextBridge, ipcRenderer } = require('electron');
const os = require('os');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Terminal operations
  executeTerminalCommand: (command) => ipcRenderer.invoke('execute-terminal-command', command),
  getCommandHistory: () => ipcRenderer.invoke('get-command-history'),
  
  // System information
  getPlatform: () => process.platform,
  getSystemInfo: () => ({
    platform: process.platform,
    osVersion: os.release(),
    totalMemory: os.totalmem(),
    freeMemory: os.freemem(),
    cpuInfo: os.cpus(),
    userInfo: os.userInfo(),
    hostname: os.hostname(),
    networkInterfaces: os.networkInterfaces()
  }),
  
  // File operations
  readFile: (path) => ipcRenderer.invoke('read-file', path),
  writeFile: (path, content) => ipcRenderer.invoke('write-file', path, content),
  listFiles: (path) => ipcRenderer.invoke('list-files', path),
  createFile: (path) => ipcRenderer.invoke('create-file', path),
  deleteFile: (path) => ipcRenderer.invoke('delete-file', path),
  openFile: (path) => ipcRenderer.invoke('open-file', path),
  
  // Application operations
  openApplication: (appName) => ipcRenderer.invoke('open-application', appName),
  
  // Clipboard operations
  readClipboard: () => ipcRenderer.invoke('read-clipboard'),
  writeClipboard: (text) => ipcRenderer.invoke('write-clipboard', text)
});
