import { BrainCircuit, Code2, Palette, Terminal, type LucideIcon } from 'lucide-react';

export const navItems = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Studio', href: '#studio' },
  { label: 'Projects', href: '#projects' },
  { label: 'Skills', href: '#skills' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

export type QuickFact = {
  code: string;
  label: string;
  value: string;
  sub?: string;
};

export const quickFacts: QuickFact[] = [
  {
    code: '01 / education',
    label: 'Education',
    value: 'B.Tech Computer Science Engineering',
    sub: 'Chanakya University',
  },
  {
    code: '02 / focus',
    label: 'Current focus',
    value: 'AI Engineering · UI/UX Design · Frontend Development',
  },
  {
    code: '03 / base',
    label: 'Location',
    value: 'Bangalore',
    sub: 'Karnataka, India',
  },
  {
    code: '04 / signal',
    label: 'Availability',
    value: 'Internship ready',
    sub: 'Open to thoughtful teams',
  },
];

export type Project = {
  number: string;
  title: string;
  category: string;
  summary: string;
  problem: string;
  build: string;
  tags: string[];
  status: string;
  featured?: boolean;
  visual?: boolean;
  link: string;
  linkLabel: string;
};

export const projects: Project[] = [
  {
    number: '01 / VISION SYSTEM',
    title: 'AkashaLens',
    category: 'Computer Vision · Deep Learning',
    summary: 'Generative AI cloud removal that reconstructs occluded satellite imagery.',
    problem:
      'Cloud cover regularly blocks satellite imagery, hiding the ground exactly when it matters most for analysis — a real constraint in earth observation work.',
    build:
      'A generative pipeline that reconstructs cloud-occluded satellite imagery: OpenCV handles pre-processing and cloud-mask detection, and a deep learning model reconstructs the hidden terrain without inventing false detail. Built for the ISRO Hackathon.',
    tags: ['Python', 'OpenCV', 'Deep Learning', 'Computer Vision'],
    status: 'Built for the ISRO Hackathon — still refining the reconstruction model.',
    featured: true,
    visual: true,
    link: 'https://github.com/Samudra-GITHub',
    linkLabel: 'View repository',
  },
  {
    number: '02 / DESKTOP COMPANION',
    title: 'RINTI',
    category: 'AI Desktop Companion',
    summary: 'A voice-first desktop companion for conversation and everyday automation.',
    problem:
      'Most assistant interfaces either bury you in chrome or feel disconnected from a natural conversation — I wanted something that stays out of the way.',
    build:
      'RINTI handles voice conversation, everyday automation, and quick lookups from the desktop, built on Python and FastAPI with a speech AI layer. The interface stays deliberately minimal so the conversation stays the focus, not the assistant.',
    tags: ['Python', 'FastAPI', 'Speech AI'],
    status: 'In active development as a personal assistant experience.',
    link: 'mailto:hi.samsstudio@gmail.com?subject=RINTI%20walkthrough',
    linkLabel: 'Request walkthrough',
  },
  {
    number: '03 / ATMOSPHERIC DATA',
    title: 'SkyCast',
    category: 'Weather · Frontend',
    summary: 'A calm, glass-led weather interface built on live forecast data.',
    problem: 'Weather apps often bury the one number you actually need under noise, icons, and ads.',
    build:
      'SkyCast pulls live weather data through a FastAPI layer and presents it through a glass-panel interface — clear hierarchy, legible numbers, and a layout that scales from a quick glance to a full forecast.',
    tags: ['FastAPI', 'Weather API', 'Frontend'],
    status: 'A live personal project — a testbed for API integration and interface pacing.',
    link: 'mailto:hi.samsstudio@gmail.com?subject=SkyCast%20walkthrough',
    linkLabel: 'Request walkthrough',
  },
  {
    number: '04 / PERSONAL SYSTEM',
    title: 'AETHER X',
    category: 'Portfolio · Interaction Design',
    summary: 'This site — a cinematic React and Three.js system built around a forest-glass identity.',
    problem:
      'A portfolio needed to prove design sense and engineering ability at the same time, not just describe them in a bullet list.',
    build:
      'Built with React, TypeScript, and Three.js: modular sections, a custom 3D scene, scroll-driven motion, and a glass material system. The interaction design and the code behind it are the same project.',
    tags: ['React', 'TypeScript', 'Three.js'],
    status: 'Continuously evolving alongside the rest of the work.',
    link: '#hero',
    linkLabel: 'Back to top',
  },
];

export type SkillGroup = {
  title: string;
  code: string;
  icon: LucideIcon;
  summary: string;
  focus: string;
  skills: string[];
};

export const skillGroups: SkillGroup[] = [
  {
    title: 'AI / Machine Learning',
    code: 'SYS.01',
    icon: BrainCircuit,
    summary: 'Reconstructing signal from noisy, incomplete, or occluded data.',
    focus: 'Think reconstruction, detection, and models that make sense of messy signals.',
    skills: ['Python', 'Deep Learning', 'Computer Vision', 'OpenCV', 'AI Assistants'],
  },
  {
    title: 'Frontend Engineering',
    code: 'SYS.02',
    icon: Code2,
    summary: 'Interfaces that stay calm under real content and real devices.',
    focus: 'Think component architecture, motion, and layouts that hold up under real content.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Responsive Design'],
  },
  {
    title: 'Backend & APIs',
    code: 'SYS.03',
    icon: Terminal,
    summary: 'The quiet plumbing that makes an interface trustworthy.',
    focus: 'Think contracts between systems — predictable, documented, boring in the best way.',
    skills: ['FastAPI', 'REST APIs', 'Python', 'API Integration'],
  },
  {
    title: 'Product & UI/UX',
    code: 'SYS.04',
    icon: Palette,
    summary: 'Deciding what a screen should say before deciding how it looks.',
    focus: 'Think wireframes first, pixels second, and prototypes tested before they get precious.',
    skills: ['Figma', 'UI / UX', 'Prototyping', 'Interaction Design'],
  },
];

export type JourneyGroup = {
  label: string;
  items: string[];
};

export type JourneyItem = {
  year: string;
  phase: string;
  title: string;
  intro: string;
  groups: JourneyGroup[];
};

export const journey: JourneyItem[] = [
  {
    year: '2024',
    phase: 'FOUNDATIONS',
    title: 'Started Computer Science Engineering',
    intro: 'The first year was about breadth — figuring out which parts of building software actually held my attention.',
    groups: [{ label: 'Explored', items: ['Frontend development', 'Python', 'Data structures & algorithms', 'UI design'] }],
  },
  {
    year: '2025',
    phase: 'FIRST SYSTEMS',
    title: 'Started building real projects',
    intro: "Theory turned into shipped, if small, things — and that's when computer vision started pulling my focus.",
    groups: [
      { label: 'Built', items: ['Weather applications', 'Portfolio websites', 'API-powered projects'] },
      { label: 'Started exploring', items: ['OpenCV', 'Computer vision', 'Deep learning'] },
    ],
  },
  {
    year: '2026',
    phase: 'IN ORBIT',
    title: 'AkashaLens, RINTI, and internship prep',
    intro: 'Current focus is going deeper on AI engineering while sharpening frontend craft, with an eye on internships.',
    groups: [
      { label: 'Working on', items: ['AkashaLens', 'RINTI', 'Advanced frontend experiences'] },
      { label: 'Preparing for', items: ['Software engineering internships'] },
    ],
  },
];

export type Principle = {
  index: string;
  title: string;
  text: string;
};

export const principles: Principle[] = [
  {
    index: '01',
    title: 'Understand the problem first',
    text: "Before any pixels or code, I try to understand who's using this and what they actually need — not what's technically impressive.",
  },
  {
    index: '02',
    title: 'Design for clarity',
    text: 'A clear interface beats a clever one. If it needs a tooltip to explain itself, it probably needs a redesign.',
  },
  {
    index: '03',
    title: 'Prototype quickly',
    text: 'Ideas get tested in Figma or a rough build before they get precious. Cheap prototypes save expensive rewrites.',
  },
  {
    index: '04',
    title: 'Build thoughtfully',
    text: 'Once a direction earns its place, I build it properly — clean structure, sensible names, code I can still read in six months.',
  },
  {
    index: '05',
    title: 'Iterate based on feedback',
    text: "First versions are drafts. I'd rather ship something small and improve it with real feedback than perfect something no one's used yet.",
  },
];

export type Experiment = {
  title: string;
  tag: string;
  text: string;
};

export const experiments: Experiment[] = [
  {
    title: 'AI Assistants',
    tag: 'Ongoing',
    text: 'Small conversational and automation sketches. RINTI is the most developed of these, but there are rougher experiments exploring how voice and text assistants should feel.',
  },
  {
    title: 'Computer Vision',
    tag: 'Ongoing',
    text: 'Image reconstruction and detection experiments beyond AkashaLens — mostly notebooks and scripts, not polished products.',
  },
  {
    title: 'UI Concepts',
    tag: 'Practice',
    text: 'Regular Figma explorations for interfaces that may never ship, used to practice hierarchy, motion, and layout decisions.',
  },
  {
    title: 'Frontend Experiments',
    tag: 'Practice',
    text: 'Small interactive builds that test animation techniques and interaction patterns before they show up in real projects.',
  },
  {
    title: 'Mobile Photography',
    tag: 'Habit',
    text: 'A non-technical habit that still shapes how I think about composition, light, and framing — all of which feeds back into UI work.',
  },
];
