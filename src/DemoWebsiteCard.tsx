import { type ReactNode } from 'react';
import { ArrowUpRight, Globe, Layers } from 'lucide-react';

interface DemoWebsiteCardProps {
  /** Short project code, e.g. "DEMO.01" */
  code: string;
  title: string;
  /** One-line summary shown in the browser chrome mock */
  url?: string;
  description: string;
  /** Category / project type  */
  category: string;
  /** Tech stack pills */
  stack: string[];
  /** Preview content rendered inside the browser chrome mock area */
  preview?: ReactNode;
  /** Link to live demo or repo */
  href?: string;
  hrefLabel?: string;
  /** Optional secondary link */
  repoHref?: string;
  /** Visual theme for the preview area */
  previewVariant?: 'grid' | 'wave' | 'dots' | 'glow';
  className?: string;
}

/**
 * DemoWebsiteCard
 * ───────────────
 * A rich project showcase card with a simulated browser chrome header,
 * an animated SVG preview area, and dual CTA links.
 *
 * The browser-chrome mock reinforces "I ship real products" without
 * needing actual screenshots. Stack tags match `.tag` from the main CSS.
 *
 * previewVariant controls which ambient SVG pattern fills the mock:
 *   'grid'  — subtle gridlines (default for data/dashboards)
 *   'wave'  — animated sine sweep (good for weather / ambient products)
 *   'dots'  — floating dot field (good for AI / generative work)
 *   'glow'  — radial glow orb (good for landing pages / hero sections)
 */
export function DemoWebsiteCard({
  code,
  title,
  url = 'localhost:3000',
  description,
  category,
  stack,
  preview,
  href,
  hrefLabel = 'View live',
  repoHref,
  previewVariant = 'grid',
  className = '',
}: DemoWebsiteCardProps) {
  return (
    <div
      className={[
        'glass-card',
        'studio-demo-card',
        'studio-reveal',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Card header */}
      <div className="studio-demo-card__meta">
        <span className="studio-demo-card__code">{code}</span>
        <span className="studio-demo-card__category">{category}</span>
      </div>

      {/* Browser chrome mock */}
      <div className="studio-demo-card__browser">
        {/* Chrome top bar */}
        <div className="studio-demo-card__chrome">
          <span className="studio-demo-card__dot studio-demo-card__dot--r" />
          <span className="studio-demo-card__dot studio-demo-card__dot--y" />
          <span className="studio-demo-card__dot studio-demo-card__dot--g" />
          <div className="studio-demo-card__url-bar">
            <Globe size={9} aria-hidden="true" />
            <span>{url}</span>
          </div>
          <Layers size={11} className="studio-demo-card__chrome-icon" aria-hidden="true" />
        </div>

        {/* Preview viewport */}
        <div className={`studio-demo-card__viewport studio-demo-card__viewport--${previewVariant}`}>
          {/* SVG ambient pattern */}
          <PreviewPattern variant={previewVariant} />
          {/* Custom children overlay */}
          {preview && <div className="studio-demo-card__preview-overlay">{preview}</div>}
        </div>
      </div>

      {/* Title + description */}
      <h3 className="studio-demo-card__title">{title}</h3>
      <p className="studio-demo-card__desc">{description}</p>

      {/* Stack */}
      <div className="project-tags studio-demo-card__stack">
        {stack.map((s) => (
          <span key={s} className="tag">{s}</span>
        ))}
      </div>

      {/* Footer CTAs */}
      <div className="studio-demo-card__footer">
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="studio-demo-card__cta studio-demo-card__cta--primary"
          >
            {hrefLabel} <ArrowUpRight size={13} />
          </a>
        )}
        {repoHref && (
          <a
            href={repoHref}
            target="_blank"
            rel="noreferrer"
            className="studio-demo-card__cta studio-demo-card__cta--ghost"
          >
            Repository <ArrowUpRight size={13} />
          </a>
        )}
      </div>
    </div>
  );
}

/* ── Internal SVG preview patterns ── */
function PreviewPattern({ variant }: { variant: DemoWebsiteCardProps['previewVariant'] }) {
  switch (variant) {
    case 'wave':
      return (
        <svg className="studio-demo-card__svg" viewBox="0 0 380 160" fill="none" preserveAspectRatio="xMidYMid slice">
          <path
            className="studio-demo-wave"
            d="M0 80 C60 40, 120 120, 190 80 S320 40, 380 80"
            stroke="rgba(212,224,160,0.35)"
            strokeWidth="1.5"
            fill="none"
          />
          <path
            className="studio-demo-wave studio-demo-wave--2"
            d="M0 100 C70 60, 130 140, 200 100 S330 60, 380 100"
            stroke="rgba(238,224,122,0.2)"
            strokeWidth="1"
            fill="none"
          />
          <path
            className="studio-demo-wave studio-demo-wave--3"
            d="M0 120 C80 80, 140 160, 210 120 S340 80, 380 120"
            stroke="rgba(212,224,160,0.12)"
            strokeWidth="0.75"
            fill="none"
          />
        </svg>
      );

    case 'dots':
      return (
        <svg className="studio-demo-card__svg" viewBox="0 0 380 160" fill="none">
          {Array.from({ length: 28 }).map((_, i) => (
            <circle
              key={i}
              cx={(i % 7) * 54 + 20}
              cy={Math.floor(i / 7) * 38 + 20}
              r="2.5"
              fill="rgba(212,224,160,0.22)"
              className="studio-demo-dot"
              style={{ '--dot-i': i } as React.CSSProperties}
            />
          ))}
        </svg>
      );

    case 'glow':
      return (
        <svg className="studio-demo-card__svg" viewBox="0 0 380 160" fill="none">
          <defs>
            <radialGradient id="demo-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(238,224,122,0.22)" />
              <stop offset="60%" stopColor="rgba(212,224,160,0.08)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
          </defs>
          <ellipse cx="190" cy="80" rx="130" ry="80" fill="url(#demo-glow)" className="studio-demo-glow-orb" />
          <circle cx="190" cy="80" r="35" stroke="rgba(238,224,122,0.2)" strokeWidth="1" fill="none" />
          <circle cx="190" cy="80" r="60" stroke="rgba(212,224,160,0.1)" strokeWidth="0.75" fill="none" />
        </svg>
      );

    default: // 'grid'
      return (
        <svg className="studio-demo-card__svg" viewBox="0 0 380 160" fill="none">
          {/* Horizontal lines */}
          {[32, 64, 96, 128].map((y) => (
            <line key={`h${y}`} x1="0" y1={y} x2="380" y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
          ))}
          {/* Vertical lines */}
          {[76, 152, 228, 304].map((x) => (
            <line key={`v${x}`} x1={x} y1="0" x2={x} y2="160" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          ))}
          {/* Scan line */}
          <line
            x1="0" y1="72" x2="380" y2="72"
            stroke="rgba(212,224,160,0.3)"
            strokeWidth="0.75"
            className="studio-demo-scan"
          />
        </svg>
      );
  }
}
