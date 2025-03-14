
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
