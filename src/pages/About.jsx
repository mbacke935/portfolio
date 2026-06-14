export default function About() {
  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">A propos</p>
        <h1>Profil et parcours</h1>
        <p>
          Cette page presentera le profil, le parcours, les competences et les
          objectifs professionnels apres branchement des donnees Supabase.
        </p>
      </div>

      <div className="info-grid">
        <article className="info-card">
          <h2>Frontend</h2>
          <p>Interfaces React claires, responsives et maintenables.</p>
        </article>
        <article className="info-card">
          <h2>Backend</h2>
          <p>Services et bases de donnees avec une architecture simple.</p>
        </article>
        <article className="info-card">
          <h2>Cybersecurite</h2>
          <p>Culture securite integree dans la conception des projets.</p>
        </article>
      </div>
    </section>
  );
}
