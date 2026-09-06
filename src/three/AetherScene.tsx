import { useMemo, useRef, type MutableRefObject } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Bloom, EffectComposer, Noise, Vignette } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import { scanGridFragmentShader, scanGridVertexShader } from './shaders/scanGrid';
import { ReconstructionField } from './environment/ReconstructionField';
import { NodeNetwork } from './environment/NodeNetwork';
import { SystemsStack } from './scenes/SystemsStack';
import { OrbitalTimeline } from './scenes/OrbitalTimeline';
import type { StageState } from '@/hooks/useSceneStage';
import type { QualitySettings } from '@/hooks/useDeviceTier';
import type { SectionProgress } from '@/hooks/useSectionProgress';

const SIGNAL = '#8FE85F';
const IVORY = '#E9ECE6';
const AMBER = '#E8A33D';
const DEEP = '#070809';

/** Shared chase rate, so the whole environment resolves as one motion. */
const DAMP = 0.045;

type SceneProps = {
  scroll: MutableRefObject<number>;
  stage: MutableRefObject<StageState>;
  quality: QualitySettings;
  reducedMotion: boolean;
  sectionProgress: MutableRefObject<SectionProgress>;
};

/* ────────────────────────────────────────────────────────────
   Scan grid backdrop
   ──────────────────────────────────────────────────────────── */
function ScanGrid({ stage }: { stage: MutableRefObject<StageState> }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const intensity = useRef(0.55);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uIntensity: { value: 0.55 },
      uColor: { value: new THREE.Color(IVORY) },
      uScanColor: { value: new THREE.Color(SIGNAL) },
    }),
    [],
  );

  useFrame(({ clock }) => {
    uniforms.uTime.value = clock.getElapsedTime();
    intensity.current += (stage.current.causticIntensity - intensity.current) * DAMP;
    uniforms.uIntensity.value = intensity.current;
  });

  return (
    <mesh position={[0, 0, -12]} scale={[34, 22, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={scanGridVertexShader}
        fragmentShader={scanGridFragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

/* ────────────────────────────────────────────────────────────
   Data motes — sparse, crisp, no soft halo
   ──────────────────────────────────────────────────────────── */
function DataMotes({ count, reducedMotion }: { count: number; reducedMotion: boolean }) {
  const ref = useRef<THREE.Points>(null);

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 26;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 16;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 14 - 2;
    }
    return arr;
  }, [count]);

  useFrame((_, delta) => {
    if (!ref.current || reducedMotion) return;
    const pos = ref.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i) + delta * 0.1;
      pos.setY(i, y > 8 ? -8 : y);
    }
    pos.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={SIGNAL} size={0.026} transparent opacity={0.4} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/* ────────────────────────────────────────────────────────────
   Lighting + fog, driven by the current stage
   ──────────────────────────────────────────────────────────── */
function StageEnvironment({ stage }: { stage: MutableRefObject<StageState> }) {
  const key = useRef<THREE.PointLight>(null);
  const fill = useRef<THREE.PointLight>(null);
  const current = useRef({ key: 90, fill: 55, near: 9, far: 26 });

  useFrame(({ scene }) => {
    const s = stage.current;
    const c = current.current;

    c.key += (s.keyIntensity - c.key) * DAMP;
    c.fill += (s.fillIntensity - c.fill) * DAMP;
    c.near += (s.fogNear - c.near) * DAMP;
    c.far += (s.fogFar - c.far) * DAMP;

    if (key.current) key.current.intensity = c.key;
    if (fill.current) fill.current.intensity = c.fill;

    if (scene.fog instanceof THREE.Fog) {
      scene.fog.near = c.near;
      scene.fog.far = c.far;
    }
  });

  return (
    <>
      <fog attach="fog" args={[DEEP, 9, 30]} />
      <ambientLight intensity={0.5} color={IVORY} />
      <pointLight ref={key} position={[5, 6, 6]} intensity={90} color={IVORY} distance={34} decay={2} />
      <pointLight ref={fill} position={[-6, -2, 4]} intensity={55} color={AMBER} distance={30} decay={2} />
    </>
  );
}

/* ────────────────────────────────────────────────────────────
   Camera
   ──────────────────────────────────────────────────────────── */
function CameraRig({
  scroll,
  stage,
  reducedMotion,
}: {
  scroll: MutableRefObject<number>;
  stage: MutableRefObject<StageState>;
  reducedMotion: boolean;
}) {
  const { camera, pointer } = useThree();

  const path = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.4, 9),
        new THREE.Vector3(1.6, 0.1, 7.6),
        new THREE.Vector3(-1.4, 0.9, 6.6),
        new THREE.Vector3(-0.4, 1.6, 8.2),
        new THREE.Vector3(1.0, 0.7, 10.4),
        new THREE.Vector3(0, 0.2, 12.6),
      ]),
    [],
  );

  const target = useMemo(() => new THREE.Vector3(), []);
  const desired = useMemo(() => new THREE.Vector3(), []);
  const push = useRef(0);

  useFrame(() => {
    if (reducedMotion) {
      camera.position.set(0, 0.4, 9);
      camera.lookAt(0, 0, 0);
      return;
    }

    const t = THREE.MathUtils.clamp(scroll.current, 0, 1);
    push.current += (stage.current.cameraPush - push.current) * DAMP;

    path.getPointAt(t, desired);
    desired.z += push.current;
    desired.x += pointer.x * 0.9;
    desired.y += pointer.y * 0.5;

    camera.position.lerp(desired, 0.055);
    target.set(0, -t * 0.9, 0);
    camera.lookAt(target);
  });

  return null;
}

/* ────────────────────────────────────────────────────────────
   Scene
   ──────────────────────────────────────────────────────────── */
function SceneContents({ scroll, stage, quality, reducedMotion, sectionProgress }: SceneProps) {
  return (
    <>
      <StageEnvironment stage={stage} />
      <ScanGrid stage={stage} />
      <ReconstructionField density={quality.fieldDensity} scroll={scroll} reducedMotion={reducedMotion} />
      <NodeNetwork count={quality.nodeCount} scroll={scroll} reducedMotion={reducedMotion} />
      <DataMotes count={quality.mistCount} reducedMotion={reducedMotion} />
      <SystemsStack progress={sectionProgress} sectionId="systems" reducedMotion={reducedMotion} />
      <OrbitalTimeline progress={sectionProgress} sectionId="journey" reducedMotion={reducedMotion} />
      <CameraRig scroll={scroll} stage={stage} reducedMotion={reducedMotion} />
    </>
  );
}

export function AetherScene(props: SceneProps) {
  const { quality } = props;

  return (
    <Canvas
      dpr={quality.dpr}
      gl={{ antialias: quality.tier !== 'low', alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0.4, 9], fov: 42 }}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
    >
      <SceneContents {...props} />

      {/* No depth of field (bokeh turned everything to soft blobs) and no
          chromatic aberration — its red/cyan fringing was literally introducing
          blue into a palette that forbids it. */}
      <EffectComposer multisampling={quality.multisampling}>
        {quality.bloom ? (
          <Bloom intensity={0.45} luminanceThreshold={0.35} luminanceSmoothing={0.6} mipmapBlur />
        ) : (
          <></>
        )}
        <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.14} />
        <Vignette eskil={false} offset={0.22} darkness={0.8} />
      </EffectComposer>
    </Canvas>
  );
}

export default AetherScene;
