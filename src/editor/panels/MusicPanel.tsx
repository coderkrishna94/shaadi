import React, { useState, useRef, useEffect } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { defaultConfig, type ScratchCardConfig } from '@/data/weddingConfig';
import FileUploadZone from '../components/FileUploadZone';
import { scratchAudio } from '@/utils/scratchAudio';
import { devotionalAudio } from '@/utils/devotionalAudio';

// Real audio assets that exist locally in the project
export interface ProjectTrack {
  id: string;
  name: string;
  subtitle: string;
  src: string;
  badge: string;
  description: string;
}

export interface DevotionalTrack {
  id: string;
  name: string;
  subtitle: string;
  src: string;
  badge: string;
  description: string;
}

const DEVOTIONAL_TRACKS: DevotionalTrack[] = [
  {
    id: 'sacred-bell-drone',
    name: 'Temple Bell & Sacred Drone (528Hz)',
    subtitle: 'Vedic Solfeggio & Bronze Bell',
    src: '',
    badge: 'Sacred Synthesizer',
    description: 'Authentic Indian temple bell strike (528Hz) with warm meditative 108Hz Vedic harmonic resonance. Instant zero-lag loading.',
  },
  {
    id: 'shubhaarambh-hymn',
    name: 'Shubhaarambh Auspicious Chants',
    subtitle: 'Vedic Celebration & Dholak Chants',
    src: '/uploads/Y2Mate.is_-_Shubhaarambh_Full_Video_-_Kai_Po_Che___Sushant_Singh_Rajput___Rajkummar_Rao___Amit_Sadh___Amit_T.mp3',
    badge: 'Auspicious Hymn',
    description: 'Traditional auspicious wedding invocation chanting new beginnings and sacred Ganapati blessings.',
  },
  {
    id: 'shehnai-dhwani',
    name: 'Royal Shehnai Mangal Dhwani',
    subtitle: 'Auspicious Temple Shehnai',
    src: '/wedding-melody.wav',
    badge: 'Instrumental',
    description: 'Ceremonial Shehnai & temple bells welcoming guests with royal Indian wedding aura.',
  },
];

const PROJECT_TRACKS: ProjectTrack[] = [
  {
    id: 'wedding-melody',
    name: 'Royal Indian Wedding Melody',
    subtitle: 'Shehnai & Flute Instrumental',
    src: '/wedding-melody.wav',
    badge: 'Instrumental',
    description: 'Traditional, grand shehnai and flute melody creating an authentic royal ambiance.',
  },
  {
    id: 'shubhaarambh',
    name: 'Shubhaarambh (Kai Po Che)',
    subtitle: 'Auspicious Wedding Anthem',
    src: '/uploads/Y2Mate.is_-_Shubhaarambh_Full_Video_-_Kai_Po_Che___Sushant_Singh_Rajput___Rajkummar_Rao___Amit_Sadh___Amit_T.mp3',
    badge: 'Celebration',
    description: 'Joyful, energetic wedding music celebrating new beginnings and auspicious festivities.',
  },
  {
    id: 'fanniyar',
    name: 'Ishq De Fanniyar',
    subtitle: 'Romantic Acoustic Lofi',
    src: '/uploads/Y2Mate.is_-_Ishq_De_Fanniyar_Slowed_Reverb_Lofi_Song___Rang_De_Ranjheya.mp3',
    badge: 'Romantic',
    description: 'Soft, soulful romantic tune with an intimate, elegant, and heartfelt vibe.',
  },
];

export default function MusicPanel() {
  const { config, updateConfig } = useWedding();

  const music = config.music || defaultConfig.music;
  const sc: ScratchCardConfig = config.scratchCard || defaultConfig.scratchCard!;

  // Preview Audio States (Completely isolated from the public visitor playback)
  const [ganeshPreviewPlaying, setGaneshPreviewPlaying] = useState(false);
  const [showCustomGaneshInput, setShowCustomGaneshInput] = useState(false);
  const [bgPreviewPlaying, setBgPreviewPlaying] = useState(false);
  const [celebrationPreviewPlaying, setCelebrationPreviewPlaying] = useState(false);
  const [scratchPreviewPlaying, setScratchPreviewPlaying] = useState(false);
  const [showCustomBgInput, setShowCustomBgInput] = useState(false);
  const [showCustomCelebrationInput, setShowCustomCelebrationInput] = useState(false);

  const bgAudioRef = useRef<HTMLAudioElement | null>(null);
  const celebrationAudioRef = useRef<HTMLAudioElement | null>(null);

  // Stop all previews when unmounting or changing tracks
  useEffect(() => {
    return () => {
      devotionalAudio.stopPreview();
      if (bgAudioRef.current) bgAudioRef.current.pause();
      if (celebrationAudioRef.current) celebrationAudioRef.current.pause();
      scratchAudio.stop();
    };
  }, []);

  const stopAllPreviews = () => {
    devotionalAudio.stopPreview();
    setGaneshPreviewPlaying(false);
    if (bgAudioRef.current) {
      bgAudioRef.current.pause();
      setBgPreviewPlaying(false);
    }
    if (celebrationAudioRef.current) {
      celebrationAudioRef.current.pause();
      setCelebrationPreviewPlaying(false);
    }
    scratchAudio.stop();
    setScratchPreviewPlaying(false);
  };

  // --- Ganesh Welcome Hymn Handlers ---
  const handleSelectGaneshTrack = (track: DevotionalTrack) => {
    stopAllPreviews();
    updateConfig((prev) => ({
      ...prev,
      music: {
        ...(prev.music || music),
        ganeshAudioSrc: track.src,
        ganeshAudioTitle: track.name,
        ganeshAudioEnabled: true,
      },
    }));
  };

  const handleCustomGaneshUpload = (audioUrl: string, fileName?: string) => {
    stopAllPreviews();
    updateConfig((prev) => ({
      ...prev,
      music: {
        ...(prev.music || music),
        ganeshAudioSrc: audioUrl,
        ganeshAudioTitle: fileName || prev.music?.ganeshAudioTitle || 'Custom Ganesh Hymn',
        ganeshAudioEnabled: true,
      },
    }));
  };

  const toggleGaneshPreview = () => {
    if (ganeshPreviewPlaying) {
      devotionalAudio.stopPreview();
      setGaneshPreviewPlaying(false);
    } else {
      stopAllPreviews();
      setGaneshPreviewPlaying(true);
      devotionalAudio.preview(
        music.ganeshAudioSrc,
        music.ganeshAudioVolume !== undefined ? music.ganeshAudioVolume : 80,
        () => setGaneshPreviewPlaying(false)
      );
    }
  };

  // --- Background Music Handlers ---
  const updateMusic = (field: keyof typeof music, value: any) => {
    updateConfig((prev) => ({
      ...prev,
      music: { ...(prev.music || music), [field]: value },
    }));
  };

  const handleSelectBgTrack = (track: ProjectTrack) => {
    stopAllPreviews();
    updateConfig((prev) => ({
      ...prev,
      music: {
        ...(prev.music || music),
        src: track.src,
        title: track.name,
      },
    }));
  };

  const handleCustomBgUpload = (audioUrl: string, fileName?: string) => {
    stopAllPreviews();
    updateConfig((prev) => ({
      ...prev,
      music: {
        ...(prev.music || music),
        src: audioUrl,
        title: fileName || prev.music?.title || 'Custom Wedding Track',
        enabled: true,
      },
    }));
  };

  const toggleBgPreview = () => {
    if (!bgAudioRef.current) return;

    if (bgPreviewPlaying) {
      bgAudioRef.current.pause();
      setBgPreviewPlaying(false);
    } else {
      stopAllPreviews();
      bgAudioRef.current.volume = (music.volume !== undefined ? music.volume : 75) / 100;
      bgAudioRef.current.play().then(() => setBgPreviewPlaying(true)).catch(() => {});
    }
  };

  // --- Celebration Sound Handlers ---
  const updateScratch = (field: keyof typeof sc, value: any) => {
    updateConfig((prev) => ({
      ...prev,
      scratchCard: { ...(prev.scratchCard || sc), [field]: value },
    }));
  };

  const handleSelectCelebrationTrack = (track: ProjectTrack) => {
    stopAllPreviews();
    updateConfig((prev) => ({
      ...prev,
      scratchCard: {
        ...(prev.scratchCard || sc),
        celebrationMusicSrc: track.src,
        celebrationMusicTitle: track.name,
      },
    }));
  };

  const handleCustomCelebrationUpload = (audioUrl: string, fileName?: string) => {
    stopAllPreviews();
    updateConfig((prev) => ({
      ...prev,
      scratchCard: {
        ...(prev.scratchCard || sc),
        celebrationMusicSrc: audioUrl,
        celebrationMusicTitle: fileName || prev.scratchCard?.celebrationMusicTitle || 'Custom Celebration Audio',
        celebrationMusicEnabled: true,
      },
    }));
  };

  const toggleCelebrationPreview = () => {
    if (!celebrationAudioRef.current) return;

    if (celebrationPreviewPlaying) {
      celebrationAudioRef.current.pause();
      celebrationAudioRef.current.currentTime = 0;
      setCelebrationPreviewPlaying(false);
    } else {
      stopAllPreviews();
      celebrationAudioRef.current.volume = (sc.celebrationMusicVolume !== undefined ? sc.celebrationMusicVolume : 80) / 100;
      celebrationAudioRef.current.currentTime = 0;
      celebrationAudioRef.current.play().then(() => setCelebrationPreviewPlaying(true)).catch(() => {});
    }
  };

  // --- Scratch Sound Preview ---
  const toggleScratchPreview = () => {
    if (scratchPreviewPlaying) {
      scratchAudio.stop();
      setScratchPreviewPlaying(false);
    } else {
      stopAllPreviews();
      setScratchPreviewPlaying(true);
      scratchAudio.preview(
        sc.scratchAudioVolume !== undefined ? sc.scratchAudioVolume : 35,
        sc.scratchAudioSound || 'foil-scratch',
        900,
        () => setScratchPreviewPlaying(false)
      );
    }
  };

  const currentBgSrc = music.src || '/wedding-melody.wav';
  const currentCelebrationSrc = sc.celebrationMusicSrc || '/uploads/Y2Mate.is_-_Shubhaarambh_Full_Video_-_Kai_Po_Che___Sushant_Singh_Rajput___Rajkummar_Rao___Amit_Sadh___Amit_T.mp3';

  return (
    <div className="space-y-8 pb-12">
      {/* Header Overview */}
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
          <span>🎵</span> Music & Audio Configuration
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Manage the complete synchronized wedding soundscape: the sacred Ganesh welcome hymn, ambient background music, and interactive scratch card audio.
        </p>
      </div>

      {/* ============================================================ */}
      {/* SECTION 1: SACRED GANESH WELCOME HYMN (DEVOTIONAL INTERLUDE) */}
      {/* ============================================================ */}
      <div className="bg-white border border-amber-200/80 rounded-xl p-5 shadow-sm space-y-5 ring-1 ring-amber-400/30">
        {/* Section Title & Enable Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🪔</span>
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                <span>1. Sacred Ganesh Welcome Hymn</span>
                <span className="text-[10px] bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full lowercase">
                  interlude
                </span>
              </h4>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Dedicated sacred hymn & mantra played exclusively during the "ॐ नमो गणेशाय नमः" welcome screen (3–5 seconds).
            </p>
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={music.ganeshAudioEnabled !== false}
              onChange={(e) => updateMusic('ganeshAudioEnabled', e.target.checked)}
              className="rounded text-amber-700 focus:ring-amber-600 h-4 w-4 cursor-pointer"
            />
            <span className="text-xs font-semibold text-amber-900">
              {music.ganeshAudioEnabled !== false ? 'Ganesh Hymn is ON' : 'Ganesh Hymn is OFF'}
            </span>
          </label>
        </div>

        {music.ganeshAudioEnabled === false ? (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold">Ganesh Hymn is Disabled:</span> The sacred ॐ नमो गणेशाय नमः invocation screen will display visually in silence, and the background wedding music will start immediately after the transition to the hero section.
          </div>
        ) : (
          <div className="space-y-5">
            {/* Current Active Ganesh Track Card */}
            <div className="p-3.5 bg-amber-50/40 rounded-lg border border-amber-200/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider flex items-center gap-1">
                  <span>🕉️</span> Currently Selected Hymn
                </div>
                <div className="text-sm font-bold text-gray-900 truncate mt-0.5">
                  {music.ganeshAudioTitle || 'Temple Bell & Sacred Drone (528Hz)'}
                </div>
                <div className="text-xs text-gray-500 truncate mt-0.5 font-mono text-[11px]">
                  {music.ganeshAudioSrc ? music.ganeshAudioSrc : 'Native Web Audio API Synthesizer (Zero-Lag)'}
                </div>
              </div>

              {/* Ganesh Hymn Preview Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleGaneshPreview}
                  className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                    ganeshPreviewPlaying
                      ? 'bg-amber-800 text-white hover:bg-amber-900 ring-2 ring-amber-400'
                      : 'bg-white border border-amber-300 text-amber-900 hover:bg-amber-50'
                  }`}
                  aria-label={ganeshPreviewPlaying ? 'Stop hymn preview' : 'Preview Ganesh hymn'}
                >
                  {ganeshPreviewPlaying ? (
                    <>
                      <span className="animate-spin">🔄</span>
                      <span>Stop Preview</span>
                    </>
                  ) : (
                    <>
                      <span>🔔</span>
                      <span>Preview Hymn</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Devotional Track Selection Grid */}
            <div>
              <label className="editor-label">Choose Sacred Blessing Audio</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1.5">
                {DEVOTIONAL_TRACKS.map((track) => {
                  const isSelected = (music.ganeshAudioSrc || '') === track.src;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => handleSelectGaneshTrack(track)}
                      className={`text-left p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-700 bg-amber-50/70 shadow-sm ring-1 ring-amber-700'
                          : 'border-gray-200 bg-white hover:border-amber-300 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                            {track.badge}
                          </span>
                          {isSelected && (
                            <span className="text-amber-800 text-xs font-bold">✓ Selected</span>
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-gray-900 leading-tight">
                          {track.name}
                        </h5>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                          {track.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Ganesh Hymn Upload or Link */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">
                  Custom Hymn Upload / Audio Link
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomGaneshInput((prev) => !prev)}
                  className="text-xs text-amber-800 hover:text-amber-900 font-medium underline cursor-pointer"
                >
                  {showCustomGaneshInput ? 'Hide Upload Area' : 'Upload or Link Custom Hymn MP3'}
                </button>
              </div>

              {showCustomGaneshInput && (
                <div className="space-y-3 bg-gray-50/70 p-3.5 rounded-lg border border-gray-200">
                  <div>
                    <label className="editor-label">Hymn / Mantra Title</label>
                    <input
                      type="text"
                      value={music.ganeshAudioTitle || ''}
                      onChange={(e) => updateMusic('ganeshAudioTitle', e.target.value)}
                      className="editor-input"
                      placeholder="e.g., Vakratunda Mahakaya or Om Gan Ganapataye Namaha"
                    />
                  </div>

                  <FileUploadZone
                    type="audio"
                    value={music.ganeshAudioSrc || ''}
                    onChange={handleCustomGaneshUpload}
                    label="Upload Sacred Hymn Audio (MP3 / WAV)"
                    helperText="Drop an audio file for the sacred Ganesh welcome screen. It will play exclusively during the invocation."
                  />
                </div>
              )}
            </div>

            {/* Ganesh Hymn Volume Slider */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="editor-label mb-0" htmlFor="ganesh-volume-slider">
                  Ganesh Welcome Hymn Volume
                </label>
                <span className="text-xs font-bold text-gray-800 font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {music.ganeshAudioVolume !== undefined ? music.ganeshAudioVolume : 80}%
                </span>
              </div>
              <input
                id="ganesh-volume-slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value={music.ganeshAudioVolume !== undefined ? music.ganeshAudioVolume : 80}
                onChange={(e) => updateMusic('ganeshAudioVolume', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-700"
                aria-label="Ganesh hymn volume"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>0% (Silent)</span>
                <span>50% (Gentle)</span>
                <span>100% (Grand & Majestic)</span>
              </div>
            </div>

            {/* Sequence Explanation Note */}
            <div className="p-3 bg-amber-50/60 border border-amber-200/50 rounded-lg text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
              <span className="text-sm mt-0.5">✨</span>
              <div>
                <strong>Sequential Flow Guarantee:</strong> The Ganesh hymn plays exclusively for ~3–5 seconds during the sacred invocation. Once finished, it dissolves into complete silence. Only then does the ambient background wedding music softly begin, ensuring zero sound collision.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SECTION 2: BACKGROUND MUSIC */}
      {/* ============================================================ */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5">
        {/* Section Title & Enable Toggle */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎼</span>
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                2. Background Music
              </h4>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Ambient music that plays as guests explore the invitation.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={music.enabled}
              onChange={(e) => updateMusic('enabled', e.target.checked)}
              className="rounded text-amber-700 focus:ring-amber-600 h-4 w-4 cursor-pointer"
            />
            <span className="text-xs font-semibold text-gray-700">
              {music.enabled ? 'Music is ON' : 'Music is OFF'}
            </span>
          </label>
        </div>

        {!music.enabled ? (
          <div className="p-4 bg-amber-50/60 border border-amber-200/60 rounded-lg text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold">Background Music is Disabled:</span> No ambient audio will play when guests open the site. The floating player will be hidden, and the rest of the invitation will continue operating normally.
          </div>
        ) : (
          <div className="space-y-5">
            {/* Current Active Track Card */}
            <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Currently Active Track
                </div>
                <div className="text-sm font-bold text-gray-900 truncate mt-0.5">
                  {music.title || 'Royal Indian Wedding Melody'}
                </div>
                <div className="text-xs text-gray-500 truncate mt-0.5 font-mono text-[11px]">
                  {currentBgSrc}
                </div>
              </div>

              {/* Background Music Preview Button */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleBgPreview}
                  className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                    bgPreviewPlaying
                      ? 'bg-amber-700 text-white hover:bg-amber-800'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label={bgPreviewPlaying ? 'Pause background music preview' : 'Preview background music'}
                >
                  {bgPreviewPlaying ? (
                    <>
                      <span className="animate-pulse">⏸</span>
                      <span>Pause Preview</span>
                    </>
                  ) : (
                    <>
                      <span>▶</span>
                      <span>Preview Track</span>
                    </>
                  )}
                </button>
              </div>

              {/* Hidden audio element for isolated editor preview */}
              <audio
                ref={bgAudioRef}
                src={currentBgSrc}
                onEnded={() => setBgPreviewPlaying(false)}
                className="hidden"
              />
            </div>

            {/* Track Selection List */}
            <div>
              <label className="editor-label">Select from Project Audio Library</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1.5">
                {PROJECT_TRACKS.map((track) => {
                  const isSelected = currentBgSrc === track.src;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => handleSelectBgTrack(track)}
                      className={`text-left p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-700 bg-amber-50/50 shadow-sm ring-1 ring-amber-700'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-200/70 text-gray-700">
                            {track.badge}
                          </span>
                          {isSelected && (
                            <span className="text-amber-800 text-xs font-bold">✓ Selected</span>
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-gray-900 leading-tight">
                          {track.name}
                        </h5>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                          {track.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upload or Custom Track Option */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">
                  Custom Audio Upload / Link
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomBgInput((prev) => !prev)}
                  className="text-xs text-amber-800 hover:text-amber-900 font-medium underline cursor-pointer"
                >
                  {showCustomBgInput ? 'Hide Upload Area' : 'Upload or Link Custom MP3'}
                </button>
              </div>

              {showCustomBgInput && (
                <div className="space-y-3 bg-gray-50/70 p-3.5 rounded-lg border border-gray-200">
                  <div>
                    <label className="editor-label">Song / Display Title</label>
                    <input
                      type="text"
                      value={music.title || ''}
                      onChange={(e) => updateMusic('title', e.target.value)}
                      className="editor-input"
                      placeholder="e.g., Din Shagna Da or Romantic Instrumental"
                    />
                  </div>

                  <FileUploadZone
                    type="audio"
                    value={music.src || '/wedding-melody.wav'}
                    onChange={handleCustomBgUpload}
                    label="Upload MP3 / WAV from Computer"
                    helperText="Drop an audio file (.mp3, .wav, .m4a). It will be embedded and linked automatically."
                  />
                </div>
              )}
            </div>

            {/* Background Music Volume Control */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="editor-label mb-0" htmlFor="bg-volume-slider">
                  Background Music Volume
                </label>
                <span className="text-xs font-bold text-gray-800 font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {music.volume !== undefined ? music.volume : 75}%
                </span>
              </div>
              <input
                id="bg-volume-slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value={music.volume !== undefined ? music.volume : 75}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updateMusic('volume', val);
                  if (bgAudioRef.current) {
                    bgAudioRef.current.volume = val / 100;
                  }
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-700"
                aria-label="Background music volume"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>0% (Silent)</span>
                <span>50% (Comfortable)</span>
                <span>100% (Full)</span>
              </div>
            </div>

            {/* Autoplay Setting */}
            <div className="border-t border-gray-100 pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={music.autoplay ?? true}
                  onChange={(e) => updateMusic('autoplay', e.target.checked)}
                  className="rounded text-amber-700 focus:ring-amber-600 h-4 w-4 mt-0.5 cursor-pointer"
                />
                <div>
                  <span className="text-xs font-semibold text-gray-800 block">
                    Start music automatically on visit
                  </span>
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
                    Browser autoplay restrictions are gracefully respected. If browser policies block initial silent autoplay, the music starts automatically upon the visitor’s first tap, click, or scroll.
                  </p>
                </div>
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SECTION 3: SCRATCH CARD CELEBRATION AUDIO */}
      {/* ============================================================ */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">🎉</span>
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                3. Scratch Card Celebration Sound
              </h4>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Celebration audio played when guests scratch and reveal the wedding date.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={sc.celebrationMusicEnabled !== false}
              onChange={(e) => updateScratch('celebrationMusicEnabled', e.target.checked)}
              className="rounded text-amber-700 focus:ring-amber-600 h-4 w-4 cursor-pointer"
            />
            <span className="text-xs font-semibold text-gray-700">
              {sc.celebrationMusicEnabled !== false ? 'Celebration Sound ON' : 'Celebration Sound OFF'}
            </span>
          </label>
        </div>

        {sc.celebrationMusicEnabled === false ? (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold">Celebration Sound is Disabled:</span> When guests reveal the date, the celebration popup will display with visual confetti/petals but without triggering audio.
          </div>
        ) : (
          <div className="space-y-5">
            {/* Active Celebration Track Card */}
            <div className="p-3.5 bg-gray-50 rounded-lg border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  Selected Celebration Sound
                </div>
                <div className="text-sm font-bold text-gray-900 truncate mt-0.5">
                  {sc.celebrationMusicTitle || 'Shubhaarambh — Kai Po Che'}
                </div>
                <div className="text-xs text-gray-500 truncate mt-0.5 font-mono text-[11px]">
                  {currentCelebrationSrc}
                </div>
              </div>

              {/* One-shot Celebration Sound Preview */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={toggleCelebrationPreview}
                  className={`min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                    celebrationPreviewPlaying
                      ? 'bg-amber-700 text-white hover:bg-amber-800'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label={celebrationPreviewPlaying ? 'Stop celebration preview' : 'Preview celebration sound'}
                >
                  {celebrationPreviewPlaying ? (
                    <>
                      <span className="animate-pulse">⏹</span>
                      <span>Stop Celebration</span>
                    </>
                  ) : (
                    <>
                      <span>✨</span>
                      <span>Preview Sound</span>
                    </>
                  )}
                </button>
              </div>

              {/* Hidden audio element for celebration preview */}
              <audio
                ref={celebrationAudioRef}
                src={currentCelebrationSrc}
                onEnded={() => setCelebrationPreviewPlaying(false)}
                className="hidden"
              />
            </div>

            {/* Celebration Sound Options Grid */}
            <div>
              <label className="editor-label">Select Celebration Audio Track</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1.5">
                {PROJECT_TRACKS.map((track) => {
                  const isSelected = currentCelebrationSrc === track.src;
                  return (
                    <button
                      key={track.id}
                      type="button"
                      onClick={() => handleSelectCelebrationTrack(track)}
                      className={`text-left p-3 rounded-lg border transition-all cursor-pointer flex flex-col justify-between ${
                        isSelected
                          ? 'border-amber-700 bg-amber-50/50 shadow-sm ring-1 ring-amber-700'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-gray-200/70 text-gray-700">
                            {track.badge}
                          </span>
                          {isSelected && (
                            <span className="text-amber-800 text-xs font-bold">✓ Selected</span>
                          )}
                        </div>
                        <h5 className="text-xs font-bold text-gray-900 leading-tight">
                          {track.name}
                        </h5>
                        <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                          {track.description}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Celebration Track Upload / Link */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-700">
                  Custom Celebration Audio Upload / Link
                </span>
                <button
                  type="button"
                  onClick={() => setShowCustomCelebrationInput((prev) => !prev)}
                  className="text-xs text-amber-800 hover:text-amber-900 font-medium underline cursor-pointer"
                >
                  {showCustomCelebrationInput ? 'Hide Upload Area' : 'Upload or Link Custom Sound'}
                </button>
              </div>

              {showCustomCelebrationInput && (
                <div className="space-y-3 bg-gray-50/70 p-3.5 rounded-lg border border-gray-200">
                  <div>
                    <label className="editor-label">Celebration Song / Title</label>
                    <input
                      type="text"
                      value={sc.celebrationMusicTitle || ''}
                      onChange={(e) => updateScratch('celebrationMusicTitle', e.target.value)}
                      className="editor-input"
                      placeholder="e.g., Shubhaarambh — Kai Po Che"
                    />
                  </div>

                  <FileUploadZone
                    type="audio"
                    value={sc.celebrationMusicSrc || ''}
                    onChange={handleCustomCelebrationUpload}
                    label="Upload Celebration Audio (MP3/WAV)"
                    helperText="Drop an audio file to use for the scratch card celebration reveal."
                  />
                </div>
              )}
            </div>

            {/* Celebration Volume Control */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex items-center justify-between mb-1.5">
                <label className="editor-label mb-0" htmlFor="celebration-volume-slider">
                  Celebration Audio Volume
                </label>
                <span className="text-xs font-bold text-gray-800 font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {sc.celebrationMusicVolume !== undefined ? sc.celebrationMusicVolume : 80}%
                </span>
              </div>
              <input
                id="celebration-volume-slider"
                type="range"
                min="0"
                max="100"
                step="1"
                value={sc.celebrationMusicVolume !== undefined ? sc.celebrationMusicVolume : 80}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updateScratch('celebrationMusicVolume', val);
                  if (celebrationAudioRef.current) {
                    celebrationAudioRef.current.volume = val / 100;
                  }
                }}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-700"
                aria-label="Celebration audio volume"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>0% (Silent)</span>
                <span>50%</span>
                <span>100% (Loud)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SECTION 4: SCRATCH INTERACTION SOUND (OPTIONAL FRICTION) */}
      {/* ============================================================ */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg">✍️</span>
              <h4 className="text-sm font-bold text-gray-800 uppercase tracking-wider">
                4. Scratch Interaction Sound
              </h4>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Subtle realistic friction sound while the guest is actively scratching the card.
            </p>
          </div>

          <label className="inline-flex items-center gap-2 cursor-pointer select-none bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors">
            <input
              type="checkbox"
              checked={sc.scratchAudioEnabled ?? false}
              onChange={(e) => updateScratch('scratchAudioEnabled', e.target.checked)}
              className="rounded text-amber-700 focus:ring-amber-600 h-4 w-4 cursor-pointer"
            />
            <span className="text-xs font-semibold text-gray-700">
              {sc.scratchAudioEnabled ? 'Scratch Sound ON' : 'Scratch Sound OFF'}
            </span>
          </label>
        </div>

        {!(sc.scratchAudioEnabled ?? false) ? (
          <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600 leading-relaxed">
            <span className="font-semibold">Scratch Sound is Disabled:</span> Scratching the card will be completely silent. You can enable this if you want guests to hear a soft realistic paper/foil rubbing sound as they scratch.
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="editor-label">Friction Texture Style</label>
                <select
                  value={sc.scratchAudioSound || 'foil-scratch'}
                  onChange={(e) => updateScratch('scratchAudioSound', e.target.value)}
                  className="editor-input"
                >
                  <option value="foil-scratch">Gold Foil Scratch (Crisp & Subtle)</option>
                  <option value="soft-paper">Soft Paper Texture (Mellow)</option>
                </select>
              </div>

              <div>
                <label className="editor-label">Audio Sample Preview</label>
                <button
                  type="button"
                  onClick={toggleScratchPreview}
                  className={`w-full min-h-[42px] px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95 ${
                    scratchPreviewPlaying
                      ? 'bg-amber-700 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label={scratchPreviewPlaying ? 'Playing scratch sound' : 'Preview scratch sound'}
                >
                  {scratchPreviewPlaying ? (
                    <>
                      <span className="animate-spin">🔄</span>
                      <span>Playing 1s Friction Sample...</span>
                    </>
                  ) : (
                    <>
                      <span>✍️</span>
                      <span>Preview Scratch Sound</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Scratch Volume */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="editor-label mb-0" htmlFor="scratch-volume-slider">
                  Scratch Interaction Volume
                </label>
                <span className="text-xs font-bold text-gray-800 font-mono bg-gray-100 px-2 py-0.5 rounded">
                  {sc.scratchAudioVolume !== undefined ? sc.scratchAudioVolume : 35}%
                </span>
              </div>
              <input
                id="scratch-volume-slider"
                type="range"
                min="5"
                max="80"
                step="1"
                value={sc.scratchAudioVolume !== undefined ? sc.scratchAudioVolume : 35}
                onChange={(e) => updateScratch('scratchAudioVolume', Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-700"
                aria-label="Scratch interaction volume"
              />
              <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                <span>5% (Very Soft)</span>
                <span>35% (Recommended)</span>
                <span>80% (Prominent)</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Audio Coordination Architecture Summary */}
      <div className="p-4 bg-blue-50/50 border border-blue-200/60 rounded-xl text-xs text-blue-900/90 leading-relaxed">
        <div className="font-bold mb-1.5 flex items-center gap-1.5 text-blue-950">
          <span>ℹ️</span> Smart Audio Priority & Sequential Coordination
        </div>
        <ol className="list-decimal pl-4 space-y-1.5 text-[11px] text-blue-950">
          <li><strong>Phase 1 — Ganesh Welcome Hymn:</strong> When the sacred ॐ नमो गणेशाय नमः screen appears, it plays your chosen devotional hymn exclusively for 3–5 seconds. All other sounds are silent.</li>
          <li><strong>Phase 2 — Transition & Silence:</strong> As the blessing concludes, the hymn dissolves smoothly to 100% complete silence with zero sound collision.</li>
          <li><strong>Phase 3 — Main Website Background Music:</strong> The ambient wedding music softly ramps up over 800ms at your configured volume ({music.volume ?? 75}%) as guests view the couple's invitation.</li>
          <li><strong>Phase 4 — Interactive Features:</strong> During scratch card interaction, background music ducks to 30%. Upon date reveal, celebration audio plays ({sc.celebrationMusicVolume ?? 80}%), and background music smoothly resumes right where it left off.</li>
        </ol>
      </div>
    </div>
  );
}
