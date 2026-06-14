import { Link, useParams } from 'react-router-dom';

export default function ProjectDetails() {
  const { slug } = useParams();

  return (
    <section className="page-section page-section--compact">
      <div className="section-heading">
        <p className="eyebrow">Detail projet</p>
        <h1>{slug}</h1>
        <p>
          Cette page affichera la description complete, les technologies,
          captures, liens GitHub et demo apres connexion a Supabase.
        </p>
      </div>

      <Link className="text-link" to="/projects">
        Retour aux projets
      </Link>
    </section>
  );
}
