import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const MIN_DURATION = 2000; // hold the opening beat even on a warm cache
const FAILSAFE = 6000;

/**
 * Opening state. Deliberately understated — a breathing glass outline and a
 * single line of copy, no percentage readout or diagnostics. Readiness is real
 * (webfonts resolving), it just isn't narrated as a number.
 */
export function Preloader({ onDone }: { onDone?: () => void }) {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const doneRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const started = performance.now();
    const ready = { fonts: false, image: false };

    const finish = () => {
      if (doneRef.current || cancelled) return;
      doneRef.current = true;
      setVisible(false);
      onDone?.();
    };

    const check = () => {
      if (!ready.fonts || !ready.image) return;
      const elapsed = performance.now() - started;
      window.setTimeout(finish, Math.max(0, MIN_DURATION - elapsed));
    };

    document.fonts?.ready.then(() => {
      ready.fonts = true;
      check();
    });

    // no heavy image to decode now the environment is procedural
    ready.image = true;

    // never let a stalled signal trap the page
    const failsafe = window.setTimeout(finish, FAILSAFE);

    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
    };
  }, [onDone]);

  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [visible]);

  const ease = [0.76, 0, 0.24, 1] as const;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="preloader"
          initial={{ opacity: 1 }}
          exit={
            reducedMotion
              ? { opacity: 0, transition: { duration: 0.25 } }
              : { clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 1.1, ease } }
          }
        >
          <div className="preloader-inner">
            {/* glass outline, slowly breathing */}
            <motion.div
              className="preloader-frame"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={
                reducedMotion
                  ? { opacity: 1, scale: 1 }
                  : { opacity: 1, scale: [0.94, 1, 0.97, 1] }
              }
              transition={
                reducedMotion
                  ? { duration: 0.4 }
                  : { duration: 4.5, ease: 'easeInOut', repeat: Infinity, repeatType: 'mirror' }
              }
            >
              <span className="preloader-mark">SK</span>
            </motion.div>

            <motion.p
              className="preloader-line"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.25, ease }}
            >
              Initialising
              <motion.span
                className="preloader-dots"
                animate={reducedMotion ? {} : { opacity: [0.25, 1, 0.25] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                …
              </motion.span>
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
