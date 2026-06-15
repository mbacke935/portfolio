import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page-section page-section--compact">
      <div className="section-heading">
        <p className="eyebrow">Erreur 404</p>
        <h1>Page introuvable</h1>
        <p>
          Cette page n'existe pas encore. Utilise la navigation principale pour
          revenir vers une page disponible du portfolio.
        </p>
      </div>

      <Link className="button button--primary" to="/">
        Retour a l'accueil
      </Link>
    </section>
  );
}
