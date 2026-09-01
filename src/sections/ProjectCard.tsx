import { useRef, type MouseEvent } from 'react';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/lib/data';

type ProjectCardProps = {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
};

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${((e.clientX - rect.left) / rect.width) * 100}%`);
    el.style.setProperty('--my', `${((e.clientY - rect.top) / rect.height) * 100}%`);
  };

  return (
    <article
      ref={ref}
      className={`project-card glass-card glass-medium ${project.featured ? 'featured' : ''}`}
      data-testid={`card-project-${index + 1}`}
      onMouseMove={handleMove}
      onClick={() => onOpen(project)}
      role="button"
      tabIndex={0}
      data-cursor-hover
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(project);
        }
      }}
    >
      <div className="project-spotlight" aria-hidden="true" />
      <div>
        <div className="project-index">{project.number}</div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        {project.visual && (
          <div className="project-visual" aria-hidden="true">
            <span className="visual-label">AKASHALENS // SATELLITE VISION</span>
            <div className="visual-scan" />
            <div className="visual-map" />
          </div>
        )}
        <div className="project-tags">
          {project.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
      <div className="project-footer">
        <span className="project-type">{project.category}</span>
        <span className="project-link" data-testid={`link-project-${index + 1}`}>
          View details <ArrowUpRight size={14} />
        </span>
      </div>
    </article>
  );
}
