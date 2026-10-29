import React, { useRef, useMemo } from 'react';
import { motion, useInView } from 'motion/react';

export interface BlurTextProps {
  text?: string;
  children?: React.ReactNode;
  effect?: 'blur' | string;
  animateBy?: 'words' | 'letters';
  direction?: 'top' | 'bottom';
  staggerFrom?: 'start' | 'center' | 'end' | 'first' | 'last';
  trigger?: 'view' | 'mount';
  delay?: number; // in milliseconds
  stepDuration?: number; // in seconds
  blur?: number; // in px
  distance?: number; // in px
  threshold?: number;
  rootMargin?: string;
  className?: string;
  as?: React.ElementType;
  onAnimationComplete?: () => void;
}

export default function BlurText({
  text,
  children,
  effect = 'blur',
  animateBy = 'words',
  direction = 'top',
  staggerFrom = 'start',
  trigger = 'view',
  delay = 200,
  stepDuration = 0.35,
  blur = 10,
  distance = 50,
  threshold = 0.1,
  rootMargin = '-50px',
  className = '',
  as: Component = 'p',
  onAnimationComplete
}: BlurTextProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: threshold });
  const shouldAnimate = trigger === 'mount' ? true : inView;

  const elements = useMemo(() => {
    if (text) {
      return animateBy === 'words' ? text.split(' ') : text.split('');
    }
    if (children) {
      if (typeof children === 'string') {
        return animateBy === 'words' ? children.split(' ') : children.split('');
      }
      return React.Children.toArray(children);
    }
    return [];
  }, [text, children, animateBy]);

  const total = elements.length;

  // Stagger index calculation based on staggerFrom
  const getStaggerDelay = (index: number) => {
    const baseDelaySec = delay / 1000;
    const interval = total <= 4 ? 0.12 : 0.04;
    let rank = index;
    if (staggerFrom === 'center') {
      const mid = (total - 1) / 2;
      rank = Math.abs(index - mid);
    } else if (staggerFrom === 'end' || staggerFrom === 'last') {
      rank = total - 1 - index;
    }
    return baseDelaySec + rank * interval;
  };

  const initialY = direction === 'top' ? -distance : distance;
  const containerClass = className.includes('block') || className.includes('flex') 
    ? className 
    : `inline-block ${className}`;

  return (
    <Component ref={ref} className={containerClass}>
      {elements.map((item, index) => {
        const itemDelay = getStaggerDelay(index);
        const isLast = index === total - 1;

        const wordNode = (
          <motion.span
            key={index}
            initial={{
              opacity: 0,
              filter: `blur(${blur}px)`,
              y: initialY
            }}
            animate={
              shouldAnimate
                ? {
                    opacity: 1,
                    filter: 'blur(0px)',
                    y: 0
                  }
                : {}
            }
            transition={{
              duration: stepDuration,
              delay: itemDelay,
              ease: [0.25, 0.1, 0.25, 1]
            }}
            onAnimationComplete={isLast ? onAnimationComplete : undefined}
            className="inline-block will-change-transform will-change-filter"
          >
            {item}
          </motion.span>
        );

        return animateBy === 'words' && index < total - 1 ? (
          <React.Fragment key={index}>
            {wordNode}
            {' '}
          </React.Fragment>
        ) : (
          wordNode
        );
      })}
    </Component>
  );
}
