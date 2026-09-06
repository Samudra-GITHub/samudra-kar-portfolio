import { useRef } from 'react';
import { cubicBezier, motion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { journey, journeyWindows } from '@/lib/data';
import { stops } from '@/hooks/useSectionProgress';

/** ease-out quart as a cubic-bezier, applied inside the keyframes rather than
 *  springing the scroll value — arrives quickly, settles slowly. */
const EASE_OUT_QUART = cubicBezier(0.25, 1, 0.5, 1);

function YearBlock({
  entry,
  index,
  progress,
}: {
  entry: (typeof journey)[number];
  index: number;
  progress: MotionValue<number>;
}) {
  // [fadeIn, holdStart, holdEnd, fadeOut] — long hold, short transitions
  const [fadeIn, holdStart, holdEnd, fadeOut] = journeyWindows[index];
  const span = holdEnd - holdStart;

  const opacity = useTransform(
    progress,
    stops([fadeIn, holdStart, holdEnd, fadeOut]),
    [0, 1, 1, 0],
    { ease: EASE_OUT_QUART },
  );
  const y = useTransform(progress, stops([fadeIn, holdStart]), [30, 0], {
    ease: EASE_OUT_QUART,
  });
  // secondary detail lands a beat after the heading and leaves a beat earlier,
  // so each year arrives in two steps rather than all at once
  const detailOpacity = useTransform(
    progress,
    stops([holdStart - span * 0.1, holdStart + span * 0.22, holdEnd - span * 0.16, holdEnd]),
    [0, 1, 1, 0],
    { ease: EASE_OUT_QUART },
  );

  return (
    <motion.article className="orbit-year" style={{ opacity, y }}>
      <div className="orbit-year-head">
        <span className="orbit-year-number">{entry.year}</span>
        <span className="orbit-year-phase">{entry.phase}</span>
      </div>
      <h3>{entry.title}</h3>
      <p className="orbit-year-intro">{entry.intro}</p>

      <motion.div className="orbit-year-groups" style={{ opacity: detailOpacity }}>
        {entry.groups.map((group) => (
          <div className="orbit-group" key={group.label}>
            <span className="orbit-group-label">{group.label}</span>
            <ul>
              {group.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </motion.div>
    </motion.article>
  );
}

export function Journey() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });

  // Lenis already damps scroll — no spring here. All smoothing lives in the
  // easing curves applied inside each transform.
  const progress = scrollYProgress;

  const headOpacity = useTransform(progress, stops([0, 0.06, 0.9, 1]), [0, 1, 1, 0], {
    ease: EASE_OUT_QUART,
  });

  return (
    <section className="orbit-scene" id="journey" data-section="journey" ref={ref}>
      <div className="orbit-sticky">
        <motion.div className="orbit-head" style={{ opacity: headOpacity }}>
          <div className="eyebrow">/ Journey</div>
          <h2 className="section-title">
            Where I&apos;m <span>heading.</span>
          </h2>
        </motion.div>

        <div className="orbit-years">
          {journey.map((entry, i) => (
            <YearBlock key={entry.year} entry={entry} index={i} progress={progress} />
          ))}
        </div>
      </div>
    </section>
  );
}
