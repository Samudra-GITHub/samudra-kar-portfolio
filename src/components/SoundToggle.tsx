import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { audio } from '@/lib/audio';

const BAR_COUNT = 4;

/**
 * Ambient sound control. Off by default; the first click both enables audio and
 * satisfies the browser's user-gesture requirement for starting an AudioContext.
 * While on, it also wires up hover/click cues across the page.
 */
export function SoundToggle() {
  const [on, setOn] = useState(false);

  useEffect(() => {
    // reflect any stored preference in the button, but never auto-start audio
    setOn(audio.restore() && false);
  }, []);

  useEffect(() => {
    if (!on) return;

    const isInteractive = (t: EventTarget | null) =>
      t instanceof HTMLElement && t.closest('a, button, [data-cursor-hover], [role="button"]');

    const onOver = (e: PointerEvent) => {
      if (isInteractive(e.target)) audio.hover();
    };
    const onClick = (e: MouseEvent) => {
      if (isInteractive(e.target)) audio.click();
    };

    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('click', onClick, { passive: true });
    return () => {
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('click', onClick);
    };
  }, [on]);

  const handleToggle = async () => {
    const next = await audio.toggle();
    setOn(next);
    if (next) audio.swell();
  };

  return (
    <button
      className={`sound-toggle ${on ? 'is-on' : ''}`}
      type="button"
      onClick={handleToggle}
      aria-pressed={on}
      aria-label={on ? 'Mute ambient sound' : 'Enable ambient sound'}
      data-cursor-hover
    >
      <span className="sound-bars" aria-hidden="true">
        {Array.from({ length: BAR_COUNT }, (_, i) => (
          <motion.i
            key={i}
            animate={
              on
                ? { scaleY: [0.35, 1, 0.55, 0.9, 0.35] }
                : { scaleY: 0.25 }
            }
            transition={
              on
                ? { duration: 1.4 + i * 0.22, repeat: Infinity, ease: 'easeInOut', delay: i * 0.08 }
                : { duration: 0.3 }
            }
          />
        ))}
      </span>
      <span className="sound-label">{on ? 'Sound on' : 'Sound off'}</span>
    </button>
  );
}
