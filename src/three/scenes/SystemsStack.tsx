import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ease, phase, type SectionProgress } from '@/hooks/useSectionProgress';

const SIGNAL = '#8FE85F';
const IVORY = '#E9ECE6';
const AMBER = '#E8A33D';

/**
 * The four layers are Samudra's actual skill groups, bottom (data) to top
 * (interface) — so the diagram describes his real stack rather than a
 * decorative one. Order matters: it reads as a system, not a list.
 */
const LAYERS = [
  { id: 'data', label: 'Data', y: -2.4, from: new THREE.Vector3(-9, -5, -4), color: IVORY },
  { id: 'ai', label: 'AI / ML', y: -0.8, from: new THREE.Vector3(9, -2, -6), color: SIGNAL },
  { id: 'api', label: 'Backend / API', y: 0.8, from: new THREE.Vector3(-8, 4, -5), color: IVORY },
  { id: 'ui', label: 'Interface', y: 2.4, from: new THREE.Vector3(8, 6, -3), color: AMBER },
] as const;

const LAYER_W = 5.2;
const LAYER_D = 3.4;

type Props = {
  progress: MutableRefObject<SectionProgress>;
  sectionId: string;
  reducedMotion?: boolean;
};

/**
 * SCENE 1 — Systems architecture.
 *
 * Everything below is a pure function of one scrubbed `progress` value, so
 * scrolling back runs the whole assembly in reverse. No timed animation.
 *
 *   0.00 → 0.25  layers fly in from off-axis and settle into the stack
 *   0.25 → 0.50  vertical beams connect them; a pulse climbs the spine
 *   0.50 → 0.75  the rig rotates to reveal depth; nodes light per layer
 *   0.75 → 1.00  stack compresses and all but the Interface layer dims
 */
export function SystemsStack({ progress, sectionId, reducedMotion = false }: Props) {
  const group = useRef<THREE.Group>(null);
  const smoothed = useRef(0);

  return (
    <group ref={group}>
      {LAYERS.map((layer, i) => (
        <Layer
          key={layer.id}
          layer={layer}
          index={i}
          progress={progress}
          sectionId={sectionId}
          smoothed={smoothed}
          reducedMotion={reducedMotion}
        />
      ))}

      <Spine progress={progress} sectionId={sectionId} smoothed={smoothed} reducedMotion={reducedMotion} />

      <StackRig
        group={group}
        progress={progress}
        sectionId={sectionId}
        smoothed={smoothed}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

/**
 * Owns the damped copy of progress that every part of the scene reads, and
 * applies the whole-rig rotation for phase 3. Kept in one place so the layers,
 * beams and nodes can never drift out of sync with each other.
 */
function StackRig({
  group,
  progress,
  sectionId,
  smoothed,
  reducedMotion,
}: {
  group: MutableRefObject<THREE.Group | null>;
  progress: MutableRefObject<SectionProgress>;
  sectionId: string;
  smoothed: MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  useFrame(() => {
    const target = progress.current[sectionId] ?? 0;
    // damp so a flicked scroll wheel doesn't snap the rig
    smoothed.current += (target - smoothed.current) * (reducedMotion ? 1 : 0.08);
    const p = smoothed.current;

    if (!group.current) return;

    // present only while the section is in play
    const presence = ease(phase(p, 0, 0.06)) * (1 - ease(phase(p, 0.97, 1)));
    group.current.visible = presence > 0.01;
    group.current.scale.setScalar(0.7 + presence * 0.3);

    if (reducedMotion) {
      group.current.rotation.set(0.32, -0.5, 0);
      group.current.position.set(0, 0, 0);
      return;
    }

    // phase 3 orbit — a quarter turn, never a spin
    const orbit = ease(phase(p, 0.5, 0.78));
    group.current.rotation.y = -0.5 + orbit * 1.05;
    group.current.rotation.x = 0.32 - orbit * 0.14;

    // phase 4 compression: the stack settles toward the camera
    const collapse = ease(phase(p, 0.78, 1));
    group.current.position.z = collapse * 1.6;
  });

  return null;
}

function Layer({
  layer,
  index,
  progress,
  sectionId,
  smoothed,
  reducedMotion,
}: {
  layer: (typeof LAYERS)[number];
  index: number;
  progress: MutableRefObject<SectionProgress>;
  sectionId: string;
  smoothed: MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  const frame = useRef<THREE.LineSegments>(null);
  const fillMat = useRef<THREE.MeshStandardMaterial>(null);
  const frameMat = useRef<THREE.LineBasicMaterial>(null);

  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.BoxGeometry(LAYER_W, 0.09, LAYER_D)),
    [],
  );

  // stagger arrivals so the stack builds bottom-up rather than all at once
  const arriveStart = 0.02 + index * 0.05;
  const arriveEnd = arriveStart + 0.16;

  const from = layer.from;
  const target = useMemo(() => new THREE.Vector3(0, layer.y, 0), [layer.y]);
  const current = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    const p = smoothed.current;
    const arrive = ease(phase(p, arriveStart, arriveEnd));

    // fly in from off-axis to the stack position
    current.lerpVectors(from, target, arrive);

    // phase 4: layers draw together vertically
    const collapse = ease(phase(p, 0.78, 1));
    current.y = THREE.MathUtils.lerp(current.y, layer.y * 0.34, collapse);

    if (mesh.current) {
      mesh.current.position.copy(current);
      mesh.current.rotation.y = reducedMotion ? 0 : (1 - arrive) * (index % 2 ? 0.5 : -0.5);
    }
    if (frame.current) {
      frame.current.position.copy(current);
      frame.current.rotation.y = mesh.current?.rotation.y ?? 0;
    }

    // phase 4 highlight: Interface stays lit, the rest recede
    const isHighlight = layer.id === 'ui';
    const dim = isHighlight ? 0 : ease(phase(p, 0.8, 1)) * 0.75;

    if (fillMat.current) {
      fillMat.current.opacity = (0.1 + arrive * 0.16) * (1 - dim);
      fillMat.current.emissiveIntensity = isHighlight ? 0.35 + ease(phase(p, 0.82, 1)) * 0.5 : 0.18;
    }
    if (frameMat.current) {
      frameMat.current.opacity = arrive * 0.85 * (1 - dim);
    }
  });

  return (
    <group>
      {/* translucent slab */}
      <mesh ref={mesh} renderOrder={1}>
        <boxGeometry args={[LAYER_W, 0.09, LAYER_D]} />
        <meshStandardMaterial
          ref={fillMat}
          color={layer.color}
          emissive={layer.color}
          emissiveIntensity={0.2}
          roughness={0.45}
          metalness={0.1}
          transparent
          opacity={0.14}
          depthWrite={false}
        />
      </mesh>

      {/* crisp edge frame — the part that reads as technical */}
      <lineSegments ref={frame} geometry={edges} renderOrder={2}>
        <lineBasicMaterial ref={frameMat} color={layer.color} transparent opacity={0} depthWrite={false} />
      </lineSegments>

      <LayerNodes
        layer={layer}
        index={index}
        smoothed={smoothed}
        position={current}
        reducedMotion={reducedMotion}
      />
    </group>
  );
}

/** Small service nodes sitting on each layer, lit in sequence during phase 3. */
function LayerNodes({
  layer,
  index,
  smoothed,
  position,
  reducedMotion,
}: {
  layer: (typeof LAYERS)[number];
  index: number;
  smoothed: MutableRefObject<number>;
  position: THREE.Vector3;
  reducedMotion: boolean;
}) {
  const points = useRef<THREE.Points>(null);
  const mat = useRef<THREE.PointsMaterial>(null);

  const positions = useMemo(() => {
    const count = 7;
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * (LAYER_W - 0.9);
      arr[i * 3 + 1] = 0.12;
      arr[i * 3 + 2] = (Math.random() - 0.5) * (LAYER_D - 0.7);
    }
    return arr;
  }, []);

  useFrame(({ clock }) => {
    const p = smoothed.current;
    if (points.current) points.current.position.copy(position);

    // each layer's nodes light in turn across phase 3
    const start = 0.5 + index * 0.06;
    const lit = ease(phase(p, start, start + 0.12));
    const flicker = reducedMotion ? 1 : 0.85 + Math.sin(clock.getElapsedTime() * 2.2 + index) * 0.15;

    if (mat.current) mat.current.opacity = lit * 0.9 * flicker;
  });

  return (
    <points ref={points} renderOrder={3}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        ref={mat}
        color={layer.color}
        size={0.1}
        sizeAttenuation
        transparent
        opacity={0}
        depthWrite={false}
      />
    </points>
  );
}

/**
 * The spine: vertical beams linking the layers, with a pulse that climbs from
 * data to interface during phase 2 — the data-flow read.
 */
function Spine({
  progress,
  sectionId,
  smoothed,
  reducedMotion,
}: {
  progress: MutableRefObject<SectionProgress>;
  sectionId: string;
  smoothed: MutableRefObject<number>;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const pulse = useRef<THREE.Mesh>(null);
  const pulseMat = useRef<THREE.MeshBasicMaterial>(null);

  // four uprights at the slab corners
  const uprights = useMemo(() => {
    const x = LAYER_W / 2 - 0.3;
    const z = LAYER_D / 2 - 0.3;
    return [
      [x, z],
      [-x, z],
      [x, -z],
      [-x, -z],
    ] as const;
  }, []);

  const top = LAYERS[LAYERS.length - 1].y;
  const bottom = LAYERS[0].y;
  const height = top - bottom;

  const matRefs = useRef<(THREE.LineBasicMaterial | null)[]>([]);

  useFrame(({ clock }) => {
    const p = smoothed.current;

    // beams draw in during phase 2, one after another
    uprights.forEach((_, i) => {
      const start = 0.26 + i * 0.04;
      const on = ease(phase(p, start, start + 0.14));
      const m = matRefs.current[i];
      if (m) m.opacity = on * 0.5;
    });

    // pulse climbs the spine, looping while phase 2 is active
    const active = ease(phase(p, 0.28, 0.52)) * (1 - ease(phase(p, 0.72, 0.9)));
    if (pulse.current && pulseMat.current) {
      const t = reducedMotion ? 0.5 : (clock.getElapsedTime() * 0.45) % 1;
      pulse.current.position.y = bottom + t * height;
      pulseMat.current.opacity = active * (1 - Math.abs(t - 0.5) * 0.6) * 0.9;
      pulse.current.visible = active > 0.02;
    }
  });

  return (
    <group ref={group}>
      {uprights.map(([x, z], i) => {
        const geo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(x, bottom, z),
          new THREE.Vector3(x, top, z),
        ]);
        return (
          <line key={i}>
            <primitive object={geo} attach="geometry" />
            <lineBasicMaterial
              ref={(el: THREE.LineBasicMaterial | null) => {
                matRefs.current[i] = el;
              }}
              color={SIGNAL}
              transparent
              opacity={0}
              depthWrite={false}
            />
          </line>
        );
      })}

      {/* the travelling pulse */}
      <mesh ref={pulse} renderOrder={4}>
        <sphereGeometry args={[0.11, 16, 16]} />
        <meshBasicMaterial ref={pulseMat} color={SIGNAL} transparent opacity={0} depthWrite={false} />
      </mesh>
    </group>
  );
}
