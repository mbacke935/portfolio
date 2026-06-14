import { Link } from 'react-router-dom';
import { fallbackProfile } from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProfile } from '../services/profileService.js';

const highlights = [
  { value: 'Profil', label: 'Informations gerees depuis admin' },
  { value: 'Projets', label: 'Affichage dynamique Supabase' },
  { value: 'Contact', label: 'Formulaire professionnel' },
];

export default function Home() {
  const { data: profile, error, isLoading } = useAsyncData(getProfile, []);
  const activeProfile = profile ?? fallbackProfile;

  return (
    <section className="hero-section">
      <div className="hero-content">
        <div className="hero-profile">
          <div className="hero-photo" aria-label="Photo professionnelle">
            {activeProfile.avatar_url ? (
              <img src={activeProfile.avatar_url} alt={activeProfile.name} />
            ) : (
              <span aria-hidden="true">
                {activeProfile.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2)}
              </span>
            )}
          </div>

          <div className="hero-copy">
            <p className="eyebrow">Portfolio professionnel</p>
            <h1>{activeProfile.name}</h1>
            <p className="hero-title">{activeProfile.title}</p>
            <p>{activeProfile.bio}</p>
            {(isLoading || error || !isSupabaseConfigured) && (
              <p className="status-note">
                {isLoading && isSupabaseConfigured
                  ? 'Chargement du profil depuis Supabase...'
                  : 'Mode demonstration : configure Supabase pour afficher les infos admin.'}
              </p>
            )}
            <div className="hero-actions">
              <Link className="button button--primary" to="/projects">
                Voir les projets
              </Link>
              <Link className="button button--secondary" to="/contact">
                Me contacter
              </Link>
            </div>

            <div className="hero-highlights" aria-label="Points forts">
              {highlights.map((item) => (
                <div className="highlight-item" key={item.value}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
