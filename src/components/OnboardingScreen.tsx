'use client';

import { useState, useEffect } from 'react';
import { Check, X, Loader2, Key, Wallet, Plus, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { checkHandleAvailability } from '../utils/mockData';
import { motion, AnimatePresence } from 'motion/react';

interface OnboardingScreenProps {
  onNavigate: (screen: string) => void;
}

type OnboardingStep = 'choice' | 'connect' | 'create';

export function OnboardingScreen({ onNavigate }: OnboardingScreenProps) {
  const [step, setStep] = useState<OnboardingStep>('choice');
  const [handle, setHandle] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isMinting, setIsMinting] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (handle.length < 2) {
      setIsAvailable(null);
      return;
    }

    setIsChecking(true);
    const timer = setTimeout(() => {
      const result = checkHandleAvailability(handle);
      setIsAvailable(result.available);
      setIsChecking(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [handle]);

  const handleConnectWallet = () => {
    setIsConnecting(true);
    // Simulate wallet connection (MetaMask, WalletConnect, etc.)
    setTimeout(() => {
      // Mock wallet address
      const mockAddress = '0x' + Math.random().toString(16).substr(2, 40);
      setWalletAddress(mockAddress);
      setIsConnecting(false);
    }, 1500);
  };

  const handleMintOrMap = () => {
    setIsMinting(true);
    setTimeout(() => {
      onNavigate('home');
    }, 2000);
  };

  // Matrix rain effect characters
  const matrixChars = '01';
  const columns = 20;

  return (
    <div className="min-h-screen bg-[#050505] relative overflow-hidden flex flex-col items-center justify-center p-6">
      {/* Matrix Rain Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="flex justify-around h-full">
          {Array.from({ length: columns }).map((_, i) => (
            <motion.div
              key={i}
              className="mono text-[#836EF9] text-xs"
              initial={{ y: -100 }}
              animate={{ y: '100vh' }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear'
              }}
            >
              {Array.from({ length: 30 }).map((_, j) => (
                <div key={j}>
                  {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        <AnimatePresence mode="wait">
          {/* Step 1: Choice Screen */}
          {step === 'choice' && (
            <motion.div
              key="choice"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* 3D Isometric Key Illustration */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-12 flex justify-center"
              >
                <div className="relative w-32 h-32">
                  <motion.div
                    animate={{
                      rotateY: [0, 360],
                    }}
                    transition={{
                      duration: 10,
                      repeat: Infinity,
                      ease: 'linear'
                    }}
                    className="w-full h-full rounded-3xl bg-gradient-to-br from-[#836EF9] to-[#4FFFFF] flex items-center justify-center shadow-2xl shadow-[#836EF9]/50"
                  >
                    <Key className="w-16 h-16 text-white" />
                  </motion.div>
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#836EF9] to-[#4FFFFF] blur-2xl opacity-50" />
                </div>
              </motion.div>

              <h1 className="text-4xl text-center mb-3">
                Welcome to MonadVenmo
              </h1>
              <p className="text-center text-[#94A3B8] mb-12">
                Choose how you'd like to get started
              </p>

              {/* Option Cards */}
              <div className="space-y-4 mb-8">
                {/* Connect Existing Wallet */}
                <motion.button
                  onClick={() => setStep('connect')}
                  className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#836EF9] hover:bg-white/10 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#836EF9] to-[#4FFFFF] flex items-center justify-center flex-shrink-0">
                      <LinkIcon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl mb-1">Connect Existing Wallet</h3>
                      <p className="text-[#94A3B8]">
                        Already have a Monad wallet? Connect and claim your handle.
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#836EF9] opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                  </div>
                </motion.button>

                {/* Create New Wallet */}
                <motion.button
                  onClick={() => setStep('create')}
                  className="w-full p-6 rounded-3xl bg-white/5 border border-white/10 hover:border-[#4FFFFF] hover:bg-white/10 transition-all group"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#4FFFFF] to-[#836EF9] flex items-center justify-center flex-shrink-0">
                      <Plus className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-xl mb-1">Create New Wallet</h3>
                      <p className="text-[#94A3B8]">
                        New to Web3? We'll create a secure wallet for you.
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-[#4FFFFF] opacity-0 group-hover:opacity-100 transition-opacity mt-1" />
                  </div>
                </motion.button>
              </div>

              {/* Skip Link */}
              <button
                onClick={() => onNavigate('home')}
                className="w-full mt-4 text-[#94A3B8] hover:text-white transition-colors"
              >
                Skip for now
              </button>
            </motion.div>
          )}

          {/* Step 2: Connect Existing Wallet */}
          {step === 'connect' && (
            <motion.div
              key="connect"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back Button */}
              <button
                onClick={() => setStep('choice')}
                className="mb-6 text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back
              </button>

              <div className="text-center mb-8">
                <div className="inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-[#836EF9] to-[#4FFFFF] items-center justify-center mb-6">
                  <Wallet className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl mb-3">
                  Connect Your Wallet
                </h1>
                <p className="text-[#94A3B8]">
                  Link your existing Monad wallet to claim your handle
                </p>
              </div>

              {!walletAddress ? (
                <div className="space-y-4 mb-8">
                  {/* Wallet Options */}
                  <button
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#836EF9] hover:bg-white/10 transition-all flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="w-6 h-6 text-[#836EF9]" />
                      <span className="text-xl">MetaMask</span>
                    </div>
                    {isConnecting && <Loader2 className="w-5 h-5 animate-spin text-[#836EF9]" />}
                  </button>

                  <button
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                    className="w-full p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-[#836EF9] hover:bg-white/10 transition-all flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <Wallet className="w-6 h-6 text-[#4FFFFF]" />
                      <span className="text-xl">WalletConnect</span>
                    </div>
                    {isConnecting && <Loader2 className="w-5 h-5 animate-spin text-[#4FFFFF]" />}
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Connected Wallet Display */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-[#10B981]">
                    <div className="flex items-center gap-3 mb-2">
                      <Check className="w-5 h-5 text-[#10B981]" />
                      <span className="text-[#10B981]">Wallet Connected</span>
                    </div>
                    <div className="mono text-[#94A3B8] text-sm">
                      {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </div>
                  </div>

                  {/* Handle Input */}
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        value={handle}
                        onChange={(e) => setHandle(e.target.value.replace(/[^a-z0-9_]/g, ''))}
                        placeholder="Choose your handle (e.g. satoshi)"
                        className="mono w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 pr-14 text-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#836EF9] transition-colors"
                        autoFocus
                      />
                      <div className="absolute right-5 top-1/2 -translate-y-1/2">
                        {isChecking && <Loader2 className="w-6 h-6 text-[#836EF9] animate-spin" />}
                        {!isChecking && isAvailable === true && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <Check className="w-6 h-6 text-[#10B981]" />
                          </motion.div>
                        )}
                        {!isChecking && isAvailable === false && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <X className="w-6 h-6 text-[#EF4444]" />
                          </motion.div>
                        )}
                      </div>
                    </div>

                    {/* Status Messages */}
                    <div className="mt-3 px-2 min-h-[24px]">
                      {!isChecking && isAvailable === true && handle.length >= 2 && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-[#10B981]"
                        >
                          <Check className="w-4 h-4" />
                          <span>Available</span>
                        </motion.div>
                      )}
                      {!isChecking && isAvailable === false && (
                        <motion.div
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-2 text-[#EF4444]"
                        >
                          <X className="w-4 h-4" />
                          <span>Handle already taken</span>
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Fee Display */}
                  <div className="bg-white/5 rounded-2xl p-4 border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-[#94A3B8]">Mapping Fee</span>
                      <span className="balance text-white">0.001 MON</span>
                    </div>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-[#94A3B8] text-sm">~$0.01 USD</span>
                      <span className="text-[#4FFFFF] text-sm">+ Gas: &lt; $0.001</span>
                    </div>
                  </div>

                  {/* Map Button */}
                  <button
                    onClick={handleMintOrMap}
                    disabled={!isAvailable || isChecking || isMinting || handle.length < 2}
                    className="w-full py-6 rounded-full bg-gradient-to-r from-[#836EF9] to-[#4FFFFF] text-white text-xl disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    {isMinting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Mapping Handle...
                      </>
                    ) : (
                      'Map Handle to Wallet'
                    )}
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Step 3: Create New Wallet */}
          {step === 'create' && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Back Button */}
              <button
                onClick={() => setStep('choice')}
                className="mb-6 text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2"
              >
                <ArrowRight className="w-4 h-4 rotate-180" />
                Back
              </button>

              <div className="text-center mb-8">
                <div className="inline-flex w-20 h-20 rounded-3xl bg-gradient-to-br from-[#4FFFFF] to-[#836EF9] items-center justify-center mb-6">
                  <Plus className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-4xl mb-3">
                  Claim Your Identity
                </h1>
                <p className="text-[#94A3B8]">
                  Choose your handle and we'll create a wallet for you
                </p>
              </div>

              {/* Handle Input */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value.replace(/[^a-z0-9_]/g, ''))}
                    placeholder="Enter desired handle (e.g. satoshi)"
                    className="mono w-full bg-white/5 border border-white/10 rounded-3xl px-6 py-5 pr-14 text-xl text-white placeholder:text-white/30 focus:outline-none focus:border-[#836EF9] transition-colors"
                    autoFocus
                  />
                  <div className="absolute right-5 top-1/2 -translate-y-1/2">
                    {isChecking && <Loader2 className="w-6 h-6 text-[#836EF9] animate-spin" />}
                    {!isChecking && isAvailable === true && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-6 h-6 text-[#10B981]" />
                      </motion.div>
                    )}
                    {!isChecking && isAvailable === false && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <X className="w-6 h-6 text-[#EF4444]" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Status Messages */}
                <div className="mt-3 px-2 min-h-[24px]">
                  {!isChecking && isAvailable === true && handle.length >= 2 && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-[#10B981]"
                    >
                      <Check className="w-4 h-4" />
                      <span>Available</span>
                    </motion.div>
                  )}
                  {!isChecking && isAvailable === false && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-center gap-2 text-[#EF4444]"
                    >
                      <X className="w-4 h-4" />
                      <span>Handle already taken</span>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Info Box */}
              <div className="bg-[#4FFFFF]/10 border border-[#4FFFFF]/20 rounded-2xl p-4 mb-6">
                <div className="flex gap-3">
                  <Key className="w-5 h-5 text-[#4FFFFF] flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="text-sm text-[#4FFFFF] mb-1">Secure Wallet Creation</div>
                    <div className="text-xs text-[#94A3B8]">
                      We'll generate a secure wallet and provide you with a recovery phrase. Keep it safe!
                    </div>
                  </div>
                </div>
              </div>

              {/* Fee Display */}
              <div className="bg-white/5 rounded-2xl p-4 mb-8 border border-white/10">
                <div className="flex justify-between items-center">
                  <span className="text-[#94A3B8]">Registration Fee</span>
                  <span className="balance text-white">0.001 MON</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-[#94A3B8] text-sm">~$0.01 USD</span>
                  <span className="text-[#4FFFFF] text-sm">+ Gas: &lt; $0.001</span>
                </div>
              </div>

              {/* Create Button */}
              <button
                onClick={handleMintOrMap}
                disabled={!isAvailable || isChecking || isMinting || handle.length < 2}
                className="w-full py-6 rounded-full bg-gradient-to-r from-[#836EF9] to-[#4FFFFF] text-white text-xl disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                {isMinting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Wallet...
                  </>
                ) : (
                  'Create Wallet & Claim Handle'
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
