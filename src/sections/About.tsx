import { Sparkles } from 'lucide-react';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { quickFacts } from '@/lib/data';

export function About() {
  return (
    <section className="section" id="about" data-section="about">
      <Reveal className="section-head">
        <div>
          <div className="eyebrow">/ About me</div>
          <h2 className="section-title">
            Building AI products that blend <span>design and engineering.</span>
          </h2>
        </div>
        <p className="section-intro">
          A student mindset with a product instinct. I like the space where an ambitious idea becomes a calm, usable
          tool.
        </p>
      </Reveal>

      <div className="about-layout">
        <Reveal className="about-body" delay={0.05}>
          <p>
            I'm Samudra — a Computer Science Engineering student who ended up somewhere between an engineer and a
            designer, and stopped trying to pick one. I like understanding how a system works well enough to build
            it, and I like it enough to also care whether the thing I built actually feels good to use.
          </p>
          <p>
            Most of what I build sits at the edge of <strong>Artificial Intelligence and Computer Vision</strong> —
            teaching systems to make sense of messy, incomplete, or occluded data. AkashaLens came out of exactly
            that itch: satellite imagery is often unusable because of cloud cover, so I built something that
            reconstructs what's hidden instead of just flagging that it's missing.
          </p>
          <p>
            The rest of my time goes toward <strong>Human-Computer Interaction, Frontend Engineering, and Product
            Design</strong> — Figma explorations, interaction details, and interfaces built to hold up under real
            content, not just a clean mockup. I don't see these as separate skill sets. A model that works but is
            impossible to use, and an interface that looks great but solves nothing, fail for the same reason: nobody
            thought about both sides at once.
          </p>
          <p>
            Outside of coursework and projects, I spend a fair amount of time on mobile photography — mostly because
            thinking about framing, light, and composition through a phone camera has quietly made me a better
            interface designer too.
          </p>
          <div className="about-note">
            <Sparkles size={18} />
            <span>
              <strong>Currently building:</strong> AkashaLens, RINTI AI Assistant, and this personal portfolio system.
            </span>
          </div>
        </Reveal>

        <div className="quick-facts">
          <Reveal className="quick-facts-label" delay={0.02}>
            <span className="eyebrow">/ Quick facts</span>
          </Reveal>
          <RevealGroup className="info-grid" stagger={0.08}>
            {quickFacts.map((fact) => (
              <RevealItem key={fact.code}>
                <article className="info-card glass-card glass-soft" data-testid={`card-${fact.label.toLowerCase()}`}>
                  <small>{fact.code}</small>
                  <h3>{fact.value}</h3>
                  {fact.sub && <p>{fact.sub}</p>}
                </article>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>

      <Reveal delay={0.1}>
        <div className="stat-strip" aria-label="Portfolio statistics">
          <div className="stat">
            <strong>3+</strong>
            <span>Major projects</span>
          </div>
          <div className="stat">
            <strong>AI</strong>
            <span>Focused learning</span>
          </div>
          <div className="stat">
            <strong>2026</strong>
            <span>Internship ready</span>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
