
import { Avatar } from "@/components/Avatar";
import { ChatContainer } from "@/components/ChatContainer";

const Index = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 space-y-8">
      <div className="text-center space-y-4 animate-in fade-in duration-700">
        <h1 className="text-4xl font-bold text-gradient">BUDDY</h1>
        <p className="text-gray-400">Your Offline AI Assistant</p>
      </div>
      
      <div className="relative z-10 animate-in fade-in slide-in-from-bottom duration-700 delay-200">
        <Avatar isActive={true} />
      </div>
      
      <div className="w-full animate-in fade-in slide-in-from-bottom duration-700 delay-300">
        <ChatContainer />
      </div>
    </div>
  );
};

export default Index;
