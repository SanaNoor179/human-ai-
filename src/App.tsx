/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import CircularCarousel from './components/CircularCarousel';
import CircularGallery from './CircularGallery';
import BlurText from './components/BlurText';
import InfiniteSpiral from './InfiniteSpiral';
import { 
  TEST_DATA, 
  INFLUENCE_FACTORS, 
  CAROUSEL_DESTINATIONS,
  type QuizItem 
} from './data/quizData';
import { 
  Eye, 
  Maximize2, 
  X, 
  ArrowRight, 
  ArrowLeft, 
  RotateCcw, 
  Sparkles, 
  Compass, 
  Layers, 
  CheckCircle2, 
  XCircle, 
  Send,
  HelpCircle,
  BarChart3,
  Image as ImageIcon,
  BookOpen,
  Share2,
  Menu
} from 'lucide-react';

interface UserResponse {
  round: number;
  difficulty: string;
  guess: 'HUMAN' | 'AI' | null;
  actual: 'HUMAN' | 'AI';
  isCorrect: boolean;
  factors: string[];
}

const spiralImages = [
  { src: '/images/landscape-1.jpg', alt: 'Mountain lake' },
  { src: '/images/landscape-2.jpg', alt: 'Forest path' },
  { src: '/images/landscape-3.jpg', alt: 'Rocky summit' },
  { src: '/images/landscape-4.jpg', alt: 'Ocean shore' },
  { src: '/images/landscape-5.jpg', alt: 'Green meadow' },
  { src: '/images/landscape-6.jpg', alt: 'Desert light' }
];

export default function App() {
  // Navigation
  const [currentPage, setCurrentPage] = useState<'home' | 'quiz' | 'archive' | 'results' | 'about' | 'contact'>('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Carousel state
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const carouselActiveRef = useRef(0);
  const [carouselWidth, setCarouselWidth] = useState(1200);

  // Quiz state
  const [currentRoundIndex, setCurrentRoundIndex] = useState(0);
  const [userResponses, setUserResponses] = useState<UserResponse[]>([]);
  const [currentGuess, setCurrentGuess] = useState<'HUMAN' | 'AI' | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [selectedFactors, setSelectedFactors] = useState<string[]>([]);
  const [quizSlideState, setQuizSlideState] = useState<'idle' | 'slide-out' | 'slide-in'>('idle');


  // Fullscreen viewer modal
  const [fullscreenImage, setFullscreenImage] = useState<{ src: string; title: string; subtitle?: string } | null>(null);

  // Contact form state
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });

  // Share feedback toast
  const [copiedToast, setCopiedToast] = useState(false);

  // Window resize handler for carousel sizing
  useEffect(() => {
    const handleResize = () => setCarouselWidth(window.innerWidth);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation for fullscreen modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreenImage(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleAnimationComplete = () => {
    console.log('Animation completed!');
  };

  // Sync URL hash with current page for direct Figma / browser linking
  useEffect(() => {
    const syncFromUrl = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      const params = new URLSearchParams(window.location.search);
      const pageParam = params.get('page')?.toLowerCase();
      const target = hash || pageParam;
      if (target && ['home', 'quiz', 'archive', 'results', 'about', 'contact'].includes(target)) {
        setCurrentPage(target as any);
      }
    };
    syncFromUrl();
    window.addEventListener('hashchange', syncFromUrl);
    window.addEventListener('popstate', syncFromUrl);
    return () => {
      window.removeEventListener('hashchange', syncFromUrl);
      window.removeEventListener('popstate', syncFromUrl);
    };
  }, []);

  // Scroll to top on page transition
  const navigateTo = (page: 'home' | 'quiz' | 'archive' | 'results' | 'about' | 'contact') => {
    setCurrentPage(page);
    window.location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startTest = () => {
    setCurrentRoundIndex(0);
    setUserResponses([]);
    setCurrentGuess(null);
    setIsRevealed(false);
    setSelectedFactors([]);
    navigateTo('quiz');
  };

  // Submit guess on quiz round
  const handleGuess = (guess: 'HUMAN' | 'AI') => {
    const roundData = TEST_DATA[currentRoundIndex];
    const isCorrect = guess === roundData.actualOrigin;
    setCurrentGuess(guess);
    setIsRevealed(true);
    setSelectedFactors([]);

    const newResponse: UserResponse = {
      round: roundData.round,
      difficulty: roundData.difficulty,
      guess,
      actual: roundData.actualOrigin,
      isCorrect,
      factors: []
    };

    const updated = [...userResponses];
    updated[currentRoundIndex] = newResponse;
    setUserResponses(updated);
  };

  const toggleFactor = (factor: string) => {
    const updated = selectedFactors.includes(factor)
      ? selectedFactors.filter(f => f !== factor)
      : [...selectedFactors, factor];
    setSelectedFactors(updated);

    if (userResponses[currentRoundIndex]) {
      const copy = [...userResponses];
      copy[currentRoundIndex].factors = updated;
      setUserResponses(copy);
    }
  };

  const handleNextRound = () => {
    if (quizSlideState === 'slide-out') return;
    if (currentRoundIndex < TEST_DATA.length - 1) {
      setQuizSlideState('slide-out');
      setTimeout(() => {
        setCurrentRoundIndex(prev => prev + 1);
        setCurrentGuess(null);
        setIsRevealed(false);
        setSelectedFactors([]);
        setQuizSlideState('slide-in');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => {
          setQuizSlideState('idle');
        }, 340);
      }, 240);
    } else {
      navigateTo('results');
    }
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    setContactForm({ name: '', email: '', subject: 'General Inquiry', message: '' });
    setTimeout(() => setContactSubmitted(false), 5000);
  };

  const shareResults = () => {
    const correctCount = userResponses.filter(r => r.isCorrect).length;
    const shareText = `I scored ${correctCount}/${TEST_DATA.length} on the "Human or AI?" Visual Experiment! Can you tell who made it? Test your perception here.`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedToast(true);
      setTimeout(() => setCopiedToast(false), 3000);
    }
  };

  // Carousel card click handler
  const handleCarouselItemClick = (_item: unknown, index: number) => {
    // If clicking active center card, navigate immediately
    const dest = CAROUSEL_DESTINATIONS[index];
    if (dest) {
      if (dest.page === 'quiz') startTest();
      else navigateTo(dest.page);
    }
  };

  // Carousel card width calculation
  const getCarouselDimensions = (w: number) => {
    const isMobile = w < 640;
    const isTablet = w < 1024;
    // On mobile, card is zoomed in (~78% of screen) so the active card is large, legible, and prominent with cards in the back
    const cardWidth = isMobile ? Math.min(310, Math.round(w * 0.78)) : isTablet ? 330 : 380;
    const radius = w * (isMobile ? 0.44 : isTablet ? 0.30 : 0.28);
    const pitch = (2 * Math.PI * radius) / CAROUSEL_DESTINATIONS.length;
    const gap = Math.max(16, Math.round(pitch - cardWidth));
    const perspective = Math.min(2200, Math.max(1000, Math.round(w * 1.15)));
    return { cardWidth, gap, perspective };
  };

  const { cardWidth, gap, perspective } = getCarouselDimensions(carouselWidth);
  const currentDestination = CAROUSEL_DESTINATIONS[activeCarouselIndex] || CAROUSEL_DESTINATIONS[0];

  // Results analytics calculations
  const totalCompleted = userResponses.filter(Boolean).length;
  const correctCount = userResponses.filter(r => r && r.isCorrect).length;
  const scorePercent = totalCompleted > 0 ? Math.round((correctCount / totalCompleted) * 100) : 0;

  // Breakdown by tier
  const tiers = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'] as const;
  const tierStats = tiers.map(tier => {
    const roundsInTier = TEST_DATA.filter(t => t.difficulty === tier);
    const userAnswersInTier = userResponses.filter(r => r && r.difficulty === tier);
    const correctInTier = userAnswersInTier.filter(r => r.isCorrect).length;
    const pct = roundsInTier.length > 0 ? Math.round((correctInTier / roundsInTier.length) * 100) : 0;
    return { tier, total: roundsInTier.length, correct: correctInTier, pct };
  });

  // Breakdown by origin
  const humanRounds = TEST_DATA.filter(t => t.actualOrigin === 'HUMAN');
  const aiRounds = TEST_DATA.filter(t => t.actualOrigin === 'AI');
  const humanCorrect = userResponses.filter(r => r && r.actual === 'HUMAN' && r.isCorrect).length;
  const aiCorrect = userResponses.filter(r => r && r.actual === 'AI' && r.isCorrect).length;
  const humanAccuracy = humanRounds.length > 0 ? Math.round((humanCorrect / humanRounds.length) * 100) : 0;
  const aiAccuracy = aiRounds.length > 0 ? Math.round((aiCorrect / aiRounds.length) * 100) : 0;

  // Factor breakdown
  const factorCounts: Record<string, number> = {};
  INFLUENCE_FACTORS.forEach(f => { factorCounts[f] = 0; });
  userResponses.forEach(r => {
    if (r && r.factors) {
      r.factors.forEach(f => {
        factorCounts[f] = (factorCounts[f] || 0) + 1;
      });
    }
  });

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-[#2A4365] selection:text-white bg-[#F5F4EF] text-[#111111]">
      
      {/* ==================== GLOBAL NAVIGATION HEADER ==================== */}
      <header className="sticky top-0 z-40 bg-[#F5F4EF]/90 border-b border-[#D9D9D4] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              navigateTo('home');
            }} 
            className="flex items-center gap-2 font-bold tracking-wider text-sm uppercase text-[#111111] hover:opacity-70 transition cursor-pointer"
          >
            <span>HUMAN <span className="font-serif italic text-[#777777] font-normal">OR</span> AI?</span>
          </button>
          
          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6 text-xs font-medium tracking-widest uppercase">
            <button 
              onClick={startTest} 
              className={`transition cursor-pointer px-3 py-1.5 rounded-full ${currentPage === 'quiz' ? 'bg-[#111111] text-[#F5F4EF]' : 'text-[#777777] hover:text-[#111111]'}`}
            >
              The Test
            </button>
            <button 
              onClick={() => navigateTo('archive')} 
              className={`transition cursor-pointer px-3 py-1.5 rounded-full ${currentPage === 'archive' ? 'bg-[#111111] text-[#F5F4EF]' : 'text-[#777777] hover:text-[#111111]'}`}
            >
              Library
            </button>
            <button 
              onClick={() => navigateTo('about')} 
              className={`transition cursor-pointer px-3 py-1.5 rounded-full ${currentPage === 'about' ? 'bg-[#111111] text-[#F5F4EF]' : 'text-[#777777] hover:text-[#111111]'}`}
            >
              About Me
            </button>
            <button 
              onClick={() => navigateTo('contact')} 
              className={`transition cursor-pointer px-3 py-1.5 rounded-full ${currentPage === 'contact' ? 'bg-[#111111] text-[#F5F4EF]' : 'text-[#777777] hover:text-[#111111]'}`}
            >
              Contact
            </button>
          </nav>

          {/* Mobile Simple Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D9D9D4] text-xs font-medium uppercase tracking-wider text-[#111111] hover:bg-black/5 transition cursor-pointer"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-3.5 h-3.5" /> : <Menu className="w-3.5 h-3.5" />}
              <span>Menu</span>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#F5F4EF] border-b border-[#D9D9D4] px-6 py-4 space-y-2 animate-fadeIn shadow-sm">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('home');
              }}
              className="block w-full text-left py-2 text-xs font-semibold tracking-widest uppercase text-[#111111] hover:text-[#2A4365]"
            >
              Home
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                startTest();
              }}
              className="block w-full text-left py-2 text-xs font-semibold tracking-widest uppercase text-[#111111] hover:text-[#2A4365]"
            >
              The Test (15-Round Quiz)
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('archive');
              }}
              className="block w-full text-left py-2 text-xs font-semibold tracking-widest uppercase text-[#111111] hover:text-[#2A4365]"
            >
              Image Library &amp; Gallery
            </button>
            {userResponses.length > 0 && (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  navigateTo('results');
                }}
                className="block w-full text-left py-2 text-xs font-semibold tracking-widest uppercase text-[#111111] hover:text-[#2A4365]"
              >
                Your Results &amp; Stats
              </button>
            )}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('about');
              }}
              className="block w-full text-left py-2 text-xs font-semibold tracking-widest uppercase text-[#111111] hover:text-[#2A4365]"
            >
              About Me &amp; Project
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                navigateTo('contact');
              }}
              className="block w-full text-left py-2 text-xs font-semibold tracking-widest uppercase text-[#111111] hover:text-[#2A4365]"
            >
              Contact &amp; Feedback
            </button>
          </div>
        )}
      </header>

      {/* ==================== MAIN CONTENT AREA ==================== */}
      <main className={`flex-grow w-full ${currentPage === 'archive' || currentPage === 'about' ? 'max-w-none px-0 py-0 flex flex-col' : 'max-w-[1440px] mx-auto px-4 sm:px-6 py-4'}`}>

        {/* -------------------- 1. SCREEN: HOME (LANDING PAGE) -------------------- */}
        {currentPage === 'home' && (
          <div className="space-y-4 sm:space-y-6 animate-fadeIn">
            
            {/* CENTER-ALIGNED HERO HEADER (SEMI-BOLD HUMAN & AI WITH BLURTEXT ANIMATION) */}
            <section className="text-center max-w-3xl mx-auto pt-10 sm:pt-14 md:pt-18 pb-2 space-y-4">
              <BlurText
                as="h1"
                effect="blur"
                animateBy="words"
                direction="top"
                staggerFrom="start"
                trigger="view"
                delay={100}
                stepDuration={0.4}
                blur={12}
                distance={40}
                className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] tracking-tight leading-none text-[#111111] block"
              >
                <span className="font-semibold">HUMAN</span>
                <span className="font-serif italic font-normal text-[#777777]">OR</span>
                <span className="font-semibold">AI?</span>
              </BlurText>

              <BlurText
                text="Can you tell who made it?"
                effect="blur"
                animateBy="words"
                direction="top"
                staggerFrom="start"
                trigger="view"
                delay={200}
                stepDuration={0.35}
                blur={10}
                distance={50}
                onAnimationComplete={handleAnimationComplete}
                className="text-lg sm:text-xl font-normal text-[#111111]/90 tracking-tight block"
              />

              <BlurText
                text="Look at the creative work. Trust your first impression. Then find out whether it was created by a human or generated by AI."
                effect="blur"
                animateBy="words"
                direction="top"
                staggerFrom="start"
                trigger="view"
                delay={350}
                stepDuration={0.3}
                blur={8}
                distance={30}
                className="text-xs sm:text-sm text-[#777777] leading-relaxed max-w-xl mx-auto block"
              />
            </section>

            {/* CIRCULAR CAROUSEL REGION (BIGGER, SEAMLESS, AND NO CTA/TEXT BELOW) */}
            <section className="relative w-full overflow-hidden py-0 -mt-2 sm:-mt-4">
              
              {/* Carousel Container */}
              <div 
                className="relative w-full mx-auto" 
                style={{ height: 'clamp(520px, 48vw, 680px)' }}
              >
                <CircularCarousel
                  items={CAROUSEL_DESTINATIONS.map(item => ({
                    src: item.coverImage,
                    alt: item.title,
                    title: item.title,
                    subtitle: item.subtitle,
                    tag: item.tag,
                    actionText: item.actionText
                  }))}
                  preset="orbit"
                  intro="spin"
                  cardWidth={cardWidth}
                  aspectRatio={1}
                  speed={8}
                  captions={false}
                  gap={gap}
                  tilt={-6}
                  perspective={perspective}
                  momentum={0.47}
                  parallax={0.61}
                  cornerRadius={20}
                  fadeColor="#F5F4EF"
                  onChange={(i) => {
                    carouselActiveRef.current = i;
                    setActiveCarouselIndex(i);
                  }}
                  onItemClick={(_item, i) => {
                    handleCarouselItemClick(_item, i);
                  }}
                />
              </div>
            </section>

          </div>
        )}

        {/* -------------------- 2. SCREEN: QUIZ TEST -------------------- */}
        {currentPage === 'quiz' && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 space-y-6 animate-fadeIn">
            
            {/* GUESSING STATE: Question Header & Visual */}
            {!isRevealed ? (
              <div className={`space-y-6 transition-all duration-300 ${
                quizSlideState === 'slide-out' ? 'quiz-slide-out pointer-events-none' :
                quizSlideState === 'slide-in' ? 'quiz-slide-in' : ''
              }`}>
                {/* Header Metadata & Progress */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#D9D9D4] pb-4 gap-4">
                  <div>
                    <div className="flex items-center space-x-3">
                      <span className="text-xs font-mono font-semibold tracking-widest text-[#777777] uppercase">
                        ROUND {String(TEST_DATA[currentRoundIndex].round).padStart(2, '0')} / {TEST_DATA.length}
                      </span>
                      <span className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                        TEST_DATA[currentRoundIndex].difficulty === 'BEGINNER' ? 'bg-[#111111] text-[#F5F4EF]' :
                        TEST_DATA[currentRoundIndex].difficulty === 'INTERMEDIATE' ? 'bg-[#2A4365] text-white' :
                        'bg-[#742A2A] text-white'
                      }`}>
                        DIFFICULTY: {TEST_DATA[currentRoundIndex].difficulty}
                      </span>
                    </div>
                    <BlurText
                      key={`round-heading-${currentRoundIndex}`}
                      text="Who made this?"
                      effect="blur"
                      animateBy="words"
                      direction="top"
                      trigger="mount"
                      delay={100}
                      stepDuration={0.3}
                      blur={8}
                      distance={15}
                      className="text-2xl sm:text-3xl font-bold text-[#111111] mt-1 tracking-tight block"
                    />
                  </div>

                  {/* Progress indicator */}
                  <div className="w-full sm:w-48 space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-[#777777]">
                      <span>Progress</span>
                      <span>{Math.round(((currentRoundIndex + 1) / TEST_DATA.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-[#D9D9D4] h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-[#111111] h-full smooth-transition" 
                        style={{ width: `${Math.round(((currentRoundIndex + 1) / TEST_DATA.length) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Main Visual Display */}
                <div className="bg-white p-3 sm:p-4 rounded-3xl border border-[#D9D9D4] shadow-xs max-w-3xl mx-auto">
                  <div className="relative w-full aspect-[4/3] md:aspect-[16/10] overflow-hidden rounded-2xl bg-[#F5F4EF] flex items-center justify-center group">
                    <img 
                      src={TEST_DATA[currentRoundIndex].image} 
                      alt={TEST_DATA[currentRoundIndex].category}
                      className="w-full h-full object-contain md:object-cover smooth-transition cursor-zoom-in"
                      onClick={() => setFullscreenImage({
                        src: TEST_DATA[currentRoundIndex].image,
                        title: TEST_DATA[currentRoundIndex].category,
                        subtitle: `Round ${currentRoundIndex + 1} of ${TEST_DATA.length}`
                      })}
                    />
                    
                    {/* Fullscreen zoom hint badge */}
                    <button
                      onClick={() => setFullscreenImage({
                        src: TEST_DATA[currentRoundIndex].image,
                        title: TEST_DATA[currentRoundIndex].category,
                        subtitle: `Round ${currentRoundIndex + 1} of ${TEST_DATA.length}`
                      })}
                      className="absolute bottom-3 right-3 bg-black/75 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 backdrop-blur-xs transition cursor-pointer"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Inspect Fullscreen</span>
                    </button>
                  </div>
                </div>

                {/* Selection Buttons */}
                <div className="space-y-4 text-center max-w-xl mx-auto pt-2">
                  <BlurText
                    key={`round-prompt-${currentRoundIndex}`}
                    text="What is your first impression?"
                    effect="blur"
                    animateBy="words"
                    direction="top"
                    trigger="mount"
                    delay={180}
                    stepDuration={0.28}
                    blur={6}
                    distance={12}
                    className="text-sm font-medium text-[#111111] block"
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      onClick={() => handleGuess('HUMAN')}
                      className="p-5 border-2 border-[#D9D9D4] hover:border-[#111111] bg-white rounded-2xl text-[#111111] font-semibold tracking-wider text-sm uppercase smooth-transition hover:shadow-md flex flex-col items-center justify-center space-y-1 group cursor-pointer"
                    >
                      <span className="group-hover:text-[#2A4365] smooth-transition text-base">HUMAN MADE</span>
                      <span className="text-[10px] font-normal text-[#777777] uppercase">Human Artist / Photographic Craft</span>
                    </button>

                    <button 
                      onClick={() => handleGuess('AI')}
                      className="p-5 border-2 border-[#D9D9D4] hover:border-[#111111] bg-white rounded-2xl text-[#111111] font-semibold tracking-wider text-sm uppercase smooth-transition hover:shadow-md flex flex-col items-center justify-center space-y-1 group cursor-pointer"
                    >
                      <span className="group-hover:text-[#2A4365] smooth-transition text-base">AI GENERATED</span>
                      <span className="text-[10px] font-normal text-[#777777] uppercase">Algorithmically Synthesized</span>
                    </button>
                  </div>
                  <p className="text-xs text-[#777777] italic">Choose before you overthink it.</p>
                </div>
              </div>
            ) : (
              /* OUTCOME REVEAL STATE (Matches Reference Image Exactly) */
              <div className={`space-y-8 transition-all duration-300 ${
                quizSlideState === 'slide-out' ? 'quiz-slide-out pointer-events-none' :
                quizSlideState === 'slide-in' ? 'quiz-slide-in' : ''
              }`}>
                {/* Header Row: Round Reveal Title & Guess Result Badge */}
                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-mono font-medium tracking-widest text-[#777777] uppercase block">
                        ROUND {String(TEST_DATA[currentRoundIndex].round).padStart(2, '0')} REVEAL
                      </span>
                      <BlurText
                        key={`reveal-title-${currentRoundIndex}`}
                        text="The Truth Revealed"
                        effect="blur"
                        animateBy="words"
                        direction="top"
                        trigger="mount"
                        delay={80}
                        stepDuration={0.3}
                        blur={8}
                        distance={15}
                        className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#111111] tracking-tight mt-1 block"
                      />
                    </div>

                    <div className="self-start sm:self-center">
                      <div className={`px-6 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase inline-flex items-center transition-colors ${
                        currentGuess === TEST_DATA[currentRoundIndex].actualOrigin 
                          ? 'bg-[#EAF7EE] text-[#1B803B] border border-[#BBE5C5]' 
                          : 'bg-[#FDF0ED] text-[#D03B26] border border-[#F8C8BF]'
                      }`}>
                        YOUR GUESS: {currentGuess === TEST_DATA[currentRoundIndex].actualOrigin ? 'CORRECT' : 'INCORRECT'}
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Divider Line */}
                  <div className="border-b border-[#D9D9D4] mt-5" />
                </div>

                {/* Two-Column Outcome Layout: Image on Left, Details & Options on Right */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  
                  {/* LEFT COLUMN: Image inside white framed container */}
                  <div className="lg:col-span-6 flex justify-center">
                    <div className="bg-white p-3 sm:p-4 rounded-3xl border border-[#D9D9D4] shadow-xs w-full max-w-[540px]">
                      <div className="relative w-full aspect-square overflow-hidden rounded-2xl bg-[#F5F4EF] flex items-center justify-center group">
                        <img 
                          src={TEST_DATA[currentRoundIndex].image} 
                          alt={TEST_DATA[currentRoundIndex].category}
                          className="w-full h-full object-cover rounded-2xl cursor-zoom-in transition-all duration-300 hover:scale-[1.01]"
                          onClick={() => setFullscreenImage({
                            src: TEST_DATA[currentRoundIndex].image,
                            title: TEST_DATA[currentRoundIndex].category,
                            subtitle: `Round ${currentRoundIndex + 1} of ${TEST_DATA.length}`
                          })}
                        />
                        <button
                          onClick={() => setFullscreenImage({
                            src: TEST_DATA[currentRoundIndex].image,
                            title: TEST_DATA[currentRoundIndex].category,
                            subtitle: `Round ${currentRoundIndex + 1} of ${TEST_DATA.length}`
                          })}
                          className="absolute bottom-3 right-3 bg-black/75 hover:bg-black text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 backdrop-blur-xs transition cursor-pointer"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                          <span>Fullscreen</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Metadata, Analysis Box, Influence Options, and Next Round CTA */}
                  <div className="lg:col-span-6 space-y-6 flex flex-col justify-start">
                    
                    {/* Creator Origin Header */}
                    <div>
                      <span className="text-xs font-mono uppercase tracking-widest text-[#777777] font-medium block">
                        ACTUAL CREATOR ORIGIN
                      </span>
                      <BlurText
                        key={`reveal-origin-${currentRoundIndex}`}
                        text={TEST_DATA[currentRoundIndex].actualOrigin === 'AI' ? 'AI GENERATED' : 'HUMAN CREATED'}
                        effect="blur"
                        animateBy="words"
                        direction="top"
                        trigger="mount"
                        delay={120}
                        stepDuration={0.35}
                        blur={10}
                        distance={20}
                        className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#111111] uppercase mt-1 block"
                      />
                      <p className="text-xs sm:text-sm text-[#777777] mt-1.5">
                        You guessed: <span className="font-bold text-[#111111] uppercase">{currentGuess === 'AI' ? 'AI GENERATED' : 'HUMAN CREATED'}</span>
                      </p>
                    </div>

                    {/* Hairline Divider */}
                    <div className="border-b border-[#D9D9D4]" />

                    {/* ANALYSIS & CONTEXT Card */}
                    <div className="bg-white rounded-2xl border border-[#D9D9D4] p-5 sm:p-6 shadow-xs space-y-2">
                      <h4 className="text-xs font-bold tracking-widest text-[#2A4365] uppercase">
                        ANALYSIS &amp; CONTEXT
                      </h4>
                      <BlurText
                        key={`reveal-explanation-${currentRoundIndex}`}
                        text={TEST_DATA[currentRoundIndex].explanation}
                        effect="blur"
                        animateBy="words"
                        direction="top"
                        trigger="mount"
                        delay={220}
                        stepDuration={0.25}
                        blur={6}
                        distance={12}
                        className="text-xs sm:text-sm text-[#444444] leading-relaxed block"
                      />
                      {TEST_DATA[currentRoundIndex].creatorDetails && (
                        <p className="text-[11px] text-[#888888] font-mono pt-1">
                          Context: {TEST_DATA[currentRoundIndex].creatorDetails}
                        </p>
                      )}
                    </div>

                    {/* WHAT INFLUENCED YOUR CHOICE? (Select all that apply) */}
                    <div className="space-y-3 pt-1">
                      <p className="text-xs font-bold tracking-wider text-[#111111] uppercase">
                        WHAT INFLUENCED YOUR CHOICE? <span className="text-[#777777] font-normal normal-case">(Select all that apply)</span>
                      </p>
                      <div className="flex flex-wrap gap-2.5">
                        {INFLUENCE_FACTORS.map(factor => {
                          const active = selectedFactors.includes(factor);
                          return (
                            <button
                              key={factor}
                              type="button"
                              onClick={() => toggleFactor(factor)}
                              className={`px-4 py-2.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                active 
                                  ? 'bg-[#111111] text-white border-[#111111] shadow-xs' 
                                  : 'bg-white text-[#222222] border-[#D9D9D4] hover:border-[#111111]'
                              }`}
                            >
                              {factor}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* NEXT ROUND Button */}
                    <button 
                      onClick={handleNextRound}
                      className="w-full py-4 bg-[#111111] hover:bg-black text-[#F5F4EF] rounded-xl text-xs sm:text-sm font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-2.5 shadow-sm cursor-pointer mt-2"
                    >
                      <span>{currentRoundIndex < TEST_DATA.length - 1 ? 'NEXT ROUND' : 'VIEW FINAL RESULTS'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        )}

        {/* -------------------- 3. SCREEN: RESULTS & ANALYSIS -------------------- */}
        {currentPage === 'results' && (
          <div className="max-w-4xl mx-auto py-4 space-y-10 animate-fadeIn">
            
            {/* HERO SCORE BANNER */}
            <div className="text-center space-y-4 border-b border-[#D9D9D4] pb-8">
              <span className="text-xs font-semibold uppercase tracking-widest text-[#2A4365] border border-[#2A4365]/20 bg-[#2A4365]/5 px-3 py-1 rounded-full">
                15-Round Analysis Complete
              </span>
              <BlurText
                text="YOUR RESULTS"
                effect="blur"
                animateBy="words"
                direction="top"
                trigger="view"
                delay={100}
                stepDuration={0.35}
                blur={10}
                distance={20}
                className="text-4xl sm:text-5xl font-light text-[#111111] tracking-tight block"
              />
              <div className="inline-block bg-white border border-[#D9D9D4] px-10 py-6 rounded-2xl shadow-xs">
                <span className="text-6xl sm:text-7xl font-bold text-[#111111] tracking-tight">
                  {correctCount} / {TEST_DATA.length}
                </span>
                <p className="text-sm text-[#777777] mt-2 font-medium">
                  {scorePercent >= 80 
                    ? "Master Eye: Exceptional discernment of synthetic vs human craftsmanship."
                    : scorePercent >= 60
                    ? "Keen Intuition: Above-average detection, occasionally fooled by advanced lighting."
                    : "Perceptual Paradox: AI generation has successfully blurred your intuitive markers."}
                </p>
              </div>
            </div>

            {/* METRICS & BREAKDOWN MATRICES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Difficulty Tier Accuracy */}
              <div className="bg-white p-6 rounded-2xl border border-[#D9D9D4] shadow-xs space-y-4">
                <h3 className="text-xs font-semibold tracking-widest text-[#777777] uppercase">
                  PERFORMANCE BY DIFFICULTY TIER
                </h3>
                <div className="space-y-4">
                  {tierStats.map(item => (
                    <div key={item.tier} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span className="font-mono text-[#111111]">{item.tier}</span>
                        <span className="text-[#777777]">{item.correct}/{item.total} ({item.pct}%)</span>
                      </div>
                      <div className="w-full bg-[#F5F4EF] h-2.5 rounded-full overflow-hidden border border-[#D9D9D4]">
                        <div 
                          className="bg-[#111111] h-full smooth-transition" 
                          style={{ width: `${item.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Creator Recognition Accuracy */}
              <div className="bg-white p-6 rounded-2xl border border-[#D9D9D4] shadow-xs space-y-4">
                <h3 className="text-xs font-semibold tracking-widest text-[#777777] uppercase">
                  CREATOR RECOGNITION ACCURACY
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>Human-Made Works Accuracy</span>
                      <span className="font-mono">{humanAccuracy}%</span>
                    </div>
                    <div className="w-full bg-[#F5F4EF] h-2.5 rounded-full overflow-hidden border border-[#D9D9D4]">
                      <div className="bg-[#111111] h-full smooth-transition" style={{ width: `${humanAccuracy}%` }} />
                    </div>
                    <p className="text-[10px] text-[#777777]">Correctly identified {humanCorrect} of {humanRounds.length} human artworks</p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span>AI-Generated Works Accuracy</span>
                      <span className="font-mono">{aiAccuracy}%</span>
                    </div>
                    <div className="w-full bg-[#F5F4EF] h-2.5 rounded-full overflow-hidden border border-[#D9D9D4]">
                      <div className="bg-[#2A4365] h-full smooth-transition" style={{ width: `${aiAccuracy}%` }} />
                    </div>
                    <p className="text-[10px] text-[#777777]">Correctly identified {aiCorrect} of {aiRounds.length} synthetic outputs</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Primary Factors Influenced Decisions */}
            <div className="bg-white p-6 rounded-2xl border border-[#D9D9D4] shadow-xs space-y-4">
              <h3 className="text-xs font-semibold tracking-widest text-[#777777] uppercase">
                PRIMARY FACTORS INFLUENCING YOUR CHOICES
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {INFLUENCE_FACTORS.map(factor => {
                  const count = factorCounts[factor] || 0;
                  const pct = totalCompleted > 0 ? Math.round((count / totalCompleted) * 100) : 0;
                  return (
                    <div key={factor} className="space-y-1">
                      <div className="flex justify-between text-xs font-medium">
                        <span>{factor}</span>
                        <span className="text-[#777777]">{count} rounds ({pct}%)</span>
                      </div>
                      <div className="w-full bg-[#F5F4EF] h-2 rounded-full overflow-hidden border border-[#D9D9D4]">
                        <div className="bg-[#2A4365] h-full smooth-transition" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Review All Rounds Table */}
            <div className="bg-white p-6 rounded-2xl border border-[#D9D9D4] shadow-xs space-y-4">
              <h3 className="text-xs font-semibold tracking-widest text-[#777777] uppercase">
                ROUND-BY-ROUND BREAKDOWN
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {TEST_DATA.map((item, idx) => {
                  const resp = userResponses[idx];
                  return (
                    <div key={item.round} className="p-3 bg-[#F5F4EF] rounded-xl border border-[#D9D9D4] flex items-center gap-3">
                      <img 
                        src={item.image} 
                        alt={item.category} 
                        className="w-14 h-14 object-cover rounded-lg cursor-pointer"
                        onClick={() => setFullscreenImage({ src: item.image, title: item.category, subtitle: item.explanation })}
                      />
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-[#777777]">ROUND {item.round}</span>
                          {resp ? (
                            resp.isCorrect ? (
                              <span className="text-[10px] font-bold text-[#137333] bg-[#E6F4EA] px-1.5 py-0.5 rounded">CORRECT</span>
                            ) : (
                              <span className="text-[10px] font-bold text-[#C5221F] bg-[#FCE8E6] px-1.5 py-0.5 rounded">MISSED</span>
                            )
                          ) : (
                            <span className="text-[10px] text-[#777777]">—</span>
                          )}
                        </div>
                        <p className="text-xs font-semibold text-[#111111] truncate">{item.actualLabel}</p>
                        <p className="text-[10px] text-[#777777] truncate">You: {resp ? (resp.guess === 'HUMAN' ? 'Human' : 'AI') : 'Not taken'}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Thought-Provoking Research Quote */}
            <div className="bg-[#111111] text-[#F5F4EF] p-8 md:p-10 rounded-2xl space-y-3 relative overflow-hidden">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#D9D9D4]/60">EXPERIMENTAL SUMMARY</span>
              <blockquote className="text-2xl sm:text-3xl font-serif italic text-[#F5F4EF] leading-snug">
                “Sometimes we respond to the work before we know who made it.”
              </blockquote>
              <p className="text-xs sm:text-sm text-[#D9D9D4]/80 leading-relaxed max-w-2xl">
                This experiment explores how authorship, visual quality, micro-details, texture grain, and perceived effort shape audience response to modern creative output.
              </p>
            </div>

            {/* ACTION BUTTONS */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <button 
                onClick={startTest}
                className="w-full sm:w-auto px-8 py-4 bg-[#111111] text-[#F5F4EF] rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-[#2A4365] smooth-transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Retake 15-Round Test</span>
              </button>

              <button 
                onClick={() => navigateTo('archive')}
                className="w-full sm:w-auto px-8 py-4 bg-white border border-[#D9D9D4] text-[#111111] rounded-xl text-xs font-semibold tracking-wider uppercase hover:border-[#111111] smooth-transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Browse Image Library</span>
              </button>

              <button 
                onClick={shareResults}
                className="w-full sm:w-auto px-6 py-4 bg-white border border-[#D9D9D4] text-[#2A4365] rounded-xl text-xs font-semibold tracking-wider uppercase hover:border-[#2A4365] smooth-transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                <span>{copiedToast ? 'Score Copied!' : 'Share Results'}</span>
              </button>
            </div>

          </div>
        )}

        {/* -------------------- 4. SCREEN: IMAGE ARCHIVE -------------------- */}
        {currentPage === 'archive' && (
          <div className="flex-grow flex flex-col w-full h-[calc(100vh-8rem)] min-h-[560px] animate-fadeIn relative">
            {/* Seamless full-height carousel without heading */}
            <div className="w-full h-full relative flex-grow">
              <CircularGallery
                bend={2.5}
                textColor="#ffffff"
                borderRadius={0.06}
                scrollEase={0.05}
                onItemClick={(item, index) => console.log(item.text, index)}
                gap={0.85}
              />
            </div>
          </div>
        )}

        {/* -------------------- 5. SCREEN: ABOUT -------------------- */}
        {currentPage === 'about' && (
          <div className="w-full flex-grow h-[calc(100vh-8rem)] min-h-[580px] animate-fadeIn flex items-center overflow-hidden">
            <div className="w-full h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
              
              {/* LEFT SIDE: INFINITE SPIRAL (ELONGATED FROM TOP TO BOTTOM EDGE) */}
              <div className="lg:col-span-5 w-full h-full flex justify-start items-center lg:-ml-6 xl:-ml-12 overflow-hidden">
                <div 
                  className="w-full max-w-[460px] h-full"
                  style={{ height: 'calc(100vh - 8rem)', minHeight: '580px', position: 'relative', overflow: 'hidden' }}
                >
                  <InfiniteSpiral
                    items={spiralImages}
                    animationMode="all"
                    speed={0.55}
                    radius={150}
                    cardWidth={100}
                    cardHeight={100}
                    verticalSpacing={72}
                    perspective={1000}
                    cardRadius={10}
                    centerScale={1.2}
                    edgeBlur={6}
                    cardsPerTurn={7}
                    pauseOnHover
                  />
                </div>
              </div>

              {/* RIGHT SIDE: TEXT LIFTED UP, TIGHT LABEL GAP, 3-LINE HEADING, SINGLE COMBINED PARAGRAPH */}
              <div className="lg:col-span-7 space-y-6 w-full max-w-3xl lg:-mt-14 xl:-mt-20">
                
                {/* Header Group: Label and Heading with tight vertical distance */}
                <div className="space-y-2">
                  <BlurText
                    text="ABOUT THE EXPERIMENT"
                    effect="blur"
                    animateBy="words"
                    direction="top"
                    staggerFrom="start"
                    trigger="view"
                    delay={100}
                    stepDuration={0.3}
                    blur={8}
                    distance={15}
                    className="text-xs font-mono font-medium tracking-widest uppercase text-[#777777] block"
                  />

                  {/* Bold Heading: Reduced font size to guarantee 3 lines max, text-left */}
                  <BlurText
                    text="From Human-Made to AI-Generated: Exploring How Creative Content Influences Audience Perception."
                    effect="blur"
                    animateBy="words"
                    direction="top"
                    staggerFrom="start"
                    trigger="view"
                    delay={180}
                    stepDuration={0.35}
                    blur={10}
                    distance={20}
                    className="text-2xl sm:text-3xl lg:text-[1.95rem] xl:text-[2.15rem] font-bold text-[#111111] tracking-tight leading-[1.22] block text-left max-w-2xl lg:max-w-3xl"
                  />
                </div>

                {/* Single Combined Info Paragraph */}
                <div className="pt-1 max-w-2xl lg:max-w-[680px]">
                  <BlurText
                    text="As synthetic generation tools rapidly advance, distinguishing between human craftsmanship and algorithmic synthesis challenges our intuitive assumptions about art, authenticity, and visual effort. Across 15 rounds of increasing complexity, this test evaluates whether subtle micro-details, light diffusion, stroke chaos, and texture grain impact your ability to discern genuine human authorial intent."
                    effect="blur"
                    animateBy="words"
                    direction="top"
                    staggerFrom="start"
                    trigger="view"
                    delay={300}
                    stepDuration={0.3}
                    blur={8}
                    distance={20}
                    className="text-sm sm:text-base font-normal text-[#111111]/80 leading-relaxed block text-left"
                  />
                </div>

              </div>

            </div>
          </div>
        )}

        {/* -------------------- 6. SCREEN: CONTACT -------------------- */}
        {currentPage === 'contact' && (
          <div className="max-w-4xl mx-auto py-2 space-y-8 animate-fadeIn">
            <div className="border-b border-[#D9D9D4] pb-6 space-y-2">
              <BlurText
                text="Connect & Feedback"
                effect="blur"
                animateBy="words"
                direction="top"
                staggerFrom="start"
                trigger="view"
                delay={100}
                stepDuration={0.3}
                blur={8}
                distance={15}
                className="text-xs font-semibold tracking-widest uppercase text-[#2A4365] block"
              />
              <BlurText
                text="CONTACT & DISCUSSION"
                effect="blur"
                animateBy="words"
                direction="top"
                staggerFrom="start"
                trigger="view"
                delay={180}
                stepDuration={0.35}
                blur={10}
                distance={22}
                className="text-4xl font-bold text-[#111111] tracking-tight block"
              />
              <BlurText
                text="Have feedback on the experiment, want to suggest new test subjects, or discuss creative research? Send a message below."
                effect="blur"
                animateBy="words"
                direction="top"
                staggerFrom="start"
                trigger="view"
                delay={280}
                stepDuration={0.3}
                blur={8}
                distance={18}
                className="text-sm text-[#777777] block"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {/* Form */}
              <form onSubmit={handleContactSubmit} className="md:col-span-7 space-y-4 bg-white p-6 rounded-2xl border border-[#D9D9D4] shadow-xs">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]">Name</label>
                  <input 
                    type="text" 
                    required 
                    value={contactForm.name}
                    onChange={e => setContactForm({ ...contactForm, name: e.target.value })}
                    placeholder="Your full name" 
                    className="w-full px-4 py-3 bg-[#F5F4EF] border border-[#D9D9D4] rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#111111] smooth-transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]">Email</label>
                  <input 
                    type="email" 
                    required 
                    value={contactForm.email}
                    onChange={e => setContactForm({ ...contactForm, email: e.target.value })}
                    placeholder="name@domain.com" 
                    className="w-full px-4 py-3 bg-[#F5F4EF] border border-[#D9D9D4] rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#111111] smooth-transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]">Subject</label>
                  <select 
                    value={contactForm.subject}
                    onChange={e => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full px-4 py-3 bg-[#F5F4EF] border border-[#D9D9D4] rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#111111] smooth-transition cursor-pointer"
                  >
                    <option>General Inquiry</option>
                    <option>Experiment Feedback &amp; Suggestions</option>
                    <option>Academic / Research Collaboration</option>
                    <option>Submit an Artwork for Next Test</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#111111]">Message</label>
                  <textarea 
                    rows={4} 
                    required 
                    value={contactForm.message}
                    onChange={e => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Share your thoughts on the experiment or suggestions..." 
                    className="w-full px-4 py-3 bg-[#F5F4EF] border border-[#D9D9D4] rounded-xl text-sm text-[#111111] focus:outline-none focus:border-[#111111] smooth-transition"
                  />
                </div>

                <button 
                  type="submit" 
                  className="w-full py-4 bg-[#111111] text-[#F5F4EF] rounded-xl text-xs font-semibold tracking-wider uppercase hover:bg-[#2A4365] smooth-transition flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Message</span>
                </button>

                {contactSubmitted && (
                  <div className="p-3.5 bg-[#E6F4EA] text-[#137333] border border-[#137333]/20 text-xs rounded-xl text-center font-medium animate-fadeIn">
                    ✓ Thank you! Your message and feedback have been received.
                  </div>
                )}
              </form>

              {/* Research Details Card */}
              <div className="md:col-span-5 space-y-4">
                <div className="bg-white p-6 rounded-2xl border border-[#D9D9D4] shadow-xs space-y-4">
                  <span className="text-xs font-mono text-[#777777] uppercase tracking-wider">PROJECT DISCLOSURES</span>
                  <div className="space-y-2 text-xs text-[#111111]/80">
                    <BlurText
                      text="HUMAN OR AI? Study"
                      effect="blur"
                      animateBy="words"
                      direction="top"
                      trigger="view"
                      delay={120}
                      stepDuration={0.3}
                      blur={8}
                      distance={15}
                      className="font-semibold text-[#111111] block"
                    />
                    <BlurText
                      text="Independent research on visual literacy, perceptual bias, and artificial intelligence in creative practice."
                      effect="blur"
                      animateBy="words"
                      direction="top"
                      trigger="view"
                      delay={220}
                      stepDuration={0.3}
                      blur={8}
                      distance={15}
                      className="block text-[#777777] leading-relaxed"
                    />
                  </div>
                  
                  <div className="pt-4 border-t border-[#D9D9D4] space-y-2 text-xs">
                    <p className="text-[#777777] font-mono uppercase">Direct Correspondence</p>
                    <p className="text-[#111111] font-medium">research@humanorai.experiment</p>
                    <p className="text-[#111111] font-medium">@human_or_ai_test</p>
                  </div>

                  <div className="pt-4 border-t border-[#D9D9D4] space-y-2 text-xs text-[#777777]">
                    <p className="font-mono uppercase text-[#111111]">Dataset Integrity</p>
                    <p>All human subjects are verified authentic lens and brushwork works. All AI subjects are recorded with generation parameters.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Global Minimalist Footer matching reference design */}
      <footer className="border-t border-[#D9D9D4] py-6 px-6 sm:px-12 mt-auto bg-transparent">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#777777]">
          <span>HUMAN OR AI? — Interactive Visual Experiment</span>
          <span>Interactive Design Prototype</span>
        </div>
      </footer>

      {/* ==================== FULLSCREEN ZOOM INSPECT MODAL ==================== */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-md animate-fadeIn"
          onClick={() => setFullscreenImage(null)}
        >
          <button 
            onClick={() => setFullscreenImage(null)}
            className="absolute top-4 right-4 text-white hover:text-[#90CDF4] p-2 rounded-full bg-white/10 hover:bg-white/20 transition cursor-pointer"
            aria-label="Close fullscreen"
          >
            <X className="w-6 h-6" />
          </button>

          <div 
            className="max-w-5xl w-full max-h-[85vh] flex flex-col items-center justify-center space-y-3"
            onClick={e => e.stopPropagation()}
          >
            <img 
              src={fullscreenImage.src} 
              alt={fullscreenImage.title}
              className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl"
            />
            <div className="text-center text-white space-y-1">
              <h4 className="text-sm font-semibold tracking-wider uppercase font-mono">{fullscreenImage.title}</h4>
              {fullscreenImage.subtitle && (
                <p className="text-xs text-[#D9D9D4] max-w-xl mx-auto">{fullscreenImage.subtitle}</p>
              )}
            </div>
          </div>
        </div>
      )}


    </div>
  );
}
