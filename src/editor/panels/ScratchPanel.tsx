import React, { useState, useRef, useEffect } from 'react';
import { useWedding } from '@/context/WeddingContext';

export default function ScratchPanel() {
  const { config, updateConfig } = useWedding();
  const [isPreviewPlaying, setIsPreviewPlaying] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const sc = config.scratchCard || {
    enabled: true,
    date: '',
    teaserTitle: 'A little secret awaits…',
    scratchText: 'Scratch to reveal our special date',
    celebrationTitle: "We're Getting Married!",
    celebrationMessage: "We can't wait to celebrate this beautiful day with you.",
    celebrationMusicEnabled: true,
    celebrationMusicSrc: '/uploads/Y2Mate.is_-_Shubhaarambh_Full_Video_-_Kai_Po_Che___Sushant_Singh_Rajput___Rajkummar_Rao___Amit_Sadh___Amit_T.mp3',
    celebrationMusicTitle: 'Shubhaarambh — Kai Po Che',
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

  useEffect(() => {
    return () => {
      if (previewAudioRef.current) {
        previewAudioRef.current.pause();
      }
    };
  }, []);

  const togglePreview = () => {
    const audio = previewAudioRef.current;
    if (!audio) return;
    if (isPreviewPlaying) {
      audio.pause();
      setIsPreviewPlaying(false);
    } else {
      audio.play().then(() => setIsPreviewPlaying(true)).catch(() => {});
    }
  };

  const update = <K extends keyof typeof sc>(field: K, value: (typeof sc)[K]) => {
    updateConfig((prev) => ({
      ...prev,
      scratchCard: { ...(prev.scratchCard || sc), [field]: value },
    }));
  };

  const updateColor = (colorKey: keyof typeof sc.colors, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      scratchCard: {
        ...(prev.scratchCard || sc),
        colors: { ...(prev.scratchCard?.colors || sc.colors), [colorKey]: value },
      },
    }));
  };

  const updateAnimation = (animKey: keyof typeof sc.animation, value: boolean | number) => {
    updateConfig((prev) => ({
      ...prev,
      scratchCard: {
        ...(prev.scratchCard || sc),
        animation: { ...(prev.scratchCard?.animation || sc.animation), [animKey]: value },
      },
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Date Scratch Card
        </h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={sc.enabled}
            onChange={(e) => update('enabled', e.target.checked)}
            className="rounded"
          />
          <span className="text-xs text-gray-700 font-medium">Enable Scratch Card</span>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="editor-label">Teaser Title</label>
          <input
            type="text"
            value={sc.teaserTitle || ''}
            onChange={(e) => update('teaserTitle', e.target.value)}
            className="editor-input"
            placeholder="A little secret awaits…"
          />
        </div>
        <div>
          <label className="editor-label">Scratch Prompt Text</label>
          <input
            type="text"
            value={sc.scratchText || ''}
            onChange={(e) => update('scratchText', e.target.value)}
            className="editor-input"
            placeholder="Scratch to reveal our special date"
          />
        </div>
      </div>

      <div>
        <label className="editor-label">Custom Date Display (leave blank to use wedding date)</label>
        <input
          type="text"
          value={sc.date || ''}
          onChange={(e) => update('date', e.target.value)}
          className="editor-input"
          placeholder="26 November 2026"
        />
        <p className="text-xs text-gray-400 mt-1">
          If provided, this exact text will be displayed under the scratch card.
        </p>
      </div>

      <div className="border-t border-gray-200 pt-5 space-y-4">
        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Celebration Pop-up
        </h4>

        <div>
          <label className="editor-label">Celebration Title</label>
          <input
            type="text"
            value={sc.celebrationTitle || ''}
            onChange={(e) => update('celebrationTitle', e.target.value)}
            className="editor-input"
            placeholder="We're Getting Married!"
          />
        </div>

        <div>
          <label className="editor-label">Celebration Message</label>
          <textarea
            value={sc.celebrationMessage || ''}
            onChange={(e) => update('celebrationMessage', e.target.value)}
            className="editor-input min-h-[70px]"
            placeholder="We can't wait to celebrate this beautiful day with you."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2 cursor-pointer p-3 bg-white border border-gray-200 rounded-lg">
            <input
              type="checkbox"
              checked={sc.animation?.particles ?? true}
              onChange={(e) => updateAnimation('particles', e.target.checked)}
              className="rounded"
            />
            <span className="text-xs text-gray-700 font-medium">✨ Gold Sparkles</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer p-3 bg-white border border-gray-200 rounded-lg">
            <input
              type="checkbox"
              checked={sc.animation?.petals ?? true}
              onChange={(e) => updateAnimation('petals', e.target.checked)}
              className="rounded"
            />
            <span className="text-xs text-gray-700 font-medium">🌸 Flower Petals</span>
          </label>
        </div>

        {/* Celebration Music Section */}
        <div className="border-t border-gray-100 pt-4 space-y-3">
          <div className="flex items-center justify-between">
            <h5 className="text-xs font-semibold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
              <span>🎶</span> Celebration Music
            </h5>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={sc.celebrationMusicEnabled !== false}
                onChange={(e) => update('celebrationMusicEnabled', e.target.checked)}
                className="rounded"
              />
              <span className="text-xs text-gray-700 font-medium">Play on Date Reveal</span>
            </label>
          </div>

          {sc.celebrationMusicEnabled !== false && (
            <div className="space-y-3 bg-gray-50/70 p-3.5 rounded-lg border border-gray-200">
              <div>
                <label className="editor-label">Music Track Title</label>
                <input
                  type="text"
                  value={sc.celebrationMusicTitle || ''}
                  onChange={(e) => update('celebrationMusicTitle', e.target.value)}
                  className="editor-input"
                  placeholder="e.g., Shubhaarambh — Kai Po Che"
                />
              </div>

              <div>
                <label className="editor-label">Audio File / URL Path</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={sc.celebrationMusicSrc || ''}
                    onChange={(e) => {
                      update('celebrationMusicSrc', e.target.value);
                      if (previewAudioRef.current) {
                        previewAudioRef.current.src = e.target.value;
                      }
                    }}
                    className="editor-input flex-1"
                    placeholder="/uploads/... or https://..."
                  />
                  {sc.celebrationMusicSrc && (
                    <button
                      type="button"
                      onClick={togglePreview}
                      className="px-3 py-1.5 bg-wedding-secondary/20 text-wedding-primary rounded border border-wedding-secondary/40 text-xs font-medium hover:bg-wedding-secondary/30 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer"
                    >
                      {isPreviewPlaying ? '⏸ Stop' : '▶ Preview'}
                    </button>
                  )}
                </div>
                {sc.celebrationMusicSrc && (
                  <audio
                    ref={previewAudioRef}
                    src={sc.celebrationMusicSrc}
                    onEnded={() => setIsPreviewPlaying(false)}
                    className="hidden"
                  />
                )}
              </div>

              {/* Presets */}
              <div>
                <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider block mb-1.5">
                  Available Presets:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      update('celebrationMusicSrc', '/uploads/Y2Mate.is_-_Shubhaarambh_Full_Video_-_Kai_Po_Che___Sushant_Singh_Rajput___Rajkummar_Rao___Amit_Sadh___Amit_T.mp3');
                      update('celebrationMusicTitle', 'Shubhaarambh — Kai Po Che');
                    }}
                    className="text-xs px-2.5 py-1 rounded bg-white border border-gray-200 hover:border-wedding-secondary text-gray-700 hover:text-wedding-primary transition-colors cursor-pointer"
                  >
                    🎉 Shubhaarambh (Recommended)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      update('celebrationMusicSrc', '/wedding-melody.wav');
                      update('celebrationMusicTitle', 'Royal Wedding Melody');
                    }}
                    className="text-xs px-2.5 py-1 rounded bg-white border border-gray-200 hover:border-wedding-secondary text-gray-700 hover:text-wedding-primary transition-colors cursor-pointer"
                  >
                    🎺 Royal Wedding Melody
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      update('celebrationMusicSrc', '/uploads/Y2Mate.is_-_Ishq_De_Fanniyar_Slowed_Reverb_Lofi_Song___Rang_De_Ranjheya.mp3');
                      update('celebrationMusicTitle', 'Ishq De Fanniyar');
                    }}
                    className="text-xs px-2.5 py-1 rounded bg-white border border-gray-200 hover:border-wedding-secondary text-gray-700 hover:text-wedding-primary transition-colors cursor-pointer"
                  >
                    💖 Ishq De Fanniyar
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="text-[11px] text-gray-500 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/50">
            💡 Full audio settings (background music, celebration audio, scratch friction sounds, and volume controls) can also be managed in the dedicated <strong>Music & Audio</strong> panel.
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-5 space-y-4">
        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Interaction & Threshold
        </h4>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="editor-label">Auto-reveal Threshold ({sc.scratchThreshold}%)</label>
            <input
              type="range"
              min="20"
              max="90"
              value={sc.scratchThreshold || 55}
              onChange={(e) => update('scratchThreshold', Number(e.target.value))}
              className="w-full mt-2"
            />
          </div>
          <div>
            <label className="editor-label">Fallback Button Text</label>
            <input
              type="text"
              value={sc.fallbackButtonText || ''}
              onChange={(e) => update('fallbackButtonText', e.target.value)}
              className="editor-input"
              placeholder="Reveal Date"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-5 space-y-4">
        <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Colors
        </h4>

        <div className="grid grid-cols-3 gap-3">
          {[
            { key: 'scratchSurface' as const, label: 'Scratch Cover' },
            { key: 'gold' as const, label: 'Gold Accent' },
            { key: 'card' as const, label: 'Card Background' },
            { key: 'text' as const, label: 'Text Color' },
            { key: 'blush' as const, label: 'Petal Blush' },
            { key: 'celebration' as const, label: 'Popup Background' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2 bg-white p-2 border border-gray-200 rounded-lg">
              <input
                type="color"
                value={sc.colors?.[key] || '#C9A45C'}
                onChange={(e) => updateColor(key, e.target.value)}
                className="w-7 h-7 rounded border border-gray-300 cursor-pointer flex-shrink-0"
              />
              <div className="overflow-hidden">
                <div className="text-[11px] font-medium text-gray-700 truncate">{label}</div>
                <div className="text-[10px] text-gray-400 uppercase">{sc.colors?.[key]}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
