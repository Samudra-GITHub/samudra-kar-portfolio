import { type ReactNode } from 'react';

interface IndustryCardProps {
  /** Short vertical label, e.g. "Healthcare" */
  label: string;
  /** Stat or headline figure, e.g. "12+" */
  stat?: string;
  /** Sub-label under stat */
  statLabel?: string;
  /** Lucide icon or any icon node */
  icon: ReactNode;
  description: string;
  /** Horizontal gradient bar color hint: 'sage' | 'yellow' | 'neutral' */
  accent?: 'sage' | 'yellow' | 'neutral';
  className?: string;
}

/**
 * IndustryCard
 * ────────────
 * Compact horizontal frosted card for "Industries served" or
 * "Verticals" grids. Uses a left accent bar, icon, and stat.
 * Hover reveals a sliding gradient underline and lifts slightly.
 */
export function IndustryCard({
  label,
  stat,
  statLabel,
  icon,
  description,
  accent = 'sage',
  className = '',
}: IndustryCardProps) {
  return (
    <div
      className={[
        'glass-card',
        'studio-industry-card',
        `studio-industry-card--${accent}`,
        'studio-reveal',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Left accent bar */}
      <span className="studio-industry-card__bar" aria-hidden="true" />

      {/* Icon */}
      <div className="studio-industry-card__icon">{icon}</div>

      {/* Main body */}
      <div className="studio-industry-card__body">
        <span className="studio-industry-card__label">{label}</span>
        <p className="studio-industry-card__desc">{description}</p>
      </div>

      {/* Stat */}
      {stat && (
        <div className="studio-industry-card__stat">
          <strong>{stat}</strong>
          {statLabel && <span>{statLabel}</span>}
        </div>
      )}

      {/* Hover underline sweep */}
      <span className="studio-industry-card__sweep" aria-hidden="true" />
    </div>
  );
}
