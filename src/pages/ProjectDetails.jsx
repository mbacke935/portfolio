import { Link, useParams } from 'react-router-dom';
import { fallbackProjects } from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProjectBySlug } from '../services/projectService.js';

const detailSections = [
  { key: 'objective', title: 'Objectif' },
  { key: 'operation', title: 'Fonctionnement' },
  { key: 'strengths', title: 'Points forts' },
  { key: 'weaknesses', title: 'Points faibles' },
  { key: 'perspectives', title: 'Perspectives' },
];

function parseProjectDescription(value) {
  const text = value ?? '';
  const details = {
    overview: text,
    sections: [],
  };

  detailSections.forEach((section, index) => {
    const nextTitle = detailSections[index + 1]?.title;
    const pattern = nextTitle
      ? new RegExp(`## ${section.title}\\n([\\s\\S]*?)(?=\\n## ${nextTitle}\\n)`)
      : new RegExp(`## ${section.title}\\n([\\s\\S]*)`);
    const match = text.match(pattern);

    if (match?.[1]?.trim()) {
      details.sections.push({
        title: section.title,
        content: match[1].trim(),
      });
    }
  });

  const firstSectionMatch = text.match(/(^|\n)## Objectif\n/);
  details.overview = firstSectionMatch
    ? text.slice(0, firstSectionMatch.index).trim()
    : text;

  return details;
}

export default function ProjectDetails() {
  const { slug } = useParams();
  const normalizedSlug = decodeURIComponent(slug ?? '').toLowerCase();
  const { data, error, isLoading } = useAsyncData(
    () => getProjectBySlug(slug),
    [slug],
  );
  const fallbackProject = fallbackProjects.find(
    (project) => project.slug.toLowerCase() === normalizedSlug,
  );
  const project = data ?? fallbackProject;
  const gallery = project?.gallery ?? [];
  const projectDetails = parseProjectDescription(project?.full_description);

  return (
    <section className="page-section page-section--compact">
      {project?.cover_image && (
        <img
          className="project-hero-image"
          src={project.cover_image}
          alt=""
          loading="lazy"
        />
      )}

      <div className="section-heading">
        <p className="eyebrow">Detail projet</p>
        <h1>{project?.title ?? 'Projet introuvable'}</h1>
        <p>
          {projectDetails.overview ||
            'Aucun projet publie ne correspond a cette adresse pour le moment.'}
        </p>
        {(isLoading || error || !isSupabaseConfigured) && (
          <p className="status-note">
            {isLoading && isSupabaseConfigured
              ? 'Chargement du projet depuis Supabase...'
              : 'Mode demonstration : configure Supabase pour afficher le detail reel.'}
          </p>
        )}
      </div>

      {project?.technologies?.length > 0 && (
        <div className="tag-list tag-list--large">
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      )}

      {projectDetails.sections.length > 0 && (
        <div className="project-detail-grid">
          {projectDetails.sections.map((section) => (
            <article className="project-detail-panel" key={section.title}>
              <h2>{section.title}</h2>
              <p>{section.content}</p>
            </article>
          ))}
        </div>
      )}

      <div className="link-row">
        {project?.github_url && (
          <a
            className="button button--secondary"
            href={project.github_url}
            rel="noreferrer"
            target="_blank"
          >
            GitHub
          </a>
        )}
        {project?.demo_url && (
          <a
            className="button button--primary"
            href={project.demo_url}
            rel="noreferrer"
            target="_blank"
          >
            Demo
          </a>
        )}
      </div>

      {gallery.length > 0 && (
        <div className="gallery-grid" aria-label="Galerie du projet">
          {gallery.map((imageUrl) => (
            <img key={imageUrl} src={imageUrl} alt="" loading="lazy" />
          ))}
        </div>
      )}

      <Link className="text-link" to="/projects">
        Retour aux projets
      </Link>
    </section>
  );
}
