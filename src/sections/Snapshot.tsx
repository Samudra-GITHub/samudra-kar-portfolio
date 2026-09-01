import { Download } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Magnetic } from '@/components/MagneticButton';
import { quickFacts, skillGroups, projects } from '@/lib/data';

const education = quickFacts.find((f) => f.label === 'Education');
const focus = quickFacts.find((f) => f.label === 'Current focus');
const availability = quickFacts.find((f) => f.label === 'Availability');

export function Snapshot() {
  return (
    <section className="section" id="snapshot" data-section="snapshot">
      <Reveal className="section-head">
        <div>
          <div className="eyebrow">/ At a glance</div>
          <h2 className="section-title">
            The short <span>version.</span>
          </h2>
        </div>
        <p className="section-intro">
          Everything above, compressed into something a busy recruiter can scan in ten seconds.
        </p>
      </Reveal>

      <Reveal delay={0.05} className="snapshot-panel glass-card glass-medium">
        <dl className="snapshot-grid">
          <div className="snapshot-row">
            <dt>Education</dt>
            <dd>
              {education?.value}
              {education?.sub ? ` — ${education.sub}` : ''}
            </dd>
          </div>
          <div className="snapshot-row">
            <dt>Current focus</dt>
            <dd>{focus?.value}</dd>
          </div>
          <div className="snapshot-row">
            <dt>Technical areas</dt>
            <dd className="snapshot-chips">
              {skillGroups.map((group) => (
                <span className="tag" key={group.code}>
                  {group.title}
                </span>
              ))}
            </dd>
          </div>
          <div className="snapshot-row">
            <dt>Projects</dt>
            <dd className="snapshot-chips">
              {projects.map((project) => (
                <a className="tag" href="#projects" key={project.title} data-cursor-hover>
                  {project.title}
                </a>
              ))}
            </dd>
          </div>
          <div className="snapshot-row">
            <dt>Availability</dt>
            <dd>
              {availability?.value}
              {availability?.sub ? ` — ${availability.sub}` : ''}
            </dd>
          </div>
        </dl>

        <Magnetic
          as="a"
          className="button button-ghost snapshot-resume"
          href="/resume.pdf"
          download
          data-testid="link-snapshot-resume"
        >
          Download Resume <Download size={15} />
        </Magnetic>
      </Reveal>
    </section>
  );
}
