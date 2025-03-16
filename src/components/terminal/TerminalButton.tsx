
import React from 'react';
import { Terminal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TerminalButtonProps {
  onClick: () => void;
}

export const TerminalButton: React.FC<TerminalButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button
        onClick={onClick}
        size="icon"
        className="rounded-full bg-gray-800 hover:bg-gray-700 text-white shadow-lg"
      >
        <Terminal className="h-5 w-5" />
      </Button>
    </div>
  );
};
