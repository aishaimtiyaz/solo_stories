'use client';

import { useEffect, useRef } from 'react';

export default function Header() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const stars = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      speed: Math.random() * 0.008 + 0.003,
    }));

    let frame: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        s.alpha += s.speed;
        if (s.alpha > 1 || s.alpha < 0) s.speed *= -1;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 200, 66, ${s.alpha * 0.7})`;
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <header className="relative overflow-hidden py-14 px-4 text-center"
      style={{ background: 'linear-gradient(180deg, #06040F 0%, #0F0828 60%, #1A0A3C 100%)' }}>
      
      {/* Star canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
      />

      {/* Glow orb behind title */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div style={{
          width: 320,
          height: 120,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 70%)',
          filter: 'blur(24px)',
        }} />
      </div>

      <div className="relative z-10">
        {/* Eyebrow */}
        <p className="text-xs tracking-[0.35em] uppercase mb-3"
          style={{ color: '#F5C842', fontFamily: 'Cinzel, Georgia, serif', opacity: 0.8 }}>
          ✦ &nbsp;Your oracle awaits&nbsp; ✦
        </p>

        {/* Title */}
        <h1
          className="text-5xl md:text-6xl font-bold mb-4 leading-none"
          style={{
            fontFamily: 'Cinzel, Georgia, serif',
            background: 'linear-gradient(135deg, #EDE8FF 0%, #C4B5FD 40%, #F5C842 75%, #EDE8FF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            letterSpacing: '0.04em',
          }}
        >
          Solo Quest
        </h1>

        {/* Divider */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div style={{ height: 1, width: 60, background: 'linear-gradient(to right, transparent, rgba(196,181,253,0.4))' }} />
          <span style={{ color: 'rgba(196,181,253,0.5)', fontSize: 10 }}>◆</span>
          <div style={{ height: 1, width: 60, background: 'linear-gradient(to left, transparent, rgba(196,181,253,0.4))' }} />
        </div>

        <p style={{ color: '#C4B5FD', fontFamily: 'Inter, sans-serif', fontSize: '1rem', opacity: 0.85, letterSpacing: '0.01em' }}>
          Spin the wheel &amp; let fate choose your next adventure
        </p>
      </div>
    </header>
  );
}