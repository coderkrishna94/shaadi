import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { generateId, type FamilyMember } from '@/data/weddingConfig';
import FileUploadZone from '../components/FileUploadZone';

export default function FamilyPanel() {
  const { config, updateConfig } = useWedding();
  const { family } = config;

  const updateFamilyField = (field: string, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      family: { ...prev.family, [field]: value },
    }));
  };

  const addMember = (side: 'brideFamily' | 'groomFamily') => {
    updateConfig((prev) => ({
      ...prev,
      family: {
        ...prev.family,
        [side]: [...(prev.family?.[side] || []), { id: generateId(), name: '', relationship: '', photo: '' }],
      },
    }));
  };

  const removeMember = (side: 'brideFamily' | 'groomFamily', id: string) => {
    updateConfig((prev) => ({
      ...prev,
      family: {
        ...prev.family,
        [side]: (prev.family?.[side] || []).filter((m) => m.id !== id),
      },
    }));
  };

  const updateMember = (side: 'brideFamily' | 'groomFamily', id: string, field: keyof FamilyMember, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      family: {
        ...prev.family,
        [side]: (prev.family?.[side] || []).map((m) => (m.id === id ? { ...m, [field]: value } : m)),
      },
    }));
  };

  const renderFamilySide = (side: 'brideFamily' | 'groomFamily', titleKey: 'brideFamilyTitle' | 'groomFamilyTitle') => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <label className="editor-label">{side === 'brideFamily' ? "Bride's Side Title" : "Groom's Side Title"}</label>
          <input
            type="text"
            value={family[titleKey]}
            onChange={(e) => updateFamilyField(titleKey, e.target.value)}
            className="editor-input"
          />
        </div>
        <button
          onClick={() => addMember(side)}
          className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors ml-3 mt-5"
        >
          + Add
        </button>
      </div>

      {(family[side] || []).map((member) => (
        <div key={member.id} className="border border-gray-200 rounded-lg p-3 bg-white space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="editor-label">Name</label>
              <input type="text" value={member.name} onChange={(e) => updateMember(side, member.id, 'name', e.target.value)} className="editor-input text-xs" placeholder="Full name" />
            </div>
            <div>
              <label className="editor-label">Relationship</label>
              <input type="text" value={member.relationship} onChange={(e) => updateMember(side, member.id, 'relationship', e.target.value)} className="editor-input text-xs" placeholder="Father of the Bride" />
            </div>
          </div>
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <FileUploadZone
                type="image"
                value={member.photo || ''}
                onChange={(url) => updateMember(side, member.id, 'photo', url)}
                label="Photo (optional)"
              />
            </div>
            <button
              onClick={() => removeMember(side, member.id)}
              className="text-xs text-red-500 hover:text-red-700 mt-2 px-2 py-1 hover:bg-red-50 rounded"
              title="Delete member"
            >
              ✕ Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-8">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Family Section</h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="editor-label">Section Title</label>
          <input type="text" value={family.sectionTitle} onChange={(e) => updateFamilyField('sectionTitle', e.target.value)} className="editor-input" />
        </div>
        <div>
          <label className="editor-label">Section Subtitle</label>
          <input type="text" value={family.sectionSubtitle} onChange={(e) => updateFamilyField('sectionSubtitle', e.target.value)} className="editor-input" />
        </div>
      </div>

      {renderFamilySide('brideFamily', 'brideFamilyTitle')}
      <hr className="border-gray-200" />
      {renderFamilySide('groomFamily', 'groomFamilyTitle')}
    </div>
  );
}
