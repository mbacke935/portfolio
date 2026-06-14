import {
  fallbackCertifications,
  fallbackEducation,
} from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getCertifications } from '../services/certificationService.js';
import { getEducation } from '../services/educationService.js';

function formatPeriod(item) {
  const start = item.start_date ?? '';
  const end = item.end_date ?? 'En cours';

  if (!start && !item.end_date) {
    return '';
  }

  return `${start || 'Debut'} - ${end}`;
}

export default function Credentials() {
  const educationState = useAsyncData(getEducation, []);
  const certificationsState = useAsyncData(getCertifications, []);

  const education = educationState.data?.length
    ? educationState.data
    : fallbackEducation;
  const certifications = certificationsState.data?.length
    ? certificationsState.data
    : fallbackCertifications;
  const hasFallback =
    !isSupabaseConfigured || educationState.error || certificationsState.error;

  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Parcours</p>
        <h1>Diplomes & Certificats</h1>
        <p>
          Diplomes, formations et certifications geres depuis l'espace admin et
          publies automatiquement sur le portfolio.
        </p>
        {hasFallback && (
          <p className="status-note">
            Mode demonstration : les donnees reelles apparaitront apres
            configuration de Supabase.
          </p>
        )}
      </div>

      <div className="split-section">
        <section>
          <h2>Diplomes</h2>
          {education.map((item) => (
            <article className="timeline-item" key={item.id}>
              <h3>{item.degree}</h3>
              <p>{item.institution}</p>
              {formatPeriod(item) && (
                <p className="meta-text">{formatPeriod(item)}</p>
              )}
              {item.description && <p>{item.description}</p>}
            </article>
          ))}
        </section>

        <section>
          <h2>Certificats</h2>
          {certifications.map((item) => (
            <article className="timeline-item" key={item.id}>
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
