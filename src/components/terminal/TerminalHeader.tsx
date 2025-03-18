
import React from 'react';
import { Terminal, X, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface TerminalHeaderProps {
  onClose: () => void;
  onClear: () => void;
  onToggleSearch: () => void;
  isSearchActive: boolean;
}

export const TerminalHeader: React.FC<TerminalHeaderProps> = ({ 
  onClose, 
  onClear, 
  onToggleSearch,
  isSearchActive 
}) => {
  return (
    <>
      <div className="p-2 flex items-center justify-between bg-gray-800 rounded-t-lg">
        <div className="flex items-center">
          <Terminal className="h-4 w-4 mr-2 text-gray-400" />
          <span className="text-sm font-medium text-gray-200">Terminal</span>
        </div>
        <div className="flex space-x-1">
          <Button 
            size="icon" 
            variant="ghost" 
            className={`h-8 w-8 ${isSearchActive ? 'text-buddy-neon' : 'text-gray-400'} hover:text-white`}
            onClick={onToggleSearch}
          >
            <span className="sr-only">Search</span>
            <Search className="h-4 w-4" />
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={onClear}
          >
            <span className="sr-only">Clear</span>
            X
          </Button>
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-8 w-8 text-gray-400 hover:text-white"
            onClick={onClose}
          >
            <span className="sr-only">Close</span>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <Separator className="bg-gray-700" />
    </>
  );
};
