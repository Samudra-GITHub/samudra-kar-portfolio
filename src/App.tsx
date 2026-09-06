import { ArrowUpRight } from 'lucide-react';
import { Link, Route, Router as WouterRouter, Switch } from 'wouter';

import { Navigation } from '@/components/Navigation';
import { CustomCursor } from '@/components/CustomCursor';
import { Preloader } from '@/components/Preloader';
import { SoundToggle } from '@/components/SoundToggle';
import { SectionSound } from '@/components/SectionSound';
import { SceneLayer } from '@/three/SceneLayer';
import { Portfolio } from '@/pages/Portfolio';
import { Studio } from '@/pages/Studio';
import '@/sections/studio/studio.css';

/**
 * The world shell. Everything environmental — instrument grid, WebGL
 * reconstruction field, scrim, cursor, sound — persists across routes so
 * navigating never tears the environment down and rebuilds it.
 */
function WorldShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site-shell">
      <Preloader />
      <CustomCursor />
      <div className="site-background" aria-hidden="true">
        <div className="site-background-grid" />
        <div className="site-background-overlay" />
      </div>
      <SceneLayer />
      <div className="scene-scrim" aria-hidden="true" />
      <SoundToggle />
      <SectionSound />
      <div className="site-content">
        <Navigation />
        {children}
        <footer className="site-footer">
          <div className="footer-identity">
            <span className="footer-brand">Samudra Kar</span>
            <span className="footer-role">AI Engineer · UI/UX Designer · Frontend Developer</span>
            <span className="footer-location">Bangalore, India</span>
          </div>
          <p className="footer-statement">Still learning. Still building.</p>
          <div className="footer-meta">
            <Link href="/studio" className="footer-link" data-cursor-hover>
              Studio
            </Link>
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
    <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
      <WorldShell>
        <Switch>
          <Route path="/studio" component={Studio} />
          <Route component={Portfolio} />
        </Switch>
      </WorldShell>
    </WouterRouter>
  );
}

export default App;
