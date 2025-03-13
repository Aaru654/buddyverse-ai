
import { TaskResponse } from '../types/taskTypes';

export const handleCalculation = (text: string): TaskResponse => {
  // Extract math expressions
  const calculationRegex = /(?:calculate|compute|what is|how much is)\s+([\d\+\-\*\/\(\)\.\s]+)/i;
  const calcMatch = text.match(calculationRegex);
  
  if (calcMatch) {
    const expression = calcMatch[1].replace(/[^0-9+\-*/().]/g, '');
    
    try {
      // WARNING: eval is generally not safe, but for this demo it's contained
      // In a real app, use a proper math parsing library instead
      const result = eval(expression);
      return {
        message: `The result of ${expression} is ${result}.`,
        success: true,
        data: { expression, result }
      };
    } catch (error) {
      return {
        message: `I couldn't calculate "${expression}". Please check if the expression is valid.`,
        success: false
      };
    }
  }
  
  // Check for common math phrases
  const simpleMathRegex = /what is (\d+) (plus|minus|times|divided by) (\d+)/i;
  const mathMatch = text.match(simpleMathRegex);
  
  if (mathMatch) {
    const num1 = parseInt(mathMatch[1]);
    const operation = mathMatch[2].toLowerCase();
    const num2 = parseInt(mathMatch[3]);
    
    let result: number;
    switch (operation) {
      case 'plus': result = num1 + num2; break;
      case 'minus': result = num1 - num2; break;
      case 'times': result = num1 * num2; break;
      case 'divided by': result = num1 / num2; break;
      default: return { message: "I couldn't understand that calculation.", success: false };
    }
    
    return {
      message: `${num1} ${operation} ${num2} equals ${result}.`,
      success: true,
      data: { num1, operation, num2, result }
    };
  }
  
  return {
    message: "",
    success: false
  };
};
