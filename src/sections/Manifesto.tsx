import { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const LINES = ['Most of what I know', 'I learned by building', 'something that did not work yet.'];

function Line({
  text,
  index,
  progress,
  accent,
  reduced,
}: {
  text: string;
  index: number;
  progress: MotionValue<number>;
  accent?: boolean;
  reduced: boolean;
}) {
  // Each line owns a generous, gently overlapping slice of the pinned range so
  // the sequence unfolds at a reading pace rather than snapping past.
  const start = 0.1 + index * 0.16;
  const end = start + 0.2;
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const y = useTransform(progress, [start, end], [reduced ? 0 : 28, 0]);
  const blur = useTransform(progress, [start, end], reduced ? ['blur(0px)', 'blur(0px)'] : ['blur(6px)', 'blur(0px)']);

  return (
    <motion.span
      className={`manifesto-line ${accent ? 'is-accent' : ''}`}
      style={{ opacity, y, filter: blur }}
    >
      {text}
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Damp the raw scroll value so the reveal glides instead of tracking the
  // wheel 1:1. Everything below reads from the smoothed value.
  const smooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 26,
    mass: 0.5,
    restDelta: 0.0005,
  });

  // Reduced motion gets the raw value: a trailing spring is exactly the kind of
  // lagging movement those users are asking us not to produce.
  const progress = reduced ? scrollYProgress : smooth;

  const closingOpacity = useTransform(progress, [0.66, 0.84], [0, 1]);
  const markScale = useTransform(progress, [0, 1], [0.9, 1.08]);

  return (
    <section className="manifesto" id="manifesto" data-section="manifesto" ref={ref}>
      <div className="manifesto-sticky">
        <motion.div className="manifesto-inner" style={{ scale: reduced ? 1 : markScale }}>
          <div className="eyebrow">/ Manifesto</div>
          <h2 className="manifesto-copy">
            {LINES.map((line, i) => (
              <Line
                key={line}
                text={line}
                index={i}
                progress={progress}
                accent={i === LINES.length - 1}
                reduced={reduced}
              />
            ))}
          </h2>
          <motion.p className="manifesto-closing" style={{ opacity: closingOpacity }}>
            AkashaLens began as a question about clouds. RINTI began as a question about conversation.
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
