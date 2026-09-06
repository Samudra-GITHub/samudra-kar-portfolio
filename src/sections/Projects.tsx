import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Magnetic } from '@/components/MagneticButton';
import { Reveal } from '@/components/Reveal';
import { projects, type Project } from '@/lib/data';
import { useIsMobile } from '@/hooks/useMediaQuery';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ProjectModal } from './ProjectModal';

const LAST = projects.length - 1;

/**
 * "Things I'm building" as a horizontal rail rather than a grid.
 *
 * Desktop pins the section and maps vertical scroll progress to X translation,
 * so the wheel slides the track. Active index derives from the same progress,
 * meaning the highlighted card and the scene lighting can never disagree.
 *
 * Mobile drops the pin entirely and uses native scroll-snap — a horizontal
 * swipe with real momentum beats a hijacked one.
 */
export function Projects() {
  const ref = useRef<HTMLElement>(null);
  const isMobile = useIsMobile();
  const reduced = useReducedMotion();
  const [active, setActive] = useState(0);
  const [open, setOpen] = useState<Project | null>(null);

  const railRef = useRef<HTMLDivElement>(null);

  /**
   * Desktop track: one synchronous scroll listener owns both the rail's X and
   * the active index.
   *
   * Deliberately not framer's useScroll — that measures inside an animation
   * frame, so if frames stall the rail freezes and the section becomes four
   * viewport-heights of one motionless card. Position is read straight from
   * getBoundingClientRect and written straight to style, which cannot stall.
   * Easing is applied to the value here rather than by springing the scroll.
   */
  useEffect(() => {
    if (isMobile) return;
    const section = ref.current;
    if (!section) return;

    const onScroll = () => {
      const rect = section.getBoundingClientRect();
      const range = rect.height - window.innerHeight;
      if (range <= 0) return;
      const raw = Math.min(1, Math.max(0, -rect.top / range));

      /**
       * ease-in-out, not ease-out. This is large object motion, and an ease-out
       * curve reaches 94% by the halfway point — the rail would race to the
       * last card and the middle one would never hold the centre. Symmetric
       * easing gives every card an equal moment while still gliding at the ends.
       */
      const eased = raw < 0.5 ? 4 * raw * raw * raw : 1 - Math.pow(-2 * raw + 2, 3) / 2;

      const rail = railRef.current;
      const cards = rail?.children;
      if (rail && cards && cards.length > 1) {
        /**
         * Centre each card in turn rather than scrolling the rail to its end.
         * With only a few cards the rail is barely wider than the viewport, so
         * an end-to-end scroll hardly moves at all; interpolating between card
         * centres gives every project its own moment on screen.
         */
        const first = cards[0] as HTMLElement;
        const last = cards[cards.length - 1] as HTMLElement;
        const firstCentre = first.offsetLeft + first.offsetWidth / 2;
        const lastCentre = last.offsetLeft + last.offsetWidth / 2;
        const focus = firstCentre + (lastCentre - firstCentre) * eased;
        rail.style.transform = `translate3d(${window.innerWidth / 2 - focus}px, 0, 0)`;
      }

      // each card takes its turn as the highlighted one
      const next = Math.min(LAST, Math.max(0, Math.round(raw * LAST)));
      setActive((prev) => (prev === next ? prev : next));
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isMobile]);

  // mobile: derive the active card from which one is nearest the centre
  useEffect(() => {
    if (!isMobile) return;
    const rail = railRef.current;
    if (!rail) return;
    let frame = 0;
    const measure = () => {
      frame = 0;
      const mid = rail.scrollLeft + rail.clientWidth / 2;
      let best = 0;
      let bestDist = Infinity;
      Array.from(rail.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const c = el.offsetLeft + el.offsetWidth / 2;
        const d = Math.abs(c - mid);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      setActive((prev) => (prev === best ? prev : best));
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };
    measure();
    rail.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      rail.removeEventListener('scroll', onScroll);
    };
  }, [isMobile]);

  const cards = projects.map((project, i) => (
    <ProjectCard
      key={project.id}
      project={project}
      index={i}
      isActive={i === active}
      reduced={reduced}
      onOpen={setOpen}
    />
  ));

  return (
    <section
      className={`track-scene ${isMobile ? 'is-mobile' : ''}`}
      id="projects"
      data-section="projects"
      ref={ref}
    >
      <div className="track-sticky">
        <Reveal className="track-head">
          <div className="eyebrow">/ Featured projects</div>
          <h2 className="section-title">
            Things I&apos;m <span>building.</span>
          </h2>
        </Reveal>

        {isMobile ? (
          <div className="track-rail is-snap" ref={railRef}>
            {cards}
          </div>
        ) : (
          <div className="track-viewport">
            <div className="track-rail" ref={railRef}>
              {cards}
            </div>
          </div>
        )}

        <div className="track-progress" aria-hidden="true">
          {projects.map((p, i) => (
            <span key={p.id} className={`track-pip ${i === active ? 'is-active' : ''}`} />
          ))}
        </div>
      </div>

      <ProjectModal project={open} onClose={() => setOpen(null)} />
    </section>
  );
}

function ProjectCard({
  project,
  index,
  isActive,
  reduced,
  onOpen,
}: {
  project: Project;
  index: number;
  isActive: boolean;
  reduced: boolean;
  onOpen: (p: Project) => void;
}) {
  const ref = useRef<HTMLElement>(null);

  // pointer-tracked tilt + spotlight, written straight to CSS vars so hovering
  // never triggers a React render
  const handleMove = (e: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el || reduced) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
    el.style.setProperty('--tilt-x', `${(0.5 - py) * 5}deg`);
    el.style.setProperty('--tilt-y', `${(px - 0.5) * 6}deg`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <article
      ref={ref}
      className={`track-card ${isActive ? 'is-active' : ''}`}
      data-project={project.id}
      data-testid={`card-project-${index + 1}`}
      data-cursor="view"
      role="button"
      tabIndex={0}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onClick={() => onOpen(project)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onOpen(project);
        }
      }}
    >
      <div className="track-card-spot" aria-hidden="true" />

      <header className="track-card-head">
        <span className="track-card-index">{project.number}</span>
        <span className="track-card-category">{project.category}</span>
      </header>

      <h3>{project.title}</h3>
      <p className="track-card-summary">{project.summary}</p>

      <div className="track-card-why">
        <span className="track-card-why-label">Why it exists</span>
        <p>{project.problem}</p>
      </div>

      <div className="project-tags">
        {project.tags.map((tag) => (
          <span className="tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>

      <footer className="track-card-foot">
        <Magnetic
          as="span"
          className="button button-quiet track-card-cta"
          strength={0.2}
          data-cursor-hover
        >
          View details <ArrowUpRight size={14} />
        </Magnetic>
      </footer>
    </article>
  );
}
