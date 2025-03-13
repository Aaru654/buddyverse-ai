
import { TaskResponse } from '../types/taskTypes';

export const handleMusicCommand = (text: string): TaskResponse => {
  if (text.includes('play')) {
    const songMatch = text.match(/play\s+(.*)/i);
    const songRequest = songMatch ? songMatch[1].trim() : 'music';
    
    return {
      message: `I would play ${songRequest} from your local library. In a full implementation, I would access your music files and play the requested content.`,
      success: true,
      data: { request: songRequest }
    };
  } else if (text.includes('pause') || text.includes('stop')) {
    return {
      message: `Music paused. In a full implementation, I would control your media playback.`,
      success: true
    };
  } else if (text.includes('volume up') || text.includes('turn up')) {
    return {
      message: `I've increased the volume. In a full implementation, I would adjust your system volume.`,
      success: true
    };
  } else if (text.includes('volume down') || text.includes('turn down')) {
    return {
      message: `I've decreased the volume. In a full implementation, I would adjust your system volume.`,
      success: true
    };
  }
  
  return {
    message: `I can control your music playback in a full implementation. Try saying "Play some rock music", "Pause the music", or "Turn up the volume".`,
    success: true
  };
};
