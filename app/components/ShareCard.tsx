'use client';

import { motion } from 'framer-motion';
import { useRef, useState } from 'react';
import { toPng, toBlob } from 'html-to-image';
import ContactModal from './ContactModal';
import { loadState } from '@/utils/localStorage';

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
  const [showContact, setShowContact] = useState(false);
  const [pendingAction, setPendingAction] = useState<'download' | 'share' | null>(null);

  const handleShareClick = () => {
    setPendingAction('share');
    setShowContact(true);
  };

  const downloadImage = async () => {
    // ensure contact saved before download
    const state = loadState();
    if (!state.contact) {
      setPendingAction('download');
      setShowContact(true);
      return;
    }
    if (!cardRef.current) return;
    const dataUrl = await toPng(cardRef.current, { pixelRatio: 2, cacheBust: true });
    const link = document.createElement('a');
    link.download = `solo-quest-${date.title}.png`;
    link.href = dataUrl;
    link.click();
  };

  const shareImage = async () => {
    if (!cardRef.current) return;
    try {
      const blob = await toBlob(cardRef.current, { pixelRatio: 2, cacheBust: true });
      if (!blob) return;
      const file = new File([blob], `solo-quest-${date.title}.png`, { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Solo Quest',
          text: `My destiny was revealed: ${date.title} ✨`,
          files: [file],
          url: 'https://solo-stories-seven.vercel.app/',
        });
      } else {
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

  {/* Daily oracle message */}
const ORACLE_MESSAGES = [
   "Still scrolling? This took less time than that.",
    "Your thumb needs a break. Your brain needs this.",
    "Bored of scrolling? This is more fun than the next 10 reels.",
    "You've scrolled enough today. Try this instead.",
    "This beats another 20 minutes of mindless scrolling.",
    "Stop scrolling. Start spinning.",
    "One spin > one more hour of scrolling.",
    "Feeling bored? The wheel fixes that faster than your feed does.",
    "Your feed is boring you. This won't.",
    "Close the app you're doomscrolling on. Open this one instead.",
    "Scrolling gave you nothing today. This might give you a story.",
    "You didn't open this app to scroll. You opened it to do something.",
    "Bored isn't a mood. It's a sign to spin.",
    "The algorithm doesn't know you. The wheel might.",
    "This is the main character energy your feed keeps promising you."
];

const dailyMessage = ORACLE_MESSAGES[new Date().getDate() % ORACLE_MESSAGES.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-sm mx-auto mb-8"
    >
      {/* Label */}
      <p className="text-center text-xs tracking-[0.3em] uppercase mb-4"
        style={{ fontFamily: 'Cinzel, Georgia, serif', color: 'rgba(196,181,253,0.4)' }}>
        Your Shareable Card
      </p>

      {/* ── The card itself ── */}
      <div
        ref={cardRef}
        style={{
          background: 'linear-gradient(145deg, #0F0828 0%, #1A0A3C 40%, #0D1A3A 100%)',
          borderRadius: 24,
          padding: '2.5rem 2rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid rgba(124,58,237,0.3)',
          boxShadow: '0 0 0 1px rgba(245,200,66,0.08) inset',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {/* Corner stars */}
        {['top-3 left-4', 'top-3 right-4', 'bottom-3 left-4', 'bottom-3 right-4'].map((pos, i) => (
          <span key={i} className={`absolute ${pos} text-xs`}
            style={{ color: 'rgba(245,200,66,0.35)', fontSize: 10 }}>✦</span>
        ))}

        {/* Glow orb behind emoji */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none"
          style={{ paddingTop: '3.5rem' }}>
          <div style={{
            width: 160, height: 80, borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(124,58,237,0.35) 0%, transparent 70%)',
            filter: 'blur(20px)',
          }} />
        </div>

        {/* Eyebrow */}
        <p className="relative text-xs tracking-[0.3em] uppercase mb-5"
          style={{ fontFamily: 'Cinzel, Georgia, serif', color: 'rgba(245,200,66,0.6)' }}>
          ✦ &nbsp;Solo Quest&nbsp; ✦
        </p>

        {/* Emoji */}
        <div className="relative text-6xl mb-5 leading-none"
          style={{ filter: 'drop-shadow(0 0 16px rgba(196,181,253,0.5))' }}>
          {date.emoji}
        </div>

        {/* Title */}
        <h3 className="relative font-bold mb-6 leading-tight"
          style={{
            fontFamily: 'Cinzel, Georgia, serif',
            fontSize: '1.45rem',
            background: 'linear-gradient(135deg, #EDE8FF 0%, #C4B5FD 50%, #F5C842 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
          {date.title}
        </h3>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <div style={{ height: 1, width: 40, background: 'linear-gradient(to right, transparent, rgba(196,181,253,0.3))' }} />
          <span style={{ color: 'rgba(245,200,66,0.4)', fontSize: 8 }}>◆</span>
          <div style={{ height: 1, width: 40, background: 'linear-gradient(to left, transparent, rgba(196,181,253,0.3))' }} />
        </div>

        {/* Stats */}
        <div className="relative flex justify-center gap-8 mb-6">
          {[
            { label: 'Duration', value: date.duration },
            { label: 'Mood', value: date.mood },
          ].map(({ label, value }) => (
            <div key={label}>
              <p style={{ color: 'rgba(196,181,253,0.4)', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 4 }}>
                {label}
              </p>
              <p style={{ color: '#EDE8FF', fontWeight: 600, fontSize: '0.95rem', textTransform: 'capitalize' }}>
                {value}
              </p>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="flex items-center justify-center gap-2 mb-5">
          <div style={{ height: 1, width: 40, background: 'linear-gradient(to right, transparent, rgba(196,181,253,0.2))' }} />
          <span style={{ color: 'rgba(124,58,237,0.5)', fontSize: 8 }}>◆</span>
          <div style={{ height: 1, width: 40, background: 'linear-gradient(to left, transparent, rgba(196,181,253,0.2))' }} />
        </div>

        {/* URL watermark */}
        {/* Oracle message — changes daily */}
<div style={{
  margin: '0 -2rem -2.5rem',
  marginTop: '1.25rem',
  padding: '0.9rem 1.5rem',
  background: 'linear-gradient(135deg, rgba(124,58,237,0.2) 0%, rgba(245,200,66,0.08) 100%)',
  borderTop: '1px solid rgba(124,58,237,0.2)',
  borderRadius: '0 0 24px 24px',
}}>
  <p style={{
    fontFamily: 'Cinzel, Georgia, serif',
    color: 'rgba(245,200,66,0.75)',
    fontSize: '0.72rem',
    letterSpacing: '0.12em',
    lineHeight: 1.6,
  }}>
    {dailyMessage}
  </p>
  <p style={{
    color: 'rgba(196,181,253,0.25)',
    fontSize: '0.6rem',
    letterSpacing: '0.15em',
    marginTop: '0.35rem',
  }}>
    solo-stories-seven.vercel.app
  </p>
</div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-5">
        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={onBack}
          style={{
            flex: 1, padding: '0.75rem 1rem',
            background: 'rgba(15,8,40,0.7)',
            border: '1.5px solid rgba(124,58,237,0.25)',
            borderRadius: 12,
            color: 'rgba(196,181,253,0.6)',
            fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← Back to Spin
        </motion.button>

        {/* <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={downloadImage}
          style={{
            flex: 1, padding: '0.75rem 1rem',
            background: 'rgba(15,8,40,0.7)',
            border: '1.5px solid rgba(124,58,237,0.35)',
            borderRadius: 12,
            color: '#C4B5FD',
            fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ↓ Save
        </motion.button> */}

        <motion.button
          whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onClick={handleShareClick}
          style={{
            flex: 1.4, padding: '0.75rem 1rem',
            background: 'linear-gradient(135deg, #7C3AED 0%, #4C1D95 100%)',
            border: '1.5px solid rgba(196,181,253,0.3)',
            borderRadius: 12,
            color: '#EDE8FF',
            fontFamily: 'Cinzel, Georgia, serif', fontSize: '0.8rem', fontWeight: 700,
            letterSpacing: '0.08em',
            boxShadow: '0 0 18px rgba(124,58,237,0.45)',
            cursor: 'pointer',
          }}
        >
          ✦ Share
        </motion.button>
      </div>

      {showContact && (
        <ContactModal
          onClose={() => { setShowContact(false); setPendingAction(null); }}
          onSaved={() => {
            setShowContact(false);
            if (pendingAction === 'download') downloadImage();
            if (pendingAction === 'share') shareImage();
            setPendingAction(null);
          }}
        />
      )}

      <p className="text-center mt-4 text-xs" style={{ color: 'rgba(196,181,253,0.25)', letterSpacing: '0.1em' }}>
        PERFECT FOR INSTAGRAM STORIES
      </p>
    </motion.div>
  );
}