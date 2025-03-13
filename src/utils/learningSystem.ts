// Learning system to personalize the assistant over time

export interface UserPreference {
  type: 'interest' | 'dislike' | 'name' | 'relationship';
  value: string;
  context?: string;
  confidence: number;
  lastUpdated: Date;
}

export interface UserInteraction {
  timestamp: Date;
  userQuery: string;
  assistantResponse: string;
  feedbackProvided?: 'positive' | 'negative';
}

class LearningSystem {
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
  
  // Save a new preference or update an existing one
  savePreference(preference: Omit<UserPreference, 'lastUpdated'>): void {
    const preferences = this.getPreferences();
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
    
    this.savePreferences(preferences);
  }
  
  // Get a specific preference type
  getPreferencesByType(type: UserPreference['type']): UserPreference[] {
    const preferences = this.getPreferences();
    return preferences.filter(p => p.type === type);
  }
  
  // Remove a preference
  removePreference(type: UserPreference['type'], value: string): void {
    const preferences = this.getPreferences();
    const filtered = preferences.filter(p => 
      !(p.type === type && p.value.toLowerCase() === value.toLowerCase())
    );
    this.savePreferences(filtered);
  }
  
  // Log an interaction
  logInteraction(userQuery: string, assistantResponse: string): void {
    const interactions = this.getInteractions();
    
    interactions.push({
      timestamp: new Date(),
      userQuery,
      assistantResponse
    });
    
    // Keep only the most recent interactions
    if (interactions.length > this.maxInteractionsStored) {
      interactions.splice(0, interactions.length - this.maxInteractionsStored);
    }
    
    this.saveInteractions(interactions);
    
    // Attempt to learn from this interaction
    this.learnFromInteraction(userQuery, assistantResponse);
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
  
  // Private methods
  private savePreferences(preferences: UserPreference[]): void {
    localStorage.setItem(this.preferencesKey, JSON.stringify(preferences));
  }
  
  private saveInteractions(interactions: UserInteraction[]): void {
    localStorage.setItem(this.interactionsKey, JSON.stringify(interactions));
  }
  
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
        this.savePreference({
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
        
        this.savePreference({
          type: isDislike ? 'dislike' : 'interest',
          value,
          confidence: 0.6,
          context: `User mentioned: "${text}"`
        });
      }
    }
  }
  
  // Get user name if known
  getUserName(): string | null {
    const namePreferences = this.getPreferencesByType('name');
    if (namePreferences.length === 0) return null;
    
    // Return the most confidently known name
    return namePreferences.sort((a, b) => b.confidence - a.confidence)[0].value;
  }
  
  // Get personalized greeting
  getPersonalizedGreeting(): string {
    const name = this.getUserName();
    const interests = this.getPreferencesByType('interest')
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

export const learningSystem = new LearningSystem();
