import React, { useState, useRef } from 'react';
import { optimizeImage, readAudioFile } from '@/utils/mediaUtils';

interface Props {
  type: 'image' | 'audio';
  value: string;
  onChange: (value: string, fileName?: string) => void;
  label?: string;
  helperText?: string;
  placeholder?: string;
  className?: string;
}

export default function FileUploadZone({
  type,
  value,
  onChange,
  label,
  helperText,
  placeholder,
  className = '',
}: Props) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(!value?.startsWith('data:'));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = async (file: File) => {
    setError(null);
    setIsLoading(true);

    try {
      if (type === 'image') {
        if (!file.type.startsWith('image/')) {
          throw new Error('Please drop an image file (JPG, PNG, WebP, etc.)');
        }
        const optimized = await optimizeImage(file, 1400, 0.82);
        onChange(optimized, file.name);
      } else {
        if (!file.type.startsWith('audio/') && !file.name.match(/\.(mp3|m4a|wav|aac|ogg)$/i)) {
          throw new Error('Please drop an audio file (MP3, M4A, WAV, etc.)');
        }

        // Try direct local upload to public/uploads
        try {
          const uploadRes = await fetch(`/api/upload-media?filename=${encodeURIComponent(file.name)}`, {
            method: 'POST',
            body: file,
          });
          const uploadData = await uploadRes.json();
          if (uploadData.success && uploadData.url) {
            onChange(uploadData.url, file.name.replace(/\.[^/.]+$/, ''));
            return;
          }
        } catch {
          // Fall back to data URL
        }

        const result = await readAudioFile(file);
        onChange(result.dataUrl, result.name);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to process file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const isDataUrl = value?.startsWith('data:');

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="editor-label mb-0">{label}</label>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className="text-[11px] text-gray-500 hover:text-gray-900 underline transition-colors"
          >
            {showUrlInput ? 'Hide URL input' : 'Paste web link instead'}
          </button>
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={type === 'image' ? 'image/*' : 'audio/*,.mp3,.m4a,.wav,.aac,.ogg'}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Current Preview */}
      {value && !isLoading ? (
        <div className="relative border border-gray-200 rounded-lg p-3 bg-white space-y-2">
          {type === 'image' ? (
            <div className="relative group">
              <img
                src={value}
                alt="Uploaded preview"
                className="w-full h-44 object-cover rounded-md shadow-inner bg-gray-50"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-md flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1.5 bg-white text-gray-800 text-xs font-medium rounded shadow hover:bg-gray-100 transition-colors"
                >
                  Change Photo
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded shadow hover:bg-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🎵</span>
                  <span className="text-xs font-medium text-gray-700">
                    {isDataUrl ? 'Uploaded Audio File' : 'Linked Audio File'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-xs text-gray-600 hover:text-gray-900 underline"
                  >
                    Change
                  </button>
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="text-xs text-red-500 hover:text-red-700 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
              <audio controls src={value} className="w-full h-10" />
            </div>
          )}

          {isDataUrl && (
            <div className="flex items-center gap-1.5 text-[11px] text-green-700 bg-green-50 px-2.5 py-1 rounded">
              <span>✓</span>
              <span>Loaded from your device</span>
            </div>
          )}
        </div>
      ) : (
        /* Drag and Drop Zone */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
            isDragging
              ? 'border-amber-500 bg-amber-50/60 scale-[0.99]'
              : 'border-gray-300 hover:border-gray-400 bg-gray-50/60 hover:bg-gray-50'
          }`}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-4 space-y-2">
              <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs text-gray-600 font-medium">
                {type === 'image' ? 'Optimizing photo...' : 'Reading audio file...'}
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-2xl">
                {type === 'image' ? '📸' : '🎶'}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">
                  {type === 'image' ? 'Drag & drop your photo here' : 'Drag & drop your music file here'}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                  or <span className="text-amber-700 font-medium underline">browse from your computer</span>
                </p>
              </div>
              <p className="text-[11px] text-gray-400">
                {type === 'image' ? 'Supports JPG, PNG, WEBP (auto-optimized)' : 'Supports MP3, M4A, WAV, AAC'}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-200 flex items-center gap-1.5">
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Optional fallback URL input */}
      {showUrlInput && (
        <div className="pt-1">
          <input
            type="url"
            value={isDataUrl ? '' : value}
            onChange={(e) => onChange(e.target.value)}
            className="editor-input text-xs"
            placeholder={placeholder || (type === 'image' ? 'https://... or paste image URL' : 'https://... or paste MP3 URL')}
          />
        </div>
      )}

      {helperText && <p className="text-[11px] text-gray-400 mt-1">{helperText}</p>}
    </div>
  );
}
