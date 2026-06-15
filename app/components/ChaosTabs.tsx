'use client';

import { motion } from 'framer-motion';

interface ChaosTabsProps {
  selectedChaos: 'normal' | 'funny' | 'crazy';
  onSelectChaos: (chaos: 'normal' | 'funny' | 'crazy') => void;
}

const chaosOptions = [
  { value: 'normal', label: 'Normal',  icon: '✨', glow: '#60A5FA', desc: 'Peaceful & grounded' },
  { value: 'funny',  label: 'Funny',   icon: '😂', glow: '#FBBF24', desc: 'Weird & wonderful'  },
  { value: 'crazy',  label: 'Chaos',   icon: '🔥', glow: '#F87171', desc: 'Total wild card'    },
] as const;

export default function ChaosTabs({ selectedChaos, onSelectChaos }: ChaosTabsProps) {
  return (
    <div className="flex flex-col items-center mb-10 gap-3">
      <p className="text-xs tracking-widest uppercase"
        style={{ color: 'rgba(196,181,253,0.45)', fontFamily: 'Cinzel, Georgia, serif' }}>
        Chaos Mode
      </p>
      <div className="flex gap-3 flex-wrap justify-center">
        {chaosOptions.map((option) => {
          const active = selectedChaos === option.value;
          return (
            <motion.button
              key={option.value}
              whileHover={{ scale: 1.04, y: -1 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelectChaos(option.value)}
              style={{
                fontFamily: 'Inter, sans-serif',
                border: active ? `1.5px solid ${option.glow}` : '1.5px solid rgba(124,58,237,0.2)',
                background: active
                  ? `linear-gradient(135deg, ${option.glow}22 0%, rgba(15,8,40,0.9) 100%)`
                  : 'rgba(15,8,40,0.6)',
                color: active ? '#EDE8FF' : 'rgba(196,181,253,0.5)',
                boxShadow: active ? `0 0 20px ${option.glow}55, inset 0 0 10px ${option.glow}0A` : 'none',
                backdropFilter: 'blur(8px)',
                minWidth: 110,
              }}
              className="px-5 py-3 rounded-2xl text-sm font-medium transition-all duration-300 flex flex-col items-center gap-0.5 cursor-pointer"
            >
              <span className="text-xl leading-none">{option.icon}</span>
              <span className="font-semibold">{option.label}</span>
              {active && (
                <span className="text-xs opacity-60" style={{ color: option.glow }}>
                  {option.desc}
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}