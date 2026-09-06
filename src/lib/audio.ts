/**
 * Procedural audio engine.
 *
 * Every sound here is synthesised at runtime with the Web Audio API — there are
 * no audio files in this project. The bed is deliberately calm: a low sine pad,
 * a brown-noise hush, and slow breathing across both. Nothing bright, nothing
 * with a sharp transient — closer to room tone than to an interface.
 *
 * Muted by default: browsers block audio before a user gesture, and unannounced
 * sound is hostile. The toggle is the only thing that starts it.
 */

const STORAGE_KEY = 'aether-x:sound';

/** Everything sits under this, so the whole bed stays background-quiet. */
const MASTER_LEVEL = 0.24;

class AudioEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private ambientNodes: AudioNode[] = [];
  private started = false;
  private _enabled = false;

  get enabled() {
    return this._enabled;
  }

  /** Restore the user's previous choice (defaults to off). */
  restore(): boolean {
    try {
      this._enabled = localStorage.getItem(STORAGE_KEY) === 'on';
    } catch {
      this._enabled = false;
    }
    return this._enabled;
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, this._enabled ? 'on' : 'off');
    } catch {
      /* storage unavailable — preference just won't survive a reload */
    }
  }

  private ensureContext(): AudioContext | null {
    if (this.ctx) return this.ctx;
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);
    return this.ctx;
  }

  /**
   * Brown noise — the integrated (1/f²) kind. Rounder and darker than white
   * noise, which is what makes it read as air or breath rather than as hiss.
   */
  private brownNoise(seconds: number, level: number): AudioBuffer | null {
    const ctx = this.ctx;
    if (!ctx) return null;
    const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < data.length; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5 * level;
    }
    return buffer;
  }

  /** Low sine pad + brown-noise hush, both breathing slowly. */
  private startAmbient() {
    const ctx = this.ctx;
    const master = this.master;
    if (!ctx || !master || this.started) return;
    this.started = true;

    const bed = ctx.createGain();
    bed.gain.value = 0.5;
    bed.connect(master);

    // one slow breath shared by pad and hush, so they rise and fall together
    const breath = ctx.createOscillator();
    breath.frequency.value = 0.035; // ~29s per cycle
    const breathDepth = ctx.createGain();
    breathDepth.gain.value = 0.16;
    breath.connect(breathDepth);
    breathDepth.connect(bed.gain);
    breath.start();
    this.ambientNodes.push(breath, breathDepth);

    // --- pad: sines only, an open fifth with octaves around it ---
    const padFilter = ctx.createBiquadFilter();
    padFilter.type = 'lowpass';
    padFilter.frequency.value = 260;
    padFilter.Q.value = 0.4; // no resonant peak — resonance is what sounds synthetic
    padFilter.connect(bed);

    [55, 82.4, 110, 164.8].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.value = freq;
      osc.detune.value = (i - 1.5) * 3; // barely-there beating, not chorus

      const g = ctx.createGain();
      g.gain.value = 0.13 / (i + 1);
      osc.connect(g);
      g.connect(padFilter);
      osc.start();
      this.ambientNodes.push(osc, g);
    });

    // very slow filter drift so the pad never sits perfectly still
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.022;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 70;
    lfo.connect(lfoGain);
    lfoGain.connect(padFilter.frequency);
    lfo.start();
    this.ambientNodes.push(lfo, lfoGain, padFilter, bed);

    // --- hush: brown noise under a gentle lowpass, no bandpass whistle ---
    const noiseBuffer = this.brownNoise(6, 0.5);
    if (noiseBuffer) {
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;

      const airFilter = ctx.createBiquadFilter();
      airFilter.type = 'lowpass';
      airFilter.frequency.value = 520;
      airFilter.Q.value = 0.3;

      const airGain = ctx.createGain();
      airGain.gain.value = 0.09;

      const airLfo = ctx.createOscillator();
      airLfo.frequency.value = 0.028;
      const airLfoGain = ctx.createGain();
      airLfoGain.gain.value = 150;
      airLfo.connect(airLfoGain);
      airLfoGain.connect(airFilter.frequency);
      airLfo.start();

      noise.connect(airFilter);
      airFilter.connect(airGain);
      airGain.connect(bed);
      noise.start();

      this.ambientNodes.push(noise, airFilter, airGain, airLfo, airLfoGain);
    }
  }

  async toggle(): Promise<boolean> {
    const ctx = this.ensureContext();
    if (!ctx || !this.master) return false;
    if (ctx.state === 'suspended') await ctx.resume();

    this._enabled = !this._enabled;
    this.persist();

    if (this._enabled) {
      this.startAmbient();
      this.master.gain.cancelScheduledValues(ctx.currentTime);
      // long fade — the bed should appear, not switch on
      this.master.gain.setTargetAtTime(MASTER_LEVEL, ctx.currentTime, 1.6);
    } else {
      this.master.gain.cancelScheduledValues(ctx.currentTime);
      this.master.gain.setTargetAtTime(0, ctx.currentTime, 0.6);
    }

    return this._enabled;
  }

  /** Pointer entering something interactive — a soft, low breath of a tone. */
  hover() {
    this.tone(392, 0.34, 0.022);
  }

  /** Confirmation: a rounder note lower down, falling slightly. */
  click() {
    this.tone(262, 0.55, 0.038, 196);
  }

  /** Air moving as a new section arrives — noise only, no pitched sweep. */
  swell() {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this._enabled) return;

    const buffer = this.brownNoise(1.6, 0.6);
    if (!buffer) return;

    const src = ctx.createBufferSource();
    src.buffer = buffer;

    // opens a little and closes again — a breath, not a riser
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.Q.value = 0.4;
    filter.frequency.setValueAtTime(240, ctx.currentTime);
    filter.frequency.linearRampToValueAtTime(760, ctx.currentTime + 0.7);
    filter.frequency.linearRampToValueAtTime(300, ctx.currentTime + 1.5);

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 0.55);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.55);

    src.connect(filter);
    filter.connect(g);
    g.connect(this.master);
    src.start();
    src.stop(ctx.currentTime + 1.6);
  }

  /**
   * Shared UI voice: a sine with a slow attack and a long tail. The slow attack
   * is the whole point — a fast one produces a click, and clicks are what make
   * interface audio tiring.
   */
  private tone(freq: number, dur: number, peak: number, endFreq?: number) {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this._enabled) return;

    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    if (endFreq) osc.frequency.exponentialRampToValueAtTime(endFreq, ctx.currentTime + dur);

    // takes the top off so even the attack has no edge
    const soften = ctx.createBiquadFilter();
    soften.type = 'lowpass';
    soften.frequency.value = 1400;
    soften.Q.value = 0.4;

    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(peak, ctx.currentTime + dur * 0.3);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);

    osc.connect(soften);
    soften.connect(g);
    g.connect(this.master);
    osc.start();
    osc.stop(ctx.currentTime + dur + 0.05);
  }

  destroy() {
    this.ambientNodes.forEach((node) => {
      if ('stop' in node && typeof (node as OscillatorNode).stop === 'function') {
        try {
          (node as OscillatorNode).stop();
        } catch {
          /* already stopped */
        }
      }
      node.disconnect();
    });
    this.ambientNodes = [];
    this.started = false;
    void this.ctx?.close();
    this.ctx = null;
    this.master = null;
  }
}

export const audio = new AudioEngine();
