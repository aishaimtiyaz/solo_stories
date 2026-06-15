'use client';

import { motion } from 'framer-motion';

interface EffortTabsProps {
  selectedEffort: 'low' | 'moderate' | 'high';
  onSelectEffort: (effort: 'low' | 'moderate' | 'high') => void;
}

const tabs = [
  { id: 'low',      label: 'Low Effort',      emoji: '🌙', glow: '#818CF8' },
  { id: 'moderate', label: 'Moderate Effort',  emoji: '⚡', glow: '#A78BFA' },
  { id: 'high',     label: 'High Effort',      emoji: '🔮', glow: '#F5C842' },
] as const;

export default function EffortTabs({ selectedEffort, onSelectEffort }: EffortTabsProps) {
  return (
    <div className="flex justify-center gap-3 mb-6 flex-wrap px-4">
      <p className="w-full text-center text-xs tracking-widest uppercase mb-1"
        style={{ color: 'rgba(196,181,253,0.45)', fontFamily: 'Cinzel, Georgia, serif' }}>
        Energy Level
      </p>
      {tabs.map((tab) => {
        const active = selectedEffort === tab.id;
        return (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => onSelectEffort(tab.id)}
            style={{
              fontFamily: 'Inter, sans-serif',
              border: active ? `1.5px solid ${tab.glow}` : '1.5px solid rgba(124,58,237,0.2)',
              background: active
                ? `linear-gradient(135deg, rgba(124,58,237,0.25) 0%, rgba(30,16,64,0.8) 100%)`
                : 'rgba(15,8,40,0.6)',
              color: active ? '#EDE8FF' : 'rgba(196,181,253,0.55)',
              boxShadow: active ? `0 0 16px ${tab.glow}44, inset 0 0 12px ${tab.glow}11` : 'none',
              backdropFilter: 'blur(8px)',
            }}
            className="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
          >
            <span className="mr-1.5">{tab.emoji}</span>
            {tab.label}
          </motion.button>
        );
      })}
    </div>
  );
}