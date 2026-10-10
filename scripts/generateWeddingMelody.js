import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate 44.1kHz 16-bit stereo PCM WAV file
const sampleRate = 44100;
const duration = 24; // 24 seconds loop
const totalSamples = sampleRate * duration;
const numChannels = 2;
const bytesPerSample = 2;
const blockAlign = numChannels * bytesPerSample;
const byteRate = sampleRate * blockAlign;
const dataSize = totalSamples * blockAlign;

const buffer = Buffer.alloc(44 + dataSize);

// Write WAV Header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size (16 for PCM)
buffer.writeUInt16LE(1, 20); // AudioFormat (1 = PCM)
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34); // BitsPerSample
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

// Raag Yaman / Romantic Indian Wedding Scale frequencies (Key of D)
const D3 = 146.83, A3 = 220.00, D4 = 293.66, E4 = 329.63, Fs4 = 369.99, Gs4 = 415.30, A4 = 440.00, B4 = 493.88, Cs5 = 554.37, D5 = 587.33, E5 = 659.25;

// Melodic phrase timings [note, startTime, duration, velocity]
const melody = [
  // Phrase 1 (0 - 6s): Ni Re Ga... Ma Dha Pa
  [Cs5, 0.5, 1.2, 0.35],
  [E4, 1.8, 1.4, 0.38],
  [Fs4, 3.3, 2.2, 0.45],
  [Gs4, 5.6, 1.2, 0.35],
  [A4, 6.9, 2.0, 0.42],

  // Phrase 2 (9 - 15s): Pa Dha Ni Sa'...
  [A4, 9.2, 1.2, 0.38],
  [B4, 10.5, 1.5, 0.42],
  [Cs5, 12.1, 1.4, 0.46],
  [D5, 13.6, 2.6, 0.50],

  // Phrase 3 (16 - 22s): Sa' Ni Dha Pa... Re Ga Re Sa
  [Cs5, 16.5, 1.2, 0.40],
  [B4, 17.8, 1.4, 0.38],
  [A4, 19.3, 1.5, 0.36],
  [Fs4, 20.9, 1.3, 0.35],
  [E4, 22.3, 1.2, 0.30],
  [D4, 23.6, 1.8, 0.32],
];

// Santoor / Harp pluck arpeggios
const plucks = [];
const chordTones = [D3, A3, D4, Fs4, A4, D5];
for (let t = 0; t < duration; t += 0.75) {
  const tone = chordTones[Math.floor((t * 2) % chordTones.length)];
  plucks.push([tone, t, 1.2, 0.18]);
}

let offset = 44;

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;

  // 1. Tanpura / Warm Drone (Root D + Fifth A + Octave)
  const drone1 = Math.sin(2 * Math.PI * D3 * t) * 0.12;
  const drone2 = Math.sin(2 * Math.PI * A3 * t) * 0.08;
  const drone3 = Math.sin(2 * Math.PI * (D4 * 1.002) * t) * 0.05;
  let left = drone1 + drone2 * 0.7 + drone3 * 0.5;
  let right = drone1 * 0.7 + drone2 + drone3 * 0.6;

  // 2. Bansuri / Flute Melody
  for (const [freq, start, dur, vel] of melody) {
    if (t >= start && t < start + dur) {
      const noteTime = t - start;
      const attack = 0.25;
      const release = 0.4;
      let env = 1;
      if (noteTime < attack) {
        env = noteTime / attack;
      } else if (noteTime > dur - release) {
        env = (dur - noteTime) / release;
      }

      const vibrato = Math.sin(2 * Math.PI * 5.5 * noteTime) * (noteTime > 0.4 ? 4 : 0);
      const f = freq + vibrato;

      const fundamental = Math.sin(2 * Math.PI * f * t);
      const h2 = Math.sin(2 * Math.PI * f * 2 * t) * 0.25;
      const h3 = Math.sin(2 * Math.PI * f * 3 * t) * 0.10;
      const breath = (Math.random() * 2 - 1) * 0.03;

      const fluteSample = (fundamental + h2 + h3 + breath) * env * vel;
      left += fluteSample * 0.65;
      right += fluteSample * 0.75;
    }
  }

  // 3. Santoor / Plucked strings
  for (const [freq, start, dur, vel] of plucks) {
    if (t >= start && t < start + dur) {
      const noteTime = t - start;
      const env = Math.exp(-noteTime * 4);
      const pluckSample = Math.sin(2 * Math.PI * freq * t) * env * vel;
      const pan = (Math.sin(start * 3) + 1) / 2;
      left += pluckSample * (1 - pan * 0.4);
      right += pluckSample * (0.6 + pan * 0.4);
    }
  }

  let masterEnv = 1;
  if (t < 1.0) masterEnv = t / 1.0;
  if (t > duration - 1.0) masterEnv = (duration - t) / 1.0;

  left = Math.max(-1, Math.min(1, left * masterEnv * 0.85));
  right = Math.max(-1, Math.min(1, right * masterEnv * 0.85));

  const intL = Math.floor(left * 32767);
  const intR = Math.floor(right * 32767);

  buffer.writeInt16LE(intL, offset);
  buffer.writeInt16LE(intR, offset + 2);
  offset += 4;
}

const outputPath = path.join(__dirname, '..', 'public', 'wedding-melody.wav');
fs.writeFileSync(outputPath, buffer);
console.log('Wedding melody created successfully at:', outputPath);
