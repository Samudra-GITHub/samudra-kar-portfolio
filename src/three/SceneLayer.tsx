import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useDeviceTier } from '@/hooks/useDeviceTier';
import { useSceneStage, defaultStage, type StageState } from '@/hooks/useSceneStage';
import { useSectionProgress } from '@/hooks/useSectionProgress';

const AetherScene = lazy(() => import('./AetherScene').then((m) => ({ default: m.AetherScene })));

/**
 * The persistent 3D layer and the bridge between DOM scroll and the scene.
 *
 * Everything the scene reacts to is written into refs here — never state — so
 * scrolling drives the world without triggering a single React render.
 */
export function SceneLayer() {
  const reducedMotion = useReducedMotion();
  const quality = useDeviceTier();
  const [contextLost, setContextLost] = useState(false);
  const [hidden, setHidden] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef(0);
  const stageRef = useRef<StageState>(defaultStage);

  const { scrollYProgress } = useScroll();

  useSceneStage(stageRef);
  const sectionProgress = useSectionProgress(['systems', 'journey']);

  useEffect(() => {
    const unsub = scrollYProgress.on('change', (v) => {
      scrollRef.current = v;
    });
    return unsub;
  }, [scrollYProgress]);

  // stop rendering entirely when the tab is in the background
  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onLost = () => setContextLost(true);
    el.addEventListener('webglcontextlost', onLost);
    return () => el.removeEventListener('webglcontextlost', onLost);
  }, []);

  const enabled = !contextLost && !hidden;

  return (
    <div className="scene-layer" aria-hidden="true" ref={containerRef}>
      {enabled && (
        <Suspense fallback={null}>
          <AetherScene
            scroll={scrollRef}
            stage={stageRef}
            sectionProgress={sectionProgress}
            quality={quality}
            reducedMotion={reducedMotion}
          />
        </Suspense>
      )}
    </div>
  );
}
