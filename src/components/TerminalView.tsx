
import React, { useState, useEffect, useRef } from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import { Terminal, X, CheckCircle2, AlertCircle, Clipboard, ArrowUpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';

interface CommandResult {
  command: string;
  output: string;
  error: boolean;
  timestamp: Date;
}

interface CommandHistoryItem {
  command: string;
  timestamp: string;
}

const commonCommands = [
  'ls', 'cd', 'mkdir', 'touch', 'rm', 'pwd', 'cat',
  'ps', 'top', 'grep', 'find', 'echo', 'ping'
];

export const TerminalView = () => {
  const { sendMessage } = useChatContext();
  const [command, setCommand] = useState('');
  const [results, setResults] = useState<CommandResult[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  const [history, setHistory] = useState<CommandHistoryItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  
  const fetchCommandHistory = async () => {
    if (window.electronAPI?.getCommandHistory) {
      try {
        const history = await window.electronAPI.getCommandHistory();
        setHistory(history);
      } catch (error) {
        console.error("Failed to fetch command history:", error);
      }
    }
  };
  
  useEffect(() => {
    fetchCommandHistory();
  }, []);
  
  // Update suggestions as user types
  useEffect(() => {
    if (command.trim()) {
      const filtered = commonCommands.filter(cmd => 
        cmd.startsWith(command.split(' ')[0]) && cmd !== command.split(' ')[0]
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  }, [command]);
  
  // Scroll to bottom when results change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [results]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!command.trim()) return;
    
    // Add to local results immediately for responsiveness
    const newResult: CommandResult = {
      command,
      output: 'Executing...',
      error: false,
      timestamp: new Date()
    };
    
    setResults(prev => [...prev, newResult]);
    setCommand('');
    setHistoryIndex(-1);
    
    try {
      // Execute command if electronAPI is available
      if (window.electronAPI?.executeTerminalCommand) {
        const result = await window.electronAPI.executeTerminalCommand(command);
        
        setResults(prev => prev.map(item => 
          item === newResult 
            ? { 
                ...item, 
                output: result.stdout || result.stderr || 'Command executed successfully with no output', 
                error: !!result.stderr 
              } 
            : item
        ));
        
        // Refresh command history
        fetchCommandHistory();
      } else {
        // Fallback for web mode
        setResults(prev => prev.map(item => 
          item === newResult 
            ? { 
                ...item, 
                output: 'Terminal commands can only be executed in desktop mode.', 
                error: true 
              } 
            : item
        ));
      }
    } catch (error) {
      setResults(prev => prev.map(item => 
        item === newResult 
          ? { 
              ...item, 
              output: error.message || 'An error occurred while executing the command.', 
              error: true 
            } 
          : item
      ));
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle up/down arrows for history navigation
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[newIndex].command);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[newIndex].command);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };
  
  const copyOutputToClipboard = (output: string) => {
    if (window.electronAPI?.writeClipboard) {
      window.electronAPI.writeClipboard(output)
        .then(() => sendMessage("Copied terminal output to clipboard."));
    } else {
      navigator.clipboard.writeText(output)
        .then(() => sendMessage("Copied terminal output to clipboard."))
        .catch(err => console.error("Failed to copy:", err));
    }
  };
  
  const applySuggestion = (suggestion: string) => {
    const commandWords = command.split(' ');
    commandWords[0] = suggestion;
    setCommand(commandWords.join(' '));
  };

  return (
    <div className="fixed bottom-4 right-4 z-30">
      {!isVisible && (
        <Button 
          onClick={() => setIsVisible(true)}
          className="rounded-full h-12 w-12 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:border-buddy-neon transition-colors shadow-lg"
        >
          <Terminal className="h-5 w-5 text-buddy-neon" />
        </Button>
      )}
      
      {isVisible && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-xl w-[600px] max-w-full h-[500px] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between p-2 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <Terminal className="h-4 w-4 text-buddy-neon" />
              <span className="text-sm font-medium text-gray-300">Terminal</span>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsVisible(false)}
              className="h-6 w-6 rounded-full hover:bg-gray-700"
            >
              <X className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
          
          <ScrollArea className="flex-1 p-3 bg-black/50 font-mono text-xs">
            {results.map((result, index) => (
              <div key={index} className="mb-4">
                <div className="flex items-center mb-1">
                  <span className="text-green-400">$ </span>
                  <span className="text-gray-200 ml-1">{result.command}</span>
                  <span className="text-gray-500 text-xs ml-2">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                  
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
                
                <div className={`pl-4 border-l-2 ${result.error ? 'border-red-500 text-red-300' : 'border-gray-600 text-gray-300'}`}>
                  <div className="flex">
                    <pre className="whitespace-pre-wrap break-all">{result.output}</pre>
                    
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
                  
                  {result.error ? (
                    <div className="flex items-center text-red-400 mt-1 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>Command failed</span>
                    </div>
                  ) : (
                    <div className="flex items-center text-green-400 mt-1 text-xs">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      <span>Command completed</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </ScrollArea>
          
          {suggestions.length > 0 && (
            <div className="bg-gray-800 border-t border-gray-700 px-2 py-1">
              <div className="flex flex-wrap gap-1">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="h-6 text-xs bg-gray-700 hover:bg-gray-600 border-gray-600"
                    onClick={() => applySuggestion(suggestion)}
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="p-2 bg-gray-800 border-t border-gray-700 flex items-center">
            <div className="mr-2 text-gray-400">
              <ArrowUpCircle className="h-4 w-4" aria-label="Use Up/Down arrows for history" />
            </div>
            <Input
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Enter a command..."
              className="flex-1 bg-gray-700 border-gray-600 text-sm text-gray-200 focus-visible:ring-buddy-neon/30"
            />
            <Button 
              type="submit" 
              className="ml-2 bg-buddy-neon hover:bg-buddy-neon/80 text-black"
            >
              Run
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};
