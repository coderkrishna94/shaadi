import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import EditorNav from './EditorNav';
import CouplePanel from './panels/CouplePanel';
import WeddingPanel from './panels/WeddingPanel';
import EventsPanel from './panels/EventsPanel';
import StoryPanel from './panels/StoryPanel';
import GalleryPanel from './panels/GalleryPanel';
import FamilyPanel from './panels/FamilyPanel';
import RSVPPanel from './panels/RSVPPanel';
import MusicPanel from './panels/MusicPanel';
import ThemePanel from './panels/ThemePanel';
import SEOPanel from './panels/SEOPanel';
import TextPanel from './panels/TextPanel';
import VenuePanel from './panels/VenuePanel';
import ScratchPanel from './panels/ScratchPanel';
import DeployPanel from './panels/DeployPanel';

export type EditorTab =
  | 'couple'
  | 'wedding'
  | 'scratch'
  | 'events'
  | 'venue'
  | 'story'
  | 'gallery'
  | 'family'
  | 'rsvp'
  | 'music'
  | 'theme'
  | 'text'
  | 'seo'
  | 'deploy';

const panels: Record<EditorTab, React.FC> = {
  couple: CouplePanel,
  wedding: WeddingPanel,
  scratch: ScratchPanel,
  events: EventsPanel,
  venue: VenuePanel,
  story: StoryPanel,
  gallery: GalleryPanel,
  family: FamilyPanel,
  rsvp: RSVPPanel,
  music: MusicPanel,
  theme: ThemePanel,
  text: TextPanel,
  seo: SEOPanel,
  deploy: DeployPanel,
};

export default function EditorLayout() {
  const [activeTab, setActiveTab] = useState<EditorTab>('couple');
  const [previewVisible, setPreviewVisible] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveToast, setSaveToast] = useState<string | null>(null);
  const { config } = useWedding();

  const ActivePanel = panels[activeTab] || CouplePanel;

  const quickSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      const data = await res.json();
      if (data.success) {
        setSaveToast('✓ Saved to Main File');
        setTimeout(() => setSaveToast(null), 3000);
      } else {
        throw new Error();
      }
    } catch {
      // Fallback download
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'savedConfig.json';
      a.click();
      URL.revokeObjectURL(url);
      setSaveToast('✓ Downloaded savedConfig.json');
      setTimeout(() => setSaveToast(null), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left: Navigation */}
      <EditorNav activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Center: Editor Panel */}
      <div className="flex-1 overflow-y-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 capitalize">
            {activeTab === 'deploy' ? 'Save & Deploy' : activeTab === 'music' ? 'Music & Audio' : activeTab}
          </h2>
          <div className="flex items-center gap-3">
            {/* Quick Save to Main File Button */}
            <button
              onClick={quickSave}
              disabled={isSaving}
              className="text-xs px-3.5 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-md font-medium shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50"
              title="Permanently save all your edits to src/data/savedConfig.json"
            >
              {isSaving ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <span>💾</span>
                  <span>{saveToast || 'Save to Main File'}</span>
                </>
              )}
            </button>

            {/* Go to Deploy page shortcut */}
            {activeTab !== 'deploy' && (
              <button
                onClick={() => setActiveTab('deploy')}
                className="text-xs px-3 py-1.5 border border-amber-600/30 text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-md font-medium transition-colors hidden sm:block"
              >
                🚀 Deploy...
              </button>
            )}

            <button
              onClick={() => setPreviewVisible(!previewVisible)}
              className="text-xs px-3 py-1.5 border border-gray-300 rounded-md hover:bg-gray-100 transition-colors hidden lg:block"
            >
              {previewVisible ? 'Hide Preview' : 'Show Preview'}
            </button>

            <a
              href={`/${config.seo?.coupleSlug || 'invite'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              View Live →
            </a>
          </div>
        </div>
        <div className="p-6 max-w-2xl">
          <ActivePanel />
        </div>
      </div>

      {/* Right: Live Preview */}
      {previewVisible && (
        <div className="hidden lg:block w-[420px] border-l border-gray-200 bg-white">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Live Preview</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-400"></div>
                <span className="text-xs text-gray-400">Auto-updating</span>
              </div>
            </div>
          </div>
          <div className="h-[calc(100vh-49px)] overflow-hidden">
            <iframe
              src={`/${config.seo?.coupleSlug || 'invite'}`}
              className="w-[375px] h-full border-0 mx-auto"
              title="Wedding Preview"
              style={{ transform: 'scale(1)', transformOrigin: 'top center' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
