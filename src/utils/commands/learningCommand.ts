
import { TaskResponse } from '../types/taskTypes';
import { learningSystem } from '../learningSystem';

export const handleLearningCommand = (text: string): TaskResponse => {
  // Extract name
  const nameMatch = text.match(/my name is (\w+)/i) || text.match(/call me (\w+)/i);
  if (nameMatch && nameMatch[1]) {
    const name = nameMatch[1];
    learningSystem.savePreference({
      type: 'name',
      value: name,
      confidence: 0.9,
      context: `User explicitly mentioned: "${text}"`
    });
    
    return {
      message: `Thanks, I'll remember that your name is ${name}!`,
      success: true
    };
  }
  
  // Extract interests
  const likeMatch = text.match(/i (?:like|love|enjoy) ([\w\s]+)/i);
  if (likeMatch && likeMatch[1]) {
    const interest = likeMatch[1].trim();
    learningSystem.savePreference({
      type: 'interest',
      value: interest,
      confidence: 0.8,
      context: `User explicitly mentioned: "${text}"`
    });
    
    return {
      message: `I'll remember that you enjoy ${interest}!`,
      success: true
    };
  }
  
  // Extract dislikes
  const dislikeMatch = text.match(/i (?:don't like|hate|dislike) ([\w\s]+)/i);
  if (dislikeMatch && dislikeMatch[1]) {
    const dislike = dislikeMatch[1].trim();
    learningSystem.savePreference({
      type: 'dislike',
      value: dislike,
      confidence: 0.8,
      context: `User explicitly mentioned: "${text}"`
    });
    
    return {
      message: `I'll remember that you don't like ${dislike}.`,
      success: true
    };
  }
  
  // Forget things about me
  if (text.match(/forget (?:about|that) ([\w\s]+)/i)) {
    const match = text.match(/forget (?:about|that) ([\w\s]+)/i);
    const item = match ? match[1].trim() : '';
    
    if (item.match(/my name/i)) {
      const currentName = learningSystem.getUserName();
      if (currentName) {
        learningSystem.removePreference('name', currentName);
        return {
          message: `I've forgotten your name.`,
          success: true
        };
      }
    }
    
    // Try to find if it's an interest or dislike
    const allPreferences = [
      ...learningSystem.getPreferencesByType('interest'),
      ...learningSystem.getPreferencesByType('dislike')
    ];
    
    const preference = allPreferences.find(p => 
      p.value.toLowerCase().includes(item.toLowerCase())
    );
    
    if (preference) {
      learningSystem.removePreference(preference.type, preference.value);
      return {
        message: `I've forgotten that you ${preference.type === 'interest' ? 'like' : 'dislike'} ${preference.value}.`,
        success: true
      };
    }
    
    return {
      message: `I couldn't find anything specific about "${item}" to forget.`,
      success: false
    };
  }
  
  return {
    message: `I'm learning about your preferences to provide a more personalized experience. You can tell me things like "My name is Alex" or "I like hiking".`,
    success: true
  };
};
