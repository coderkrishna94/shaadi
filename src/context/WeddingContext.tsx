import React, { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { WeddingConfig, defaultConfig } from '../data/weddingConfig';
import { themePresets } from '../themes/presets';

const STORAGE_KEY = 'shaadi-wedding-config';

interface WeddingContextValue {
  config: WeddingConfig;
  updateConfig: (updater: (prev: WeddingConfig) => WeddingConfig) => void;
  setConfig: (config: WeddingConfig) => void;
  resetConfig: () => void;
  applyThemePreset: (presetKey: string) => void;
}

const WeddingContext = createContext<WeddingContextValue | null>(null);

function loadConfig(): WeddingConfig {
  try {
    // Only load draft overrides if explicitly in the editor or with ?preview=draft
    const isEditor = typeof window !== 'undefined' && 
      (window.location.pathname.startsWith('/editor') || window.location.search.includes('preview=draft'));
    
    if (isEditor) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultConfig,
          ...parsed,
          theme: { ...defaultConfig.theme, ...parsed.theme },
          text: { ...defaultConfig.text, ...parsed.text },
          seo: { ...defaultConfig.seo, ...parsed.seo },
          rsvp: { ...defaultConfig.rsvp, ...parsed.rsvp, fields: { ...defaultConfig.rsvp.fields, ...(parsed.rsvp?.fields || {}) } },
          family: { ...defaultConfig.family, ...parsed.family },
          venue: { ...defaultConfig.venue, ...parsed.venue },
          music: { ...defaultConfig.music, ...parsed.music },
          couple: { ...defaultConfig.couple, ...parsed.couple },
          wedding: { ...defaultConfig.wedding, ...parsed.wedding },
          scratchCard: { ...defaultConfig.scratchCard, ...parsed.scratchCard },
        };
      }
    }
  } catch {
    // Ignore corrupt storage
  }
  return defaultConfig;
}

function saveConfig(config: WeddingConfig) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch {
    // Ignore quota errors
  }
}

export function WeddingProvider({ children }: { children: ReactNode }) {
  const [config, setConfigState] = useState<WeddingConfig>(loadConfig);

  useEffect(() => {
    saveConfig(config);
  }, [config]);

  // Apply CSS custom properties for theming
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--color-primary', config.theme.primaryColor);
    root.style.setProperty('--color-secondary', config.theme.secondaryColor);
    root.style.setProperty('--color-accent', config.theme.accentColor);
    root.style.setProperty('--color-bg', config.theme.backgroundColor);
    root.style.setProperty('--color-text', config.theme.textColor);
    root.style.setProperty('--font-heading', config.theme.headingFont);
    root.style.setProperty('--font-body', config.theme.bodyFont);
    root.style.setProperty('--font-script', config.theme.scriptFont);
    root.style.setProperty('--border-radius', config.theme.borderRadius);
  }, [config.theme]);

  // Update SEO meta tags
  useEffect(() => {
    document.title = config.seo.pageTitle;
    const setMeta = (selector: string, content: string) => {
      const el = document.querySelector(selector);
      if (el) el.setAttribute('content', content);
    };
    setMeta('meta[name="description"]', config.seo.metaDescription);
    setMeta('meta[property="og:title"]', config.seo.ogTitle);
    setMeta('meta[property="og:description"]', config.seo.ogDescription);
  }, [config.seo]);

  const updateConfig = useCallback((updater: (prev: WeddingConfig) => WeddingConfig) => {
    setConfigState(prev => updater(prev));
  }, []);

  const setConfig = useCallback((newConfig: WeddingConfig) => {
    setConfigState(newConfig);
  }, []);

  const resetConfig = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setConfigState(defaultConfig);
  }, []);

  const applyThemePreset = useCallback((presetKey: string) => {
    const preset = themePresets[presetKey];
    if (!preset) return;
    setConfigState(prev => ({
      ...prev,
      theme: {
        ...prev.theme,
        ...preset.theme,
        preset: presetKey as WeddingConfig['theme']['preset'],
      },
    }));
  }, []);

  return (
    <WeddingContext.Provider value={{ config, updateConfig, setConfig, resetConfig, applyThemePreset }}>
      {children}
    </WeddingContext.Provider>
  );
}

export function useWedding(): WeddingContextValue {
  const ctx = useContext(WeddingContext);
  if (!ctx) throw new Error('useWedding must be used within WeddingProvider');
  return ctx;
}
