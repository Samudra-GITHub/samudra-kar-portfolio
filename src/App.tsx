import { type FormEvent, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowUpRight, BrainCircuit, CheckCircle2, ChevronDown, Code2,
  Download, Github, Instagram, Linkedin, Mail, MapPin, Menu,
  MoveRight, Palette, Send, Sparkles, Terminal, X,
} from 'lucide-react';
import emailjs from "@emailjs/browser";

// Temporarily commented out to fix broken imports
// import { ErrorBoundary } from '@/components/error-boundary';
// import { Toaster } from '@/components/ui/toaster';
// import { TooltipProvider } from '@/components/ui/tooltip';
// import NotFound from '@/pages/not-found';

import { Route, Switch, Router as WouterRouter } from 'wouter';
import "./studio.css";
import { StudioSection } from "./studio-index";

const queryClient = new QueryClient();

const navItems = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Studio", href: "#studio" }, // NEW
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

const projects = [
  {
    number: '01 / VISION SYSTEM',
    title: 'AkashaLens',
    description: 'A generative AI cloud removal system that reconstructs satellite imagery with deep learning and computer vision, built for the ISRO Hackathon.',
    tags: ['Python', 'OpenCV', 'Deep Learning', 'ISRO'],
    type: 'Research / AI',
    featured: true,
    visual: true,
    link: 'https://github.com/Samudra-GITHub',
    linkLabel: 'View repository',
  },
  {
    number: '02 / DESKTOP COMPANION',
    title: 'RINTI',
    description: 'A futuristic desktop companion for voice conversations, automation, and thoughtful everyday assistance.',
    tags: ['Python', 'FastAPI', 'Speech AI'],
    type: 'Product / Voice',
    link: 'mailto:hi.samsstudio@gmail.com?subject=RINTI%20walkthrough',
    linkLabel: 'Request walkthrough',
  },
  {
    number: '03 / ATMOSPHERIC DATA',
    title: 'SkyCast',
    description: 'A weather forecasting experience where live API data meets a calm, glass-led interface.',
    tags: ['FastAPI', 'Weather API', 'Frontend'],
    type: 'Web / Data',
    link: 'mailto:hi.samsstudio@gmail.com?subject=SkyCast%20walkthrough',
    linkLabel: 'Request walkthrough',
  },
  {
    number: '04 / PERSONAL SYSTEM',
    title: 'AETHER X',
    description: 'This portfolio: a quiet command center for the work, questions, and systems still taking shape.',
    tags: ['React', 'TypeScript', 'CSS'],
    type: 'Web / Interface',
    link: '#hero',
    linkLabel: 'Back to top',
  },
];

const skillGroups = [
  { title: 'AI / Machine Learning', code: 'SYS.01', icon: BrainCircuit, skills: ['Python', 'Deep Learning', 'Computer Vision', 'OpenCV', 'AI Assistants'] },
  { title: 'Frontend Engineering',  code: 'SYS.02', icon: Code2,        skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Responsive Design'] },
  { title: 'Backend & APIs',        code: 'SYS.03', icon: Terminal,      skills: ['FastAPI', 'REST APIs', 'Python', 'API Integration'] },
  { title: 'Product & Design',      code: 'SYS.04', icon: Palette,       skills: ['Figma', 'UI / UX', 'Prototyping', 'Interaction Design'] },
];

const journey = [
  { year: '2024', phase: 'FOUNDATIONS',  title: 'Started Computer Science Engineering',  text: 'Began exploring frontend development, Python, DSA, and UI design at Chanakya University.' },
  { year: '2025', phase: 'FIRST SYSTEMS',title: 'Started building AI projects',           text: 'Built weather applications and portfolio websites, then started exploring computer vision with OpenCV and deep learning.' },
  { year: '2026', phase: 'IN ORBIT',     title: 'AkashaLens & RINTI',                    text: 'Focused on AI engineering, satellite image reconstruction, voice AI, and preparing for software engineering internships.' },
];

/* ── Editorial frosted glass visual (replaces the AI orb) ── */
function EditorialVisual() {
  return (
    <div className="hero-visual" aria-hidden="true">
      <div className="glass-composition">
        <div className="gc-panel gc-float-1" />
        <div className="gc-panel gc-float-2" />
        <div className="gc-panel gc-main" />
        <div className="gc-content">
          <div>
            <p className="gc-label">AETHER X / Active systems</p>
            <h2 className="gc-headline">
              Build.<br />
              Design.<br />
              <span>Ship.</span>
            </h2>
          </div>
          <div className="gc-modules">
            <div className="gc-module">
              <span className="gc-module-dot active" />
              <span>Computer Vision</span>
              <small>OpenCV · Deep Learning</small>
            </div>
            <div className="gc-module">
              <span className="gc-module-dot active" />
              <span>Frontend Engineering</span>
              <small>React · TypeScript</small>
            </div>
            <div className="gc-module">
              <span className="gc-module-dot idle" />
              <span>Backend Systems</span>
              <small>FastAPI · Python</small>
            </div>
          </div>
          <div className="gc-stat-row">
            <div className="gc-stat"><strong>3+</strong><span>Projects</span></div>
            <div className="gc-stat"><strong>AI</strong><span>Focused</span></div>
            <div className="gc-stat"><strong>2026</strong><span>Internship</span></div>
          </div>
        </div>
        <div className="gc-badge">
          <span className="gc-badge-dot" />
          Available for internships
        </div>
      </div>
    </div>
  );
}

function SocialLinks() {
  return (
    <div className="social-row" aria-label="Social links">
      <a className="social-link" data-testid="link-github"    href="https://github.com/Samudra-GITHub" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /></a>
      <a className="social-link" data-testid="link-linkedin"  href="https://linkedin.com/in/samudra-kar" target="_blank" rel="noreferrer" aria-label="LinkedIn"><Linkedin size={16} /></a>
      <a className="social-link" data-testid="link-email"     href="mailto:hi.samsstudio@gmail.com" aria-label="Email Samudra"><Mail size={16} /></a>
      <a className="social-link" data-testid="link-instagram" href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram"><Instagram size={16} /></a>
    </div>
  );
}

function Navigation({ activeSection }: { activeSection: string }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="site-nav" data-testid="site-navigation">
      <a className="wordmark" href="#hero" data-testid="link-wordmark" onClick={() => setMenuOpen(false)}>
        <span className="wordmark-mark">SK</span>
        <span>AETHER X</span>
        <span className="wordmark-sub">2.0</span>
      </a>
      <div className={`nav-links ${menuOpen ? 'is-open' : ''}`}>
        {navItems.map((item) => (
          <a
            className={`nav-link ${activeSection === item.href.slice(1) ? 'is-active' : ''}`}
            href={item.href}
            key={item.href}
            data-testid={`link-nav-${item.label.toLowerCase()}`}
            onClick={() => setMenuOpen(false)}
          >
            {item.label}
          </a>
        ))}
        <a className="nav-resume" href="/resume.pdf" download data-testid="link-nav-resume">
          <Download size={13} /> Resume
        </a>
      </div>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
        aria-expanded={menuOpen}
        data-testid="button-menu-toggle"
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? <X size={18} /> : <Menu size={18} />}
      </button>
    </nav>
  );
}

function Hero() {
  return (
    <section className="hero" id="hero" data-section="hero">
      <div className="hero-copy reveal is-visible">
        <div className="availability">
          <span className="availability-dot" />
          AVAILABLE FOR INTERNSHIPS
        </div>
        <h1 className="hero-title">
          Samudra
          <strong>Kar.</strong>
        </h1>
        <span className="hero-role">
          Computer Science Student / AI Engineer / Founder of Sam's Studio
        </span>
        <p className="hero-description">
          I build intelligent systems and premium websites for startups and local
          businesses — combining thoughtful UI/UX design with modern engineering.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#projects" data-testid="link-view-projects">
            View Projects <MoveRight size={16} />
          </a>
          <a className="button button-ghost" href="/resume.pdf" download data-testid="link-download-resume">
            Download Resume <Download size={15} />
          </a>
          <a className="button button-secondary" href="#studio">
            Start a Project <ArrowUpRight size={15} />
          </a>
        </div>
        <div className="hero-meta">
          <span className="hero-meta-line" />
          Bangalore, India
          <span className="hero-meta-line" />
          2026 / OPEN TO WORK
        </div>
        <SocialLinks />
      </div>

      <EditorialVisual />

      <a className="scroll-cue" href="#about" data-testid="link-scroll-about">
        <ChevronDown size={15} />
        <span>Scroll to explore</span>
      </a>
    </section>
  );
}

function About() {
  return (
    <section className="section reveal" id="about" data-section="about">
      <div className="section-head">
        <div>
          <div className="eyebrow">/ About me</div>
          <h2 className="section-title">Building AI products that blend <span>design and engineering.</span></h2>
        </div>
        <p className="section-intro">A student mindset with a product instinct. I like the space where an ambitious idea becomes a calm, usable tool.</p>
      </div>
      <div className="about-layout">
        <div className="about-body">
          <p>I'm a Computer Science Engineering student who enjoys designing thoughtful interfaces and building AI-powered applications. My best work happens when <strong>beautiful UI meets meaningful engineering</strong>.</p>
          <p>My current interests span Artificial Intelligence, Computer Vision, Human Computer Interaction, Frontend Engineering, and Product Design. Outside development, you'll usually find me exploring mobile photography or creating UI concepts in Figma.</p>
          <div className="about-note">
            <Sparkles size={18} />
            <span><strong>Currently building:</strong> AkashaLens, RINTI AI Assistant, and this personal portfolio system.</span>
          </div>
        </div>
        <div className="info-grid">
          <article className="info-card glass-card" data-testid="card-education">
            <small>01 / education</small>
            <h3>B.Tech Computer Science Engineering</h3>
            <p>Chanakya University</p>
          </article>
          <article className="info-card glass-card" data-testid="card-focus">
            <small>02 / focus</small>
            <h3>AI Engineering<br />UI / UX Design<br />Frontend Development</h3>
          </article>
          <article className="info-card glass-card" data-testid="card-location">
            <small>03 / base</small>
            <h3>Bangalore</h3>
            <p>Karnataka, India</p>
          </article>
          <article className="info-card glass-card" data-testid="card-availability">
            <small>04 / signal</small>
            <h3>Internship ready</h3>
            <p>Open to thoughtful teams</p>
          </article>
        </div>
      </div>
      <div className="stat-strip" aria-label="Portfolio statistics">
        <div className="stat"><strong>3+</strong><span>Major projects</span></div>
        <div className="stat"><strong>AI</strong><span>Focused learning</span></div>
        <div className="stat"><strong>2026</strong><span>Internship ready</span></div>
      </div>
    </section>
  );
}

function ProjectCard({ project, index }: { project: typeof projects[number]; index: number }) {
  return (
    <article
      className={`project-card glass-card reveal ${project.featured ? 'featured' : ''}`}
      data-testid={`card-project-${index + 1}`}
    >
      <div>
        <div className="project-index">{project.number}</div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        {project.visual && (
          <div className="project-visual" aria-hidden="true">
            <span className="visual-label">AKASHALENS // SATELLITE VISION</span>
            <div className="visual-scan" />
            <div className="visual-map" />
          </div>
        )}
        <div className="project-tags">
          {project.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
        </div>
      </div>
      <div className="project-footer">
        <span className="project-type">{project.type}</span>
        <a
          className="project-link"
          href={project.link}
          target={project.link.startsWith('http') ? '_blank' : undefined}
          rel={project.link.startsWith('http') ? 'noreferrer' : undefined}
          data-testid={`link-project-${index + 1}`}
        >
          {project.linkLabel} <ArrowUpRight size={14} />
        </a>
      </div>
    </article>
  );
}

function Projects() {
  return (
    <section className="section section-band" id="projects" data-section="projects">
      <div className="section-head reveal">
        <div>
          <div className="eyebrow">/ Featured projects</div>
          <h2 className="section-title">Things I'm <span>building.</span></h2>
        </div>
        <p className="section-intro">A small constellation of experiments and products. Each one starts with a question, not a template.</p>
      </div>
      <div className="project-layout">
        {projects.map((project, index) => (
          <ProjectCard project={project} index={index} key={project.title} />
        ))}
      </div>
    </section>
  );
}

function Skills() {
  return (
    <section className="section reveal" id="skills" data-section="skills">
      <div className="section-head">
        <div>
          <div className="eyebrow">/ Skills & technologies</div>
          <h2 className="section-title">Tools for <span>intelligent products.</span></h2>
        </div>
        <p className="section-intro">I work across the stack — from the first wireframe to the API behind the final interaction.</p>
      </div>
      <div className="skills-layout">
        <div>
          <p className="skill-intro">The stack changes. The principle stays the same: make complex systems feel legible, responsive, and worth returning to.</p>
          <div className="signal-list">
            <span className="signal"><i /> DESIGN WITH INTENT</span>
            <span className="signal"><i /> BUILD FOR CLARITY</span>
            <span className="signal"><i /> LEARN IN PUBLIC</span>
          </div>
        </div>
        <div className="skill-groups">
          {skillGroups.map((group) => {
            const Icon = group.icon;
            return (
              <article className="skill-group glass-card" key={group.code}>
                <div className="skill-group-head">
                  <h3>
                    <Icon size={15} style={{ color: 'var(--clr-sage)' }} />
                    {group.title}
                  </h3>
                  <small>{group.code}</small>
                </div>
                <div className="skill-pills">
                  {group.skills.map((skill) => <span className="skill-pill" key={skill}>{skill}</span>)}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="section section-band reveal" id="journey" data-section="journey">
      <div className="journey-wrap">
        <div className="journey-copy">
          <div className="eyebrow">/ My journey</div>
          <h2 className="section-title">Where I'm <span>heading.</span></h2>
          <p>A timeline in progress. The direction is clear even when the next experiment isn't.</p>
        </div>
        <div className="timeline">
          {journey.map((item) => (
            <article className="timeline-item" key={item.year}>
              <div className="timeline-year">{item.year}</div>
              <div className="timeline-content">
                <small>{item.phase}</small>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    from_name: '',
    reply_to: '',
    business_name: '',
    website_type: '',
    budget: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );
      
      setSent(true);
      setFormData({
        from_name: '',
        reply_to: '',
        business_name: '',
        website_type: '',
        budget: '',
        message: ''
      });
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Something went wrong while sending your request. Please try again or email directly.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section reveal" id="contact" data-section="contact">
      <div className="section-head">
        <div>
          <div className="eyebrow">/ Contact</div>
          <h2 className="section-title">Let's build something <span>meaningful.</span></h2>
        </div>
        <p className="section-intro">Internship opportunities, freelance design work, AI collaborations, or a good software problem. Send a signal.</p>
      </div>
      <div className="contact-grid">
        <div className="contact-copy">
          <p>Whether it's an internship, hackathon, startup idea, or collaboration, I'd love to hear what you're working on.</p>
          <div className="contact-details">
            <div className="contact-detail"><Mail size={16} /><a href="mailto:hi.samsstudio@gmail.com" data-testid="link-contact-email">hi.samsstudio@gmail.com</a></div>
            <div className="contact-detail"><MapPin size={16} /><span>Bangalore, Karnataka, India</span></div>
            <div className="contact-detail"><Github size={16} /><a href="https://github.com/Samudra-GITHub" target="_blank" rel="noreferrer">github.com/Samudra-GITHub</a></div>
            <div className="contact-detail"><Linkedin size={16} /><a href="https://linkedin.com/in/samudra-kar" target="_blank" rel="noreferrer">linkedin.com/in/samudra-kar</a></div>
          </div>
          <SocialLinks />
        </div>
        <div className="contact-form glass-card">
          {sent ? (
            <div className="studio-success" role="status" data-testid="status-contact-success">
              <CheckCircle2 size={32} />
              <strong>Project request received.</strong>
              <span>Thanks for reaching out to Sam's Studio. I'll review your project and reply within 24 hours.</span>
              <button 
                type="button" 
                className="button button-ghost" 
                data-testid="button-send-another" 
                onClick={() => setSent(false)}
              >
                Send another request
              </button>
            </div>
          ) : (
            <>
              <div className="form-head">
                <h3>Send a message</h3>
                <span className="form-status"><i /> Available now</span>
              </div>
              <form onSubmit={handleSubmit} data-testid="form-contact">
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="from_name">Your Name</label>
                    <input id="from_name" name="from_name" required placeholder="How should I address you?" value={formData.from_name} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label htmlFor="reply_to">Email Address</label>
                    <input id="reply_to" name="reply_to" type="email" required placeholder="you@company.com" value={formData.reply_to} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label htmlFor="business_name">Business Name</label>
                    <input id="business_name" name="business_name" placeholder="Company or project name" value={formData.business_name} onChange={handleChange} />
                  </div>
                  <div className="field">
                    <label htmlFor="website_type">Website Type</label>
                    <input id="website_type" name="website_type" placeholder="e.g. Landing Page, E-commerce" value={formData.website_type} onChange={handleChange} />
                  </div>
                  <div className="field full">
                    <label htmlFor="budget">Budget</label>
                    <input id="budget" name="budget" placeholder="e.g. ₹15,000+" value={formData.budget} onChange={handleChange} />
                  </div>
                  <div className="field full">
                    <label htmlFor="message">Message</label>
                    <textarea id="message" name="message" required placeholder="Tell me about your business..." value={formData.message} onChange={handleChange} />
                  </div>
                </div>
                <button 
                  className="button button-primary form-submit" 
                  type="submit" 
                  disabled={loading}
                  data-testid="button-submit-contact"
                >
                  {loading ? "Sending Project Request..." : <>Send Project Request <Send size={14} /></>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function Portfolio() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('[data-section]'));
    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActiveSection(visible.target.getAttribute('data-section') || 'hero');
    }, { rootMargin: '-28% 0px -56% 0px', threshold: [0, .2, .5, .8] });
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add('is-visible'); }),
      { threshold: .12 },
    );
    document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));
    return () => revealObserver.disconnect();
  }, []);

  useEffect(() => {
    const nav = document.querySelector('.site-nav');
    const onScroll = () => nav?.classList.toggle('is-scrolled', window.scrollY > 30);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="site-shell">
      <div className="site-background" aria-hidden="true">
        <img
          src="/forest-background.jpg"
          alt=""
          className="site-background-image"
        />
        <div className="site-background-overlay" />
      </div>
      <div className="site-content">
        <Navigation activeSection={activeSection} />
        <main className="page-main">
          <Hero />

          <About />

          {/* =========================
              SAM'S STUDIO
             ========================= */}
          <StudioSection />

          <Projects />

          <Skills />

          <Journey />

          <Contact />
        </main>
        <footer className="site-footer">
          <div>
            <span className="footer-brand">Samudra Kar</span>
            <br />
            <span>Founder • Sam's Studio • AI Engineer • UI/UX Designer</span>
          </div>
          <span className="footer-note">Designed and developed in Bangalore / 2026</span>
          <a href="#hero" data-testid="link-footer-top">Back to top <ArrowUpRight size={13} /></a>
        </footer>
      </div>
    </div>
  );
}

// function Router() {
//   return (
//     <ErrorBoundary>
//       <Switch>
//         <Route path="/" component={Portfolio} />
//         <Route component={NotFound} />
//       </Switch>
//     </ErrorBoundary>
//   );
// }

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
        <Portfolio />
      </WouterRouter>
    </QueryClientProvider>
  );
}

export default App;