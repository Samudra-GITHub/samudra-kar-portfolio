/**
 * Point-cloud terrain — the environment's ground plane.
 *
 * A flat grid of vertices displaced on the GPU by layered value noise, so it
 * reads as a depth map being sampled. A scan band travels along Z and lifts the
 * points it passes, which is the whole idea made literal: the surface is only
 * "known" where it has been scanned.
 */
export const pointFieldVertexShader = /* glsl */ `
  uniform float uTime;
  uniform float uScan;      // 0→1 position of the scan band along the field
  uniform float uAmplitude;

  varying float vHeight;
  varying float vScan;
  varying float vDepth;

  vec2 hash(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }
  float noise(vec2 p) {
    vec2 i = floor(p); vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(dot(hash(i), f), dot(hash(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0)), u.x),
      mix(dot(hash(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0)),
          dot(hash(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0; float a = 0.5;
    for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
    return v;
  }

  void main() {
    vec3 pos = position;

    float h = fbm(pos.xz * 0.16 + vec2(uTime * 0.015, 0.0));
    pos.y += h * uAmplitude;
    vHeight = h;

    // scan band sweeping along Z, normalised to the field's extent
    float fieldZ = (pos.z + 30.0) / 60.0;
    float band = smoothstep(0.06, 0.0, abs(fieldZ - uScan));
    pos.y += band * 0.9;
    vScan = band;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vDepth = -mv.z;

    gl_Position = projectionMatrix * mv;
    // nearer points are larger; scanned points flare briefly
    gl_PointSize = (2.4 + band * 5.0) * (34.0 / max(vDepth, 1.0));
  }
`;

export const pointFieldFragmentShader = /* glsl */ `
  uniform vec3  uColor;
  uniform vec3  uScanColor;
  uniform float uOpacity;

  varying float vHeight;
  varying float vScan;
  varying float vDepth;

  void main() {
    // round the point sprite; discard the corners
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;

    // fade with distance so the field dissolves into the dark
    float depthFade = 1.0 - smoothstep(14.0, 46.0, vDepth);
    float lift = smoothstep(-0.25, 0.35, vHeight);

    vec3 col = mix(uColor, uScanColor, vScan);
    float alpha = (0.16 + lift * 0.4 + vScan * 0.85) * depthFade * uOpacity;

    gl_FragColor = vec4(col, alpha);
  }
`;
