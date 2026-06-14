import { Link } from 'react-router-dom';
import { fallbackProfile } from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProfile } from '../services/profileService.js';

const highlights = [
  { value: 'React', label: 'Frontend moderne' },
  { value: 'Supabase', label: 'Donnees dynamiques' },
  { value: 'IA + Cyber', label: 'Positionnement technique' },
];

export default function Home() {
  const { data: profile, error, isLoading } = useAsyncData(getProfile, []);
  const activeProfile = profile ?? fallbackProfile;

  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="eyebrow">Portfolio professionnel</p>
        <h1>{activeProfile.title}</h1>
        <p>{activeProfile.bio}</p>
        {(isLoading || error || !isSupabaseConfigured) && (
          <p className="status-note">
            {isLoading && isSupabaseConfigured
              ? 'Chargement du profil depuis Supabase...'
              : 'Mode demonstration : configure Supabase pour afficher les donnees reelles.'}
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
    </section>
  );
}
