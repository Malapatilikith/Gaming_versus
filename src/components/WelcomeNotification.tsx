
import React, { useEffect, useState } from 'react';
import { X } from 'lucide-react';

interface WelcomeNotificationProps {
  username: string;
}

export const WelcomeNotification: React.FC<WelcomeNotificationProps> = ({ username }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Show notification after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    
    // Auto-hide after 5 seconds
    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 5000);
    
    return () => {
      clearTimeout(timer);
      clearTimeout(hideTimer);
    };
  }, []);
  
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-20 right-4 z-50 animate-slide-down">
      <div className="bg-gaming-dark shadow-lg rounded-lg p-4 border-l-4 border-gaming-pink max-w-sm">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold text-white">Welcome back, {username}!</h3>
            <p className="text-sm text-gray-300 mt-1">
              Explore available tournaments and join the competition.
            </p>
          </div>
          <button 
            onClick={() => setIsVisible(false)}
            className="text-white hover:text-gaming-pink"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
