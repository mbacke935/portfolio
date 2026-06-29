import { Link } from 'react-router-dom';

export default function ProjectCard({ project, featured = false, showDescription = true }) {
  const description = project.short_description ?? project.description;
  const projectPath = `/projects/${encodeURIComponent(project.slug)}`;

  return (
    <article className={featured ? 'project-card project-card--featured' : 'project-card'}>
      <Link
        className="project-card__visual-wrap"
        to={projectPath}
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="project-card__visual">
          {project.cover_image ? (
            <img
              alt={`Aperçu du projet ${project.title}`}
              className="project-card__cover-img"
              loading="lazy"
              src={project.cover_image}
            />
          ) : (
            <div className="project-card__visual-placeholder" aria-hidden="true" />
          )}
        </div>
      </Link>

      <div className="project-card__body">
        {project.technologies?.length > 0 && (
          <div className="tag-list tag-list--card">
            {project.technologies.slice(0, 4).map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        )}

        <h2>
          <Link className="project-card__title-link" to={projectPath}>
            {project.title}
          </Link>
        </h2>

        {showDescription && description && <p>{description}</p>}

        <div className="project-card__footer">
          <div className="project-card__footer-links">
            {project.github_url && (
              <a
                className="button button--secondary"
                href={project.github_url}
                rel="noreferrer"
                target="_blank"
              >
                GitHub
              </a>
            )}
            {project.demo_url && (
              <a
                className="button button--secondary"
                href={project.demo_url}
                rel="noreferrer"
                target="_blank"
              >
                Demo
              </a>
            )}
          </div>
          <Link className="button button--primary" to={projectPath}>
            Voir le détail →
          </Link>
        </div>
      </div>
    </article>
  );
}
