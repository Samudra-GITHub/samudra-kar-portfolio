import { type ReactNode } from 'react';
import { ArrowUpRight } from 'lucide-react';

interface ServiceCardProps {
  /** Monospace eyebrow label, e.g. "SVC.01" */
  code: string;
  title: string;
  description: string;
  /** Lucide icon component or any ReactNode */
  icon: ReactNode;
  /** Bullet deliverables shown as pill tags */
  deliverables?: string[];
  /** Optional CTA href */
  href?: string;
  /** Visual accent theme */
  accent?: 'sage' | 'yellow' | 'glass';
  className?: string;
}

/**
 * ServiceCard
 * ───────────
 * Premium frosted-glass card for services / capabilities.
 * Inherits `.glass-card` and adds `.studio-service-*` micro-interactions:
 *   - Shimmer sweep on hover
 *   - Icon lift + glow
 *   - Deliverable pills that brighten on card hover
 *   - Reveal-ready via `.studio-reveal`
 */
export function ServiceCard({
  code,
  title,
  description,
  icon,
  deliverables = [],
  href,
  accent = 'sage',
  className = '',
}: ServiceCardProps) {
  const Tag = href ? 'a' : 'div';
  const linkProps = href
    ? { href, target: '_blank', rel: 'noreferrer' }
    : {};

  return (
    <Tag
      {...linkProps}
      className={[
        'glass-card',
        'studio-service-card',
        `studio-service-card--${accent}`,
        'studio-reveal',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Shimmer layer – animates on hover via CSS */}
      <span className="studio-service-card__shimmer" aria-hidden="true" />

      {/* Icon */}
      <div className={`studio-service-card__icon studio-service-card__icon--${accent}`}>
        {icon}
      </div>

      {/* Code label */}
      <span className="studio-service-card__code">{code}</span>

      {/* Body */}
      <h3 className="studio-service-card__title">{title}</h3>
      <p className="studio-service-card__desc">{description}</p>

      {/* Deliverables */}
      {deliverables.length > 0 && (
        <ul className="studio-service-card__deliverables">
          {deliverables.map((d) => (
            <li key={d} className="studio-service-card__pill">
              {d}
            </li>
          ))}
        </ul>
      )}

      {/* CTA arrow */}
      {href && (
        <div className="studio-service-card__arrow">
          <ArrowUpRight size={14} />
        </div>
      )}
    </Tag>
  );
}
