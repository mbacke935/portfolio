import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="not-found-hero">
      <div className="not-found-inner">
        <p className="not-found-code" aria-hidden="true">404</p>
        <p className="eyebrow">Page introuvable</p>
        <h1>Vous vous êtes perdu ?</h1>
        <p className="not-found-sub">
          Cette page n'existe pas ou a été déplacée. Revenez à l'accueil ou explorez le portfolio.
        </p>
        <div className="hero-actions">
          <Link className="button button--primary" to="/">
            Retour à l'accueil
          </Link>
          <Link className="button button--secondary" to="/projects">
            Voir les projets
          </Link>
        </div>
      </div>
    </section>
  );
}
