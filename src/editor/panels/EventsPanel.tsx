import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { generateId, type WeddingEvent } from '@/data/weddingConfig';
import FileUploadZone from '../components/FileUploadZone';

const emptyEvent: Omit<WeddingEvent, 'id'> = {
  name: '',
  date: '',
  time: '',
  endTime: '',
  venueName: '',
  venueAddress: '',
  description: '',
  dressCode: '',
  image: '',
  icon: '🎉',
  googleMapsUrl: '',
  color: '#B89B5E',
};

export default function EventsPanel() {
  const { config, updateConfig } = useWedding();
  const events = config.events || [];

  const addEvent = () => {
    updateConfig((prev) => ({
      ...prev,
      events: [...(prev.events || []), { ...emptyEvent, id: generateId() }],
    }));
  };

  const removeEvent = (id: string) => {
    updateConfig((prev) => ({
      ...prev,
      events: (prev.events || []).filter((e) => e.id !== id),
    }));
  };

  const updateEvent = (id: string, field: keyof WeddingEvent, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      events: (prev.events || []).map((e) => (e.id === id ? { ...e, [field]: value } : e)),
    }));
  };

  const moveEvent = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= events.length) return;
    updateConfig((prev) => {
      const newEvents = [...(prev.events || [])];
      [newEvents[index], newEvents[newIndex]] = [newEvents[newIndex], newEvents[index]];
      return { ...prev, events: newEvents };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Wedding Events</h3>
        <button
          onClick={addEvent}
          className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          + Add Event
        </button>
      </div>

      {events.length === 0 && (
        <p className="text-sm text-gray-400 italic">No events yet. Click "Add Event" to create one.</p>
      )}

      {events.map((event, index) => (
        <div key={event.id} className="border border-gray-200 rounded-lg p-4 space-y-4 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">{event.icon || '📅'}</span>
              <span className="text-sm font-medium text-gray-700">
                {event.name || `Event ${index + 1}`}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => moveEvent(index, 'up')}
                disabled={index === 0}
                className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                title="Move up"
              >
                ↑
              </button>
              <button
                onClick={() => moveEvent(index, 'down')}
                disabled={index === events.length - 1}
                className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                title="Move down"
              >
                ↓
              </button>
              <button
                onClick={() => removeEvent(event.id)}
                className="text-xs px-2 py-1 text-red-500 hover:text-red-700"
                title="Delete event"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="editor-label">Event Name</label>
              <input
                type="text"
                value={event.name}
                onChange={(e) => updateEvent(event.id, 'name', e.target.value)}
                className="editor-input"
                placeholder="Sangeet"
              />
            </div>
            <div>
              <label className="editor-label">Icon (emoji)</label>
              <input
                type="text"
                value={event.icon}
                onChange={(e) => updateEvent(event.id, 'icon', e.target.value)}
                className="editor-input"
                placeholder="🎶"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="editor-label">Date</label>
              <input
                type="date"
                value={event.date}
                onChange={(e) => updateEvent(event.id, 'date', e.target.value)}
                className="editor-input"
              />
            </div>
            <div>
              <label className="editor-label">Start Time</label>
              <input
                type="text"
                value={event.time}
                onChange={(e) => updateEvent(event.id, 'time', e.target.value)}
                className="editor-input"
                placeholder="7:00 PM"
              />
            </div>
            <div>
              <label className="editor-label">End Time</label>
              <input
                type="text"
                value={event.endTime}
                onChange={(e) => updateEvent(event.id, 'endTime', e.target.value)}
                className="editor-input"
                placeholder="11:00 PM"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="editor-label">Venue Name</label>
              <input
                type="text"
                value={event.venueName}
                onChange={(e) => updateEvent(event.id, 'venueName', e.target.value)}
                className="editor-input"
                placeholder="The Grand Ballroom"
              />
            </div>
            <div>
              <label className="editor-label">Venue Address</label>
              <input
                type="text"
                value={event.venueAddress}
                onChange={(e) => updateEvent(event.id, 'venueAddress', e.target.value)}
                className="editor-input"
                placeholder="City Palace, Udaipur"
              />
            </div>
          </div>

          <div>
            <label className="editor-label">Description</label>
            <textarea
              value={event.description}
              onChange={(e) => updateEvent(event.id, 'description', e.target.value)}
              className="editor-input min-h-[60px]"
              placeholder="A brief description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="editor-label">Dress Code</label>
              <input
                type="text"
                value={event.dressCode}
                onChange={(e) => updateEvent(event.id, 'dressCode', e.target.value)}
                className="editor-input"
                placeholder="Festive Indian"
              />
            </div>
            <div>
              <label className="editor-label">Accent Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={event.color}
                  onChange={(e) => updateEvent(event.id, 'color', e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={event.color}
                  onChange={(e) => updateEvent(event.id, 'color', e.target.value)}
                  className="editor-input flex-1"
                />
              </div>
            </div>
          </div>

          <FileUploadZone
            type="image"
            value={event.image || ''}
            onChange={(url) => updateEvent(event.id, 'image', url)}
            label="Event Photo (optional)"
          />

          <div>
            <label className="editor-label">Google Maps URL</label>
            <input
              type="url"
              value={event.googleMapsUrl}
              onChange={(e) => updateEvent(event.id, 'googleMapsUrl', e.target.value)}
              className="editor-input"
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>
      ))}
    </div>
  );
}
