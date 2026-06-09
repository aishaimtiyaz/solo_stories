'use client';

import { motion } from 'framer-motion';

interface ChaosTabsProps {
  selectedChaos: 'normal' | 'funny' | 'crazy';
  onSelectChaos: (chaos: 'normal' | 'funny' | 'crazy') => void;
}

const chaosOptions = [
  {
    value: 'normal',
    label: '✨ Normal',
    color: 'from-blue-400 to-blue-500',
  },
  {
    value: 'funny',
    label: '😂 Funny',
    color: 'from-yellow-400 to-orange-400',
  },
  {
    value: 'crazy',
    label: '🔥 Crazy',
    color: 'from-red-400 to-pink-500',
  },
] as const;

export default function ChaosTabs({
  selectedChaos,
  onSelectChaos,
}: ChaosTabsProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {chaosOptions.map((option) => {
        const isSelected = selectedChaos === option.value;

        return (
          <motion.button
            key={option.value}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectChaos(option.value)}
            className={`relative px-5 py-3 rounded-full font-semibold transition-all duration-300 ${
              isSelected
                ? `bg-gradient-to-r ${option.color} text-white shadow-lg`
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {isSelected && (
              <motion.div
                layoutId="chaosTab"
                className="absolute inset-0 rounded-full"
                transition={{
                  type: 'spring',
                  stiffness: 300,
                  damping: 30,
                }}
              />
            )}

            <span className="relative z-10">{option.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}
