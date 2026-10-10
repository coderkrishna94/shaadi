import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import type { TextContent } from '@/data/weddingConfig';

const textFields: { key: keyof TextContent; label: string; multiline?: boolean }[] = [
  { key: 'heroTitle', label: 'Hero Title', multiline: true },
  { key: 'heroSubtitle', label: 'Hero Subtitle' },
  { key: 'ctaButton', label: 'CTA Button Text' },
  { key: 'scrollIndicator', label: 'Scroll Indicator Text' },
  { key: 'countdownTitle', label: 'Countdown Title' },
  { key: 'countdownComplete', label: 'Countdown Complete Message' },
  { key: 'storyTitle', label: 'Story Section Title' },
  { key: 'storySubtitle', label: 'Story Section Subtitle' },
  { key: 'eventsTitle', label: 'Events Section Title' },
  { key: 'eventsSubtitle', label: 'Events Section Subtitle' },
  { key: 'venueTitle', label: 'Venue Section Title' },
  { key: 'venueSubtitle', label: 'Venue Section Subtitle' },
  { key: 'galleryTitle', label: 'Gallery Section Title' },
  { key: 'gallerySubtitle', label: 'Gallery Section Subtitle' },
  { key: 'familyTitle', label: 'Family Section Title' },
  { key: 'familySubtitle', label: 'Family Section Subtitle' },
  { key: 'rsvpTitle', label: 'RSVP Title' },
  { key: 'rsvpSubtitle', label: 'RSVP Subtitle' },
  { key: 'rsvpButton', label: 'RSVP Button Text' },
  { key: 'footerMessage', label: 'Footer Message' },
  { key: 'footerCredit', label: 'Footer Credit' },
  { key: 'navHome', label: 'Nav: Home' },
  { key: 'navStory', label: 'Nav: Story' },
  { key: 'navEvents', label: 'Nav: Events' },
  { key: 'navGallery', label: 'Nav: Gallery' },
  { key: 'navVenue', label: 'Nav: Venue' },
  { key: 'navRsvp', label: 'Nav: RSVP' },
];

export default function TextPanel() {
  const { config, updateConfig } = useWedding();
  const { text } = config;

  const updateText = (field: keyof TextContent, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      text: { ...prev.text, [field]: value },
    }));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">All Editable Text</h3>
      <p className="text-xs text-gray-400">Every piece of text on the website can be customized here.</p>

      {textFields.map(({ key, label, multiline }) => (
        <div key={key}>
          <label className="editor-label">{label}</label>
          {multiline ? (
            <textarea
              value={text[key]}
              onChange={(e) => updateText(key, e.target.value)}
              className="editor-input min-h-[60px]"
            />
          ) : (
            <input
              type="text"
              value={text[key]}
              onChange={(e) => updateText(key, e.target.value)}
              className="editor-input"
            />
          )}
        </div>
      ))}
    </div>
  );
}
