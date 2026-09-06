import { useEffect, useRef } from 'react';
import { useActiveSection } from '@/hooks/useActiveSection';
import { audio } from '@/lib/audio';

/**
 * Plays a short airy swell as each new section takes over the viewport.
 * Renders nothing, and isolates the section-tracking re-render to itself so the
 * rest of the tree doesn't re-render on every scroll boundary.
 * No-ops entirely while sound is muted.
 */
export function SectionSound() {
  const active = useActiveSection();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    audio.swell();
  }, [active]);

  return null;
}
