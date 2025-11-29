'use client';

import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import { useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export function Toast({ message, type, isVisible, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const icons = {
    success: CheckCircle2,
    error: XCircle,
    warning: AlertCircle,
    info: Info
  };

  const colors = {
    success: {
      bg: 'bg-[#10B981]/20',
      border: 'border-[#10B981]',
      icon: 'text-[#10B981]'
    },
    error: {
      bg: 'bg-[#EF4444]/20',
      border: 'border-[#EF4444]',
      icon: 'text-[#EF4444]'
    },
    warning: {
      bg: 'bg-[#F59E0B]/20',
      border: 'border-[#F59E0B]',
      icon: 'text-[#F59E0B]'
    },
    info: {
      bg: 'bg-[#4FFFFF]/20',
      border: 'border-[#4FFFFF]',
      icon: 'text-[#4FFFFF]'
    }
  };

  const Icon = icons[type];
  const style = colors[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -100, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -100, scale: 0.8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[calc(100%-3rem)]"
        >
          <div className={`${style.bg} ${style.border} border backdrop-blur-xl rounded-2xl p-4 shadow-2xl`}>
            <div className="flex items-center gap-3">
              <Icon className={`w-5 h-5 ${style.icon} flex-shrink-0`} />
              <p className="text-white flex-1">{message}</p>
              <button
                onClick={onClose}
                className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
