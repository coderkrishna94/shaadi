import React, { useState, useRef } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { generateId, type GalleryImage } from '@/data/weddingConfig';
import { optimizeImage } from '@/utils/mediaUtils';
import FileUploadZone from '../components/FileUploadZone';

export default function GalleryPanel() {
  const { config, updateConfig } = useWedding();
  const gallery = config.gallery || [];
  const [isDraggingBatch, setIsDraggingBatch] = useState(false);
  const [isProcessingBatch, setIsProcessingBatch] = useState(false);
  const multiFileInputRef = useRef<HTMLInputElement>(null);

  const addImage = () => {
    updateConfig((prev) => ({
      ...prev,
      gallery: [
        ...(prev.gallery || []),
        { id: generateId(), src: '', caption: '', featured: false, order: (prev.gallery || []).length },
      ],
    }));
  };

  const removeImage = (id: string) => {
    updateConfig((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).filter((img) => img.id !== id),
    }));
  };

  const updateImage = (id: string, field: keyof GalleryImage, value: string | boolean | number) => {
    updateConfig((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).map((img) => (img.id === id ? { ...img, [field]: value } : img)),
    }));
  };

  const toggleFeatured = (id: string) => {
    updateConfig((prev) => ({
      ...prev,
      gallery: (prev.gallery || []).map((img) => ({ ...img, featured: img.id === id ? !img.featured : false })),
    }));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= gallery.length) return;
    updateConfig((prev) => {
      const newGallery = [...(prev.gallery || [])];
      const temp = newGallery[index];
      newGallery[index] = newGallery[newIndex];
      newGallery[newIndex] = temp;
      return { ...prev, gallery: newGallery };
    });
  };

  // Handle batch file upload (drag & drop multiple files or select multiple files)
  const processBatchFiles = async (files: FileList | File[]) => {
    const imageFiles = Array.from(files).filter((f) => f.type.startsWith('image/'));
    if (imageFiles.length === 0) return;

    setIsProcessingBatch(true);
    try {
      const newItems: GalleryImage[] = [];
      for (let i = 0; i < imageFiles.length; i++) {
        const file = imageFiles[i];
        const dataUrl = await optimizeImage(file, 1400, 0.82);
        newItems.push({
          id: generateId(),
          src: dataUrl,
          caption: '',
          featured: false,
          order: gallery.length + i,
        });
      }

      updateConfig((prev) => ({
        ...prev,
        gallery: [...prev.gallery, ...newItems],
      }));
    } catch (err) {
      console.error('Failed to process batch images:', err);
    } finally {
      setIsProcessingBatch(false);
    }
  };

  const handleBatchDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingBatch(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processBatchFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Wedding Gallery ({gallery.length} photos)
        </h3>
        <button
          onClick={addImage}
          className="text-xs px-3 py-1.5 bg-gray-900 text-white rounded-md hover:bg-gray-700 transition-colors"
        >
          + Add Single Slot
        </button>
      </div>

      {/* Multi-Photo Drag & Drop Zone */}
      <input
        ref={multiFileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => e.target.files && processBatchFiles(e.target.files)}
        className="hidden"
      />

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDraggingBatch(true);
        }}
        onDragLeave={() => setIsDraggingBatch(false)}
        onDrop={handleBatchDrop}
        onClick={() => multiFileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          isDraggingBatch
            ? 'border-amber-500 bg-amber-50/70 scale-[0.99]'
            : 'border-gray-300 hover:border-amber-500 bg-white hover:bg-amber-50/20'
        }`}
      >
        {isProcessingBatch ? (
          <div className="flex flex-col items-center justify-center py-2 space-y-2">
            <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-medium text-gray-700">Optimizing & adding your photos...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-1.5">
            <span className="text-3xl">🖼️</span>
            <p className="text-sm font-semibold text-gray-800">
              Drag & drop multiple wedding photos here
            </p>
            <p className="text-xs text-gray-500">
              or <span className="text-amber-700 font-medium underline">click to browse and select multiple files</span>
            </p>
            <p className="text-[11px] text-gray-400">
              All photos are automatically optimized for web and stored locally.
            </p>
          </div>
        )}
      </div>

      {/* Photo List */}
      <div className="space-y-4">
        {gallery.length === 0 && (
          <p className="text-sm text-gray-400 italic text-center py-6">
            No photos yet. Drag and drop your photos above to begin!
          </p>
        )}

        {gallery.map((img, index) => (
          <div key={img.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Photo #{index + 1}
              </span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1.5 text-xs text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={img.featured}
                    onChange={() => toggleFeatured(img.id)}
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Featured Cover</span>
                </label>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={() => moveImage(index, 'up')}
                    disabled={index === 0}
                    className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveImage(index, 'down')}
                    disabled={index === gallery.length - 1}
                    className="text-xs px-2 py-1 text-gray-500 hover:text-gray-700 disabled:opacity-30"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    onClick={() => removeImage(img.id)}
                    className="text-xs px-2 py-1 text-red-500 hover:text-red-700 ml-1"
                    title="Delete photo"
                  >
                    ✕
                  </button>
                </div>
              </div>
            </div>

            <FileUploadZone
              type="image"
              value={img.src || ''}
              onChange={(url) => updateImage(img.id, 'src', url)}
              placeholder="https://... or drag and drop photo"
            />

            <div>
              <label className="editor-label">Caption (optional)</label>
              <input
                type="text"
                value={img.caption || ''}
                onChange={(e) => updateImage(img.id, 'caption', e.target.value)}
                className="editor-input text-xs"
                placeholder="e.g. Sangeet night with loved ones"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
