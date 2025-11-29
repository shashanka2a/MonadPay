'use client';

import { motion } from 'motion/react';
import { Zap } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  return (
    <motion.div
      className="min-h-screen bg-[#050505] flex flex-col items-center justify-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onAnimationComplete={() => {
        setTimeout(onComplete, 2000);
      }}
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#836EF9] rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 15,
          delay: 0.2,
        }}
        className="relative z-10 mb-8"
      >
        <div className="w-32 h-32 rounded-3xl bg-gradient-to-br from-[#836EF9] to-[#4FFFFF] flex items-center justify-center shadow-2xl shadow-[#836EF9]/50">
          <Zap className="w-20 h-20 text-white" fill="white" />
        </div>
      </motion.div>

      {/* Brand Name */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-center relative z-10"
      >
        <h1 className="text-5xl mb-2 bg-gradient-to-r from-[#836EF9] to-[#4FFFFF] bg-clip-text text-transparent">
          MonadVenmo
        </h1>
        <p className="text-[#94A3B8] mono text-sm">Powered by Monad</p>
      </motion.div>

      {/* Loading Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48 h-1 bg-white/10 rounded-full overflow-hidden"
      >
        <motion.div
          className="h-full bg-gradient-to-r from-[#836EF9] to-[#4FFFFF]"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </motion.div>

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-8 text-[#94A3B8] text-sm"
      >
        10,000 TPS • Sub-cent fees • Instant finality
      </motion.p>
    </motion.div>
  );
}
