import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Generate 44.1kHz 16-bit stereo PCM WAV file for Indian Temple Bell & Meditative Drone
const sampleRate = 44100;
const duration = 4.8; // 4.8 seconds
const totalSamples = Math.floor(sampleRate * duration);
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
buffer.writeUInt32LE(16, 16); // Subchunk1Size
buffer.writeUInt16LE(1, 20); // PCM
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(byteRate, 28);
buffer.writeUInt16LE(blockAlign, 32);
buffer.writeUInt16LE(16, 34); // BitsPerSample
buffer.write('data', 36);
buffer.writeUInt32LE(dataSize, 40);

// Sacred 528Hz Bronze Temple Bell partials
const bellPartials = [
  { freq: 528, gain: 0.70, decay: 4.2 },
  { freq: 838, gain: 0.45, decay: 3.5 },
  { freq: 1056, gain: 0.35, decay: 2.8 },
  { freq: 1584, gain: 0.25, decay: 2.2 },
  { freq: 2112, gain: 0.16, decay: 1.6 },
  { freq: 2640, gain: 0.10, decay: 1.2 },
];

// Meditative drone harmonics (Key of A / Sacred Om drone)
const droneHarmonics = [
  { freq: 216, gain: 0.22, detune: -0.5 },
  { freq: 324, gain: 0.18, detune: 0.4 },
  { freq: 432, gain: 0.14, detune: 0.2 },
  { freq: 540, gain: 0.08, detune: -0.3 },
];

const bellStrikeTime = 0.35; // Strikes at 350ms as mantra resolves

let offset = 44;

for (let i = 0; i < totalSamples; i++) {
  const t = i / sampleRate;

  // 1. Warm Meditative Drone
  let drone = 0;
  for (const d of droneHarmonics) {
    const f = d.freq + d.detune;
    drone += Math.sin(2 * Math.PI * f * t) * d.gain;
  }
  // Drone fade-in over 0.5s
  let droneEnv = 1;
  if (t < 0.5) droneEnv = t / 0.5;

  let left = drone * droneEnv * 0.7;
  let right = drone * droneEnv * 0.7;

  // 2. Sacred Bronze Temple Bell Strike
  if (t >= bellStrikeTime) {
    const dt = t - bellStrikeTime;
    let bellSample = 0;

    for (const p of bellPartials) {
      // 6ms strike attack, then natural exponential bronze decay
      let env = 0;
      if (dt < 0.008) {
        env = dt / 0.008;
      } else {
        env = Math.exp(-dt * (3.8 / p.decay));
      }
      // Subtle beating / shimmer between dual stereo partials
      const shimmer = Math.sin(2 * Math.PI * (p.freq * 1.001) * dt) * 0.15;
      bellSample += (Math.sin(2 * Math.PI * p.freq * dt) + shimmer) * env * p.gain;
    }

    left += bellSample * 0.85;
    right += bellSample * 0.80;
  }

  // Master fade-out from 3.7s to 4.7s
  let masterEnv = 1;
  if (t > 3.7) {
    masterEnv = Math.max(0, 1 - (t - 3.7) / 1.0);
  }

  left = Math.max(-1, Math.min(1, left * masterEnv * 0.9));
  right = Math.max(-1, Math.min(1, right * masterEnv * 0.9));

  const intL = Math.floor(left * 32767);
  const intR = Math.floor(right * 32767);

  buffer.writeInt16LE(intL, offset);
  buffer.writeInt16LE(intR, offset + 2);
  offset += 4;
}

const outputPath = path.join(__dirname, '..', 'public', 'temple-bell.wav');
fs.writeFileSync(outputPath, buffer);
console.log('Sacred temple bell audio created successfully at:', outputPath);
