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
          <h1>Contactez-moi</h1>
          <p>
            Vous avez une question, une proposition de projet ou souhaitez simplement discuter de vos besoins ?
          </p>

          <div className="contact-email-card">
            <span>Email</span>
            <strong>{adminEmail || 'bientôt disponible'}</strong>
          </div>

          {(isLoading || error || !isSupabaseConfigured) && (
            <p className="status-note">
              {isLoading && isSupabaseConfigured
                ? "Chargement de contact..."
                : "Les données seront bientôt disponibles."}
            </p>
          )}
        </aside>

        <div className="contact-form-panel">
          <div className="contact-form-heading">
            <p className="eyebrow">Message</p>
            <h2>Envoyer un message</h2>
          </div>
          <ContactForm adminEmail={adminEmail} />
        </div>
      </div>
    </section>
  );
}
