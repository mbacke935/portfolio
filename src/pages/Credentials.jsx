import {
  fallbackCertifications,
  fallbackEducation,
  fallbackProfile,
} from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getCertifications } from '../services/certificationService.js';
import { getEducation } from '../services/educationService.js';
import { getProfile } from '../services/profileService.js';

function formatPeriod(item) {
  const start = item.start_date ?? '';
  const end = item.end_date ?? 'En cours';

  if (!start && !item.end_date) {
    return '';
  }

  return `${start || 'Debut'} - ${end}`;
}

export default function Credentials() {
  const profileState = useAsyncData(getProfile, []);
  const educationState = useAsyncData(getEducation, []);
  const certificationsState = useAsyncData(getCertifications, []);

  const profile = profileState.data ?? fallbackProfile;
  const education = educationState.data?.length
    ? educationState.data
    : fallbackEducation;
  const certifications = certificationsState.data?.length
    ? certificationsState.data
    : fallbackCertifications;
  const hasFallback =
    !isSupabaseConfigured ||
    profileState.error ||
    educationState.error ||
    certificationsState.error;

  return (
    <section className="page-section credentials-page">
      <div className="credentials-hero">
        <div className="section-heading">
          <p className="eyebrow">Parcours</p>
          <h1>Diplomes & Certificats</h1>
          <p>
            Diplomes, formations et certifications geres depuis l'espace admin
            et publies automatiquement sur le portfolio.
          </p>
        </div>
        {hasFallback && (
          <p className="status-note">
            Mode demonstration : les donnees reelles apparaitront apres
            configuration de Supabase.
          </p>
        )}
      </div>

      <section className="credentials-summary">
        <p className="eyebrow">Parcours scolaire et universitaire</p>
        <h2>Chemin academique</h2>
        <p>{profile.education_summary ?? fallbackProfile.education_summary}</p>
      </section>

      <div className="credentials-grid">
        <section className="credentials-panel">
          <h2>Diplomes</h2>
          {education.map((item) => (
            <article className="credential-item" key={item.id}>
              <h3>{item.degree}</h3>
              <p>{item.institution}</p>
              {formatPeriod(item) && (
                <p className="meta-text">{formatPeriod(item)}</p>
              )}
              {item.description && <p>{item.description}</p>}
            </article>
          ))}
        </section>

        <section className="credentials-panel credentials-panel--light">
          <h2>Certificats</h2>
          {certifications.map((item) => (
            <article className="credential-item" key={item.id}>
              {item.image_url && (
                <img
                  className="credential-image"
                  src={item.image_url}
                  alt=""
                  loading="lazy"
                />
              )}
              <h3>{item.title}</h3>
              <p>{item.issuer}</p>
              {item.issue_date && (
                <p className="meta-text">Obtenu le {item.issue_date}</p>
              )}
              {item.credential_url && (
                <a
                  className="text-link"
                  href={item.credential_url}
                  rel="noreferrer"
                  target="_blank"
                >
                  Voir le certificat
                </a>
              )}
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}
