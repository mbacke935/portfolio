import {
  fallbackCertifications,
  fallbackEducation,
  fallbackProfile,
  fallbackSkills,
} from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getCertifications } from '../services/certificationService.js';
import { getEducation } from '../services/educationService.js';
import { getProfile } from '../services/profileService.js';
import { getSkills } from '../services/skillService.js';

export default function About() {
  const profileState = useAsyncData(getProfile, []);
  const skillsState = useAsyncData(getSkills, []);
  const educationState = useAsyncData(getEducation, []);
  const certificationsState = useAsyncData(getCertifications, []);

  const profile = profileState.data ?? fallbackProfile;
  const skills = skillsState.data?.length ? skillsState.data : fallbackSkills;
  const education = educationState.data?.length
    ? educationState.data
    : fallbackEducation;
  const certifications = certificationsState.data?.length
    ? certificationsState.data
    : fallbackCertifications;
  const hasFallback = !isSupabaseConfigured || profileState.error;

  return (
    <section className="page-section">
      <div className="section-heading">
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

      <div className="info-grid">
        {skills.map((skill) => (
          <article className="info-card" key={skill.id ?? skill.name}>
            <h2>{skill.name}</h2>
            <p>{skill.category}</p>
            {typeof skill.level === 'number' && (
              <p className="meta-text">Niveau : {skill.level}%</p>
            )}
          </article>
        ))}
      </div>

      <div className="split-section">
        <section>
          <h2>Education</h2>
          {education.map((item) => (
            <article className="timeline-item" key={item.id}>
              <h3>{item.degree}</h3>
              <p>{item.institution}</p>
              {item.description && <p>{item.description}</p>}
            </article>
          ))}
        </section>

        <section>
          <h2>Certifications</h2>
          {certifications.map((item) => (
            <article className="timeline-item" key={item.id}>
              <h3>{item.title}</h3>
              <p>{item.issuer}</p>
            </article>
          ))}
        </section>
      </div>
    </section>
  );
}
