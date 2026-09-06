import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  easeInOut,
  easeOutQuart,
  envelope,
  phase,
  type SectionProgress,
} from '@/hooks/useSectionProgress';
import { journey, journeyWindows } from '@/lib/data';

const SIGNAL = new THREE.Color('#8FE85F');
const IVORY = new THREE.Color('#E9ECE6');
const AMBER = new THREE.Color('#E8A33D');

/* ── Tuning knobs ────────────────────────────────────────────
   Radii, sweeps and tilt are the three things worth adjusting to change how
   the instrument reads. Everything else derives from them. */
const RADII = [4.4, 3.2, 2.0]; // outer → inner = 2024 → 2026
const RING_THICKNESS = 0.035;
const TILT_START_DEG = 15; // near edge-on at entry
const TILT_END_DEG = 55; // toward plan view at rest
const READ_HEAD_SIZE = 0.13;
/* ──────────────────────────────────────────────────────────── */

/** Each year's arc sweep is derived from how many milestones it actually holds. */
const RINGS = journey.map((entry, i) => {
  const milestones = entry.groups.flatMap((g) => g.items);
  // more recorded activity = longer arc, floored so nothing is a sliver
  const sweep = THREE.MathUtils.degToRad(120 + milestones.length * 16);
  return {
    year: entry.year,
    phaseLabel: entry.phase,
    radius: RADII[i] ?? 2,
    sweep,
    start: THREE.MathUtils.degToRad(-90) - sweep / 2,
    milestones,
  };
});

type Props = {
  progress: MutableRefObject<SectionProgress>;
  sectionId: string;
  reducedMotion?: boolean;
};

/**
 * SCENE 3 — Journey as instrumentation.
 *
 * Three concentric arcs on a tilting plane, read like a dial rather than a
 * solar system. One ring is active at a time in phosphor green; the others sit
 * back as thin ivory outlines. A single amber read head travels the active arc —
 * a measurement instrument, not a decorative orbit.
 *
 *   0.00 → 0.33  outer arc (2024) active, plane near edge-on
 *   0.33 → 0.66  middle arc (2025) takes over, plane tilts open
 *   0.66 → 1.00  inner arc (2026) active, tilts to plan view and comes to rest
 *
 * The camera is never touched — the global CameraRig owns it. Depth here comes
 * from tilting and advancing the rig itself, so the two never fight.
 */
export function OrbitalTimeline({ progress, sectionId, reducedMotion = false }: Props) {
  const group = useRef<THREE.Group>(null);
  const p = useRef(0);

  useFrame(() => {
    // read scroll directly; no spring, no rAF-dependent smoothing of the source
    p.current = progress.current[sectionId] ?? 0;
    const v = p.current;
    if (!group.current) return;

    const env = envelope(v, 0.1);
    group.current.visible = env > 0.005;

    if (reducedMotion) {
      // resting state only: readable plan view, no choreography
      group.current.rotation.set(-THREE.MathUtils.degToRad(90 - TILT_END_DEG), 0, 0);
      group.current.position.set(0, 0, 0);
      group.current.scale.setScalar(0.92);
      return;
    }

    // plane opens from edge-on toward plan view across the whole scene
    const tiltDeg = THREE.MathUtils.lerp(TILT_START_DEG, TILT_END_DEG, easeInOut(v));
    group.current.rotation.x = -THREE.MathUtils.degToRad(90 - tiltDeg);

    // a slow yaw settles to square as it comes to rest "in orbit"
    group.current.rotation.z = THREE.MathUtils.lerp(0.22, 0, easeInOut(phase(v, 0.55, 1)));

    // advancing inward, ring to ring — scale + push rather than moving the camera
    const advance = easeInOut(v);
    group.current.position.z = advance * 2.4;
    group.current.position.y = -0.5 + advance * 0.4;
    group.current.scale.setScalar((0.82 + advance * 0.26) * (0.9 + env * 0.1));
  });

  return (
    <group ref={group}>
      {RINGS.map((ring, i) => (
        <Ring key={ring.year} ring={ring} index={i} p={p} reducedMotion={reducedMotion} />
      ))}
      <ReadHead p={p} reducedMotion={reducedMotion} />
    </group>
  );
}

/**
 * Shared hold window for ring `i`: [fadeIn, holdStart, holdEnd, fadeOut].
 * Same source the HTML copy reads, so the lit ring and the visible year can
 * never drift apart.
 */
function ringWindow(i: number): readonly [number, number, number, number] {
  return journeyWindows[Math.min(i, journeyWindows.length - 1)];
}

function Ring({
  ring,
  index,
  p,
  reducedMotion,
}: {
  ring: (typeof RINGS)[number];
  index: number;
  p: MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const arcMat = useRef<THREE.MeshBasicMaterial>(null);
  const tickMat = useRef<THREE.MeshBasicMaterial>(null);
  const group = useRef<THREE.Group>(null);

  const arcGeo = useMemo(
    () =>
      new THREE.RingGeometry(
        ring.radius - RING_THICKNESS,
        ring.radius + RING_THICKNESS,
        128,
        1,
        ring.start,
        ring.sweep,
      ),
    [ring.radius, ring.start, ring.sweep],
  );

  // tick marks: one per real milestone, spaced along the arc
  const ticks = useMemo(() => {
    const n = ring.milestones.length;
    return Array.from({ length: n }, (_, i) => {
      const t = n === 1 ? 0.5 : i / (n - 1);
      const angle = ring.start + ring.sweep * t;
      return {
        angle,
        position: new THREE.Vector3(
          Math.cos(angle) * ring.radius,
          Math.sin(angle) * ring.radius,
          0,
        ),
      };
    });
  }, [ring]);

  useFrame(() => {
    const v = p.current;
    const [fadeIn, holdStart, holdEnd, fadeOut] = ringWindow(index);

    // rises into its hold, sits lit for the dwell, then hands over
    const rise = easeOutQuart(phase(v, fadeIn, holdStart));
    const fall = easeOutQuart(phase(v, holdEnd, fadeOut));
    const active = reducedMotion ? (index === RINGS.length - 1 ? 1 : 0) : rise * (1 - fall);

    const env = envelope(v, 0.1);

    if (arcMat.current) {
      // active rings take phosphor; dormant ones fall back to thin ivory
      arcMat.current.color.copy(IVORY).lerp(SIGNAL, active);
      arcMat.current.opacity = (0.16 + active * 0.75) * env;
    }
    if (tickMat.current) {
      tickMat.current.color.copy(IVORY).lerp(SIGNAL, active);
      tickMat.current.opacity = (0.1 + active * 0.7) * env;
    }
    // the active ring lifts marginally off the plane so it reads in front
    if (group.current) group.current.position.z = active * 0.06;
  });

  return (
    <group ref={group}>
      <mesh geometry={arcGeo}>
        <meshBasicMaterial
          ref={arcMat}
          color={IVORY}
          transparent
          opacity={0}
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {ticks.map((tick, i) => (
        <mesh key={i} position={tick.position} rotation={[0, 0, tick.angle]}>
          <boxGeometry args={[0.22, 0.02, 0.02]} />
          <meshBasicMaterial
            ref={i === 0 ? tickMat : undefined}
            color={IVORY}
            transparent
            opacity={0.3}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/**
 * The amber read head. Travels the active arc on an eased sweep, and
 * cross-fades rather than teleporting when the active ring changes.
 */
function ReadHead({ p, reducedMotion }: { p: MutableRefObject<number>; reducedMotion: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const mat = useRef<THREE.MeshBasicMaterial>(null);
  const trailMat = useRef<THREE.MeshBasicMaterial>(null);
  const trail = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const v = p.current;
    // whichever year currently owns the scroll — derived from the same shared
    // windows, so the head is always on the ring the copy is describing
    let index = 0;
    for (let i = 0; i < RINGS.length; i++) {
      if (v >= ringWindow(i)[0]) index = i;
    }
    const ring = RINGS[index];
    const [fadeIn, holdStart, holdEnd, fadeOut] = ringWindow(index);

    // sweeps the arc across the year's dwell, eased so it glides and lands
    const local = easeInOut(phase(v, holdStart, holdEnd));
    const angle = ring.start + ring.sweep * local;

    if (mesh.current) {
      mesh.current.position.set(
        Math.cos(angle) * ring.radius,
        Math.sin(angle) * ring.radius,
        0.1,
      );
    }
    if (trail.current) {
      const trailAngle = ring.start + ring.sweep * Math.max(0, local - 0.05);
      trail.current.position.set(
        Math.cos(trailAngle) * ring.radius,
        Math.sin(trailAngle) * ring.radius,
        0.08,
      );
    }

    // dip the head's opacity through each handoff so it re-appears on the new
    // ring instead of jumping across the gap between them
    const handoff = Math.min(
      easeOutQuart(phase(v, fadeIn, holdStart)),
      1 - easeOutQuart(phase(v, holdEnd, fadeOut)),
    );
    const env = envelope(v, 0.1);
    const alpha = reducedMotion ? 0.7 * env : handoff * env;

    if (mat.current) mat.current.opacity = alpha;
    if (trailMat.current) trailMat.current.opacity = alpha * 0.35;
  });

  return (
    <group>
      <mesh ref={trail}>
        <sphereGeometry args={[READ_HEAD_SIZE * 0.7, 12, 12]} />
        <meshBasicMaterial ref={trailMat} color={AMBER} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={mesh}>
        <sphereGeometry args={[READ_HEAD_SIZE, 16, 16]} />
        <meshBasicMaterial ref={mat} color={AMBER} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
