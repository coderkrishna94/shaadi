import { ThemeConfig } from '../data/weddingConfig';

export interface ThemePreset {
  name: string;
  description: string;
  theme: Omit<ThemeConfig, 'preset'>;
}

export const themePresets: Record<string, ThemePreset> = {
  'royal-burgundy': {
    name: 'Royal Burgundy',
    description: 'Ivory, burgundy, and antique gold — classic Indian royalty',
    theme: {
      primaryColor: '#641F2D',
      secondaryColor: '#B89B5E',
      accentColor: '#23483E',
      backgroundColor: '#F7F1E7',
      textColor: '#252322',
      headingFont: "'Playfair Display', serif",
      bodyFont: "'Inter', sans-serif",
      scriptFont: "'Cormorant Garamond', serif",
      borderRadius: '4px',
      animationIntensity: 'moderate',
    },
  },
  'emerald-garden': {
    name: 'Emerald Garden',
    description: 'Cream, deep emerald, and soft gold — lush and romantic',
    theme: {
      primaryColor: '#23483E',
      secondaryColor: '#C9A84C',
      accentColor: '#641F2D',
      backgroundColor: '#FDF8F0',
      textColor: '#1A2F2A',
      headingFont: "'Playfair Display', serif",
      bodyFont: "'Inter', sans-serif",
      scriptFont: "'Cormorant Garamond', serif",
      borderRadius: '6px',
      animationIntensity: 'moderate',
    },
  },
  'midnight-romance': {
    name: 'Midnight Romance',
    description: 'Deep charcoal, champagne, and plum — dramatic and cinematic',
    theme: {
      primaryColor: '#C9A84C',
      secondaryColor: '#E8D5B5',
      accentColor: '#5B2C4E',
      backgroundColor: '#1A1816',
      textColor: '#F0E6D6',
      headingFont: "'Playfair Display', serif",
      bodyFont: "'Inter', sans-serif",
      scriptFont: "'Cormorant Garamond', serif",
      borderRadius: '2px',
      animationIntensity: 'moderate',
    },
  },
};
