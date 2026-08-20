import { useEffect, useMemo, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowDownRight,
  ArrowUpRight,
  Asterisk,
  Check,
  ChevronRight,
  Circle,
  Code2,
  Github,
  Instagram,
  Linkedin,
  Mail,
  Menu,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

const queryClient = new QueryClient();

type Project = {
  id: string;
  number: string;
  title: string;
  type: string;
  year: string;
  description: string;
  tags: string[];
  accent: string;
  detail: string;
};

const projects: Project[] = [
  {
    id: '01',
    number: '01',
    title: 'AkashaLens',
    type: 'ISRO Hackathon 2026 · AI/ML',
    year: '2026',
    description: 'A generative AI system for cloud removal and reconstruction in LISS-IV satellite imagery, designed for agriculture and disaster management.',
    tags: ['Python', 'OpenCV', 'NumPy', 'Sentinel-2', 'AI/ML'],
    accent: 'lime',
    detail: 'AkashaLens uses spatial, spectral, and temporal reconstruction to recover obscured terrain, with confidence maps that show reliability region by region.',
  },
  {
    id: '02',
    number: '02',
    title: 'SkyCast',
    type: 'Web app · Full stack',
    year: '2024',
    description: 'A weather forecasting web app with live conditions and multi-day forecasts, built to make weather data immediately scannable.',
    tags: ['Python', 'Flask', 'OpenWeatherMap', 'HTML/CSS/JS'],
    accent: 'coral',
    detail: 'SkyCast combines a clean, fast interface with a Flask server and the OpenWeatherMap API so current conditions and forecast context can be understood at a glance.',
  },
];

const skills = ['UI / UX', 'Frontend engineering', 'Design systems', 'Interaction design', 'Creative coding', 'Prototyping'];

function useReveal() {
  const [visible, setVisible] = useState<Set<string>>(new Set());

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        setVisible((current) => {
          const next = new Set(current);
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.id) next.add(entry.target.id);
          });
          return next;
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -45px' },
    );
    document.querySelectorAll('[data-reveal]').forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return (id: string) => visible.has(id);
}

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function Logo() {
  return (
    <button
      type="button"
      onClick={() => scrollToSection('top')}
      className="group flex items-center gap-3 text-left"
      data-testid="button-logo"
      aria-label="Back to the top"
    >
      <span className="flex h-9 w-9 items-center justify-center border border-primary bg-primary text-sm font-bold text-primary-foreground transition-transform duration-300 group-hover:rotate-[-8deg]">
        SK
      </span>
      <span className="hidden text-xs font-semibold tracking-[0.2em] text-foreground sm:block">SAMUDRA KAR</span>
    </button>
  );
}

function Header({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (open: boolean) => void }) {
  const links = [
    { label: 'Work', target: 'work' },
    { label: 'About', target: 'about' },
    { label: 'Lab', target: 'lab' },
    { label: 'Contact', target: 'contact' },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-30 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="container-wide flex h-[72px] items-center justify-between">
        <Logo />
        <nav className="desktop-only flex items-center gap-8" aria-label="Primary navigation">
          {links.map((link, index) => (
            <button
              key={link.target}
              type="button"
              onClick={() => scrollToSection(link.target)}
              className="group flex items-center gap-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
              data-testid={`button-nav-${link.target}`}
            >
              <span className="mono text-[9px] text-primary/65">0{index + 1}</span>
              <span>{link.label}</span>
            </button>
          ))}
        </nav>
        <div className="desktop-only flex items-center gap-3">
          <span className="h-1.5 w-1.5 animate-[pulseDot_2s_ease-in-out_infinite] rounded-full bg-primary" />
           <span className="mono text-[10px] uppercase tracking-[0.14em] text-muted-foreground">Open to UI/UX internships</span>
        </div>
        <button
          type="button"
          className="mobile-only border border-border p-2 text-foreground"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          data-testid="button-mobile-menu"
        >
          {menuOpen ? <X size={19} /> : <Menu size={19} />}
        </button>
      </div>
      {menuOpen && (
        <nav className="mobile-only border-t border-border bg-background px-4 py-5" aria-label="Mobile navigation">
          {links.map((link) => (
            <button
              key={link.target}
              type="button"
              className="block w-full border-b border-border/70 py-4 text-left text-lg text-foreground"
              onClick={() => {
                scrollToSection(link.target);
                setMenuOpen(false);
              }}
              data-testid={`button-mobile-nav-${link.target}`}
            >
              {link.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="relative flex min-h-[760px] items-end pt-28 pb-14 md:min-h-[850px] md:pb-20">
      <div className="container-wide relative z-10 w-full">
        <div className="mb-14 flex items-center justify-between border-b border-border pb-4 reveal-hero">
          <div className="eyebrow">Portfolio / 2024—25</div>
          <div className="mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Bangalore, India <span className="mx-2 text-primary">↗</span> 12.9716° N</div>
        </div>
        <div className="grid items-end gap-12 lg:grid-cols-[1.2fr_.8fr]">
          <div>
            <p className="eyebrow mb-5 reveal-hero-2">Hello, I&apos;m Samudra —</p>
            <h1 className="max-w-[920px] text-[clamp(3.7rem,9vw,9.8rem)] font-semibold leading-[.88] tracking-[-0.085em] text-foreground reveal-hero-2">
              I make digital
              <br />
              things feel <span className="relative inline-block text-primary"><span className="absolute -inset-x-2 top-[47%] h-[.07em] -rotate-2 bg-primary/25" />inevitable.</span>
            </h1>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4 reveal-hero-3">
              <p className="max-w-[390px] text-sm leading-6 text-muted-foreground">
                3rd-year B.Tech CSE student at Chanakya University, UI/UX designer, and frontend engineer. I work where design thinking meets technical execution.
              </p>
              <button
                type="button"
                onClick={() => scrollToSection('work')}
                className="magnetic group flex items-center gap-3 border border-primary bg-primary px-5 py-3 text-xs font-semibold text-primary-foreground"
                data-testid="button-explore-work"
              >
                Explore the work <ArrowDownRight className="transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1" size={16} />
              </button>
            </div>
          </div>
          <HeroArtifact />
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-1/2 hidden h-[42%] w-px bg-gradient-to-b from-transparent via-primary/50 to-primary lg:block" />
      <div className="pointer-events-none absolute right-[7%] top-[27%] h-24 w-24 rounded-full border border-primary/30 float-shape" />
      <div className="pointer-events-none absolute right-[9.5%] top-[31%] h-2 w-2 rounded-full bg-primary" />
    </section>
  );
}

function HeroArtifact() {
  return (
    <div className="relative mx-auto w-full max-w-[410px] reveal-hero-3" style={{ transform: 'translateY(calc(var(--scroll-y, 0px) * -0.045))' }} aria-label="Abstract visual representing interface and code">
      <div className="absolute -left-6 top-14 z-10 hidden -rotate-90 origin-left mono text-[9px] uppercase tracking-[.2em] text-muted-foreground sm:block">
        Interface / code / feeling
      </div>
      <div className="relative aspect-[.82] overflow-hidden border border-border bg-[#151912] p-4 shadow-[18px_18px_0_hsl(var(--primary)/.12)]">
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full border border-primary/20" />
        <div className="absolute -right-2 top-12 h-32 w-32 rounded-full bg-primary/10 blur-2xl" />
        <div className="relative flex items-center justify-between border-b border-border/80 pb-3">
          <span className="mono text-[9px] uppercase tracking-[.18em] text-muted-foreground">sk / visual system</span>
          <span className="flex items-center gap-1.5 mono text-[9px] text-primary"><Circle size={7} fill="currentColor" /> live</span>
        </div>
        <div className="relative mt-10">
          <div className="mono mb-3 text-[10px] text-primary/75">01 — soft logic</div>
          <div className="text-[clamp(2.8rem,7vw,5.4rem)] font-semibold leading-[.86] tracking-[-.08em] text-primary">
            make
            <br />
            room
            <br />
            for <span className="text-foreground">wonder</span>
          </div>
          <div className="mt-9 flex max-w-[240px] items-end justify-between border-t border-border/80 pt-3">
            <span className="mono text-[9px] leading-4 text-muted-foreground">A study in<br />useful beauty.</span>
            <div className="h-12 w-12 rounded-full border border-primary/60 p-1">
              <div className="h-full w-full rounded-full border border-dashed border-primary/70" />
            </div>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex justify-between mono text-[9px] text-muted-foreground"><span>0024</span><span>© SK</span></div>
      </div>
    </div>
  );
}

function Ticker() {
  return (
    <div className="border-y border-border bg-primary py-3 text-primary-foreground">
      <div className="flex w-max animate-[sweep_18s_linear_infinite] items-center gap-10 whitespace-nowrap">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center gap-10">
            <span className="text-[12px] font-semibold uppercase tracking-[.15em]">Design with a point of view</span>
            <Asterisk size={15} />
            <span className="mono text-[10px] uppercase tracking-[.16em]">Build it like you mean it</span>
            <Asterisk size={15} />
          </div>
        ))}
      </div>
    </div>
  );
}

function SectionIntro({ kicker, title, body, id }: { kicker: string; title: string; body?: string; id: string }) {
  const isVisible = useReveal()(id);
  return (
    <div id={id} data-reveal className={`mb-14 grid gap-6 md:grid-cols-[.8fr_1.7fr] md:items-end reveal ${isVisible ? 'is-visible' : ''}`}>
      <div className="eyebrow">{kicker}</div>
      <div>
        <h2 className="max-w-[760px] text-4xl font-semibold leading-[.98] tracking-[-.06em] text-foreground md:text-6xl">{title}</h2>
        {body && <p className="mt-5 max-w-[460px] text-sm leading-6 text-muted-foreground">{body}</p>}
      </div>
    </div>
  );
}

function ProjectVisual({ project }: { project: Project }) {
  if (project.accent === 'coral') {
    return (
      <div className="relative h-full min-h-[260px] overflow-hidden bg-[#25201f] p-6">
        <div className="absolute right-[-12%] top-[-15%] h-64 w-64 rounded-full border-[28px] border-accent/80" />
        <div className="absolute bottom-[-30%] left-[-4%] h-72 w-72 rounded-full border border-accent/50" />
        <div className="relative flex h-full flex-col justify-between">
          <div className="flex justify-between mono text-[9px] uppercase tracking-[.15em] text-accent"><span>atmosphere / 07</span><span>36° 12&apos;</span></div>
          <div><div className="mb-2 h-px w-24 bg-accent" /><span className="text-3xl font-semibold tracking-[-.06em] text-accent">read the<br />whole picture.</span></div>
        </div>
      </div>
    );
  }
  if (project.accent === 'blue') {
    return (
      <div className="relative h-full min-h-[260px] overflow-hidden bg-[#161e25] p-6">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: 'linear-gradient(#89b4c522 1px, transparent 1px), linear-gradient(90deg, #89b4c522 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div className="relative flex h-full flex-col justify-between">
          <div className="mono text-[9px] uppercase tracking-[.15em] text-[#9ad9e3]">frame / playground</div>
          <div className="relative ml-auto mr-8 h-32 w-32 rotate-12 border border-[#9ad9e3] bg-[#9ad9e3]/10">
            <div className="absolute -left-6 top-8 h-20 w-20 border border-[#9ad9e3]/70" />
            <div className="absolute -right-4 -top-4 h-10 w-10 rounded-full bg-[#9ad9e3]" />
            <Code2 className="absolute bottom-4 right-4 text-[#9ad9e3]" size={27} strokeWidth={1.4} />
          </div>
          <div className="mono text-[9px] text-[#9ad9e3]/70">const detail = &quot;the point&quot;;</div>
        </div>
      </div>
    );
  }
  return (
    <div className="relative h-full min-h-[260px] overflow-hidden bg-primary p-6 text-primary-foreground">
      <div className="absolute -right-12 -top-12 h-56 w-56 rounded-full border-[1px] border-primary-foreground/35" />
      <div className="absolute -right-1 top-1 h-32 w-32 rounded-full bg-primary-foreground/10" />
      <div className="relative flex h-full flex-col justify-between">
        <div className="flex justify-between mono text-[9px] uppercase tracking-[.15em]"><span>pioneer / 01</span><span>open field</span></div>
        <div className="text-[3.3rem] font-semibold leading-[.78] tracking-[-.09em]">ideas<br />in<br /><span className="opacity-40">motion</span></div>
        <div className="flex items-center justify-between mono text-[9px]"><span>move at the speed of thought</span><ArrowUpRight size={16} /></div>
      </div>
    </div>
  );
}

function Work() {
  const [selected, setSelected] = useState<Project | null>(null);
  const isVisible = useReveal()('work-grid');
  return (
    <section id="work" className="container-wide scroll-mt-28 py-28 md:py-40">
      <SectionIntro
        id="work-intro"
        kicker="01 / Selected work"
        title="A few things I&apos;ve helped become real."
        body="I like the messy middle: turning a fuzzy problem into a sharp idea, then giving it a body that works beautifully."
      />
      <div id="work-grid" data-reveal className={`grid gap-5 lg:grid-cols-12 reveal ${isVisible ? 'is-visible' : ''}`}>
        {projects.map((project, index) => (
          <article key={project.id} className={`project-card group flex flex-col overflow-hidden border border-border bg-card ${index === 0 ? 'lg:col-span-7' : 'lg:col-span-5'} ${index === 2 ? 'lg:col-start-3' : ''}`} data-testid={`card-project-${project.id}`}>
            <div className="relative">
              <ProjectVisual project={project} />
              <span className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 bg-background/10 text-foreground backdrop-blur-sm project-arrow"><ArrowUpRight size={17} /></span>
            </div>
            <div className="flex flex-1 flex-col justify-between p-6 md:p-7">
              <div>
                <div className="mb-5 flex items-center justify-between mono text-[9px] uppercase tracking-[.16em] text-muted-foreground"><span>{project.number} / {project.type}</span><span>{project.year}</span></div>
                <h3 className="text-3xl font-semibold tracking-[-.06em] text-foreground">{project.title}</h3>
                <p className="mt-3 max-w-[450px] text-sm leading-6 text-muted-foreground">{project.description}</p>
              </div>
              <div className="mt-8 flex items-end justify-between gap-4">
                <div className="flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="border border-border px-2 py-1 mono text-[9px] uppercase tracking-[.08em] text-muted-foreground">{tag}</span>)}</div>
                <button type="button" onClick={() => setSelected(project)} className="lime-link shrink-0 text-xs font-semibold" data-testid={`button-project-${project.id}`}>View case</button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {selected && <ProjectModal project={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [onClose]);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-md" role="dialog" aria-modal="true" aria-labelledby="project-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="relative max-h-[90dvh] w-full max-w-2xl overflow-y-auto border border-border bg-card p-6 shadow-2xl md:p-10">
        <button type="button" onClick={onClose} className="absolute right-5 top-5 border border-border p-2 text-muted-foreground transition-colors hover:text-foreground" aria-label="Close project details" data-testid="button-close-project"><X size={18} /></button>
        <div className="eyebrow mb-5">{project.number} / {project.type} / {project.year}</div>
        <h2 id="project-title" className="text-5xl font-semibold tracking-[-.07em]">{project.title}</h2>
        <p className="mt-7 max-w-xl text-base leading-7 text-muted-foreground">{project.detail}</p>
        <div className="mt-9 flex flex-wrap gap-2">{project.tags.map((tag) => <span key={tag} className="border border-primary/40 px-3 py-2 mono text-[10px] uppercase tracking-[.1em] text-primary">{tag}</span>)}</div>
        <div className="mt-10 flex items-center gap-5 border-t border-border pt-6">
          <button type="button" onClick={onClose} className="magnetic flex items-center gap-2 bg-primary px-4 py-3 text-xs font-semibold text-primary-foreground" data-testid="button-back-to-work">Back to work <ChevronRight size={15} /></button>
          <span className="mono text-[10px] text-muted-foreground">Case study in progress</span>
        </div>
      </div>
    </div>
  );
}

function About() {
  const isVisible = useReveal()('about-body');
  return (
    <section id="about" className="scroll-mt-28 border-y border-border bg-[#10140f] py-28 md:py-40">
      <div className="container-wide">
        <SectionIntro id="about-intro" kicker="02 / A little context" title="The bridge between how it looks and how it works." />
        <div id="about-body" data-reveal className={`grid gap-14 reveal ${isVisible ? 'is-visible' : ''} md:grid-cols-[1.1fr_.9fr]`}>
          <div>
            <p className="max-w-2xl text-2xl leading-[1.25] tracking-[-.04em] text-foreground md:text-4xl">
               I live at the intersection of design thinking and technical execution.
            </p>
            <p className="mt-7 max-w-xl text-sm leading-7 text-muted-foreground">
               I design interfaces in Figma, build them in code, and deploy them with FastAPI. That dual fluency means I don&apos;t just hand off a mockup — I understand what it takes to ship it. My interests also include cybersecurity, AI, photography, Linux, and open source.
            </p>
            <button type="button" onClick={() => scrollToSection('contact')} className="lime-link mt-9 inline-flex items-center gap-2 text-sm font-medium" data-testid="button-about-contact">Let&apos;s make something <ArrowUpRight size={16} /></button>
          </div>
          <div className="border-l border-border pl-6 md:pl-10">
            <div className="eyebrow mb-6">The working set</div>
            <div className="space-y-0">
              {skills.map((skill, index) => (
                <div key={skill} className="group flex items-center justify-between border-b border-border py-4 text-lg tracking-[-.03em] text-foreground transition-colors hover:text-primary" data-testid={`text-skill-${index}`}>
                  <span>{skill}</span><span className="mono text-[10px] text-muted-foreground">0{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Lab() {
  const isVisible = useReveal()('lab-grid');
  return (
    <section id="lab" className="container-wide scroll-mt-28 py-28 md:py-40">
      <SectionIntro id="lab-intro" kicker="03 / Side quests" title="The unfinished experiments are often the interesting ones." body="A running log of things I&apos;m currently learning, pulling apart, or making for the joy of it." />
      <div id="lab-grid" data-reveal className={`grid gap-4 md:grid-cols-3 reveal ${isVisible ? 'is-visible' : ''}`}>
        <LabCard number="01" title="Motion as material" copy="A study of interfaces that respond without getting in the way." icon={<Sparkles size={18} />} />
        <LabCard number="02" title="Small internet" copy="Notes on building digital spaces that feel personal, not performative." icon={<Asterisk size={18} />} />
        <LabCard number="03" title="Type / space" copy="Collecting the typefaces, grids, and odd details that make a system sing." icon={<Code2 size={18} />} />
      </div>
      <div className="mt-16 border-y border-border py-5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-primary" /><span className="mono text-[10px] uppercase tracking-[.14em] text-muted-foreground">Currently exploring</span></div>
          <p className="text-sm text-foreground">How a UI can feel generous before it feels clever.</p>
          <span className="mono text-[10px] text-muted-foreground">last updated / 08.24</span>
        </div>
      </div>
    </section>
  );
}

function LabCard({ number, title, copy, icon }: { number: string; title: string; copy: string; icon: React.ReactNode }) {
  return (
    <article className="group relative min-h-[250px] overflow-hidden border border-border bg-card p-6 transition-colors duration-300 hover:bg-secondary">
      <div className="flex items-start justify-between"><span className="eyebrow">{number} / note</span><span className="text-primary transition-transform duration-300 group-hover:rotate-12">{icon}</span></div>
      <div className="absolute bottom-6 left-6 right-6"><h3 className="text-2xl font-semibold tracking-[-.05em]">{title}</h3><p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p></div>
    </article>
  );
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };
  return (
    <section id="contact" className="relative scroll-mt-28 overflow-hidden border-t border-border bg-primary py-28 text-primary-foreground md:py-40">
      <div className="pointer-events-none absolute right-[-8%] top-[-20%] h-[520px] w-[520px] rounded-full border border-primary-foreground/20" />
      <div className="pointer-events-none absolute bottom-[-32%] left-[-4%] h-[340px] w-[340px] rounded-full border border-primary-foreground/15" />
      <div className="container-wide relative z-10">
        <div className="grid gap-16 md:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="eyebrow text-primary-foreground/65">04 / Start a conversation</div>
            <h2 className="mt-6 max-w-3xl text-[clamp(3.3rem,8vw,8rem)] font-semibold leading-[.85] tracking-[-.09em]">Have a good<br /><span className="text-primary-foreground/40">problem?</span></h2>
            <p className="mt-8 max-w-md text-sm leading-6 text-primary-foreground/70">Tell me what you&apos;re working on, what&apos;s stuck, or what you&apos;re curious about. I&apos;ll get back to you soon.</p>
             <a href="mailto:samudrakar8@gmail.com" className="mt-8 inline-flex items-center gap-3 border-b border-primary-foreground/45 pb-2 text-sm font-medium transition-colors hover:border-primary-foreground" data-testid="link-email"><Mail size={17} /> samudrakar8@gmail.com <ArrowUpRight size={15} /></a>
          </div>
          <div className="border border-primary-foreground/30 bg-primary-foreground/10 p-6 backdrop-blur-sm md:p-8">
            {sent ? (
              <div className="flex min-h-[340px] flex-col justify-between">
                <Check size={25} />
                <div><div className="text-3xl font-semibold tracking-[-.05em]">Message received.</div><p className="mt-3 max-w-xs text-sm leading-6 text-primary-foreground/65">Thanks for reaching out. The inbox has been notified.</p></div>
                <button type="button" onClick={() => { setSent(false); setForm({ name: '', email: '', message: '' }); }} className="text-left text-xs underline underline-offset-4" data-testid="button-send-another">Send another</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6">
                <label className="block"><span className="eyebrow text-primary-foreground/60">Your name</span><input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="mt-2 w-full border-b border-primary-foreground/35 bg-transparent py-3 text-base outline-none placeholder:text-primary-foreground/35 focus:border-primary-foreground" placeholder="What should I call you?" data-testid="input-contact-name" /></label>
                <label className="block"><span className="eyebrow text-primary-foreground/60">Email</span><input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="mt-2 w-full border-b border-primary-foreground/35 bg-transparent py-3 text-base outline-none placeholder:text-primary-foreground/35 focus:border-primary-foreground" placeholder="you@somewhere.com" data-testid="input-contact-email" /></label>
                <label className="block"><span className="eyebrow text-primary-foreground/60">The good bit</span><textarea required rows={3} value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} className="mt-2 w-full resize-none border-b border-primary-foreground/35 bg-transparent py-3 text-base outline-none placeholder:text-primary-foreground/35 focus:border-primary-foreground" placeholder="A few words about the project..." data-testid="input-contact-message" /></label>
                <button type="submit" className="magnetic mt-2 inline-flex items-center gap-3 bg-primary-foreground px-5 py-3 text-xs font-semibold text-primary" data-testid="button-submit-contact">Send it over <Send size={15} /></button>
              </form>
            )}
          </div>
        </div>
        <div className="mt-24 flex flex-col gap-7 border-t border-primary-foreground/25 pt-5 md:flex-row md:items-center md:justify-between">
          <span className="mono text-[10px] uppercase tracking-[.15em] text-primary-foreground/60">Samudra Kar / 2024—25</span>
          <div className="flex items-center gap-5">
             <a href="https://www.linkedin.com/in/samudra-kar-a495951b5/" target="_blank" rel="noreferrer" className="text-primary-foreground/70 transition-colors hover:text-primary-foreground" aria-label="Samudra on LinkedIn" data-testid="link-linkedin"><Linkedin size={17} /></a>
             <a href="https://github.com/Samudra-GITHub" target="_blank" rel="noreferrer" className="text-primary-foreground/70 transition-colors hover:text-primary-foreground" aria-label="Samudra on GitHub" data-testid="link-github"><Github size={17} /></a>
             <a href="https://www.instagram.com/samudra_kar" target="_blank" rel="noreferrer" className="text-primary-foreground/70 transition-colors hover:text-primary-foreground" aria-label="Samudra on Instagram" data-testid="link-instagram"><Instagram size={17} /></a>
          </div>
          <button type="button" onClick={() => scrollToSection('top')} className="flex items-center gap-2 self-start text-xs text-primary-foreground/70 transition-colors hover:text-primary-foreground md:self-auto" data-testid="button-back-top">Back to top <ArrowUpRight size={15} /></button>
        </div>
      </div>
    </section>
  );
}

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const route = useLocation()[0];
  const year = useMemo(() => new Date().getFullYear(), []);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? (window.scrollY / max) * 100 : 0);
      const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      document.documentElement.style.setProperty('--scroll-y', reduceMotion ? '0px' : `${window.scrollY}px`);
    };
    const onMove = (event: MouseEvent) => {
      document.documentElement.style.setProperty('--cursor-x', `${event.clientX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${event.clientY}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousemove', onMove, { passive: true });
    onScroll();
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMove); };
  }, []);

  useEffect(() => {
    if (route !== '/') scrollToSection('top');
  }, [route]);

  return (
    <div className="site-shell" ref={cursorRef}>
      <div className="pointer-events-none fixed left-0 top-0 z-20 hidden h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/5 blur-3xl md:block" style={{ left: 'var(--cursor-x, -20%)', top: 'var(--cursor-y, -20%)' }} />
      <div className="fixed left-0 right-0 top-0 z-40 h-[2px] origin-left bg-primary" style={{ transform: `scaleX(${progress / 100})` }} />
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <main>
        <Hero />
        <Ticker />
        <Work />
        <About />
        <Lab />
        <Contact />
      </main>
      <footer className="container-wide flex items-center justify-between py-6 mono text-[9px] uppercase tracking-[.13em] text-muted-foreground">
        <span>Made with care in Bangalore</span><span>© {year} Samudra Kar</span>
      </footer>
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;