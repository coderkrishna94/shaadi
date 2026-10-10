import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WeddingProvider, useWedding } from '@/context/WeddingContext';
import InvitationPage from '@/pages/InvitationPage';
import EditorPage from '@/pages/EditorPage';

function AppRoutes() {
  const { config } = useWedding();
  const rawSlug = (config.seo?.coupleSlug || 'invite').replace(/^\/+|\/+$/g, '') || 'invite';
  const slug = rawSlug === 'editor' ? 'invite' : rawSlug;

  return (
    <Routes>
      {/* Editor takes precedence */}
      <Route path="/editor" element={<EditorPage />} />
      <Route path="/editor/*" element={<EditorPage />} />

      {/* Public invitation */}
      <Route path="/invite" element={<InvitationPage />} />
      {slug !== 'invite' && <Route path={`/${slug}`} element={<InvitationPage />} />}
      {/* Legacy link redirect */}
      <Route path="/meera-and-aarav" element={<Navigate to={`/${slug}`} replace />} />

      {/* Default redirect to invitation */}
      <Route path="/" element={<Navigate to={`/${slug}`} replace />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to={`/${slug}`} replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <WeddingProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </WeddingProvider>
  );
}
