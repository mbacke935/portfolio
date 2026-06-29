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

  return (
    <section className="page-section project-detail-page">
      {project?.cover_image && (
        <img
          className="project-hero-image"
          src={project.cover_image}
          alt={project.title ? `Aperçu du projet ${project.title}` : 'Image de couverture du projet'}
          loading="lazy"
        />
      )}

      <div className="section-heading">
        <p className="eyebrow">Détail projet</p>
        <h1>{project?.title ?? 'Projet introuvable'}</h1>
        <div className="rich-text">
          {renderRichText(
            projectDetails.overview ||
              'Aucun projet publié ne correspond à cette adresse pour le moment.',
          )}
        </div>
        {(isLoading || error || !isSupabaseConfigured) && (
          <p className="status-note">
            {isLoading && isSupabaseConfigured
              ? 'Chargement du projet depuis Supabase...'
              : 'Mode démonstration : configurez Supabase pour afficher le détail réel.'}
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
              <div className="rich-text">{renderRichText(section.content)}</div>
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
          {gallery.map((imageUrl, index) => (
            <img
              key={imageUrl}
              src={imageUrl}
              alt={`Capture d'écran ${index + 1} du projet ${project?.title ?? ''}`}
              loading="lazy"
            />
          ))}
        </div>
      )}

      <Link className="text-link" to="/projects">
        Retour aux projets
      </Link>
    </section>
  );
}
