import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { generateId, type StoryMilestone } from '@/data/weddingConfig';
import FileUploadZone from '../components/FileUploadZone';

export default function StoryPanel() {
  const { config, updateConfig } = useWedding();
  const story = config.story || [];

  const addMilestone = () => {
    updateConfig((prev) => ({
      ...prev,
      story: [...(prev.story || []), { id: generateId(), title: '', date: '', description: '', image: '' }],
    }));
  };

  const removeMilestone = (id: string) => {
    updateConfig((prev) => ({
      ...prev,
      story: (prev.story || []).filter((m) => m.id !== id),
    }));
  };

  const updateMilestone = (id: string, field: keyof StoryMilestone, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      story: (prev.story || []).map((m) => (m.id === id ? { ...m, [field]: value } : m)),
    }));
  };

  const moveMilestone = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= story.length) return;
    updateConfig((prev) => {
      const newStory = [...(prev.story || [])];
      [newStory[index], newStory[newIndex]] = [newStory[newIndex], newStory[index]];
      return { ...prev, story: newStory };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Love Story Timeline</h3>
        <button
          onClick={addMilestone}
          className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          + Add Milestone
        </button>
      </div>

      {story.length === 0 && (
        <p className="text-sm text-gray-400 italic">No milestones yet. Add your love story timeline.</p>
      )}

      {story.map((milestone, index) => (
        <div key={milestone.id} className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              {milestone.title || `Milestone ${index + 1}`}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => moveMilestone(index, 'up')} disabled={index === 0} className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30">↑</button>
              <button onClick={() => moveMilestone(index, 'down')} disabled={index === story.length - 1} className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30">↓</button>
              <button onClick={() => removeMilestone(milestone.id)} className="text-xs px-2 py-1 text-red-500 hover:text-red-700">✕</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="editor-label">Title</label>
              <input type="text" value={milestone.title} onChange={(e) => updateMilestone(milestone.id, 'title', e.target.value)} className="editor-input" placeholder="Where It Began" />
            </div>
            <div>
              <label className="editor-label">Date</label>
              <input type="text" value={milestone.date} onChange={(e) => updateMilestone(milestone.id, 'date', e.target.value)} className="editor-input" placeholder="March 2022" />
            </div>
          </div>

          <div>
            <label className="editor-label">Description</label>
            <textarea value={milestone.description} onChange={(e) => updateMilestone(milestone.id, 'description', e.target.value)} className="editor-input min-h-[60px]" placeholder="Tell your story..." />
          </div>

          <FileUploadZone
            type="image"
            value={milestone.image || ''}
            onChange={(url) => updateMilestone(milestone.id, 'image', url)}
            label="Milestone Photo"
          />
        </div>
      ))}
    </div>
  );
}
