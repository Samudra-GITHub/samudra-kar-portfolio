import { useRef } from 'react';
import { motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { stops } from '@/hooks/useSectionProgress';

/**
 * Copy synced to the 3D phases in SystemsStack. Each entry owns a slice of the
 * same 0→1 progress the scene reads, so the words and the geometry describe the
 * same moment. Content is real — these are the four layers Samudra actually
 * works across, not invented architecture.
 */
const PHASES = [
  {
    code: 'LAYER 01',
    title: 'Data',
    body: 'Satellite imagery, live weather feeds, audio. Most of it arrives incomplete, noisy, or occluded — which is usually the interesting part.',
    range: [0.02, 0.26] as const,
  },
  {
    code: 'LAYER 02',
    title: 'AI / ML',
    body: 'Python, OpenCV and deep learning models that reconstruct what the data is missing, rather than just reporting that it is missing.',
    range: [0.26, 0.5] as const,
  },
  {
    code: 'LAYER 03',
    title: 'Backend / API',
    body: 'FastAPI services that carry the result somewhere useful. Predictable contracts, documented endpoints, boring in the best way.',
    range: [0.5, 0.74] as const,
  },
  {
    code: 'LAYER 04',
    title: 'Interface',
    body: 'React and TypeScript, where all of it finally has to make sense to a person. The layer everything else exists to serve.',
    range: [0.74, 1] as const,
  },
];

function PhaseCopy({
  phase,
  progress,
}: {
  phase: (typeof PHASES)[number];
  progress: MotionValue<number>;
}) {
  const [start, end] = phase.range;

  /**
   * Windows deliberately overrun their slice by ±0.05 so neighbouring phases
   * cross-fade. Fading each one out exactly where the next begins leaves a dead
   * zone at every boundary where no copy is visible at all.
   */
  const OVERLAP = 0.05;
  const opacity = useTransform(
    progress,
    stops([start - OVERLAP, start + OVERLAP, end - OVERLAP, end + OVERLAP]),
    [0, 1, 1, 0],
  );
  const y = useTransform(progress, stops([start - OVERLAP, start + OVERLAP]), [26, 0]);

  return (
    <motion.div className="systems-phase" style={{ opacity, y }}>
      <span className="systems-phase-code">{phase.code}</span>
      <h3>{phase.title}</h3>
      <p>{phase.body}</p>
    </motion.div>
  );
}

export function Systems() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  /**
   * No spring here on purpose. Lenis already damps the scroll position, so a
   * spring on top double-smooths it and — worse — makes the copy depend on
   * requestAnimationFrame to catch up. Reading the scroll value directly keeps
   * these phases a pure, immediate function of scroll position.
   */
  const progress = scrollYProgress;
  void reduced;

  return (
    <section className="systems" id="systems" data-section="systems" ref={ref}>
      <div className="systems-sticky">
        <div className="systems-inner">
          <div className="systems-head">
            <div className="eyebrow">/ The stack</div>
            <h2 className="section-title">
              How the parts <span>fit together.</span>
            </h2>
          </div>

          <div className="systems-phases">
            {PHASES.map((p) => (
              <PhaseCopy key={p.code} phase={p} progress={progress} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
