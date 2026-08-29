/**
 * StudioDemo.tsx
 * ──────────────
 * Drop this into the Portfolio component (or any route) to preview
 * all five studio components assembled together.
 *
 * Import in App.tsx below the existing section components:
 *
 *   import { StudioDemo } from './StudioDemo';
 *   // then inside <main className="page-main">:
 *   <StudioDemo />
 *
 * Also add one line to main.tsx (after index.css import):
 *   import './studio.css';
 */

import {
  BrainCircuit,
  Code2,
  Cpu,
  Globe2,
  HeartPulse,
  Layers,
  Leaf,
  Palette,
  ShoppingBag,
  Sparkles,
  Terminal,
  Zap,
} from 'lucide-react';
import {
  DemoWebsiteCard,
  IndustryCard,
  PricingCard,
  ServiceCard,
  StudioSection,
} from './components/studio';

/* ── SERVICES DATA ─────────────────────────────── */
const services = [
  {
    code: 'SVC.01',
    title: 'AI Engineering',
    description:
      'Custom ML pipelines, computer vision systems, and voice AI assistants built for real production loads.',
    icon: <BrainCircuit size={20} />,
    deliverables: ['Model training', 'OpenCV pipelines', 'API integration', 'Voice AI'],
    accent: 'sage' as const,
  },
  {
    code: 'SVC.02',
    title: 'Frontend Development',
    description:
      'Fast, accessible React + TypeScript interfaces with animation systems and a considered visual language.',
    icon: <Code2 size={20} />,
    deliverables: ['React / TSX', 'CSS systems', 'Motion design', 'Accessibility'],
    accent: 'yellow' as const,
  },
  {
    code: 'SVC.03',
    title: 'Product Design',
    description:
      'From wire to high-fidelity prototype — UI/UX design grounded in system thinking and real user flows.',
    icon: <Palette size={20} />,
    deliverables: ['Figma prototypes', 'Design systems', 'Interaction design', 'Handoff'],
    accent: 'glass' as const,
  },
  {
    code: 'SVC.04',
    title: 'Backend & APIs',
    description:
      'FastAPI microservices, REST endpoints, and clean data pipelines that hold up under real traffic.',
    icon: <Terminal size={20} />,
    deliverables: ['FastAPI', 'REST design', 'Auth systems', 'Documentation'],
    accent: 'sage' as const,
  },
  {
    code: 'SVC.05',
    title: 'Data Visualisation',
    description:
      'Dense datasets turned into readable, interactive dashboards. Clarity over complexity, always.',
    icon: <Layers size={20} />,
    deliverables: ['Recharts', 'D3 integration', 'Realtime feeds', 'Export views'],
    accent: 'yellow' as const,
  },
  {
    code: 'SVC.06',
    title: 'Systems Consulting',
    description:
      'Architecture reviews, technology selection, and product strategy for early-stage teams.',
    icon: <Cpu size={20} />,
    deliverables: ['Tech audits', 'Stack advice', 'Roadmaps', 'Code reviews'],
    accent: 'glass' as const,
  },
];

/* ── PRICING DATA ──────────────────────────────── */
const tiers = [
  {
    tier: 'Starter',
    tagline: 'For solo founders validating an idea quickly.',
    price: '₹15k',
    period: '/ project',
    features: [
      { label: 'Single-page product site', included: true },
      { label: 'Responsive layout', included: true },
      { label: 'Contact form integration', included: true },
      { label: 'One design revision round', included: true },
      { label: 'Custom animation system', included: false },
      { label: 'Backend API', included: false },
    ],
    cta: 'Start a project',
    featured: false,
    footnote: '2–4 week delivery',
  },
  {
    tier: 'Studio',
    tagline: 'Full-stack product with AI features and a design system.',
    price: '₹45k',
    period: '/ project',
    features: [
      { label: 'Multi-page React application', included: true },
      { label: 'Custom design system', included: true },
      { label: 'FastAPI backend + auth', included: true },
      { label: 'AI feature integration', included: true },
      { label: 'Three revision rounds', included: true },
      { label: 'Source code + handoff docs', included: true },
    ],
    cta: 'Get the Studio build',
    featured: true,
    badge: 'Most popular',
    footnote: '4–8 week delivery · source included',
  },
  {
    tier: 'Retainer',
    tagline: 'Ongoing engineering and design support, monthly.',
    price: '₹25k',
    period: '/ month',
    features: [
      { label: '40 hrs engineering / design', included: true },
      { label: 'Weekly progress calls', included: true },
      { label: 'Unlimited revision requests', included: true },
      { label: 'Priority response time', included: true },
      { label: 'AI model maintenance', included: true },
      { label: 'Dedicated Slack channel', included: true },
    ],
    cta: 'Book a call',
    featured: false,
    footnote: '3-month minimum · cancel anytime',
  },
];

/* ── INDUSTRY DATA ─────────────────────────────── */
const industries = [
  {
    label: 'Space & Defence',
    description: 'Satellite image processing, computer vision at scale.',
    icon: <Globe2 size={16} />,
    stat: 'ISRO',
    statLabel: 'Hackathon',
    accent: 'sage' as const,
  },
  {
    label: 'Healthcare & Life Sci',
    description: 'Diagnostic tooling, data dashboards, HIPAA-conscious design.',
    icon: <HeartPulse size={16} />,
    stat: '3+',
    statLabel: 'Verticals',
    accent: 'yellow' as const,
  },
  {
    label: 'E-Commerce & Retail',
    description: 'Conversion-focused storefronts with live inventory APIs.',
    icon: <ShoppingBag size={16} />,
    accent: 'neutral' as const,
  },
  {
    label: 'Climate & AgriTech',
    description: 'Atmospheric data pipelines, weather UX, crop yield models.',
    icon: <Leaf size={16} />,
    stat: 'SkyCast',
    statLabel: 'Product',
    accent: 'sage' as const,
  },
  {
    label: 'Consumer AI',
    description: 'Voice assistants, personalised recommendation engines, LLM wrappers.',
    icon: <Sparkles size={16} />,
    stat: 'RINTI',
    statLabel: 'Product',
    accent: 'yellow' as const,
  },
  {
    label: 'Developer Tools',
    description: 'Internal dashboards, CLI tooling, and documentation sites.',
    icon: <Zap size={16} />,
    accent: 'neutral' as const,
  },
];

/* ── DEMO PROJECTS DATA ────────────────────────── */
const demos = [
  {
    code: 'DEMO.01',
    title: 'AkashaLens',
    url: 'akashalens.ai',
    description:
      'Generative AI cloud-removal for satellite imagery. Trained on ISRO datasets; outperforms interpolation baselines by 18 dB PSNR.',
    category: 'Research / AI',
    stack: ['Python', 'OpenCV', 'PyTorch', 'FastAPI'],
    href: 'https://github.com/Samudra-GITHub',
    hrefLabel: 'View repo',
    previewVariant: 'dots' as const,
  },
  {
    code: 'DEMO.02',
    title: 'SkyCast',
    url: 'skycast.app',
    description:
      'Live weather intelligence with a frosted-glass interface. Sub-200ms API responses; smooth 60 fps transitions.',
    category: 'Web / Data',
    stack: ['React', 'FastAPI', 'Weather API', 'CSS'],
    previewVariant: 'wave' as const,
    hrefLabel: 'Request walkthrough',
    href: 'mailto:samudrakar8@gmail.com?subject=SkyCast%20walkthrough',
  },
  {
    code: 'DEMO.03',
    title: 'RINTI',
    url: 'rinti.local',
    description:
      'A futuristic desktop companion for voice conversations and automation — always listening, never in the way.',
    category: 'Product / Voice',
    stack: ['Python', 'Speech AI', 'FastAPI', 'PyQt'],
    previewVariant: 'glow' as const,
    hrefLabel: 'Request walkthrough',
    href: 'mailto:samudrakar8@gmail.com?subject=RINTI%20walkthrough',
  },
  {
    code: 'DEMO.04',
    title: 'AETHER X 2.0',
    url: 'samudrakar.dev',
    description:
      'This portfolio: a quiet command centre for the work, questions, and systems still taking shape.',
    category: 'Web / Interface',
    stack: ['React', 'TypeScript', 'Vite', 'CSS'],
    previewVariant: 'grid' as const,
    hrefLabel: 'Back to top',
    href: '#hero',
  },
];

/* ── ASSEMBLED PAGE SECTIONS ───────────────────── */
export function StudioDemo() {
  return (
    <>
      {/* Services */}
      <StudioSection
        id="services"
        eyebrow="/ What I build"
        title={<>Services that <span>ship.</span></>}
        intro="End-to-end engineering and design — from the first wireframe to a production system."
        ambientGradient="sage"
        variant="band"
      >
        <div className="studio-service-grid">
          {services.map((s) => (
            <ServiceCard key={s.code} {...s} />
          ))}
        </div>
      </StudioSection>

      {/* Pricing */}
      <StudioSection
        id="pricing"
        eyebrow="/ Engagement"
        title={<>Transparent <span>pricing.</span></>}
        intro="Flat-rate projects and monthly retainers. No hidden fees, no surprise invoices."
        ambientGradient="yellow"
      >
        <div className="studio-pricing-grid">
          {tiers.map((t) => (
            <PricingCard key={t.tier} {...t} />
          ))}
        </div>
      </StudioSection>

      {/* Industries */}
      <StudioSection
        id="industries"
        eyebrow="/ Verticals"
        title={<>Built for <span>real domains.</span></>}
        intro="Experience across industries that demand precision, not templates."
        variant="band"
      >
        <div className="studio-industry-grid">
          {industries.map((ind) => (
            <IndustryCard key={ind.label} {...ind} />
          ))}
        </div>
      </StudioSection>

      {/* Demo projects */}
      <StudioSection
        id="demos"
        eyebrow="/ Work"
        title={<>Projects already <span>live.</span></>}
        intro="Selected builds — each one a different problem, the same commitment to craft."
        ambientGradient="sage"
      >
        <div className="studio-demo-grid">
          {demos.map((d) => (
            <DemoWebsiteCard key={d.code} {...d} />
          ))}
        </div>
      </StudioSection>
    </>
  );
}
