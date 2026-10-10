import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import FileUploadZone from '../components/FileUploadZone';

export default function VenuePanel() {
  const { config, updateConfig } = useWedding();
  const venue = config.venue || {
    name: '',
    address: '',
    city: '',
    description: '',
    image: '',
    googleMapsUrl: '',
  };

  const update = (field: keyof typeof venue, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      venue: { ...(prev.venue || venue), [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Venue Details</h3>

      <div>
        <label className="editor-label">Venue Name</label>
        <input
          type="text"
          value={venue.name || ''}
          onChange={(e) => update('name', e.target.value)}
          className="editor-input"
          placeholder="Jagmandir Island Palace"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="editor-label">City</label>
          <input
            type="text"
            value={venue.city || ''}
            onChange={(e) => update('city', e.target.value)}
            className="editor-input"
            placeholder="Udaipur"
          />
        </div>
        <div>
          <label className="editor-label">Google Maps URL</label>
          <input
            type="url"
            value={venue.googleMapsUrl || ''}
            onChange={(e) => update('googleMapsUrl', e.target.value)}
            className="editor-input"
            placeholder="https://maps.google.com/..."
          />
        </div>
      </div>

      <div>
        <label className="editor-label">Full Address</label>
        <input
          type="text"
          value={venue.address || ''}
          onChange={(e) => update('address', e.target.value)}
          className="editor-input"
          placeholder="Jagmandir Island, Pichola Lake, Udaipur"
        />
      </div>

      <div>
        <label className="editor-label">Description</label>
        <textarea
          value={venue.description || ''}
          onChange={(e) => update('description', e.target.value)}
          className="editor-input min-h-[100px]"
          placeholder="Describe your wedding venue..."
        />
      </div>

      <FileUploadZone
        type="image"
        value={venue.image || ''}
        onChange={(url) => update('image', url)}
        label="Venue Photo"
        helperText="Drag & drop a photo of your wedding venue."
      />
    </div>
  );
}
