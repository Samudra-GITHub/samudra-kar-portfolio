import { useEffect } from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ArrowUpRight, X } from 'lucide-react';
import type { Project } from '@/lib/data';

const container: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } },
};

export function ProjectModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  useEffect(() => {
    if (!project) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
        <motion.div
          className="project-modal-backdrop"
          initial={{ opacity: 0, pointerEvents: 'none' }}
          animate={{ opacity: 1, pointerEvents: 'auto' }}
          exit={{ opacity: 0, pointerEvents: 'none' }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
        >
          <motion.div
            className="project-modal glass-card glass-strong"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: 18, scale: 0.98, transition: { duration: 0.25 } }}
            variants={container}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="project-modal-close" onClick={onClose} aria-label="Close project details" data-cursor-hover>
              <X size={18} />
            </button>

            <motion.div variants={item} className="project-index">
              {project.number}
            </motion.div>
            <motion.h3 variants={item} id="project-modal-title">
              {project.title}
            </motion.h3>
            <motion.span variants={item} className="project-type">
              {project.category}
            </motion.span>

            <motion.div variants={item} className="project-modal-block">
              <small>The problem</small>
              <p>{project.problem}</p>
            </motion.div>

            <motion.div variants={item} className="project-modal-block">
              <small>What I built</small>
              <p>{project.build}</p>
            </motion.div>

            <motion.div variants={item} className="project-tags">
              {project.tags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </motion.div>

            <motion.p variants={item} className="project-modal-status">
              {project.status}
            </motion.p>

            <motion.a
              variants={item}
              className="button button-primary"
              href={project.link}
              target={project.link.startsWith('http') ? '_blank' : undefined}
              rel={project.link.startsWith('http') ? 'noreferrer' : undefined}
              data-cursor-hover
            >
              {project.linkLabel} <ArrowUpRight size={15} />
            </motion.a>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
