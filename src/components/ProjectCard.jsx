import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  const description = project.short_description ?? project.description;

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
        <span>{project.title}</span>
      </div>
      <div className="project-card__body">
        <h2>{project.title}</h2>
        <p>{description}</p>
        {project.technologies?.length > 0 && (
          <div className="tag-list">
            {project.technologies.slice(0, 4).map((technology) => (
              <span key={technology}>{technology}</span>
            ))}
          </div>
        )}
        <Link className="text-link" to={`/projects/${project.slug}`}>
          Voir le detail
        </Link>
      </div>
    </article>
  );
}
