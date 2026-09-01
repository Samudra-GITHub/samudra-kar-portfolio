import { useState } from 'react';
import { Reveal, RevealGroup, RevealItem } from '@/components/Reveal';
import { projects, type Project } from '@/lib/data';
import { ProjectCard } from './ProjectCard';
import { ProjectModal } from './ProjectModal';

export function Projects() {
  const [active, setActive] = useState<Project | null>(null);

  return (
    <section className="section section-band" id="projects" data-section="projects">
      <Reveal className="section-head">
        <div>
          <div className="eyebrow">/ Featured projects</div>
          <h2 className="section-title">
            Things I'm <span>building.</span>
          </h2>
        </div>
        <p className="section-intro">
          A small constellation of experiments and products. Each one starts with a question, not a template.
        </p>
      </Reveal>

      <RevealGroup className="project-layout" stagger={0.1}>
        {projects.map((project, index) => (
          <RevealItem key={project.title} y={28}>
            <ProjectCard project={project} index={index} onOpen={setActive} />
          </RevealItem>
        ))}
      </RevealGroup>

      <ProjectModal project={active} onClose={() => setActive(null)} />
    </section>
  );
}
