'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useTasks from '@/hooks/useTasks';
import confetti from 'canvas-confetti';

interface ChecklistProps {
  date: {
    emoji: string;
    title: string;
    steps: string[];
  };
  onBack: () => void;
  onShare: () => void;
}

export default function Checklist({ date, onBack, onShare }: ChecklistProps) {
  const [checkedItems, setCheckedItems] = useState<boolean[]>(
    new Array(date.steps.length).fill(false)
  );
  const { getTask, toggleStep } = useTasks();
  const [showCelebration, setShowCelebration] = useState(false);

  const allChecked = checkedItems.every((item) => item);

  useEffect(() => {
    if (allChecked && checkedItems.some((item) => item)) {
      setShowCelebration(true);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    } else {
      setShowCelebration(false);
    }
  }, [allChecked, checkedItems]);

  // hydrate from storage when component mounts for this date
  useEffect(() => {
    const stored = getTask((date as any).id);
    if (stored && Array.isArray(stored.stepsChecked)) {
      setCheckedItems(stored.stepsChecked.slice(0, date.steps.length));
    }
  }, [date, getTask]);

  const toggleItem = (index: number) => {
    const updated = toggleStep((date as any).id, index);
    if (updated) {
      setCheckedItems(updated.slice(0, date.steps.length));
    } else {
      // fallback to local toggle if storage toggle failed
      const newCheckedItems = [...checkedItems];
      newCheckedItems[index] = !newCheckedItems[index];
      setCheckedItems(newCheckedItems);
    }
  };

  const toggleAll = () => {
    if (allChecked) {
      setCheckedItems(new Array(date.steps.length).fill(false));
    } else {
      setCheckedItems(new Array(date.steps.length).fill(true));
    }
  };

  const completedCount = checkedItems.filter((item) => item).length;
  const progressPercent = (completedCount / date.steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">
            {date.emoji} {date.title}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {completedCount} of {date.steps.length} completed
          </p>
        </div>
        <button
          onClick={onBack}
          className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-2xl"
        >
          ✕
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-6 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.5 }}
          className="bg-linear-to-r from-purple-500 to-purple-600 h-full"
        />
      </div>

      {/* Checklist Items */}
      <div className="space-y-3 mb-8">
        {date.steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer"
            onClick={() => toggleItem(index)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className={`flex-shrink-0 w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                checkedItems[index]
                  ? 'bg-purple-600 border-purple-600'
                  : 'border-gray-300 dark:border-gray-600'
              }`}
            >
              {checkedItems[index] && (
                <span className="text-white text-sm font-bold">✓</span>
              )}
            </motion.div>
            <span
              className={`flex-1 ${
                checkedItems[index]
                  ? 'line-through text-gray-400 dark:text-gray-500'
                  : 'text-gray-700 dark:text-gray-300'
              }`}
            >
              {step}
            </span>
          </motion.div>
        ))}
      </div>

      {/* Celebration Message */}
      {showCelebration && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-linear-to-r from-yellow-100 to-orange-100 dark:from-yellow-900 dark:to-orange-900 rounded-lg p-6 mb-6 text-center"
        >
          <div className="text-5xl mb-2">🎉</div>
          <p className="text-xl font-bold text-gray-800 dark:text-white">
            Date Complete!
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            You've completed your solo adventure!
          </p>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-3 flex-col sm:flex-row">
        <button
          onClick={toggleAll}
          className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {allChecked ? 'Uncheck All' : 'Check All'}
        </button>
        <button
          onClick={onShare}
          disabled={!allChecked}
          className={`flex-1 px-4 py-3 font-semibold rounded-lg transition-all ${
            allChecked
              ? 'bg-linear-to-r from-purple-600 to-purple-500 text-white hover:shadow-lg'
              : 'bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed'
          }`}
        >
          Share Results →
        </button>
      </div>
    </motion.div>
  );
}
