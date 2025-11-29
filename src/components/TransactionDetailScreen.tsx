'use client';

import { ArrowLeft, Copy, ExternalLink, Check, TrendingUp, TrendingDown } from 'lucide-react';
import { Transaction } from '../types';
import { motion } from 'motion/react';
import { useState } from 'react';

interface TransactionDetailScreenProps {
  onNavigate: (screen: string) => void;
  transaction: Transaction;
}

export function TransactionDetailScreen({ onNavigate, transaction }: TransactionDetailScreenProps) {
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState(false);
  
  const otherParty = transaction.type === 'received' ? transaction.from : transaction.to;
  const txHash = transaction.id;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(txHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(otherParty.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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
        <h1 className="text-2xl">Transaction Details</h1>
      </div>

      <div className="p-6 space-y-6">
        {/* Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm rounded-3xl p-8 text-center border border-white/10"
        >
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            transaction.type === 'received' 
              ? 'bg-[#10B981]/20 border-2 border-[#10B981]' 
              : 'bg-[#836EF9]/20 border-2 border-[#836EF9]'
          }`}>
            {transaction.type === 'received' ? (
              <TrendingUp className="w-8 h-8 text-[#10B981]" />
            ) : (
              <TrendingDown className="w-8 h-8 text-[#836EF9]" />
            )}
          </div>
          <p className="text-[#94A3B8] mb-2">
            {transaction.type === 'received' ? 'Received from' : 'Sent to'}
          </p>
          <p className="mono text-2xl text-white mb-4">{otherParty.handle}</p>
          <p className={`balance text-5xl ${transaction.type === 'received' ? 'text-[#10B981]' : 'text-white'}`}>
            {transaction.type === 'received' ? '+' : '-'}${transaction.amount.toFixed(2)}
          </p>
          {transaction.note && (
            <p className="text-[#94A3B8] mt-4 text-lg">{transaction.note}</p>
          )}
        </motion.div>

        {/* Details Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 space-y-4 border border-white/10"
        >
          <h3 className="text-lg mb-4">Transaction Information</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-[#94A3B8]">Status</span>
              <span className="text-[#10B981] flex items-center gap-2">
                <Check className="w-4 h-4" />
                Confirmed
              </span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-[#94A3B8]">Date & Time</span>
              <span className="text-white text-right text-sm">{formatDate(transaction.timestamp)}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-[#94A3B8]">Processing Time</span>
              <span className="text-[#4FFFFF] balance">{transaction.duration.toFixed(2)}s</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-white/5">
              <span className="text-[#94A3B8]">Network Fee</span>
              <span className="text-[#10B981] balance">${transaction.gasUsed.toFixed(4)}</span>
            </div>
          </div>
        </motion.div>

        {/* Blockchain Details */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 space-y-4 border border-white/10"
        >
          <h3 className="text-lg mb-4">Blockchain Details</h3>
          
          {/* Transaction Hash */}
          <div>
            <p className="text-[#94A3B8] text-sm mb-2">Transaction Hash</p>
            <div className="flex items-center gap-2 bg-white/5 rounded-2xl p-3">
              <code className="mono text-xs text-white/70 flex-1 overflow-hidden text-ellipsis">
                {txHash}
              </code>
              <button
                onClick={handleCopyHash}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
              >
                {copiedHash ? (
                  <Check className="w-4 h-4 text-[#10B981]" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Address */}
          <div>
            <p className="text-[#94A3B8] text-sm mb-2">
              {transaction.type === 'received' ? 'From Address' : 'To Address'}
            </p>
            <div className="flex items-center gap-2 bg-white/5 rounded-2xl p-3">
              <code className="mono text-xs text-white/70 flex-1 overflow-hidden text-ellipsis">
                {otherParty.address}
              </code>
              <button
                onClick={handleCopyAddress}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
              >
                {copiedAddress ? (
                  <Check className="w-4 h-4 text-[#10B981]" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
          </div>

          {/* Explorer Link */}
          <button className="w-full py-4 rounded-2xl border border-[#4FFFFF] text-[#4FFFFF] hover:bg-[#4FFFFF]/10 transition-colors flex items-center justify-center gap-2">
            <ExternalLink className="w-5 h-5" />
            View on Monad Explorer
          </button>
        </motion.div>
      </div>
    </div>
  );
}
