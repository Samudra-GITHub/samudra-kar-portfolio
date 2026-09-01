import { useEffect } from 'react';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { ArrowUpRight } from 'lucide-react';
import { Router as WouterRouter } from 'wouter';

import { Navigation } from '@/components/Navigation';
import { CustomCursor } from '@/components/CustomCursor';
import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { HowIWork } from '@/sections/HowIWork';
import { Projects } from '@/sections/Projects';
import { Skills } from '@/sections/Skills';
import { Experiments } from '@/sections/Experiments';
import { Journey } from '@/sections/Journey';
import { Snapshot } from '@/sections/Snapshot';
import { Contact } from '@/sections/Contact';
import { StudioSection } from '@/sections/studio';
import '@/sections/studio/studio.css';

const queryClient = new QueryClient();

function Portfolio() {
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: 0.12 },
    );
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  return (
    <div className="site-shell">
      <CustomCursor />
      <div className="site-background" aria-hidden="true">
        <img src="/forest-background.jpg" alt="" className="site-background-image" />
        <div className="site-background-overlay" />
      </div>
      <div className="site-content">
        <Navigation />
        <main className="page-main">
          <Hero />
          <About />
          <StudioSection />
          <Projects />
          <Skills />
          <HowIWork />
          <Experiments />
          <Journey />
          <Snapshot />
          <Contact />
        </main>
        <footer className="site-footer">
          <div className="footer-identity">
            <span className="footer-brand">Samudra Kar</span>
            <span className="footer-role">AI Engineer · UI/UX Designer · Frontend Developer</span>
            <span className="footer-location">Bangalore, India</span>
          </div>
          <p className="footer-statement">Still learning. Still building.</p>
          <div className="footer-meta">
            <span className="footer-note">© {new Date().getFullYear()}</span>
            <a href="#hero" data-testid="link-footer-top" data-cursor-hover>
              Back to top <ArrowUpRight size={13} />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Portfolio />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;
