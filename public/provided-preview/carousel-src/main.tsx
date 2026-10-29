import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import CircularCarousel from './CircularCarousel';

// Globals defined by ../script.js (a classic script, loaded before this bundle).
declare const TEST_DATA: unknown[];
declare const userResponses: unknown[];
const site = window as unknown as Record<string, (...args: unknown[]) => void>;

// One card per page. Clicking the centered card opens its page.
const pages = [
  {
    src: 'images/panda.jpg', alt: 'Take the quiz', title: 'Take the Quiz', subtitle: '15 rounds, human or AI?',
    open: () => site.startTest()
  },
  {
    src: 'images/florida-lake.jpg', alt: 'Image archive', title: 'Image Archive', subtitle: 'Browse every image',
    open: () => site.navigateTo('archive')
  },
  {
    src: 'images/human-oil-painting.jpg', alt: 'Your results', title: 'Results', subtitle: 'See how you scored',
    open: () => {
      // Results only exist after a finished test; otherwise start one.
      const done = typeof userResponses !== 'undefined' && userResponses.filter(Boolean).length === TEST_DATA.length;
      if (done) site.navigateTo('results'); else site.startTest();
    }
  },
  {
    src: 'images/human-portrait.jpg', alt: 'About the experiment', title: 'About', subtitle: 'About the experiment',
    open: () => site.navigateTo('about')
  },
  {
    src: 'images/lions.jpg', alt: 'Contact page', title: 'Contact', subtitle: 'Send feedback or say hi',
    open: () => site.navigateTo('contact')
  }
];

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

// Size and space the 5 cards from the screen width: big cards, tight spacing, ~9% breathing room at each edge.
// (The orbit preset multiplies card spacing by 1.45, hence the small radius factor.)
function sizing(width: number) {
  const cardWidth = clamp(Math.round(width * 0.2), 104, 440);
  const radius = width * (width < 600 ? 0.22 : 0.28);
  const pitch = (2 * Math.PI * radius) / pages.length;
  return {
    cardWidth,
    gap: Math.max(8, Math.round(pitch - cardWidth)),
    perspective: clamp(Math.round(width * 1.1), 800, 2000)
  };
}

function PageCarousel() {
  const [width, setWidth] = useState(window.innerWidth);
  const active = useRef(0);

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const { cardWidth, gap, perspective } = sizing(width);

  return (
    <CircularCarousel
      items={pages}
      preset="orbit"
      intro="spin"
      cardWidth={cardWidth}
      aspectRatio={1}
      speed={8}
      captions
      gap={gap}
      tilt={-8}
      perspective={perspective}
      momentum={0.47}
      parallax={0.61}
      cornerRadius={20}
      fadeColor="#F5F4EF"
      onChange={(i) => { active.current = i; }}
      onItemClick={(_item, i) => {
        // A side card just rotates to the front (the component does that); the front card opens its page.
        if (i === active.current) pages[i].open();
      }}
    />
  );
}

const mount = document.getElementById('home-carousel');
if (mount) createRoot(mount).render(<PageCarousel />);
