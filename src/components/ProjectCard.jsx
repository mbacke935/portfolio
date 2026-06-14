import { Link } from 'react-router-dom';

export default function ProjectCard({ project }) {
  return (
    <article className="project-card">
      <div className="project-card__visual" aria-hidden="true" />
      <div className="project-card__body">
        <h2>{project.title}</h2>
        <p>{project.description}</p>
        <Link className="text-link" to={`/projects/${project.slug}`}>
          Voir le detail
        </Link>
      </div>
    </article>
  );
}
