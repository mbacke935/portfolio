export const fallbackProfile = {
  name: 'Nom complet',
  title: 'Titre professionnel',
  bio: 'Courte présentation professionnelle à renseigner depuis l\'espace admin.',
  education_summary:
    'Le parcours scolaire et universitaire sera renseigné depuis l\'espace admin.',
  email: 'contact@example.com',
  location: 'Dakar',
  avatar_url: '',
  social_links: [],
};

export const fallbackProjects = [
  {
    title: 'Naatalfi',
    slug: 'naatalfi',
    short_description: 'Projet exemple qui sera chargé depuis Supabase.',
    full_description:
      'Cette fiche projet sera remplacée par les données publiées dans Supabase.',
    technologies: ['React', 'Supabase', 'Vite'],
    github_url: 'https://github.com',
    demo_url: 'https://example.com',
    gallery: [],
  },
  {
    title: 'Cyber Lab',
    slug: 'cyber-lab',
    short_description: 'Espace prévu pour les projets cybersécurité.',
    full_description:
      'Projet de démonstration pour valider la page détail et les technologies.',
    technologies: ['Réseaux', 'Sécurité', 'Linux'],
    gallery: [],
  },
  {
    title: 'AI Toolkit',
    slug: 'ai-toolkit',
    short_description: 'Espace prévu pour les projets intelligence artificielle.',
    full_description:
      'Projet de démonstration pour les futures expérimentations IA.',
    technologies: ['IA', 'Python', 'API'],
    gallery: [],
  },
];

export const fallbackSkills = [
  { id: 'frontend', name: 'React', category: 'Frontend', level: 80 },
  { id: 'backend', name: 'Supabase', category: 'Backend', level: 75 },
  { id: 'security', name: 'Cybersécurité', category: 'Cybersécurité', level: 70 },
];

export const fallbackEducation = [
  {
    id: 'education-placeholder',
    institution: 'Parcours à renseigner',
    degree: 'Formation principale',
    description: 'Les données seront chargées depuis Supabase.',
  },
];

export const fallbackCertifications = [
  {
    id: 'certification-placeholder',
    title: 'Certification à renseigner',
    issuer: 'Organisme',
  },
];
