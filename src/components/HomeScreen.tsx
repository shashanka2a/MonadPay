'use client';

import { Scan, TrendingUp, Zap, Settings, RefreshCw } from 'lucide-react';
import { currentUser, mockTransactions } from '../utils/mockData';
import { Transaction } from '../types';
import { motion } from 'motion/react';
import { QuickActions } from './QuickActions';
import { useState, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';

interface HomeScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  const [balance, setBalance] = useState(4250.50);
  const [todayChange, setTodayChange] = useState(120.00);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { isConnected, balance: walletBalance, updateBalance } = useWallet();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    if (isConnected) {
      await updateBalance();
      const bal = parseFloat(walletBalance || '0');
      setBalance(bal);
    } else {
      // Mock refresh for demo
      setTimeout(() => {
        setBalance(4250.50 + Math.random() * 100);
        setTodayChange(120.00 + Math.random() * 50);
        setIsRefreshing(false);
      }, 1000);
    }
    setIsRefreshing(false);
  };

  // Update balance from wallet when connected
  useEffect(() => {
    if (isConnected && walletBalance) {
      setBalance(parseFloat(walletBalance));
    }
  }, [isConnected, walletBalance]);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'send':
        onNavigate('send');
        break;
      case 'request':
        onNavigate('request');
        break;
      case 'scan':
        onNavigate('scanner');
        break;
      case 'contacts':
        // Future implementation
        break;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen bg-[#050505] pb-32">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-6">
        <button 
          onClick={() => onNavigate('settings')}
          className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        >
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full"
            />
            <div className="absolute inset-0 rounded-full ring-2 ring-[#836EF9] ring-offset-2 ring-offset-[#050505]" />
          </div>
          <span className="mono text-white">{currentUser.handle}</span>
        </button>
        <button 
          onClick={() => onNavigate('scanner')}
          className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <Scan className="w-6 h-6 text-[#4FFFFF]" />
        </button>
      </div>

      {/* Refresh Button */}
      <div className="px-6 flex justify-end">
        <motion.button
          onClick={handleRefresh}
          disabled={isRefreshing}
          animate={{ rotate: isRefreshing ? 360 : 0 }}
          transition={{ duration: 1, repeat: isRefreshing ? Infinity : 0, ease: 'linear' }}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors disabled:opacity-50"
        >
          <RefreshCw className="w-5 h-5 text-[#4FFFFF]" />
        </motion.button>
      </div>

      {/* Balance Hero */}
      <div className="px-6 py-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="balance text-6xl mb-4">
            {balance.toLocaleString('en-US', { minimumFractionDigits: 4, maximumFractionDigits: 4 })} MON
          </h1>
          <div className="flex items-center justify-center gap-2 text-[#10B981]">
            <TrendingUp className="w-4 h-4" />
            <span className="balance">+{todayChange.toFixed(4)} MON (Today)</span>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} />

      {/* Activity Feed */}
      <div className="px-6 mt-8">
        <h2 className="text-xl mb-4 text-white/90">Recent Activity</h2>
        <div className="space-y-3">
          {mockTransactions.map((tx, index) => (
            <motion.div
              key={tx.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              onClick={() => onNavigate('transaction-detail', { transaction: tx })}
              className="bg-white/5 backdrop-blur-sm rounded-3xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <img
                  src={tx.type === 'received' ? tx.from.avatar : tx.to.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white truncate">
                    {tx.type === 'received' 
                      ? `${tx.from.handle} paid you` 
                      : `You paid ${tx.to.handle}`}
                  </p>
                  <p className="text-[#94A3B8] text-sm truncate">{tx.note}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <Zap className="w-3 h-3 text-[#4FFFFF]" />
                    <span className="text-xs text-[#94A3B8]">{formatTime(tx.timestamp)}</span>
                  </div>
                </div>
                <div className={`balance text-xl ${tx.type === 'received' ? 'text-[#10B981]' : 'text-white/70'}`}>
                  {tx.type === 'received' ? '+' : '-'}{tx.amount.toFixed(4)} MON
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
