import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { Monogram } from '@/components/IndianMotifs';

export const Navigation: React.FC = () => {
  const { config } = useWedding();
  const { text, couple } = config;
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');

  const navLinks = [
    { name: text.navHome || 'Home', href: '#hero' },
    { name: text.navStory || 'Our Story', href: '#story' },
    { name: text.navEvents || 'Events', href: '#events' },
    { name: text.navGallery || 'Gallery', href: '#gallery' },
    { name: text.navVenue || 'Venue', href: '#venue' },
  ];

  const sectionIds = ['hero', 'story', 'events', 'gallery', 'venue'];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      // Simple intersection calculation
      let current = 'hero';
      for (const section of sectionIds) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section;
          }
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const targetId = href.substring(1);
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled 
            ? 'bg-wedding-ivory/95 backdrop-blur-md shadow-sm border-b border-wedding-gold/20 py-3' 
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 flex items-center justify-between">
          <div className="flex items-center">
            <a 
              href="#hero" 
              onClick={(e) => scrollToSection(e, '#hero')}
              className={`font-heading text-2xl font-bold transition-colors ${
                isScrolled ? 'text-wedding-primary' : 'text-wedding-primary md:text-white drop-shadow-md'
              }`}
            >
              {couple.coupleInitials || 'A & B'}
            </a>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => scrollToSection(e, link.href)}
                className={`text-xs uppercase tracking-widest font-bold transition-colors ${
                  activeSection === link.href.substring(1)
                    ? isScrolled ? 'text-wedding-accent' : 'text-wedding-gold'
                    : isScrolled ? 'text-wedding-text hover:text-wedding-primary' : 'text-white/90 hover:text-white drop-shadow'
                }`}
              >
                {link.name}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Toggle (accessible 44px touch target) */}
          <button
            className={`md:hidden min-w-[44px] min-h-[44px] flex items-center justify-center focus:outline-none rounded-lg active:scale-95 transition-transform ${
              isScrolled ? 'text-wedding-primary' : 'text-white drop-shadow-md'
            }`}
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay with Safe Area Inset Support */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: '-100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '-100%' }}
            transition={{ type: 'tween', duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-50 bg-wedding-ivory flex flex-col pt-safe pb-safe px-6 shadow-2xl"
            style={{
              paddingTop: 'max(1.5rem, env(safe-area-inset-top, 1.5rem))',
              paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))',
            }}
          >
            <div className="flex justify-between items-center py-4 border-b border-wedding-gold/25">
              <Monogram text={couple.coupleInitials || 'R & S'} size={44} />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center text-wedding-primary focus:outline-none hover:text-wedding-secondary transition-colors active:scale-90"
                aria-label="Close navigation menu"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <nav className="flex-1 flex flex-col items-center justify-center space-y-6 py-6">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`min-h-[48px] px-6 flex items-center justify-center text-xl sm:text-2xl font-heading uppercase tracking-widest active:scale-95 transition-all ${
                    activeSection === link.href.substring(1)
                      ? 'text-wedding-accent font-bold scale-105'
                      : 'text-wedding-primary hover:text-wedding-secondary'
                  }`}
                >
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="py-6 flex justify-center">
              <div className="w-1/3 border-t border-wedding-gold/30"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
