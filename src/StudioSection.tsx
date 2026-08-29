import { useEffect, useRef } from "react";
import {
  MonitorSmartphone,
  Globe,
  PenTool,
  MoveRight,
  ArrowUpRight
} from "lucide-react";

export function StudioSection() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            el.classList.add("is-visible");
            const revealItems = el.querySelectorAll<HTMLElement>(".studio-reveal");
            revealItems.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add("studio-reveal--visible");
              }, index * 90);
            });
          }
        });
      },
      { threshold: 0.12 }
    );
    
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="studio" data-section="studio" className="studio-section section reveal">
      
      {/* ─── AMBIENT BACKGROUNDS ─── */}
      <div className="studio-section__ambient studio-section__ambient--sage" aria-hidden="true" />
      <div className="studio-section__ambient studio-section__ambient--yellow" aria-hidden="true" />

      {/* ─── HEADER ─── */}
      <div className="section-head">
        <div>
          <div className="eyebrow">/ Sam's Studio</div>
          <h2 className="section-title">
            Premium websites for businesses that want to <span>stand out.</span>
          </h2>
        </div>
        <p className="section-intro">
          Beautiful websites that help local businesses attract customers, build trust,
          and grow online — designed with premium UI/UX and built for speed,
          responsiveness, and SEO.
        </p>
      </div>

      {/* ─── SECTION 1: SERVICES ─── */}
      <div className="studio-services">
        <article className="studio-service-card glass-card studio-reveal">
          <div className="studio-service-icon">
            <MonitorSmartphone size={22} />
          </div>
          <h3>Landing Page</h3>
          <div className="studio-price">₹5,000</div>
          <p>A modern one-page website perfect for cafés, creators, and new businesses.</p>
          <ul className="studio-features">
            <li>Responsive Design</li>
            <li>WhatsApp Integration</li>
            <li>Google Maps</li>
            <li>SEO Ready</li>
          </ul>
        </article>

        <article className="studio-service-card glass-card studio-reveal">
          <div className="studio-service-icon">
            <Globe size={22} />
          </div>
          <h3>Business Website</h3>
          <div className="studio-price">₹8,000+</div>
          <p>A complete multi-page website built for businesses ready to grow online.</p>
          <ul className="studio-features">
            <li>3–5 Pages</li>
            <li>Custom Branding</li>
            <li>Contact Forms</li>
            <li>Performance Optimized</li>
          </ul>
        </article>

        <article className="studio-service-card glass-card studio-reveal">
          <div className="studio-service-icon">
            <PenTool size={22} />
          </div>
          <h3>UI/UX Design</h3>
          <div className="studio-price">Custom Quote</div>
          <p>Premium Figma designs before development starts.</p>
          <ul className="studio-features">
            <li>Wireframes</li>
            <li>High-Fidelity UI</li>
            <li>Design System</li>
            <li>Prototype Included</li>
          </ul>
        </article>
      </div>

      {/* ─── EXTRA: WHY SAM'S STUDIO? ─── */}
      <div className="studio-why studio-reveal">
        <div className="glass-card studio-stat-card">
          <h4>⚡ Fast Delivery</h4>
          <p>Launch your website in 5–10 days.</p>
        </div>

        <div className="glass-card studio-stat-card">
          <h4>📱 Mobile First</h4>
          <p>Designed for phones before desktops.</p>
        </div>

        <div className="glass-card studio-stat-card">
          <h4>🎨 Premium Design</h4>
          <p>Custom UI inspired by modern SaaS products.</p>
        </div>

        <div className="glass-card studio-stat-card">
          <h4>🔍 SEO Ready</h4>
          <p>Optimized for Google search from day one.</p>
        </div>
      </div>

      {/* ─── SECTION 2: INDUSTRIES ─── */}
      <h3 className="studio-heading studio-reveal">Who We Build For</h3>
      <div className="studio-industries">
        <article className="studio-industry-card glass-card studio-reveal">
          <div className="studio-industry-visual studio-industry-cafe">
            <span>Website Preview</span>
          </div>
          <div className="studio-industry-content">
            <h4>Cafés & Coffee Shops</h4>
            <p>Warm, inviting layouts that drive foot traffic.</p>
            <button
              className="project-link"
              onClick={() => {
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Website Concept <ArrowUpRight size={14} />
            </button>
          </div>
        </article>

        <article className="studio-industry-card glass-card studio-reveal">
          <div className="studio-industry-visual studio-industry-salon">
            <span>Website Preview</span>
          </div>
          <div className="studio-industry-content">
            <h4>Salons & Beauty Studios</h4>
            <p>Elegant service menus with clear booking paths.</p>
            <button
              className="project-link"
              onClick={() => {
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Website Concept <ArrowUpRight size={14} />
            </button>
          </div>
        </article>

        <article className="studio-industry-card glass-card studio-reveal">
          <div className="studio-industry-visual studio-industry-gym">
            <span>Website Preview</span>
          </div>
          <div className="studio-industry-content">
            <h4>Gyms & Fitness Studios</h4>
            <p>High-energy interfaces for schedules and signups.</p>
            <button
              className="project-link"
              onClick={() => {
                document
                  .getElementById("contact")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              View Website Concept <ArrowUpRight size={14} />
            </button>
          </div>
        </article>
      </div>

      {/* ─── SECTION 3: PROCESS TIMELINE ─── */}
      <h3 className="studio-heading studio-reveal">Process Timeline</h3>
      <div className="studio-process studio-reveal">
        <div className="studio-step">
          <span className="studio-step-num">01</span>
          <div className="studio-step-content">
            <span className="studio-step-name">Discovery</span>
            <span className="studio-step-description">Understand your business.</span>
          </div>
        </div>
        <MoveRight className="studio-step-arrow" size={16} />
        
        <div className="studio-step">
          <span className="studio-step-num">02</span>
          <div className="studio-step-content">
            <span className="studio-step-name">Design</span>
            <span className="studio-step-description">Create Figma UI.</span>
          </div>
        </div>
        <MoveRight className="studio-step-arrow" size={16} />
        
        <div className="studio-step">
          <span className="studio-step-num">03</span>
          <div className="studio-step-content">
            <span className="studio-step-name">Development</span>
            <span className="studio-step-description">Build responsive website.</span>
          </div>
        </div>
        <MoveRight className="studio-step-arrow" size={16} />
        
        <div className="studio-step">
          <span className="studio-step-num">04</span>
          <div className="studio-step-content">
            <span className="studio-step-name">Review</span>
            <span className="studio-step-description">Unlimited revisions.</span>
          </div>
        </div>
        <MoveRight className="studio-step-arrow" size={16} />
        
        <div className="studio-step">
          <span className="studio-step-num">05</span>
          <div className="studio-step-content">
            <span className="studio-step-name">Launch</span>
            <span className="studio-step-description">Deploy and hand over.</span>
          </div>
        </div>
      </div>

      {/* ─── SECTION 4: CTA BANNER ─── */}
      <div className="studio-cta studio-reveal">
        <h3 className="studio-cta-title">Ready to give your business a premium online presence?</h3>
        <p className="studio-cta-text">
          Whether you're opening a café, running a salon, launching a startup, 
          or growing a local business, Sam's Studio can design and build a website 
          tailored for your brand.
        </p>
        <a href="#contact" className="button button-primary">
          Start Your Project <MoveRight size={16} />
        </a>
      </div>

    </section>
  );
}