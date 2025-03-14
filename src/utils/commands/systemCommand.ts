
import { TaskResponse } from '../types/taskTypes';

export const handleSystemCommand = (text: string): TaskResponse => {
  // Check if this is a system information request
  if (text.includes('system info') || text.includes('computer info') || text.includes('device info')) {
    try {
      // Check if electronAPI is available (desktop mode)
      if (window.electronAPI) {
        const systemInfo = window.electronAPI.getSystemInfo();
        
        // Format memory in GB
        const totalMemoryGB = (systemInfo.totalMemory / (1024 * 1024 * 1024)).toFixed(2);
        const freeMemoryGB = (systemInfo.freeMemory / (1024 * 1024 * 1024)).toFixed(2);
        
        return {
          message: `Here's information about your system:
          
• Operating System: ${systemInfo.platform} ${systemInfo.osVersion}
• Hostname: ${systemInfo.hostname}
• User: ${systemInfo.userInfo.username}
• Total Memory: ${totalMemoryGB} GB
• Free Memory: ${freeMemoryGB} GB
• CPU: ${systemInfo.cpuInfo[0]?.model || 'Unknown'} (${systemInfo.cpuInfo.length} cores)
`,
          success: true,
          data: systemInfo
        };
      } else {
        return {
          message: "I can only access system information when running as a desktop application.",
          success: false
        };
      }
    } catch (error) {
      console.error("Error getting system info:", error);
      return {
        message: `I encountered an error retrieving system information: ${error.message || error}`,
        success: false
      };
    }
  }
  
  return {
    message: "I can provide information about your system. Try asking for 'system info' or 'computer info'.",
    success: true
  };
};
