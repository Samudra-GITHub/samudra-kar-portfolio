import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { experiments } from '@/lib/data';

export function Experiments() {
  return (
    <section className="section" id="experiments" data-section="experiments">
      <Reveal className="section-head">
        <div>
          <div className="eyebrow">/ Selected experiments</div>
          <h2 className="section-title">
            Curiosity, <span>in progress.</span>
          </h2>
        </div>
        <p className="section-intro">
          Not every experiment ships. These are the areas I keep returning to between projects.
        </p>
      </Reveal>

      <RevealGroup className="experiments-grid" stagger={0.06}>
        {experiments.map((experiment) => (
          <RevealItem key={experiment.title}>
            <article className="experiment-card glass-card glass-soft">
              <div className="experiment-head">
                <h3>{experiment.title}</h3>
                <span className="tag">{experiment.tag}</span>
              </div>
              <p>{experiment.text}</p>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
