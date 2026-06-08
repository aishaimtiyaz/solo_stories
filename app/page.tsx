'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import EffortTabs from './components/EffortTabs';
import SpinnerWheel from './components/SpinnerWheel';
import ResultCard from './components/ResultCard';
import Checklist from './components/Checklist';
import ShareCard from './components/ShareCard';
import Footer from './components/Footer';
import datesData from '@/data/dates.json';

interface Date {
  id: number;
  emoji: string;
  title: string;
  effort: 'low' | 'moderate' | 'high';
  mood: string;
  duration: string;
  budget: string;
  description: string;
  steps: string[];
}

type ViewState = 'spinner' | 'result' | 'checklist' | 'share';

export default function Home() {
  const [selectedEffort, setSelectedEffort] = useState<
    'low' | 'moderate' | 'high'
  >('low');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<ViewState>('spinner');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check system dark mode preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      setIsDarkMode(true);
    }
  }, []);

  const handleDateSelected = (date: Date) => {
    setSelectedDate(date);
    setView('result');
  };

  const handleViewChecklist = () => {
    setView('checklist');
  };

  const handleShare = () => {
    setView('share');
  };

  const handleBack = () => {
    setView('result');
  };

  const handleBackToSpinner = () => {
    setSelectedDate(null);
    setView('spinner');
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        isDarkMode ? 'dark bg-gray-950' : 'bg-linear-to-b from-gray-50 to-blue-50'
      }`}
    >
      <Header />

      <main className="max-w-6xl mx-auto px-4 py-12">
        {view === 'spinner' && (
          <motion.div
            key="spinner"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <EffortTabs
              selectedEffort={selectedEffort}
              onSelectEffort={setSelectedEffort}
            />
            <SpinnerWheel
              dates={datesData as Date[]}
              selectedEffort={selectedEffort}
              onDateSelected={handleDateSelected}
            />
          </motion.div>
        )}

        {view === 'result' && selectedDate && (
          <motion.div
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ResultCard
              date={selectedDate}
              onViewChecklist={handleViewChecklist}
            />
            <button
              onClick={handleBackToSpinner}
              className="flex items-center justify-center gap-2 mx-auto px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              ← Spin Again
            </button>
          </motion.div>
        )}

        {view === 'checklist' && selectedDate && (
          <motion.div
            key="checklist"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Checklist
              date={selectedDate}
              onBack={handleBack}
              onShare={handleShare}
            />
          </motion.div>
        )}

        {view === 'share' && selectedDate && (
          <motion.div
            key="share"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ShareCard
              date={selectedDate}
              onBack={() => setView('checklist')}
            />
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}
