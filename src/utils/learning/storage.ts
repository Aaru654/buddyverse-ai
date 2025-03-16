
import { UserPreference, UserInteraction } from './types';
import { CommandResult } from '@/components/terminal/CommandHistory';

export class StorageManager {
  private preferencesKey = 'buddy_preferences';
  private interactionsKey = 'buddy_interactions';
  private commandHistoryKey = 'buddy_command_history';
  private maxInteractionsStored = 50;
  private maxCommandHistoryStored = 100;
  
  // Get user preferences
  getPreferences(): UserPreference[] {
    const stored = localStorage.getItem(this.preferencesKey);
    if (!stored) return [];
    try {
      return JSON.parse(stored, (key, value) => {
        if (key === 'lastUpdated') return new Date(value);
        return value;
      });
    } catch (error) {
      console.error('Error parsing preferences:', error);
      return [];
    }
  }
  
  // Save preferences
  savePreferences(preferences: UserPreference[]): void {
    localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
  }
  
  // Get stored interactions
  getInteractions(): UserInteraction[] {
    const stored = localStorage.getItem(this.interactionsKey);
    if (!stored) return [];
    try {
      return JSON.parse(stored, (key, value) => {
        if (key === 'timestamp') return new Date(value);
        return value;
      });
    } catch (error) {
      console.error('Error parsing interactions:', error);
      return [];
    }
  }
  
  // Save interactions
  saveInteractions(interactions: UserInteraction[]): void {
    localStorage.setItem(this.interactionsKey, JSON.stringify(interactions));
  }

  // Get command history
  getCommandHistory(): CommandResult[] {
    const stored = localStorage.getItem(this.commandHistoryKey);
    if (!stored) return [];
    try {
      return JSON.parse(stored, (key, value) => {
        if (key === 'timestamp') return value; // Keep as string for CommandResult
        return value;
      });
    } catch (error) {
      console.error('Error parsing command history:', error);
      return [];
    }
  }

  // Save command history
  saveCommandHistory(commands: CommandResult[]): void {
    // Limit the number of commands stored
    const limitedCommands = commands.slice(0, this.maxCommandHistoryStored);
    localStorage.setItem(this.commandHistoryKey, JSON.stringify(limitedCommands));
  }
}
