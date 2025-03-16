
import React, { useState, useEffect, useRef } from 'react';
import { ArrowUpCircle, Clipboard, Terminal, X } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useChatContext } from '@/contexts/ChatContext';

interface CommandResult {
  command: string;
  output: string;
  timestamp: string;
  error?: boolean;
}

export const TerminalView = () => {
  const { state, sendMessage } = useChatContext();
  const [isOpen, setIsOpen] = useState(false);
  const [command, setCommand] = useState('');
  const [commandResults, setCommandResults] = useState<CommandResult[]>([]);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsEndRef = useRef<HTMLDivElement>(null);

  // Load command history from the Electron app if available
  useEffect(() => {
    const loadCommandHistory = async () => {
      if (window.electronAPI) {
        try {
          const history = await window.electronAPI.getCommandHistory();
          if (history && history.length > 0) {
            setCommandResults(
              history.map(item => ({
                command: item.command,
                output: 'Previous command (output not stored)',
                timestamp: item.timestamp
              }))
            );
          }
        } catch (error) {
          console.error('Failed to load command history:', error);
        }
      }
    };
    
    if (isOpen) {
      loadCommandHistory();
    }
  }, [isOpen]);

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
    
    setCommandResults(prev => [...prev, newResult]);
    setCommand('');
    setCommandHistory(prev => [cmd, ...prev.slice(0, 49)]);
    setHistoryIndex(-1);
    
    // Execute via Electron if available
    if (window.electronAPI) {
      try {
        const result = await window.electronAPI.executeTerminalCommand(cmd);
        
        // Update with real result
        setCommandResults(prev => prev.map(item => 
          item.command === cmd && item.timestamp === newResult.timestamp 
            ? { 
                ...item, 
                output: result.stdout || result.stderr || 'Command executed successfully with no output', 
                error: !!result.stderr 
              } 
            : item
        ));
      } catch (error: any) {
        // Handle error case
        setCommandResults(prev => prev.map(item => 
          item.command === cmd && item.timestamp === newResult.timestamp 
            ? { 
                ...item, 
                output: error.message || error.toString() || 'Unknown error occurred', 
                error: true 
              } 
            : item
        ));
      }
    } else {
      // If not in Electron, handle as chat command
      setCommandResults(prev => prev.map(item => 
        item.command === cmd && item.timestamp === newResult.timestamp 
          ? { 
              ...item, 
              output: 'This command requires the desktop app version with system access.', 
              error: true 
            } 
          : item
      ));
      
      // Also send as a chat message
      sendMessage(cmd);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    executeCommand(command);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };

  const clearTerminal = () => {
    setCommandResults([]);
  };

  const copyOutputToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
      // Try alternative approach for Electron
      if (window.electronAPI) {
        try {
          await window.electronAPI.writeClipboard(text);
        } catch (electronErr) {
          console.error('Failed to copy via Electron:', electronErr);
        }
      }
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          size="icon"
          className="rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg"
        >
          <Terminal className="h-5 w-5" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-6xl bg-gray-900 border border-gray-700 rounded-t-lg shadow-2xl">
      <div className="p-2 flex items-center justify-between bg-gray-800 rounded-t-lg">
        <div className="flex items-center">
          <Terminal className="h-4 w-4 mr-2 text-gray-400" />
          <span className="text-sm font-medium text-gray-200">Terminal</span>
        </div>
        <div className="flex space-x-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={clearTerminal}
          >
            <span className="sr-only">Clear</span>
            X
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={() => setIsOpen(false)}
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <Separator className="bg-gray-700" />
      
      <ScrollArea className="max-h-[420px] h-[50vh]">
        <div className="p-4 font-mono text-sm text-gray-300 space-y-4">
          {commandResults.length === 0 ? (
            <div className="text-gray-500 italic">
              Type a system command below to execute it directly on your device.
            </div>
          ) : (
            commandResults.map((result, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-500">{new Date(result.timestamp).toLocaleString()}</span>
                  <span className="ml-2 text-buddy-neon">$</span>
                  <span className="ml-2">{result.command}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-auto text-gray-400 hover:text-white"
                    onClick={() => copyOutputToClipboard(result.command)}
                    aria-label="Copy command"
                  >
                    <Clipboard className="h-3 w-3" />
                  </Button>
                </div>
                
                {result.output && (
                  <div className="pl-4 border-l-2 border-gray-700">
                    <div className={`font-mono whitespace-pre-wrap ${result.error ? 'text-red-400' : 'text-gray-400'}`}>
                      {result.output}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-auto mt-1 text-gray-400 hover:text-white self-start"
                      onClick={() => copyOutputToClipboard(result.output)}
                      aria-label="Copy output"
                    >
                      <Clipboard className="h-3 w-3" />
                    </Button>
                  </div>
                )}
                
                {index < commandResults.length - 1 && (
                  <Separator className="bg-gray-800 mt-4" />
                )}
              </div>
            ))
          )}
          <div ref={resultsEndRef} />
        </div>
      </ScrollArea>
      
      <Separator className="bg-gray-700" />
      
      <div className="p-2 bg-gray-800">
        <div className="flex items-center text-xs text-gray-500 pb-1">
          <span>System: {window.electronAPI ? window.electronAPI.getPlatform() : 'Browser'}</span>
          <span className="mx-2">•</span>
          <span>Path: {commandResults.length > 0 ? 'Current directory' : '/'}</span>
        </div>
        
        <div className="flex space-x-2">
          
          <form onSubmit={handleSubmit} className="p-2 bg-gray-800 border-t border-gray-700 flex items-center">
            <div className="mr-2 text-gray-400">
              <ArrowUpCircle className="h-4 w-4" aria-label="Use Up/Down arrows for history" />
            </div>
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              ref={inputRef}
              placeholder="Type command and press Enter..."
              className="bg-gray-700 border-gray-600 text-gray-200 focus:ring-buddy-neon font-mono"
            />
          </form>
        </div>
      </div>
    </div>
  );
};
