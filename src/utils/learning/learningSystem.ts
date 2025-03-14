
import { StorageManager } from './storage';
import { PreferenceManager } from './preferenceManager';
import { InteractionManager } from './interactionManager';
import { GreetingGenerator } from './greetingGenerator';
import { UserPreference } from './types';

class LearningSystem {
  private storageManager: StorageManager;
  private preferenceManager: PreferenceManager;
  private interactionManager: InteractionManager;
  private greetingGenerator: GreetingGenerator;
  
  constructor() {
    this.storageManager = new StorageManager();
    this.preferenceManager = new PreferenceManager(this.storageManager);
    this.interactionManager = new InteractionManager(this.storageManager, this.preferenceManager);
    this.greetingGenerator = new GreetingGenerator(this.preferenceManager);
  }
  
  // Public API
  getPreferences(): UserPreference[] {
    return this.preferenceManager.getPreferences();
  }
  
  savePreference(preference: Omit<UserPreference, 'lastUpdated'>): void {
    this.preferenceManager.savePreference(preference);
  }
  
  getPreferencesByType(type: UserPreference['type']): UserPreference[] {
    return this.preferenceManager.getPreferencesByType(type);
  }
  
  removePreference(type: UserPreference['type'], value: string): void {
    this.preferenceManager.removePreference(type, value);
  }
  
  getUserName(): string | null {
    return this.preferenceManager.getUserName();
  }
  
  logInteraction(userQuery: string, assistantResponse: string): void {
    this.interactionManager.logInteraction(userQuery, assistantResponse);
  }
  
  getPersonalizedGreeting(): string {
    return this.greetingGenerator.getPersonalizedGreeting();
  }
}

export const learningSystem = new LearningSystem();
