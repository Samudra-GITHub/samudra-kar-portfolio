import { useEffect, type MutableRefObject } from 'react';

/**
 * The environmental state the 3D scene lerps toward. One object per narrative
 * beat — scroll blends between them, so the world changes weather rather than
 * cutting between scenes.
 */
export type StageState = {
  fogNear: number;
  fogFar: number;
  keyIntensity: number;
  fillIntensity: number;
  goldIntensity: number;
  /** 0 = shards flung wide, 1 = ring closed. */
  ringAssembly: number;
  /** Multiplier on shard drift radius. */
  shardSpread: number;
  causticIntensity: number;
  /** Extra camera dolly, added to the scroll path. */
  cameraPush: number;
};

const STAGES: Record<string, StageState> = {
  hero: {
    fogNear: 9, fogFar: 26, keyIntensity: 90, fillIntensity: 55, goldIntensity: 40,
    ringAssembly: 0, shardSpread: 1, causticIntensity: 0.55, cameraPush: 0,
  },
  about: {
    fogNear: 7, fogFar: 20, keyIntensity: 70, fillIntensity: 70, goldIntensity: 30,
    ringAssembly: 0.15, shardSpread: 0.85, causticIntensity: 0.7, cameraPush: -0.6,
  },
  projects: {
    fogNear: 5, fogFar: 17, keyIntensity: 120, fillIntensity: 28, goldIntensity: 22,
    ringAssembly: 0.3, shardSpread: 0.7, causticIntensity: 0.4, cameraPush: -1.1,
  },
  manifesto: {
    fogNear: 6, fogFar: 19, keyIntensity: 85, fillIntensity: 60, goldIntensity: 55,
    ringAssembly: 1, shardSpread: 0.45, causticIntensity: 0.75, cameraPush: -0.4,
  },
  skills: {
    fogNear: 7, fogFar: 21, keyIntensity: 80, fillIntensity: 65, goldIntensity: 70,
    ringAssembly: 0.55, shardSpread: 1.15, causticIntensity: 0.5, cameraPush: 0.3,
  },
  journey: {
    fogNear: 12, fogFar: 34, keyIntensity: 65, fillIntensity: 48, goldIntensity: 35,
    ringAssembly: 0.2, shardSpread: 1.5, causticIntensity: 0.35, cameraPush: 1.6,
  },
  contact: {
    fogNear: 10, fogFar: 24, keyIntensity: 55, fillIntensity: 42, goldIntensity: 18,
    ringAssembly: 0.08, shardSpread: 0.5, causticIntensity: 0.28, cameraPush: 0.9,
  },
};

/** Sections that own a stage, in document order. */
const ORDER = ['hero', 'about', 'projects', 'manifesto', 'skills', 'journey', 'contact'];

function lerpStage(a: StageState, b: StageState, t: number): StageState {
  const m = (x: number, y: number) => x + (y - x) * t;
  return {
    fogNear: m(a.fogNear, b.fogNear),
    fogFar: m(a.fogFar, b.fogFar),
    keyIntensity: m(a.keyIntensity, b.keyIntensity),
    fillIntensity: m(a.fillIntensity, b.fillIntensity),
    goldIntensity: m(a.goldIntensity, b.goldIntensity),
    ringAssembly: m(a.ringAssembly, b.ringAssembly),
    shardSpread: m(a.shardSpread, b.shardSpread),
    causticIntensity: m(a.causticIntensity, b.causticIntensity),
    cameraPush: m(a.cameraPush, b.cameraPush),
  };
}

export const defaultStage = STAGES.hero;

/**
 * Writes a continuously-blended StageState into `target` on scroll.
 *
 * Rather than snapping on section boundaries, this finds which two staged
 * sections the viewport centre currently sits between and interpolates by the
 * distance between their midpoints — so the environment is always mid-transition
 * somewhere, and never pops.
 *
 * Writes to a ref (not state) so scrolling never triggers a React render.
 */
export function useSceneStage(target: MutableRefObject<StageState>) {
  useEffect(() => {
    let frame = 0;

    const measure = () => {
      frame = 0;
      const centre = window.scrollY + window.innerHeight / 2;

      const points = ORDER.map((id) => {
        const el = document.getElementById(id);
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const top = rect.top + window.scrollY;
        return { id, mid: top + rect.height / 2 };
      }).filter((p): p is { id: string; mid: number } => p !== null);

      if (points.length === 0) return;
      if (points.length === 1) {
        target.current = STAGES[points[0].id] ?? defaultStage;
        return;
      }

      // before the first / after the last midpoint, clamp to that stage
      if (centre <= points[0].mid) {
        target.current = STAGES[points[0].id] ?? defaultStage;
        return;
      }
      const last = points[points.length - 1];
      if (centre >= last.mid) {
        target.current = STAGES[last.id] ?? defaultStage;
        return;
      }

      for (let i = 0; i < points.length - 1; i++) {
        const a = points[i];
        const b = points[i + 1];
        if (centre >= a.mid && centre <= b.mid) {
          const t = (centre - a.mid) / (b.mid - a.mid || 1);
          const sa = STAGES[a.id] ?? defaultStage;
          const sb = STAGES[b.id] ?? defaultStage;
          target.current = lerpStage(sa, sb, t);
          return;
        }
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(measure);
    };

    measure();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [target]);
}
