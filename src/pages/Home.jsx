import { Link } from 'react-router-dom';
import {
  fallbackCertifications,
  fallbackEducation,
  fallbackProfile,
  fallbackProjects,
  fallbackSkills,
} from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getCertifications } from '../services/certificationService.js';
import { getProfile } from '../services/profileService.js';
import { getProjects } from '../services/projectService.js';
import { getEducation } from '../services/educationService.js';
import { getSkills } from '../services/skillService.js';

function formatCount(count, singular, plural) {
  return `${count} ${count > 1 ? plural : singular}`;
}

function buildHomeSections({ educationCount, projectsCount, skillsCount }) {
  return [
    {
      title: 'Competences',
      count: formatCount(skillsCount, 'competence publiee', 'competences publiees'),
      description:
        'Technologies, outils et domaines techniques que je developpe dans mon parcours.',
      to: '/about',
    },
    {
      title: 'Projets',
      count: formatCount(projectsCount, 'projet disponible', 'projets disponibles'),
      description:
        'Realisations pratiques en developpement, cybersecurite et intelligence artificielle.',
      to: '/projects',
    },
    {
      title: 'Diplomes & Certificats',
      count: formatCount(educationCount, 'diplome renseigne', 'diplomes renseignes'),
      description:
        'Formations, diplomes et certifications qui structurent mon profil professionnel.',
      to: '/credentials',
    },
  ];
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function listItems(items, renderItem) {
  if (!items.length) {
    return '<p>Informations a renseigner depuis la plateforme.</p>';
  }

  return `<ul>${items.map((item) => `<li>${renderItem(item)}</li>`).join('')}</ul>`;
}

function groupSkillsByCategory(skills) {
  return skills.reduce((groups, skill) => {
    const category = skill.category || 'Autres competences';

    return {
      ...groups,
      [category]: [...(groups[category] ?? []), skill],
    };
  }, {});
}

function buildCvHtml({ certifications, education, profile, projects, skills }) {
  const skillGroups = groupSkillsByCategory(skills);
  const contactItems = [
    profile.email,
    profile.phone,
    profile.location,
    profile.github_url,
    profile.linkedin_url,
    profile.website_url,
  ].filter(Boolean);

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CV - ${escapeHtml(profile.name)}</title>
  <style>
    body { color: #102033; font-family: Arial, sans-serif; line-height: 1.55; margin: 42px; }
    h1 { color: #061a40; font-size: 34px; margin: 0 0 6px; }
    h2 { border-bottom: 2px solid #d6e4f2; color: #061a40; margin-top: 28px; padding-bottom: 6px; }
    h3 { color: #1f7ae0; margin-bottom: 4px; }
    p { margin: 0 0 10px; }
    ul { margin-top: 8px; padding-left: 20px; }
    li { margin-bottom: 6px; }
    .title { color: #1f7ae0; font-weight: 700; }
    .contact { color: #5b6b80; margin: 12px 0 22px; }
    .item { margin-bottom: 14px; }
    @media print { body { margin: 24px; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(profile.name)}</h1>
  <p class="title">${escapeHtml(profile.title)}</p>
  <p class="contact">${contactItems.map(escapeHtml).join(' | ')}</p>

  <h2>Profil</h2>
  <p>${escapeHtml(profile.bio)}</p>

  <h2>Parcours scolaire et universitaire</h2>
  <p>${escapeHtml(profile.education_summary)}</p>

  <h2>Competences</h2>
  ${Object.entries(skillGroups)
    .map(
      ([category, categorySkills]) => `
        <h3>${escapeHtml(category)}</h3>
        ${listItems(categorySkills, (skill) => escapeHtml(skill.name))}
      `,
    )
    .join('')}

  <h2>Projets</h2>
  ${listItems(
    projects,
    (project) =>
      `<strong>${escapeHtml(project.title)}</strong> - ${escapeHtml(
        project.short_description,
      )}`,
  )}

  <h2>Diplomes</h2>
  ${listItems(
    education,
    (item) =>
      `<strong>${escapeHtml(item.degree)}</strong>, ${escapeHtml(
        item.institution,
      )}${item.description ? ` - ${escapeHtml(item.description)}` : ''}`,
  )}

  <h2>Certificats</h2>
  ${listItems(
    certifications,
    (item) =>
      `<strong>${escapeHtml(item.title)}</strong>, ${escapeHtml(item.issuer)}`,
  )}
</body>
</html>`;
}

function downloadGeneratedCv({ certifications, education, profile, projects, skills }) {
  const html = buildCvHtml({ certifications, education, profile, projects, skills });
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const fileName = `${profile.name || 'cv'}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  link.href = url;
  link.download = `${fileName || 'cv'}-portfolio.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const { data: profile, error, isLoading } = useAsyncData(getProfile, []);
  const skillsState = useAsyncData(getSkills, []);
  const projectsState = useAsyncData(getProjects, []);
  const educationState = useAsyncData(getEducation, []);
  const certificationsState = useAsyncData(getCertifications, []);

  const activeProfile = profile ?? fallbackProfile;
  const skills = skillsState.data?.length ? skillsState.data : fallbackSkills;
  const projects = projectsState.data?.length ? projectsState.data : fallbackProjects;
  const education = educationState.data?.length
    ? educationState.data
    : fallbackEducation;
  const certifications = certificationsState.data?.length
    ? certificationsState.data
    : fallbackCertifications;
  const homeSections = buildHomeSections({
    educationCount: education.length,
    projectsCount: projects.length,
    skillsCount: skills.length,
  });

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
          </div>
        </div>

        <div className="hero-highlights" aria-label="Sections principales">
          {homeSections.map((section) => (
            <Link
              className="highlight-item highlight-item--link"
              key={section.to}
              to={section.to}
            >
              <strong>{section.title}</strong>
              <span className="highlight-item__count">{section.count}</span>
              <span>{section.description}</span>
            </Link>
          ))}
        </div>

        <section className="cv-download-section" aria-labelledby="cv-download-title">
          <div>
            <p className="eyebrow">CV dynamique</p>
            <h2 id="cv-download-title">Telecharger le CV genere</h2>
            <p>
              Le fichier est construit automatiquement avec les informations
              configurees dans l'espace admin : profil, competences, projets,
              diplomes et certificats.
            </p>
          </div>
          <button
            className="button button--primary"
            onClick={() =>
              downloadGeneratedCv({
                certifications,
                education,
                profile: activeProfile,
                projects,
                skills,
              })
            }
            type="button"
          >
            Telecharger le CV
          </button>
        </section>
      </div>
    </section>
  );
}
