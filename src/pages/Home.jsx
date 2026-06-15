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

function fileNameFromProfile(profile) {
  return `${profile.name || 'cv'}`
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
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

function buildCvPdfHtml({ certifications, education, profile, projects, skills }) {
  const skillGroups = groupSkillsByCategory(skills);
  const socialLinks = Array.isArray(profile.social_links)
    ? profile.social_links.map((link) => `${link.label}: ${link.url}`)
    : [];
  const contactItems = [
    profile.email,
    profile.phone,
    profile.location,
    profile.github_url,
    profile.linkedin_url,
    profile.website_url,
    ...socialLinks,
  ].filter(Boolean);
  const mainProjects = projects.slice(0, 4);
  const fileName = fileNameFromProfile(profile) || 'cv';

  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>CV - ${escapeHtml(profile.name)}</title>
  <style>
    @page { margin: 0; size: A4; }
    * {
      box-sizing: border-box;
      print-color-adjust: exact;
      -webkit-print-color-adjust: exact;
    }
    body {
      background: #d8e6f5;
      color: #102033;
      font-family: Arial, Helvetica, sans-serif;
      line-height: 1.5;
      margin: 0;
    }
    .toolbar {
      background: #061a40;
      color: #ffffff;
      display: flex;
      gap: 12px;
      justify-content: center;
      padding: 14px;
    }
    .toolbar button {
      background: #38bdf8;
      border: 0;
      border-radius: 8px;
      color: #061a40;
      cursor: pointer;
      font-weight: 800;
      padding: 10px 16px;
    }
    .cv-page {
      background: #ffffff;
      display: grid;
      grid-template-columns: 72mm 1fr;
      margin: 24px auto;
      min-height: 297mm;
      overflow: hidden;
      width: 210mm;
    }
    .sidebar {
      background: linear-gradient(180deg, #061a40 0%, #0b2c66 100%);
      color: #ffffff;
      padding: 22mm 9mm;
    }
    .photo {
      align-items: center;
      background: rgba(255, 255, 255, 0.12);
      border: 2px solid rgba(255, 255, 255, 0.72);
      border-radius: 50%;
      display: flex;
      height: 34mm;
      justify-content: center;
      margin-bottom: 12mm;
      overflow: hidden;
      width: 34mm;
    }
    .photo img {
      height: 100%;
      object-fit: cover;
      width: 100%;
    }
    .photo span {
      font-size: 22px;
      font-weight: 800;
    }
    .sidebar h2 {
      border-bottom: 1px solid rgba(255, 255, 255, 0.24);
      color: #ffffff;
      font-size: 13px;
      letter-spacing: 0.08em;
      margin: 18px 0 10px;
      padding-bottom: 7px;
      text-transform: uppercase;
    }
    .sidebar p,
    .sidebar li {
      color: #dbeafe;
      font-size: 11px;
      margin: 0 0 7px;
      overflow-wrap: anywhere;
    }
    .sidebar ul,
    .content ul {
      margin: 0;
      padding-left: 16px;
    }
    .content {
      padding: 20mm 14mm;
    }
    h1 {
      color: #061a40;
      font-size: 34px;
      line-height: 1.05;
      margin: 0 0 7px;
    }
    .title {
      color: #1f7ae0;
      font-size: 15px;
      font-weight: 800;
      margin: 0 0 18px;
    }
    .intro {
      background: #eef7ff;
      border-left: 5px solid #38bdf8;
      border-radius: 0 10px 10px 0;
      color: #24364d;
      margin-bottom: 18px;
      padding: 13px 15px;
    }
    .content h2 {
      color: #061a40;
      font-size: 15px;
      letter-spacing: 0.06em;
      margin: 21px 0 10px;
      text-transform: uppercase;
    }
    .content h3 {
      color: #1f7ae0;
      font-size: 12px;
      margin: 10px 0 5px;
    }
    .content p,
    .content li {
      color: #334155;
      font-size: 12px;
      margin: 0 0 7px;
    }
    .item {
      border-bottom: 1px solid #e2e8f0;
      margin-bottom: 10px;
      padding-bottom: 10px;
    }
    .item strong {
      color: #061a40;
    }
    .pill-list {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
      list-style: none;
      padding: 0;
    }
    .pill-list li {
      background: #e0f2fe;
      border-radius: 999px;
      color: #075985;
      font-weight: 700;
      padding: 5px 9px;
    }
    @media print {
      body { background: #ffffff; }
      .toolbar { display: none; }
      .cv-page {
        margin: 0;
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
      .sidebar,
      .intro,
      .pill-list li {
        print-color-adjust: exact;
        -webkit-print-color-adjust: exact;
      }
    }
  </style>
</head>
<body>
  <div class="toolbar">
    <button onclick="window.print()">Enregistrer en PDF</button>
    <span>Destination : Enregistrer au format PDF, fichier suggere : ${escapeHtml(fileName)}-portfolio.pdf</span>
  </div>

  <main class="cv-page">
    <aside class="sidebar">
      <div class="photo">
        ${
          profile.avatar_url
            ? `<img src="${escapeHtml(profile.avatar_url)}" alt="">`
            : `<span>${escapeHtml(
                profile.name
                  .split(' ')
                  .map((part) => part[0])
                  .join('')
                  .slice(0, 2),
              )}</span>`
        }
      </div>

      <h2>Contact</h2>
      ${listItems(contactItems, (item) => escapeHtml(item))}

      <h2>Competences</h2>
      ${Object.entries(skillGroups)
        .map(
          ([category, categorySkills]) => `
            <h3>${escapeHtml(category)}</h3>
            <ul class="pill-list">
              ${categorySkills
                .map((skill) => `<li>${escapeHtml(skill.name)}</li>`)
                .join('')}
            </ul>
          `,
        )
        .join('')}
    </aside>

    <section class="content">
      <h1>${escapeHtml(profile.name)}</h1>
      <p class="title">${escapeHtml(profile.title)}</p>

      <div class="intro">${escapeHtml(profile.bio)}</div>

      <h2>Parcours scolaire et universitaire</h2>
      <p>${escapeHtml(profile.education_summary)}</p>

      <h2>Projets selectionnes</h2>
      ${listItems(
        mainProjects,
        (project) =>
          `<div class="item"><strong>${escapeHtml(project.title)}</strong><p>${escapeHtml(
            project.short_description,
          )}</p></div>`,
      )}

      <h2>Diplomes</h2>
      ${listItems(
        education,
        (item) =>
          `<div class="item"><strong>${escapeHtml(item.degree)}</strong><p>${escapeHtml(
            item.institution,
          )}${item.description ? ` - ${escapeHtml(item.description)}` : ''}</p></div>`,
      )}

      <h2>Certificats</h2>
      ${listItems(
        certifications,
        (item) =>
          `<div class="item"><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(
            item.issuer,
          )}</p></div>`,
      )}
    </section>
  </main>

  <script>
    window.addEventListener('load', function () {
      setTimeout(function () {
        window.print();
      }, 400);
    });
  </script>
</body>
</html>`;
}

function generateCvPdf({ certifications, education, profile, projects, skills }) {
  const html = buildCvPdfHtml({ certifications, education, profile, projects, skills });
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const printWindow = window.open(url, '_blank');

  if (!printWindow) {
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileNameFromProfile(profile) || 'cv'}-portfolio.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  setTimeout(() => URL.revokeObjectURL(url), 60000);
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
            <h2 id="cv-download-title">Generer le CV en PDF</h2>
            <p>
              Le PDF est construit automatiquement avec les informations
              configurees dans l'espace admin : profil, competences, projets,
              diplomes et certificats.
            </p>
          </div>
          <button
            className="button button--primary"
            onClick={() =>
              generateCvPdf({
                certifications,
                education,
                profile: activeProfile,
                projects,
                skills,
              })
            }
            type="button"
          >
            Generer le PDF
          </button>
        </section>
      </div>
    </section>
  );
}
