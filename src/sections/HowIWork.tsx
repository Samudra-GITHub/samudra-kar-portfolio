import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { principles } from '@/lib/data';

export function HowIWork() {
  return (
    <section className="section" id="how-i-work" data-section="how-i-work">
      <Reveal className="section-head">
        <div>
          <div className="eyebrow">/ How I work</div>
          <h2 className="section-title">
            A quiet <span>working philosophy.</span>
          </h2>
        </div>
        <p className="section-intro">
          Nothing dramatic — just a few ideas I keep coming back to, in roughly the order I use them.
        </p>
      </Reveal>

      <RevealGroup className="principles-list" stagger={0.08}>
        {principles.map((principle) => (
          <RevealItem key={principle.index}>
            <article className="principle-item">
              <span className="principle-index">{principle.index}</span>
              <div className="principle-body">
                <h3>{principle.title}</h3>
                <p>{principle.text}</p>
              </div>
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </section>
  );
}
