'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface Date {
  id: number;
  emoji: string;
  title: string;
  effort: 'low' | 'moderate' | 'high';
  mood: string;
  chaos: 'normal' | 'funny' | 'crazy';
  duration: string;
  budget: string;
  description: string;
  steps: string[];
}

interface SpinnerWheelProps {
  dates: Date[];
  selectedEffort: 'low' | 'moderate' | 'high';
  selectedChaos: 'normal' | 'funny' | 'crazy';
  onDateSelected: (date: Date) => void;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  life: number;
}

const SEGMENT_PALETTES = [
  ['#7C3AED', '#9F67F5'],
  ['#1D4ED8', '#4F8EF7'],
  ['#0F766E', '#2DD4BF'],
  ['#9D174D', '#F472B6'],
  ['#92400E', '#F59E0B'],
  ['#1E3A5F', '#60A5FA'],
  ['#4C1D95', '#C4B5FD'],
  ['#713F12', '#FCD34D'],
  ['#064E3B', '#6EE7B7'],
  ['#1E1B4B', '#818CF8'],
  ['#7F1D1D', '#FCA5A5'],
  ['#14532D', '#86EFAC'],
  ['#1C1917', '#D6D3D1'],
  ['#0C4A6E', '#38BDF8'],
  ['#701A75', '#E879F9'],
  ['#7C2D12', '#FB923C'],
  ['#134E4A', '#2DD4BF'],
  ['#312E81', '#A5B4FC'],
  ['#6B21A8', '#D946EF'],
  ['#0F172A', '#94A3B8'],
];

export default function SpinnerWheel({
  dates,
  selectedEffort,
  selectedChaos,
  onDateSelected,
}: SpinnerWheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const [showFlash, setShowFlash] = useState(false);
  const [glowPulse, setGlowPulse] = useState(false);
  const particleIdRef = useRef(0);
const animFrameRef = useRef<number | null>(null);

  useEffect(() => { setIsClient(true); }, []);

  const filteredDates = dates.filter(
    (d) => d.effort === selectedEffort && d.chaos === selectedChaos
  );

  // Particle animation loop
  useEffect(() => {
    if (particles.length === 0) return;
    const loop = () => {
      setParticles((prev) =>
        prev
          .map((p) => ({
            ...p,
            x: p.x + p.vx,
            y: p.y + p.vy,
            vy: p.vy + 0.18,
            life: p.life - 0.022,
          }))
          .filter((p) => p.life > 0)
      );
      animFrameRef.current = requestAnimationFrame(loop);
    };
    animFrameRef.current = requestAnimationFrame(loop);
    return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
  }, [particles.length > 0]);

  const spawnParticles = () => {
    const colors = ['#F5C842', '#C4B5FD', '#F472B6', '#60A5FA', '#6EE7B7', '#FB923C', '#E879F9'];
    const newParticles: Particle[] = Array.from({ length: 60 }, () => ({
      id: particleIdRef.current++,
      x: 160,
      y: 160,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.7) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 6 + 2,
      life: Math.random() * 0.5 + 0.6,
    }));
    setParticles(newParticles);
  };

  const handleSpin = () => {
    if (isSpinning || filteredDates.length === 0) return;
    setIsSpinning(true);
    setGlowPulse(true);

    const randomIndex = Math.floor(Math.random() * filteredDates.length);
    const baseRotation = 360 * 7;
    const sectionAngle = 360 / filteredDates.length;
    const targetOffset = (sectionAngle / 2) - (randomIndex * sectionAngle);
    const finalRotation = rotation + baseRotation + targetOffset;

    setRotation(finalRotation);

    setTimeout(() => {
      setShowFlash(true);
      spawnParticles();
      setTimeout(() => setShowFlash(false), 400);
      setTimeout(() => {
        onDateSelected(filteredDates[randomIndex]);
        setIsSpinning(false);
        setGlowPulse(false);
      }, 800);
    }, 3600);
  };

  if (!isClient) {
    return (
      <div className="flex flex-col items-center gap-10 mb-16 py-8">
        <div className="w-72 h-72 rounded-full animate-pulse" style={{ background: 'rgba(124,58,237,0.15)' }} />
      </div>
    );
  }

  if (filteredDates.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-2xl mb-2">🔮</p>
        <p style={{ color: 'rgba(196,181,253,0.5)', fontFamily: 'Cinzel, Georgia, serif' }}>
          The oracle sees nothing here…
        </p>
        <p style={{ color: 'rgba(196,181,253,0.3)', fontSize: '0.8rem' }} className="mt-1">
          Try a different combination
        </p>
      </div>
    );
  }

  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const r = 138;

  return (
    <div className="flex flex-col items-center gap-10 mb-16 select-none">

      {/* Wheel container */}
      <div className="relative" style={{ width: size, height: size }}>

        {/* Outer glow ring — pulses while spinning */}
        <motion.div
          animate={glowPulse
            ? { opacity: [0.4, 1, 0.4], scale: [1, 1.04, 1] }
            : { opacity: 0.15, scale: 1 }}
          transition={glowPulse
            ? { duration: 1.2, repeat: Infinity, ease: 'easeInOut' }
            : { duration: 0.6 }}
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background: 'transparent',
            boxShadow: '0 0 0 3px rgba(124,58,237,0.5), 0 0 40px 12px rgba(124,58,237,0.3), 0 0 80px 24px rgba(124,58,237,0.15)',
            zIndex: 0,
          }}
        />

        {/* Decorative tick marks */}
        <svg
          width={size}
          height={size}
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {Array.from({ length: 32 }).map((_, i) => {
            const angle = (i / 32) * Math.PI * 2;
            const inner = r + 10;
            const outer = r + (i % 4 === 0 ? 22 : 14);
            return (
              <line
                key={i}
                x1={cx + inner * Math.cos(angle)}
                y1={cy + inner * Math.sin(angle)}
                x2={cx + outer * Math.cos(angle)}
                y2={cy + outer * Math.sin(angle)}
                stroke={i % 4 === 0 ? 'rgba(245,200,66,0.6)' : 'rgba(196,181,253,0.2)'}
                strokeWidth={i % 4 === 0 ? 2 : 1}
              />
            );
          })}
          {/* Outer ring border */}
          <circle cx={cx} cy={cy} r={r + 24} fill="none" stroke="rgba(124,58,237,0.25)" strokeWidth="1" />
          <circle cx={cx} cy={cy} r={r + 26} fill="none" stroke="rgba(245,200,66,0.12)" strokeWidth="0.5" />
        </svg>

        {/* Spinning wheel */}
        <motion.div
          animate={{ rotate: rotation }}
          transition={{ duration: 3.6, ease: [0.17, 0.67, 0.12, 1.0] }}
          style={{ width: size, height: size, position: 'absolute', inset: 0, zIndex: 2 }}
        >
          <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
            <defs>
              {filteredDates.map((_, i) => {
                const [c1, c2] = SEGMENT_PALETTES[i % SEGMENT_PALETTES.length];
                return (
                  <radialGradient key={i} id={`seg-grad-${i}`} cx="30%" cy="30%" r="70%">
                    <stop offset="0%" stopColor={c2} stopOpacity="0.95" />
                    <stop offset="100%" stopColor={c1} stopOpacity="1" />
                  </radialGradient>
                );
              })}
              <filter id="seg-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>

            {filteredDates.map((date, i) => {
              const sliceAngle = (2 * Math.PI) / filteredDates.length;
              const startAngle = i * sliceAngle - Math.PI / 2;
              const endAngle = (i + 1) * sliceAngle - Math.PI / 2;

              const x1 = cx + r * Math.cos(startAngle);
              const y1 = cy + r * Math.sin(startAngle);
              const x2 = cx + r * Math.cos(endAngle);
              const y2 = cy + r * Math.sin(endAngle);
              const largeArc = sliceAngle > Math.PI ? 1 : 0;

              const midAngle = (startAngle + endAngle) / 2;
              const textR = r * 0.62;
              const tx = cx + textR * Math.cos(midAngle);
              const ty = cy + textR * Math.sin(midAngle);
              const textDeg = (midAngle * 180) / Math.PI + 90;

              // Separator line positions
              const lx1 = cx + 28 * Math.cos(startAngle);
              const ly1 = cy + 28 * Math.sin(startAngle);
              const lx2 = cx + (r + 2) * Math.cos(startAngle);
              const ly2 = cy + (r + 2) * Math.sin(startAngle);

              return (
                <g key={i}>
                  <path
                    d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={`url(#seg-grad-${i})`}
                  />
                  {/* Shimmer highlight on each segment */}
                  <path
                    d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill="rgba(255,255,255,0.06)"
                    style={{ mixBlendMode: 'overlay' }}
                  />
                  {/* Divider lines */}
                  <line x1={lx1} y1={ly1} x2={lx2} y2={ly2} stroke="rgba(0,0,0,0.35)" strokeWidth="1.5" />
                  {/* Emoji */}
                  <text
                    x={tx}
                    y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={filteredDates.length > 12 ? '14' : '20'}
                    transform={`rotate(${textDeg}, ${tx}, ${ty})`}
                    style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.5))' }}
                  >
                    {date.emoji}
                  </text>
                </g>
              );
            })}

            {/* Center cap */}
            <circle cx={cx} cy={cy} r="26" fill="#0F0828" stroke="rgba(245,200,66,0.6)" strokeWidth="2" />
            <circle cx={cx} cy={cy} r="20" fill="#1A0A3C" />
            <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" fontSize="14">🔮</text>
          </svg>
        </motion.div>

        {/* Pointer — cosmic triangular needle */}
        <div
          className="absolute z-10"
          style={{ top: -6, left: '50%', transform: 'translateX(-50%)' }}
        >
          <svg width="24" height="36" viewBox="0 0 24 36">
            <defs>
              <linearGradient id="needle-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#F5C842" />
                <stop offset="100%" stopColor="#D97706" />
              </linearGradient>
            </defs>
            <polygon
              points="12,34 2,4 22,4"
              fill="url(#needle-grad)"
              stroke="#0F0828"
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <circle cx="12" cy="5" r="4" fill="#F5C842" />
          </svg>
        </div>

        {/* Flash overlay on landing */}
        <AnimatePresence>
          {showFlash && (
            <motion.div
              initial={{ opacity: 0.8 }}
              animate={{ opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 rounded-full pointer-events-none z-20"
              style={{ background: 'radial-gradient(circle, rgba(245,200,66,0.6) 0%, transparent 70%)' }}
            />
          )}
        </AnimatePresence>

        {/* Particle canvas */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full"
              style={{
                left: p.x,
                top: p.y,
                width: p.size,
                height: p.size,
                background: p.color,
                opacity: p.life,
                transform: 'translate(-50%, -50%)',
                boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
              }}
            />
          ))}
        </div>
      </div>

      {/* Spin button */}
      <div className="relative">
        {/* Button glow halo */}
        {!isSpinning && (
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4], scale: [1, 1.08, 1] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse, rgba(124,58,237,0.5) 0%, transparent 70%)',
              filter: 'blur(12px)',
            }}
          />
        )}

        <motion.button
          whileHover={!isSpinning ? { scale: 1.06 } : {}}
          whileTap={!isSpinning ? { scale: 0.94 } : {}}
          onClick={handleSpin}
          disabled={isSpinning}
          style={{
            fontFamily: 'Cinzel, Georgia, serif',
            backgroundColor: isSpinning ? 'rgba(30,16,64,0.6)' : undefined,
            backgroundImage: !isSpinning ? 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 50%, #7C3AED 100%)' : undefined,
            backgroundSize: !isSpinning ? '200% 100%' : undefined,
            border: isSpinning
              ? '1.5px solid rgba(124,58,237,0.3)'
              : '1.5px solid rgba(196,181,253,0.5)',
            color: isSpinning ? 'rgba(196,181,253,0.4)' : '#EDE8FF',
            boxShadow: isSpinning
              ? 'none'
              : '0 0 24px rgba(124,58,237,0.6), 0 4px 20px rgba(0,0,0,0.4)',
            letterSpacing: '0.2em',
            cursor: isSpinning ? 'not-allowed' : 'pointer',
          }}
          className="relative px-12 py-4 rounded-full text-base font-bold transition-all duration-500"
        >
          {isSpinning ? (
            <span className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'inline-block' }}
              >
                ✦
              </motion.span>
              Consulting the Oracle…
            </span>
          ) : (
            '✦ Reveal My Destiny ✦'
          )}
        </motion.button>
      </div>

      {/* Hint text */}
      {!isSpinning && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ color: 'rgba(196,181,253,0.3)', fontSize: '0.72rem', letterSpacing: '0.12em' }}
        >
          {filteredDates.length} QUESTS AWAIT
        </motion.p>
      )}
    </div>
  );
}   