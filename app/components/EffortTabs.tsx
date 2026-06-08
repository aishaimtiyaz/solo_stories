'use client';

import { motion } from 'framer-motion';

interface EffortTabsProps {
  selectedEffort: 'low' | 'moderate' | 'high';
  onSelectEffort: (effort: 'low' | 'moderate' | 'high') => void;
}

export default function EffortTabs({
  selectedEffort,
  onSelectEffort,
}: EffortTabsProps) {
  const tabs = [
    { id: 'low', label: 'Low Effort', emoji: '😌' },
    { id: 'moderate', label: 'Moderate Effort', emoji: '🤔' },
    { id: 'high', label: 'High Effort', emoji: '🚀' },
  ] as const;

  return (
    <div className="flex justify-center gap-3 mb-8 flex-wrap px-4">
      {tabs.map((tab) => (
        <motion.button
          key={tab.id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelectEffort(tab.id)}
          className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
            selectedEffort === tab.id
              ? 'bg-purple-600 text-white shadow-lg'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200'
          }`}
        >
          <span className="mr-2">{tab.emoji}</span>
          {tab.label}
        </motion.button>
      ))}
    </div>
  );
}
