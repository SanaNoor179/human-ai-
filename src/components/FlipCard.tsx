/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';

export interface FlipCardProps {
  front: React.ReactNode;
  back: React.ReactNode;
  axis?: 'x' | 'y';
  flipOnClick?: boolean;
  draggable?: boolean;
  dragDistance?: number;
  tilt?: boolean;
  tiltMax?: number;
  glare?: boolean;
  glareOpacity?: number;
  hoverScale?: number;
  perspective?: number;
  stiffness?: number;
  damping?: number;
  width?: number | string;
  height?: number | string;
  radius?: number | string;
  background?: string;
  color?: string;
  shadow?: boolean;
  shadowColor?: string;
  shadowOpacity?: number;
  onFlipChange?: (flipped: boolean) => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function FlipCard({
  front,
  back,
  axis = 'y',
  flipOnClick = true,
  draggable = false,
  dragDistance = 0,
  tilt = true,
  tiltMax = 12,
  glare = true,
  glareOpacity = 0.22,
  hoverScale = 1.03,
  perspective = 1100,
  width = 300,
  height = 400,
  radius = 22,
  background = '#27272a',
  color = '#f5f5f5',
  shadow = true,
  shadowColor = '#000000',
  shadowOpacity = 0.45,
  onFlipChange,
  className = '',
  style = {}
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [tiltState, setTiltState] = useState({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });
  const cardRef = useRef<HTMLDivElement>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleFlip = useCallback(() => {
    setIsFlipped(prev => {
      const next = !prev;
      if (onFlipChange) onFlipChange(next);
      return next;
    });
  }, [onFlipChange]);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!dragStartRef.current) return;
    const dx = Math.abs(e.clientX - dragStartRef.current.x);
    const dy = Math.abs(e.clientY - dragStartRef.current.y);
    dragStartRef.current = null;

    if (flipOnClick && dx <= (dragDistance || 5) && dy <= (dragDistance || 5)) {
      handleFlip();
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!tilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const tiltY = ((x - centerX) / centerX) * tiltMax;
    const tiltX = -((y - centerY) / centerY) * tiltMax;

    setTiltState({
      x: tiltX,
      y: tiltY,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      isHovered: true
    });
  };

  const handlePointerLeave = () => {
    setTiltState({ x: 0, y: 0, glareX: 50, glareY: 50, isHovered: false });
  };

  const rotAxis = axis === 'x' ? 'rotateX' : 'rotateY';
  const flipAngle = isFlipped ? 180 : 0;
  const currentTiltX = tiltState.isHovered ? tiltState.x : 0;
  const currentTiltY = tiltState.isHovered ? tiltState.y : 0;
  const scale = tiltState.isHovered ? hoverScale : 1;

  const cardShadow = shadow
    ? `0 20px 35px -10px ${shadowColor}${Math.round(shadowOpacity * 255).toString(16).padStart(2, '0')}`
    : 'none';

  return (
    <div
      ref={cardRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative select-none cursor-pointer ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        perspective: `${perspective}px`,
        ...style
      }}
    >
      <div
        className="w-full h-full relative transition-transform duration-500 ease-out preserve-3d"
        style={{
          transformStyle: 'preserve-3d',
          transform: `scale(${scale}) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg) ${rotAxis}(${flipAngle}deg)`,
          borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
          boxShadow: cardShadow
        }}
      >
        {/* FRONT FACE */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
            backgroundColor: background,
            color
          }}
        >
          {front}

          {/* Interactive Glare Overlay */}
          {glare && tiltState.isHovered && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-200"
              style={{
                background: `radial-gradient(circle at ${tiltState.glareX}% ${tiltState.glareY}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 60%)`,
                borderRadius: typeof radius === 'number' ? `${radius}px` : radius
              }}
            />
          )}
        </div>

        {/* BACK FACE */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            transform: `${rotAxis}(180deg)`,
            borderRadius: typeof radius === 'number' ? `${radius}px` : radius,
            backgroundColor: background,
            color
          }}
        >
          {back}

          {/* Interactive Glare Overlay for back */}
          {glare && tiltState.isHovered && (
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-200"
              style={{
                background: `radial-gradient(circle at ${tiltState.glareX}% ${tiltState.glareY}%, rgba(255,255,255,${glareOpacity}) 0%, transparent 60%)`,
                borderRadius: typeof radius === 'number' ? `${radius}px` : radius
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
