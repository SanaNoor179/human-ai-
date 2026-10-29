/**
 * HUMAN OR AI? — Visual Perception Experiment Data
 * Vanilla JS data definition (no modules or imports, fully compatible with file://)
 */

window.TEST_DATA = [
  {
    round: 1,
    difficulty: "BEGINNER",
    category: "WILDLIFE PHOTOGRAPHY — FOX",
    image: "images/fox.jpg",
    actualOrigin: "HUMAN",
    actualLabel: "HUMAN MADE",
    explanation: "Natural optical depth of field cleanly separates the fox from the dark woodland understory. Fine fur whiskers, grounded soil texture, and authentic optical vignetting show genuine lens physics.",
    creatorDetails: "Photographed on high-speed telephoto lens in natural British woodland."
  },
  {
    round: 2,
    difficulty: "BEGINNER",
    category: "WILDLIFE PHOTOGRAPHY — PANDA",
    image: "images/panda.jpg",
    actualOrigin: "AI",
    actualLabel: "AI GENERATED",
    explanation: "This AI-generated panda features uniformly stylized black-and-white fur clumps, slightly synthetic daylight diffusion, and an idealized bamboo environment without natural optical chromatic aberration.",
    creatorDetails: "Synthesized via modern diffusion model focusing on cute wildlife prompts."
  },
  {
    round: 3,
    difficulty: "BEGINNER",
    category: "PORTRAIT — AI STUDIO",
    image: "images/ai-portrait.jpg",
    actualOrigin: "AI",
    actualLabel: "AI GENERATED",
    explanation: "The portrait uses hyper-smooth studio illumination and overly uniform subsurface skin scattering, with flawless hair line blending into the backdrop typical of AI synthesis.",
    creatorDetails: "Generated with prompt specifying 85mm portrait studio illumination."
  },
  {
    round: 4,
    difficulty: "BEGINNER",
    category: "PORTRAIT — PHOTOGRAPH",
    image: "images/human-portrait.jpg",
    actualOrigin: "HUMAN",
    actualLabel: "HUMAN MADE",
    explanation: "Micro skin pores, asymmetrical freckles, stray fine hairs catching natural edge light, and authentic pupil reflections reveal organic human photography.",
    creatorDetails: "Shot on full-frame digital sensor with softbox key light."
  },
  {
    round: 5,
    difficulty: "BEGINNER",
    category: "FINE ART — AI STILL LIFE",
    image: "images/ai-oil-painting.jpg",
    actualOrigin: "AI",
    actualLabel: "AI GENERATED",
    explanation: "The fruit surfaces have synthetic specular highlights and an unnaturally consistent digital impasto across dissimilar textures like ceramic, cloth, and peel.",
    creatorDetails: "Created via text-to-image model simulating Dutch golden age still life."
  },
  {
    round: 6,
    difficulty: "INTERMEDIATE",
    category: "FINE ART — OIL PAINTING",
    image: "images/human-oil-painting.jpg",
    actualOrigin: "HUMAN",
    actualLabel: "HUMAN MADE",
    explanation: "Authentic physical oil paint strokes, nuanced wet-on-wet glazing, subtle canvas weave grain, and deliberate artist mark-making variation throughout.",
    creatorDetails: "Hand-painted oil on stretched linen canvas."
  },
  {
    round: 7,
    difficulty: "INTERMEDIATE",
    category: "LANDSCAPE — FLORIDA LAKE",
    image: "images/florida-lake.jpg",
    actualOrigin: "HUMAN",
    actualLabel: "HUMAN MADE",
    explanation: "Complex cloud volumetric density, authentic sunset color temperature banding, and physical water wave ripples interacting accurately with shoreline grasses.",
    creatorDetails: "Captured during blue-hour twilight in Lake County, Florida."
  },
  {
    round: 8,
    difficulty: "INTERMEDIATE",
    category: "LANDSCAPE — AI MOUNTAIN LAKE",
    image: "images/ai-lake.jpg",
    actualOrigin: "AI",
    actualLabel: "AI GENERATED",
    explanation: "Features an unnaturally pristine, mirror-like lake reflection that duplicates peaks with algorithmic geometry and uniform mathematical sharpness across vast distances.",
    creatorDetails: "Algorithmic generation tuned for alpine mountain reflections."
  },
  {
    round: 9,
    difficulty: "INTERMEDIATE",
    category: "WILDLIFE — LIONS",
    image: "images/lions.jpg",
    actualOrigin: "HUMAN",
    actualLabel: "HUMAN MADE",
    explanation: "Genuine wildlife photography capturing two lions with true focal falloff, irregular wind-blown mane hairs, environmental dust particles, and organic savanna lighting.",
    creatorDetails: "Field safari documentary photograph in Kenya."
  },
  {
    round: 10,
    difficulty: "INTERMEDIATE",
    category: "ARCHITECTURE — MODERN HOUSE",
    image: "images/building-real.jpg",
    actualOrigin: "HUMAN",
    actualLabel: "HUMAN MADE",
    explanation: "True architectural perspective, real structural joinery, genuine double-pane glass reflections of neighboring trees, and natural weathered concrete textures.",
    creatorDetails: "Editorial architectural photography of a minimalist residential pavilion."
  },
  {
    round: 11,
    difficulty: "ADVANCED",
    category: "PRODUCT — PERFUME PHOTOGRAPHY",
    image: "images/product-real.jpg",
    actualOrigin: "HUMAN",
    actualLabel: "HUMAN MADE",
    explanation: "Precise commercial lighting setup creating physically accurate internal glass caustics, crisp liquid meniscus refraction, and tactile paper label texture.",
    creatorDetails: "Studio commercial shoot with strobe pack and acrylic risers."
  },
  {
    round: 12,
    difficulty: "ADVANCED",
    category: "PRODUCT — AI PERFUME",
    image: "images/product-ai.jpg",
    actualOrigin: "AI",
    actualLabel: "AI GENERATED",
    explanation: "The composition creates dreamlike, idealized silk folds and botanical petals, but internal refraction through the glass bottle defies standard optical physics.",
    creatorDetails: "Commercial ad concept rendered with generative AI."
  },
  {
    round: 13,
    difficulty: "ADVANCED",
    category: "AUTOMOTIVE — VINTAGE CAR",
    image: "images/car-ai.png",
    actualOrigin: "AI",
    actualLabel: "AI GENERATED",
    explanation: "Combines cinematic composition and wet pavement reflection, yet airborne water droplets and metallic trim details exhibit slight morphing artifacts upon close inspection.",
    creatorDetails: "Synthesized dynamic automotive action render."
  },
  {
    round: 14,
    difficulty: "ADVANCED",
    category: "FASHION — DENIM PORTRAIT",
    image: "images/man-ai.jpg",
    actualOrigin: "AI",
    actualLabel: "AI GENERATED",
    explanation: "Impressive denim weave rendering, but the harsh directional sunlight produces slight textural repetition along the fabric seams and impossible stitch micro-patterns.",
    creatorDetails: "High-fashion synthetic menswear campaign concept."
  },
  {
    round: 15,
    difficulty: "ADVANCED",
    category: "WILDLIFE — CAT PORTRAIT",
    image: "images/cat-ai.webp",
    actualOrigin: "AI",
    actualLabel: "AI GENERATED",
    explanation: "Soft window sidelight illuminates realistic calico fur, but whisker root origins and fabric cushion weaves reveal subtle algorithmic blending transitions.",
    creatorDetails: "Domestic animal portrait synthesized to replicate 50mm f/1.4 lens."
  }
];

window.INFLUENCE_FACTORS = [
  "Visual Quality",
  "Originality",
  "Authenticity",
  "Effort",
  "Style",
  "Familiarity"
];

window.CAROUSEL_DESTINATIONS = [
  {
    id: 'quiz',
    name: 'The Test',
    page: 'quiz',
    tag: '15-ROUND TEST',
    title: 'START THE QUIZ',
    subtitle: '15 Subjects • Human or AI?',
    destinationText: 'Takes you to: The 15-Round Challenge',
    description: 'Test your perception against 15 curated images across Beginner, Intermediate, and Advanced tiers.',
    coverImage: 'images/landing/carousel-quiz.jpg',
    actionText: 'Start Test'
  },
  {
    id: 'archive',
    name: 'Image Library',
    page: 'archive',
    tag: 'FULL CATALOGUE',
    title: 'IMAGE ARCHIVE',
    subtitle: 'Browse all 15 subjects & gallery',
    destinationText: 'Takes you to: The Image Library & Gallery',
    description: 'Explore every photograph, painting, and render in high resolution with fullscreen zoom and origin filters.',
    coverImage: 'images/landing/carousel-archive.jpg',
    actionText: 'Open Library'
  },
  {
    id: 'results',
    name: 'Score & Analysis',
    page: 'results',
    tag: 'PERCEPTION MATRIX',
    title: 'RESULTS & STATS',
    subtitle: 'Accuracy • Bias • Visual cues',
    destinationText: 'Takes you to: Score Matrix & Perception Analytics',
    description: 'View your tier accuracy, human vs AI bias, and the visual cues that guided your decisions.',
    coverImage: 'images/landing/carousel-results.jpg',
    actionText: 'View Stats'
  },
  {
    id: 'about',
    name: 'About The Study',
    page: 'about',
    tag: 'RESEARCH STUDY',
    title: 'ABOUT THE STUDY',
    subtitle: 'Aesthetic value & perception craft',
    destinationText: 'Takes you to: Research Methodology & Background',
    description: 'Discover how withholding creator labels reveals how audiences interpret visual effort, originality, and craft.',
    coverImage: 'images/landing/carousel-about.jpg',
    actionText: 'Read Study'
  },
  {
    id: 'contact',
    name: 'Contact & Feedback',
    page: 'contact',
    tag: 'COMMUNITY & INQUIRY',
    title: 'GET IN TOUCH',
    subtitle: 'Feedback & research inquiry',
    destinationText: 'Takes you to: Contact & Feedback Form',
    description: 'Connect with the research team, share perceptual insights, or submit artworks for future experiments.',
    coverImage: 'images/landing/carousel-contact.jpg',
    actionText: 'Contact Us'
  }
];
