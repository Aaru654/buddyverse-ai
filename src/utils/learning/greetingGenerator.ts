
import { PreferenceManager } from './preferenceManager';

export class GreetingGenerator {
  private preferenceManager: PreferenceManager;
  
  constructor(preferenceManager: PreferenceManager) {
    this.preferenceManager = preferenceManager;
  }
  
  // Get personalized greeting
  getPersonalizedGreeting(): string {
    const name = this.preferenceManager.getUserName();
    const interests = this.preferenceManager.getPreferencesByType('interest')
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 2);
    
    if (name && interests.length > 0) {
      return `Hello ${name}! Ready to talk about ${interests[0].value} today?`;
    } else if (name) {
      return `Hello ${name}! How can I help you today?`;
    } else if (interests.length > 0) {
      return `Hello! Want to discuss ${interests[0].value} today?`;
    }
    
    return "Hello! How can I help you today?";
  }
}
