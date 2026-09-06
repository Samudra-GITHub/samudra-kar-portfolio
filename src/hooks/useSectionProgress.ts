import { useEffect, useRef, type MutableRefObject } from 'react';

export type SectionProgress = Record<string, number>;

/**
 * Per-section scroll progress, 0 → 1, for any element carrying an id.
 *
 * This is the single `progress` signal every 3D scene is derived from. Because
 * it is a pure function of scroll position (never a timed animation), scrubbing
 * backwards runs every scene in reverse for free.
 *
 * Progress is measured across the section's *pinnable* range — the distance the
 * document scrolls while the section occupies the viewport — so a section that
 * is 400vh tall with a 100vh sticky child reads 0 the moment it pins and 1 the
 * moment it unpins.
 *
 * Written into a ref rather than state: the 3D reads it inside useFrame, so
 * scrolling must never trigger a React render.
 */
export function useSectionProgress(ids: string[]): MutableRefObject<SectionProgress> {
  const progress = useRef<SectionProgress>({});
  // ids is typically a literal array; join it so the effect doesn't re-run on
  // every render just because the array identity changed
  const key = ids.join('|');

  useEffect(() => {
    const list = key.split('|').filter(Boolean);
    let frame = 0;

    const measure = () => {
      frame = 0;
      const next: SectionProgress = {};

      for (const id of list) {
        const el = document.getElementById(id);
        if (!el) {
          next[id] = 0;
          continue;
        }

        const rect = el.getBoundingClientRect();
        const range = rect.height - window.innerHeight;

        if (range <= 0) {
          // shorter than the viewport: progress as it crosses the middle
          const centre = rect.top + rect.height / 2;
          const t = 1 - (centre - window.innerHeight / 2) / window.innerHeight;
          next[id] = Math.min(1, Math.max(0, t));
          continue;
        }

        next[id] = Math.min(1, Math.max(0, -rect.top / range));
      }

      progress.current = next;
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
  }, [key]);

  return progress;
}

/**
 * Remaps a 0→1 progress value onto a sub-range, clamped.
 * `phase(p, 0.25, 0.5)` gives 0 before 0.25, 0→1 across the phase, 1 after.
 */
export function phase(p: number, start: number, end: number): number {
  if (end <= start) return p >= end ? 1 : 0;
  return Math.min(1, Math.max(0, (p - start) / (end - start)));
}

/** Smoothstep easing — used everywhere so phases blend rather than corner. */
export function ease(t: number): number {
  const x = Math.min(1, Math.max(0, t));
  return x * x * (3 - 2 * x);
}

/**
 * Builds a clamped, strictly-increasing keyframe stop list for useTransform.
 *
 * Phase windows deliberately overrun their slice so neighbours cross-fade,
 * which can push offsets below 0 or above 1. The Web Animations API rejects
 * those outright ("Offsets must be null or in the range [0,1]"), so stops are
 * clamped here and nudged apart to stay strictly increasing — a zero-width
 * segment is also rejected.
 */
export function stops(values: number[]): number[] {
  const EPS = 1e-4;
  const out: number[] = [];
  for (let i = 0; i < values.length; i++) {
    let v = Math.min(1, Math.max(0, values[i]));
    if (i > 0 && v <= out[i - 1]) v = Math.min(1, out[i - 1] + EPS);
    out.push(v);
  }
  return out;
}

/* ────────────────────────────────────────────────────────────
   Easing vocabulary
   ────────────────────────────────────────────────────────────
   Scroll position is the single source of truth and is never sprung — Lenis
   already damps it. All smoothness comes from shaping values *inside* the
   transform with these curves, which keeps every scene a deterministic,
   reversible function of progress.

   Rule of thumb used across the scenes:
     easeInOut   — camera moves and large object transforms (glide in, glide out)
     easeOutQuart — opacity and scale (arrives fast, settles slowly, no snap)
     easeOutBack — the small "landing" overshoot at the end of a phase
   ──────────────────────────────────────────────────────────── */

const clamp01 = (t: number) => Math.min(1, Math.max(0, t));

/** Symmetric glide. Slow at both ends — for camera and big transforms. */
export function easeInOut(t: number): number {
  const x = clamp01(t);
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

/** Fast arrival, long settle. For opacity, scale, light ramps. */
export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - clamp01(t), 4);
}

/** Very fast arrival — for fades that must clear quickly without popping. */
export function easeOutExpo(t: number): number {
  const x = clamp01(t);
  return x === 1 ? 1 : 1 - Math.pow(2, -10 * x);
}

/**
 * A single micro-overshoot that resolves — the "landing" at the end of a
 * phase, so movement settles instead of simply stopping at its target.
 */
export function easeOutBack(t: number, amount = 1.18): number {
  const x = clamp01(t);
  const c3 = amount + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + amount * Math.pow(x - 1, 2);
}

/**
 * Soft entry/exit envelope for a whole scene: ramps 0→1 over `fade` at the
 * start and back to 0 over `fade` at the end, eased at both ends so nothing
 * ever pops into or out of existence.
 */
export function envelope(p: number, fade = 0.1): number {
  const inn = easeOutQuart(phase(p, 0, fade));
  const out = 1 - easeInOut(phase(p, 1 - fade, 1));
  return inn * out;
}

/**
 * Phase value with a landing. Rises across [start,end] on an ease-out curve,
 * then holds — and reports how far past the end we are so callers can apply a
 * settle. Returns [value, settled] where `settled` is 0→1 after the phase ends.
 */
export function phaseSettle(
  p: number,
  start: number,
  end: number,
  settleLength = 0.06,
): [number, number] {
  const value = easeOutQuart(phase(p, start, end));
  const settled = easeOutQuart(phase(p, end, end + settleLength));
  return [value, settled];
}
