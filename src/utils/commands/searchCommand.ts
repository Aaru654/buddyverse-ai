
import { TaskResponse } from '../types/taskTypes';

export const handleSearchCommand = (text: string): TaskResponse => {
  // Extract search query more precisely
  const searchRegex = /(search|find|look for|google|search for)[:\s]+(.*)/i;
  const searchMatch = text.match(searchRegex);
  const searchQuery = searchMatch ? searchMatch[2].trim() : text.replace(/search|find|look for|google/i, '').trim();
  
  if (searchQuery) {
    return {
      message: `I would search for "${searchQuery}". In a full implementation, I would search your local files, knowledge base, or help you search the web safely.`,
      success: true,
      data: { query: searchQuery }
    };
  }
  
  return {
    message: `I can help you search for information. Try saying "Search for recent documents" or "Find information about quantum physics".`,
    success: true
  };
};
