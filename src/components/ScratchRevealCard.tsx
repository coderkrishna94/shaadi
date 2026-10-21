import React, { useRef, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { OrnamentalDivider } from '@/components/IndianMotifs';
import { scratchAudio } from '@/utils/scratchAudio';
import { resolveAssetUrl } from '@/utils/mediaUtils';

// ============================================================
// SCRATCH CARD CONFIGURATION DEFAULTS
// ============================================================
const weddingRevealConfig = {
  enabled: true,
  date: '',
  teaserTitle: 'A little secret awaits…',
  scratchText: 'Scratch to reveal our special date',
  celebrationTitle: "We're Getting Married!",
  celebrationMessage: "We can't wait to celebrate this beautiful day with you.",
  scratchAudioEnabled: false,
  scratchAudioSound: 'foil-scratch',
  scratchAudioVolume: 35,
  celebrationMusicEnabled: true,
  celebrationMusicSrc: '/uploads/Y2Mate.is_-_Shubhaarambh_Full_Video_-_Kai_Po_Che___Sushant_Singh_Rajput___Rajkummar_Rao___Amit_Sadh___Amit_T.mp3',
  celebrationMusicTitle: 'Shubhaarambh — Kai Po Che',
  celebrationMusicVolume: 80,
  scratchThreshold: 55,
  colors: {
    card: '#F8F3EA',
    gold: '#C9A45C',
    text: '#3E352D',
    scratchSurface: '#D8C29A',
    blush: '#F5E6E0',
    celebration: '#FFFCF5',
  },
  animation: {
    duration: 900,
    particles: true,
    petals: true,
  },
  brushSize: 36,
  fallbackButtonText: 'Reveal Date',
};

// ---- Particle System for Celebration ----
interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  rotation: number;
  delay: number;
  type: 'sparkle' | 'petal' | 'glow';
}

function generateParticles(cfg = weddingRevealConfig): Particle[] {
  const particles: Particle[] = [];
  let id = 0;

  // Gold sparkles
  if (cfg.animation?.particles) {
    for (let i = 0; i < 30; i++) {
      particles.push({
        id: id++,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 6 + 2,
        color: cfg.colors?.gold || '#C9A45C',
        rotation: Math.random() * 360,
        delay: Math.random() * 0.8,
        type: 'sparkle',
      });
    }
  }

  // Soft petals
  if (cfg.animation?.petals) {
    const petalColors = [cfg.colors?.blush || '#F5E6E0', '#F9E4D4', '#FAD4C0', '#F0D5CE', '#EDE0D8'];
    for (let i = 0; i < 15; i++) {
      particles.push({
        id: id++,
        x: Math.random() * 100,
        y: -10 - Math.random() * 30,
        size: Math.random() * 14 + 8,
        color: petalColors[Math.floor(Math.random() * petalColors.length)],
        rotation: Math.random() * 360,
        delay: Math.random() * 1.5,
        type: 'petal',
      });
    }
  }

  // Gentle glows
  for (let i = 0; i < 8; i++) {
    particles.push({
      id: id++,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 40 + 20,
      color: cfg.colors?.gold || '#C9A45C',
      rotation: 0,
      delay: Math.random() * 0.5,
      type: 'glow',
    });
  }

  return particles;
}

// ---- Celebration Modal ----
function CelebrationModal({
  date,
  cfg,
  onClose,
}: {
  date: string;
  cfg: typeof weddingRevealConfig;
  onClose: () => void;
}) {
  const particles = useRef(generateParticles(cfg)).current;
  const reducedMotion = useReducedMotion();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const rawCelebrationSrc = cfg.celebrationMusicSrc || '/uploads/Y2Mate.is_-_Shubhaarambh_Full_Video_-_Kai_Po_Che___Sushant_Singh_Rajput___Rajkummar_Rao___Amit_Sadh___Amit_T.mp3';
  const celebrationAudioSrc = resolveAssetUrl(rawCelebrationSrc);
  const musicTitle = cfg.celebrationMusicTitle || 'Celebration Music';
  const isMusicEnabled = cfg.celebrationMusicEnabled !== false && !!celebrationAudioSrc;

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    // Notify background music player to pause
    window.dispatchEvent(new CustomEvent('wedding:celebration-start'));

    // Start celebration music
    if (isMusicEnabled && audioRef.current) {
      audioRef.current.volume = (cfg.celebrationMusicVolume !== undefined ? cfg.celebrationMusicVolume : 80) / 100;
      audioRef.current.currentTime = 0;
      audioRef.current.play()
        .then(() => setIsPlayingMusic(true))
        .catch(() => {
          // Autoplay fallback: if blocked by browser policy, play on first user gesture
          const resumeAudio = () => {
            if (audioRef.current && !isMuted) {
              audioRef.current.play().then(() => setIsPlayingMusic(true)).catch(() => {});
            }
            window.removeEventListener('pointerdown', resumeAudio);
            window.removeEventListener('click', resumeAudio);
          };
          window.addEventListener('pointerdown', resumeAudio, { once: true });
          window.addEventListener('click', resumeAudio, { once: true });
        });
    }

    return () => {
      document.body.style.overflow = '';
      if (audioRef.current) {
        audioRef.current.pause();
      }
      // Notify background music player to resume
      window.dispatchEvent(new CustomEvent('wedding:celebration-end'));
    };
  }, [celebrationAudioSrc, isMusicEnabled]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isPlayingMusic && !isMuted) {
      audioRef.current.pause();
      setIsPlayingMusic(false);
      setIsMuted(true);
    } else {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
        setIsMuted(false);
      }).catch(() => {});
    }
  };

  const goldColor = cfg.colors?.gold || '#C9A45C';
  const celebrationBg = cfg.colors?.celebration || '#FFFCF5';
  const textColor = cfg.colors?.text || '#3E352D';

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Wedding date celebration"
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      {/* Floating particles */}
      {!reducedMotion && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p) =>
            p.type === 'sparkle' ? (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  backgroundColor: p.color,
                  boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0.8, 0],
                  scale: [0, 1.2, 1, 0.5],
                  y: [0, -30 - Math.random() * 60],
                }}
                transition={{
                  duration: 2 + Math.random(),
                  delay: p.delay,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2,
                }}
              />
            ) : p.type === 'petal' ? (
              <motion.div
                key={p.id}
                className="absolute"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size * 0.6,
                  backgroundColor: p.color,
                  borderRadius: '50% 0 50% 0',
                  opacity: 0.7,
                }}
                initial={{ opacity: 0, rotate: p.rotation }}
                animate={{
                  opacity: [0, 0.7, 0.5, 0],
                  y: [0, 400 + Math.random() * 200],
                  x: [0, (Math.random() - 0.5) * 100],
                  rotate: p.rotation + 360 + Math.random() * 180,
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  delay: p.delay,
                  ease: 'easeOut',
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2,
                }}
              />
            ) : (
              <motion.div
                key={p.id}
                className="absolute rounded-full"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  background: `radial-gradient(circle, ${p.color}30, transparent)`,
                }}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{
                  opacity: [0, 0.3, 0],
                  scale: [0.5, 1.5, 0.8],
                }}
                transition={{
                  duration: 3,
                  delay: p.delay,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />
            )
          )}
        </div>
      )}

      {/* Modal Card */}
      <motion.div
        className="relative z-10 rounded-2xl shadow-2xl max-w-md w-full mx-auto overflow-hidden"
        style={{ backgroundColor: celebrationBg }}
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: (cfg.animation?.duration || 900) / 1000, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gold top accent line */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${goldColor}, transparent)` }} />

        <div className="px-5 py-8 sm:px-8 sm:py-10 md:px-12 md:py-14 text-center">
          {/* Small ornament */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
              <path d="M20 0C20 0 25 10 35 10C25 10 20 20 20 20C20 20 15 10 5 10C15 10 20 0 20 0Z" fill={goldColor} />
              <circle cx="20" cy="10" r="2" fill={celebrationBg} />
              <circle cx="20" cy="10" r="1" fill={goldColor} />
            </svg>
          </motion.div>

          <motion.p
            className="font-script text-base sm:text-lg md:text-xl mb-2"
            style={{ fontFamily: 'var(--font-script)', color: goldColor }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {cfg.celebrationTitle}
          </motion.p>

          <motion.h3
            className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-4 tracking-wide leading-tight px-2"
            style={{ fontFamily: 'var(--font-heading)', color: textColor }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            {date}
          </motion.h3>

          {/* Thin gold line */}
          <motion.div
            className="mx-auto mb-6"
            style={{ width: 60, height: 1, background: `linear-gradient(90deg, transparent, ${goldColor}, transparent)` }}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          />

          <motion.p
            className="font-body text-sm md:text-base leading-relaxed mb-8"
            style={{ fontFamily: 'var(--font-body)', color: `${textColor}cc` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            {cfg.celebrationMessage}
          </motion.p>

          {/* Celebration Music Indicator & Mute Toggle */}
          {isMusicEnabled && (
            <motion.div 
              className="flex items-center justify-center mb-6"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
            >
              <button
                type="button"
                onClick={toggleMusic}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 cursor-pointer shadow-sm active:scale-95"
                style={{
                  borderColor: `${goldColor}60`,
                  color: goldColor,
                  backgroundColor: isPlayingMusic && !isMuted ? `${goldColor}15` : 'transparent',
                }}
                title={isPlayingMusic && !isMuted ? 'Mute celebration music' : 'Play celebration music'}
                aria-label={isPlayingMusic && !isMuted ? 'Mute celebration music' : 'Play celebration music'}
              >
                {isPlayingMusic && !isMuted ? (
                  <>
                    <span className="flex items-end gap-[2.5px] h-3">
                      <span className="w-1 bg-[var(--color-secondary)] animate-bounce h-2.5 rounded-full" />
                      <span className="w-1 bg-[var(--color-secondary)] animate-bounce h-3.5 rounded-full [animation-delay:0.2s]" />
                      <span className="w-1 bg-[var(--color-secondary)] animate-bounce h-2 rounded-full [animation-delay:0.4s]" />
                    </span>
                    <span className="truncate max-w-[200px] font-body text-[11px] tracking-wider uppercase">{musicTitle}</span>
                  </>
                ) : (
                  <>
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                    <span className="font-body text-[11px] tracking-wider uppercase">Play Celebration Music</span>
                  </>
                )}
              </button>
            </motion.div>
          )}

          {/* Hidden celebration audio player */}
          {isMusicEnabled && (
            <audio
              ref={audioRef}
              src={celebrationAudioSrc}
              loop
              preload="auto"
              className="hidden"
            />
          )}

          <motion.button
            onClick={onClose}
            className="px-8 py-2.5 text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 border cursor-pointer"
            style={{
              borderColor: goldColor,
              color: goldColor,
              fontFamily: 'var(--font-body)',
              borderRadius: 'var(--border-radius)',
            }}
            whileHover={{ backgroundColor: goldColor, color: '#fff' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Continue
          </motion.button>
        </div>

        {/* Gold bottom accent line */}
        <div className="h-1" style={{ background: `linear-gradient(90deg, transparent, ${goldColor}, transparent)` }} />
      </motion.div>
    </motion.div>
  );
}

// ---- Main Scratch Card Component ----
export default function ScratchRevealCard() {
  const { config } = useWedding();
  const cfg = config.scratchCard ? { ...weddingRevealConfig, ...config.scratchCard } : weddingRevealConfig;
  const shouldReduceMotion = useReducedMotion();

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const lastCalcTime = useRef<number>(0);
  const isRevealingRef = useRef(false);
  const stopScratchTimerRef = useRef<any>(null);

  const [isRevealed, setIsRevealed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [scratchPercent, setScratchPercent] = useState(0);

  // Clean up any ongoing scratch sound on unmount
  useEffect(() => {
    return () => {
      if (stopScratchTimerRef.current) clearTimeout(stopScratchTimerRef.current);
      scratchAudio.stop();
    };
  }, []);

  // Format the wedding date
  const formattedDate = cfg.date || (() => {
    try {
      const d = new Date(config.wedding.date);
      return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return config.wedding.date;
    }
  })();

  // Initialize canvas surface
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const rect = container.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.round(rect.width * dpr);
    canvas.height = Math.round(rect.height * dpr);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Scale context to DPR so drawing commands use CSS pixels
    ctx.scale(dpr, dpr);

    // Fill with scratch surface color
    const surfaceColor = cfg.colors?.scratchSurface || '#D8C29A';
    const goldColor = cfg.colors?.gold || '#C9A45C';
    const textColor = cfg.colors?.text || '#3E352D';

    ctx.fillStyle = surfaceColor;
    ctx.fillRect(0, 0, rect.width, rect.height);

    // Subtle luxury shimmer texture
    ctx.globalAlpha = 0.08;
    for (let i = 0; i < 180; i++) {
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(Math.random() * rect.width, Math.random() * rect.height, Math.random() * 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;

    // Decorative fine border
    ctx.strokeStyle = goldColor;
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.25;
    const inset = 12;
    ctx.strokeRect(inset, inset, rect.width - inset * 2, rect.height - inset * 2);
    ctx.globalAlpha = 0.12;
    ctx.strokeRect(inset + 4, inset + 4, rect.width - (inset + 4) * 2, rect.height - (inset + 4) * 2);
    ctx.globalAlpha = 1;

    // Small paisley motif in center
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = goldColor;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    ctx.beginPath();
    ctx.ellipse(cx, cy - 10, 20, 30, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx, cy + 20, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    // Instruction text (fluid size for mobile)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = textColor;
    ctx.globalAlpha = 0.65;
    const fontSize = rect.width < 340 ? '11px' : '13px';
    ctx.font = `500 ${fontSize} var(--font-body, Inter, sans-serif)`;
    ctx.fillText(cfg.scratchText || 'Scratch to reveal our special date', cx, cy + 45);
    ctx.globalAlpha = 1;
  }, [cfg]);

  // Initial layout delay to ensure container dimensions are ready
  useEffect(() => {
    if (!isRevealed) {
      const t = setTimeout(initCanvas, 120);
      return () => clearTimeout(t);
    }
  }, [initCanvas, isRevealed]);

  // Handle window resize
  useEffect(() => {
    if (isRevealed) return;
    const handleResize = () => initCanvas();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [initCanvas, isRevealed]);

  // Complete reveal trigger
  const completeReveal = useCallback(() => {
    if (isRevealingRef.current || isRevealed) return;
    isRevealingRef.current = true;
    if (cfg.scratchAudioEnabled) {
      if (stopScratchTimerRef.current) clearTimeout(stopScratchTimerRef.current);
      scratchAudio.stop();
      window.dispatchEvent(new CustomEvent('wedding:scratch-end'));
    }
    setIsRevealed(true);

    // Show celebration modal after fade
    const animDuration = cfg.animation?.duration || 900;
    setTimeout(() => {
      setShowCelebration(true);
      isRevealingRef.current = false;
    }, animDuration * 0.7);
  }, [isRevealed, cfg.animation?.duration, cfg.scratchAudioEnabled]);

  // High-performance percentage calculator (samples every 32 bytes for 120 FPS performance)
  const calculatePercent = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed || isRevealingRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    try {
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;
      let transparent = 0;
      const step = 32; // Sample every 8th pixel
      const totalSampled = Math.floor(pixels.length / step);

      for (let i = 3; i < pixels.length; i += step) {
        if (pixels[i] === 0) transparent++;
      }

      const pct = totalSampled > 0 ? (transparent / totalSampled) * 100 : 0;
      setScratchPercent(pct);

      if (pct >= (cfg.scratchThreshold || 55)) {
        completeReveal();
      }
    } catch {
      // Ignore cross-origin context errors if any
    }
  }, [isRevealed, cfg.scratchThreshold, completeReveal]);

  // Smooth scratch logic with continuous stroke interpolation & responsive brush
  const scratch = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed || isRevealingRef.current) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Mobile adaptive brush size
    const isSmall = rect.width < 340;
    const brush = isSmall ? 28 : (cfg.brushSize || 36);

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = brush;

    ctx.beginPath();
    if (lastPos.current) {
      // Connect previous point to current point for smooth continuous scratch
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      // Single tap or start of stroke
      ctx.arc(x, y, brush / 2, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';

    lastPos.current = { x, y };

    // Throttled percentage calculation during fast movements
    const now = Date.now();
    if (now - lastCalcTime.current > 60) {
      lastCalcTime.current = now;
      calculatePercent();
    }
  }, [isRevealed, cfg.brushSize, calculatePercent]);

  // Unified Pointer Events (works flawlessly for Mouse, Finger Touch, and Stylus)
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.setPointerCapture(e.pointerId);
    } catch {
      // Ignore capture if unsupported
    }
    isDrawing.current = true;
    lastPos.current = null;

    if (cfg.scratchAudioEnabled && !shouldReduceMotion) {
      scratchAudio.start(cfg.scratchAudioVolume ?? 35, cfg.scratchAudioSound || 'foil-scratch');
      window.dispatchEvent(new CustomEvent('wedding:scratch-start'));
    }

    scratch(e.clientX, e.clientY);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current) return;

    if (cfg.scratchAudioEnabled && !shouldReduceMotion) {
      scratchAudio.start(cfg.scratchAudioVolume ?? 35, cfg.scratchAudioSound || 'foil-scratch');
      if (stopScratchTimerRef.current) clearTimeout(stopScratchTimerRef.current);
      stopScratchTimerRef.current = setTimeout(() => {
        scratchAudio.stop();
        window.dispatchEvent(new CustomEvent('wedding:scratch-end'));
      }, 140);
    }

    scratch(e.clientX, e.clientY);
  };

  const handlePointerUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;
    lastPos.current = null;

    if (cfg.scratchAudioEnabled) {
      if (stopScratchTimerRef.current) clearTimeout(stopScratchTimerRef.current);
      scratchAudio.stop();
      window.dispatchEvent(new CustomEvent('wedding:scratch-end'));
    }

    calculatePercent();
  };

  // Reset scratch card function for demo/testing
  const resetCard = () => {
    isRevealingRef.current = false;
    if (cfg.scratchAudioEnabled) {
      if (stopScratchTimerRef.current) clearTimeout(stopScratchTimerRef.current);
      scratchAudio.stop();
      window.dispatchEvent(new CustomEvent('wedding:scratch-end'));
    }
    setIsRevealed(false);
    setShowCelebration(false);
    setScratchPercent(0);
    lastPos.current = null;
    isDrawing.current = false;
    setTimeout(initCanvas, 100);
  };

  if (cfg.enabled === false) return null;

  const cardBg = cfg.colors?.card || '#F8F3EA';
  const goldColor = cfg.colors?.gold || '#C9A45C';
  const textColor = cfg.colors?.text || '#3E352D';

  return (
    <section
      id="scratch-reveal"
      className="py-16 md:py-24 relative overflow-hidden"
      style={{ backgroundColor: 'var(--color-bg)' }}
    >
      <div className="container mx-auto px-4 max-w-2xl text-center">
        {/* Teaser text */}
        <motion.p
          className="font-script text-xl md:text-2xl mb-2"
          style={{ fontFamily: 'var(--font-script)', color: 'var(--color-secondary)' }}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          {cfg.teaserTitle}
        </motion.p>

        <OrnamentalDivider className="mx-auto mb-10" />

        {/* Scratch Card Outer Wrapper */}
        <motion.div
          className="relative mx-auto select-none w-full max-w-[340px] sm:max-w-[400px]"
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            touchAction: 'none',
          }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          {/* Card background with wedding date underneath */}
          <div
            ref={containerRef}
            className="relative rounded-xl overflow-hidden shadow-lg"
            style={{
              backgroundColor: cardBg,
              boxShadow: `0 4px 30px ${goldColor}20, 0 1px 4px rgba(0,0,0,0.06)`,
              border: `1px solid ${goldColor}30`,
              aspectRatio: '4 / 3',
              minHeight: 220,
            }}
          >
            {/* Hidden date content (revealed underneath) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
              <div className="mb-3" style={{ color: goldColor }}>
                <svg width="30" height="15" viewBox="0 0 40 20" fill="none">
                  <path d="M20 0C20 0 25 10 35 10C25 10 20 20 20 20C20 20 15 10 5 10C15 10 20 0 20 0Z" fill="currentColor" />
                </svg>
              </div>
              <p
                className="font-body text-xs tracking-[0.25em] uppercase mb-3"
                style={{ fontFamily: 'var(--font-body)', color: `${textColor}99` }}
              >
                Save the Date
              </p>
              <h3
                className="font-heading text-2xl md:text-3xl lg:text-4xl tracking-wide leading-tight"
                style={{ fontFamily: 'var(--font-heading)', color: textColor }}
              >
                {formattedDate}
              </h3>
              <div
                className="mt-3 mx-auto"
                style={{ width: 50, height: 1, background: `linear-gradient(90deg, transparent, ${goldColor}, transparent)` }}
              />
              <p
                className="font-script text-base md:text-lg mt-3"
                style={{ fontFamily: 'var(--font-script)', color: goldColor }}
              >
                {config.wedding.city || 'Kanpur Nagar'}
              </p>
            </div>

            {/* Scratch canvas overlay with smooth exit animation */}
            <AnimatePresence>
              {!isRevealed && (
                <motion.canvas
                  key="scratch-canvas"
                  ref={canvasRef}
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: (cfg.animation?.duration || 900) / 1000, ease: 'easeOut' }}
                  className="absolute inset-0 cursor-pointer rounded-xl"
                  style={{ touchAction: 'none' }}
                  onPointerDown={handlePointerDown}
                  onPointerMove={handlePointerMove}
                  onPointerUp={handlePointerUp}
                  onPointerCancel={handlePointerUp}
                  aria-hidden="true"
                />
              )}
            </AnimatePresence>
          </div>

          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 w-6 h-6 pointer-events-none" style={{ borderTop: `2px solid ${goldColor}40`, borderLeft: `2px solid ${goldColor}40`, borderRadius: '12px 0 0 0' }} />
          <div className="absolute top-0 right-0 w-6 h-6 pointer-events-none" style={{ borderTop: `2px solid ${goldColor}40`, borderRight: `2px solid ${goldColor}40`, borderRadius: '0 12px 0 0' }} />
          <div className="absolute bottom-0 left-0 w-6 h-6 pointer-events-none" style={{ borderBottom: `2px solid ${goldColor}40`, borderLeft: `2px solid ${goldColor}40`, borderRadius: '0 0 0 12px' }} />
          <div className="absolute bottom-0 right-0 w-6 h-6 pointer-events-none" style={{ borderBottom: `2px solid ${goldColor}40`, borderRight: `2px solid ${goldColor}40`, borderRadius: '0 0 12px 0' }} />
        </motion.div>

        {/* Accessible fallback button & sound toggle (before reveal) */}
        {!isRevealed && (
          <div className="mt-6 flex items-center justify-center">
            <motion.button
              onClick={completeReveal}
              className="px-6 py-2.5 min-h-[44px] text-xs tracking-[0.2em] uppercase font-medium transition-all duration-300 border opacity-70 hover:opacity-100 active:scale-95 cursor-pointer flex items-center justify-center"
              style={{
                borderColor: 'var(--color-secondary)',
                color: 'var(--color-secondary)',
                fontFamily: 'var(--font-body)',
                borderRadius: 'var(--border-radius)',
                background: 'transparent',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              whileHover={{ opacity: 1 }}
              aria-label={cfg.fallbackButtonText || 'Reveal Date'}
            >
              {cfg.fallbackButtonText || 'Reveal Date'}
            </motion.button>
          </div>
        )}

        {/* Revealed state controls */}
        <AnimatePresence>
          {isRevealed && !showCelebration && (
            <motion.div
              className="mt-6 flex items-center justify-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <button
                type="button"
                onClick={() => setShowCelebration(true)}
                className="text-xs tracking-[0.15em] uppercase font-medium underline underline-offset-4 opacity-75 hover:opacity-100 transition-opacity cursor-pointer"
                style={{ color: 'var(--color-secondary)' }}
              >
                View Celebration ✨
              </button>
              <span className="opacity-30">•</span>
              <button
                type="button"
                onClick={resetCard}
                className="text-xs tracking-[0.15em] uppercase font-medium opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
                style={{ color: 'var(--color-text)' }}
              >
                Scratch Again ↺
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Celebration Modal */}
      <AnimatePresence>
        {showCelebration && (
          <CelebrationModal
            date={formattedDate}
            cfg={cfg}
            onClose={() => setShowCelebration(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
