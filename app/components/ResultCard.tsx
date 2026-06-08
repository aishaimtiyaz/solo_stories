'use client';

import { motion } from 'framer-motion';

interface ResultCardProps {
  date: {
    emoji: string;
    title: string;
    duration: string;
    budget: string;
    mood: string;
    description: string;
  };
  onViewChecklist: () => void;
}

export default function ResultCard({ date, onViewChecklist }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-8 max-w-2xl mx-auto mb-8"
    >
      <div className="text-6xl mb-4 text-center">{date.emoji}</div>

      <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-white">
        {date.title}
      </h2>

      <p className="text-gray-700 dark:text-gray-300 text-center text-lg mb-6">
        {date.description}
      </p>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
            DURATION
          </p>
          <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
            {date.duration}
          </p>
        </div>

        <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold">
            BUDGET
          </p>
          <p className="text-lg font-bold text-orange-600 dark:text-orange-400">
            {date.budget}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 rounded-lg p-4 text-center mb-6">
        <p className="text-gray-600 dark:text-gray-400 text-sm font-semibold mb-1">
          MOOD
        </p>
        <p className="text-lg font-bold text-amber-600 dark:text-amber-400 capitalize">
          {date.mood}
        </p>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onViewChecklist}
        className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold py-3 rounded-lg transition-all duration-300 hover:shadow-lg"
      >
        View Checklist →
      </motion.button>
    </motion.div>
  );
}
