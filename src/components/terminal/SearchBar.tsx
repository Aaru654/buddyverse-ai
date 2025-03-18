
import React from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resultCount: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  searchTerm, 
  setSearchTerm,
  resultCount
}) => {
  return (
    <div className="p-2 bg-gray-800 border-b border-gray-700 flex items-center">
      <div className="relative flex-1">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search command history..."
          className="pl-10 pr-10 py-2 bg-gray-700 border-gray-600 text-gray-200 text-sm"
          autoFocus
        />
        {searchTerm && (
          <button 
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            onClick={() => setSearchTerm('')}
          >
            <X className="h-4 w-4 text-gray-400 hover:text-white" />
          </button>
        )}
      </div>
      {searchTerm && (
        <div className="ml-2 text-xs text-gray-400">
          {resultCount} {resultCount === 1 ? 'result' : 'results'}
        </div>
      )}
    </div>
  );
};
