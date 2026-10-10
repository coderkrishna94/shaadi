import React from 'react';
import { motion } from 'framer-motion';
import { useWedding } from '@/context/WeddingContext';
import { useReducedMotion } from '@/hooks/useMediaQuery';
import { Monogram } from './IndianMotifs';

export const HeroSection: React.FC = () => {
  const { config } = useWedding();
  const shouldReduceMotion = useReducedMotion();

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString ? (dateString.includes('T') ? dateString : dateString + 'T00:00:00') : '');
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-GB', {
          day: 'numeric',
          month: 'long',
          year: 'numeric'
        });
      }
    } catch {
      // Fallback
    }
    return dateString || '';
  };

  const scrollToEvents = () => {
    const element = document.getElementById('events');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.5,
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <section id="hero" className="relative w-full min-h-screen overflow-hidden bg-black text-white flex flex-col items-center justify-center">
      {/* Background Image with Ken Burns effect */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full"
          style={{ 
            backgroundImage: `url(${config.couple.couplePhoto})`,
            animation: shouldReduceMotion ? 'none' : 'kenBurns 20s infinite alternate linear',
            transformOrigin: 'center'
          }}
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      </div>

      {/* Content */}
      <motion.div 
        className="relative z-10 flex flex-col items-center justify-center w-full max-w-4xl px-4 sm:px-6 text-center mt-16 sm:mt-20 md:mt-0"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="mb-4 sm:mb-8 text-[var(--color-secondary)]">
          <Monogram text={config.couple.coupleInitials} size={56} />
        </motion.div>

        <motion.h2 
          variants={itemVariants} 
          className="font-script text-[clamp(1.15rem,3.5vw,2.2rem)] text-[var(--color-secondary)] mb-3 sm:mb-5 whitespace-pre-line leading-snug"
        >
          {config.text.heroTitle}
        </motion.h2>

        <motion.h1 
          variants={itemVariants} 
          className="font-heading text-[clamp(2.1rem,6.8vw,5.5rem)] tracking-wider mb-4 sm:mb-6 text-white drop-shadow-md gold-text-glow leading-tight px-2"
        >
          {config.couple.brideName} & {config.couple.groomName}
        </motion.h1>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 font-body uppercase tracking-[0.2em] text-[clamp(0.72rem,2.2vw,0.95rem)] text-gray-200 mb-6 sm:mb-10"
        >
          <span>{formatDate(config.wedding.date)}</span>
          <span className="hidden sm:inline text-[var(--color-secondary)]">•</span>
          <span>{config.wedding.city}</span>
        </motion.div>

        <motion.p 
          variants={itemVariants}
          className="font-body text-xs sm:text-base md:text-lg text-gray-300 max-w-xl whitespace-pre-line leading-relaxed mb-8 sm:mb-12 italic px-3 sm:px-4"
        >
          {config.wedding.invitationMessage}
        </motion.p>

        <motion.button
          variants={itemVariants}
          onClick={scrollToEvents}
          whileTap={{ scale: 0.96 }}
          className="min-h-[48px] px-8 py-3.5 bg-transparent border border-[var(--color-secondary)] text-[var(--color-secondary)] uppercase tracking-widest text-xs sm:text-sm hover:bg-[var(--color-secondary)] hover:text-black transition-all duration-300 backdrop-blur-sm active:scale-95 flex items-center justify-center cursor-pointer"
          style={{ boxShadow: '0 0 20px rgba(184, 155, 94, 0.15), 0 0 40px rgba(184, 155, 94, 0.05)' }}
          aria-label="View wedding events"
        >
          {config.text.ctaButton}
        </motion.button>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 z-10 flex flex-col items-center cursor-pointer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        onClick={() => {
          window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
        }}
      >
        <span className="font-body text-xs uppercase tracking-widest text-gray-400 mb-2">
          {config.text.scrollIndicator}
        </span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="text-[var(--color-secondary)]"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V20M12 20L5 13M12 20L19 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.div>
      </motion.div>
    </section>
  );
};
