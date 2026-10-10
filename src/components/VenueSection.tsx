import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { ScrollReveal } from '@/components/ScrollReveal';
import { OrnamentalDivider } from '@/components/IndianMotifs';

export const VenueSection: React.FC = () => {
  const { config } = useWedding();
  const { text, venue } = config;

  return (
    <section id="venue" className="section-padding bg-wedding-ivory text-wedding-burgundy">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-wedding-burgundy mb-2">
              {text.venueTitle}
            </h2>
            <p className="font-script text-2xl text-wedding-accent mb-6">
              {text.venueSubtitle}
            </p>
            <OrnamentalDivider />
          </div>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8 lg:gap-12 items-center">
          <ScrollReveal className="w-full md:w-1/2" direction="left">
            <div className="relative overflow-hidden rounded-t-full rounded-b-sm border border-[var(--color-secondary)]/40 p-1.5 bg-white/40 shadow-xl max-w-sm sm:max-w-md mx-auto md:max-w-none">
              <div className="w-full h-full overflow-hidden rounded-t-full rounded-b-none">
                <img
                  src={venue.image}
                  alt={venue.name}
                  loading="lazy"
                  className="w-full h-[260px] sm:h-[360px] md:h-[480px] lg:h-[540px] object-cover transition-transform duration-1000 ease-out hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-black/15 pointer-events-none rounded-t-full" />
            </div>
          </ScrollReveal>

          <ScrollReveal className="w-full md:w-1/2 flex flex-col items-center text-center md:items-start md:text-left" direction="right">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-secondary)] font-body font-semibold mb-2">The Destination</span>
            <h3 className="font-heading text-2xl sm:text-3xl md:text-4xl text-[var(--color-primary)] mb-3 sm:mb-4">
              {venue.name}
            </h3>
            
            <p className="font-body text-base text-[var(--color-text)] mb-1">
              {venue.address}
            </p>
            <p className="font-body text-base text-[var(--color-text)] mb-4 sm:mb-6 font-medium">
              {venue.city}
            </p>
            
            <p className="font-body text-xs sm:text-sm md:text-base text-[var(--color-text)]/80 mb-6 sm:mb-8 max-w-md leading-relaxed italic">
              {venue.description}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a
                href={venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex items-center justify-center px-7 py-3 bg-[var(--color-primary)] text-white rounded-sm shadow-sm hover:brightness-110 transition-all active:scale-95 text-center font-body uppercase tracking-[0.2em] text-xs font-medium"
              >
                View on Map
              </a>
              <a
                href={venue.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] flex items-center justify-center px-7 py-3 border border-[var(--color-primary)] text-[var(--color-primary)] rounded-sm hover:bg-[var(--color-primary)] hover:text-white transition-all active:scale-95 text-center font-body uppercase tracking-[0.2em] text-xs font-medium shadow-sm"
              >
                Get Directions
              </a>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};
