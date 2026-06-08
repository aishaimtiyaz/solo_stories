'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

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

interface SpinnerWheelProps {
  dates: Date[];
  selectedEffort: 'low' | 'moderate' | 'high';
  onDateSelected: (date: Date) => void;
}

export default function SpinnerWheel({
  dates,
  selectedEffort,
  onDateSelected,
}: SpinnerWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const filteredDates = dates.filter((date) => date.effort === selectedEffort);

  const handleSpin = () => {
    if (isSpinning || filteredDates.length === 0) return;

    setIsSpinning(true);

    // Generate random rotation (at least 5 full rotations + random angle)
    const randomIndex = Math.floor(Math.random() * filteredDates.length);
    const baseRotation = 360 * 5;
    const sectionAngle = 360 / filteredDates.length;
    const randomRotation =
      Math.random() * sectionAngle + randomIndex * sectionAngle;
    const finalRotation = rotation + baseRotation + randomRotation;

    setRotation(finalRotation);

    // Trigger selection after animation completes
    setTimeout(() => {
      onDateSelected(filteredDates[randomIndex]);
      setIsSpinning(false);
    }, 3500);
  };

  // Only render on client to avoid hydration mismatch
  if (!isClient) {
    return (
      <div className="flex flex-col items-center gap-8 mb-12">
        <div className="relative w-64 h-64 md:w-80 md:h-80 bg-linear-to-br from-purple-100 to-blue-100 rounded-full animate-pulse" />
        <button disabled className="px-8 py-4 rounded-full font-bold text-lg bg-gray-400 text-gray-600 cursor-not-allowed">
          SPIN
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 mb-12">
      <div className="relative w-64 h-64 md:w-80 md:h-80">
        {/* Spinner */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{
            duration: 3.5,
            ease: 'easeOut',
          }}
          className="w-full h-full"
        >
          <svg
            viewBox="0 0 400 400"
            className="w-full h-full drop-shadow-xl"
          >
            {filteredDates.map((date, index) => {
              const sliceAngle = 360 / filteredDates.length;
              const startAngle = (index * sliceAngle * Math.PI) / 180;
              const endAngle = ((index + 1) * sliceAngle * Math.PI) / 180;

              const x1 = 200 + 180 * Math.cos(startAngle);
              const y1 = 200 + 180 * Math.sin(startAngle);
              const x2 = 200 + 180 * Math.cos(endAngle);
              const y2 = 200 + 180 * Math.sin(endAngle);

              const largeArc = sliceAngle > 180 ? 1 : 0;

              const pathData = [
                `M 200 200`,
                `L ${x1} ${y1}`,
                `A 180 180 0 ${largeArc} 1 ${x2} ${y2}`,
                'Z',
              ].join(' ');

              // Color based on effort
              const colors = {
                low: '#A78BFA',
                moderate: '#F59E0B',
                high: '#EF4444',
              };

              const textAngle =
                ((index * sliceAngle + sliceAngle / 2) * Math.PI) / 180;
              const textX = 200 + 110 * Math.cos(textAngle);
              const textY = 200 + 110 * Math.sin(textAngle);

              return (
                <g key={date.id}>
                  <path
                    d={pathData}
                    fill={colors[date.effort]}
                    stroke="white"
                    strokeWidth="2"
                  />
                  <text
                    x={textX}
                    y={textY}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="text-2xl font-bold"
                    transform={`rotate(${(index * sliceAngle + sliceAngle / 2) - 90} ${textX} ${textY})`}
                  >
                    {date.emoji}
                  </text>
                </g>
              );
            })}
            {/* Center circle */}
            <circle cx="200" cy="200" r="30" fill="#F8FAFC" stroke="white" strokeWidth="2" />
          </svg>
        </motion.div>

        {/* Pointer */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-10">
          <div className="w-4 h-8 bg-yellow-400 rounded-full shadow-lg transform rotate-45"></div>
        </div>
      </div>

      <motion.button
        whileHover={{ scale: isSpinning ? 1 : 1.1 }}
        whileTap={{ scale: isSpinning ? 1 : 0.95 }}
        onClick={handleSpin}
        disabled={isSpinning}
        className={`px-8 py-4 rounded-full font-bold text-lg transition-all duration-300 ${
          isSpinning
            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
            : 'bg-linear-to-r from-orange-400 to-orange-500 text-white shadow-lg hover:shadow-xl'
        }`}
      >
        {isSpinning ? 'SPINNING...' : 'SPIN'}
      </motion.button>
    </div>
  );
}
