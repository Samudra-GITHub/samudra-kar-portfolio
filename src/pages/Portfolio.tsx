import { Hero } from '@/sections/Hero';
import { About } from '@/sections/About';
import { Systems } from '@/sections/Systems';
import { Projects } from '@/sections/Projects';
import { Manifesto } from '@/sections/Manifesto';
import { Skills } from '@/sections/Skills';
import { HowIWork } from '@/sections/HowIWork';
import { Experiments } from '@/sections/Experiments';
import { Journey } from '@/sections/Journey';
import { Snapshot } from '@/sections/Snapshot';
import { Contact } from '@/sections/Contact';

/**
 * The main experience. Spine is Hero → About → Projects → Skills → Journey →
 * Contact; the pinned Manifesto, How I Work, Experiments and Snapshot sit
 * between those beats as connective narrative rather than headline sections.
 */
export function Portfolio() {
  return (
    <main className="page-main">
      <Hero />
      <About />
      <Systems />
      <Projects />
      <Manifesto />
      <Skills />
      <HowIWork />
      <Experiments />
      <Journey />
      <Snapshot />
      <Contact />
    </main>
  );
}
