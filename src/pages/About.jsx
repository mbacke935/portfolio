import { fallbackProfile, fallbackSkills } from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProfile } from '../services/profileService.js';
import { getSkills } from '../services/skillService.js';

function groupSkillsByCategory(skills) {
  return skills.reduce((groups, skill) => {
    const category = skill.category || 'Autres competences';

    return {
      ...groups,
      [category]: [...(groups[category] ?? []), skill],
    };
  }, {});
}

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
        <p className="eyebrow">Compétences</p>
        <h1>{profile.name}</h1>
        <p>{profile.bio}</p>
        {hasFallback && (
          <p className="status-note">
            Les données seront bientôt disponibles.
          </p>
        )}
      </div>

      <div className="section-heading about-heading">
        <p className="eyebrow">Competences</p>
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
                  <h2>{skill.name}</h2>
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
