import { Link, useParams } from 'react-router-dom';
import { fallbackProjects } from '../constants/fallbackData.js';
import { useAsyncData } from '../hooks/useAsyncData.js';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import { getProjectBySlug } from '../services/projectService.js';

export default function ProjectDetails() {
  const { slug } = useParams();
  const { data, error, isLoading } = useAsyncData(
    () => getProjectBySlug(slug),
    [slug],
  );
  const fallbackProject = fallbackProjects.find((project) => project.slug === slug);
  const project = data ?? fallbackProject;

  return (
    <section className="page-section page-section--compact">
      <div className="section-heading">
        <p className="eyebrow">Detail projet</p>
        <h1>{project?.title ?? 'Projet introuvable'}</h1>
        <p>
          {project?.full_description ??
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

      <div className="link-row">
        {project?.github_url && (
          <a className="button button--secondary" href={project.github_url}>
            GitHub
          </a>
        )}
        {project?.demo_url && (
          <a className="button button--primary" href={project.demo_url}>
            Demo
          </a>
        )}
      </div>

      <Link className="text-link" to="/projects">
        Retour aux projets
      </Link>
    </section>
  );
}
