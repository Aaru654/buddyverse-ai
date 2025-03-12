
import { useState, useRef, useEffect } from 'react';
import { Send, Mic } from 'lucide-react';

// Define a message type for better type checking
type Message = {
  id: string;
  content: string;
  sender: 'user' | 'buddy';
  timestamp: Date;
};

export const ChatContainer = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Hello! How can I assist you today?',
      sender: 'buddy',
      timestamp: new Date(),
    },
  ]);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      // Add user message
      const userMessage: Message = {
        id: Date.now().toString(),
        content: message,
        sender: 'user',
        timestamp: new Date(),
      };
      
      setMessages((prev) => [...prev, userMessage]);
      setMessage('');
      
      // Simulate buddy response (would be replaced with actual AI processing)
      setTimeout(() => {
        const buddyResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: getBuddyResponse(message),
          sender: 'buddy',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, buddyResponse]);
      }, 1000);
    }
  };

  // Simple response generator (placeholder for the actual NLP)
  const getBuddyResponse = (userMessage: string): string => {
    const lowerCaseMessage = userMessage.toLowerCase();
    
    if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
      return 'Hello there! How can I help you today?';
    } else if (lowerCaseMessage.includes('how are you')) {
      return 'I\'m functioning perfectly! Thanks for asking.';
    } else if (lowerCaseMessage.includes('time')) {
      return `The current time is ${new Date().toLocaleTimeString()}.`;
    } else if (lowerCaseMessage.includes('date')) {
      return `Today is ${new Date().toLocaleDateString()}.`;
    } else if (lowerCaseMessage.includes('thank')) {
      return 'You\'re welcome! Is there anything else I can help with?';
    } else {
      return 'I\'m still learning to respond to that. Is there something else I can help you with?';
    }
  };

  const toggleListening = () => {
    // In a real implementation, this would connect to the offline voice recognition
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition (would be replaced with actual implementation)
      setTimeout(() => {
        setMessage('This is a simulated voice message');
        setIsListening(false);
      }, 2000);
    } else {
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-2xl glass rounded-lg p-4 space-y-4">
      <div className="h-[400px] overflow-y-auto space-y-4 p-2">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`rounded-lg p-3 max-w-[80%] ${
              msg.sender === 'user' 
                ? 'bg-buddy-purple/30 text-white' 
                : 'bg-buddy-neon/10 text-white border border-buddy-neon/30'
            }`}>
              <p className="text-white">{msg.content}</p>
              <p className="text-xs text-gray-400 mt-1">
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full bg-black/20 text-white placeholder-gray-400 rounded-lg pl-4 pr-24 py-3 focus:outline-none focus:ring-2 focus:ring-buddy-neon/50"
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-2">
          <button
            type="button"
            onClick={toggleListening}
            className={`p-2 rounded-full transition-colors ${
              isListening 
                ? 'bg-buddy-accent text-white' 
                : 'text-gray-400 hover:text-buddy-neon'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>
          <button
            type="submit"
            className="p-2 text-buddy-neon hover:text-buddy-neon/80 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </form>
    </div>
  );
};
