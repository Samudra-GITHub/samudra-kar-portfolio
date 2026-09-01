import { type FormEvent, useState } from 'react';
import emailjs from '@emailjs/browser';
import { ArrowUpRight, CheckCircle2, Github, Linkedin, Mail, MapPin, Send } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { Magnetic } from '@/components/MagneticButton';
import { SocialLinks } from '@/components/SocialLinks';

const initialForm = {
  from_name: '',
  reply_to: '',
  business_name: '',
  website_type: '',
  budget: '',
  message: '',
};

export function Contact() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState(initialForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    try {
      await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        formData,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
      );
      setSent(true);
      setFormData(initialForm);
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('Something went wrong while sending your request. Please try again or email directly.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="section contact-scene" id="contact" data-section="contact">
      <div className="contact-atmosphere" aria-hidden="true" />
      <Reveal className="section-head">
        <div>
          <div className="eyebrow">/ Contact</div>
          <h2 className="section-title">
            Let's build something <span>meaningful.</span>
          </h2>
        </div>
        <p className="section-intro">
          Internships, AI collaborations, frontend work, UI/UX opportunities, or an interesting software problem —
          send a signal.
        </p>
      </Reveal>

      <div className="contact-grid">
        <Reveal className="contact-copy" delay={0.05}>
          <p>
            Whether it's an internship, a hackathon, an AI collaboration, or a frontend/UI project worth building
            properly, I'd love to hear what you're working on.
          </p>

          <div className="contact-cta-row">
            <Magnetic as="a" className="button button-primary" href="mailto:hi.samsstudio@gmail.com" data-cursor-hover>
              Email me <Mail size={15} />
            </Magnetic>
            <Magnetic
              as="a"
              className="button button-ghost"
              href="https://github.com/Samudra-GITHub"
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
            >
              View GitHub <ArrowUpRight size={15} />
            </Magnetic>
            <Magnetic
              as="a"
              className="button button-secondary"
              href="https://linkedin.com/in/samudra-kar"
              target="_blank"
              rel="noreferrer"
              data-cursor-hover
            >
              Connect on LinkedIn <ArrowUpRight size={15} />
            </Magnetic>
          </div>

          <div className="contact-details">
            <div className="contact-detail">
              <Mail size={16} />
              <a href="mailto:hi.samsstudio@gmail.com" data-testid="link-contact-email" data-cursor-hover>
                hi.samsstudio@gmail.com
              </a>
            </div>
            <div className="contact-detail">
              <MapPin size={16} />
              <span>Bangalore, Karnataka, India</span>
            </div>
            <div className="contact-detail">
              <Github size={16} />
              <a href="https://github.com/Samudra-GITHub" target="_blank" rel="noreferrer" data-cursor-hover>
                github.com/Samudra-GITHub
              </a>
            </div>
            <div className="contact-detail">
              <Linkedin size={16} />
              <a href="https://linkedin.com/in/samudra-kar" target="_blank" rel="noreferrer" data-cursor-hover>
                linkedin.com/in/samudra-kar
              </a>
            </div>
          </div>
          <SocialLinks />
        </Reveal>

        <Reveal className="contact-form glass-card glass-medium" delay={0.1}>
          {sent ? (
            <div className="studio-success" role="status" data-testid="status-contact-success">
              <CheckCircle2 size={32} />
              <strong>Project request received.</strong>
              <span>Thanks for reaching out to Sam's Studio. I'll review your project and reply within 24 hours.</span>
              <button type="button" className="button button-ghost" data-testid="button-send-another" onClick={() => setSent(false)}>
                Send another request
              </button>
            </div>
          ) : (
            <>
              <div className="form-head">
                <h3>Send a message</h3>
                <span className="form-status">
                  <i /> Available now
                </span>
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
                <Magnetic
                  as="button"
                  className="button button-primary form-submit"
                  type="submit"
                  disabled={loading}
                  data-testid="button-submit-contact"
                  strength={0.2}
                >
                  {loading ? 'Sending Project Request...' : <>Send Project Request <Send size={14} /></>}
                </Magnetic>
              </form>
            </>
          )}
        </Reveal>
      </div>
    </section>
  );
}
