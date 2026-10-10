import React from 'react';
import { useWedding } from '@/context/WeddingContext';

export default function SEOPanel() {
  const { config, updateConfig } = useWedding();
  const { seo } = config;

  const update = (field: keyof typeof seo, value: string) => {
    updateConfig((prev) => ({
      ...prev,
      seo: { ...prev.seo, [field]: value },
    }));
  };

  return (
    <div className="space-y-6">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">SEO & Sharing</h3>

      <div>
        <label className="editor-label">Page Title</label>
        <input type="text" value={seo.pageTitle} onChange={(e) => update('pageTitle', e.target.value)} className="editor-input" />
      </div>

      <div>
        <label className="editor-label">Meta Description</label>
        <textarea value={seo.metaDescription} onChange={(e) => update('metaDescription', e.target.value)} className="editor-input min-h-[60px]" />
      </div>

      <div>
        <label className="editor-label">OG Title (social sharing)</label>
        <input type="text" value={seo.ogTitle} onChange={(e) => update('ogTitle', e.target.value)} className="editor-input" />
      </div>

      <div>
        <label className="editor-label">OG Description</label>
        <textarea value={seo.ogDescription} onChange={(e) => update('ogDescription', e.target.value)} className="editor-input min-h-[60px]" />
      </div>

      <div>
        <label className="editor-label">OG Image URL</label>
        <input type="url" value={seo.ogImage} onChange={(e) => update('ogImage', e.target.value)} className="editor-input" />
        {seo.ogImage && <img src={seo.ogImage} alt="OG preview" className="mt-2 w-full h-32 object-cover rounded-md" />}
      </div>

      <div>
        <label className="editor-label">Couple Slug (URL path)</label>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">/</span>
          <input type="text" value={seo.coupleSlug} onChange={(e) => update('coupleSlug', e.target.value)} className="editor-input" placeholder="rishabh-weds-simran" />
        </div>
        <p className="text-xs text-gray-400 mt-1">Your invitation will be at: /{seo.coupleSlug || 'invite'}</p>
      </div>

      <div>
        <label className="editor-label">Favicon URL</label>
        <input type="text" value={seo.favicon} onChange={(e) => update('favicon', e.target.value)} className="editor-input" placeholder="/favicon.svg" />
      </div>
    </div>
  );
}
