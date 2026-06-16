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
        <h1>Projets dynamiques</h1>

        <p>
          Nous sommes en attente de nouveaux projets. En attendant, nous vous invitons à explorer les projets précédents.
        </p>
        {(isLoading || error || !isSupabaseConfigured) && (
          <p className="status-note">
            {isLoading && isSupabaseConfigured
              ? 'Chargement des projets depuis Supabase...'
              : 'Mode demonstration : configure Supabase pour afficher les projets reels.'}
          </p>
        )}
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
              <p className="eyebrow">Resume projet</p>
              <h2>{project.title}</h2>
              <p>{project.short_description ?? project.description}</p>
            </div>
          </article>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="empty-state">
          <h2>Aucun projet publie</h2>
          <p>
            Pas de projets disponibles pour le moment.
          </p>
        </div>
      )}
    </section>
  );
}
