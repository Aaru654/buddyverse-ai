
import { useState, useEffect, useRef } from 'react';
import { CommandResult } from '@/components/terminal/CommandHistory';
import { StorageManager } from '@/utils/learning/storage';

export function useTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [commandResults, setCommandResults] = useState<CommandResult[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);
  const storageManager = useRef(new StorageManager());

  // Load command results from local storage
  useEffect(() => {
    if (isOpen) {
      const savedResults = storageManager.current.getCommandHistory();
      if (savedResults && savedResults.length > 0) {
        setCommandResults(savedResults);
      }

      // Extract command strings for up/down navigation
      const commandStrings = savedResults.map(result => result.command);
      setCommandHistory(commandStrings);
    }
  }, [isOpen]);

  // Save command results to local storage whenever they change
  useEffect(() => {
    if (commandResults.length > 0) {
      storageManager.current.saveCommandHistory(commandResults);
    }
  }, [commandResults]);

  // Load command history from the Electron app if available
  useEffect(() => {
    const loadCommandHistory = async () => {
      if (window.electronAPI) {
        try {
          const history = await window.electronAPI.getCommandHistory();
          if (history && history.length > 0) {
            // If we have history from Electron that's not in our local storage
            const newResults = history.map(item => ({
              command: item.command,
              output: 'Previous command (output not stored)',
              timestamp: item.timestamp
            }));
            
            // Merge with existing results from local storage
            const existingCommands = new Set(commandResults.map(r => r.command + r.timestamp));
            const uniqueNewResults = newResults.filter(
              r => !existingCommands.has(r.command + r.timestamp)
            );
            
            if (uniqueNewResults.length > 0) {
              const mergedResults = [...commandResults, ...uniqueNewResults];
              setCommandResults(mergedResults);
              
              // Extract command strings for up/down navigation
              const commandStrings = mergedResults.map(result => result.command);
              setCommandHistory(commandStrings);
            }
          }
        } catch (error) {
          console.error('Failed to load command history:', error);
        }
      }
    };
    
    if (isOpen) {
      loadCommandHistory();
    }
  }, [isOpen, commandResults]);

  // Auto-scroll to bottom when new commands are added
  useEffect(() => {
    if (resultsEndRef.current) {
      resultsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [commandResults]);

  // Focus input when terminal is opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const executeCommand = async (cmd: string) => {
    if (!cmd.trim()) return;
    
    // Add to UI immediately
    const newResult: CommandResult = {
      command: cmd,
      output: 'Executing command...',
      timestamp: new Date().toISOString()
    };
    
    const updatedResults = [...commandResults, newResult];
    setCommandResults(updatedResults);
    
    // Save to local storage immediately
    storageManager.current.saveCommandHistory(updatedResults);
    
    setCommand('');
    setCommandHistory(prev => [cmd, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);
    
    // Execute via Electron if available
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.executeTerminalCommand(cmd);
        
        // Update with real result
        const finalResults = commandResults.map(item => 
          item.command === cmd && item.timestamp === newResult.timestamp 
            ? { 
                ...item, 
                output: result.stdout || result.stderr || 'Command executed successfully with no output', 
                error: !!result.stderr 
              } 
            : item
        );
        setCommandResults([...finalResults, {
          command: cmd,
          output: result.stdout || result.stderr || 'Command executed successfully with no output',
          error: !!result.stderr,
          timestamp: new Date().toISOString()
        }].filter((v, i, a) => a.indexOf(v) === i)); // Remove any duplicates
        
        // Save updated results with actual output
        storageManager.current.saveCommandHistory(finalResults);
      } catch (error: any) {
        // Handle error case
        const finalResults = commandResults.map(item => 
          item.command === cmd && item.timestamp === newResult.timestamp 
            ? { 
                ...item, 
                output: error.message || error.toString() || 'Unknown error occurred', 
                error: true 
              } 
            : item
        );
        setCommandResults(finalResults);
        
        // Save error results
        storageManager.current.saveCommandHistory(finalResults);
      }
    } else {
      // If not in Electron, handle as chat command
      const finalResults = commandResults.map(item => 
        item.command === cmd && item.timestamp === newResult.timestamp 
          ? { 
              ...item, 
              output: 'This command requires the desktop app version with system access.', 
              error: true 
            } 
          : item
      );
      setCommandResults(finalResults);
      
      // Save results
      storageManager.current.saveCommandHistory(finalResults);
    }
    
    return cmd;
  };

  const clearTerminal = () => {
    setCommandResults([]);
    // Also clear from local storage
    storageManager.current.saveCommandHistory([]);
  };

  return {
    isOpen,
    setIsOpen,
    command,
    setCommand,
    commandResults,
    commandHistory,
    historyIndex,
    setHistoryIndex,
    inputRef,
    resultsEndRef,
    executeCommand,
    clearTerminal
  };
}
