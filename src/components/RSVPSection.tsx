import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { motion } from 'framer-motion';
import { OrnamentalDivider } from '@/components/IndianMotifs';
import { ScrollReveal } from '@/components/ScrollReveal';

export const RSVPSection: React.FC = () => {
  const { config } = useWedding();
  const { rsvp, text, events } = config;
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData as any).toString(),
      });
      if (res.ok) {
        setStatus('success');
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section id="rsvp" className="relative py-24 px-6 md:px-12 bg-wedding-primary/5">
      <ScrollReveal className="max-w-3xl mx-auto text-center">
        <OrnamentalDivider className="mb-6 mx-auto" />
        <h2 className="text-4xl md:text-5xl font-heading text-wedding-primary mb-4 font-bold">
          {text.rsvpTitle}
        </h2>
        <p className="text-lg text-wedding-secondary mb-12 font-body italic">
          {text.rsvpSubtitle}
        </p>

        {status === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-wedding-ivory p-8 rounded-lg shadow-lg border border-wedding-gold/30 flex flex-col items-center justify-center min-h-[300px]"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-6"
            >
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </motion.div>
            <h3 className="text-2xl font-heading text-wedding-primary mb-2">Thank You!</h3>
            <p className="text-wedding-text text-lg">{rsvp.successMessage}</p>
          </motion.div>
        )}

        {(status === 'idle' || status === 'submitting' || status === 'error') && (
          <form
            name="rsvp"
            method="POST"
            data-netlify="true"
            netlify-honeypot="bot-field"
            onSubmit={handleSubmit}
            className="bg-white/70 backdrop-blur-md p-6 sm:p-10 md:p-14 rounded-sm shadow-xl border border-[var(--color-secondary)]/30 text-left relative"
          >
            {status === 'submitting' && (
              <div className="absolute inset-0 bg-white/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center rounded-sm">
                <div className="w-12 h-12 border-2 border-[var(--color-secondary)] border-t-transparent rounded-full animate-spin mb-4" />
                <p className="text-[var(--color-primary)] font-body tracking-[0.2em] uppercase text-xs">Submitting...</p>
              </div>
            )}

            <input type="hidden" name="form-name" value="rsvp" />
            <p className="hidden">
              <label>
                Don’t fill this out if you're human: <input name="bot-field" />
              </label>
            </p>

            <div className="space-y-6">
              {rsvp.fields.name && (
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-[var(--color-secondary)] mb-2 uppercase tracking-[0.2em] font-body">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="guestName"
                    required
                    className="w-full min-h-[48px] px-4 py-3 bg-white border border-[var(--color-secondary)]/35 rounded-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors text-[var(--color-text)] font-body text-sm"
                    placeholder="Enter your name"
                  />
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {rsvp.fields.email && (
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-[var(--color-secondary)] mb-2 uppercase tracking-[0.2em] font-body">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full min-h-[48px] px-4 py-3 bg-white border border-[var(--color-secondary)]/35 rounded-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors text-[var(--color-text)] font-body text-sm"
                      placeholder="Enter your email"
                    />
                  </div>
                )}

                {rsvp.fields.phone && (
                  <div>
                    <label className="block text-[10px] sm:text-xs font-semibold text-[var(--color-secondary)] mb-2 uppercase tracking-[0.2em] font-body">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      className="w-full min-h-[48px] px-4 py-3 bg-white border border-[var(--color-secondary)]/35 rounded-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors text-[var(--color-text)] font-body text-sm"
                      placeholder="Enter your phone number"
                    />
                  </div>
                )}
              </div>

              {rsvp.fields.attendance && (
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-[var(--color-secondary)] mb-3 uppercase tracking-[0.2em] font-body">
                    Will you be joining us? *
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                    <label className="min-h-[48px] flex items-center p-3.5 border border-[var(--color-secondary)]/30 rounded-sm cursor-pointer hover:bg-white/80 active:bg-white transition-colors flex-1 bg-white/40">
                      <input type="radio" name="attendance" value="Joyfully Attending" required className="mr-3 w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                      <span className="text-[var(--color-primary)] font-body text-sm font-medium">Joyfully Attending</span>
                    </label>
                    <label className="min-h-[48px] flex items-center p-3.5 border border-[var(--color-secondary)]/30 rounded-sm cursor-pointer hover:bg-white/80 active:bg-white transition-colors flex-1 bg-white/40">
                      <input type="radio" name="attendance" value="Regretfully Declining" required className="mr-3 w-4 h-4 text-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
                      <span className="text-[var(--color-text)]/70 font-body text-sm font-medium">Regretfully Declining</span>
                    </label>
                  </div>
                </div>
              )}

              {rsvp.fields.guests && (
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-[var(--color-secondary)] mb-2 uppercase tracking-[0.2em] font-body">
                    Number of Guests (including yourself)
                  </label>
                  <input
                    type="number"
                    name="guestCount"
                    min="1"
                    max="10"
                    defaultValue="1"
                    className="w-full md:w-1/3 min-h-[48px] px-4 py-3 bg-white border border-[var(--color-secondary)]/35 rounded-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors text-[var(--color-text)] font-body text-sm"
                  />
                </div>
              )}

              {rsvp.fields.eventSelection && events.length > 0 && (
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-[var(--color-secondary)] mb-3 uppercase tracking-[0.2em] font-body">
                    Which events will you attend?
                  </label>
                  <div className="space-y-2">
                    {events.map((event, idx) => (
                      <label key={idx} className="min-h-[44px] flex items-center p-3 hover:bg-white/80 active:bg-white rounded-sm cursor-pointer transition-colors border border-[var(--color-secondary)]/20 bg-white/40">
                        <input type="checkbox" name={`event_${idx}`} value={event.name} className="mr-3 w-4 h-4 text-[var(--color-primary)] rounded-none focus:ring-[var(--color-primary)]" />
                        <span className="text-[var(--color-text)] font-body text-sm">{event.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {rsvp.fields.foodPreference && rsvp.foodOptions && rsvp.foodOptions.length > 0 && (
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-[var(--color-secondary)] mb-2 uppercase tracking-[0.2em] font-body">
                    Dietary Requirements / Food Preference
                  </label>
                  <select
                    name="foodPreference"
                    className="w-full min-h-[48px] px-4 py-3 bg-white border border-[var(--color-secondary)]/35 rounded-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors text-[var(--color-text)] font-body text-sm appearance-none"
                  >
                    <option value="">Select an option...</option>
                    {rsvp.foodOptions.map((opt, idx) => (
                      <option key={idx} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>
              )}

              {rsvp.fields.message && (
                <div>
                  <label className="block text-[10px] sm:text-xs font-semibold text-[var(--color-secondary)] mb-2 uppercase tracking-[0.2em] font-body">
                    Leave a message for the couple
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 bg-white border border-[var(--color-secondary)]/35 rounded-sm focus:outline-none focus:border-[var(--color-primary)] focus:ring-1 focus:ring-[var(--color-primary)] transition-colors text-[var(--color-text)] font-body text-sm resize-y"
                    placeholder="Wishes, song requests, or warm blessings..."
                  />
                </div>
              )}
            </div>

            {status === 'error' && (
              <div className="mt-6 p-4 bg-red-50 text-red-700 rounded-sm border border-red-200 text-sm">
                There was an error submitting your RSVP. Please try again.
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full md:w-auto min-h-[48px] px-12 py-3.5 bg-[var(--color-primary)] text-white font-body uppercase tracking-[0.25em] text-xs font-medium rounded-sm shadow-md hover:brightness-110 transition-all active:scale-98 disabled:opacity-70 flex items-center justify-center mx-auto"
              >
                {text.rsvpButton || 'Submit RSVP'}
              </button>
            </div>
          </form>
        )}
      </ScrollReveal>
    </section>
  );
};
