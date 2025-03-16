
import React from 'react';
import { ArrowUpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

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
      
      <div className="flex space-x-2">
        <form onSubmit={onSubmit} className="p-2 bg-gray-800 border-t border-gray-700 flex items-center w-full">
          <div className="mr-2 text-gray-400">
            <ArrowUpCircle className="h-4 w-4" aria-label="Use Up/Down arrows for history" />
          </div>
          <Input
            value={command}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onKeyDown}
            ref={inputRef}
            placeholder="Type command and press Enter..."
            className="bg-gray-700 border-gray-600 text-gray-200 focus:ring-buddy-neon font-mono"
          />
        </form>
      </div>
    </div>
  );
};
