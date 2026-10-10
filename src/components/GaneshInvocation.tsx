import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { devotionalAudio } from '@/utils/devotionalAudio';

interface GaneshInvocationProps {
  onComplete: () => void;
  durationMs?: number;
}

// 12 subtle warm golden atmospheric micro-particles
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${15 + (i * 7) % 70}%`,
  top: `${30 + (i * 13) % 55}%`,
  size: 2 + (i % 3) * 1.5,
  delay: (i * 0.4) % 3,
  duration: 4 + (i % 3) * 1.5,
}));

export const GaneshInvocation: React.FC<GaneshInvocationProps> = ({
  onComplete,
  durationMs = 4500,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [phase, setPhase] = useState<'enter' | 'hold' | 'exit'>('enter');
  const timerRef = useRef<any>(null);
  const audioFadeTimerRef = useRef<any>(null);

  useEffect(() => {
    // Notify audio players of invocation start
    window.dispatchEvent(new CustomEvent('wedding:invocation-start'));

    // Start dedicated devotional audio (400ms fade-in)
    if (!shouldReduceMotion) {
      devotionalAudio.start({ volume: 24, fadeMs: 400 });
    }

    if (shouldReduceMotion) {
      const quickTimer = setTimeout(() => {
        handleFinish();
      }, 2500);
      return () => clearTimeout(quickTimer);
    }

    // Suggested Timeline:
    // 0.0s - 1.2s: Background settles, text fades in
    // 1.2s - 3.5s: Devotional hold with breathing golden aura
    // 3.5s - 4.5s: Devotional audio fades out (800ms) & screen dissolves
    timerRef.current = setTimeout(() => {
      setPhase('hold');
    }, 1200);

    // Fade audio out smoothly before transition completes
    const audioFadeTime = Math.max(1000, durationMs - 900);
    audioFadeTimerRef.current = setTimeout(() => {
      devotionalAudio.stop(800);
      setPhase('exit');
    }, audioFadeTime);

    // Complete sequence
    const completeTimer = setTimeout(() => {
      handleFinish();
    }, durationMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (audioFadeTimerRef.current) clearTimeout(audioFadeTimerRef.current);
      devotionalAudio.stop(200);
    };
  }, [durationMs, shouldReduceMotion]);

  const handleFinish = () => {
    devotionalAudio.stop(300);
    window.dispatchEvent(new CustomEvent('wedding:invocation-end'));
    onComplete();
  };

  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    handleFinish();
  };

  return (
    <motion.div
      key="ganesh-invocation-screen"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer"
      style={{
        backgroundColor: '#150508',
        backgroundImage: `
          radial-gradient(circle at 50% 48%, rgba(184, 155, 94, 0.16) 0%, rgba(38, 10, 16, 0.95) 55%, #120407 100%)
        `,
        paddingTop: 'max(1.5rem, env(safe-area-inset-top, 1.5rem))',
        paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.9, ease: [0.65, 0, 0.35, 1] } }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      onClick={handleFinish}
      role="region"
      aria-label="Devotional Ganesh Blessing"
    >
      {/* Soft Breathing Radial Aura behind sacred emblem & text */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full blur-3xl devotional-aura-pulse"
        style={{
          width: 'min(500px, 85vw)',
          height: 'min(500px, 85vw)',
          background: 'radial-gradient(circle, rgba(212, 175, 55, 0.22) 0%, rgba(184, 155, 94, 0.08) 50%, transparent 75%)',
        }}
      />

      {/* Subtle floating golden atmospheric micro-particles */}
      {!shouldReduceMotion && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {PARTICLES.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full devotional-particle"
              style={{
                left: p.left,
                top: p.top,
                width: `${p.size}px`,
                height: `${p.size}px`,
                backgroundColor: '#E5C07B',
                boxShadow: '0 0 8px rgba(229, 192, 123, 0.6)',
                animationDelay: `${p.delay}s`,
                animationDuration: `${p.duration}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Center Devotional Composition */}
      <div className="relative z-10 flex flex-col items-center justify-center max-w-2xl px-6 text-center">
        {/* Minimal Indian Ceremonial Sacred Emblem (Fine-line lotus & auspicious motif) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="mb-6 sm:mb-8 pointer-events-none"
        >
          <svg
            width="64"
            height="44"
            viewBox="0 0 64 44"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-[var(--color-secondary)] opacity-85 mx-auto"
          >
            {/* Sacred Lotus / Diya linework with 0.8px fine linework */}
            <path
              d="M32 4C32 4 36 14 44 18C36 18 33 28 32 34C31 28 28 18 20 18C28 14 32 4 32 4Z"
              fill="url(#goldGradient)"
              opacity="0.9"
            />
            <path
              d="M32 34C38 34 48 31 56 22C49 27 41 28 36 27"
              stroke="url(#goldGradient)"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            <path
              d="M32 34C26 34 16 31 8 22C15 27 23 28 28 27"
              stroke="url(#goldGradient)"
              strokeWidth="0.8"
              strokeLinecap="round"
            />
            {/* Fine ornamental base line */}
            <line x1="14" y1="38" x2="50" y2="38" stroke="url(#goldGradient)" strokeWidth="0.75" strokeLinecap="round" opacity="0.6" />
            <circle cx="32" cy="38" r="1.5" fill="url(#goldGradient)" />
            <defs>
              <linearGradient id="goldGradient" x1="8" y1="4" x2="56" y2="38" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F9E8B2" />
                <stop offset="0.5" stopColor="#D4AF37" />
                <stop offset="1" stopColor="#AA7C11" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>

        {/* Sacred Primary Devanagari Typography */}
        <motion.div
          initial={{ opacity: 0, y: 16, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.2, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="relative pointer-events-none"
        >
          <h1
            className="font-devanagari text-[clamp(2.1rem,6.8vw,4.25rem)] font-medium leading-snug tracking-wider px-2"
            style={{
              background: 'linear-gradient(180deg, #FFFDF8 0%, #F6E6C7 45%, #D4AF37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 2px 24px rgba(212, 175, 55, 0.32))',
            }}
          >
            ॐ नमो गणेशाय नमः
          </h1>
        </motion.div>

        {/* Delicate Golden Divider Line */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 1 }}
          transition={{ duration: 1.0, delay: 1.1, ease: 'easeOut' }}
          className="my-4 sm:my-5 mx-auto pointer-events-none"
          style={{
            width: 'min(140px, 35vw)',
            height: '1px',
            background: 'linear-gradient(90deg, transparent 0%, #D4AF37 50%, transparent 100%)',
          }}
        />

        {/* Secondary Roman Transliteration */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.82, y: 0 }}
          transition={{ duration: 1.0, delay: 1.35, ease: 'easeOut' }}
          className="font-script text-xs sm:text-sm md:text-base tracking-[0.28em] sm:tracking-[0.32em] uppercase italic text-[#E5C07B] pointer-events-none"
          style={{ fontFamily: 'var(--font-script)' }}
        >
          Om Namo Ganeshaya Namaha
        </motion.p>
      </div>

      {/* Subtle Skip / Tap Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ delay: 1.8, duration: 0.8 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex items-center gap-2 text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#E5C07B]/70 font-body pointer-events-none"
      >
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse" />
        <span>Auspicious Beginning</span>
      </motion.div>

      {/* Discreet Skip Button (Safe Touch Target) */}
      <button
        type="button"
        onClick={handleSkip}
        className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 text-xs tracking-[0.2em] uppercase text-[#E5C07B]/50 hover:text-[#E5C07B] transition-opacity p-2.5 z-20 cursor-pointer min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none"
        aria-label="Skip devotional blessing"
      >
        Skip
      </button>
    </motion.div>
  );
};

export default GaneshInvocation;
