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

  return (
    <section className="page-section about-page">
      <div className="section-heading about-heading">
        <p className="eyebrow">À propos</p>
        <h1>{profile.name}</h1>
        <p>{profile.bio}</p>
        {hasFallback && (
          <p className="status-note">
            Les données seront bientôt disponibles.
          </p>
        )}
      </div>

      <div className="section-heading about-heading">
        <p className="eyebrow">Compétences</p>
        <h2>Domaines techniques</h2>
        <p>
          Voici un aperçu de mes compétences techniques, regroupées par domaine.
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
                  <h4>{skill.name}</h4>
                  {skill.icon && <p>{skill.icon}</p>}
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
