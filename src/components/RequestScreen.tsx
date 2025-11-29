'use client';

import { useState } from 'react';
import { ArrowLeft, QrCode, Share2, Copy, Check } from 'lucide-react';
import { currentUser } from '../utils/mockData';
import { motion } from 'motion/react';
import QRCode from 'react-qr-code';

interface RequestScreenProps {
  onNavigate: (screen: string) => void;
}

export function RequestScreen({ onNavigate }: RequestScreenProps) {
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleNumberClick = (num: string) => {
    if (num === '.' && amount.includes('.')) return;
    if (amount.includes('.') && amount.split('.')[1].length >= 2) return;
    setAmount(prev => prev + num);
  };

  const handleBackspace = () => {
    setAmount(prev => prev.slice(0, -1));
  };

  const handleGenerateRequest = () => {
    if (amount && parseFloat(amount) > 0) {
      setShowQR(true);
    }
  };

  const requestData = {
    handle: currentUser.handle,
    amount: parseFloat(amount) || 0,
    note,
    address: currentUser.address
  };

  const requestLink = `monadpay://pay/${currentUser.handle}?amount=${amount}&note=${encodeURIComponent(note)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(requestLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: 'monadpay Request',
        text: `${currentUser.handle} is requesting ${amount} MON${note ? ` for ${note}` : ''}`,
        url: requestLink
      });
    }
  };

  if (showQR) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col">
        {/* Header */}
        <div className="p-6 flex items-center gap-4">
          <button 
            onClick={() => setShowQR(false)}
            className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-2xl">Payment Request</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-20">
          {/* QR Code */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white p-8 rounded-3xl mb-8"
          >
            <QRCode
              value={JSON.stringify(requestData)}
              size={256}
              level="H"
              fgColor="#050505"
            />
          </motion.div>

          {/* Request Details */}
          <div className="text-center mb-8">
            <p className="text-[#94A3B8] mb-2">Requesting</p>
            <p className="balance text-5xl text-white mb-4">{amount} MON</p>
            {note && (
              <p className="text-[#94A3B8]">{note}</p>
            )}
            <p className="mono text-[#4FFFFF] mt-4">{currentUser.handle}</p>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-md space-y-3">
            <button
              onClick={handleShare}
              className="w-full py-4 rounded-full bg-gradient-to-r from-[#836EF9] to-[#4FFFFF] text-white flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <Share2 className="w-5 h-5" />
              Share Request
            </button>
            <button
              onClick={handleCopy}
              className="w-full py-4 rounded-full border-2 border-[#4FFFFF] text-[#4FFFFF] flex items-center justify-center gap-2 hover:bg-[#4FFFFF]/10 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-5 h-5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="w-5 h-5" />
                  Copy Link
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

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
        <h1 className="text-2xl">Request Money</h1>
      </div>

      {/* Amount Display */}
      <div className="flex-1 flex flex-col justify-center px-6">
        <div className="text-center mb-8">
          <div className="balance text-6xl text-white mb-2">
            {amount || '0'} MON
          </div>
          <p className="text-[#94A3B8]">Enter amount to request</p>
        </div>

        {/* Note Input */}
        <div className="mb-8">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's it for? (optional)"
            className="w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-4 text-center text-white placeholder:text-white/30 focus:outline-none focus:border-[#836EF9] transition-colors"
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
      </div>

      {/* Generate QR Button */}
      {amount && parseFloat(amount) > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6"
        >
          <button
            onClick={handleGenerateRequest}
            className="w-full py-6 rounded-full bg-gradient-to-r from-[#836EF9] to-[#4FFFFF] text-white text-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <QrCode className="w-6 h-6" />
            Generate QR Code
          </button>
        </motion.div>
      )}
    </div>
  );
}
