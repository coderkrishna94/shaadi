import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';

export const MusicPlayer: React.FC = () => {
  const { config } = useWedding();
  const music = config.music || {
    enabled: true,
    src: '/wedding-melody.wav',
    title: 'Royal Indian Wedding Melody',
    autoplay: true,
  };

  const audioSrc = music.src || '/wedding-melody.wav';
  const [isPlaying, setIsPlaying] = useState(false);
  const [needsGesture, setNeedsGesture] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const userMutedRef = useRef(false);
  const isPlayingRef = useRef(false);
  const isPlayPendingRef = useRef(false);
  const isIntroActiveRef = useRef(typeof window !== 'undefined' ? !sessionStorage.getItem('introPlayed') : false);
  const hasPrimedRef = useRef(false);
  const prevSrcRef = useRef(audioSrc);
  const fadeAnimRef = useRef<number | null>(null);

  const currentVolume = (music.volume !== undefined ? music.volume : 75) / 100;

  // Live volume synchronization from editor
  useEffect(() => {
    if (audioRef.current && isPlayingRef.current) {
      audioRef.current.volume = currentVolume;
    }
  }, [currentVolume]);

  // AudioContext unlocker for iOS/Safari/Android webkit engines
  const unlockAudioContext = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
      }
    } catch {
      // Ignore context errors
    }
  }, []);

  // Smooth fade-in volume ramp utility
  const startVolumeFadeIn = useCallback((targetVol: number, durationMs: number = 800) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeAnimRef.current) {
      cancelAnimationFrame(fadeAnimRef.current);
      fadeAnimRef.current = null;
    }

    const startTime = performance.now();
    const safeTarget = Math.max(0.01, Math.min(1.0, targetVol));
    audio.muted = false;

    const ramp = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / durationMs);
      if (audio && isPlayingRef.current) {
        audio.volume = Math.max(0.001, progress * safeTarget);
        if (progress < 1) {
          fadeAnimRef.current = requestAnimationFrame(ramp);
        } else {
          fadeAnimRef.current = null;
          audio.volume = safeTarget;
        }
      }
    };
    fadeAnimRef.current = requestAnimationFrame(ramp);
  }, []);

  // Silently prime audio permissions during early user interaction (e.g. tap during intro)
  const primeAudio = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || hasPrimedRef.current || isPlayPendingRef.current) return;
    try {
      unlockAudioContext();
      hasPrimedRef.current = true;
      audio.muted = true;
      isPlayPendingRef.current = true;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            isPlayPendingRef.current = false;
            if (isIntroActiveRef.current) {
              // Keep playing silently at near-zero volume to preserve the browser playback token
              audio.volume = 0.0001;
            } else {
              audio.muted = false;
              audio.volume = currentVolume;
              setIsPlaying(true);
              isPlayingRef.current = true;
              setNeedsGesture(false);
            }
          })
          .catch(() => {
            isPlayPendingRef.current = false;
            audio.muted = false;
          });
      } else {
        isPlayPendingRef.current = false;
      }
    } catch {
      isPlayPendingRef.current = false;
    }
  }, [unlockAudioContext, currentVolume]);

  // Listen for early gestures dispatched from the opening animation
  useEffect(() => {
    const handleEarlyGesture = () => {
      primeAudio();
    };
    window.addEventListener('wedding:user-gesture', handleEarlyGesture);
    return () => window.removeEventListener('wedding:user-gesture', handleEarlyGesture);
  }, [primeAudio]);

  // Attempt audio playback with smooth volume ramp and pending promise guard
  const attemptPlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || userMutedRef.current || !music.enabled || isIntroActiveRef.current) return;
    if (isPlayPendingRef.current) return;

    unlockAudioContext();

    // If audio is already playing (e.g. was primed silently during intro), smoothly unmute & ramp up
    if (!audio.paused) {
      setIsPlaying(true);
      isPlayingRef.current = true;
      setNeedsGesture(false);
      startVolumeFadeIn(currentVolume, 800);
      return;
    }

    audio.muted = false;
    audio.volume = 0.001;
    isPlayPendingRef.current = true;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          isPlayPendingRef.current = false;
          setIsPlaying(true);
          isPlayingRef.current = true;
          setNeedsGesture(false);
          startVolumeFadeIn(currentVolume, 800);
        })
        .catch((err) => {
          isPlayPendingRef.current = false;
          // Autoplay policy prevented immediate unprompted sound;
          // Remains queued for visitor gesture, and shows interactive prompt
          isPlayingRef.current = false;
          setIsPlaying(false);
          setNeedsGesture(true);
          console.debug('[MusicPlayer] Autoplay awaiting interaction:', err?.message || err);
        });
    } else {
      isPlayPendingRef.current = false;
    }
  }, [music.enabled, currentVolume, unlockAudioContext, startVolumeFadeIn]);

  // Listen for intro lifecycle events:
  // Hymns play exclusively during intro/Ganesh invocation.
  // The moment hymns end ('wedding:play-music'), website sounds start immediately!
  useEffect(() => {
    const handleIntroStart = () => {
      isIntroActiveRef.current = true;
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
        isPlayingRef.current = false;
      }
    };

    const handleIntroEnd = () => {
      isIntroActiveRef.current = false;
      if (!userMutedRef.current && music.enabled) {
        attemptPlay();
      }
    };

    window.addEventListener('wedding:intro-start', handleIntroStart);
    window.addEventListener('wedding:invocation-start', handleIntroStart);
    window.addEventListener('wedding:play-music', handleIntroEnd);

    return () => {
      window.removeEventListener('wedding:intro-start', handleIntroStart);
      window.removeEventListener('wedding:invocation-start', handleIntroStart);
      window.removeEventListener('wedding:play-music', handleIntroEnd);
    };
  }, [music.enabled, attemptPlay]);

  // Persistent autoplay system:
  // Listens for genuine visitor gestures after the intro sequence finishes
  useEffect(() => {
    if (!music.enabled || music.autoplay === false) return;

    // Check if intro has already concluded
    const isAlreadyPlayed = typeof window !== 'undefined' && sessionStorage.getItem('introPlayed') === 'true';
    if (isAlreadyPlayed) {
      isIntroActiveRef.current = false;
      attemptPlay();
    } else if (!isIntroActiveRef.current) {
      attemptPlay();
    }

    // Gesture listeners that trigger audio authorization & playback
    const handleVisitorGesture = () => {
      if (isIntroActiveRef.current) {
        primeAudio();
        return;
      }
      if (!userMutedRef.current && !isPlayingRef.current && !isPlayPendingRef.current) {
        attemptPlay();
      }
    };

    // Authentic user activation events (no scroll/wheel spam)
    const gestureEvents = ['pointerdown', 'touchstart', 'click', 'keydown'];

    gestureEvents.forEach((evt) => {
      window.addEventListener(evt, handleVisitorGesture, { passive: true });
    });

    return () => {
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, handleVisitorGesture);
      });
    };
  }, [audioSrc, music.enabled, music.autoplay, attemptPlay, primeAudio]);

  // Handle source changes from editor
  useEffect(() => {
    if (prevSrcRef.current !== audioSrc) {
      prevSrcRef.current = audioSrc;
      const audio = audioRef.current;
      if (!audio) return;
      audio.load();
      if (music.enabled && !userMutedRef.current && music.autoplay !== false && !isIntroActiveRef.current) {
        attemptPlay();
      }
    }
  }, [audioSrc, music.enabled, music.autoplay, attemptPlay]);

  // Duck background music volume during scratching interaction
  useEffect(() => {
    const handleScratchStart = () => {
      if (fadeAnimRef.current) {
        cancelAnimationFrame(fadeAnimRef.current);
        fadeAnimRef.current = null;
      }
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        audio.volume = Math.max(0.05, currentVolume * 0.3);
      }
    };

    const handleScratchEnd = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused && isPlayingRef.current) {
        audio.volume = currentVolume;
      }
    };

    window.addEventListener('wedding:scratch-start', handleScratchStart);
    window.addEventListener('wedding:scratch-end', handleScratchEnd);

    return () => {
      window.removeEventListener('wedding:scratch-start', handleScratchStart);
      window.removeEventListener('wedding:scratch-end', handleScratchEnd);
    };
  }, [currentVolume]);

  // Pause background music during celebration modal playback, resume after
  const wasPlayingBeforeCelebrationRef = useRef(false);

  useEffect(() => {
    const handleCelebrationStart = () => {
      const audio = audioRef.current;
      if (audio && !audio.paused) {
        wasPlayingBeforeCelebrationRef.current = true;
        audio.pause();
        setIsPlaying(false);
        isPlayingRef.current = false;
      } else {
        wasPlayingBeforeCelebrationRef.current = false;
      }
    };

    const handleCelebrationEnd = () => {
      const audio = audioRef.current;
      if (audio && wasPlayingBeforeCelebrationRef.current && !userMutedRef.current && music.enabled) {
        audio.volume = currentVolume;
        isPlayPendingRef.current = true;
        audio.play()
          .then(() => {
            isPlayPendingRef.current = false;
            setIsPlaying(true);
            isPlayingRef.current = true;
          })
          .catch(() => {
            isPlayPendingRef.current = false;
          });
      }
      wasPlayingBeforeCelebrationRef.current = false;
    };

    window.addEventListener('wedding:celebration-start', handleCelebrationStart);
    window.addEventListener('wedding:celebration-end', handleCelebrationEnd);

    return () => {
      window.removeEventListener('wedding:celebration-start', handleCelebrationStart);
      window.removeEventListener('wedding:celebration-end', handleCelebrationEnd);
    };
  }, [music.enabled, currentVolume]);

  if (!music.enabled) return null;

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // User requested mute
      userMutedRef.current = true;
      audio.pause();
      setIsPlaying(false);
      isPlayingRef.current = false;
      setNeedsGesture(false);
    } else {
      // User requested unmute / play
      userMutedRef.current = false;
      isIntroActiveRef.current = false;
      setNeedsGesture(false);
      unlockAudioContext();
      audio.muted = false;
      audio.volume = currentVolume;
      isPlayPendingRef.current = true;
      audio.play()
        .then(() => {
          isPlayPendingRef.current = false;
          setIsPlaying(true);
          isPlayingRef.current = true;
        })
        .catch(() => {
          isPlayPendingRef.current = false;
        });
    }
  };

  return (
    <div 
      className="fixed z-50 select-none flex items-center gap-2"
      style={{
        bottom: 'max(1rem, env(safe-area-inset-bottom, 1rem))',
        right: 'max(1rem, env(safe-area-inset-right, 1rem))',
      }}
    >
      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={audioSrc}
        loop
        playsInline
        preload="auto"
        onError={(e) => {
          console.warn('[MusicPlayer] Audio stream notification:', e);
          isPlayingRef.current = false;
          setIsPlaying(false);
          isPlayPendingRef.current = false;
        }}
        onPlay={() => {
          setIsPlaying(true);
          isPlayingRef.current = true;
          setNeedsGesture(false);
        }}
        onPause={() => {
          setIsPlaying(false);
          isPlayingRef.current = false;
        }}
        onEnded={() => {
          setIsPlaying(false);
          isPlayingRef.current = false;
        }}
      />

      {/* Floating prompt pill if browser autoplay policy waits for initial tap */}
      <AnimatePresence>
        {needsGesture && !isPlaying && !userMutedRef.current && (
          <motion.button
            type="button"
            initial={{ opacity: 0, x: 12, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 12, scale: 0.92 }}
            onClick={toggleMute}
            className="cursor-pointer bg-[var(--color-primary)] text-[var(--color-secondary)] border border-[var(--color-secondary)]/50 px-3.5 py-1.5 rounded-full shadow-lg text-[11px] font-body tracking-wider uppercase flex items-center gap-2 backdrop-blur-md hover:brightness-110 active:scale-95 transition-all"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)] animate-ping" />
            <span>Play Music 🎵</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Touch-friendly mute/unmute button */}
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={toggleMute}
        aria-label={isPlaying ? 'Mute wedding music' : 'Unmute wedding music'}
        title={isPlaying ? 'Mute music' : 'Unmute music'}
        className={`w-10 h-10 min-w-[44px] min-h-[44px] rounded-full shadow-md flex items-center justify-center border border-[var(--color-secondary)]/40 focus:outline-none transition-all duration-200 cursor-pointer ${
          needsGesture ? 'opacity-100 ring-2 ring-[var(--color-secondary)]/60 animate-pulse' : 'opacity-60 hover:opacity-100 active:opacity-100'
        }`}
        style={{
          backgroundColor: 'var(--color-primary)',
          color: 'var(--color-secondary)',
        }}
      >
        {isPlaying ? (
          /* Sound playing / Mute icon */
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
          </svg>
        ) : (
          /* Muted / Unmute icon */
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4zM16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71z" />
          </svg>
        )}
      </motion.button>
    </div>
  );
};

export default MusicPlayer;
