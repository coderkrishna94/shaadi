// ============================================================
// CENTRALIZED WEDDING DATA MODEL
// All website content flows from this single configuration.
// Edit defaults here or use the Editor UI at /editor.
// ============================================================
import savedConfigFile from './savedConfig.json';

export interface CoupleData {
  brideName: string;
  groomName: string;
  brideNickname: string;
  groomNickname: string;
  coupleInitials: string;
  monogram: string;
  couplePhoto: string;
  shortIntro: string;
  loveStory: string;
}

export interface WeddingData {
  date: string; // ISO date string
  time: string; // e.g., "11:00 AM"
  city: string;
  invitationMessage: string;
}

export interface WeddingEvent {
  id: string;
  name: string;
  date: string;
  time: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  description: string;
  dressCode: string;
  image: string;
  icon: string;
  googleMapsUrl: string;
  color: string;
}

export interface StoryMilestone {
  id: string;
  title: string;
  date: string;
  description: string;
  image: string;
}

export interface GalleryImage {
  id: string;
  src: string;
  caption: string;
  featured: boolean;
  order: number;
}

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  photo: string;
}

export interface FamilyData {
  sectionTitle: string;
  sectionSubtitle: string;
  brideFamilyTitle: string;
  groomFamilyTitle: string;
  brideFamily: FamilyMember[];
  groomFamily: FamilyMember[];
}

export interface RSVPConfig {
  enabled: boolean;
  title: string;
  subtitle: string;
  successMessage: string;
  fields: {
    name: boolean;
    email: boolean;
    phone: boolean;
    guests: boolean;
    attendance: boolean;
    eventSelection: boolean;
    foodPreference: boolean;
    message: boolean;
  };
  foodOptions: string[];
}

export interface MusicConfig {
  enabled: boolean;
  src: string;
  title: string;
  autoplay: boolean;
  volume?: number;
  ganeshAudioEnabled?: boolean;
  ganeshAudioSrc?: string;
  ganeshAudioTitle?: string;
  ganeshAudioVolume?: number;
  ganeshAudioType?: string;
}

export interface ThemeConfig {
  preset: 'royal-burgundy' | 'emerald-garden' | 'midnight-romance' | 'custom';
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  headingFont: string;
  bodyFont: string;
  scriptFont: string;
  borderRadius: string;
  animationIntensity: 'none' | 'subtle' | 'moderate' | 'full';
}

export interface SEOConfig {
  pageTitle: string;
  metaDescription: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  favicon: string;
  coupleSlug: string;
}

export interface TextContent {
  heroTitle: string;
  heroSubtitle: string;
  countdownTitle: string;
  countdownComplete: string;
  storyTitle: string;
  storySubtitle: string;
  eventsTitle: string;
  eventsSubtitle: string;
  venueTitle: string;
  venueSubtitle: string;
  galleryTitle: string;
  gallerySubtitle: string;
  familyTitle: string;
  familySubtitle: string;
  rsvpTitle: string;
  rsvpSubtitle: string;
  rsvpButton: string;
  footerMessage: string;
  footerCredit: string;
  navHome: string;
  navStory: string;
  navEvents: string;
  navGallery: string;
  navVenue: string;
  navRsvp: string;
  ctaButton: string;
  scrollIndicator: string;
}

export interface VenueData {
  name: string;
  address: string;
  city: string;
  description: string;
  image: string;
  googleMapsUrl: string;
}

export interface ScratchCardConfig {
  enabled: boolean;
  date?: string;
  teaserTitle: string;
  scratchText: string;
  celebrationTitle: string;
  celebrationMessage: string;
  scratchAudioEnabled?: boolean;
  scratchAudioSound?: string;
  scratchAudioVolume?: number;
  celebrationMusicEnabled?: boolean;
  celebrationMusicSrc?: string;
  celebrationMusicTitle?: string;
  celebrationMusicVolume?: number;
  scratchThreshold: number;
  colors: {
    card: string;
    gold: string;
    text: string;
    scratchSurface: string;
    blush: string;
    celebration: string;
  };
  animation: {
    duration: number;
    particles: boolean;
    petals: boolean;
  };
  brushSize: number;
  fallbackButtonText: string;
}

export interface WeddingConfig {
  couple: CoupleData;
  wedding: WeddingData;
  events: WeddingEvent[];
  story: StoryMilestone[];
  gallery: GalleryImage[];
  family: FamilyData;
  venue: VenueData;
  rsvp: RSVPConfig;
  music: MusicConfig;
  theme: ThemeConfig;
  seo: SEOConfig;
  text: TextContent;
  scratchCard?: ScratchCardConfig;
}

// ============================================================
// DEMO CONTENT — Replace via Editor or by editing below
// ============================================================

const DEMO_COUPLE_PHOTO = 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=1200&q=80';
const DEMO_VENUE_PHOTO = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&q=80';
const DEMO_STORY_1 = 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&q=80';
const DEMO_STORY_2 = 'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=800&q=80';
const DEMO_STORY_3 = 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80';
const DEMO_STORY_4 = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80';

const DEMO_GALLERY = [
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&q=80',
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
  'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=600&q=80',
  'https://images.unsplash.com/photo-1529634597503-139d3726fed5?w=600&q=80',
  'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=600&q=80',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&q=80',
  'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=600&q=80',
  'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80',
];

const baseDemoConfig: WeddingConfig = {
  couple: {
    brideName: 'Simran',
    groomName: 'Rishabh',
    brideNickname: 'Simran',
    groomNickname: 'Rishabh',
    coupleInitials: 'R & S',
    monogram: 'R❤S',
    couplePhoto: DEMO_COUPLE_PHOTO,
    shortIntro: 'Two souls, one beautiful journey',
    loveStory: 'From shared dreams under starlit skies to endless conversations — Rishabh and Simran\'s love story is written in laughter, warmth, and beautiful memories.',
  },

  wedding: {
    date: '2026-10-14',
    time: '7:00 PM',
    city: 'Udaipur',
    invitationMessage: 'Together with their families,\nthey invite you to celebrate their wedding.',
  },

  events: [
    {
      id: 'evt-1',
      name: 'Mehendi',
      date: '2026-10-12',
      time: '4:00 PM',
      endTime: '8:00 PM',
      venueName: 'The Garden Pavilion',
      venueAddress: 'Lake Palace Road, Udaipur, Rajasthan',
      description: 'An afternoon of intricate henna artistry, vibrant colors, and joyful celebrations as we begin the wedding festivities.',
      dressCode: 'Festive Indian — Greens & Yellows',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80',
      icon: '🌿',
      googleMapsUrl: 'https://maps.google.com',
      color: '#23483E',
    },
    {
      id: 'evt-2',
      name: 'Sangeet',
      date: '2026-10-13',
      time: '7:00 PM',
      endTime: '11:30 PM',
      venueName: 'The Grand Ballroom',
      venueAddress: 'City Palace Complex, Udaipur, Rajasthan',
      description: 'A magical evening of music, dance, and performances. Come ready to celebrate love through song and rhythm.',
      dressCode: 'Glamorous Indian — Jewel Tones',
      image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=600&q=80',
      icon: '🎶',
      googleMapsUrl: 'https://maps.google.com',
      color: '#641F2D',
    },
    {
      id: 'evt-3',
      name: 'Wedding Ceremony',
      date: '2026-10-14',
      time: '7:00 PM',
      endTime: '11:00 PM',
      venueName: 'The Royal Courtyard',
      venueAddress: 'Jagmandir Island Palace, Udaipur, Rajasthan',
      description: 'Under a canopy of flowers and the glow of a thousand diyas, Rishabh and Simran will begin their forever.',
      dressCode: 'Traditional Indian — Red & Gold',
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&q=80',
      icon: '💍',
      googleMapsUrl: 'https://maps.google.com',
      color: '#B89B5E',
    },
    {
      id: 'evt-4',
      name: 'Reception',
      date: '2026-10-15',
      time: '7:00 PM',
      endTime: '12:00 AM',
      venueName: 'The Lakeside Terrace',
      venueAddress: 'Oberoi Udaivilas, Udaipur, Rajasthan',
      description: 'An enchanting evening of dining, dancing, and toasts as we celebrate the newly married couple.',
      dressCode: 'Black Tie — Evening Wear',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=600&q=80',
      icon: '🥂',
      googleMapsUrl: 'https://maps.google.com',
      color: '#252322',
    },
  ],

  story: [
    {
      id: 'st-1',
      title: 'Where It All Began',
      date: 'March 2022',
      description: 'A monsoon evening in Mumbai, a friend\'s rooftop gathering, and two strangers who couldn\'t stop talking. Simran\'s laughter and Rishabh\'s stories turned a chance meeting into something beautiful.',
      image: DEMO_STORY_1,
    },
    {
      id: 'st-2',
      title: 'Our First Adventure',
      date: 'August 2022',
      description: 'A spontaneous road trip to Goa sealed the deal. Between sunsets, street food, and long drives, they discovered they were made for each other.',
      image: DEMO_STORY_2,
    },
    {
      id: 'st-3',
      title: 'The Proposal',
      date: 'December 2025',
      description: 'On a quiet winter evening at their favorite café in Jaipur, Rishabh got down on one knee. Through happy tears, Simran said yes — and the rest is history being written.',
      image: DEMO_STORY_3,
    },
    {
      id: 'st-4',
      title: 'Forever Starts Here',
      date: 'October 2026',
      description: 'Now, surrounded by everyone they love, they are ready to begin their greatest adventure yet — a lifetime together.',
      image: DEMO_STORY_4,
    },
  ],

  gallery: DEMO_GALLERY.map((src, i) => ({
    id: `gal-${i + 1}`,
    src,
    caption: '',
    featured: i === 0,
    order: i,
  })),

  family: {
    sectionTitle: 'Our Families',
    sectionSubtitle: 'With the blessings of',
    brideFamilyTitle: 'Bride\'s Family',
    groomFamilyTitle: 'Groom\'s Family',
    brideFamily: [
      { id: 'bf-1', name: 'Mr. Rajesh & Mrs. Sunita Sharma', relationship: 'Parents of the Bride', photo: '' },
      { id: 'bf-2', name: 'Mr. Vikram & Mrs. Anita Sharma', relationship: 'Grandparents of the Bride', photo: '' },
    ],
    groomFamily: [
      { id: 'gf-1', name: 'Mr. Suresh & Mrs. Kavita Kapoor', relationship: 'Parents of the Groom', photo: '' },
      { id: 'gf-2', name: 'Mr. Ramesh & Mrs. Priya Kapoor', relationship: 'Grandparents of the Groom', photo: '' },
    ],
  },

  venue: {
    name: 'Jagmandir Island Palace',
    address: 'Jagmandir Island, Pichola Lake, Udaipur, Rajasthan 313001',
    city: 'Udaipur',
    description: 'Rising majestically from the waters of Lake Pichola, Jagmandir Island Palace offers an enchanting setting where centuries of royal heritage meet the magic of new beginnings.',
    image: DEMO_VENUE_PHOTO,
    googleMapsUrl: 'https://maps.google.com/?q=Jagmandir+Island+Palace+Udaipur',
  },

  rsvp: {
    enabled: false,
    title: 'RSVP',
    subtitle: 'We would be honored by your presence',
    successMessage: 'Thank you for your response! We look forward to celebrating with you.',
    fields: {
      name: true,
      email: true,
      phone: true,
      guests: true,
      attendance: true,
      eventSelection: true,
      foodPreference: true,
      message: true,
    },
    foodOptions: ['Vegetarian', 'Non-Vegetarian', 'Vegan', 'Jain', 'No Preference'],
  },

  music: {
    enabled: true,
    src: '/wedding-melody.wav',
    title: 'Royal Indian Wedding Melody',
    autoplay: true,
    volume: 75,
    ganeshAudioEnabled: true,
    ganeshAudioSrc: '',
    ganeshAudioTitle: 'Vedic Temple Bell & Sacred Meditative Chant (528Hz)',
    ganeshAudioVolume: 80,
    ganeshAudioType: 'synthetic-bell',
  },

  theme: {
    preset: 'royal-burgundy',
    primaryColor: '#641F2D',
    secondaryColor: '#B89B5E',
    accentColor: '#23483E',
    backgroundColor: '#F7F1E7',
    textColor: '#252322',
    headingFont: "'Playfair Display', serif",
    bodyFont: "'Inter', sans-serif",
    scriptFont: "'Cormorant Garamond', serif",
    borderRadius: '4px',
    animationIntensity: 'moderate',
  },

  seo: {
    pageTitle: 'Rishabh & Simran — Wedding Invitation',
    metaDescription: 'You are cordially invited to celebrate the wedding of Rishabh & Simran.',
    ogTitle: 'Rishabh & Simran — Wedding Invitation',
    ogDescription: 'Together with their families, they invite you to celebrate their wedding.',
    ogImage: DEMO_COUPLE_PHOTO,
    favicon: '/favicon.svg',
    coupleSlug: 'rishabh-weds-simran',
  },

  text: {
    heroTitle: 'Two hearts.\nOne beautiful beginning.',
    heroSubtitle: 'We\'re getting married',
    countdownTitle: 'Counting Down To Forever',
    countdownComplete: 'The celebration has begun ✨',
    storyTitle: 'Our Story',
    storySubtitle: 'How it all began',
    eventsTitle: 'Wedding Events',
    eventsSubtitle: 'Join us in celebrating',
    venueTitle: 'The Venue',
    venueSubtitle: 'Where dreams come true',
    galleryTitle: 'Our Gallery',
    gallerySubtitle: 'Moments we treasure',
    familyTitle: 'Our Families',
    familySubtitle: 'With the blessings of',
    rsvpTitle: 'RSVP',
    rsvpSubtitle: 'We would be honored by your presence',
    rsvpButton: 'Send RSVP',
    footerMessage: 'With love, Rishabh & Simran',
    footerCredit: 'Made with ❤️ by Hritik and Krishna',
    navHome: 'Home',
    navStory: 'Our Story',
    navEvents: 'Events',
    navGallery: 'Gallery',
    navVenue: 'Venue',
    navRsvp: 'RSVP',
    ctaButton: 'You\'re Invited',
    scrollIndicator: 'Scroll to explore',
  },

  scratchCard: {
    enabled: true,
    date: '',
    teaserTitle: 'A little secret awaits…',
    scratchText: 'Scratch to reveal our special date',
    celebrationTitle: "We're Getting Married!",
    celebrationMessage: "We can't wait to celebrate this beautiful day with you.",
    scratchAudioEnabled: false,
    scratchAudioSound: 'foil-scratch',
    scratchAudioVolume: 35,
    celebrationMusicEnabled: true,
    celebrationMusicSrc: '/uploads/Y2Mate.is_-_Shubhaarambh_Full_Video_-_Kai_Po_Che___Sushant_Singh_Rajput___Rajkummar_Rao___Amit_Sadh___Amit_T.mp3',
    celebrationMusicTitle: 'Shubhaarambh — Kai Po Che',
    celebrationMusicVolume: 80,
    scratchThreshold: 55,
    colors: {
      card: '#F8F3EA',
      gold: '#C9A45C',
      text: '#3E352D',
      scratchSurface: '#D8C29A',
      blush: '#F5E6E0',
      celebration: '#FFFCF5',
    },
    animation: {
      duration: 900,
      particles: true,
      petals: true,
    },
    brushSize: 36,
    fallbackButtonText: 'Reveal Date',
  },
};

import { weddingData } from './wedding-data';

export { weddingData };

const saved = (savedConfigFile || {}) as Partial<WeddingConfig>;

export const defaultConfig: WeddingConfig = {
  ...baseDemoConfig,
  ...weddingData,
  ...saved,
  couple: { ...baseDemoConfig.couple, ...weddingData.couple, ...(saved.couple || {}) },
  wedding: { ...baseDemoConfig.wedding, ...weddingData.wedding, ...(saved.wedding || {}) },
  events: (saved.events && saved.events.length > 0) ? saved.events : (weddingData.events && weddingData.events.length > 0 ? weddingData.events : baseDemoConfig.events),
  story: (saved.story && saved.story.length > 0) ? saved.story : (weddingData.story && weddingData.story.length > 0 ? weddingData.story : baseDemoConfig.story),
  gallery: (saved.gallery && saved.gallery.length > 0) ? saved.gallery : (weddingData.gallery && weddingData.gallery.length > 0 ? weddingData.gallery : baseDemoConfig.gallery),
  family: { ...baseDemoConfig.family, ...weddingData.family, ...(saved.family || {}) },
  venue: { ...baseDemoConfig.venue, ...weddingData.venue, ...(saved.venue || {}) },
  rsvp: { ...baseDemoConfig.rsvp, ...weddingData.rsvp, ...(saved.rsvp || {}) },
  music: { ...baseDemoConfig.music, ...weddingData.music, ...(saved.music || {}) },
  theme: { ...baseDemoConfig.theme, ...weddingData.theme, ...(saved.theme || {}) },
  seo: { ...baseDemoConfig.seo, ...weddingData.seo, ...(saved.seo || {}) },
  text: { ...baseDemoConfig.text, ...weddingData.text, ...(saved.text || {}) },
  scratchCard: (weddingData.scratchCard || baseDemoConfig.scratchCard)
    ? ({ ...baseDemoConfig.scratchCard, ...weddingData.scratchCard, ...(saved.scratchCard || {}) } as ScratchCardConfig)
    : undefined,
};

// ============================================================
// Helper to generate unique IDs
// ============================================================
export function generateId(): string {
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
