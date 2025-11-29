'use client';

import { CheckCircle2, Copy } from 'lucide-react';
import { motion } from 'motion/react';
import { User } from '../types';
import { useState } from 'react';

interface SuccessScreenProps {
  onNavigate: (screen: string) => void;
  data: {
    recipient: User;
    amount: number;
    duration: number;
    gasUsed: number;
  };
}

export function SuccessScreen({ onNavigate, data }: SuccessScreenProps) {
  const [copied, setCopied] = useState(false);
  const txHash = '0x' + Math.random().toString(16).slice(2, 66);

  const handleCopy = () => {
    navigator.clipboard.writeText(txHash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Warp Speed Tunnel Effect */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              width: `${(i + 1) * 100}px`,
              height: `${(i + 1) * 100}px`,
              border: '1px solid rgba(131, 110, 249, 0.2)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 2, opacity: [0, 0.5, 0] }}
            transition={{
              duration: 2,
              delay: i * 0.05,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md text-center">
        {/* Animated Checkmark */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className="mb-8 flex justify-center"
        >
          <div className="relative">
            <motion.div
              animate={{
                boxShadow: [
                  '0 0 20px rgba(131, 110, 249, 0.5)',
                  '0 0 60px rgba(131, 110, 249, 0.8)',
                  '0 0 20px rgba(131, 110, 249, 0.5)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="w-32 h-32 rounded-full bg-gradient-to-br from-[#836EF9] to-[#4FFFFF] flex items-center justify-center"
            >
              <CheckCircle2 className="w-20 h-20 text-white" strokeWidth={2.5} />
            </motion.div>
          </div>
        </motion.div>

        {/* Success Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="text-4xl mb-4">Payment Sent!</h1>
          <p className="text-xl text-white/80 mb-2">
            Sent <span className="balance text-[#4FFFFF]">${data.amount.toFixed(2)}</span> to{' '}
            <span className="mono text-[#836EF9]">{data.recipient.handle}</span>
          </p>
        </motion.div>

        {/* Performance Metrics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 space-y-4"
        >
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-[#94A3B8] text-sm mb-1">Time</p>
                <p className="balance text-2xl text-[#4FFFFF]">{data.duration.toFixed(1)}s</p>
              </div>
              <div>
                <p className="text-[#94A3B8] text-sm mb-1">Gas Fee</p>
                <p className="balance text-2xl text-[#10B981]">&lt; ${data.gasUsed.toFixed(4)}</p>
              </div>
            </div>
          </div>

          {/* Transaction Hash Receipt */}
          <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10">
            <p className="text-[#94A3B8] text-sm mb-3">Transaction Hash</p>
            <div className="flex items-center gap-3">
              <code className="mono text-xs text-white/70 flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                {txHash}
              </code>
              <button
                onClick={handleCopy}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                ) : (
                  <Copy className="w-4 h-4 text-white" />
                )}
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[#94A3B8]">Powered by Monad</span>
              <span className="text-[#4FFFFF]">10,000 TPS ⚡</span>
            </div>
          </div>
        </motion.div>

        {/* Done Button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={() => onNavigate('home')}
          className="mt-12 w-full py-6 rounded-full border-2 border-white/20 text-white hover:bg-white/5 transition-colors"
        >
          Done
        </motion.button>
      </div>
    </div>
  );
}
