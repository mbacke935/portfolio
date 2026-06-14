import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="hero-section">
      <div className="hero-content">
        <p className="eyebrow">Portfolio professionnel</p>
        <h1>Developpement, cybersecurite et intelligence artificielle</h1>
        <p>
          Une base React + Supabase preparee pour presenter des projets,
          competences, certifications et experiences de maniere dynamique.
        </p>
        <div className="hero-actions">
          <Link className="button button--primary" to="/projects">
            Voir les projets
          </Link>
          <Link className="button button--secondary" to="/contact">
            Me contacter
          </Link>
        </div>
      </div>
    </section>
  );
}
