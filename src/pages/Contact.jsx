import ContactForm from '../components/ContactForm.jsx';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProfile } from '../services/profileService.js';

export default function Contact() {
  const { data: profile, error, isLoading } = useAsyncData(getProfile, []);

  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Contact</p>
        <h1>Discutons d'un projet</h1>
        <p>
          Envoie un message professionnel a l'email configure dans l'espace
          admin.
        </p>
        {(isLoading || error || !isSupabaseConfigured) && (
          <p className="status-note">
            {isLoading && isSupabaseConfigured
              ? "Chargement de l'email de contact..."
              : "Mode demonstration : configure l'email public dans l'admin."}
          </p>
        )}
      </div>

      <ContactForm adminEmail={profile?.email ?? ''} />
    </section>
  );
}
