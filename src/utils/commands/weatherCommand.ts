
import { TaskResponse } from '../types/taskTypes';

export const handleWeatherCommand = (text: string): TaskResponse => {
  return {
    message: `In a full implementation, I would provide weather information by either accessing a local weather API or using offline weather data. Currently, I'm a demo running in a web browser with limited access to external services.`,
    success: true
  };
};
