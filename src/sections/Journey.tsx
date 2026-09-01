import { useRef } from 'react';
import { motion, useScroll, type Variants } from 'framer-motion';
import { Reveal } from '@/components/Reveal';
import { journey } from '@/lib/data';

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

function TimelineNode({ item: entry, index }: { item: (typeof journey)[number]; index: number }) {
  return (
    <motion.article
      className="timeline-item"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.35 }}
      variants={container}
      transition={{ delay: index * 0.05 }}
    >
      <motion.div variants={item} className="timeline-year">
        {entry.year}
      </motion.div>
      <motion.span
        className="timeline-dot"
        initial={{ scale: 0.6, opacity: 0.5 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.8 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
      <div className="timeline-content">
        <motion.small variants={item}>{entry.phase}</motion.small>
        <motion.h3 variants={item}>{entry.title}</motion.h3>
        <motion.p variants={item} className="timeline-intro">
          {entry.intro}
        </motion.p>
        <motion.div variants={item} className="timeline-groups">
          {entry.groups.map((group) => (
            <div className="timeline-group" key={group.label}>
              <span className="timeline-group-label">{group.label}</span>
              <ul>
                {group.items.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
        </motion.div>
      </div>
    </motion.article>
  );
}

export function Journey() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start 0.8', 'end 0.35'] });

  return (
    <section className="section section-band" id="journey" data-section="journey">
      <div className="journey-wrap">
        <Reveal className="journey-copy">
          <div className="eyebrow">/ My journey</div>
          <h2 className="section-title">
            Where I'm <span>heading.</span>
          </h2>
          <p>A timeline in progress. The direction is clear even when the next experiment isn't.</p>
        </Reveal>

        <div className="timeline" ref={containerRef}>
          <div className="timeline-line-base" aria-hidden="true" />
          <motion.div className="timeline-line-fill" style={{ scaleY: scrollYProgress }} aria-hidden="true" />
          {journey.map((entry, index) => (
            <TimelineNode item={entry} index={index} key={entry.year} />
          ))}
        </div>
      </div>
    </section>
  );
}
