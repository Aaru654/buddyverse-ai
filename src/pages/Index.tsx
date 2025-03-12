
import { useState, useEffect } from "react";
import { Avatar } from "@/components/Avatar";
import { ChatContainer } from "@/components/ChatContainer";
import { initSpeechSynthesis } from "@/utils/speechSynthesis";

const Index = () => {
  const [isProcessing, setIsProcessing] = useState(false);

  // Initialize speech synthesis on page load
  useEffect(() => {
    initSpeechSynthesis();
  }, []);

  // This function syncs the Avatar animation state with the ChatContainer processing state
  const handleProcessingState = (state: boolean) => {
    setIsProcessing(state);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 space-y-8 bg-gradient-to-br from-gray-900 to-black">
      <div className="absolute inset-0 bg-grid-pattern opacity-10 pointer-events-none"></div>
      
      <div className="text-center space-y-2 animate-in fade-in duration-700">
        <h1 className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-buddy-neon to-buddy-purple">
          BUDDY
        </h1>
        <p className="text-gray-400">Your Offline AI Assistant</p>
      </div>
      
      <div className="relative z-10 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
        <Avatar isActive={true} isProcessing={isProcessing} />
      </div>
      
      <div className="w-full animate-in fade-in slide-in-from-bottom duration-700 delay-300">
        <ChatContainer onProcessingStateChange={handleProcessingState} />
      </div>
      
      <div className="text-xs text-gray-500 text-center mt-8 animate-in fade-in duration-700 delay-500">
        <p>Fully offline assistant • No data sent to servers • Local processing only</p>
      </div>
    </div>
  );
};

export default Index;
