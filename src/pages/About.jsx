import { fallbackProfile, fallbackSkills } from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProfile } from '../services/profileService.js';
import { getSkills } from '../services/skillService.js';

export default function About() {
  const profileState = useAsyncData(getProfile, []);
  const skillsState = useAsyncData(getSkills, []);

  const profile = profileState.data ?? fallbackProfile;
  const skills = skillsState.data?.length ? skillsState.data : fallbackSkills;
  const hasFallback = !isSupabaseConfigured || profileState.error;

  return (
    <section className="page-section about-page">
      <div className="section-heading about-heading">
        <p className="eyebrow">A propos</p>
        <h1>{profile.name}</h1>
        <p>{profile.bio}</p>
        {hasFallback && (
          <p className="status-note">
            Mode demonstration : les donnees reelles apparaitront apres
            configuration de Supabase.
          </p>
        )}
      </div>

      <div className="section-heading about-heading">
        <p className="eyebrow">Competences</p>
        <h2>Domaines techniques</h2>
        <p>
          Cette liste est alimentee depuis l'espace admin et peut evoluer avec
          les nouvelles competences.
        </p>
      </div>

      <div className="info-grid about-skills-grid">
        {skills.map((skill) => (
          <article className="info-card about-skill-card" key={skill.id ?? skill.name}>
            <h2>{skill.name}</h2>
            <p>{skill.category}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
