import { Link, useParams } from 'react-router-dom';
import { fallbackProjects } from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProjectBySlug } from '../services/projectService.js';
import { parseProjectDescription } from '../utils/projectUtils.js';

function renderRichText(value) {
  const lines = String(value ?? '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  const blocks = [];
  let listItems = [];

  function flushList() {
    if (listItems.length > 0) {
      blocks.push({ items: listItems, type: 'list' });
      listItems = [];
    }
  }

  lines.forEach((line) => {
    if (line.startsWith('* ') || line.startsWith('- ')) {
      listItems.push(line.slice(2).trim());
      return;
    }

    flushList();

    if (line.startsWith('### ')) {
      blocks.push({ text: line.slice(4), type: 'heading' });
    } else if (line.startsWith('## ')) {
      blocks.push({ text: line.slice(3), type: 'heading' });
    } else {
      blocks.push({ text: line, type: 'paragraph' });
    }
  });

  flushList();

  return blocks.map((block, index) => {
    if (block.type === 'heading') {
      return <h3 key={`${block.type}-${index}`}>{block.text}</h3>;
    }

    if (block.type === 'list') {
      return (
        <ul key={`${block.type}-${index}`}>
          {block.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      );
    }

    return <p key={`${block.type}-${index}`}>{block.text}</p>;
  });
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
  const hasLinks = project?.github_url || project?.demo_url;

  return (
    <div className="project-detail-page">
      {/* Hero pleine largeur */}
      <div className={project?.cover_image ? 'project-detail-hero' : 'project-detail-hero project-detail-hero--no-image'}>
        {project?.cover_image && (
          <img
            alt={`Aperçu du projet ${project.title ?? ''}`}
            className="project-detail-hero__img"
            loading="eager"
            src={project.cover_image}
          />
        )}
        <div className="project-detail-hero__overlay">
          <div className="project-detail-hero__content">
            <Link className="project-detail-back" to="/projects">
              ← Retour aux projets
            </Link>
            <p className="eyebrow">Détail projet</p>
            <h1>{project?.title ?? 'Projet introuvable'}</h1>
            {(isLoading || error || !isSupabaseConfigured) && (
              <p className="project-detail-status">
                {isLoading && isSupabaseConfigured
                  ? 'Chargement...'
                  : 'Mode démonstration'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Corps : main + sidebar */}
      <div className="project-detail-body">
        {/* Colonne principale */}
        <div className="project-detail-main">
          <div className="project-detail-overview">
            <div className="rich-text">
              {renderRichText(
                projectDetails.overview ||
                  'Aucun projet publié ne correspond à cette adresse pour le moment.',
              )}
            </div>
          </div>

          {projectDetails.sections.length > 0 && (
            <div className="project-detail-sections">
              {projectDetails.sections.map((section, index) => (
                <article className="project-detail-panel" key={section.title}>
                  <div className="project-detail-panel__header">
                    <span className="project-detail-panel__number" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2>{section.title}</h2>
                  </div>
                  <div className="rich-text">{renderRichText(section.content)}</div>
                </article>
              ))}
            </div>
          )}

          {gallery.length > 0 && (
            <div className="gallery-grid" aria-label="Galerie du projet">
              {gallery.map((imageUrl, index) => (
                <img
                  key={imageUrl}
                  alt={`Capture d'écran ${index + 1} du projet ${project?.title ?? ''}`}
                  loading="lazy"
                  src={imageUrl}
                />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar sticky */}
        <aside className="project-detail-sidebar">
          {project?.technologies?.length > 0 && (
            <div className="project-detail-sidebar__section">
              <h3 className="project-detail-sidebar__label">Technologies</h3>
              <div className="tag-list">
                {project.technologies.map((technology) => (
                  <span key={technology}>{technology}</span>
                ))}
              </div>
            </div>
          )}

          {hasLinks && (
            <div className="project-detail-sidebar__section">
              <h3 className="project-detail-sidebar__label">Liens</h3>
              <div className="project-detail-sidebar__links">
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
                    Voir la démo →
                  </a>
                )}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
