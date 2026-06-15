import { fallbackProfile } from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { getProfile } from '../services/profileService.js';

function FooterLink({ href, label }) {
  if (!href) {
    return null;
  }

  return (
    <a href={href} rel="noreferrer" target="_blank">
      {label}
    </a>
  );
}

function normalizePhoneHref(phone) {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

export default function Footer() {
  const { data: profile } = useAsyncData(getProfile, []);
  const activeProfile = profile ?? fallbackProfile;

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <strong>{activeProfile.name}</strong>
        <p>{activeProfile.title}</p>
      </div>

      <div className="footer-contact" aria-label="Coordonnees">
        {activeProfile.email && <a href={`mailto:${activeProfile.email}`}>{activeProfile.email}</a>}
        {activeProfile.phone && (
          <a href={normalizePhoneHref(activeProfile.phone)}>{activeProfile.phone}</a>
        )}
        {activeProfile.location && <span>{activeProfile.location}</span>}
      </div>

      <div className="footer-links" aria-label="Reseaux sociaux">
        <FooterLink href={activeProfile.github_url} label="GitHub" />
        <FooterLink href={activeProfile.linkedin_url} label="LinkedIn" />
        <FooterLink href={activeProfile.website_url} label="Site web" />
        <FooterLink href={activeProfile.cv_url} label="CV" />
      </div>
    </footer>
  );
}
