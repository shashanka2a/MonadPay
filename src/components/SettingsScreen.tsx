'use client';

import { ArrowLeft, User, Shield, Bell, Palette, HelpCircle, LogOut, ChevronRight } from 'lucide-react';
import { currentUser } from '../utils/mockData';
import { motion } from 'motion/react';

interface SettingsScreenProps {
  onNavigate: (screen: string) => void;
}

export function SettingsScreen({ onNavigate }: SettingsScreenProps) {
  const menuItems = [
    {
      icon: User,
      title: 'Profile',
      subtitle: 'Edit your profile information',
      action: () => console.log('Profile')
    },
    {
      icon: Shield,
      title: 'Security',
      subtitle: 'Manage your wallet and security',
      action: () => console.log('Security')
    },
    {
      icon: Bell,
      title: 'Notifications',
      subtitle: 'Configure notification preferences',
      action: () => console.log('Notifications')
    },
    {
      icon: Palette,
      title: 'Appearance',
      subtitle: 'Customize app appearance',
      action: () => console.log('Appearance')
    },
    {
      icon: HelpCircle,
      title: 'Help & Support',
      subtitle: 'Get help and contact support',
      action: () => console.log('Help')
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Header */}
      <div className="p-6 flex items-center gap-4 sticky top-0 bg-[#050505] z-10 border-b border-white/5">
        <button 
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl">Settings</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#836EF9]/20 to-[#4FFFFF]/20 border border-[#836EF9]/50 rounded-3xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full"
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-[#836EF9]" />
            </div>
            <div className="flex-1">
              <p className="mono text-xl text-white">{currentUser.handle}</p>
              <p className="mono text-xs text-[#94A3B8] mt-1">
                {currentUser.address.slice(0, 6)}...{currentUser.address.slice(-4)}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Menu Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl overflow-hidden border border-white/10"
        >
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <button
                key={item.title}
                onClick={item.action}
                className={`w-full px-6 py-4 flex items-center gap-4 hover:bg-white/5 transition-colors ${
                  index !== menuItems.length - 1 ? 'border-b border-white/5' : ''
                }`}
              >
                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#4FFFFF]" />
                </div>
                <div className="flex-1 text-left">
                  <p className="text-white">{item.title}</p>
                  <p className="text-[#94A3B8] text-sm">{item.subtitle}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-[#94A3B8]" />
              </button>
            );
          })}
        </motion.div>

        {/* App Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
        >
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[#94A3B8]">Version</span>
              <span className="text-white mono">1.0.0</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#94A3B8]">Network</span>
              <span className="text-[#4FFFFF]">Monad Mainnet</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#94A3B8]">Block Height</span>
              <span className="text-white mono">1,234,567</span>
            </div>
          </div>
        </motion.div>

        {/* Logout Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="w-full py-4 rounded-full border-2 border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444]/10 transition-colors flex items-center justify-center gap-2"
        >
          <LogOut className="w-5 h-5" />
          Disconnect Wallet
        </motion.button>
      </div>
    </div>
  );
}
