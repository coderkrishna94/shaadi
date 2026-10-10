import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { OrnamentalDivider } from '@/components/IndianMotifs';
import { ScrollReveal } from '@/components/ScrollReveal';
import { motion } from 'framer-motion';

export default function StorySection() {
  const { config } = useWedding();

  if (!config.story || config.story.length === 0) return null;

  return (
    <section id="story" className="py-24 relative" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container mx-auto px-4">
        <ScrollReveal className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading mb-4" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
            {config.text.storyTitle}
          </h2>
          {config.text.storySubtitle && (
            <p className="text-xl font-script mb-6" style={{ fontFamily: 'var(--font-script)', color: 'var(--color-secondary)' }}>
              {config.text.storySubtitle}
            </p>
          )}
          <OrnamentalDivider className="mx-auto" />
        </ScrollReveal>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline Line */}
          <div className="absolute left-[14px] sm:left-[20px] md:left-1/2 top-0 bottom-0 w-[2px] transform md:-translate-x-1/2" style={{ backgroundColor: 'var(--color-secondary)', opacity: 0.3 }} />

          {config.story.map((milestone: any, index: number) => {
            const isEven = index % 2 === 0;
            return (
              <ScrollReveal key={index} delay={index * 0.1} className="relative mb-16 last:mb-0">
                {/* Timeline Dot */}
                <div className="absolute left-[7px] sm:left-[13px] md:left-1/2 top-6 w-4 h-4 rounded-full border-4 transform md:-translate-x-1/2 z-10" style={{ backgroundColor: 'var(--color-secondary)', borderColor: 'var(--color-bg)' }} />

                <div className={`flex flex-col md:flex-row items-center gap-6 sm:gap-8 pl-8 sm:pl-14 md:pl-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
                  {/* Content */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pl-12' : 'md:pr-12 md:text-right'}`}>
                    <h3 className="text-2xl font-heading mb-2" style={{ fontFamily: 'var(--font-heading)', color: 'var(--color-primary)' }}>
                      {milestone.title}
                    </h3>
                    <div className="font-script text-xl mb-4" style={{ fontFamily: 'var(--font-script)', color: 'var(--color-secondary)' }}>
                      {milestone.date}
                    </div>
                    <p className="font-body leading-relaxed" style={{ fontFamily: 'var(--font-body)', color: 'var(--color-text)' }}>
                      {milestone.description}
                    </p>
                  </div>

                  {/* Image */}
                  <div className={`w-full md:w-1/2 ${isEven ? 'md:pr-12' : 'md:pl-12'}`}>
                    <motion.div 
                      whileHover={{ scale: 1.015 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="relative rounded-sm overflow-hidden border border-[var(--color-secondary)]/30 shadow-md p-1 bg-white/50 aspect-video md:aspect-[4/3]"
                    >
                      {milestone.image && (
                        <div className="w-full h-full overflow-hidden rounded-none">
                          <img 
                            src={milestone.image} 
                            alt={milestone.title} 
                            loading="lazy"
                            className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                          />
                        </div>
                      )}
                    </motion.div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
