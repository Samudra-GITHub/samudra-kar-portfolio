import { useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import type { MutableRefObject } from 'react';

const SAGE = '#c9d8a1';
const IVORY = '#f4efdd';
const GOLD = '#d8c581';

type PanelProps = {
  position: [number, number, number];
  rotation: [number, number, number];
  size: [number, number];
  color: string;
  driftSpeed: number;
  driftOffset: number;
};

function GlassPanel({ position, rotation, size, color, driftSpeed, driftOffset }: PanelProps) {
  const ref = useRef<THREE.Mesh>(null);
  const base = useRef(position);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * driftSpeed + driftOffset;
    ref.current.position.y = base.current[1] + Math.sin(t) * 0.18;
    ref.current.position.x = base.current[0] + Math.cos(t * 0.7) * 0.08;
    ref.current.rotation.z = rotation[2] + Math.sin(t * 0.5) * 0.03;
  });

  return (
    <mesh ref={ref} position={position} rotation={rotation}>
      <boxGeometry args={[size[0], size[1], 0.035]} />
      <meshPhysicalMaterial
        color={color}
        transmission={0.92}
        roughness={0.18}
        thickness={0.6}
        ior={1.15}
        transparent
        opacity={0.9}
        attenuationColor={color}
        attenuationDistance={2.2}
        clearcoat={0.4}
        clearcoatRoughness={0.4}
      />
    </mesh>
  );
}

function WireFrame({ position, rotation, size, color, driftSpeed, driftOffset }: PanelProps) {
  const ref = useRef<THREE.LineSegments>(null);
  const base = useRef(position);
  const geometry = useMemo(() => {
    const box = new THREE.BoxGeometry(size[0], size[1], 0.02);
    return new THREE.EdgesGeometry(box);
  }, [size]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.getElapsedTime() * driftSpeed + driftOffset;
    ref.current.position.y = base.current[1] + Math.sin(t + 1.4) * 0.22;
    ref.current.position.x = base.current[0] + Math.cos(t * 0.6) * 0.1;
    ref.current.rotation.z = rotation[2] + Math.cos(t * 0.4) * 0.04;
  });

  return (
    <lineSegments ref={ref} geometry={geometry} position={position} rotation={rotation}>
      <lineBasicMaterial color={color} transparent opacity={0.35} />
    </lineSegments>
  );
}

function MistParticles({ count = 140 }: { count?: number }) {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) + delta * 0.05;
      pos.setY(i, y > 4 ? -4 : y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={IVORY} size={0.028} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function SceneContents({ scrollProgress }: { scrollProgress: MutableRefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const { pointer } = useThree();

  useFrame(() => {
    if (!group.current) return;
    const targetY = pointer.x * 0.22 + scrollProgress.current * 0.9;
    const targetX = -pointer.y * 0.1 + scrollProgress.current * 0.15;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.04;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.04;
    group.current.position.z = scrollProgress.current * -1.2;
  });

  return (
    <group ref={group}>
      <GlassPanel position={[0.9, 0.2, 0]} rotation={[0, 0.15, -0.06]} size={[2.6, 3.4]} color={IVORY} driftSpeed={0.28} driftOffset={0} />
      <GlassPanel position={[-1.3, -0.6, -1.1]} rotation={[0, -0.22, 0.08]} size={[2, 2.6]} color={SAGE} driftSpeed={0.22} driftOffset={2} />
      <GlassPanel position={[0.2, -1.1, -2.1]} rotation={[0, 0.08, 0.03]} size={[1.5, 1.9]} color={GOLD} driftSpeed={0.32} driftOffset={4} />

      <WireFrame position={[-1.9, 1.3, 0.6]} rotation={[0, 0.3, 0.1]} size={[1.3, 1.7]} color={SAGE} driftSpeed={0.4} driftOffset={1} />
      <WireFrame position={[2.1, -1.4, -0.6]} rotation={[0, -0.18, -0.08]} size={[1.1, 1.4]} color={IVORY} driftSpeed={0.36} driftOffset={3} />
      <WireFrame position={[0.6, 1.7, -1.4]} rotation={[0, 0.1, 0.15]} size={[0.9, 0.9]} color={GOLD} driftSpeed={0.44} driftOffset={5} />

      <MistParticles />
    </group>
  );
}

export function ForestGlassScene({
  scrollProgress,
  active = true,
}: {
  scrollProgress: MutableRefObject<number>;
  active?: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 6.5], fov: 38 }}
      frameloop={active ? 'always' : 'never'}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <ambientLight intensity={0.7} color={IVORY} />
      <pointLight position={[3, 4, 5]} intensity={45} color="#f3ecc9" distance={22} decay={2} />
      <pointLight position={[-4, -2, 3]} intensity={26} color={SAGE} distance={22} decay={2} />
      <SceneContents scrollProgress={scrollProgress} />
    </Canvas>
  );
}

export default ForestGlassScene;
