import { Link } from 'wouter';
import { ArrowUpRight, MoveLeft } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { StudioSection } from '@/sections/studio';

/**
 * Sam's Studio, moved off the main narrative onto its own route so the landing
 * experience reads as one person rather than two brands.
 */
export function Studio() {
  return (
    <main className="page-main studio-page">
      <Reveal className="studio-page-head">
        <Link href="/" className="studio-back" data-cursor-hover>
          <MoveLeft size={14} /> Back to portfolio
        </Link>
        <div className="eyebrow">/ Sam&apos;s Studio</div>
        <h1 className="section-title">
          Client work, <span>separately.</span>
        </h1>
        <p className="section-intro">
          Alongside the engineering work, I design and build websites for small businesses. It is where the interface
          craft pays for itself.
        </p>
      </Reveal>

      <StudioSection />

      <Reveal className="studio-page-foot">
        <Link href="/" className="button button-ghost" data-cursor-hover>
          Back to the portfolio <ArrowUpRight size={15} />
        </Link>
      </Reveal>
    </main>
  );
}
