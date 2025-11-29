'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Zap, Users, Shield, ChevronRight } from 'lucide-react';

interface TutorialScreenProps {
  onComplete: () => void;
}

const slides = [
  {
    icon: Zap,
    title: 'Lightning Fast Payments',
    description: '10,000 TPS means your payments are confirmed in under 1 second. No more waiting.',
    color: 'from-[#F59E0B] to-[#EF4444]'
  },
  {
    icon: Users,
    title: 'Human-Readable Handles',
    description: 'Say goodbye to 0x addresses. Send money to @alice, not 0x71C7656...',
    color: 'from-[#836EF9] to-[#4FFFFF]'
  },
  {
    icon: Shield,
    title: 'Decentralized & Secure',
    description: 'Your money, your keys. Built on Monad blockchain with sub-cent transaction fees.',
    color: 'from-[#10B981] to-[#4FFFFF]'
  }
];

export function TutorialScreen({ onComplete }: TutorialScreenProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col">
      {/* Skip Button */}
      <div className="p-6 flex justify-end">
        <button
          onClick={handleSkip}
          className="text-[#94A3B8] hover:text-white transition-colors"
        >
          Skip
        </button>
      </div>

      {/* Slides */}
      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md text-center"
          >
            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 15 }}
              className="mb-12 flex justify-center"
            >
              <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${slides[currentSlide].color} flex items-center justify-center shadow-2xl`}>
                {(() => {
                  const Icon = slides[currentSlide].icon;
                  return <Icon className="w-16 h-16 text-white" />;
                })()}
              </div>
            </motion.div>

            {/* Content */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl mb-4"
            >
              {slides[currentSlide].title}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-[#94A3B8] text-lg leading-relaxed"
            >
              {slides[currentSlide].description}
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <div className="p-6 space-y-4">
        {/* Dots */}
        <div className="flex justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all ${
                index === currentSlide 
                  ? 'w-8 bg-gradient-to-r from-[#836EF9] to-[#4FFFFF]' 
                  : 'w-2 bg-white/20'
              }`}
            />
          ))}
        </div>

        {/* Next Button */}
        <button
          onClick={handleNext}
          className="w-full py-6 rounded-full bg-gradient-to-r from-[#836EF9] to-[#4FFFFF] text-white hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
