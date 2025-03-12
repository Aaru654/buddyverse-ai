
import { useState } from 'react';
import { Send } from 'lucide-react';

export const ChatContainer = () => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      console.log('Message sent:', message);
      setMessage('');
    }
  };

  return (
    <div className="w-full max-w-2xl glass rounded-lg p-4 space-y-4">
      <div className="h-[400px] overflow-y-auto space-y-4 p-2">
        {/* Messages will be rendered here */}
        <div className="flex justify-end">
          <div className="bg-buddy-purple/20 rounded-lg p-3 max-w-[80%]">
            <p className="text-white">Hello! How can I assist you today?</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full bg-black/20 text-white placeholder-gray-400 rounded-lg pl-4 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-buddy-neon/50"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-buddy-neon hover:text-buddy-neon/80 transition-colors"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
