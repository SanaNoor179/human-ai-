/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from 'ogl';
import { TEST_DATA } from '../data/quizData';
import './CircularGallery.css';

export interface CircularGalleryItem {
  image: string;
  text: string;
  subtext?: string;
  round?: number;
  difficulty?: string;
  actualOrigin?: 'HUMAN' | 'AI';
  actualLabel?: string;
  explanation?: string;
  creatorDetails?: string;
  category?: string;
  [key: string]: any;
}

export interface CircularGalleryProps {
  items?: CircularGalleryItem[];
  bend?: number;
  textColor?: string;
  borderRadius?: number;
  scrollEase?: number;
  scrollSpeed?: number;
  gap?: number;
  onItemClick?: (item: CircularGalleryItem, index: number) => void;
  className?: string;
}

const DEFAULT_ITEMS: CircularGalleryItem[] = TEST_DATA.map(t => ({
  image: t.image,
  text: t.category,
  category: t.category,
  subtext: t.actualOrigin === 'AI'
    ? 'AI Generated • Algorithmic Synthesis'
    : 'Human Made • Photographic & Fine Craft',
  round: t.round,
  difficulty: t.difficulty,
  actualOrigin: t.actualOrigin,
  actualLabel: t.actualLabel,
  explanation: t.explanation,
  creatorDetails: t.creatorDetails
}));

// Clean, unwarped flat card vertex shader
const VERTEX_SHADER = /* glsl */ `
  precision highp float;
  attribute vec3 position;
  attribute vec2 uv;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Front fragment shader with aspect-ratio cover math and signed distance field rounded corners
const FRONT_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform float uBorderRadius;
  uniform vec2 uCardResolution;
  uniform vec2 uImageResolution;
  uniform float uAlpha;
  varying vec2 vUv;

  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
  }

  void main() {
    if (!gl_FrontFacing) discard;

    vec2 uv = vUv;
    if (uImageResolution.x > 0.0 && uImageResolution.y > 0.0 && uCardResolution.x > 0.0 && uCardResolution.y > 0.0) {
      float cardAspect = uCardResolution.x / uCardResolution.y;
      float imgAspect = uImageResolution.x / uImageResolution.y;
      if (cardAspect > imgAspect) {
        float scale = imgAspect / cardAspect;
        uv.y = (uv.y - 0.5) * scale + 0.5;
      } else {
        float scale = cardAspect / imgAspect;
        uv.x = (uv.x - 0.5) * scale + 0.5;
      }
    }

    vec4 color = texture2D(uMap, uv);

    if (uBorderRadius > 0.0) {
      vec2 p = vUv - vec2(0.5);
      vec2 b = vec2(0.5);
      float d = roundedBoxSDF(p, b, uBorderRadius);
      if (d > 0.0) discard;
      float alpha = 1.0 - smoothstep(-0.008, 0.002, d);
      color.a *= alpha;

      float borderDist = abs(d + 0.004);
      float borderFactor = smoothstep(0.005, 0.0, borderDist);
      color.rgb = mix(color.rgb, vec3(0.0, 0.0, 0.0), borderFactor * 0.15);
    }

    color.a *= uAlpha;
    gl_FragColor = color;
  }
`;

// Back fragment shader: renders the back flip card face with crisp SDF rounded corners and natural unmirrored text
const BACK_FRAGMENT_SHADER = /* glsl */ `
  precision highp float;
  uniform sampler2D uMap;
  uniform float uBorderRadius;
  uniform float uAlpha;
  varying vec2 vUv;

  float roundedBoxSDF(vec2 p, vec2 b, float r) {
    vec2 d = abs(p) - b + vec2(r);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0)) - r;
  }

  void main() {
    if (!gl_FrontFacing) discard;

    vec4 color = texture2D(uMap, vUv);

    if (uBorderRadius > 0.0) {
      vec2 p = vUv - vec2(0.5);
      vec2 b = vec2(0.5);
      float d = roundedBoxSDF(p, b, uBorderRadius);
      if (d > 0.0) discard;
      float alpha = 1.0 - smoothstep(-0.008, 0.002, d);
      color.a *= alpha;

      float borderDist = abs(d + 0.004);
      float borderFactor = smoothstep(0.005, 0.0, borderDist);
      color.rgb = mix(color.rgb, vec3(1.0, 1.0, 1.0), borderFactor * 0.18);
    }

    color.a *= uAlpha;
    gl_FragColor = color;
  }
`;

/**
 * Extracts clean Title, Image Type, and Origin from item metadata
 */
function extractTitleAndType(item: CircularGalleryItem): { title: string; imageType: string; origin: string; isAI: boolean } {
  const isAI = item.actualOrigin === 'AI';
  const origin = isAI ? 'AI Generated' : 'Human Made';
  
  const rawText = item.text || item.category || 'Archive Item';
  let title = 'Wooded Landscape';
  let imageType = 'Photography';

  if (rawText.includes('—')) {
    const parts = rawText.split('—').map(s => s.trim());
    const left = parts[0];
    const right = parts[1];

    title = right
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    imageType = left
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  } else {
    title = rawText
      .toLowerCase()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    imageType = 'Photography';
  }

  // Refine titles to clean, natural names
  const cleanTitleUpper = title.toUpperCase().replace(/\bAI\b/g, '').trim();
  if (cleanTitleUpper.includes('PANDA')) title = 'Giant Panda';
  else if (cleanTitleUpper.includes('FOX')) title = 'Red Fox';
  else if (cleanTitleUpper.includes('LION')) title = 'Savanna Lions';
  else if (cleanTitleUpper.includes('MONKEY') || cleanTitleUpper.includes('MACAQUE')) title = 'Japanese Macaque';
  else if (cleanTitleUpper.includes('MACAW')) title = 'Scarlet Macaw';
  else if (cleanTitleUpper.includes('OWL')) title = 'Barn Owl';
  else if (cleanTitleUpper.includes('STILL LIFE')) title = 'Still Life';
  else if (cleanTitleUpper.includes('OIL PAINTING')) title = 'Wooded Landscape';
  else if (cleanTitleUpper.includes('FLORIDA')) title = 'Florida Twilight Lake';
  else if (cleanTitleUpper.includes('MOUNTAIN')) title = 'Alpine Mountain Lake';
  else if (cleanTitleUpper.includes('STUDIO') || cleanTitleUpper.includes('PORTRAIT')) title = 'Studio Portrait';
  else if (cleanTitleUpper.includes('BEACH')) title = 'Coastal Seascape';
  else if (cleanTitleUpper.includes('CAR')) title = 'Vintage Automobile';
  else if (cleanTitleUpper.includes('FOREST')) title = 'Misty Forest';

  // Refine image types for bottom-left display (e.g. Wildlife Photography, Oil Painting)
  const typeUpper = imageType.toUpperCase();
  if (typeUpper.includes('WILDLIFE')) imageType = 'Wildlife Photography';
  else if (typeUpper.includes('LANDSCAPE')) imageType = 'Landscape Photography';
  else if (typeUpper.includes('PORTRAIT')) imageType = 'Portrait Photography';
  else if (typeUpper.includes('OIL') || typeUpper.includes('FINE ART')) imageType = 'Oil Painting';
  else if (typeUpper.includes('PHOTOGRAPHY') || typeUpper.includes('PHOTOGRAPH')) imageType = 'Photography';
  else imageType = 'Photography';

  return { title, imageType, origin, isAI };
}

/**
 * Creates minimal, elegant high-resolution 2D canvas texture for the back of the flip card
 * Following user specifications:
 * - All fonts set to "Poppins"
 * - Title of card on the top (Poppins 700)
 * - Text size on the bottom enlarged for maximum legibility (Poppins 42px)
 * - Type of image on the bottom left (e.g. Wildlife Photography)
 * - AI Generated or Human Made on the bottom right corner
 * - Sleek #27272a dark slate card background matching the reference video
 */
function createCardBackCanvas(item: CircularGalleryItem, imgElement?: HTMLImageElement): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = 960;
  canvas.height = 1280;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  const w = canvas.width;
  const h = canvas.height;
  const r = 52; // border radius

  ctx.save();
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.lineTo(w - r, 0);
  ctx.quadraticCurveTo(w, 0, w, r);
  ctx.lineTo(w, h - r);
  ctx.quadraticCurveTo(w, h, w - r, h);
  ctx.lineTo(r, h);
  ctx.quadraticCurveTo(0, h, 0, h - r);
  ctx.lineTo(0, r);
  ctx.quadraticCurveTo(0, 0, r, 0);
  ctx.closePath();
  ctx.clip();

  // 1. Sleek #27272a background matching reference video
  const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
  bgGrad.addColorStop(0, '#222225');
  bgGrad.addColorStop(0.5, '#27272a');
  bgGrad.addColorStop(1, '#2c2c31');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, w, h);

  // 2. Subtle ghosted background preview of image for depth
  if (imgElement && imgElement.naturalWidth) {
    ctx.save();
    ctx.globalAlpha = 0.08;
    const sAspect = imgElement.naturalWidth / imgElement.naturalHeight;
    const cAspect = w / h;
    let sw = imgElement.naturalWidth;
    let sh = imgElement.naturalHeight;
    let sx = 0;
    let sy = 0;
    if (sAspect > cAspect) {
      sw = sh * cAspect;
      sx = (imgElement.naturalWidth - sw) / 2;
    } else {
      sh = sw / cAspect;
      sy = (imgElement.naturalHeight - sh) / 2;
    }
    ctx.drawImage(imgElement, sx, sy, sw, sh, 0, 0, w, h);
    ctx.restore();
  }

  // 3. Crisp inner card border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // 4. Extract minimal metadata
  const { title, imageType, origin, isAI } = extractTitleAndType(item);

  // 5. TOP: Title of the card - POPPINS 700 Bold
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 64px "Poppins", sans-serif';
  ctx.fillText(title, 76, 88);

  // 6. BOTTOM ROW: Enlarged Poppins typography for enhanced legibility
  const bottomY = h - 115;

  // Bottom left: Type of image (e.g. Wildlife Photography, Oil Painting)
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#a1a1aa';
  ctx.font = '500 42px "Poppins", sans-serif';
  ctx.fillText(imageType, 76, bottomY);

  // Bottom right: Whether it is AI Generated or Human Made
  ctx.textAlign = 'right';
  ctx.textBaseline = 'alphabetic';
  const originColor = isAI ? '#60a5fa' : '#34d399';
  ctx.fillStyle = originColor;
  ctx.font = '600 42px "Poppins", sans-serif';
  ctx.fillText(origin, w - 76, bottomY);

  ctx.restore();
  return canvas;
}

interface MediaItem {
  group: Transform;
  flipGroup: Transform;
  frontMesh: Mesh;
  backMesh: Mesh;
  frontProgram: Program;
  backProgram: Program;
  frontTexture: Texture;
  backTexture: Texture;
  img?: HTMLImageElement;
  index: number;
  item: CircularGalleryItem;
  currentFlip: number;
  targetFlip: number;
  currentZoom: number; // 0 (in carousel arc) to 1 (zoomed in near camera)
  targetZoom: number;
}

export default function CircularGallery({
  items,
  bend = 2.5,
  borderRadius = 0.05,
  scrollEase = 0.05,
  scrollSpeed = 1.0,
  gap = 0.85,
  onItemClick,
  className = ''
}: CircularGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const closeZoomRef = useRef<() => void>(() => {});
  const flipTriggerRef = useRef<() => void>(() => {});

  const galleryItems = items && items.length > 0 ? items : DEFAULT_ITEMS;
  const totalItems = galleryItems.length;

  const handleCloseZoom = useCallback(() => {
    if (closeZoomRef.current) {
      closeZoomRef.current();
    }
  }, []);

  const handleToggleFlip = useCallback(() => {
    if (flipTriggerRef.current) {
      flipTriggerRef.current();
    }
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Renderer
    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(window.devicePixelRatio || 1, 2)
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const canvas = gl.canvas;
    canvas.className = 'circular-gallery-canvas';
    container.appendChild(canvas);

    // Camera framed comfortably for the sweeping semi-circle
    const camera = new Camera(gl, { fov: 45 });
    camera.position.z = 24.0;

    // Scene
    const scene = new Transform();

    // Slightly bigger card dimensions: 4.85 width, 6.45 height (3:4 ratio)
    const cardWidth = 4.85;
    const cardHeight = 6.45;
    const cardGeometry = new Plane(gl, { width: cardWidth, height: cardHeight });

    // Generous radius giving more gap and space between cards
    const radius = 20.5;
    // Exactly divide 2*PI by totalItems so the 360-degree loop is seamless with zero seams
    const angleStep = (2 * Math.PI) / totalItems;

    const medias: MediaItem[] = [];

    // Initialize media items
    galleryItems.forEach((item, index) => {
      const group = new Transform();
      group.setParent(scene);

      const flipGroup = new Transform();
      flipGroup.setParent(group);

      // Front Texture
      const frontTexture = new Texture(gl, {
        generateMipmaps: false
      });

      // Front Program
      const frontProgram = new Program(gl, {
        vertex: VERTEX_SHADER,
        fragment: FRONT_FRAGMENT_SHADER,
        uniforms: {
          uMap: { value: frontTexture },
          uBorderRadius: { value: borderRadius },
          uCardResolution: { value: [cardWidth, cardHeight] },
          uImageResolution: { value: [1, 1] },
          uAlpha: { value: 1.0 }
        },
        cullFace: false,
        transparent: true,
        depthTest: true,
        depthWrite: true
      });

      // Front Mesh
      const frontMesh = new Mesh(gl, {
        geometry: cardGeometry,
        program: frontProgram
      });
      frontMesh.position.z = 0.015;
      frontMesh.setParent(flipGroup);

      // Back Texture
      const initialBackCanvas = createCardBackCanvas(item);
      const backTexture = new Texture(gl, {
        image: initialBackCanvas,
        generateMipmaps: false
      });

      // Back Program
      const backProgram = new Program(gl, {
        vertex: VERTEX_SHADER,
        fragment: BACK_FRAGMENT_SHADER,
        uniforms: {
          uMap: { value: backTexture },
          uBorderRadius: { value: borderRadius },
          uAlpha: { value: 1.0 }
        },
        cullFace: false,
        transparent: true,
        depthTest: true,
        depthWrite: true
      });

      // Back Mesh: rotated 180 degrees around Y axis
      const backMesh = new Mesh(gl, {
        geometry: cardGeometry,
        program: backProgram
      });
      backMesh.position.z = -0.015;
      backMesh.rotation.y = Math.PI;
      backMesh.setParent(flipGroup);

      // Load Image
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = item.image;
      img.onload = () => {
        frontTexture.image = img;
        frontProgram.uniforms.uImageResolution.value = [img.naturalWidth || 1, img.naturalHeight || 1];

        // Re-render back canvas with subtle photo background
        const updatedCanvas = createCardBackCanvas(item, img);
        backTexture.image = updatedCanvas;
      };

      medias.push({
        group,
        flipGroup,
        frontMesh,
        backMesh,
        frontProgram,
        backProgram,
        frontTexture,
        backTexture,
        img,
        index,
        item,
        currentFlip: 0,
        targetFlip: 0,
        currentZoom: 0,
        targetZoom: 0
      });
    });

    // Ensure Poppins font is loaded and refresh textures
    if (document.fonts) {
      document.fonts.ready.then(() => {
        medias.forEach(m => {
          const updated = createCardBackCanvas(m.item, m.img);
          m.backTexture.image = updated;
        });
      });
    }

    // Interaction State
    let targetScroll = 0;
    let currentScroll = 0;
    let isDown = false;
    let startX = 0;
    let startY = 0;
    let lastX = 0;
    let lastY = 0;
    let dragDistance = 0;
    let velocity = 0;
    let animId: number;
    let lastActiveIdx = 0;
    let pointerX = 0;
    let pointerY = 0;
    let isPointerOver = false;
    let zoomedCardIdx: number | null = null;

    // Close zoom ref
    closeZoomRef.current = () => {
      if (zoomedCardIdx !== null) {
        const m = medias[zoomedCardIdx];
        if (m) {
          m.targetZoom = 0;
          m.targetFlip = 0;
        }
        zoomedCardIdx = null;
        setZoomedIndex(null);
        setIsFlipped(false);
      }
    };

    // Toggle Flip for active or zoomed card
    flipTriggerRef.current = () => {
      if (zoomedCardIdx !== null) {
        const m = medias[zoomedCardIdx];
        if (m) {
          const nextFlip = m.targetFlip === 0 ? Math.PI : 0;
          m.targetFlip = nextFlip;
          setIsFlipped(nextFlip !== 0);
        }
      } else {
        // If not zoomed, zoom into active center card
        const m = medias[lastActiveIdx];
        if (m) {
          zoomedCardIdx = lastActiveIdx;
          m.targetZoom = 1.0;
          m.targetFlip = 0;
          setZoomedIndex(lastActiveIdx);
          setIsFlipped(false);
        }
      }
    };

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      renderer.setSize(width, height);
      const aspect = width / height;
      camera.perspective({ aspect });

      if (aspect < 1.2) {
        camera.position.z = 24.0 * (1.15 / Math.max(0.65, aspect));
      } else {
        camera.position.z = 24.0;
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Pointer Handlers
    const onPointerDown = (e: PointerEvent) => {
      isDown = true;
      startX = e.clientX;
      startY = e.clientY;
      lastX = e.clientX;
      lastY = e.clientY;
      dragDistance = 0;
      velocity = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointerX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointerY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      isPointerOver = true;

      if (!isDown) return;
      const deltaX = e.clientX - lastX;
      const deltaY = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      dragDistance += Math.hypot(deltaX, deltaY);

      // Rotate carousel when not zoomed into a card
      if (zoomedCardIdx === null) {
        velocity = deltaX * 0.0022 * scrollSpeed;
        targetScroll += velocity;
      }
    };

    const onPointerLeave = () => {
      isPointerOver = false;
      pointerX = 0;
      pointerY = 0;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;

      // Gentle swipe inertia in carousel mode
      if (zoomedCardIdx === null && Math.abs(velocity) > 0.0008) {
        targetScroll += velocity * 3.5;
      }

      // Click detected (small drag distance < 10px)
      if (dragDistance < 10) {
        const rect = container.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        const aspect = rect.width / rect.height;
        const tanHalfFov = Math.tan((camera.fov * Math.PI) / 360);

        if (zoomedCardIdx !== null) {
          // A card is currently zoomed in ("very near")!
          const m = medias[zoomedCardIdx];
          if (m) {
            const relX = m.group.position.x;
            const relY = m.group.position.y - camera.position.y;
            const relZ = camera.position.z - m.group.position.z;

            const projX = (relX / (relZ * tanHalfFov * aspect)) * (rect.width / 2) + rect.width / 2;
            const projY = (-relY / (relZ * tanHalfFov)) * (rect.height / 2) + rect.height / 2;

            const cardPixelW = (cardWidth / (relZ * tanHalfFov * aspect)) * (rect.width / 2);
            const cardPixelH = (cardHeight / (relZ * tanHalfFov)) * (rect.height / 2);

            const dx = Math.abs(clickX - projX);
            const dy = Math.abs(clickY - projY);

            // Click is ON the zoomed card: FLIP IT!
            if (dx < cardPixelW * 0.52 && dy < cardPixelH * 0.52) {
              const nextFlip = m.targetFlip === 0 ? Math.PI : 0;
              m.targetFlip = nextFlip;
              setIsFlipped(nextFlip !== 0);
            } else {
              // Click outside: Return card to carousel!
              closeZoomRef.current();
            }
          }
        } else {
          // In carousel mode: find which card was clicked to ZOOM IN
          let clickedMedia: MediaItem | null = null;
          let minDistance = Infinity;

          medias.forEach(m => {
            if (!m.frontMesh.visible) return;
            const relX = m.group.position.x;
            const relY = m.group.position.y - camera.position.y;
            const relZ = camera.position.z - m.group.position.z;

            const projX = (relX / (relZ * tanHalfFov * aspect)) * (rect.width / 2) + rect.width / 2;
            const projY = (-relY / (relZ * tanHalfFov)) * (rect.height / 2) + rect.height / 2;

            const cardPixelW = (cardWidth / (relZ * tanHalfFov * aspect)) * (rect.width / 2);
            const cardPixelH = (cardHeight / (relZ * tanHalfFov)) * (rect.height / 2);

            const dx = Math.abs(clickX - projX);
            const dy = Math.abs(clickY - projY);

            if (dx < cardPixelW * 0.52 && dy < cardPixelH * 0.52) {
              const dist = Math.hypot(dx, dy);
              if (dist < minDistance) {
                minDistance = dist;
                clickedMedia = m;
              }
            }
          });

          if (clickedMedia) {
            const targetCard = clickedMedia as MediaItem;
            // FIRST CLICK: Select card & bring it forward without jumping the carousel!
            zoomedCardIdx = targetCard.index;
            targetCard.targetZoom = 1.0;
            targetCard.targetFlip = 0;

            setZoomedIndex(targetCard.index);
            setIsFlipped(false);

            if (onItemClick) {
              onItemClick(targetCard.item, targetCard.index);
            }
          }
        }
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      if (zoomedCardIdx !== null) return;
      const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
      targetScroll -= delta * 0.0010 * scrollSpeed;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && zoomedCardIdx !== null) {
        closeZoomRef.current();
      }
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    container.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('keydown', onKeyDown);

    // Animation Loop
    const update = () => {
      animId = requestAnimationFrame(update);

      // Smooth continuous drift motion from left to right (like before)
      if (!isDown && zoomedCardIdx === null) {
        // Left-to-right motion at the brisk original pace (and gentle slow on hover)
        const driftSpeed = isPointerOver ? 0.0006 : 0.0015;
        targetScroll -= driftSpeed;

        if (Math.abs(targetScroll) > 1000 * Math.PI) {
          targetScroll %= (2 * Math.PI);
          currentScroll %= (2 * Math.PI);
        }
      }

      // Smooth interpolation towards targetScroll (carousel rotation)
      currentScroll += (targetScroll - currentScroll) * scrollEase;

      // Summit Y position & Arch curve factor: pronounced semi-circle curve (0.65 arch factor)
      const summitY = 1.20;
      const archFactor = 0.65;
      // Zoomed Z distance leaves comfortable space and prevents oversized cards
      const nearZ = camera.position.z - 11.4;

      medias.forEach((media, i) => {
        // Lerp zoom progress (0 in carousel, 1 zoomed close)
        media.currentZoom += (media.targetZoom - media.currentZoom) * 0.12;

        // Lerp flip rotation
        media.currentFlip += (media.targetFlip - media.currentFlip) * 0.12;

        let normAngle = (i * angleStep + currentScroll) % (2 * Math.PI);
        if (normAngle > Math.PI) normAngle -= 2 * Math.PI;
        if (normAngle < -Math.PI) normAngle += 2 * Math.PI;

        const distFromCenter = Math.abs(normAngle);

        // Position along the semi-circle arch: deeper curve with pronounced downward bend
        const arcX = Math.sin(normAngle) * radius;
        const arcY = (Math.cos(normAngle) - 1.0) * radius * archFactor + summitY;
        const arcZ = -distFromCenter * 0.28;
        // Natural tangent tilt along the semi-circle curve
        const arcRotZ = -normAngle * 0.76;

        // Zoomed close-up target: centered and elevated higher so it doesn't overlap bottom controls
        const zoomX = 0;
        const zoomY = 0.60;
        const zoomZ = nearZ;
        const zoomRotZ = 0;

        const zProg = media.currentZoom;

        // Position & Rotation interpolation
        media.group.position.x = arcX * (1 - zProg) + zoomX * zProg;
        media.group.position.y = arcY * (1 - zProg) + zoomY * zProg;
        media.group.position.z = arcZ * (1 - zProg) + zoomZ * zProg;
        media.group.rotation.z = arcRotZ * (1 - zProg) + zoomRotZ * zProg;

        // 3D Tilt calculation
        let tiltX = 0;
        let tiltY = 0;
        if (media.currentZoom > 0.4) {
          // Interactive 3D tilt when zoomed in
          tiltX = -pointerY * 0.14 * media.currentZoom;
          tiltY = pointerX * 0.14 * media.currentZoom;
        } else if (distFromCenter < 0.25 && isPointerOver && zoomedCardIdx === null) {
          tiltX = -pointerY * 0.08;
          tiltY = pointerX * 0.08;
        }

        media.flipGroup.rotation.y = media.currentFlip + tiltY;
        media.flipGroup.rotation.x = tiltX;

        // Visibility & Screen-edge span:
        const isThisZoomed = (zoomedCardIdx === i);

        if (isThisZoomed) {
          media.frontMesh.visible = true;
          media.backMesh.visible = true;
          media.frontProgram.uniforms.uAlpha.value = 1.0;
          media.backProgram.uniforms.uAlpha.value = 1.0;
        } else {
          // Allow cards to span all the way around the semi-circle arch
          if (distFromCenter > 1.30) {
            media.frontMesh.visible = false;
            media.backMesh.visible = false;
          } else {
            media.frontMesh.visible = true;
            media.backMesh.visible = true;

            // Smooth subtle edge fade at the screen periphery
            const edgeFade = 1.0 - Math.min(1.0, Math.max(0.0, (distFromCenter - 0.98) / 0.32));
            const alphaVal = Math.max(0.0, Math.min(1.0, edgeFade * 0.95 + 0.05));
            media.frontProgram.uniforms.uAlpha.value = alphaVal;
            media.backProgram.uniforms.uAlpha.value = alphaVal;
          }
        }
      });

      // Update active center card index
      const normalizedScroll = ((-currentScroll % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
      const currIdx = Math.round(normalizedScroll / angleStep) % totalItems;
      const safeIdx = (currIdx + totalItems) % totalItems;

      if (safeIdx !== lastActiveIdx) {
        lastActiveIdx = safeIdx;
        setActiveIndex(safeIdx);
        if (zoomedCardIdx === null) {
          setIsFlipped(medias[safeIdx].targetFlip !== 0);
        }
      }

      renderer.render({ scene, camera });
    };

    update();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('keydown', onKeyDown);
      if (canvas && canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    };
  }, [galleryItems, totalItems, bend, borderRadius, scrollEase, scrollSpeed, gap, onItemClick]);

  const activeItem = zoomedIndex !== null
    ? galleryItems[zoomedIndex] || galleryItems[0]
    : galleryItems[activeIndex] || galleryItems[0];

  return (
    <div className={`circular-gallery-wrapper w-full h-full relative overflow-hidden select-none touch-none ${className}`}>
      {/* WebGL Canvas Container */}
      <div 
        ref={containerRef} 
        className={`w-full h-full relative ${zoomedIndex !== null ? 'cursor-pointer' : 'cursor-grab active:cursor-grabbing'}`}
      />

      {/* Floating Close Button when zoomed in */}
      {zoomedIndex !== null && (
        <div className="absolute top-5 right-5 sm:top-6 sm:right-6 z-30 animate-fadeIn">
          <button
            onClick={handleCloseZoom}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111111]/85 hover:bg-[#111111] text-white/90 hover:text-white border border-white/20 shadow-lg backdrop-blur-md text-xs font-semibold tracking-wider uppercase transition-all duration-200 cursor-pointer active:scale-95 font-sans"
            title="Return to Carousel (Esc)"
          >
            <span className="text-base leading-none">✕</span>
            <span>Close View</span>
          </button>
        </div>
      )}

      {/* Active Information and Interactive Flip Trigger */}
      <div className="absolute bottom-4 sm:bottom-6 inset-x-0 text-center select-none z-10 px-4 transition-all duration-300 pointer-events-none">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-1.5 pointer-events-auto font-sans">
          {/* Category subtitle displayed only when browsing carousel */}
          {zoomedIndex === null && (
            <p className="text-xs sm:text-sm font-medium text-[#777777] tracking-wider uppercase transition-opacity duration-200">
              {activeItem.text}
            </p>
          )}

          {/* Interactive Action Button */}
          <div className="flex items-center justify-center gap-2 mt-0.5">
            <button
              onClick={handleToggleFlip}
              className="group inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-black/15 bg-white/95 hover:bg-white hover:border-black/35 shadow-sm backdrop-blur-md transition-all duration-200 cursor-pointer active:scale-95"
            >
              <span className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${isFlipped ? (activeItem.actualOrigin === 'AI' ? 'bg-[#3b82f6]' : 'bg-[#10b981]') : 'bg-neutral-600'}`} />
              <span className="text-xs font-bold tracking-wider uppercase text-[#111111]">
                {zoomedIndex !== null
                  ? (isFlipped 
                      ? `Flipped: ${activeItem.actualOrigin === 'AI' ? 'AI GENERATED' : 'HUMAN MADE'} (Click to Flip Back ↺)` 
                      : 'Click Card to Flip ↺')
                  : 'Click Card to Zoom In & Inspect'}
              </span>
            </button>
          </div>

          {/* Swipe / drag hint */}
          <p className="text-[10px] text-[#888888] tracking-widest uppercase mt-0.5">
            {zoomedIndex !== null
              ? 'Click card to flip 3D • Click outside or ✕ to return'
              : 'Click any card to zoom in • Drag to rotate archive'}
          </p>
        </div>
      </div>
    </div>
  );
}
