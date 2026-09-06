import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const SIGNAL = new THREE.Color('#8FE85F');
const AMBER = new THREE.Color('#E8A33D');

type Node = {
  pos: THREE.Vector3;
  vel: THREE.Vector3;
  /** Phase offset so nodes don't all pulse in lockstep. */
  phase: number;
};

const BOUNDS = new THREE.Vector3(11, 6, 5);
const LINK_DISTANCE = 3.4;

/**
 * A graph that keeps rewiring itself.
 *
 * Nodes drift on fixed velocities inside a bounded volume; every frame the
 * pairs closer than LINK_DISTANCE get an edge, brightness falling off with
 * distance, so connections form and dissolve continuously. A pulse travels the
 * network on a slow cycle, brightening edges as it passes.
 *
 * Rendered as a single LineSegments with a pre-allocated buffer and a per-frame
 * draw range — one draw call regardless of how many edges currently exist, and
 * no allocation in the animation loop.
 */
export function NodeNetwork({
  count,
  reducedMotion = false,
  scroll,
}: {
  count: number;
  reducedMotion?: boolean;
  scroll: MutableRefObject<number>;
}) {
  const lines = useRef<THREE.LineSegments>(null);
  const points = useRef<THREE.Points>(null);
  const group = useRef<THREE.Group>(null);

  const nodes: Node[] = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * BOUNDS.x * 2,
          (Math.random() - 0.5) * BOUNDS.y * 2,
          (Math.random() - 0.5) * BOUNDS.z * 2 - 2,
        ),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.16,
          (Math.random() - 0.5) * 0.1,
          (Math.random() - 0.5) * 0.08,
        ),
        phase: Math.random() * Math.PI * 2,
      })),
    [count],
  );

  // worst case: every pair connected
  const maxSegments = (count * (count - 1)) / 2;

  const { lineGeometry, linePositions, lineColors } = useMemo(() => {
    const linePositions = new Float32Array(maxSegments * 2 * 3);
    const lineColors = new Float32Array(maxSegments * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    lineGeometry.setAttribute('color', new THREE.BufferAttribute(lineColors, 3));
    lineGeometry.setDrawRange(0, 0);
    return { lineGeometry, linePositions, lineColors };
  }, [maxSegments]);

  const { pointGeometry, pointPositions } = useMemo(() => {
    const pointPositions = new Float32Array(count * 3);
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(pointPositions, 3));
    return { pointGeometry, pointPositions };
  }, [count]);

  const edgeColor = useMemo(() => new THREE.Color(), []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // pulse travels along X, brightening whatever it passes
    const pulseX = reducedMotion ? 0 : Math.sin(t * 0.25) * BOUNDS.x;

    // ── advance nodes ─────────────────────────────────────────────
    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      if (!reducedMotion) {
        n.pos.addScaledVector(n.vel, delta);
        // reflect at the bounds rather than wrapping, so nothing teleports
        if (Math.abs(n.pos.x) > BOUNDS.x) n.vel.x *= -1;
        if (Math.abs(n.pos.y) > BOUNDS.y) n.vel.y *= -1;
        if (Math.abs(n.pos.z + 2) > BOUNDS.z) n.vel.z *= -1;
      }
      pointPositions[i * 3] = n.pos.x;
      pointPositions[i * 3 + 1] = n.pos.y;
      pointPositions[i * 3 + 2] = n.pos.z;
    }
    pointGeometry.attributes.position.needsUpdate = true;

    // ── rebuild edges ─────────────────────────────────────────────
    let v = 0; // vertex cursor
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i].pos;
        const b = nodes[j].pos;
        const dist = a.distanceTo(b);
        if (dist > LINK_DISTANCE) continue;

        // closer pairs read brighter
        const strength = 1 - dist / LINK_DISTANCE;

        // pulse proximity, measured at the edge midpoint
        const midX = (a.x + b.x) * 0.5;
        const pulse = reducedMotion ? 0 : Math.max(0, 1 - Math.abs(midX - pulseX) / 3.5);

        edgeColor.copy(SIGNAL).lerp(AMBER, pulse * 0.7);
        const brightness = strength * 0.5 + pulse * 0.5;

        linePositions[v * 3] = a.x;
        linePositions[v * 3 + 1] = a.y;
        linePositions[v * 3 + 2] = a.z;
        lineColors[v * 3] = edgeColor.r * brightness;
        lineColors[v * 3 + 1] = edgeColor.g * brightness;
        lineColors[v * 3 + 2] = edgeColor.b * brightness;
        v++;

        linePositions[v * 3] = b.x;
        linePositions[v * 3 + 1] = b.y;
        linePositions[v * 3 + 2] = b.z;
        lineColors[v * 3] = edgeColor.r * brightness;
        lineColors[v * 3 + 1] = edgeColor.g * brightness;
        lineColors[v * 3 + 2] = edgeColor.b * brightness;
        v++;
      }
    }

    lineGeometry.setDrawRange(0, v);
    lineGeometry.attributes.position.needsUpdate = true;
    lineGeometry.attributes.color.needsUpdate = true;

    // the whole graph drifts back as the page descends
    if (group.current) {
      group.current.position.z = scroll.current * -3;
      if (!reducedMotion) group.current.rotation.y = Math.sin(t * 0.05) * 0.12;
    }
  });

  return (
    <group ref={group}>
      <lineSegments ref={lines} geometry={lineGeometry} frustumCulled={false}>
        <lineBasicMaterial vertexColors transparent opacity={0.75} depthWrite={false} />
      </lineSegments>

      <points ref={points} geometry={pointGeometry} frustumCulled={false}>
        <pointsMaterial color={SIGNAL} size={0.06} sizeAttenuation transparent opacity={0.9} depthWrite={false} />
      </points>
    </group>
  );
}
