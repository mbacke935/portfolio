import ContactForm from '../components/ContactForm.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProfile } from '../services/profileService.js';

export default function Contact() {
  const { data: profile, error, isLoading } = useAsyncData(getProfile, []);
  const adminEmail = profile?.email ?? '';

  return (
    <section className="page-section contact-page">
      <div className="contact-layout">
        <aside className="contact-panel">
          <p className="eyebrow">Contact</p>
          <h1>Discutons d'un projet</h1>
          <p>
            Presente ton besoin, ton idee ou une opportunite professionnelle. Le
            message sera prepare pour l'adresse configuree dans l'espace admin.
          </p>

          <div className="contact-email-card">
            <span>Email admin</span>
            <strong>{adminEmail || 'A configurer dans admin'}</strong>
          </div>

          {(isLoading || error || !isSupabaseConfigured) && (
            <p className="status-note">
              {isLoading && isSupabaseConfigured
                ? "Chargement de l'email de contact..."
                : "Mode demonstration : configure l'email public dans l'admin."}
            </p>
          )}
        </aside>

        <div className="contact-form-panel">
          <div className="contact-form-heading">
            <p className="eyebrow">Message</p>
            <h2>Envoyer une demande</h2>
          </div>
          <ContactForm adminEmail={adminEmail} />
        </div>
      </div>
    </section>
  );
}
