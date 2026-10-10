// ============================================================
// Web Audio API Devotional Audio Synthesizer
// Generates a pristine Indian temple bell chime
// and warm meditative ambient drone with frame-accurate timing.
// Completely native: zero network lag, zero external dependencies.
// ============================================================

class DevotionalAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private droneGain: GainNode | null = null;
  private droneOscillators: OscillatorNode[] = [];
  private audioElement: HTMLAudioElement | null = null;
  private previewAudio: HTMLAudioElement | null = null;
  private previewTimer: any = null;
  private isPlaying = false;
  private isMuted = false;
  private hasEnded = false;
  private fadeAnimId: number | null = null;

  public resetHymnState() {
    this.hasEnded = false;
  }

  private init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Starts the peaceful meditative background drone with smooth fade-in.
   */
  public startDrone(volumePercent: number = 22, fadeMs: number = 600) {
    if (this.isMuted) return;

    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const targetGain = Math.min(0.25, Math.max(0.01, (volumePercent / 100) * 0.2));
      const fadeInSec = fadeMs / 1000;

      // Master output gain
      if (!this.masterGain) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1.0, now);
        this.masterGain.connect(this.ctx.destination);
      }

      // Dedicated drone gain
      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.0001, now);
      this.droneGain.gain.linearRampToValueAtTime(targetGain, now + fadeInSec);
      this.droneGain.connect(this.masterGain);

      // Clean up any previous drone oscillators
      this.stopDrone(0);

      // 3 sacred harmonic drone frequencies (108Hz, 216Hz, 324Hz)
      const droneHarmonics = [
        { freq: 108, type: 'sine' as OscillatorType, gain: 0.35, detune: -1.5 },
        { freq: 216, type: 'triangle' as OscillatorType, gain: 0.22, detune: 1.2 },
        { freq: 324, type: 'sine' as OscillatorType, gain: 0.12, detune: 0.8 },
      ];

      this.droneOscillators = droneHarmonics.map((h) => {
        const osc = this.ctx!.createOscillator();
        const subGain = this.ctx!.createGain();

        osc.type = h.type;
        osc.frequency.setValueAtTime(h.freq, now);
        osc.detune.setValueAtTime(h.detune, now);

        subGain.gain.setValueAtTime(h.gain, now);

        osc.connect(subGain);
        subGain.connect(this.droneGain!);

        osc.start(now);
        return osc;
      });

      this.isPlaying = true;
    } catch {
      // Graceful fallback
    }
  }

  /**
   * Strikes the authentic Indian temple bell at the exact apex moment
   * when the sacred mantra reveals.
   */
  public chimeBell(volumePercent: number = 32) {
    if (this.isMuted || this.hasEnded) return;

    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const bellGainMaster = this.ctx.createGain();
      const masterVol = Math.min(0.35, Math.max(0.02, (volumePercent / 100) * 0.3));

      bellGainMaster.gain.setValueAtTime(masterVol, now);
      if (!this.masterGain) {
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(1.0, now);
        this.masterGain.connect(this.ctx.destination);
      }
      bellGainMaster.connect(this.masterGain);

      // Sacred Temple Bell partial harmonics (tuned around 528 Hz with natural bronze ring)
      const bellPartials = [
        { freq: 528, gain: 0.5, decay: 4.2 },   // Fundamental Sacred 528Hz
        { freq: 838, gain: 0.3, decay: 3.4 },   // Shimmering minor 3rd partial
        { freq: 1056, gain: 0.22, decay: 2.8 }, // 1st Octave harmonic
        { freq: 1584, gain: 0.15, decay: 2.2 }, // 5th Overtone
        { freq: 2112, gain: 0.09, decay: 1.6 }, // 2nd Octave
        { freq: 2640, gain: 0.05, decay: 1.2 }, // High metallic sparkle
      ];

      bellPartials.forEach((p) => {
        const osc = this.ctx!.createOscillator();
        const partialGain = this.ctx!.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(p.freq, now);

        // Immediate bell strike (8ms attack to avoid click) followed by natural bronze decay
        partialGain.gain.setValueAtTime(0.0001, now);
        partialGain.gain.linearRampToValueAtTime(p.gain, now + 0.008);
        partialGain.gain.exponentialRampToValueAtTime(0.0001, now + p.decay);

        osc.connect(partialGain);
        partialGain.connect(bellGainMaster);

        osc.start(now);
        osc.stop(now + p.decay + 0.1);

        setTimeout(() => {
          try {
            osc.disconnect();
            partialGain.disconnect();
          } catch {}
        }, (p.decay + 0.2) * 1000);
      });
    } catch {
      // Graceful fallback
    }
  }

  private stopDrone(fadeMs: number = 400) {
    if (this.droneGain && this.ctx) {
      const now = this.ctx.currentTime;
      const fadeSec = fadeMs / 1000;
      try {
        this.droneGain.gain.linearRampToValueAtTime(0.0001, now + fadeSec);
        setTimeout(() => {
          this.droneOscillators.forEach((osc) => {
            try {
              osc.stop();
              osc.disconnect();
            } catch {}
          });
          this.droneOscillators = [];
          if (this.droneGain) {
            try {
              this.droneGain.disconnect();
            } catch {}
            this.droneGain = null;
          }
        }, fadeMs + 50);
      } catch {}
    }
  }

  /**
   * Smoothly fades out all devotional audio over fadeMs (default 1000ms).
   */
  public fadeOut(fadeMs: number = 1000) {
    if (!this.isPlaying || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const fadeSec = fadeMs / 1000;

      if (this.masterGain) {
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + fadeSec);
      }

      setTimeout(() => {
        this.stopImmediate();
      }, fadeMs + 60);
    } catch {
      this.stopImmediate();
    }
  }

  /**
   * Immediately stops all oscillators and disconnects audio.
   */
  public stopImmediate() {
    this.stopDrone(50);
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {}
      this.masterGain = null;
    }
    this.isPlaying = false;
  }

  /**
   * Unlocks and resumes the audio context upon any user interaction.
   */
  public unlockAudioContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  /**
   * Timeline Master Method: Starts the peaceful meditative drone and/or hymn audio with an exact linear fade-in.
   * T+0ms to T+500ms: Audio volume 0 -> target volume.
   */
  public timelineStartFadeIn(volumePercent: number = 80, durationMs: number = 500, src?: string) {
    if (this.isMuted || this.hasEnded) return;

    // 1. If an audio file track is supplied, play it with smooth volume ramp
    if (src && src.trim() !== '' && src !== 'synthetic-bell') {
      try {
        if (!this.audioElement) {
          this.audioElement = new Audio();
        }
        this.audioElement.src = src;
        this.audioElement.volume = 0.001;
        const playPromise = this.audioElement.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              if (this.fadeAnimId) cancelAnimationFrame(this.fadeAnimId);
              const targetVol = Math.min(1.0, Math.max(0.01, volumePercent / 100));
              const startTime = performance.now();
              const ramp = (now: number) => {
                const elapsed = now - startTime;
                const progress = Math.min(1, elapsed / durationMs);
                if (this.audioElement && this.isPlaying) {
                  this.audioElement.volume = Math.max(0.001, progress * targetVol);
                  if (progress < 1) {
                    this.fadeAnimId = requestAnimationFrame(ramp);
                  } else {
                    this.fadeAnimId = null;
                  }
                }
              };
              this.fadeAnimId = requestAnimationFrame(ramp);
            })
            .catch(() => {});
        }
      } catch {}
    }

    // 2. Also start native sacred drone harmonics
    try {
      this.init();
      if (this.ctx) {
        const now = this.ctx.currentTime;
        const targetGain = Math.min(0.28, Math.max(0.01, (volumePercent / 100) * 0.25));
        const fadeInSec = durationMs / 1000;

        // Master output gain
        if (!this.masterGain) {
          this.masterGain = this.ctx.createGain();
          this.masterGain.connect(this.ctx.destination);
        }
        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(0.0001, now);
        this.masterGain.gain.linearRampToValueAtTime(1.0, now + 0.05);

        // Dedicated drone gain
        if (this.droneGain) {
          try {
            this.droneGain.disconnect();
          } catch {}
        }
        this.droneGain = this.ctx.createGain();
        this.droneGain.gain.cancelScheduledValues(now);
        this.droneGain.gain.setValueAtTime(0.0001, now);
        this.droneGain.gain.linearRampToValueAtTime(targetGain, now + fadeInSec);
        this.droneGain.connect(this.masterGain);

        // Stop any prior drone oscillators
        this.stopDrone(0);

        // 3 sacred harmonic drone frequencies (108Hz, 216Hz, 324Hz)
        const droneHarmonics = [
          { freq: 108, type: 'sine' as OscillatorType, gain: 0.35, detune: -1.5 },
          { freq: 216, type: 'triangle' as OscillatorType, gain: 0.22, detune: 1.2 },
          { freq: 324, type: 'sine' as OscillatorType, gain: 0.12, detune: 0.8 },
        ];

        this.droneOscillators = droneHarmonics.map((h) => {
          const osc = this.ctx!.createOscillator();
          const subGain = this.ctx!.createGain();

          osc.type = h.type;
          osc.frequency.setValueAtTime(h.freq, now);
          osc.detune.setValueAtTime(h.detune, now);

          subGain.gain.setValueAtTime(h.gain, now);

          osc.connect(subGain);
          subGain.connect(this.droneGain!);

          osc.start(now);
          return osc;
        });
      }
    } catch {
      // Graceful fallback
    }

    this.isPlaying = true;
  }

  /**
   * Timeline Master Method: Chimes the authentic bronze temple bell at the visual apex.
   */
  public timelineChimeBell(volumePercent: number = 32) {
    if (this.hasEnded) return;
    this.chimeBell(volumePercent);
  }

  /**
   * Timeline Master Method: Smoothly fades out all Ganesh audio to complete silence.
   * T+3500ms to T+4500ms: Audio volume target -> 0.
   */
  public timelineFadeOut(durationMs: number = 1000) {
    if (!this.isPlaying) return;

    if (this.fadeAnimId) cancelAnimationFrame(this.fadeAnimId);

    // Fade out audio element smoothly
    if (this.audioElement) {
      const initialVol = this.audioElement.volume;
      const startTime = performance.now();
      const ramp = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(1, elapsed / durationMs);
        if (this.audioElement) {
          this.audioElement.volume = Math.max(0, initialVol * (1 - progress));
          if (progress < 1) {
            this.fadeAnimId = requestAnimationFrame(ramp);
          } else {
            this.fadeAnimId = null;
          }
        }
      };
      this.fadeAnimId = requestAnimationFrame(ramp);
    }

    if (this.ctx && this.masterGain) {
      try {
        const now = this.ctx.currentTime;
        const fadeSec = durationMs / 1000;

        this.masterGain.gain.cancelScheduledValues(now);
        this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
        this.masterGain.gain.linearRampToValueAtTime(0.0001, now + fadeSec);
      } catch {}
    }

    setTimeout(() => {
      this.timelineStopImmediate();
    }, durationMs + 20);
  }

  /**
   * Timeline Master Method: Guaranteed immediate stop of all oscillators and audio output.
   * At T+4500ms, ensures 100% complete silence before the resultant scene starts.
   */
  public timelineStopImmediate() {
    this.hasEnded = true;
    if (this.fadeAnimId) {
      cancelAnimationFrame(this.fadeAnimId);
      this.fadeAnimId = null;
    }
    if (this.audioElement) {
      try {
        this.audioElement.pause();
        this.audioElement.currentTime = 0;
      } catch {}
    }
    this.stopDrone(50);
    if (this.masterGain) {
      try {
        this.masterGain.disconnect();
      } catch {}
      this.masterGain = null;
    }
    this.isPlaying = false;
  }

  /**
   * Preview method for the Editor page:
   * Allows previewing the selected Ganesh hymn or synthesized bell chime.
   */
  public preview(src: string | undefined, volumePercent: number = 80, onEnded?: () => void) {
    this.stopPreview();
    this.hasEnded = false; // Reset for editor preview testing

    if (src && src.trim() !== '' && src !== 'synthetic-bell') {
      try {
        this.previewAudio = new Audio(src);
        this.previewAudio.volume = Math.min(1.0, Math.max(0.01, volumePercent / 100));
        this.previewAudio.onended = () => {
          this.stopPreview();
          if (onEnded) onEnded();
        };
        const p = this.previewAudio.play();
        if (p !== undefined) {
          p.catch(() => {
            if (onEnded) onEnded();
          });
        }
      } catch {
        if (onEnded) onEnded();
      }
    } else {
      // Preview native temple bell and meditative drone
      this.timelineStartFadeIn(volumePercent, 400);
      setTimeout(() => {
        this.timelineChimeBell(Math.min(100, volumePercent * 1.1));
      }, 500);

      this.previewTimer = setTimeout(() => {
        this.timelineFadeOut(800);
        setTimeout(() => {
          this.timelineStopImmediate();
          if (onEnded) onEnded();
        }, 850);
      }, 3500);
    }
  }

  /**
   * Stops any ongoing editor preview.
   */
  public stopPreview(onEnded?: () => void) {
    if (this.previewTimer) {
      clearTimeout(this.previewTimer);
      this.previewTimer = null;
    }
    if (this.previewAudio) {
      try {
        this.previewAudio.pause();
        this.previewAudio.currentTime = 0;
      } catch {}
      this.previewAudio = null;
    }
    this.timelineStopImmediate();
    if (onEnded) onEnded();
  }

  public start(options?: { volume?: number; fadeMs?: number }) {
    this.timelineStartFadeIn(options?.volume ?? 22, options?.fadeMs ?? 600);
    this.timelineChimeBell(options?.volume ? options.volume * 1.3 : 30);
  }

  public stop(fadeMs: number = 600) {
    if (fadeMs <= 50) {
      this.timelineStopImmediate();
    } else {
      this.timelineFadeOut(fadeMs);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.timelineStopImmediate();
    }
  }

  public getIsPlaying(): boolean {
    return this.isPlaying;
  }
}

export const devotionalAudio = new DevotionalAudioSynthesizer();
export default devotionalAudio;
