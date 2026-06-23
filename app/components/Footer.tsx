'use client';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden mt-20 px-4 py-12 text-center"
      style={{ background: 'linear-gradient(180deg, #06040F 0%, #0A0420 100%)', borderTop: '1px solid rgba(124,58,237,0.15)' }}>

      {/* Top fade divider */}
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: 'linear-gradient(to right, transparent, rgba(124,58,237,0.4), rgba(245,200,66,0.3), transparent)' }} />

      <div className="relative z-10 max-w-lg mx-auto flex flex-col items-center gap-4">

        {/* Glyph */}
        <div className="text-2xl" style={{ filter: 'drop-shadow(0 0 8px rgba(245,200,66,0.5))' }}>🔮</div>

        {/* Tagline */}
        <p style={{ fontFamily: 'Cinzel, Georgia, serif', color: 'rgba(196,181,253,0.55)', fontSize: '0.7rem', letterSpacing: '0.3em' }}>
          MADE FOR SOLO ADVENTURERS
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 w-full justify-center">
          <div style={{ height: '1px', width: 48, background: 'linear-gradient(to right, transparent, rgba(196,181,253,0.2))' }} />
          <span style={{ color: 'rgba(245,200,66,0.3)', fontSize: 8 }}>✦</span>
          <div style={{ height: '1px', width: 48, background: 'linear-gradient(to left, transparent, rgba(196,181,253,0.2))' }} />
        </div>

        {/* Copyright */}
        <p style={{ color: 'rgba(196,181,253,0.2)', fontSize: '0.7rem', letterSpacing: '0.1em', fontFamily: 'Inter, sans-serif' }}>
          © {currentYear} Solo Quest
        </p>
      </div>
    </footer>
  );
}