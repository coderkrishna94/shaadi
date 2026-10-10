import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';

export default function DeployPanel() {
  const { config, setConfig } = useWedding();
  const [isSaving, setIsSaving] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [saveStatus, setSaveStatus] = useState<string | null>(null);
  const [buildStatus, setBuildStatus] = useState<string | null>(null);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // 1. Save changes to main project file
  const handleSaveToMainFile = async () => {
    setIsSaving(true);
    setSaveStatus(null);

    try {
      const res = await fetch('/api/save-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setSaveStatus('success');
        setLastSavedTime(new Date().toLocaleTimeString());
      } else {
        throw new Error(data.error || 'Failed to save');
      }
    } catch (err: any) {
      console.warn('API save failed, falling back to download:', err);
      // Fallback: trigger download of savedConfig.json
      const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'savedConfig.json';
      a.click();
      URL.revokeObjectURL(url);
      setSaveStatus('downloaded');
      setLastSavedTime(new Date().toLocaleTimeString());
    } finally {
      setIsSaving(false);
    }
  };

  // 2. Trigger Production Build
  const handleBuildProduction = async () => {
    setIsBuilding(true);
    setBuildStatus(null);

    // Save first
    await handleSaveToMainFile();

    try {
      const res = await fetch('/api/build-site', {
        method: 'POST',
      });
      const data = await res.json();
      if (data.success) {
        setBuildStatus('success');
      } else {
        throw new Error(data.error || 'Build failed');
      }
    } catch (err: any) {
      setBuildStatus('error');
    } finally {
      setIsBuilding(false);
    }
  };

  // 3. Export JSON backup
  const handleExportJSON = () => {
    const jsonStr = JSON.stringify(config, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wedding-invitation-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 4. Import JSON backup
  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        setConfig(imported);
        alert('Config imported successfully! Click "Save to Main File" to apply permanently.');
      } catch (err) {
        alert('Invalid JSON file. Please choose a valid wedding configuration backup.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-base font-bold text-gray-900 uppercase tracking-wider">
          Save & Deploy to Real Website
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          Bake your edited photos, music, and details into the permanent project files and deploy.
        </p>
      </div>

      {/* Main Save Action Card */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span>💾</span>
              <span>Step 1: Save Edits to Main File</span>
            </h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">
              Permanently writes your customized names, dates, photos, and music into{' '}
              <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 text-[11px]">
                src/data/savedConfig.json
              </code>{' '}
              so your changes stay forever even after clearing browser cache.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleSaveToMainFile}
            disabled={isSaving}
            className="px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving to file...</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Save to Main File Now</span>
              </>
            )}
          </button>

          {lastSavedTime && (
            <span className="text-xs text-gray-500">
              Last saved: {lastSavedTime}
            </span>
          )}
        </div>

        {saveStatus === 'success' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 flex items-center gap-2">
            <span>✅</span>
            <span className="font-medium">
              Successfully saved permanently into main project file!
            </span>
          </div>
        )}

        {saveStatus === 'downloaded' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center gap-2">
            <span>📥</span>
            <span>Downloaded as <code className="font-mono font-bold">savedConfig.json</code>. Place it into <code className="font-mono">src/data/</code>.</span>
          </div>
        )}
      </div>

      {/* Build Production Website Card */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <span>🚀</span>
          <span>Step 2: Compile & Build for Production</span>
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          Runs the production bundler to generate the final, high-performance static website files inside the{' '}
          <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-700 text-[11px]">dist/</code>{' '}
          directory.
        </p>

        <div>
          <button
            onClick={handleBuildProduction}
            disabled={isBuilding}
            className="px-5 py-2.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold uppercase tracking-wider flex items-center gap-2 shadow transition-all disabled:opacity-50"
          >
            {isBuilding ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Building production files...</span>
              </>
            ) : (
              <>
                <span>⚡</span>
                <span>Build Production Website</span>
              </>
            )}
          </button>
        </div>

        {buildStatus === 'success' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-xs text-green-800 flex items-center gap-2">
            <span>🎉</span>
            <span className="font-medium">
              Production build complete! The <code className="font-bold">dist/</code> folder is updated with your latest content.
            </span>
          </div>
        )}
      </div>

      {/* Deploy to Real Web Hosting Card */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-4">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <span>🌐</span>
          <span>Step 3: Publish to Public URL</span>
        </h4>
        <p className="text-xs text-gray-500 leading-relaxed">
          To give your guests a public link (e.g.{' '}
          <code className="text-gray-700 font-medium">https://your-wedding.netlify.app</code>):
        </p>

        <div className="space-y-3 pt-1">
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h5 className="text-xs font-bold text-gray-800 mb-1">
              Method A: Netlify Drop (Zero Setup, 30 Seconds)
            </h5>
            <ol className="text-xs text-gray-600 list-decimal list-inside space-y-1">
              <li>Open <a href="https://app.netlify.com/drop" target="_blank" rel="noreferrer" className="text-amber-800 underline font-medium">app.netlify.com/drop</a> in your browser.</li>
              <li>Drag and drop the <code className="font-mono bg-white px-1 py-0.5 rounded">dist</code> folder from your project into Netlify.</li>
              <li>Netlify instantly gives you a live, public HTTPS URL you can share with guests on WhatsApp!</li>
            </ol>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <h5 className="text-xs font-bold text-gray-800 mb-1">
              Method B: Netlify CLI (Terminal)
            </h5>
            <code className="block bg-gray-900 text-green-400 p-2 rounded text-[11px] font-mono select-all">
              npx netlify deploy --prod --dir=dist
            </code>
          </div>
        </div>
      </div>

      {/* Backup & Restore Card */}
      <div className="border border-gray-200 rounded-xl p-5 bg-white shadow-sm space-y-3">
        <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <span>📦</span>
          <span>Backup & Restore</span>
        </h4>
        <p className="text-xs text-gray-500">
          Save an offline copy of all your custom wedding settings or restore from a previous backup.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-1.5"
          >
            <span>📥</span>
            <span>Download Backup (.json)</span>
          </button>

          <label className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer flex items-center gap-1.5">
            <span>📤</span>
            <span>Restore from File</span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportJSON}
              className="hidden"
            />
          </label>
        </div>
      </div>
    </div>
  );
}
