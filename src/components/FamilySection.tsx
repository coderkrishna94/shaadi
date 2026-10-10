import React from 'react';
import { useWedding } from '@/context/WeddingContext';
import { ScrollReveal } from '@/components/ScrollReveal';
import { OrnamentalDivider } from '@/components/IndianMotifs';

export const FamilySection: React.FC = () => {
  const { config } = useWedding();
  const { text, family } = config;

  const renderFamilyMember = (member: any, index: number) => {
    return (
      <div key={index} className="flex flex-col items-center text-center group">
        <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-wedding-gold shadow-lg overflow-hidden mb-4 relative bg-wedding-ivory flex items-center justify-center">
          {member.photo ? (
            <img 
              src={member.photo} 
              alt={member.name}
              loading="lazy"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <span className="font-heading text-4xl text-wedding-burgundy/50">
              {member?.name ? member.name.charAt(0) : '✦'}
            </span>
          )}
        </div>
        <h4 className="font-heading text-xl sm:text-2xl text-wedding-burgundy mb-1 break-words px-2 max-w-xs leading-snug">
          {member.name}
        </h4>
        <p className="font-script text-lg sm:text-xl italic text-wedding-accent">
          {member.relation || member.title}
        </p>
      </div>
    );
  };

  return (
    <section id="family" className="section-padding bg-wedding-ivory">
      <div className="container mx-auto px-4">
        <ScrollReveal>
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl md:text-5xl text-wedding-burgundy mb-2">
              {text.familyTitle}
            </h2>
            <p className="font-script text-2xl text-wedding-accent mb-6">
              {text.familySubtitle}
            </p>
            <OrnamentalDivider />
          </div>
        </ScrollReveal>

        <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 justify-between max-w-6xl mx-auto">
          {/* Bride's Family */}
          <div className="flex-1">
            <ScrollReveal direction="left">
              <h3 className="font-heading text-3xl text-center text-wedding-burgundy mb-10 pb-4 border-b-2 border-wedding-gold/30">
                {family.brideFamilyTitle || "Bride's Family"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {family.brideFamily?.map((member, idx) => renderFamilyMember(member, idx))}
              </div>
            </ScrollReveal>
          </div>

          {/* Divider on desktop, decorative element on mobile */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="h-full w-px bg-wedding-gold/30 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-wedding-gold text-2xl">
                ✦
              </div>
            </div>
          </div>
          <div className="lg:hidden flex justify-center py-4">
            <OrnamentalDivider />
          </div>

          {/* Groom's Family */}
          <div className="flex-1">
            <ScrollReveal direction="right">
              <h3 className="font-heading text-3xl text-center text-wedding-burgundy mb-10 pb-4 border-b-2 border-wedding-gold/30">
                {family.groomFamilyTitle || "Groom's Family"}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {family.groomFamily?.map((member, idx) => renderFamilyMember(member, idx))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};
