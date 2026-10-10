import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import FileUploadZone from '../components/FileUploadZone';

export default function CouplePanel() {
  const { config, updateConfig } = useWedding();
  const { couple } = config;

  const update = (field: keyof typeof couple, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      couple: { ...prev.couple, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Couple Information</h3>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="editor-label">Bride's Name</label>
          <input
            type="text"
            value={couple.brideName}
            onChange={(e) => update('brideName', e.target.value)}
            className="editor-input"
            placeholder="Bride's name"
          />
        </div>
        <div>
          <label className="editor-label">Groom's Name</label>
          <input
            type="text"
            value={couple.groomName}
            onChange={(e) => update('groomName', e.target.value)}
            className="editor-input"
            placeholder="Groom's name"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="editor-label">Bride's Nickname</label>
          <input
            type="text"
            value={couple.brideNickname}
            onChange={(e) => update('brideNickname', e.target.value)}
            className="editor-input"
            placeholder="Nickname"
          />
        </div>
        <div>
          <label className="editor-label">Groom's Nickname</label>
          <input
            type="text"
            value={couple.groomNickname}
            onChange={(e) => update('groomNickname', e.target.value)}
            className="editor-input"
            placeholder="Nickname"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="editor-label">Couple Initials</label>
          <input
            type="text"
            value={couple.coupleInitials}
            onChange={(e) => update('coupleInitials', e.target.value)}
            className="editor-input"
            placeholder="M & A"
          />
        </div>
        <div>
          <label className="editor-label">Monogram</label>
          <input
            type="text"
            value={couple.monogram}
            onChange={(e) => update('monogram', e.target.value)}
            className="editor-input"
            placeholder="M❤A"
          />
        </div>
      </div>

      <FileUploadZone
        type="image"
        value={couple.couplePhoto || ''}
        onChange={(url) => update('couplePhoto', url)}
        label="Couple Main Photo (Hero & Cover)"
        helperText="Drag & drop your favorite couple portrait from your computer. It is automatically optimized for fast loading."
      />

      <div>
        <label className="editor-label">Short Introduction</label>
        <input
          type="text"
          value={couple.shortIntro}
          onChange={(e) => update('shortIntro', e.target.value)}
          className="editor-input"
          placeholder="A short tagline..."
        />
      </div>

      <div>
        <label className="editor-label">Love Story</label>
        <textarea
          value={couple.loveStory}
          onChange={(e) => update('loveStory', e.target.value)}
          className="editor-input min-h-[120px]"
          placeholder="Your love story..."
        />
      </div>
    </div>
  );
}
