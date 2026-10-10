import React, { useState } from 'react';
import { useWedding } from '@/context/WeddingContext';
import { OpeningAnimation } from '@/components/OpeningAnimation';
import { Navigation } from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import CountdownSection from '@/components/CountdownSection';
import StorySection from '@/components/StorySection';
import EventsSection from '@/components/EventsSection';
import { VenueSection } from '@/components/VenueSection';
import { GallerySection } from '@/components/GallerySection';
import { FamilySection } from '@/components/FamilySection';
import { MusicPlayer } from '@/components/MusicPlayer';
import { Footer } from '@/components/Footer';
import ScratchRevealCard from '@/components/ScratchRevealCard';
import { FloralBorder } from '@/components/IndianMotifs';

export default function InvitationPage() {
  const { config } = useWedding();
  const [introComplete, setIntroComplete] = useState(false);

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: config.theme.backgroundColor,
        color: config.theme.textColor,
        fontFamily: config.theme.bodyFont,
      }}
    >
      {!introComplete && (
        <OpeningAnimation onComplete={() => setIntroComplete(true)} />
      )}
      <Navigation />
      <main>
        <HeroSection />
        <ScratchRevealCard />
        <FloralBorder className="opacity-30 my-2 max-w-4xl mx-auto" />
        <CountdownSection />
        <FloralBorder className="opacity-30 my-2 max-w-4xl mx-auto" />
        <StorySection />
        <FloralBorder className="opacity-30 my-2 max-w-4xl mx-auto" />
        <EventsSection />
        <FloralBorder className="opacity-30 my-2 max-w-4xl mx-auto" />
        <VenueSection />
        <FloralBorder className="opacity-30 my-2 max-w-4xl mx-auto" />
        <GallerySection />
        <FloralBorder className="opacity-30 my-2 max-w-4xl mx-auto" />
        <FamilySection />
      </main>
      <Footer />
      <MusicPlayer />
    </div>
  );
}
