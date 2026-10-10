import React from 'react';
import { useWedding } from '@/context/WeddingContext';

export default function WeddingPanel() {
  const { config, updateConfig } = useWedding();
  const { wedding } = config;

  const update = (field: keyof typeof wedding, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      wedding: { ...prev.wedding, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-700 mb-4 uppercase tracking-wider">Wedding Details</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="editor-label">Wedding Date</label>
          <input
            type="date"
            value={wedding.date}
            onChange={(e) => update('date', e.target.value)}
            className="editor-input"
          />
        </div>
        <div>
          <label className="editor-label">Wedding Time</label>
          <input
            type="text"
            value={wedding.time}
            onChange={(e) => update('time', e.target.value)}
            className="editor-input"
            placeholder="7:00 PM"
          />
        </div>
      </div>

      <div>
        <label className="editor-label">City</label>
        <input
          type="text"
          value={wedding.city}
          onChange={(e) => update('city', e.target.value)}
          className="editor-input"
          placeholder="Udaipur"
        />
      </div>

      <div>
        <label className="editor-label">Invitation Message</label>
        <textarea
          value={wedding.invitationMessage}
          onChange={(e) => update('invitationMessage', e.target.value)}
          className="editor-input min-h-[100px]"
          placeholder="Together with their families..."
        />
        <p className="text-xs text-gray-400 mt-1">Use line breaks for multi-line text</p>
      </div>
    </div>
  );
}
