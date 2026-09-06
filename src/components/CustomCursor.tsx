import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useIsTouchDevice } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type CursorState = 'default' | 'hover' | 'interactive' | 'view' | 'drag';

const HOVER_SELECTOR = 'a, button, [data-cursor-hover], [role="button"]';
const FIELD_SELECTOR = 'input, textarea, select';

/**
 * Desktop cursor. Five states, driven by `data-cursor` attributes on elements
 * (falling back to element type), each with its own ring scale and optional
 * label. Sage/ivory only, and never rendered on touch devices.
 */
export function CustomCursor() {
  const isTouch = useIsTouchDevice();
  const reducedMotion = useReducedMotion();
  const [state, setState] = useState<CursorState>('default');
  const [visible, setVisible] = useState(false);
  const [pressed, setPressed] = useState(false);

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
      if (!target?.closest) return;

      const explicit = target.closest<HTMLElement>('[data-cursor]');
      if (explicit) {
        const value = explicit.dataset.cursor as CursorState | undefined;
        if (value) return setState(value);
      }
      if (target.closest(FIELD_SELECTOR)) return setState('interactive');
      if (target.closest(HOVER_SELECTOR)) return setState('hover');
      setState('default');
    };

    const handleLeave = () => setVisible(false);
    const handleDown = () => setPressed(true);
    const handleUp = () => setPressed(false);

    window.addEventListener('pointermove', handleMove, { passive: true });
    window.addEventListener('pointerover', handleOver, { passive: true });
    window.addEventListener('pointerdown', handleDown, { passive: true });
    window.addEventListener('pointerup', handleUp, { passive: true });
    document.addEventListener('mouseleave', handleLeave);

    return () => {
      document.body.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerover', handleOver);
      window.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointerup', handleUp);
      document.removeEventListener('mouseleave', handleLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTouch]);

  if (isTouch) return null;

  const effective: CursorState = pressed && state !== 'view' ? 'drag' : state;

  const ringScale = {
    default: 1,
    hover: 1.8,
    interactive: 0.6,
    view: 3.2,
    drag: 1.35,
  }[effective];

  return (
    <div className="cursor-layer" aria-hidden="true" style={{ opacity: visible ? 1 : 0 }}>
      <motion.div
        className="cursor-dot"
        style={{ translateX: dotX, translateY: dotY }}
        animate={{ scale: effective === 'default' || effective === 'drag' ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className={`cursor-ring is-${effective}`}
        style={{
          translateX: reducedMotion ? x : ringX,
          translateY: reducedMotion ? y : ringY,
        }}
        animate={{ scale: ringScale }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <motion.span
          className="cursor-label"
          animate={{ opacity: effective === 'view' ? 1 : 0 }}
          transition={{ duration: 0.18 }}
        >
          View
        </motion.span>
      </motion.div>
    </div>
  );
}
