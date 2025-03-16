
// Type definitions for Electron API used in the application
interface ElectronAPI {
  executeTerminalCommand: (command: string) => Promise<{ stdout: string; stderr: string }>;
  getCommandHistory: () => Promise<{ command: string; timestamp: string }[]>;
  getPlatform: () => string;
  writeClipboard: (text: string) => Promise<void>;
  openExternal: (url: string) => Promise<void>;
  readFile: (path: string) => Promise<string>;
  writeFile: (path: string, content: string) => Promise<void>;
  listFiles: (dir: string) => Promise<string[]>;
  getAppPath: () => Promise<string>;
  showOpenDialog: (options: any) => Promise<{ canceled: boolean; filePaths: string[] }>;
  showSaveDialog: (options: any) => Promise<{ canceled: boolean; filePath?: string }>;
  showNotification: (title: string, body: string) => void;
  onUpdateAvailable: (callback: (info: { version: string }) => void) => () => void;
}

// Add the electronAPI property to the Window interface
interface Window {
  electronAPI?: ElectronAPI;
}
