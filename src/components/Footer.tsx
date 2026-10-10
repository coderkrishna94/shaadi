import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { Monogram, OrnamentalDivider, CornerMotif } from '@/components/IndianMotifs';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  const { config } = useWedding();
  const { couple, text, wedding } = config;

  const formatFooterDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr ? (dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00') : '');
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      }
    } catch {
      // Fallback
    }
    return dateStr || '';
  };

  const formattedDate = formatFooterDate(wedding.date);

  return (
    <footer id="footer" className="relative py-20 px-6 overflow-hidden" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
      {/* Corner Motifs */}
      <CornerMotif position="top-left" className="opacity-30" />
      <CornerMotif position="top-right" className="opacity-30" />
      <CornerMotif position="bottom-left" className="opacity-30" />
      <CornerMotif position="bottom-right" className="opacity-30" />

      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center relative z-10">
        <OrnamentalDivider className="mb-12" />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <Monogram text={couple.coupleInitials || 'M & A'} size={80} className="mx-auto" />
        </motion.div>

        <h2 className="text-3xl md:text-4xl font-heading mb-4 tracking-wider">
          {couple.brideName} & {couple.groomName}
        </h2>
        
        <p className="text-lg md:text-xl font-body opacity-80 mb-8 uppercase tracking-widest">
          {formattedDate}
        </p>

        {text.footerMessage && (
          <p className="text-2xl md:text-3xl font-script mb-16 px-4" style={{ color: 'var(--color-secondary)' }}>
            {text.footerMessage}
          </p>
        )}

        <div className="mt-8 pt-8 w-full flex flex-col items-center" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
          <p className="text-xs uppercase tracking-widest font-body opacity-60 flex flex-wrap justify-center items-center gap-2 text-center px-4">
            <span>
              {text.footerCredit && text.footerCredit !== 'Made with ❤️' && text.footerCredit !== 'Designed with love'
                ? text.footerCredit
                : 'Made with ❤️ by Hritik and Krishna'}
            </span>
            <span>•</span>
            <button
              onClick={(e) => {
                e.preventDefault();
                sessionStorage.removeItem('introPlayed');
                window.location.reload();
              }}
              type="button"
              className="underline hover:opacity-100 transition-opacity cursor-pointer bg-transparent border-none p-0 text-inherit text-xs uppercase tracking-widest font-body"
              title="Replay the sacred blessing & intro"
            >
              Replay Blessing ✦
            </button>
            <span>•</span>
            <a href="/editor" className="underline hover:opacity-100 transition-opacity" title="Open Wedding Editor">
              Edit Invitation
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
};
