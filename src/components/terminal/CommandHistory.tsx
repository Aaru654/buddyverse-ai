
import React from 'react';
import { Clipboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { highlightOutput } from '@/utils/terminal/syntaxHighlighter';
import { useToast } from '@/hooks/use-toast';

export interface CommandResult {
  command: string;
  output: string;
  timestamp: string;
  error?: boolean;
}

interface CommandHistoryProps {
  commands: CommandResult[];
  onCopyText: (text: string) => void;
  resultsEndRef: React.RefObject<HTMLDivElement>;
}

export const CommandHistory: React.FC<CommandHistoryProps> = ({ 
  commands, 
  onCopyText,
  resultsEndRef
}) => {
  const { toast } = useToast();

  const handleCopy = (text: string) => {
    onCopyText(text);
    toast({
      title: "Copied to clipboard",
      description: "Text has been copied to your clipboard",
      duration: 2000,
    });
  };

  return (
    <ScrollArea className="max-h-[420px] h-[50vh]">
      <div className="p-4 font-mono text-sm text-gray-300 space-y-4">
        {commands.length === 0 ? (
          <div className="text-gray-500 italic">
            Type a system command below to execute it directly on your device.
          </div>
        ) : (
          commands.map((result, index) => {
            // Apply syntax highlighting to the output
            const { formattedOutput, cssClasses } = result.output 
              ? highlightOutput(result.output) 
              : { formattedOutput: '', cssClasses: '' };
              
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center">
                  <span className="text-gray-500">{new Date(result.timestamp).toLocaleString()}</span>
                  <span className="ml-2 text-buddy-neon">$</span>
                  <span className="ml-2">{result.command}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 ml-auto text-gray-400 hover:text-white"
                    onClick={() => handleCopy(result.command)}
                    aria-label="Copy command"
                  >
                    <Clipboard className="h-3 w-3" />
                  </Button>
                </div>
                
                {result.output && (
                  <div className="pl-4 border-l-2 border-gray-700 relative">
                    <div className={`whitespace-pre-wrap ${result.error ? 'text-red-400' : cssClasses}`}>
                      {formattedOutput}
                    </div>
                    <div className="absolute top-0 right-0">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 text-gray-400 hover:text-white"
                        onClick={() => handleCopy(result.output)}
                        aria-label="Copy output"
                      >
                        <Clipboard className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                )}
                
                {index < commands.length - 1 && (
                  <Separator className="bg-gray-800 mt-4" />
                )}
              </div>
            );
          })
        )}
        <div ref={resultsEndRef} />
      </div>
    </ScrollArea>
  );
};
