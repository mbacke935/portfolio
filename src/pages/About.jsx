import { fallbackProfile, fallbackSkills } from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProfile } from '../services/profileService.js';
import { getSkills } from '../services/skillService.js';
import { groupSkillsByCategory } from '../utils/skillUtils.js';

export default function About() {
  const profileState = useAsyncData(getProfile, []);
  const skillsState = useAsyncData(getSkills, []);

  const profile = profileState.data ?? fallbackProfile;
  const skills = skillsState.data?.length ? skillsState.data : fallbackSkills;
  const skillGroups = groupSkillsByCategory(skills);
  const hasFallback = !isSupabaseConfigured || profileState.error;

  const initials = profile.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);

  return (
    <section className="page-section about-page">
      <div className="about-profile-card">
        <div className="about-profile-avatar" aria-label={`Photo de ${profile.name}`}>
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={`Photo de ${profile.name}`} />
          ) : (
            <span aria-hidden="true">{initials}</span>
          )}
        </div>
        <div className="about-profile-info">
          <p className="eyebrow" style={{ color: '#38bdf8' }}>À propos</p>
          <h1>{profile.name}</h1>
          <p className="about-profile-title">{profile.title}</p>
          <p>{profile.bio}</p>
          {hasFallback && (
            <p className="status-note" style={{ color: '#8fd3ff' }}>
              Les données seront bientôt disponibles.
            </p>
          )}
        </div>
      </div>

      <div className="section-heading about-heading" style={{ marginTop: '56px' }}>
        <p className="eyebrow">Compétences</p>
        <h2>Domaines techniques</h2>
        <p>
          Aperçu de mes compétences techniques, regroupées par domaine.
        </p>
      </div>

      <div className="skill-category-grid">
        {Object.entries(skillGroups).map(([category, categorySkills]) => (
          <section className="skill-category-panel" key={category}>
            <h3>{category}</h3>
            <div className="about-skills-grid">
              {categorySkills.map((skill) => (
                <article
                  className="info-card about-skill-card"
                  key={skill.id ?? skill.name}
                >
                  {skill.icon && (
                    <span className="about-skill-icon" aria-hidden="true">
                      {skill.icon}
                    </span>
                  )}
                  <h4>{skill.name}</h4>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
