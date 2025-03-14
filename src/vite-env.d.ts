
/// <reference types="vite/client" />

// Add Electron API definitions
interface Window {
  electronAPI?: {
    executeTerminalCommand: (command: string) => Promise<{ stdout: string; stderr: string }>;
    getCommandHistory: () => Promise<{ command: string; timestamp: string }[]>;
    getPlatform: () => string;
    getSystemInfo: () => SystemInfo;
    readFile: (path: string) => Promise<{ success: boolean; content?: string; error?: string }>;
    writeFile: (path: string, content: string) => Promise<{ success: boolean; error?: string }>;
    listFiles: (path: string) => Promise<{ success: boolean; files?: FileInfo[]; error?: string }>;
    createFile: (path: string) => Promise<{ success: boolean; error?: string }>;
    deleteFile: (path: string) => Promise<{ success: boolean; error?: string }>;
    openFile: (path: string) => Promise<{ success: boolean; error?: string }>;
    openApplication: (appName: string) => Promise<{ success: boolean; error?: string }>;
    readClipboard: () => Promise<string>;
    writeClipboard: (text: string) => Promise<{ success: boolean }>;
  };
}

interface SystemInfo {
  platform: string;
  osVersion: string;
  totalMemory: number;
  freeMemory: number;
  cpuInfo: CpuInfo[];
  userInfo: UserInfo;
  hostname: string;
  networkInterfaces: any;
}

interface CpuInfo {
  model: string;
  speed: number;
  times: {
    user: number;
    nice: number;
    sys: number;
    idle: number;
    irq: number;
  };
}

interface UserInfo {
  uid: number;
  gid: number;
  username: string;
  homedir: string;
  shell: string;
}

interface FileInfo {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
  created: Date;
  modified: Date;
}
