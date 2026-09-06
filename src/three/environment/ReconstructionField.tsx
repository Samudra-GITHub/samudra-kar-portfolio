import { useMemo, useRef, type MutableRefObject } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { pointFieldFragmentShader, pointFieldVertexShader } from '../shaders/pointField';

const SIGNAL = '#8FE85F';
const IVORY = '#E9ECE6';

/**
 * The environment: a point cloud of terrain being scanned.
 *
 * A grid of points is displaced by
 * noise on the GPU and swept by a travelling scan band — the surface reads as
 * something being measured and reconstructed rather than something filmed,
 * which is what Samudra's work actually does.
 *
 * One draw call for the whole field, so density costs almost nothing.
 */
export function ReconstructionField({
  density,
  reducedMotion = false,
  scroll,
}: {
  density: number;
  reducedMotion?: boolean;
  scroll: MutableRefObject<number>;
}) {
  const points = useRef<THREE.Points>(null);
  const material = useRef<THREE.ShaderMaterial>(null);

  // flat grid on XZ; the vertex shader supplies all the height
  const geometry = useMemo(() => {
    const size = 60;
    const step = size / density;
    const positions = new Float32Array(density * density * 3);

    let i = 0;
    for (let x = 0; x < density; x++) {
      for (let z = 0; z < density; z++) {
        positions[i++] = x * step - size / 2;
        positions[i++] = 0;
        positions[i++] = z * step - size / 2;
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geo;
  }, [density]);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uScan: { value: 0 },
      uAmplitude: { value: 2.6 },
      uColor: { value: new THREE.Color(IVORY) },
      uScanColor: { value: new THREE.Color(SIGNAL) },
      uOpacity: { value: 1 },
    }),
    [],
  );

  useFrame(({ clock }) => {
    if (!material.current) return;
    const t = clock.getElapsedTime();
    uniforms.uTime.value = reducedMotion ? 0 : t;
    // scan sweeps continuously, and scroll offsets where it currently is
    uniforms.uScan.value = reducedMotion ? 0.5 : (t * 0.06 + scroll.current * 0.5) % 1;
  });

  return (
    <points ref={points} geometry={geometry} position={[0, -4.5, -6]} rotation={[0, 0, 0]}>
      <shaderMaterial
        ref={material}
        uniforms={uniforms}
        vertexShader={pointFieldVertexShader}
        fragmentShader={pointFieldFragmentShader}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}
