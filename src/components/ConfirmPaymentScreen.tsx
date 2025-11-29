'use client';

import { ArrowLeft, AlertCircle } from 'lucide-react';
import { User } from '../types';
import { motion } from 'motion/react';
import { useState } from 'react';
import { walletService } from '../utils/wallet';
import { useWallet } from '../hooks/useWallet';

interface ConfirmPaymentScreenProps {
  onNavigate: (screen: string, data?: any) => void;
  data: {
    recipient: User;
    amount: number;
    note?: string;
  };
}

export function ConfirmPaymentScreen({ onNavigate, data }: ConfirmPaymentScreenProps) {
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { recipient, amount, note } = data;
  const { isConnected, address } = useWallet();

  // Get contract addresses from environment or use defaults
  const PAYMENT_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_PAYMENT_CONTRACT_ADDRESS || '';
  const HANDLE_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_HANDLE_REGISTRY_ADDRESS || '';

  const estimatedGas = 0.0008; // Estimated gas in MON
  const total = amount + estimatedGas;

  const handleConfirm = async () => {
    if (!isConnected) {
      setError('Please connect your wallet first');
      return;
    }

    setIsSending(true);
    setError(null);

    try {
      let txHash: string;
      const startTime = Date.now();

      // Check if recipient has a handle or is an address
      if (recipient.handle && recipient.handle.startsWith('@')) {
        // Send via handle
        if (!PAYMENT_CONTRACT_ADDRESS) {
          throw new Error('Payment contract address not configured');
        }
        
        const tx = await walletService.sendPayment(
          recipient.handle,
          amount.toString(),
          note || '',
          PAYMENT_CONTRACT_ADDRESS
        );
        
        txHash = tx.hash;
      } else {
        // Send directly to address
        if (!PAYMENT_CONTRACT_ADDRESS) {
          throw new Error('Payment contract address not configured');
        }
        
        const tx = await walletService.sendPaymentToAddress(
          recipient.address,
          amount.toString(),
          note || '',
          PAYMENT_CONTRACT_ADDRESS
        );
        
        txHash = tx.hash;
      }

      // Wait for transaction confirmation
      const receipt = await walletService.waitForTransaction(txHash);
      const duration = (Date.now() - startTime) / 1000;
      const gasUsed = parseFloat(receipt.gasUsed.toString()) * parseFloat(receipt.gasPrice?.toString() || '0') / 1e18;

      onNavigate('success', {
        recipient,
        amount,
        note,
        txHash,
        duration,
        gasUsed,
        blockNumber: receipt.blockNumber,
      });
    } catch (err: any) {
      console.error('Transaction error:', err);
      setError(err.message || 'Transaction failed. Please try again.');
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center gap-4">
        <button 
          onClick={() => onNavigate('send')}
          className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          disabled={isSending}
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        <h1 className="text-2xl">Confirm Payment</h1>
      </div>

      <div className="flex-1 px-6 py-8 pb-28 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Recipient Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#836EF9]/20 to-[#4FFFFF]/20 border border-[#836EF9]/50 rounded-3xl p-6"
          >
            <p className="text-[#94A3B8] text-sm mb-4">Sending to</p>
            <div className="flex items-center gap-4">
              <img
                src={recipient.avatar}
                alt="Avatar"
                className="w-16 h-16 rounded-full"
              />
              <div className="flex-1">
                <p className="mono text-2xl text-white">{recipient.handle}</p>
                <p className="mono text-xs text-[#94A3B8] mt-1">
                  {recipient.address.slice(0, 6)}...{recipient.address.slice(-4)}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Amount Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#94A3B8]">Amount</span>
                <span className="balance text-3xl text-white">{amount.toFixed(4)} MON</span>
              </div>
              
              {note && (
                <div className="pt-4 border-t border-white/10">
                  <p className="text-[#94A3B8] text-sm mb-2">Note</p>
                  <p className="text-white">{note}</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Fee Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 backdrop-blur-sm rounded-3xl p-6 border border-white/10"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#94A3B8]">Network Fee</span>
                <span className="balance text-[#10B981]">~{estimatedGas.toFixed(4)} MON</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#94A3B8]">Estimated Time</span>
                <span className="balance text-[#4FFFFF]">&lt; 1s</span>
              </div>
              <div className="pt-3 border-t border-white/10 flex justify-between items-center">
                <span className="text-white">Total</span>
                <span className="balance text-2xl text-white">{total.toFixed(4)} MON</span>
              </div>
            </div>
          </motion.div>

          {/* Warning */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3 p-4 bg-[#836EF9]/10 border border-[#836EF9]/30 rounded-2xl"
          >
            <AlertCircle className="w-5 h-5 text-[#836EF9] flex-shrink-0 mt-0.5" />
            <p className="text-sm text-[#94A3B8]">
              Double-check the recipient before confirming. Blockchain transactions are irreversible.
            </p>
          </motion.div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-[#EF4444]/10 border border-[#EF4444]/30 rounded-2xl"
            >
              <p className="text-sm text-[#EF4444]">{error}</p>
            </motion.div>
          )}
        </div>

        {/* Confirm Button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          onClick={handleConfirm}
          disabled={isSending}
          className="w-full py-6 rounded-full bg-gradient-to-r from-[#836EF9] to-[#4FFFFF] text-white text-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-3 shadow-lg"
        >
          {isSending ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
              />
              Processing...
            </>
          ) : (
            `Confirm & Send ${amount.toFixed(4)} MON`
          )}
        </motion.button>
      </div>
    </div>
  );
}
