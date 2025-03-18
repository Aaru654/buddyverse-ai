
import React from 'react';
import { useChatContext } from '@/contexts/ChatContext';
import { TerminalButton } from './terminal/TerminalButton';
import { TerminalContainer } from './terminal/TerminalContainer';
import { useTerminal } from '@/hooks/useTerminal';

export const TerminalView = () => {
  const { sendMessage } = useChatContext();
  const terminal = useTerminal();

  // Handle sending commands to chat if not in Electron
  const handleExecuteCommand = async (cmd: string) => {
    const result = await terminal.executeCommand(cmd);
    
    // If command was executed and we're in browser mode, also send as chat message
    if (result && !window.electronAPI) {
      sendMessage(cmd);
    }
    
    return result;
  };

  if (!terminal.isOpen) {
    return <TerminalButton onClick={() => terminal.setIsOpen(true)} />;
  }

  return (
    <TerminalContainer
      isOpen={terminal.isOpen}
      onClose={() => terminal.setIsOpen(false)}
      command={terminal.command}
      setCommand={terminal.setCommand}
      commandResults={terminal.commandResults}
      commandHistory={terminal.commandHistory}
      historyIndex={terminal.historyIndex}
      setHistoryIndex={terminal.setHistoryIndex}
      inputRef={terminal.inputRef}
      resultsEndRef={terminal.resultsEndRef}
      executeCommand={handleExecuteCommand}
      clearTerminal={terminal.clearTerminal}
    />
  );
};
