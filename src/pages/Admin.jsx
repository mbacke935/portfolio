const adminSections = [
  'Profil',
  'Projets',
  'Competences',
  'Education',
  'Certifications',
  'Messages',
];

export default function Admin() {
  return (
    <section className="page-section page-section--compact">
      <div className="section-heading">
        <p className="eyebrow">Administration</p>
        <h1>Gestion des informations</h1>
        <p>
          Cette page servira a ajouter, modifier et supprimer les donnees du
          portfolio apres la configuration de Supabase et des regles de securite.
        </p>
      </div>

      <div className="notice-panel" role="status">
        <strong>Acces admin en preparation</strong>
        <p>
          Cette interface restera limitee tant que l'authentification admin et
          les policies d'ecriture Supabase ne sont pas activees.
        </p>
      </div>

      <div className="admin-grid">
        {adminSections.map((section) => (
          <article className="admin-panel" key={section}>
            <h2>{section}</h2>
            <p>Gestion en preparation pour la phase Supabase.</p>
            <div className="admin-actions" aria-label={`Actions ${section}`}>
              <span>Ajouter</span>
              <span>Modifier</span>
              <span>Supprimer</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
