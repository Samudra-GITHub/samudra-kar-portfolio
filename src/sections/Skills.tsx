import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Reveal } from '@/components/Reveal';
import { skillGroups } from '@/lib/data';

export function Skills() {
  const [active, setActive] = useState(0);
  const group = skillGroups[active];
  const Icon = group.icon;

  return (
    <section className="section" id="skills" data-section="skills">
      <Reveal className="section-head">
        <div>
          <div className="eyebrow">/ Skills & technologies</div>
          <h2 className="section-title">
            Tools for <span>intelligent products.</span>
          </h2>
        </div>
        <p className="section-intro">
          I work across the stack — from the first wireframe to the API behind the final interaction.
        </p>
      </Reveal>

      <div className="skills-layout">
        <Reveal delay={0.05}>
          <p className="skill-intro">
            The stack changes. The principle stays the same: make complex systems feel legible, responsive, and worth
            returning to.
          </p>
          <div className="signal-list">
            <span className="signal"><i /> DESIGN WITH INTENT</span>
            <span className="signal"><i /> BUILD FOR CLARITY</span>
            <span className="signal"><i /> LEARN IN PUBLIC</span>
          </div>
        </Reveal>

        <Reveal delay={0.1} className="skill-system">
          <div className="skill-rail" role="tablist" aria-label="Skill categories">
            {skillGroups.map((item, index) => {
              const ItemIcon = item.icon;
              const isActive = index === active;
              return (
                <button
                  key={item.code}
                  role="tab"
                  aria-selected={isActive}
                  className={`skill-rail-item ${isActive ? 'is-active' : ''}`}
                  onMouseEnter={() => setActive(index)}
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  data-cursor-hover
                >
                  {isActive && (
                    <motion.span
                      className="skill-rail-active"
                      layoutId="skill-rail-active"
                      transition={{ type: 'spring', stiffness: 380, damping: 34 }}
                    />
                  )}
                  <ItemIcon size={16} />
                  <span>{item.title}</span>
                  <small>{item.code}</small>
                </button>
              );
            })}
          </div>

          <div className="skill-stage glass-card glass-soft">
            <AnimatePresence mode="wait">
              <motion.div
                key={group.code}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Icon className="skill-stage-watermark" aria-hidden="true" strokeWidth={1} />
                <div className="skill-stage-head">
                  <Icon size={20} style={{ color: 'var(--clr-sage)' }} />
                  <h3>{group.title}</h3>
                </div>
                <p className="skill-stage-summary">{group.summary}</p>
                <p className="skill-stage-focus">{group.focus}</p>
                <div className="skill-pills">
                  {group.skills.map((skill, i) => (
                    <motion.span
                      className="skill-pill"
                      key={skill}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: i * 0.05 }}
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
