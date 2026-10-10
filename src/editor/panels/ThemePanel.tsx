import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { themePresets } from '@/themes/presets';

export default function ThemePanel() {
  const { config, updateConfig, applyThemePreset } = useWedding();
  const { theme } = config;

  const updateTheme = (field: keyof typeof theme, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      theme: { ...prev.theme, [field]: value, preset: 'custom' as const },
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Theme & Design</h3>

      {/* Preset Selector */}
      <div>
        <label className="editor-label">Theme Preset</label>
        <div className="grid grid-cols-1 gap-2 mt-2">
          {Object.entries(themePresets).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyThemePreset(key)}
              className={`text-left p-3 border rounded-lg transition-all ${
                theme.preset === key
                  ? 'border-gray-900 ring-2 ring-gray-900 ring-offset-1'
                  : 'border-gray-200 hover:border-gray-400'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-5 h-5 rounded-full border border-gray-200" style={{ background: preset.theme.primaryColor }} />
                  <div className="w-5 h-5 rounded-full border border-gray-200" style={{ background: preset.theme.secondaryColor }} />
                  <div className="w-5 h-5 rounded-full border border-gray-200" style={{ background: preset.theme.backgroundColor }} />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-800">{preset.name}</div>
                  <div className="text-xs text-gray-500">{preset.description}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <label className="editor-label">Custom Colors</label>
        <div className="grid grid-cols-2 gap-3 mt-2">
          {[
            { key: 'primaryColor' as const, label: 'Primary' },
            { key: 'secondaryColor' as const, label: 'Secondary (Gold)' },
            { key: 'accentColor' as const, label: 'Accent' },
            { key: 'backgroundColor' as const, label: 'Background' },
            { key: 'textColor' as const, label: 'Text' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-2">
              <input
                type="color"
                value={theme[key]}
                onChange={(e) => updateTheme(key, e.target.value)}
                className="w-8 h-8 rounded border border-gray-300 cursor-pointer flex-shrink-0"
              />
              <div className="flex-1">
                <div className="text-xs text-gray-600">{label}</div>
                <input
                  type="text"
                  value={theme[key]}
                  onChange={(e) => updateTheme(key, e.target.value)}
                  className="editor-input text-xs mt-0.5"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fonts */}
      <div>
        <label className="editor-label">Typography</label>
        <div className="space-y-3 mt-2">
          <div>
            <label className="text-xs text-gray-500">Heading Font</label>
            <select
              value={theme.headingFont}
              onChange={(e) => updateTheme('headingFont', e.target.value)}
              className="editor-input"
            >
              <option value="'Playfair Display', serif">Playfair Display</option>
              <option value="'Cormorant Garamond', serif">Cormorant Garamond</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Times New Roman', serif">Times New Roman</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-gray-500">Body Font</label>
            <select
              value={theme.bodyFont}
              onChange={(e) => updateTheme('bodyFont', e.target.value)}
              className="editor-input"
            >
              <option value="'Inter', sans-serif">Inter</option>
              <option value="system-ui, sans-serif">System UI</option>
              <option value="'Helvetica Neue', sans-serif">Helvetica Neue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Animation */}
      <div>
        <label className="editor-label">Animation Intensity</label>
        <select
          value={theme.animationIntensity}
          onChange={(e) => updateTheme('animationIntensity', e.target.value)}
          className="editor-input"
        >
          <option value="none">None</option>
          <option value="subtle">Subtle</option>
          <option value="moderate">Moderate</option>
          <option value="full">Full</option>
        </select>
      </div>

      {/* Border Radius */}
      <div>
        <label className="editor-label">Border Radius</label>
        <input type="text" value={theme.borderRadius} onChange={(e) => updateTheme('borderRadius', e.target.value)} className="editor-input" placeholder="4px" />
      </div>
    </div>
  );
}
