import { motion, useMotionValue, useSpring } from 'framer-motion';
import { createElement, type ReactNode, type MouseEvent, type ElementType } from 'react';
import { useIsTouchDevice } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
  as?: ElementType;
  [key: string]: unknown;
};

export function Magnetic({ children, className, strength = 0.35, as = 'div', ...rest }: MagneticProps) {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const springY = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  if (isTouch || reducedMotion) {
    return createElement(as, { className, ...rest }, children);
  }

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const MotionTag = motion.create(as as ElementType);

  return (
    <MotionTag
      className={className}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      data-cursor-hover
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
