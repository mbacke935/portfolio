import ContactForm from '../components/ContactForm.jsx';
import { fallbackProfile } from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProfile } from '../services/profileService.js';

function IconEmail() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <rect height="16" rx="3" stroke="currentColor" strokeWidth="2" width="20" x="2" y="4" />
      <path d="m2 7 10 7 10-7" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path
        d="M6.6 10.8a15.2 15.2 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24 11.4 11.4 0 0 0 3.6.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.4 11.4 0 0 0 .6 3.6 1 1 0 0 1-.24 1L6.6 10.8Z"
        stroke="currentColor"
        strokeWidth="2"
      />
    </svg>
  );
}

function IconLocation() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path
        d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="12" cy="9" fill="currentColor" r="2.5" />
    </svg>
  );
}

function IconGithub() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function IconLinkedin() {
  return (
    <svg aria-hidden="true" fill="currentColor" height="20" viewBox="0 0 24 24" width="20">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286ZM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065Zm1.782 13.019H3.555V9h3.564v11.452ZM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003Z" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path
        d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
      <path
        d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function ContactInfoItem({ href, icon, label, value }) {
  const content = (
    <div className="contact-info-item">
      <span className="contact-info-item__icon">{icon}</span>
      <div>
        <span className="contact-info-item__label">{label}</span>
        <strong className="contact-info-item__value">{value}</strong>
      </div>
    </div>
  );

  if (href) {
    return (
      <a className="contact-info-link" href={href} rel="noreferrer" target="_blank">
        {content}
      </a>
    );
  }

  return content;
}

export default function Contact() {
  const { data: profile, isLoading } = useAsyncData(getProfile, []);
  const activeProfile = profile ?? fallbackProfile;
  const adminEmail = activeProfile.email ?? '';

  const socialLinks = Array.isArray(activeProfile.social_links)
    ? activeProfile.social_links
    : [];

  return (
    <section className="contact-page">
      <div className="contact-hero">
        <p className="eyebrow">Contact</p>
        <h1>Travaillons ensemble</h1>
        <p className="contact-hero__sub">
          Une question, une opportunité ou un projet ? Je suis disponible pour en discuter.
        </p>
      </div>

      <div className="contact-body">
        <aside className="contact-sidebar">
          <div className="contact-sidebar__section">
            <h2>Me contacter</h2>

            <div className="contact-info-list">
              {adminEmail && (
                <ContactInfoItem
                  href={`mailto:${adminEmail}`}
                  icon={<IconEmail />}
                  label="Email"
                  value={adminEmail}
                />
              )}
              {activeProfile.phone && (
                <ContactInfoItem
                  href={`tel:${activeProfile.phone.replace(/[^\d+]/g, '')}`}
                  icon={<IconPhone />}
                  label="Téléphone"
                  value={activeProfile.phone}
                />
              )}
              {activeProfile.location && (
                <ContactInfoItem
                  icon={<IconLocation />}
                  label="Localisation"
                  value={activeProfile.location}
                />
              )}
            </div>
          </div>

          {(activeProfile.github_url || activeProfile.linkedin_url || activeProfile.website_url || socialLinks.length > 0) && (
            <div className="contact-sidebar__section">
              <h2>Réseaux & profils</h2>
              <div className="contact-info-list">
                {activeProfile.github_url && (
                  <ContactInfoItem
                    href={activeProfile.github_url}
                    icon={<IconGithub />}
                    label="GitHub"
                    value={activeProfile.github_url.replace('https://', '')}
                  />
                )}
                {activeProfile.linkedin_url && (
                  <ContactInfoItem
                    href={activeProfile.linkedin_url}
                    icon={<IconLinkedin />}
                    label="LinkedIn"
                    value={activeProfile.linkedin_url.replace('https://', '')}
                  />
                )}
                {activeProfile.website_url && (
                  <ContactInfoItem
                    href={activeProfile.website_url}
                    icon={<IconLink />}
                    label="Site web"
                    value={activeProfile.website_url.replace('https://', '')}
                  />
                )}
                {socialLinks.map((link) => (
                  <ContactInfoItem
                    href={link.url}
                    icon={<IconLink />}
                    key={link.url}
                    label={link.label}
                    value={link.url.replace('https://', '')}
                  />
                ))}
              </div>
            </div>
          )}

          {isLoading && !isSupabaseConfigured && (
            <p className="status-note">Les données seront bientôt disponibles.</p>
          )}
        </aside>

        <div className="contact-form-panel">
          <div className="contact-form-heading">
            <h2>Envoyer un message</h2>
            <p>Je réponds généralement sous 24 à 48 heures.</p>
          </div>
          <ContactForm adminEmail={adminEmail} />
        </div>
      </div>
    </section>
  );
}
