import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowUpRight, ChevronDown, Download, MoveRight } from 'lucide-react';
import { SocialLinks } from '@/components/SocialLinks';
import { Magnetic } from '@/components/MagneticButton';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsMobile, useIsTouchDevice } from '@/hooks/useMediaQuery';

const ForestGlassScene = lazy(() => import('@/three/ForestGlassScene').then((m) => ({ default: m.ForestGlassScene })));

function HeroVisualOverlay() {
  return (
    <div className="gc-overlay">
      <div className="gc-panel gc-panel-primary">
        <p className="gc-label">Samudra Kar / About me</p>
        <h2 className="gc-headline">
          Student. Builder.<br />
          <span>Designer.</span>
        </h2>
        <p className="gc-bio">
          CSE student going deep on AI &amp; computer vision, with a real interest in frontend and interface design.
        </p>
      </div>

      <div className="gc-panel gc-panel-capabilities">
        <div className="gc-module">
          <span className="gc-module-dot active" />
          <span>Computer Vision</span>
          <small>OpenCV · Deep Learning</small>
        </div>
        <div className="gc-module">
          <span className="gc-module-dot active" />
          <span>Frontend Engineering</span>
          <small>React · TypeScript</small>
        </div>
        <div className="gc-module">
          <span className="gc-module-dot idle" />
          <span>Backend Systems</span>
          <small>FastAPI · Python</small>
        </div>
      </div>

      <div className="gc-panel gc-panel-stats">
        <div className="gc-stat"><strong>3+</strong><span>Projects</span></div>
        <div className="gc-stat"><strong>AI</strong><span>Focused</span></div>
        <div className="gc-stat"><strong>2026</strong><span>Internship</span></div>
      </div>

      <div className="gc-panel gc-badge">
        <span className="gc-badge-dot" />
        Available for internships
      </div>
    </div>
  );
}

function StaticGlassComposition() {
  return (
    <div className="glass-composition" aria-hidden="true">
      <HeroVisualOverlay />
    </div>
  );
}

function HeroVisual({ scrollYProgress }: { scrollYProgress: import('framer-motion').MotionValue<number> }) {
  const reducedMotion = useReducedMotion();
  const isMobile = useIsMobile();
  const isTouch = useIsTouchDevice();
  const scrollRef = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const use3D = !reducedMotion && !isMobile && !isTouch && !contextLost;

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      scrollRef.current = v;
    });
    return unsub;
  }, [scrollYProgress]);

  useEffect(() => {
    if (!use3D || !containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.05 });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [use3D]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onLost = () => setContextLost(true);
    el.addEventListener('webglcontextlost', onLost);
    return () => el.removeEventListener('webglcontextlost', onLost);
  }, []);

  return (
    <div className="hero-visual" aria-hidden="true" ref={containerRef}>
      {use3D ? (
        <>
          <Suspense fallback={<StaticGlassComposition />}>
            <ForestGlassScene scrollProgress={scrollRef} active={inView} />
          </Suspense>
          <HeroVisualOverlay />
        </>
      ) : (
        <StaticGlassComposition />
      )}
    </div>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const copyOpacity = useTransform(scrollYProgress, [0, 0.7], [1, reducedMotion ? 1 : 0]);
  const copyY = useTransform(scrollYProgress, [0, 0.7], [0, reducedMotion ? 0 : -60]);

  return (
    <section className="hero" id="hero" data-section="hero" ref={sectionRef}>
      <motion.div className="hero-copy" style={{ opacity: copyOpacity, y: copyY }}>
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="eyebrow" style={{ marginBottom: '1.5rem' }}>/ Portfolio</div>
        </motion.div>

        <motion.div
          className="availability"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="availability-dot" />
          AVAILABLE FOR INTERNSHIPS
        </motion.div>

        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
        >
          Samudra
          <strong>Kar.</strong>
        </motion.h1>

        <motion.span
          className="hero-role"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
        >
          Computer Science Student / AI Engineer / UI/UX Designer
        </motion.span>

        <motion.p
          className="hero-description"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
        >
          I build intelligent systems and interfaces that make complex technology feel clear, useful, and human.
        </motion.p>

        <motion.p
          className="hero-subline"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          A Computer Science Engineering student going deep on computer vision and AI, while sharpening frontend and
          interface craft — currently looking for internships where both matter.
        </motion.p>

        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.48, ease: [0.16, 1, 0.3, 1] }}
        >
          <Magnetic as="a" className="button button-primary" href="#projects" data-testid="link-view-projects">
            View Projects <MoveRight size={16} />
          </Magnetic>
          <Magnetic as="a" className="button button-ghost" href="/resume.pdf" download data-testid="link-download-resume">
            Download Resume <Download size={15} />
          </Magnetic>
          <Magnetic as="a" className="button button-secondary" href="#studio">
            Start a Project <ArrowUpRight size={15} />
          </Magnetic>
        </motion.div>

        <motion.div
          className="hero-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.56 }}
        >
          <span className="hero-meta-line" />
          Bangalore, India
          <span className="hero-meta-line" />
          {new Date().getFullYear()} / OPEN TO WORK
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.62 }}>
          <SocialLinks />
        </motion.div>
      </motion.div>

      <HeroVisual scrollYProgress={scrollYProgress} />

      <a className="scroll-cue" href="#about" data-testid="link-scroll-about" data-cursor-hover>
        <ChevronDown size={15} />
        <span>Scroll to explore</span>
      </a>
    </section>
  );
}
