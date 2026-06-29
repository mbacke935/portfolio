import ProjectCard from '../components/ProjectCard.jsx';
import { fallbackProjects } from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProjects } from '../services/projectService.js';

export default function Projects() {
  const { data, error, isLoading } = useAsyncData(getProjects, []);
  const projects = data?.length ? data : fallbackProjects;

  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Portfolio</p>
        <h1>Mes réalisations</h1>
        <p>
          Projets en développement web, cybersécurité et intelligence artificielle — du concept à la mise en production.
        </p>
        <div className="projects-header-meta">
          <span className="project-count-badge">
            {projects.length} projet{projects.length > 1 ? 's' : ''}
          </span>
          {(isLoading || error || !isSupabaseConfigured) && (
            <span className="status-note" style={{ margin: 0 }}>
              {isLoading && isSupabaseConfigured
                ? 'Chargement...'
                : 'Mode démonstration'}
            </span>
          )}
        </div>
      </div>

      <div className="project-showcase-list">
        {projects.map((project, index) => (
          <article
            className={
              index % 2 === 0
                ? 'project-showcase'
                : 'project-showcase project-showcase--reverse'
            }
            key={project.slug}
          >
            <ProjectCard project={project} showDescription={false} />
            <div className="project-summary-panel">
              <p className="eyebrow">Résumé projet</p>
              <h2>{project.title}</h2>
              <p>{project.short_description ?? project.description}</p>
              {project.technologies?.length > 0 && (
                <div className="tag-list" style={{ marginTop: '16px' }}>
                  {project.technologies.slice(0, 5).map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <h2>Aucun projet publié</h2>
          <p>Pas de projets disponibles pour le moment.</p>
        </div>
      )}
    </section>
  );
}
