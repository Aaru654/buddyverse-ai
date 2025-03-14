
import { UserPreference, UserInteraction } from './types';

export class StorageManager {
  private preferencesKey = 'buddy_preferences';
  private interactionsKey = 'buddy_interactions';
  private maxInteractionsStored = 50;
  
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
}
