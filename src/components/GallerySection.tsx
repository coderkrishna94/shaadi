import React, { useState, useMemo } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { ScrollReveal } from '@/components/ScrollReveal';
import { OrnamentalDivider } from '@/components/IndianMotifs';
import { Lightbox } from '@/components/Lightbox';

export const GallerySection: React.FC = () => {
  const { config } = useWedding();
  const { text, gallery } = config;
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const sortedGallery = useMemo(() => {
    return [...gallery].sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [gallery]);

  const featuredImage = useMemo(() => {
    return sortedGallery.find((img) => img.featured);
  }, [sortedGallery]);

  const handleClose = () => setSelectedIndex(null);
  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === null ? null : (prev === 0 ? sortedGallery.length - 1 : prev - 1)));
  };
  const handleNext = () => {
    setSelectedIndex((prev) => (prev === null ? null : (prev === sortedGallery.length - 1 ? 0 : prev + 1)));
  };

  // Determine balanced, symmetrical grid columns based on gallery item count
  const gridLayoutClass = useMemo(() => {
    const count = sortedGallery.length;
    if (count <= 1) return 'grid-cols-1 max-w-md';
    if (count === 2) return 'grid-cols-1 sm:grid-cols-2 max-w-3xl';
    if (count === 3) return 'grid-cols-1 sm:grid-cols-3 max-w-5xl';
    if (count === 4) return 'grid-cols-2 lg:grid-cols-4 max-w-6xl';
    if (count === 6) return 'grid-cols-2 md:grid-cols-3 max-w-6xl';
    return 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 max-w-6xl';
  }, [sortedGallery.length]);

  return (
    <section id="gallery" className="section-padding bg-wedding-ivory text-wedding-burgundy">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-12">
            <h2 className="font-heading text-4xl md:text-5xl text-wedding-burgundy mb-2">
              {text.galleryTitle}
            </h2>
            <p className="font-script text-2xl text-wedding-accent mb-6">
              {text.gallerySubtitle}
            </p>
            <OrnamentalDivider />
          </div>
        </ScrollReveal>

        {featuredImage && (
          <ScrollReveal className="mb-12 max-w-6xl mx-auto">
            <div 
              className="w-full h-[50vh] md:h-[70vh] rounded-sm overflow-hidden shadow-2xl relative cursor-pointer group border border-[var(--color-secondary)]/40 p-1 bg-white/40"
              onClick={() => setSelectedIndex(sortedGallery.indexOf(featuredImage))}
            >
              <img
                src={featuredImage.src}
                alt={featuredImage.caption || "Featured gallery image"}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-6">
                {featuredImage.caption && (
                  <p className="font-heading text-xl text-white text-center">{featuredImage.caption}</p>
                )}
              </div>
            </div>
          </ScrollReveal>
        )}

        {/* Balanced Gap-Free Grid */}
        <div className={`grid ${gridLayoutClass} gap-4 md:gap-6 mx-auto`}>
          {sortedGallery.map((image, index) => (
            <ScrollReveal key={image.id || index} delay={index * 0.08} className="h-full">
              <div 
                className="gallery-card relative group cursor-pointer rounded-sm overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-[var(--color-secondary)]/30 aspect-[4/5] bg-white/40 p-1"
                onClick={() => setSelectedIndex(index)}
              >
                <img
                  src={image.src}
                  alt={image.caption || `Gallery image ${index + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-108"
                />
                
                {/* Luxury Vignette & Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                  {image.caption ? (
                    <p className="text-white font-heading text-base md:text-lg mb-2 drop-shadow-sm">
                      {image.caption}
                    </p>
                  ) : null}
                  <div className="flex items-center gap-2 text-wedding-gold text-xs uppercase tracking-widest font-body">
                    <span className="p-2 rounded-full bg-black/50 backdrop-blur-sm border border-wedding-gold/40">
                      <svg className="w-4 h-4 text-wedding-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                      </svg>
                    </span>
                    <span className="font-semibold">View</span>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>

      <Lightbox
        images={sortedGallery}
        selectedIndex={selectedIndex}
        onClose={handleClose}
        onPrev={handlePrev}
        onNext={handleNext}
      />
    </section>
  );
};

