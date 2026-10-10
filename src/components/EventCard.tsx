import React from 'react';
import { ScrollReveal } from '@/components/ScrollReveal';
import { WeddingEvent } from '@/data/weddingConfig';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: WeddingEvent;
  index: number;
}

export default function EventCard({ event, index }: EventCardProps) {
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr ? (dateStr.includes('T') ? dateStr : dateStr + 'T00:00:00') : '');
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    } catch {
      // Fallback
    }
    return dateStr || '';
  };

  const dateFormatted = formatDate(event.date);

  const isHaldi = Boolean(event.name && event.name.toLowerCase().includes('haldi'));
  const hasVenue = !isHaldi && Boolean(event.venueName || event.venueAddress);
  const hasLocationButton = !isHaldi && Boolean(event.googleMapsUrl);

  // Generate direct Google Calendar URL with pre-filled details (no .ics file download)
  const getGoogleCalendarUrl = () => {
    try {
      const d = new Date(event.date ? (event.date.includes('T') ? event.date : event.date + 'T00:00:00') : '');
      if (isNaN(d.getTime())) return '#';
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');

      const parseTime = (tStr?: string, defaultH = 18) => {
        if (!tStr) return { h: defaultH, m: 0 };
        const m = tStr.match(/(\d{1,2}):(\d{2})\s*(AM|PM)?/i);
        if (!m) return { h: defaultH, m: 0 };
        let h = parseInt(m[1], 10);
        const min = parseInt(m[2], 10);
        const ampm = m[3]?.toUpperCase();
        if (ampm === 'PM' && h < 12) h += 12;
        if (ampm === 'AM' && h === 12) h = 0;
        return { h, m: min };
      };

      const start = parseTime(event.time, 18);
      const end = parseTime(event.endTime || '11:00 PM', 23);

      const dtStart = `${year}${month}${day}T${String(start.h).padStart(2, '0')}${String(start.m).padStart(2, '0')}00`;
      const dtEnd = `${year}${month}${day}T${String(end.h).padStart(2, '0')}${String(end.m).padStart(2, '0')}00`;

      const title = encodeURIComponent(`${event.name.trim()} - Rishabh & Simran Wedding`);
      const details = encodeURIComponent(
        `${event.description || 'You are warmly invited to celebrate with us.'}\n\nCouple: Rishabh & Simran${hasVenue && event.venueName ? `\nVenue: ${event.venueName}` : ''}`
      );
      const location = encodeURIComponent(
        hasVenue
          ? (event.venueAddress ? `${event.venueName || ''}, ${event.venueAddress}` : (event.venueName || ''))
          : ''
      );

      return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${dtStart}/${dtEnd}&details=${details}&location=${location}&ctz=Asia/Kolkata`;
    } catch {
      return '#';
    }
  };

  const calendarUrl = getGoogleCalendarUrl();

  return (
    <ScrollReveal delay={index * 0.08} className="h-full">
      <motion.div 
        whileHover={{ y: -4, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
        whileTap={{ scale: 0.99 }}
        className="relative border rounded-sm overflow-hidden h-full flex flex-col shadow-sm hover:shadow-xl transition-all duration-500 bg-white/60 backdrop-blur-sm"
        style={{ 
          borderColor: 'color-mix(in srgb, var(--color-secondary) 30%, transparent)',
        }}
      >
        {event.image && (
          <div className="relative h-48 sm:h-56 w-full overflow-hidden">
            <img 
              src={event.image} 
              alt={event.name} 
              className="w-full h-full object-cover transition-transform duration-1000 ease-out hover:scale-105" 
              loading="lazy" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-4 left-6 right-6">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-secondary)] block mb-1 font-body">Ceremony</span>
              <h3 className="text-2xl font-heading text-white drop-shadow-sm" style={{ fontFamily: 'var(--font-heading)' }}>
                {event.name}
              </h3>
            </div>
          </div>
        )}

        <div className="p-6 sm:p-8 flex-grow flex flex-col justify-between">
          <div>
            {!event.image && (
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-secondary)] block mb-1 font-body">Ceremony</span>
                <h3 className="text-2xl font-heading text-[var(--color-primary)]" style={{ fontFamily: 'var(--font-heading)' }}>
                  {event.name}
                </h3>
              </div>
            )}

            <div className="space-y-4 mb-6 font-body text-sm text-[var(--color-text)]/90">
              <div className="flex flex-col border-b border-[var(--color-secondary)]/15 pb-2.5">
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-secondary)] font-medium mb-1">Date</span>
                <span className="font-heading text-base text-[var(--color-primary)]">{dateFormatted}</span>
              </div>
              
              <div className={`flex flex-col ${hasVenue || event.dressCode ? 'border-b border-[var(--color-secondary)]/15 pb-2.5' : ''}`}>
                <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-secondary)] font-medium mb-1">Time</span>
                <span className="font-body text-sm text-[var(--color-text)]/85">
                  {event.time}{event.endTime ? ` — ${event.endTime}` : ''}
                </span>
              </div>

              {hasVenue && (
                <div className="flex flex-col border-b border-[var(--color-secondary)]/15 pb-2.5">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-secondary)] font-medium mb-1">Venue</span>
                  {event.venueName && (
                    <p className="font-semibold text-[var(--color-primary)] text-sm">{event.venueName}</p>
                  )}
                  {event.venueAddress && (
                    <p className="text-xs text-[var(--color-text)]/70 mt-0.5 leading-relaxed">{event.venueAddress}</p>
                  )}
                </div>
              )}
              
              {event.dressCode && (
                <div className="flex flex-col pt-0.5">
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[var(--color-secondary)] font-medium mb-1">Attire</span>
                  <span className="font-script italic text-base text-[var(--color-primary)]">{event.dressCode}</span>
                </div>
              )}
            </div>

            {event.description && (
              <p className="font-body text-xs sm:text-sm leading-relaxed mb-6 text-[var(--color-text)]/75 italic">
                {event.description}
              </p>
            )}
          </div>

          {/* Action buttons with editorial letter spacing */}
          <div className="pt-4 border-t border-[var(--color-secondary)]/20 flex flex-col sm:flex-row gap-3">
            {hasLocationButton && (
              <a 
                href={event.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-h-[44px] flex items-center justify-center py-2.5 px-4 rounded-sm border border-[var(--color-secondary)]/60 text-[var(--color-primary)] text-xs font-body uppercase tracking-[0.2em] font-medium hover:bg-[var(--color-secondary)] hover:text-white transition-all duration-300 active:scale-98 text-center"
                aria-label={`View ${event.name} venue location on Google Maps`}
              >
                <span>View Location</span>
              </a>
            )}

            <a
              href={calendarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${hasLocationButton ? 'flex-1' : 'w-full'} min-h-[44px] flex items-center justify-center py-2.5 px-4 rounded-sm bg-[var(--color-primary)] text-white text-xs font-body uppercase tracking-[0.2em] font-medium hover:brightness-110 transition-all duration-300 active:scale-98 text-center shadow-sm`}
              aria-label={`Add ${event.name} to Google Calendar`}
            >
              <span>Add to Calendar</span>
            </a>
          </div>
        </div>
      </motion.div>
    </ScrollReveal>
  );
}

