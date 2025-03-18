
import React from 'react';
import { ArrowUpCircle, Send } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface CommandInputProps {
  command: string;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  platform: string;
  directory?: string;
}

export const CommandInput: React.FC<CommandInputProps> = ({
  command,
  onChange,
  onKeyDown,
  onSubmit,
  inputRef,
  platform,
  directory = '/'
}) => {
  return (
    <div className="p-2 bg-gray-800">
      <div className="flex items-center text-xs text-gray-500 pb-1">
        <span>System: {platform}</span>
        <span className="mx-2">•</span>
        <span>Path: {directory}</span>
      </div>
      
      <form onSubmit={onSubmit} className="flex space-x-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
            <ArrowUpCircle className="h-4 w-4" aria-label="Use Up/Down arrows for history" />
          </div>
          <Input
            value={command}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            ref={inputRef}
            placeholder="Type command and press Enter..."
            className="pl-10 pr-3 py-2 bg-gray-700 border-gray-600 text-gray-200 focus:ring-buddy-neon focus:border-buddy-neon font-mono"
          />
        </div>
        <Button 
          type="submit" 
          size="icon" 
          className="bg-buddy-neon hover:bg-buddy-neon/90 text-black"
          disabled={!command.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
