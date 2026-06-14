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
        <p className="eyebrow">Projets</p>
        <h1>Projets dynamiques</h1>
        <p>
          Les projets publies sont recuperes depuis Supabase et affiches
          automatiquement ici.
        </p>
        {(isLoading || error || !isSupabaseConfigured) && (
          <p className="status-note">
            {isLoading && isSupabaseConfigured
              ? 'Chargement des projets depuis Supabase...'
              : 'Mode demonstration : configure Supabase pour afficher les projets reels.'}
          </p>
        )}
      </div>

      <div className="project-grid">
        {projects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
