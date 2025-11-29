'use client';

import { motion } from 'motion/react';
import { Home, Send, QrCode, History, User } from 'lucide-react';
import { useRouter, usePathname } from 'next/navigation';

interface BottomNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
}

const navItems = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'send', icon: Send, label: 'Send' },
  { id: 'scanner', icon: QrCode, label: 'Scan' },
  { id: 'activity', icon: History, label: 'Activity' },
  { id: 'settings', icon: User, label: 'Profile' },
];

export function BottomNav({ currentScreen, onNavigate }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  
  const handleNavigate = (screen: string) => {
    if (screen === 'home') {
      router.push('/home');
    } else {
      router.push(`/${screen}`);
    }
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl bg-[#050505]/95 backdrop-blur-xl border-t border-white/10 px-6 pb-6 pt-3 safe-area-bottom">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id || pathname === `/${item.id}`;
          
          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className="flex flex-col items-center gap-1 relative group"
            >
              <motion.div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                  isActive 
                    ? 'bg-gradient-to-br from-[#836EF9] to-[#4FFFFF]' 
                    : 'bg-transparent group-hover:bg-white/5'
                }`}
                whileTap={{ scale: 0.9 }}
              >
                <Icon 
                  className={`w-6 h-6 transition-colors ${
                    isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-white'
                  }`}
                />
              </motion.div>
              <span className={`text-xs transition-colors ${
                isActive ? 'text-white' : 'text-[#94A3B8] group-hover:text-white'
              }`}>
                {item.label}
              </span>
              
              {/* Active Indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -top-1 w-1 h-1 rounded-full bg-[#4FFFFF]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
