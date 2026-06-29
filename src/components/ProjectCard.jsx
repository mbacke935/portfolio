import { Link } from 'react-router-dom';

export default function ProjectCard({ project, showDescription = true }) {
  const description = project.short_description ?? project.description;
  const projectPath = `/projects/${encodeURIComponent(project.slug)}`;

  return (
    <article className="project-card">
      <div
        className="project-card__visual"
        style={
          project.cover_image
            ? { backgroundImage: `url(${project.cover_image})` }
            : undefined
        }
        aria-hidden="true"
      >
        <span className="project-card__label">{project.title}</span>
      </div>
      <div className="project-card__body">
        <h2>{project.title}</h2>
        {showDescription && <p>{description}</p>}
        {project.technologies?.length > 0 && (
          <div className="tag-list">
            {project.technologies.slice(0, 4).map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        )}
        <Link className="text-link" to={projectPath}>
          Voir le détail
        </Link>
      </div>
    </article>
  );
}
