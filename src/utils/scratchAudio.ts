// ============================================================
// Web Audio API Scratch Sound Synthesizer Utility
// Generates a soft, realistic paper/gold foil scratch texture
// Completely native: zero network requests, zero external audio dependencies
// ============================================================

class ScratchAudioSynthesizer {
  private ctx: AudioContext | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private isPlaying = false;
  private previewTimer: any = null;

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

  public start(volumePercent: number = 35, style: string = 'foil-scratch') {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.isPlaying) return;

      const bufferSize = this.ctx.sampleRate;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastVal = 0.0;

      const isPaper = style === 'soft-paper';
      const step = isPaper ? 0.012 : 0.02;
      const mult = isPaper ? 2.8 : 3.8;
      const freq = isPaper ? 1400 : 1900;

      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (lastVal + step * white) / 1.02;
        lastVal = data[i];
        data[i] *= mult;
      }

      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = freq;
      filter.Q.value = 1.3;

      this.gainNode = this.ctx.createGain();
      const targetGain = Math.max(0.001, Math.min(0.2, (volumePercent / 100) * 0.12));

      this.gainNode.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      this.gainNode.gain.exponentialRampToValueAtTime(targetGain, this.ctx.currentTime + 0.04);

      this.noiseNode.connect(filter);
      filter.connect(this.gainNode);
      this.gainNode.connect(this.ctx.destination);

      this.noiseNode.start(0);
      this.isPlaying = true;
    } catch {
      // Graceful fallback if unsupported
    }
  }

  public stop() {
    if (!this.isPlaying || !this.ctx || !this.gainNode) return;
    try {
      const stopTime = this.ctx.currentTime + 0.04;
      this.gainNode.gain.exponentialRampToValueAtTime(0.0001, stopTime);
      setTimeout(() => {
        if (this.noiseNode) {
          try {
            this.noiseNode.stop();
            this.noiseNode.disconnect();
          } catch {}
          this.noiseNode = null;
        }
        this.isPlaying = false;
      }, 50);
    } catch {
      this.isPlaying = false;
    }
  }

  public preview(volumePercent: number = 35, style: string = 'foil-scratch', durationMs: number = 800, onEnd?: () => void) {
    if (this.previewTimer) clearTimeout(this.previewTimer);
    this.start(volumePercent, style);
    this.previewTimer = setTimeout(() => {
      this.stop();
      if (onEnd) onEnd();
    }, durationMs);
  }

  public destroy() {
    if (this.previewTimer) clearTimeout(this.previewTimer);
    this.stop();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch {}
      this.ctx = null;
    }
  }
}

export const scratchAudio = new ScratchAudioSynthesizer();
