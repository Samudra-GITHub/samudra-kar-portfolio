import { useMemo } from 'react';

export type DeviceTier = 'low' | 'medium' | 'high';

export type QualitySettings = {
  tier: DeviceTier;
  dpr: [number, number];
  mistCount: number;
  shardCount: number;
  ringSegments: number;
  /** Points per side of the reconstruction field grid (density² total). */
  fieldDensity: number;
  /** Nodes in the drifting graph. Edge checks are O(n²), so keep it modest. */
  nodeCount: number;
  /** Expensive screen-space passes — dropped entirely on low tier. */
  depthOfField: boolean;
  chromaticAberration: boolean;
  bloom: boolean;
  multisampling: number;
};

const PRESETS: Record<DeviceTier, Omit<QualitySettings, 'tier'>> = {
  low: {
    dpr: [1, 1.25],
    mistCount: 60,
    shardCount: 4,
    ringSegments: 10,
    fieldDensity: 70,
    nodeCount: 18,
    depthOfField: false,
    chromaticAberration: false,
    bloom: true,
    multisampling: 0,
  },
  medium: {
    dpr: [1, 1.5],
    mistCount: 110,
    shardCount: 7,
    ringSegments: 12,
    fieldDensity: 110,
    nodeCount: 28,
    depthOfField: false,
    chromaticAberration: true,
    bloom: true,
    multisampling: 2,
  },
  high: {
    dpr: [1, 2],
    mistCount: 170,
    shardCount: 10,
    ringSegments: 14,
    fieldDensity: 150,
    nodeCount: 40,
    depthOfField: true,
    chromaticAberration: true,
    bloom: true,
    multisampling: 4,
  },
};

function detectTier(): DeviceTier {
  if (typeof window === 'undefined') return 'medium';

  const coarse = window.matchMedia('(pointer: coarse)').matches;
  const narrow = window.innerWidth < 900;
  const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const cores = navigator.hardwareConcurrency;

  // Phones and tablets: never run the full scene, regardless of reported specs.
  if (coarse || narrow) return 'low';
  if ((memory !== undefined && memory <= 4) || (cores !== undefined && cores <= 4)) return 'medium';
  return 'high';
}

/**
 * Resolves a quality budget once per mount. Deliberately not reactive to
 * resize — re-tiering mid-session would remount the whole scene graph.
 */
export function useDeviceTier(): QualitySettings {
  return useMemo(() => {
    const tier = detectTier();
    return { tier, ...PRESETS[tier] };
  }, []);
}
