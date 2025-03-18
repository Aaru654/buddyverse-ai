
import React, { useState, useEffect } from 'react';
import { CommandHistory, CommandResult } from './CommandHistory';
import { CommandInput } from './CommandInput';
import { TerminalHeader } from './TerminalHeader';
import { SearchBar } from './SearchBar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { copyToClipboard } from '@/utils/terminal/clipboardHelper';

interface TerminalContainerProps {
  isOpen: boolean;
  onClose: () => void;
  command: string;
  setCommand: (value: string) => void;
  commandResults: CommandResult[];
  commandHistory: string[];
  historyIndex: number;
  setHistoryIndex: (index: number) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  resultsEndRef: React.RefObject<HTMLDivElement>;
  executeCommand: (cmd: string) => Promise<string | undefined>;
  clearTerminal: () => void;
}

export const TerminalContainer: React.FC<TerminalContainerProps> = ({
  isOpen,
  onClose,
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
}) => {
  const { toast } = useToast();
  const [searchActive, setSearchActive] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState<CommandResult[]>(commandResults);
  const [showCommandInput, setShowCommandInput] = useState(true);

  // Filter results when search term changes
  useEffect(() => {
    if (searchTerm) {
      const filtered = commandResults.filter(result => 
        result.command.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.output.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults(commandResults);
    }
  }, [searchTerm, commandResults]);

  // When search is active, hide command input
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCommandInput(!searchActive);
    }, 150); // Small delay for smooth transition
    return () => clearTimeout(timer);
  }, [searchActive]);

  const handleCopyText = async (text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      toast({
        title: "Copied to clipboard",
        description: "Text has been copied to your clipboard",
        duration: 2000,
      });
    } else {
      toast({
        title: "Copy failed",
        description: "Could not copy text to clipboard",
        variant: "destructive",
        duration: 2000,
      });
    }
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
    } else if (e.key === 'Escape') {
      if (searchActive) {
        setSearchTerm('');
        setSearchActive(false);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (command.trim()) {
      executeCommand(command);
    }
  };

  const toggleSearch = () => {
    setSearchActive(!searchActive);
    if (searchActive) {
      setSearchTerm('');
      // Focus back on the command input when search is closed
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 mx-auto w-full max-w-6xl bg-gray-900 border border-gray-700 rounded-t-lg shadow-2xl">
      <TerminalHeader 
        onClose={onClose} 
        onClear={clearTerminal}
        onToggleSearch={toggleSearch}
        isSearchActive={searchActive}
      />
      
      {searchActive && (
        <SearchBar 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          resultCount={filteredResults.length}
        />
      )}
      
      <div className="max-h-[40vh] overflow-y-auto bg-gray-900 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        <CommandHistory
          commands={filteredResults}
          onCopyText={handleCopyText}
          resultsEndRef={resultsEndRef}
        />
      </div>
      
      <Separator className="bg-gray-700" />
      
      <div className={`transition-opacity duration-200 ${showCommandInput ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
        <CommandInput
          command={command}
          onChange={setCommand}
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
          inputRef={inputRef}
          platform={window.electronAPI ? window.electronAPI.getPlatform() : 'Browser'}
          directory={commandResults.length > 0 ? 'Current directory' : '/'}
        />
      </div>
    </div>
  );
};
