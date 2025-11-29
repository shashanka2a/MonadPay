'use client';

import { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, TrendingUp, TrendingDown, Filter, Search } from 'lucide-react';
import { mockTransactions } from '../utils/mockData';
import { Transaction } from '../types';

interface ActivityScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function ActivityScreen({ onNavigate }: ActivityScreenProps) {
  const [filter, setFilter] = useState<'all' | 'sent' | 'received'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesFilter = filter === 'all' || tx.type === filter;
    const otherParty = tx.type === 'received' ? tx.from : tx.to;
    const matchesSearch = 
      searchQuery === '' ||
      otherParty.handle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.note.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString();
  };

  const totalReceived = mockTransactions
    .filter(tx => tx.type === 'received')
    .reduce((sum, tx) => sum + tx.amount, 0);

  const totalSent = mockTransactions
    .filter(tx => tx.type === 'sent')
    .reduce((sum, tx) => sum + tx.amount, 0);

  return (
    <div className="min-h-screen bg-[#050505] pb-32">
      {/* Header */}
      <div className="p-6 border-b border-white/5">
        <h1 className="text-3xl mb-6">Activity</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#10B981]/20 to-transparent border border-[#10B981]/30 rounded-3xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-[#10B981]" />
              <span className="text-[#94A3B8] text-sm">Received</span>
            </div>
            <p className="balance text-2xl text-[#10B981]">
              +${totalReceived.toFixed(2)}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-br from-[#836EF9]/20 to-transparent border border-[#836EF9]/30 rounded-3xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-[#836EF9]" />
              <span className="text-[#94A3B8] text-sm">Sent</span>
            </div>
            <p className="balance text-2xl text-white">
              -${totalSent.toFixed(2)}
            </p>
          </motion.div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#836EF9] transition-colors"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'received', 'sent'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-6 py-2 rounded-full transition-colors ${
                filter === tab
                  ? 'bg-gradient-to-r from-[#836EF9] to-[#4FFFFF] text-white'
                  : 'bg-white/5 text-[#94A3B8] hover:bg-white/10'
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction List */}
      <div className="px-6 py-4 space-y-3">
        {filteredTransactions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <p className="text-[#94A3B8]">No transactions found</p>
          </motion.div>
        ) : (
          filteredTransactions.map((tx, index) => {
            const otherParty = tx.type === 'received' ? tx.from : tx.to;
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onNavigate('transaction-detail', { transaction: tx })}
                className="bg-white/5 backdrop-blur-sm rounded-3xl p-4 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={otherParty.avatar}
                    alt="Avatar"
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white truncate">
                      {tx.type === 'received' 
                        ? `${otherParty.handle} paid you` 
                        : `You paid ${otherParty.handle}`}
                    </p>
                    <p className="text-[#94A3B8] text-sm truncate">{tx.note}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Zap className="w-3 h-3 text-[#4FFFFF]" />
                      <span className="text-xs text-[#94A3B8]">{formatDate(tx.timestamp)}</span>
                    </div>
                  </div>
                  <div className={`balance text-xl ${tx.type === 'received' ? 'text-[#10B981]' : 'text-white/70'}`}>
                    {tx.type === 'received' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
