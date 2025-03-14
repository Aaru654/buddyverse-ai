import { UserInteraction } from './types';
import { StorageManager } from './storage';
import { PreferenceManager } from './preferenceManager';

export class InteractionManager {
  private storage: StorageManager;
  private preferenceManager: PreferenceManager;
  
  constructor(storage: StorageManager, preferenceManager: PreferenceManager) {
    this.storage = storage;
    this.preferenceManager = preferenceManager;
  }
  
  // Log an interaction
  logInteraction(userQuery: string, assistantResponse: string): void {
    const interactions = this.storage.getInteractions();
    
    interactions.push({
      timestamp: new Date(),
      userQuery,
      assistantResponse
    });
    
    // Keep only the most recent interactions
    if (interactions.length > 50) { // Using fixed number since maxInteractionsStored isn't accessible here
      interactions.splice(0, interactions.length - 50);
    }
    
    this.storage.saveInteractions(interactions);
    
    // Attempt to learn from this interaction
    this.learnFromInteraction(userQuery, assistantResponse);
  }
  
  // Learn from interactions
  private learnFromInteraction(userQuery: string, assistantResponse: string): void {
    // Extract user name if present
    this.extractName(userQuery);
    
    // Extract interests
    this.extractInterests(userQuery);
  }
  
  private extractName(text: string): void {
    // Simple name extraction patterns
    const namePatterns = [
      /my name is (\w+)/i,
      /call me (\w+)/i,
      /i'm (\w+)/i
    ];
    
    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const name = match[1];
        this.preferenceManager.savePreference({
          type: 'name',
          value: name,
          confidence: 0.8,
          context: `User mentioned: "${text}"`
        });
        break;
      }
    }
  }
  
  private extractInterests(text: string): void {
    // Simple interest patterns
    const interestPatterns = [
      /i (?:like|love|enjoy) (\w+)/i,
      /i'm (?:interested in|passionate about) (\w+)/i,
      /i (?:don't like|hate|dislike) (\w+)/i,
    ];
    
    for (const pattern of interestPatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        const value = match[1];
        const isDislike = pattern.source.includes("don't like|hate|dislike");
        
        this.preferenceManager.savePreference({
          type: isDislike ? 'dislike' : 'interest',
          value,
          confidence: 0.6,
          context: `User mentioned: "${text}"`
        });
      }
    }
  }
}
