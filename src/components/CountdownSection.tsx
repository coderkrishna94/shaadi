import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { useCountdown } from '@/hooks/useCountdown';
import { motion } from 'framer-motion';
import { OrnamentalDivider } from '@/components/IndianMotifs';
import { ScrollReveal } from '@/components/ScrollReveal';

export default function CountdownSection() {
  const { config } = useWedding();
  const { days, hours, minutes, seconds, isComplete } = useCountdown(
    config.wedding.date,
    config.wedding.time
  );

  return (
    <section id="countdown" className="py-20 relative overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="absolute inset-0 bg-[var(--color-primary)] opacity-5" />
      <div className="container mx-auto px-4 relative z-10 text-center">
        <ScrollReveal>
          <h2 className="text-3xl md:text-5xl font-heading mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {config.text.countdownTitle || 'Countdown'}
          </h2>
          <OrnamentalDivider className="mx-auto mb-12" />
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          {isComplete ? (
            <h3 className="text-2xl md:text-4xl font-script text-[var(--color-accent)]" style={{ fontFamily: 'var(--font-script)', color: 'var(--color-accent)' }}>
              {config.text.countdownComplete || 'Just Married!'}
            </h3>
          ) : (
            <div
              className="inline-flex justify-center items-center gap-1.5 sm:gap-4 md:gap-6 max-w-3xl mx-auto px-3 py-5 sm:px-6 sm:py-8 md:px-10 md:py-10 rounded-2xl"
              style={{
                background: 'rgba(255,255,255,0.45)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(184, 155, 94, 0.18)',
                boxShadow: '0 4px 30px rgba(184, 155, 94, 0.08)',
              }}
            >
              {[
                { label: 'DAYS', value: days },
                { label: 'HOURS', value: hours },
                { label: 'MINUTES', value: minutes },
                { label: 'SECONDS', value: seconds },
              ].map((unit, idx, arr) => (
                <React.Fragment key={unit.label}>
                  <div className="flex flex-col items-center w-11 sm:w-16 md:w-24">
                    <motion.div
                      key={unit.value}
                      initial={{ scale: 0.8, opacity: 0.5 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 10 }}
                      className="text-2xl sm:text-4xl md:text-6xl font-heading gold-text-glow mb-1 sm:mb-2"
                      style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}
                    >
                      {String(unit.value).padStart(2, '0')}
                    </motion.div>
                    <span className="text-[8px] sm:text-xs md:text-sm font-body tracking-[0.1em] sm:tracking-[0.2em] uppercase opacity-80" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-primary)' }}>
                      {unit.label}
                    </span>
                  </div>
                  {idx < arr.length - 1 && (
                    <div className="text-base sm:text-2xl md:text-4xl font-heading self-center opacity-40 px-0.5 sm:px-1" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-secondary)' }}>
                      :
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
}
