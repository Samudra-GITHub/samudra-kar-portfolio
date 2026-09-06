export const scanGridVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Instrument backdrop: a measured grid with a travelling scan line and
 * occasional register ticks. Replaces the organic caustics field — crisp,
 * aliased, and deliberately mechanical.
 */
export const scanGridFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform vec3  uColor;
  uniform vec3  uScanColor;
  varying vec2  vUv;

  // thin line at a given spacing, antialiased by screen-space derivative
  float gridLine(float coord, float spacing, float width) {
    float f = fract(coord / spacing);
    float d = min(f, 1.0 - f) * spacing;
    return 1.0 - smoothstep(0.0, width, d);
  }

  void main() {
    vec2 uv = vUv;

    // major / minor grid
    float minor = max(gridLine(uv.x, 0.05, 0.0016), gridLine(uv.y, 0.05, 0.0016)) * 0.35;
    float major = max(gridLine(uv.x, 0.25, 0.0028), gridLine(uv.y, 0.25, 0.0028)) * 0.85;
    float grid = max(minor, major);

    // horizontal scan sweeping downward, with a soft trailing edge
    float scanY = fract(uTime * 0.06);
    float dist = uv.y - scanY;
    float scan = smoothstep(0.0, -0.16, dist) * smoothstep(0.006, 0.0, abs(dist)) * 3.0;
    float trail = smoothstep(0.14, 0.0, abs(dist)) * 0.18;

    // register ticks along the scan line
    float ticks = gridLine(uv.x, 0.05, 0.0022) * smoothstep(0.02, 0.0, abs(dist)) * 0.8;

    vec3 col = uColor * grid + uScanColor * (scan + trail + ticks);
    float alpha = (grid * 0.5 + scan + trail + ticks) * uIntensity;

    // fade toward the edges so it doesn't look like a pasted texture
    float d2 = distance(uv, vec2(0.5));
    alpha *= smoothstep(0.62, 0.12, d2);

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;
