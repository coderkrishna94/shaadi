import React from 'react';
import type { EditorTab } from './EditorLayout';

interface Props {
  activeTab: EditorTab;
  onTabChange: (tab: EditorTab) => void;
}

const tabs: { key: EditorTab; label: string; icon: string }[] = [
  { key: 'couple', label: 'Couple', icon: '💑' },
  { key: 'wedding', label: 'Wedding', icon: '💍' },
  { key: 'scratch', label: 'Scratch Card', icon: '✨' },
  { key: 'events', label: 'Events', icon: '📅' },
  { key: 'venue', label: 'Venue', icon: '🏰' },
  { key: 'story', label: 'Story', icon: '📖' },
  { key: 'gallery', label: 'Gallery', icon: '🖼️' },
  { key: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦' },
  { key: 'rsvp', label: 'RSVP', icon: '✉️' },
  { key: 'music', label: 'Music & Audio', icon: '🎵' },
  { key: 'theme', label: 'Theme', icon: '🎨' },
  { key: 'text', label: 'Text', icon: '✏️' },
  { key: 'seo', label: 'SEO', icon: '🔍' },
  { key: 'deploy', label: 'Save & Deploy', icon: '🚀' },
];

export default function EditorNav({ activeTab, onTabChange }: Props) {
  return (
    <nav className="w-56 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto hidden md:block">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-sm font-bold text-gray-900 tracking-wider uppercase">Wedding Editor</h1>
        <p className="text-xs text-gray-400 mt-1">Customize your invitation</p>
      </div>
      <div className="py-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`w-full text-left px-4 py-2.5 flex items-center gap-3 text-sm transition-colors ${
              activeTab === tab.key
                ? 'bg-gray-100 text-gray-900 font-medium border-r-2 border-gray-900'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
            }`}
          >
            <span className="text-base">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>
    </nav>
  );
}
