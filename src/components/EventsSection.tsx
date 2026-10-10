import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { OrnamentalDivider } from '@/components/IndianMotifs';
import { ScrollReveal } from '@/components/ScrollReveal';
import EventCard from './EventCard';

export default function EventsSection() {
  const { config } = useWedding();

  if (!config.events || config.events.length === 0) return null;

  return (
    <section id="events" className="py-24" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {config.text.eventsTitle || 'Wedding Events'}
          </h2>
          {config.text.eventsSubtitle && (
            <p className="text-xl font-script mb-6" style={{ fontFamily: 'var(--font-script)', color: 'var(--color-secondary)' }}>
              {config.text.eventsSubtitle}
            </p>
          )}
          <OrnamentalDivider className="mx-auto" />
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto relative">
          {config.events.map((event: any, index: number) => (
            <EventCard key={index} event={event} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
