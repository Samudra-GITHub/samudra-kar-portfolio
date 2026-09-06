import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

const LenisContext = createContext<Lenis | null>(null);

/**
 * Access the live Lenis instance, e.g. `useLenis()?.scrollTo('#projects')`.
 * Returns `null` until the provider has mounted the instance (and permanently
 * `null` if the user prefers reduced motion — see SmoothScrollProvider).
 */
export function useLenis(): Lenis | null {
  return useContext(LenisContext);
}

export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const instance = new Lenis({
      // Lenis drives its own requestAnimationFrame loop — no manual raf wiring needed.
      autoRaf: true,
      // Intercepts clicks on `<a href="#...">` and smooth-scrolls to the target,
      // offset so anchored sections clear the fixed floating nav.
      anchors: { offset: -80 },
      // Lets elements marked `data-lenis-prevent` (dropdowns, modals, code blocks)
      // keep their own native scroll instead of being hijacked.
      allowNestedScroll: true,
      // Honors `prefers-reduced-motion`: smoothing collapses to 1:1 tracking and
      // programmatic scrolls jump instantly, without disabling scroll entirely.
      respectReducedMotion: true,
      // Smooth out wheel input specifically (as opposed to touch/drag).
      smoothWheel: true,
      // Slightly calmer wheel response than the 1x default.
      wheelMultiplier: 0.9,
      // Slightly tighter follow than the 0.1 default — less lag behind the input.
      lerp: 0.07,
    });

    setLenis(instance);

    return () => {
      instance.destroy();
      setLenis(null);
    };
  }, []);

  return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>;
}
