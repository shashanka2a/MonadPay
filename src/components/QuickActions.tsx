'use client';

import { motion } from 'motion/react';
import { Send, Download, QrCode, Users, ArrowLeftRight } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
}

const actions = [
  { id: 'send', icon: Send, label: 'Send', color: 'from-[#836EF9] to-[#4FFFFF]' },
  { id: 'request', icon: Download, label: 'Request', color: 'from-[#10B981] to-[#4FFFFF]' },
  { id: 'scan', icon: QrCode, label: 'Scan', color: 'from-[#F59E0B] to-[#EF4444]' },
  { id: 'contacts', icon: Users, label: 'Contacts', color: 'from-[#EC4899] to-[#8B5CF6]' },
];

export function QuickActions({ onAction }: QuickActionsProps) {
  return (
    <div className="px-6 py-8">
      <h3 className="text-lg text-white/90 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-4 gap-4">
        {actions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onAction(action.id)}
              className="flex flex-col items-center gap-3 group"
            >
              <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <span className="text-sm text-[#94A3B8] group-hover:text-white transition-colors">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
