import ProjectCard from '../components/ProjectCard.jsx';

const placeholderProjects = [
  {
    title: 'Naatalfi',
    description: 'Projet exemple qui sera charge depuis Supabase.',
    slug: 'naatalfi',
  },
  {
    title: 'Cyber Lab',
    description: 'Espace prevu pour les projets cybersecurite.',
    slug: 'cyber-lab',
  },
  {
    title: 'AI Toolkit',
    description: 'Espace prevu pour les projets intelligence artificielle.',
    slug: 'ai-toolkit',
  },
];

export default function Projects() {
  return (
    <section className="page-section">
      <div className="section-heading">
        <p className="eyebrow">Projets</p>
        <h1>Projets dynamiques</h1>
        <p>
          Les projets seront recuperes depuis Supabase. Cette version statique
          valide uniquement la navigation et la structure de page.
        </p>
      </div>

      <div className="project-grid">
        {placeholderProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
