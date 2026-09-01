import { Github, Instagram, Linkedin, Mail } from 'lucide-react';

export function SocialLinks({ className = 'social-row' }: { className?: string }) {
  return (
    <div className={className} aria-label="Social links">
      <a className="social-link" data-testid="link-github" href="https://github.com/Samudra-GITHub" target="_blank" rel="noreferrer" aria-label="GitHub" data-cursor-hover>
        <Github size={16} />
      </a>
      <a className="social-link" data-testid="link-linkedin" href="https://linkedin.com/in/samudra-kar" target="_blank" rel="noreferrer" aria-label="LinkedIn" data-cursor-hover>
        <Linkedin size={16} />
      </a>
      <a className="social-link" data-testid="link-email" href="mailto:hi.samsstudio@gmail.com" aria-label="Email Samudra" data-cursor-hover>
        <Mail size={16} />
      </a>
      <a className="social-link" data-testid="link-instagram" href="https://instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram" data-cursor-hover>
        <Instagram size={16} />
      </a>
    </div>
  );
}
