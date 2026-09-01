import { useEffect, useState } from 'react';

export function useActiveSection(defaultId = 'hero'): string {
  const [activeSection, setActiveSection] = useState(defaultId);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveSection(visible.target.getAttribute('data-section') || defaultId);
      },
      { rootMargin: '-28% 0px -56% 0px', threshold: [0, 0.2, 0.5, 0.8] },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [defaultId]);

  return activeSection;
}
