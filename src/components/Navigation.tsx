import { useEffect, useState } from 'react';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { Download, Menu, X } from 'lucide-react';
import { navItems } from '@/lib/data';
import { useActiveSection } from '@/hooks/useActiveSection';

export function Navigation() {
  const activeSection = useActiveSection();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`site-nav ${scrolled ? 'is-scrolled' : ''}`} data-testid="site-navigation">
      <a className="wordmark" href="#hero" data-testid="link-wordmark" onClick={() => setMenuOpen(false)} data-cursor-hover>
        <span className="wordmark-mark">SK</span>
        <span>Samudra Kar</span>
        <span className="wordmark-sub">PORTFOLIO</span>
      </a>

      <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
        {navItems.map((item) => {
          const isActive = activeSection === item.href.slice(1);
          return (
            <a
              className={`nav-link ${isActive ? 'is-active' : ''}`}
              href={item.href}
              key={item.href}
              data-testid={`link-nav-${item.label.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              data-cursor-hover
            >
              {isActive && (
                <motion.span
                  className="nav-link-pill"
                  layoutId="nav-pill"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                />
              )}
              <span className="nav-link-label">{item.label}</span>
            </a>
          );
        })}
        <a className="nav-resume" href="/resume.pdf" download data-testid="link-nav-resume" data-cursor-hover>
          <Download size={13} /> Resume
        </a>
      </div>

      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={menuOpen}
        data-testid="button-menu-toggle"
        onClick={() => setMenuOpen((o) => !o)}
        data-cursor-hover
      >
        <AnimatePresence mode="wait" initial={false}>
          {menuOpen ? (
            <motion.span key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.18 }}>
              <X size={18} />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.18 }}>
              <Menu size={18} />
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <motion.div className="nav-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
    </nav>
  );
}
