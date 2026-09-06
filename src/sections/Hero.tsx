import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Download, MoveRight } from 'lucide-react';
import { SocialLinks } from '@/components/SocialLinks';
import { Magnetic } from '@/components/MagneticButton';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const ease = [0.16, 1, 0.3, 1] as const;

/**
 * The hero is a scene, not a layout.
 *
 * No panels, no card stack, no dashboard. The 3D reconstruction field
 * (rendered by <SceneLayer />, behind everything) is the hero; this file only
 * floats the identity in the middle of the frame and pins the peripheral
 * details to the corners, so the composition reads as a title card over a world
 * rather than a two-column grid.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });

  // the identity recedes into the scene as you leave it
  const opacity = useTransform(scrollYProgress, [0, 0.65], [1, reducedMotion ? 1 : 0]);
  const y = useTransform(scrollYProgress, [0, 0.65], [0, reducedMotion ? 0 : -70]);
  const scale = useTransform(scrollYProgress, [0, 0.65], [1, reducedMotion ? 1 : 0.96]);

  return (
    <section className="hero" id="hero" data-section="hero" ref={sectionRef}>
      <motion.div className="hero-identity" style={{ opacity, y, scale }}>
        <motion.div
          className="availability"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease }}
        >
          <span className="availability-dot" />
          Available for internships
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 26, filter: 'blur(12px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 1.1, delay: 0.3, ease }}
        >
          Samudra Kar.
        </motion.h1>

        <motion.p
          className="hero-role"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease }}
        >
          Computer Science Student — AI Engineer — UI/UX Designer
        </motion.p>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7, ease }}
        >
          I build intelligent systems and interfaces that make complex technology feel clear, useful, and human.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.85, ease }}
        >
          <Magnetic as="a" className="button button-primary" href="#projects" data-testid="link-view-projects">
            View Projects <MoveRight size={16} />
          </Magnetic>
          <Magnetic as="a" className="button button-ghost" href="/resume.pdf" download data-testid="link-download-resume">
            Download Resume <Download size={15} />
          </Magnetic>
          <Magnetic as="a" className="button button-quiet" href="#contact">
            Let&apos;s connect <ArrowUpRight size={15} />
          </Magnetic>
        </motion.div>
      </motion.div>

      {/* peripheral details, pinned to the frame rather than stacked in a column */}
      <motion.div
        className="hero-corner hero-corner-left"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.05 }}
      >
        <span>Bangalore, India</span>
        <span className="hero-corner-rule" />
        <span>{new Date().getFullYear()} / Open to work</span>
      </motion.div>

      <motion.div
        className="hero-corner hero-corner-right"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.15 }}
      >
        <SocialLinks />
      </motion.div>

      <motion.a
        className="scroll-cue"
        href="#about"
        data-testid="link-scroll-about"
        data-cursor-hover
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, delay: 1.25 }}
      >
        <ChevronDown size={14} />
        <span>Scroll</span>
      </motion.a>
    </section>
  );
}
