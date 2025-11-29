'use client';

import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-6 text-center"
    >
      <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6">
        <Icon className="w-12 h-12 text-[#94A3B8]" />
      </div>
      <h3 className="text-xl text-white mb-2">{title}</h3>
      <p className="text-[#94A3B8] mb-6 max-w-sm">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-[#836EF9] to-[#4FFFFF] text-white hover:opacity-90 transition-opacity"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}
