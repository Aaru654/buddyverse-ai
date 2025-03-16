
// Detect and apply syntax highlighting to terminal output
export type SyntaxType = 'json' | 'error' | 'success' | 'warning' | 'file' | 'directory' | 'code' | 'plain';

// Helper to detect JSON content
const isJson = (text: string): boolean => {
  try {
    JSON.parse(text);
    return true;
  } catch (e) {
    return false;
  }
};

// Helper to detect if text represents a file listing
const isFileListing = (text: string): boolean => {
  // Common patterns in ls/dir outputs
  const fileListingPatterns = [
    /^total \d+/m, // Unix ls first line
    /^d([-rwx]{9})/m, // Unix directory listing
    /^[-l]([-rwx]{9})/m, // Unix file listing
    /^Volume in drive/m, // Windows dir output
    /^ Directory of/m, // Windows dir output
    /^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}\s+(AM|PM)/m, // Windows datetime format
  ];
  
  return fileListingPatterns.some(pattern => pattern.test(text));
};

// Detect the type of content in the terminal output
export const detectOutputType = (output: string): SyntaxType => {
  if (!output || output.trim() === '') return 'plain';
  
  // Check for error messages
  if (
    output.toLowerCase().includes('error') ||
    output.toLowerCase().includes('exception') ||
    output.toLowerCase().includes('failed') ||
    output.toLowerCase().includes('cannot')
  ) {
    return 'error';
  }
  
  // Check for success messages
  if (
    output.toLowerCase().includes('success') ||
    output.toLowerCase().includes('completed successfully')
  ) {
    return 'success';
  }
  
  // Check for warning messages
  if (
    output.toLowerCase().includes('warning') ||
    output.toLowerCase().includes('deprecated')
  ) {
    return 'warning';
  }
  
  // Check if the output is JSON
  if (isJson(output)) {
    return 'json';
  }
  
  // Check if it's a file listing (ls, dir)
  if (isFileListing(output)) {
    return 'file';
  }
  
  // If no specific type is detected, treat as code if it contains multiple lines
  // or special characters common in code
  if (
    output.includes('{') || 
    output.includes('}') || 
    output.includes('function') ||
    output.includes('=') ||
    output.includes(';') ||
    output.trim().split('\n').length > 2
  ) {
    return 'code';
  }
  
  return 'plain';
};

// Get the appropriate CSS classes for the detected content type
export const getHighlightClasses = (type: SyntaxType): string => {
  switch (type) {
    case 'json':
      return 'text-yellow-300 font-mono';
    case 'error':
      return 'text-red-400 font-mono';
    case 'success':
      return 'text-green-400 font-mono';
    case 'warning':
      return 'text-yellow-400 font-mono';
    case 'file':
      return 'text-blue-300 font-mono';
    case 'directory':
      return 'text-cyan-300 font-mono';
    case 'code':
      return 'text-purple-300 font-mono';
    case 'plain':
    default:
      return 'text-gray-400 font-mono';
  }
};

// Apply basic formatting for JSON
export const formatJsonOutput = (jsonString: string): string => {
  try {
    const parsed = JSON.parse(jsonString);
    return JSON.stringify(parsed, null, 2);
  } catch (e) {
    // If parsing fails, return the original string
    return jsonString;
  }
};

// Format file listing with colors for directories and files
export const formatOutput = (output: string, type: SyntaxType): string => {
  if (type === 'json') {
    return formatJsonOutput(output);
  }
  
  // For other types, just return the original
  return output;
};

// Main function to process and highlight output
export const highlightOutput = (output: string): {
  formattedOutput: string;
  cssClasses: string;
} => {
  const type = detectOutputType(output);
  return {
    formattedOutput: formatOutput(output, type),
    cssClasses: getHighlightClasses(type)
  };
};
