'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';
import { toPng } from 'html-to-image';
import { toBlob } from 'html-to-image';


interface ShareCardProps {
  date: {
    emoji: string;
    title: string;
    duration: string;
    mood: string;
  };
  onBack: () => void;
}

export default function ShareCard({ date, onBack }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  console.log('Rendering ShareCard with date:', date);

const downloadImage = async () => {
  if (!cardRef.current) return;

  const dataUrl = await toPng(cardRef.current);

  const link = document.createElement('a');
  link.download = 'solo-quest.png';
  link.href = dataUrl;
  link.click();
};


const shareImage = async () => {
  if (!cardRef.current) return;

  try {
    const blob = await toBlob(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    });

    if (!blob) return;

    const file = new File(
      [blob],
      `solo-quest-${date.title}.png`,
      { type: 'image/png' }
    );

    if (
      navigator.canShare &&
      navigator.canShare({ files: [file] })
    ) {
      await navigator.share({
        title: 'My Solo Quest',
        text: 'Check out my Solo Quest!',
        files: [file],
      });
    } else {
      // Fallback for desktop
      const url = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = url;
      a.download = `solo-quest-${date.title}.png`;
      a.click();

      URL.revokeObjectURL(url);
    }
  } catch (err) {
    console.error(err);
  }
};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto mb-8"
    >
      {/* Shareable Card */}
      <div
        ref={cardRef}
        className="bg-purple-600 rounded-2xl p-8 text-white text-center shadow-2xl"
        style={{ background: '#9333ea' }}
      >
        <div className="mb-6">
          <p className="text-sm font-semibold text-purple-200 mb-2">
            TODAY'S SOLO QUEST
          </p>
          <div className="flex justify-center gap-2">
            <div className="h-1 w-8 bg-white rounded-full" />
            <div className="h-1 w-8 bg-white rounded-full" />
            <div className="h-1 w-8 bg-white rounded-full" />
          </div>
        </div>

        <div className="text-6xl mb-4">{date.emoji}</div>

        <h3 className="text-3xl font-bold mb-6">{date.title}</h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-purple-200 text-sm font-semibold mb-1">
              Duration
            </p>
            <p className="text-xl font-bold">{date.duration}</p>
          </div>
          <div>
            <p className="text-purple-200 text-sm font-semibold mb-1">Mood</p>
            <p className="text-xl font-bold capitalize">{date.mood}</p>
          </div>
        </div>

        <div className="flex justify-center gap-2">
          <div className="h-1 w-8 bg-white rounded-full" />
          <div className="h-1 w-8 bg-white rounded-full" />
          <div className="h-1 w-8 bg-white rounded-full" />
        </div>

        <p className="text-purple-200 text-sm mt-6">
          Join me on Solo Quest • your adventure awaits
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 mt-6 flex-col sm:flex-row">
        <button
          onClick={onBack}
          className="flex-1 px-4 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white font-semibold rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Back
        </button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={shareImage}
          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-semibold rounded-lg hover:shadow-lg transition-all"
        >
          📥 Download Image
        </motion.button>
      </div>

      <p className="text-center text-gray-600 dark:text-gray-400 text-sm mt-4">
        Perfect for Instagram Stories!
      </p>
    </motion.div>
  );
}
