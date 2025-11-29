'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Loader2 } from 'lucide-react';
import { checkHandleAvailability } from '../utils/mockData';
import { User } from '../types';
import { motion, AnimatePresence } from 'motion/react';

interface SendScreenProps {
  onNavigate: (screen: string, data?: any) => void;
}

export function SendScreen({ onNavigate, data }: SendScreenProps & { data?: any }) {
  const [handle, setHandle] = useState(data?.prefilledUser?.handle || '');
  const [amount, setAmount] = useState(data?.prefilledAmount || '');
  const [note, setNote] = useState('');
  const [recipient, setRecipient] = useState<User | null>(data?.prefilledUser || null);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const [showKeypad, setShowKeypad] = useState(false);

  useEffect(() => {
    if (handle.length < 2) {
      setRecipient(null);
      return;
    }

    setIsLookingUp(true);
    const timer = setTimeout(() => {
      const result = checkHandleAvailability(handle);
      if (!result.available && result.user) {
        setRecipient(result.user);
      } else {
        setRecipient(null);
      }
      setIsLookingUp(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [handle]);

  const handleNumberClick = (num: string) => {
    if (num === '.' && amount.includes('.')) return;
    if (amount.includes('.') && amount.split('.')[1].length >= 2) return;
    setAmount((prev: string) => prev + num);
  };

  const handleBackspace = () => {
    setAmount((prev: string) => prev.slice(0, -1));
  };

  const handleSend = () => {
    if (recipient && amount && parseFloat(amount) > 0) {
      onNavigate('confirm', {
        recipient,
        amount: parseFloat(amount),
        note
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center gap-4">
        <button 
          onClick={() => onNavigate('home')}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl">Send Money</h1>
      </div>

      {/* Recipient Input */}
      <div className="px-6 pb-6">
        <label className="block text-[#94A3B8] mb-2">To</label>
        <input
          type="text"
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="@username"
          className="mono w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#836EF9] transition-colors"
          autoFocus
        />

        {/* User Found Card */}
        <AnimatePresence>
          {isLookingUp && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 bg-white/5 rounded-3xl p-4 flex items-center gap-3"
            >
              <Loader2 className="w-5 h-5 text-[#836EF9] animate-spin" />
              <span className="text-[#94A3B8]">Looking up handle...</span>
            </motion.div>
          )}

          {!isLookingUp && recipient && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 bg-gradient-to-r from-[#836EF9]/20 to-[#4FFFFF]/20 border border-[#836EF9]/50 rounded-3xl p-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={recipient.avatar}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="mono text-white">{recipient.handle}</span>
                    <Check className="w-5 h-5 text-[#10B981]" />
                  </div>
                  <p className="mono text-xs text-[#94A3B8]">
                    {recipient.address.slice(0, 6)}...{recipient.address.slice(-4)}
                  </p>
                </div>
                <span className="text-xs text-[#10B981]">Verified Handle</span>
              </div>
            </motion.div>
          )}

          {!isLookingUp && handle.length >= 2 && !recipient && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-4 bg-white/5 rounded-3xl p-4 flex items-center gap-3"
            >
              <span className="text-[#EF4444]">Handle not found</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Amount Display */}
      {recipient && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex-1 flex flex-col justify-center px-6"
        >
          <div className="text-center mb-4">
            <div className="balance text-6xl text-white mb-2">
              {amount || '0'} MON
            </div>
            <p className="text-[#94A3B8]">Enter amount</p>
          </div>

          {/* Note Input */}
          <div className="mb-8 px-4">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note (optional)"
              className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-3 text-center text-white placeholder:text-white/30 focus:outline-none focus:border-[#836EF9] transition-colors"
            />
          </div>

          {/* Numeric Keypad */}
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto w-full">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', '←'].map((key) => (
              <button
                key={key}
                onClick={() => key === '←' ? handleBackspace() : handleNumberClick(key)}
                className="aspect-square rounded-3xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center text-2xl balance"
              >
                {key}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Send Button */}
      {recipient && amount && parseFloat(amount) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6"
        >
          <button
            onClick={handleSend}
            className="w-full py-6 rounded-full bg-gradient-to-r from-[#836EF9] to-[#4FFFFF] text-white text-xl hover:opacity-90 transition-opacity"
          >
            Send to {recipient.handle}
          </button>
        </motion.div>
      )}
    </div>
  );
}
