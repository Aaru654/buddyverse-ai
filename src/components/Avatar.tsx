
import { useEffect, useState } from 'react';
import { CircleIcon, Wand2 } from 'lucide-react';

interface AvatarProps {
  isActive?: boolean;
}

export const Avatar = ({ isActive = false }: AvatarProps) => {
  const [rings, setRings] = useState<number[]>([]);

  useEffect(() => {
    if (isActive) {
      const newRing = Date.now();
      setRings(prev => [...prev, newRing]);
      setTimeout(() => {
        setRings(prev => prev.filter(r => r !== newRing));
      }, 2000);
    }
  }, [isActive]);

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      {/* Animated rings */}
      {rings.map((ring) => (
        <div
          key={ring}
          className="absolute inset-0 border border-buddy-neon/30 rounded-full animate-pulse-slow"
          style={{
            animation: 'pulse 2s cubic-bezier(0, 0, 0.2, 1) infinite',
            animationDelay: `${Math.random() * 1000}ms`
          }}
        />
      ))}
      
      {/* Core avatar */}
      <div className="relative z-10 flex items-center justify-center w-24 h-24 glass rounded-full animate-float">
        <CircleIcon className="w-4 h-4 absolute text-buddy-neon animate-pulse" 
          style={{ 
            top: '25%',
            left: '25%',
            opacity: 0.5 
          }} 
        />
        <Wand2 className="w-8 h-8 text-buddy-neon" />
        <CircleIcon className="w-3 h-3 absolute text-buddy-purple animate-pulse" 
          style={{ 
            bottom: '30%',
            right: '20%',
            opacity: 0.7 
          }} 
        />
      </div>
    </div>
  );
};
