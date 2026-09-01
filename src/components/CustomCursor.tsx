import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useIsTouchDevice } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const HOVER_SELECTOR = 'a, button, input, textarea, [data-cursor-hover], [role="button"]';

export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 900, damping: 50, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 50, mass: 0.2 });
  const ringX = useSpring(x, { stiffness: 200, damping: 24, mass: 0.5 });
  const ringY = useSpring(y, { stiffness: 200, damping: 24, mass: 0.5 });

  useEffect(() => {
    if (isTouch) return;

    document.body.classList.add('has-custom-cursor');

    const handleMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      if (!visible) setVisible(true);
    };
    const handleOver = (e: PointerEvent) => {
      const target = e.target as HTMLElement;
      setHovering(Boolean(target.closest?.(HOVER_SELECTOR)));
    };
    const handleLeave = () => setVisible(false);

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerover', handleOver, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerover', handleOver);
      document.removeEventListener('mouseleave', handleLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <div className="cursor-layer" aria-hidden="true" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div
        className="cursor-dot"
        style={{ translateX: dotX, translateY: dotY }}
        animate={{ scale: hovering ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className={`cursor-ring ${hovering ? 'is-hovering' : ''}`}
        style={{
          translateX: reducedMotion ? x : ringX,
          translateY: reducedMotion ? y : ringY,
        }}
        animate={{ scale: hovering ? 1.8 : 1 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
    </div>
  );
}
