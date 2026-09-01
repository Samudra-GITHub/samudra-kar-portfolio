import { type ReactNode } from 'react';
import { CheckCircle2, MoveRight } from 'lucide-react';

interface PricingFeature {
  label: string;
  included: boolean;
  /** Optional tooltip or sub-note */
  note?: string;
}

interface PricingCardProps {
  tier: string;
  tagline: string;
  price: string;
  /** e.g. "/ project" or "/ month" */
  period?: string;
  features: PricingFeature[];
  cta: string;
  href?: string;
  /** Marks as the recommended / highlighted tier */
  featured?: boolean;
  /** Small badge text, e.g. "Most popular" */
  badge?: string;
  /** Footnote below CTA */
  footnote?: string;
  className?: string;
}

/**
 * PricingCard
 * ───────────
 * Frosted-glass pricing tier card with staggered feature-list reveal,
 * a pulsing featured glow, and a hover-lift CTA button that inherits
 * the `.button-primary` / `.button-ghost` system.
 */
export function PricingCard({
  tier,
  tagline,
  price,
  period = '/ project',
  features,
  cta,
  href = '#contact',
  featured = false,
  badge,
  footnote,
  className = '',
}: PricingCardProps) {
  return (
    <div
      className={[
        'glass-card',
        'studio-pricing-card',
        featured ? 'studio-pricing-card--featured' : '',
        'studio-reveal',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {/* Featured glow ring */}
      {featured && <span className="studio-pricing-card__glow" aria-hidden="true" />}

      {/* Badge */}
      {badge && (
        <span className="studio-pricing-card__badge">
          <i className="studio-pricing-card__badge-dot" />
          {badge}
        </span>
      )}

      {/* Header */}
      <div className="studio-pricing-card__head">
        <span className="studio-pricing-card__tier">{tier}</span>
        <p className="studio-pricing-card__tagline">{tagline}</p>
      </div>

      {/* Price */}
      <div className="studio-pricing-card__price-row">
        <span className="studio-pricing-card__price">{price}</span>
        <span className="studio-pricing-card__period">{period}</span>
      </div>

      {/* Divider */}
      <div className="studio-pricing-card__divider" />

      {/* Feature list */}
      <ul className="studio-pricing-card__features">
        {features.map((f, i) => (
          <li
            key={f.label}
            className={[
              'studio-pricing-card__feature',
              !f.included ? 'studio-pricing-card__feature--dim' : '',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ '--feature-index': i } as React.CSSProperties}
          >
            <CheckCircle2
              size={14}
              className="studio-pricing-card__check"
              aria-hidden="true"
            />
            <span>{f.label}</span>
            {f.note && (
              <span className="studio-pricing-card__feature-note">{f.note}</span>
            )}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <a
        href={href}
        className={[
          'button',
          featured ? 'button-primary' : 'button-ghost',
          'studio-pricing-card__cta',
        ].join(' ')}
      >
        {cta} <MoveRight size={14} />
      </a>

      {/* Footnote */}
      {footnote && (
        <p className="studio-pricing-card__footnote">{footnote}</p>
      )}
    </div>
  );
}
