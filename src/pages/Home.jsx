import { Link } from 'react-router-dom';
import {
  fallbackEducation,
  fallbackProfile,
  fallbackProjects,
  fallbackSkills,
} from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProfile } from '../services/profileService.js';
import { getFeaturedProjects } from '../services/projectService.js';
import { getEducation } from '../services/educationService.js';
import { getSkills } from '../services/skillService.js';

function formatCount(count, singular, plural) {
  return `${count} ${count > 1 ? plural : singular}`;
}

export default function Home() {
  const { data: profile, error, isLoading } = useAsyncData(getProfile, []);
  const skillsState = useAsyncData(getSkills, []);
  const projectsState = useAsyncData(getFeaturedProjects, []);
  const educationState = useAsyncData(getEducation, []);

  const activeProfile = profile ?? fallbackProfile;
  const skills = skillsState.data?.length ? skillsState.data : fallbackSkills;
  const projects = projectsState.data?.length ? projectsState.data : fallbackProjects;
  const education = educationState.data?.length
    ? educationState.data
    : fallbackEducation;

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

            <div className="hero-highlights" aria-label="Sections principales">
              <Link className="highlight-item highlight-item--link" to="/about">
                <strong>Competences</strong>
                <span>{formatCount(skills.length, 'competence publiee', 'competences publiees')}</span>
              </Link>

              <Link className="highlight-item highlight-item--link" to="/projects">
                <strong>Projets</strong>
                <span>{formatCount(projects.length, 'projet disponible', 'projets disponibles')}</span>
              </Link>

              <Link className="highlight-item highlight-item--link" to="/credentials">
                <strong>Diplomes & Certificats</strong>
                <span>{formatCount(education.length, 'diplome renseigne', 'diplomes renseignes')}</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
