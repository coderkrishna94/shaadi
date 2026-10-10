import React from 'react';
import { useWedding } from '@/context/WeddingContext';

export default function RSVPPanel() {
  const { config, updateConfig } = useWedding();
  const { rsvp } = config;

  const updateRSVP = (field: string, value: string | boolean) => {
    updateConfig((prev) => ({
      ...prev,
      rsvp: { ...prev.rsvp, [field]: value },
    }));
  };

  const toggleField = (field: keyof typeof rsvp.fields) => {
    updateConfig((prev) => ({
      ...prev,
      rsvp: {
        ...prev.rsvp,
        fields: { ...prev.rsvp.fields, [field]: !prev.rsvp.fields[field] },
      },
    }));
  };

  const updateFoodOptions = (value: string) => {
    updateConfig((prev) => ({
      ...prev,
      rsvp: {
        ...prev.rsvp,
        foodOptions: value.split(',').map((s) => s.trim()).filter(Boolean),
      },
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">RSVP Configuration</h3>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={rsvp.enabled} onChange={(e) => updateRSVP('enabled', e.target.checked)} className="rounded" />
        <span className="text-sm text-gray-700">Enable RSVP Section</span>
      </label>

      <div>
        <label className="editor-label">Title</label>
        <input type="text" value={rsvp.title} onChange={(e) => updateRSVP('title', e.target.value)} className="editor-input" />
      </div>

      <div>
        <label className="editor-label">Subtitle</label>
        <input type="text" value={rsvp.subtitle} onChange={(e) => updateRSVP('subtitle', e.target.value)} className="editor-input" />
      </div>

      <div>
        <label className="editor-label">Success Message</label>
        <textarea value={rsvp.successMessage} onChange={(e) => updateRSVP('successMessage', e.target.value)} className="editor-input min-h-[60px]" />
      </div>

      <div>
        <h4 className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-3">Form Fields</h4>
        <div className="space-y-2">
          {(Object.keys(rsvp.fields) as Array<keyof typeof rsvp.fields>).map((field) => (
            <label key={field} className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={rsvp.fields[field]} onChange={() => toggleField(field)} className="rounded" />
              <span className="text-sm text-gray-700 capitalize">{field.replace(/([A-Z])/g, ' $1')}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="editor-label">Food Options (comma separated)</label>
        <input type="text" value={rsvp.foodOptions.join(', ')} onChange={(e) => updateFoodOptions(e.target.value)} className="editor-input" placeholder="Vegetarian, Non-Vegetarian, Vegan" />
      </div>
    </div>
  );
}
