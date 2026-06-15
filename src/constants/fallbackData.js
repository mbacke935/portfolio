export const fallbackProfile = {
  name: 'Nom complet',
  title: 'Titre professionnel',
  bio: 'Courte presentation professionnelle a renseigner depuis l espace admin.',
  education_summary:
    'Le parcours scolaire et universitaire sera renseigne depuis l espace admin.',
  email: 'contact@example.com',
  location: 'Dakar',
  avatar_url: '',
};

export const fallbackProjects = [
  {
    title: 'Naatalfi',
    slug: 'naatalfi',
    short_description: 'Projet exemple qui sera charge depuis Supabase.',
    full_description:
      'Cette fiche projet sera remplacee par les donnees publiees dans Supabase.',
    technologies: ['React', 'Supabase', 'Vite'],
    github_url: 'https://github.com',
    demo_url: 'https://example.com',
    gallery: [],
  },
  {
    title: 'Cyber Lab',
    slug: 'cyber-lab',
    short_description: 'Espace prevu pour les projets cybersecurite.',
    full_description:
      'Projet de demonstration pour valider la page detail et les technologies.',
    technologies: ['Reseaux', 'Securite', 'Linux'],
    gallery: [],
  },
  {
    title: 'AI Toolkit',
    slug: 'ai-toolkit',
    short_description: 'Espace prevu pour les projets intelligence artificielle.',
    full_description:
      'Projet de demonstration pour les futures experimentations IA.',
    technologies: ['IA', 'Python', 'API'],
    gallery: [],
  },
];

export const fallbackSkills = [
  { id: 'frontend', name: 'React', category: 'Frontend', level: 80 },
  { id: 'backend', name: 'Supabase', category: 'Backend', level: 75 },
  { id: 'security', name: 'Cybersecurite', category: 'Cybersecurite', level: 70 },
];

export const fallbackEducation = [
  {
    id: 'education-placeholder',
    institution: 'Parcours a renseigner',
    degree: 'Formation principale',
    description: 'Les donnees seront chargees depuis Supabase.',
  },
];

export const fallbackCertifications = [
  {
    id: 'certification-placeholder',
    title: 'Certification a renseigner',
    issuer: 'Organisme',
  },
];
