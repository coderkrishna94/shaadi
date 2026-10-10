import React, { useEffect, useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { Monogram, CornerMotif } from './IndianMotifs';
import { devotionalAudio } from '@/utils/devotionalAudio';

interface OpeningAnimationProps {
  onComplete: () => void;
}

/**
 * Deterministic State Machine for the Cinematic Timeline
 *
 * INTRO_PLAYING
 *   ↓ (triggered strictly when Rishabh & Simran intro animation actually completes + 900ms reading pause)
 * INTRO_EXITING
 *   ↓ (800ms exit crossfade)
 * GANESH_ENTERING
 *   ↓ (400ms glow expansion + audio fade-in 0 -> target)
 * GANESH_ACTIVE
 *   ↓ (600ms text reveal with blur/scale + 528Hz bell chime + 2500ms sacred hold)
 * GANESH_EXITING
 *   ↓ (1000ms text dissolve + audio fade-out target -> 0 + background dissolve)
 * MAIN_EXPERIENCE
 *   (Ganesh audio 100% silent, overlay unmounts, hero & background music active)
 */
export type CinematicPhase =
  | 'INTRO_PLAYING'
  | 'INTRO_EXITING'
  | 'GANESH_ENTERING'
  | 'GANESH_ACTIVE'
  | 'GANESH_EXITING'
  | 'MAIN_EXPERIENCE';

// 12 subtle golden floating atmospheric micro-particles for Ganesh invocation
const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  left: `${14 + (i * 7) % 72}%`,
  top: `${25 + (i * 13) % 55}%`,
  size: 2 + (i % 3) * 1.5,
  delay: (i * 0.35) % 2.5,
  duration: 4 + (i % 3) * 1.2,
}));

// Timeline Milestone Logger
const logTimeline = (phase: string, details?: any) => {
  if (typeof window !== 'undefined') {
    const timestamp = (performance.now() / 1000).toFixed(3);
    console.log(
      `%c[CinematicTimeline @ ${timestamp}s] %c${phase}`,
      'color: #D4AF37; font-weight: bold;',
      'color: #F3E5AB; font-weight: normal;',
      details || ''
    );
  }
};

export const OpeningAnimation: React.FC<OpeningAnimationProps> = ({ onComplete }) => {
  const { config } = useWedding();
  const shouldReduceMotion = useReducedMotion();

  // State Machine Phase
  const [phase, setPhase] = useState<CinematicPhase>('INTRO_PLAYING');
  const [isOverlayVisible, setIsOverlayVisible] = useState(true);
  const [hasPlayed, setHasPlayed] = useState(false);

  // Authoritative timeline timer references
  const introHoldTimerRef = useRef<any>(null);
  const ganeshEnteringTimerRef = useRef<any>(null);
  const ganeshHoldTimerRef = useRef<any>(null);
  const ganeshExitTimerRef = useRef<any>(null);
  const activePhaseRef = useRef<CinematicPhase>('INTRO_PLAYING');

  useEffect(() => {
    activePhaseRef.current = phase;
  }, [phase]);

  // Clean all sequence timers
  const clearTimers = useCallback(() => {
    if (introHoldTimerRef.current) clearTimeout(introHoldTimerRef.current);
    if (ganeshEnteringTimerRef.current) clearTimeout(ganeshEnteringTimerRef.current);
    if (ganeshHoldTimerRef.current) clearTimeout(ganeshHoldTimerRef.current);
    if (ganeshExitTimerRef.current) clearTimeout(ganeshExitTimerRef.current);
  }, []);

  // Unlock AudioContext on earliest user touch/click
  useEffect(() => {
    const handleFirstGesture = () => {
      devotionalAudio.unlockAudioContext();
    };
    window.addEventListener('pointerdown', handleFirstGesture, { once: true });
    window.addEventListener('keydown', handleFirstGesture, { once: true });
    return () => {
      window.removeEventListener('pointerdown', handleFirstGesture);
      window.removeEventListener('keydown', handleFirstGesture);
    };
  }, []);

  // Preload Devanagari fonts and critical Hero image
  useEffect(() => {
    // 1. Font readiness check to eliminate any layout shift
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        logTimeline('FONTS_READY (Noto Serif Devanagari & Rozha One verified)');
      });
    }

    // 2. Preload Hero background image during intro so resultant scene renders instantaneously
    if (config.couple.couplePhoto) {
      const img = new Image();
      img.src = config.couple.couplePhoto;
      img.onload = () => {
        logTimeline('HERO_IMAGE_PRELOADED', config.couple.couplePhoto);
      };
    }
  }, [config.couple.couplePhoto]);

  // Scroll Lock during cinematic sequence
  useEffect(() => {
    if (phase !== 'MAIN_EXPERIENCE' && !hasPlayed) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [phase, hasPlayed]);

  // PHASE 1 -> PHASE 2: Triggered strictly when intro animation completes
  const startTransitionToGanesh = useCallback(() => {
    if (activePhaseRef.current !== 'INTRO_PLAYING') return;
    clearTimers();
    logTimeline('GANESH_SCENE_START (T+0ms: Rishabh & Simran exit begins)');
    setPhase('INTRO_EXITING');
  }, [clearTimers]);

  // PHASE 2 -> PHASE 3 (Entrance of Ganesh scene)
  const enterGaneshScene = useCallback(() => {
    clearTimers();
    setPhase('GANESH_ENTERING');
    logTimeline('GANESH_ENTERING (T+0ms: Golden aura emerges, audio fade-in begins)');

    const ganeshAudioEnabled = config.music?.ganeshAudioEnabled !== false;
    const ganeshAudioVolume = config.music?.ganeshAudioVolume ?? 80;
    const ganeshAudioSrc = config.music?.ganeshAudioSrc;

    // AUDIO TIMELINE: T+0ms Begin hymn / devotional audio fade-in (0 -> target volume over 500ms)
    if (ganeshAudioEnabled) {
      devotionalAudio.timelineStartFadeIn(ganeshAudioVolume, 500, ganeshAudioSrc);
    }

    // After 400ms, glow has settled -> enter GANESH_ACTIVE
    ganeshEnteringTimerRef.current = setTimeout(() => {
      activateGaneshScene();
    }, 400);
  }, [clearTimers, config.music]);

  // PHASE 3 (Active Ganesh Invocation: Reveal + Chime + Sacred Hold)
  const activateGaneshScene = useCallback(() => {
    clearTimers();
    setPhase('GANESH_ACTIVE');
    logTimeline('GANESH_ACTIVE (T+400ms: Devanagari text fading in with subtle scale & blur)');

    const ganeshAudioEnabled = config.music?.ganeshAudioEnabled !== false;
    const ganeshAudioVolume = config.music?.ganeshAudioVolume ?? 80;

    // Chime the sacred bronze bell as the sacred mantra resolves
    setTimeout(() => {
      if (activePhaseRef.current === 'GANESH_ACTIVE' && ganeshAudioEnabled) {
        devotionalAudio.timelineChimeBell(Math.min(100, Math.round(ganeshAudioVolume * 1.1)));
        logTimeline('GANESH_BELL_CHIME (Authentic 528Hz bronze bell strike)');
      }
    }, 250);

    // Sacred hold: 3.1s total in this phase (from T+400ms to T+3500ms overall)
    // Allows ~2.5 seconds of serene, comfortable reading hold
    ganeshHoldTimerRef.current = setTimeout(() => {
      exitGaneshScene();
    }, 3100);
  }, [clearTimers, shouldReduceMotion, config.music]);

  // PHASE 4 -> PHASE 5 (Ganesh Exit: Text fade, audio fade to 0, background dissolve)
  const exitGaneshScene = useCallback(() => {
    if (activePhaseRef.current === 'GANESH_EXITING' || activePhaseRef.current === 'MAIN_EXPERIENCE') return;
    clearTimers();
    setPhase('GANESH_EXITING');
    logTimeline('GANESH_EXIT (T+3500ms: Text dissolving, audio fade-out target -> 0 begins)');

    // AUDIO TIMELINE: T+3500ms Begin audio fade-out (target volume -> 0 over 900ms)
    devotionalAudio.timelineFadeOut(900);

    // After 1000ms (at T+4500ms), audio is strictly silent and overlay completes dissolve
    ganeshExitTimerRef.current = setTimeout(() => {
      completeCinematicExperience();
    }, 1000);
  }, [clearTimers]);

  // PHASE 5: Complete Experience and Handoff to Main Website
  const completeCinematicExperience = useCallback(() => {
    clearTimers();

    // AUDIO MUST NOT CONTINUE INTO THE NEXT SLIDE:
    // Guarantee 100% complete silence and disconnect
    devotionalAudio.timelineStopImmediate();
    logTimeline('GANESH_AUDIO_END (Confirmed 100% silent before resultant slide begins)');

    setPhase('MAIN_EXPERIENCE');
    setIsOverlayVisible(false);
    setHasPlayed(true);
    document.body.style.overflow = '';

    logTimeline('MAIN_SCENE_START (Hero section visible, starting background music with crossfade)');
    window.dispatchEvent(new CustomEvent('wedding:play-music'));
    onComplete();
  }, [clearTimers, onComplete]);

  // Initial Sequence Boot: Entrance panel always starts cleanly for every visitor
  useEffect(() => {
    setHasPlayed(false);
    setIsOverlayVisible(true);
    setPhase('INTRO_PLAYING');
    devotionalAudio.resetHymnState();
    window.dispatchEvent(new CustomEvent('wedding:intro-start'));
    logTimeline('INTRO_START (Rishabh & Simran romantic introduction)');

    return () => {
      clearTimers();
      devotionalAudio.timelineStopImmediate();
      document.body.style.overflow = '';
    };
  }, [clearTimers]);

  // Event handler for when the Rishabh & Simran intro animation finishes naturally
  const handleIntroAnimationComplete = useCallback(() => {
    logTimeline('INTRO_COMPLETE (Rishabh & Simran animation has reached its ACTUAL completion)');

    // Keep the romantic entrance cover waiting for the visitor to tap 'Enter Celebration'
    // with a generous 15-second safety timeout so it never hangs indefinitely
    introHoldTimerRef.current = setTimeout(() => {
      startTransitionToGanesh();
    }, 15000);
  }, [startTransitionToGanesh]);

  // Immediate Skip handler
  const handleSkip = (e: React.MouseEvent) => {
    e.stopPropagation();
    devotionalAudio.unlockAudioContext();
    window.dispatchEvent(new CustomEvent('wedding:user-gesture'));
    logTimeline('USER_SKIPPED_INTRO');
    completeCinematicExperience();
  };

  // Interactive Screen Tap: advances smoothly to the next natural cinematic beat
  const handleScreenTap = () => {
    devotionalAudio.unlockAudioContext();
    window.dispatchEvent(new CustomEvent('wedding:user-gesture'));

    if (phase === 'INTRO_PLAYING') {
      const ganeshAudioVolume = config.music?.ganeshAudioVolume ?? 80;
      const ganeshAudioSrc = config.music?.ganeshAudioSrc;
      // Start devotional audio directly in this user interaction so phone browsers never block it!
      devotionalAudio.timelineStartFadeIn(ganeshAudioVolume, 400, ganeshAudioSrc);
      startTransitionToGanesh();
    } else if (phase === 'GANESH_ENTERING' || phase === 'GANESH_ACTIVE') {
      exitGaneshScene();
    } else if (phase === 'GANESH_EXITING') {
      completeCinematicExperience();
    }
  };

  if (hasPlayed || phase === 'MAIN_EXPERIENCE') return null;

  const letterVariants = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.16, 1, 0.3, 1] } },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.04, delayChildren: 0.8 },
    },
  };

  const coupleName = `${config.couple.brideName} & ${config.couple.groomName}`;
  const isGaneshLayerActive = phase === 'GANESH_ENTERING' || phase === 'GANESH_ACTIVE' || phase === 'GANESH_EXITING';

  return (
    <AnimatePresence>
      {isOverlayVisible && (
        <motion.div
          key="master-cinematic-stage"
          className="fixed inset-0 z-50 flex flex-col items-center justify-center select-none overflow-hidden cursor-pointer"
          style={{
            paddingTop: 'max(1.5rem, env(safe-area-inset-top, 1.5rem))',
            paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: phase === 'GANESH_EXITING' ? 0 : 1,
            backgroundColor: isGaneshLayerActive || phase === 'INTRO_EXITING' ? '#150508' : '#FAF7F2',
          }}
          exit={{ opacity: 0 }}
          transition={{
            backgroundColor: { duration: 0.8, ease: [0.65, 0, 0.35, 1] },
            opacity: { duration: 0.9, ease: [0.65, 0, 0.35, 1] },
          }}
          onClick={handleScreenTap}
          onPointerDown={() => window.dispatchEvent(new CustomEvent('wedding:user-gesture'))}
          role="dialog"
          aria-label="Cinematic Wedding Introduction"
        >
          {/* ========================================================
              ATMOSPHERIC LAYER: Radial Velvet Maroon & Golden Core
              Transitions smoothly without black flash
              ======================================================== */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: isGaneshLayerActive || phase === 'INTRO_EXITING' ? 1 : 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 48%, rgba(184, 155, 94, 0.20) 0%, rgba(36, 10, 16, 0.96) 55%, #120407 100%)
              `,
            }}
          />

          {/* Golden Breathing Central Aura behind the sacred invocation */}
          {isGaneshLayerActive && (
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rounded-full blur-3xl devotional-aura-pulse"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{
                opacity: phase === 'GANESH_EXITING' ? 0 : 0.6,
                scale: phase === 'GANESH_EXITING' ? 1.15 : 1,
              }}
              transition={{
                opacity: { duration: phase === 'GANESH_EXITING' ? 0.9 : 0.4, ease: 'easeOut' },
                scale: { duration: phase === 'GANESH_EXITING' ? 0.9 : 0.4, ease: 'easeOut' },
              }}
              style={{
                width: 'min(540px, 90vw)',
                height: 'min(540px, 90vw)',
                background: 'radial-gradient(circle, rgba(212, 175, 55, 0.28) 0%, rgba(184, 155, 94, 0.10) 50%, transparent 75%)',
              }}
            />
          )}

          {/* Golden Floating Micro-particles (Devotional Scene) */}
          {isGaneshLayerActive && !shouldReduceMotion && (
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
                    boxShadow: '0 0 8px rgba(229, 192, 123, 0.65)',
                    animationDelay: `${p.delay}s`,
                    animationDuration: `${p.duration}s`,
                  }}
                />
              ))}
            </div>
          )}

          {/* ========================================================
              PHASE 1 & 2: RISHABH & SIMRAN ROMANTIC INTRODUCTION
              ======================================================== */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-6"
            initial={{ opacity: 1 }}
            animate={{
              opacity: phase === 'INTRO_PLAYING' ? 1 : 0,
              scale: phase === 'INTRO_PLAYING' ? 1 : 0.97,
            }}
            transition={{ duration: 0.8, ease: [0.65, 0, 0.35, 1] }}
            onAnimationComplete={() => {
              if (phase === 'INTRO_EXITING') {
                enterGaneshScene();
              }
            }}
          >
            {/* Decorative Corner Motifs */}
            <CornerMotif position="top-left" className="top-4 left-4 opacity-75" />
            <CornerMotif position="top-right" className="top-4 right-4 opacity-75" />
            <CornerMotif position="bottom-left" className="bottom-4 left-4 opacity-75" />
            <CornerMotif position="bottom-right" className="bottom-4 right-4 opacity-75" />

            {/* Monogram */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-6 sm:mb-8"
            >
              <Monogram text={config.couple.coupleInitials} size={110} />
            </motion.div>

            {/* Couple Names (Letter-by-letter reveal) */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-wrap justify-center font-heading text-4xl sm:text-5xl md:text-6xl text-[var(--color-primary)] text-center tracking-wide px-4 max-w-3xl"
            >
              {coupleName.split('').map((char, index) => (
                <motion.span key={index} variants={letterVariants}>
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
            </motion.div>

            {/* Subtitle / City Badge: The final animating element of the intro */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 0.85, y: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              onAnimationComplete={handleIntroAnimationComplete}
              className="font-script text-lg sm:text-xl md:text-2xl text-[var(--color-secondary)] mt-4 italic"
            >
              {config.wedding.city || 'Kanpur Nagar'}
            </motion.p>

            {/* Interactive Royal Entrance Button */}
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              className="mt-6 sm:mt-8 flex flex-col items-center gap-2.5 pointer-events-auto z-20"
            >
              <motion.button
                type="button"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleScreenTap();
                }}
                className="px-8 sm:px-10 py-3.5 sm:py-4 rounded-full bg-[var(--color-primary)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/70 shadow-2xl uppercase tracking-[0.22em] text-xs sm:text-sm font-body font-semibold flex items-center gap-3.5 backdrop-blur-md cursor-pointer hover:brightness-110 active:scale-95 transition-all"
                style={{
                  boxShadow: '0 10px 30px -5px rgba(100, 31, 45, 0.5), 0 0 25px rgba(184, 155, 94, 0.4)',
                }}
                aria-label="Enter celebration with music"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-secondary)] animate-ping" />
                <span>Enter Celebration 🪷</span>
              </motion.button>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[var(--color-primary)]/80 font-body font-medium flex items-center gap-1.5">
                <span>Tap to open with music</span>
                <span>🎵</span>
              </span>
            </motion.div>
          </motion.div>

          {/* ========================================================
              PHASE 3 & 4: DEDICATED SACRED GANESH INVOCATION
              ======================================================== */}
          <motion.div
            className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-4 sm:px-6 text-center max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.97, filter: 'blur(4px)' }}
            animate={{
              opacity: phase === 'GANESH_ACTIVE' ? 1 : 0,
              scale: phase === 'GANESH_ACTIVE' ? 1 : phase === 'GANESH_EXITING' ? 1.02 : 0.97,
              filter: phase === 'GANESH_ACTIVE' ? 'blur(0px)' : phase === 'GANESH_EXITING' ? 'blur(3px)' : 'blur(4px)',
            }}
            transition={{
              duration: phase === 'GANESH_EXITING' ? 0.9 : 0.6,
              ease: phase === 'GANESH_EXITING' ? [0.65, 0, 0.35, 1] : [0.16, 1, 0.3, 1],
            }}
          >
            {/* Sacred Linework Kalash / Lotus Emblem */}
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: phase === 'GANESH_ACTIVE' ? 0.85 : 0, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mb-3 sm:mb-4"
            >
              <svg
                width="54"
                height="32"
                viewBox="0 0 54 32"
                fill="none"
                className="mx-auto text-[#C5A880]"
              >
                <path
                  d="M27 2C27 2 21 10 21 16C21 19.3 23.7 22 27 22C30.3 22 33 19.3 33 16C33 10 27 2 27 2Z"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M27 22V30M18 26C21 28 24 30 27 30C30 30 33 28 36 26"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
                <circle cx="27" cy="14" r="2.5" fill="currentColor" fillOpacity="0.8" />
                <path
                  d="M12 16C12 16 16 19 21 19M42 16C42 16 38 19 33 19"
                  stroke="currentColor"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                />
                <circle cx="9" cy="16" r="1.5" fill="currentColor" fillOpacity="0.7" />
                <circle cx="45" cy="16" r="1.5" fill="currentColor" fillOpacity="0.7" />
              </svg>
            </motion.div>

            {/* Dominant Sacred Devanagari Typography: "ॐ नमो गणेशाय नमः" */}
            <motion.h1
              className="font-devanagari text-[clamp(1.75rem,5.2vw,3.25rem)] text-center text-[#FBF5E8] leading-tight tracking-wide drop-shadow-[0_2px_14px_rgba(212,175,55,0.45)] px-2"
              style={{
                fontFamily: "'Rozha One', 'Noto Serif Devanagari', serif",
                whiteSpace: 'normal',
                wordBreak: 'keep-all',
              }}
            >
              ॐ नमो गणेशाय नमः
            </motion.h1>

            {/* Refined Gold Ornamental Divider */}
            <motion.div
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{ scaleX: phase === 'GANESH_ACTIVE' ? 1 : 0, opacity: phase === 'GANESH_ACTIVE' ? 0.75 : 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="my-3 sm:my-4 flex items-center justify-center gap-3 w-full max-w-xs mx-auto"
            >
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
              <div className="w-1.5 h-1.5 rotate-45 border border-[#E5C07B] bg-[#C5A880]/40" />
              <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C5A880] to-transparent" />
            </motion.div>

            {/* Secondary Roman Transliteration: "Om Namo Ganeshaya Namaha" */}
            <motion.p
              className="font-serif italic text-[clamp(0.85rem,2.2vw,1.15rem)] text-[#C5A880] tracking-[0.25em] sm:tracking-[0.35em] text-center uppercase opacity-85 px-4"
              style={{ fontFamily: "'Cormorant Garamond', Georgia, serif" }}
            >
              Om Namo Ganeshaya Namaha
            </motion.p>
          </motion.div>

          {/* ========================================================
              UNOBTRUSIVE 'SKIP INTRO' BUTTON
              Accessible, comfortable 44px tap target, stops audio instantly
              ======================================================== */}
          <button
            type="button"
            onClick={handleSkip}
            className="absolute bottom-6 right-6 z-20 text-[11px] uppercase tracking-[0.25em] text-white/50 hover:text-[#C5A880] transition-colors py-2 px-3 rounded border border-white/10 hover:border-[#C5A880]/40 bg-black/20 backdrop-blur-sm min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Skip introduction"
          >
            Skip Intro
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OpeningAnimation;
