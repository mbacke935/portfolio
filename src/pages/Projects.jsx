import ProjectCard from '../components/ProjectCard.jsx';
import { fallbackProjects } from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProjects } from '../services/projectService.js';

export default function Projects() {
  const { data, error, isLoading } = useAsyncData(getProjects, []);
  const projects = data?.length ? data : fallbackProjects;

  return (
    <div className="projects-page">
      <div className="projects-hero">
        <div className="projects-hero__inner">
          <p className="eyebrow">Portfolio</p>
          <h1>Mes réalisations</h1>
          <p className="projects-hero__sub">
            Projets en développement web, cybersécurité et intelligence artificielle —
            du concept à la mise en production.
          </p>
          <div className="projects-hero__meta">
            <span className="project-count-badge">
              {projects.length} projet{projects.length > 1 ? 's' : ''}
            </span>
            {(isLoading || error || !isSupabaseConfigured) && (
              <span className="projects-hero__status">
                {isLoading && isSupabaseConfigured
                  ? 'Chargement...'
                  : 'Mode démonstration'}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="projects-grid-wrapper">
        {projects.length > 0 ? (
          <div className="projects-grid">
            {projects.map((project, index) => (
              <ProjectCard
                key={project.slug}
                project={project}
                featured={index === 0}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Aucun projet publié</h2>
            <p>Pas de projets disponibles pour le moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
