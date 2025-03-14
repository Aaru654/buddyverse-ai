
import { UserPreference } from './types';
import { StorageManager } from './storage';

export class PreferenceManager {
  private storage: StorageManager;
  
  constructor(storage: StorageManager) {
    this.storage = storage;
  }
  
  // Get all preferences
  getPreferences(): UserPreference[] {
    return this.storage.getPreferences();
  }
  
  // Save a new preference or update an existing one
  savePreference(preference: Omit<UserPreference, 'lastUpdated'>): void {
    const preferences = this.storage.getPreferences();
    const existing = preferences.findIndex(p => 
      p.type === preference.type && p.value.toLowerCase() === preference.value.toLowerCase()
    );
    
    if (existing !== -1) {
      // Update existing preference
      preferences[existing] = {
        ...preferences[existing],
        confidence: Math.min(1, preferences[existing].confidence + 0.2),
        context: preference.context || preferences[existing].context,
        lastUpdated: new Date()
      };
    } else {
      // Add new preference
      preferences.push({
        ...preference,
        lastUpdated: new Date()
      });
    }
    
    this.storage.savePreferences(preferences);
  }
  
  // Get a specific preference type
  getPreferencesByType(type: UserPreference['type']): UserPreference[] {
    const preferences = this.storage.getPreferences();
    return preferences.filter(p => p.type === type);
  }
  
  // Remove a preference
  removePreference(type: UserPreference['type'], value: string): void {
    const preferences = this.storage.getPreferences();
    const filtered = preferences.filter(p => 
      !(p.type === type && p.value.toLowerCase() === value.toLowerCase())
    );
    this.storage.savePreferences(filtered);
  }
  
  // Get user name if known
  getUserName(): string | null {
    const namePreferences = this.getPreferencesByType('name');
    if (namePreferences.length === 0) return null;
    
    // Return the most confidently known name
    return namePreferences.sort((a, b) => b.confidence - a.confidence)[0].value;
  }
}
