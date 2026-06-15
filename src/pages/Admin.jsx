import { useEffect, useRef, useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import {
  getCurrentSession,
  onAuthStateChange,
  signInAdmin,
  signOutAdmin,
} from '../services/authService.js';
import {
  deleteProject,
  getAdminProjects,
  saveProject,
} from '../services/projectService.js';
import {
  deleteCertification,
  getCertifications,
  saveCertification,
} from '../services/certificationService.js';
import {
  deleteEducation,
  getEducation,
  saveEducation,
} from '../services/educationService.js';
import { getProfile, saveProfile } from '../services/profileService.js';
import { deleteSkill, getSkills, saveSkill } from '../services/skillService.js';
import {
  uploadCertificationImage,
  uploadProfilePhoto,
} from '../services/storageService.js';

const emptyProfile = {
  id: null,
  name: '',
  title: '',
  bio: '',
  education_summary: '',
  email: '',
  phone: '',
  location: '',
  avatar_url: '',
  cv_url: '',
  github_url: '',
  linkedin_url: '',
  website_url: '',
  social_links: '',
};

const PROFILE_DRAFT_KEY = 'portfolio.admin.profileDraft';

const emptySkill = {
  id: null,
  name: '',
  category: '',
  icon: '',
  display_order: 0,
};

const emptyProject = {
  id: null,
  title: '',
  slug: '',
  short_description: '',
  full_description: '',
  objective: '',
  operation: '',
  strengths: '',
  weaknesses: '',
  perspectives: '',
  technologies: '',
  github_url: '',
  demo_url: '',
  cover_image: '',
  gallery: '',
  status: 'published',
  featured: false,
  display_order: 0,
};

const emptyEducation = {
  id: null,
  institution: '',
  degree: '',
  start_date: '',
  end_date: '',
  description: '',
  display_order: 0,
};

const emptyCertification = {
  id: null,
  title: '',
  issuer: '',
  issue_date: '',
  credential_url: '',
  image_url: '',
  display_order: 0,
};

const skillCategories = [
  'Langages de programmation',
  'Frontend',
  'Backend',
  'Base de donnees',
  'Reseaux',
  'Securite informatique',
  'Systemes Linux',
  'DevOps',
  'Intelligence artificielle',
];

function groupSkillsByCategory(skills) {
  return skills.reduce((groups, skill) => {
    const category = skill.category || 'Autres competences';

    return {
      ...groups,
      [category]: [...(groups[category] ?? []), skill],
    };
  }, {});
}

function slugify(value) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatSocialLinksForAdmin(links) {
  if (!Array.isArray(links)) {
    return links ?? '';
  }

  return links
    .map((link) => `${link.label ?? ''} | ${link.url ?? ''}`)
    .join('\n');
}

function formatProfileForAdmin(profile) {
  return {
    ...emptyProfile,
    ...profile,
    social_links: formatSocialLinksForAdmin(profile.social_links),
  };
}

const projectDetailSections = [
  { key: 'objective', title: 'Objectif' },
  { key: 'operation', title: 'Fonctionnement' },
  { key: 'strengths', title: 'Points forts' },
  { key: 'weaknesses', title: 'Points faibles' },
  { key: 'perspectives', title: 'Perspectives' },
];

function parseProjectDetailDescription(value) {
  const text = value ?? '';
  const parsed = {
    full_description: text,
    objective: '',
    operation: '',
    strengths: '',
    weaknesses: '',
    perspectives: '',
  };

  projectDetailSections.forEach((section, index) => {
    const nextTitle = projectDetailSections[index + 1]?.title;
    const pattern = nextTitle
      ? new RegExp(`## ${section.title}\\n([\\s\\S]*?)(?=\\n## ${nextTitle}\\n)`)
      : new RegExp(`## ${section.title}\\n([\\s\\S]*)`);
    const match = text.match(pattern);

    if (match?.[1]) {
      parsed[section.key] = match[1].trim();
    }
  });

  const firstSectionMatch = text.match(/(^|\n)## Objectif\n/);
  parsed.full_description = firstSectionMatch
    ? text.slice(0, firstSectionMatch.index).trim()
    : text;

  return parsed;
}

function buildProjectDetailDescription(project) {
  const overview = project.full_description?.trim() ?? '';
  const sections = projectDetailSections
    .map((section) => {
      const content = project[section.key]?.trim();
      return content ? `## ${section.title}\n${content}` : '';
    })
    .filter(Boolean);

  return [overview, ...sections].filter(Boolean).join('\n\n');
}

function formatProjectForForm(project) {
  const detailFields = parseProjectDetailDescription(project.full_description);

  return {
    ...emptyProject,
    ...project,
    ...detailFields,
    technologies: Array.isArray(project.technologies)
      ? project.technologies.join(', ')
      : project.technologies ?? '',
    gallery: Array.isArray(project.gallery)
      ? project.gallery.join(', ')
      : project.gallery ?? '',
    featured: Boolean(project.featured),
  };
}

function loadProfileDraft() {
  try {
    const draft = localStorage.getItem(PROFILE_DRAFT_KEY);
    return draft ? JSON.parse(draft) : null;
  } catch (error) {
    return null;
  }
}

function saveProfileDraft(profile) {
  try {
    localStorage.setItem(PROFILE_DRAFT_KEY, JSON.stringify(profile));
  } catch (error) {
    // Ignore storage failures so the admin form remains usable.
  }
}

function clearProfileDraft() {
  try {
    localStorage.removeItem(PROFILE_DRAFT_KEY);
  } catch (error) {
    // Ignore storage failures so logout/save flows continue.
  }
}

export default function Admin() {
  const skillNameInputRef = useRef(null);
  const projectTitleInputRef = useRef(null);
  const [session, setSession] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [status, setStatus] = useState({ type: 'idle', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState(emptyProfile);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [isProfileLoading, setIsProfileLoading] = useState(false);
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState(emptyProject);
  const [skills, setSkills] = useState([]);
  const [skillForm, setSkillForm] = useState(emptySkill);
  const [education, setEducation] = useState([]);
  const [educationForm, setEducationForm] = useState(emptyEducation);
  const [certifications, setCertifications] = useState([]);
  const [certificationForm, setCertificationForm] = useState(emptyCertification);
  const [certificationImageFile, setCertificationImageFile] = useState(null);
  const [certificationImagePreview, setCertificationImagePreview] = useState('');
  const [isContentLoading, setIsContentLoading] = useState(false);
  const [isContentSaving, setIsContentSaving] = useState(false);
  const groupedSkills = groupSkillsByCategory(skills);

  useEffect(() => {
    if (!isSupabaseConfigured) {
      setIsLoading(false);
      return undefined;
    }

    let subscription;

    getCurrentSession()
      .then((currentSession) => {
        setSession(currentSession);
        setIsLoading(false);
      })
      .catch(() => {
        setStatus({
          type: 'error',
          message: "Impossible de verifier la session d'administration.",
        });
        setIsLoading(false);
      });

    try {
      subscription = onAuthStateChange(setSession);
    } catch (error) {
      setStatus({
        type: 'error',
        message: "Impossible d'ecouter l'etat d'authentification.",
      });
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  function updateCredential(event) {
    const { name, value } = event.target;
    setCredentials((current) => ({ ...current, [name]: value }));
  }

  useEffect(() => {
    if (!session) {
      return;
    }

    setIsProfileLoading(true);

    getProfile()
      .then((currentProfile) => {
        const profileFromDatabase = currentProfile
          ? formatProfileForAdmin(currentProfile)
          : emptyProfile;
        const draft = loadProfileDraft();
        const nextProfile = draft ?? profileFromDatabase;

        setProfile(nextProfile);
        setPhotoPreview(nextProfile.avatar_url ?? '');

        if (draft) {
          setStatus({
            type: 'success',
            message: 'Brouillon local restaure. Enregistre pour le publier.',
          });
        }
      })
      .catch(() => {
        setStatus({
          type: 'error',
          message: "Impossible de charger les informations du hero.",
        });
      })
      .finally(() => {
        setIsProfileLoading(false);
      });
  }, [session]);

  async function loadAdminContent() {
    setIsContentLoading(true);

    try {
      const [
        nextProjects,
        nextSkills,
        nextEducation,
        nextCertifications,
      ] = await Promise.all([
        getAdminProjects(),
        getSkills(),
        getEducation(),
        getCertifications(),
      ]);

      setProjects(nextProjects);
      setSkills(nextSkills);
      setEducation(nextEducation);
      setCertifications(nextCertifications);
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          "Impossible de charger les projets, competences, diplomes ou certificats.",
      });
    } finally {
      setIsContentLoading(false);
    }
  }

  useEffect(() => {
    if (!session) {
      return;
    }

    loadAdminContent();
  }, [session]);

  function updateProfileField(event) {
    const { name, value } = event.target;
    setProfile((current) => {
      const nextProfile = { ...current, [name]: value };
      saveProfileDraft(nextProfile);
      return nextProfile;
    });
  }

  function updateProfilePhoto(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setStatus({
        type: 'error',
        message: 'Choisis un fichier image pour la photo professionnelle.',
      });
      return;
    }

    setPhotoFile(file);
    if (photoPreview?.startsWith('blob:')) {
      URL.revokeObjectURL(photoPreview);
    }
    setPhotoPreview(URL.createObjectURL(file));
    setStatus({
      type: 'success',
      message:
        "Photo selectionnee. Elle sera conservee seulement apres l'enregistrement.",
    });
  }

  function updateProjectField(event) {
    const { checked, name, type, value } = event.target;

    setProjectForm((current) => {
      const nextValue = type === 'checkbox' ? checked : value;
      const nextProject = { ...current, [name]: nextValue };

      if (name === 'title' && !current.id) {
        nextProject.slug = slugify(value);
      }

      return nextProject;
    });
  }

  async function handleProfileSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (profile.name.trim().length < 2 || profile.title.trim().length < 2) {
      setStatus({
        type: 'error',
        message: 'Le nom complet et le titre professionnel sont obligatoires.',
      });
      return;
    }

    setIsProfileSaving(true);

    try {
      let avatarUrl = profile.avatar_url;

      if (photoFile) {
        avatarUrl = await uploadProfilePhoto(photoFile, session.user.id);
      }

      const savedProfile = await saveProfile({ ...profile, avatar_url: avatarUrl });
      setProfile(formatProfileForAdmin(savedProfile));
      setPhotoFile(null);
      setPhotoPreview(savedProfile.avatar_url ?? '');
      clearProfileDraft();
      setStatus({
        type: 'success',
        message: 'Informations du hero enregistrees.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Enregistrement impossible : ${
          error.message ??
          "verifie les policies RLS et Storage pour l'admin."
        }`,
      });
    } finally {
      setIsProfileSaving(false);
    }
  }

  async function handleProjectSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (
      projectForm.title.trim().length < 2 ||
      projectForm.slug.trim().length < 2 ||
      projectForm.short_description.trim().length < 10
    ) {
      setStatus({
        type: 'error',
        message: 'Le titre, le slug et le resume du projet sont obligatoires.',
      });
      return;
    }

    setIsContentSaving(true);

    try {
      await saveProject({
        ...projectForm,
        full_description: buildProjectDetailDescription(projectForm),
      });
      setProjectForm(emptyProject);
      await loadAdminContent();
      projectTitleInputRef.current?.focus();
      setStatus({
        type: 'success',
        message: 'Projet enregistre. Tu peux en ajouter un autre.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Projet non enregistre : ${error.message ?? 'verifie les policies RLS.'}`,
      });
    } finally {
      setIsContentSaving(false);
    }
  }

  async function handleProjectDelete(id) {
    setIsContentSaving(true);

    try {
      await deleteProject(id);
      await loadAdminContent();
      setStatus({ type: 'success', message: 'Projet supprime.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Suppression impossible : ${error.message ?? 'verifie les policies RLS.'}`,
      });
    } finally {
      setIsContentSaving(false);
    }
  }

  function updateSkillField(event) {
    const { name, value } = event.target;
    setSkillForm((current) => ({ ...current, [name]: value }));
  }

  function updateEducationField(event) {
    const { name, value } = event.target;
    setEducationForm((current) => ({ ...current, [name]: value }));
  }

  function updateCertificationField(event) {
    const { name, value } = event.target;
    setCertificationForm((current) => ({ ...current, [name]: value }));
  }

  function updateCertificationImage(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith('image/')) {
      setStatus({
        type: 'error',
        message: 'Choisis un fichier image pour le certificat.',
      });
      return;
    }

    setCertificationImageFile(file);

    if (certificationImagePreview?.startsWith('blob:')) {
      URL.revokeObjectURL(certificationImagePreview);
    }

    setCertificationImagePreview(URL.createObjectURL(file));
  }

  async function handleSkillSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (skillForm.name.trim().length < 2 || skillForm.category.trim().length < 2) {
      setStatus({
        type: 'error',
        message: 'Le nom et la categorie de la competence sont obligatoires.',
      });
      return;
    }

    setIsContentSaving(true);

    try {
      await saveSkill(skillForm);
      setSkillForm(emptySkill);
      await loadAdminContent();
      skillNameInputRef.current?.focus();
      setStatus({
        type: 'success',
        message: 'Competence enregistree. Tu peux en ajouter une autre.',
      });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Competence non enregistree : ${error.message ?? 'verifie les policies RLS.'}`,
      });
    } finally {
      setIsContentSaving(false);
    }
  }

  async function handleSkillDelete(id) {
    setIsContentSaving(true);

    try {
      await deleteSkill(id);
      await loadAdminContent();
      setStatus({ type: 'success', message: 'Competence supprimee.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Suppression impossible : ${error.message ?? 'verifie les policies RLS.'}`,
      });
    } finally {
      setIsContentSaving(false);
    }
  }

  async function handleEducationSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (
      educationForm.degree.trim().length < 2 ||
      educationForm.institution.trim().length < 2
    ) {
      setStatus({
        type: 'error',
        message: "Le diplome et l'etablissement sont obligatoires.",
      });
      return;
    }

    setIsContentSaving(true);

    try {
      await saveEducation(educationForm);
      setEducationForm(emptyEducation);
      await loadAdminContent();
      setStatus({ type: 'success', message: 'Diplome enregistre.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Diplome non enregistre : ${error.message ?? 'verifie les policies RLS.'}`,
      });
    } finally {
      setIsContentSaving(false);
    }
  }

  async function handleEducationDelete(id) {
    setIsContentSaving(true);

    try {
      await deleteEducation(id);
      await loadAdminContent();
      setStatus({ type: 'success', message: 'Diplome supprime.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Suppression impossible : ${error.message ?? 'verifie les policies RLS.'}`,
      });
    } finally {
      setIsContentSaving(false);
    }
  }

  async function handleCertificationSubmit(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });

    if (
      certificationForm.title.trim().length < 2 ||
      certificationForm.issuer.trim().length < 2
    ) {
      setStatus({
        type: 'error',
        message: "Le titre et l'organisme sont obligatoires.",
      });
      return;
    }

    setIsContentSaving(true);

    try {
      let imageUrl = certificationForm.image_url;

      if (certificationImageFile) {
        imageUrl = await uploadCertificationImage(
          certificationImageFile,
          session.user.id,
        );
      }

      await saveCertification({ ...certificationForm, image_url: imageUrl });
      setCertificationForm(emptyCertification);
      setCertificationImageFile(null);
      setCertificationImagePreview('');
      await loadAdminContent();
      setStatus({ type: 'success', message: 'Certificat enregistre.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Certificat non enregistre : ${error.message ?? 'verifie les policies RLS.'}`,
      });
    } finally {
      setIsContentSaving(false);
    }
  }

  async function handleCertificationDelete(id) {
    setIsContentSaving(true);

    try {
      await deleteCertification(id);
      await loadAdminContent();
      setStatus({ type: 'success', message: 'Certificat supprime.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: `Suppression impossible : ${error.message ?? 'verifie les policies RLS.'}`,
      });
    } finally {
      setIsContentSaving(false);
    }
  }

  function editCertification(certification) {
    setCertificationForm({ ...emptyCertification, ...certification });
    setCertificationImageFile(null);
    setCertificationImagePreview(certification.image_url ?? '');
  }

  async function handleLogin(event) {
    event.preventDefault();
    setStatus({ type: 'idle', message: '' });
    setIsSubmitting(true);

    try {
      const nextSession = await signInAdmin(credentials);
      setSession(nextSession);
      setCredentials({ email: '', password: '' });
      setStatus({ type: 'success', message: 'Connexion admin reussie.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message:
          'Connexion impossible. Verifie les identifiants admin dans Supabase Auth.',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleLogout() {
    setStatus({ type: 'idle', message: '' });

    try {
      await signOutAdmin();
      clearProfileDraft();
      setSession(null);
      setStatus({ type: 'success', message: 'Deconnexion effectuee.' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: 'La deconnexion a echoue.',
      });
    }
  }

  if (isLoading) {
    return (
      <section className="page-section page-section--compact">
        <p className="status-note">Verification de la session admin...</p>
      </section>
    );
  }

  if (!isSupabaseConfigured || !session) {
    return (
      <section className="page-section page-section--compact">
        <div className="section-heading">
          <p className="eyebrow">Administration</p>
          <h1>Connexion admin</h1>
          <p>
            Connecte-toi avec un compte Supabase Auth autorise pour acceder a
            l'espace de gestion.
          </p>
        </div>

        {!isSupabaseConfigured && (
          <div className="notice-panel" role="status">
            <strong>Supabase non configure</strong>
            <p>
              Ajoute `VITE_SUPABASE_URL` et une cle publique Supabase dans
              l'environnement pour activer l'authentification.
            </p>
          </div>
        )}

        <form className="auth-form" onSubmit={handleLogin}>
          <div className="auth-icon" aria-hidden="true">
            <svg fill="none" height="32" viewBox="0 0 24 24" width="32">
              <path
                d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M10 17l5-5-5-5"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
              <path
                d="M15 12H3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </svg>
          </div>

          <label>
            Email admin
            <input
              autoComplete="email"
              disabled={!isSupabaseConfigured || isSubmitting}
              name="email"
              onChange={updateCredential}
              placeholder="admin@email.com"
              required
              type="email"
              value={credentials.email}
            />
          </label>

          <label>
            Mot de passe
            <input
              autoComplete="current-password"
              disabled={!isSupabaseConfigured || isSubmitting}
              name="password"
              onChange={updateCredential}
              placeholder="Mot de passe"
              required
              type="password"
              value={credentials.password}
            />
          </label>

          {status.message && (
            <p className={`form-status form-status--${status.type}`} role="status">
              {status.message}
            </p>
          )}

          <button
            className="button button--primary"
            disabled={!isSupabaseConfigured || isSubmitting}
            type="submit"
          >
            {isSubmitting ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="page-section admin-page">
      <div className="section-heading">
        <p className="eyebrow">Administration</p>
        <h1>Gestion des informations</h1>
        <p>
          Tu es connecte a l'espace admin. Les actions de gestion seront
          activees avec les policies d'ecriture Supabase.
        </p>
      </div>

      <div className="notice-panel" role="status">
        <strong>Session admin active</strong>
        <p>
          L'interface est protegee par Supabase Auth. Les competences, diplomes
          et certificats sont maintenant geres depuis cette page.
        </p>
      </div>

      {status.message && (
        <p className={`form-status form-status--${status.type}`} role="status">
          {status.message}
        </p>
      )}

      <div className="admin-toolbar">
        <span>{session.user.email}</span>
        <button className="button button--secondary" onClick={handleLogout} type="button">
          Se deconnecter
        </button>
      </div>

      <div className="admin-stats" aria-label="Resume admin">
        <div>
          <strong>{projects.length}</strong>
          <span>Projets</span>
        </div>
        <div>
          <strong>{skills.length}</strong>
          <span>Competences</span>
        </div>
        <div>
          <strong>{education.length}</strong>
          <span>Diplomes</span>
        </div>
        <div>
          <strong>{certifications.length}</strong>
          <span>Certificats</span>
        </div>
      </div>

      <div className="admin-layout">
        <nav className="admin-sidebar" aria-label="Sections admin">
          <a href="#admin-profile">Profil</a>
          <a href="#admin-projects">Projets</a>
          <a href="#admin-skills">Competences</a>
          <a href="#admin-education">Diplomes</a>
          <a href="#admin-certifications">Certificats</a>
        </nav>

        <div className="admin-workspace">
      <form className="admin-form admin-section" id="admin-profile" onSubmit={handleProfileSubmit}>
        <div className="admin-form__heading">
          <div>
            <p className="eyebrow">Hero accueil</p>
            <h2>Profil public</h2>
            <p>
              Ces champs alimentent la photo, le nom complet, le titre et la
              courte presentation de la page d'accueil. Les textes saisis sont
              conserves localement tant qu'ils ne sont pas enregistres.
            </p>
          </div>
          {isProfileLoading && <p className="status-note">Chargement...</p>}
        </div>

        <div className="form-grid">
          <label>
            Nom complet
            <input
              name="name"
              onChange={updateProfileField}
              placeholder="Votre nom complet"
              required
              type="text"
              value={profile.name ?? ''}
            />
          </label>

          <label>
            Titre professionnel
            <input
              name="title"
              onChange={updateProfileField}
              placeholder="Ex: Developpeur full-stack"
              required
              type="text"
              value={profile.title ?? ''}
            />
          </label>

          <label className="form-grid__full">
            Courte presentation
            <textarea
              name="bio"
              onChange={updateProfileField}
              placeholder="Quelques lignes pour presenter votre profil."
              rows="4"
              value={profile.bio ?? ''}
            />
          </label>

          <label className="form-grid__full">
            Parcours scolaire et universitaire
            <textarea
              name="education_summary"
              onChange={updateProfileField}
              placeholder="Resume ton parcours scolaire, universitaire et academique."
              rows="5"
              value={profile.education_summary ?? ''}
            />
          </label>

          <div className="form-grid__full photo-upload-field">
            <div className="photo-preview" aria-label="Apercu photo professionnelle">
              {photoPreview ? (
                <img src={photoPreview} alt="" />
              ) : (
                <span>Photo</span>
              )}
            </div>

            <label>
              Photo professionnelle locale
              <input
                accept="image/*"
                name="avatar_file"
                onChange={updateProfilePhoto}
                type="file"
              />
            </label>
          </div>

          <label>
            Localisation
            <input
              name="location"
              onChange={updateProfileField}
              placeholder="Dakar"
              type="text"
              value={profile.location ?? ''}
            />
          </label>

          <label>
            Email public
            <input
              name="email"
              onChange={updateProfileField}
              placeholder="contact@email.com"
              type="email"
              value={profile.email ?? ''}
            />
          </label>

          <label>
            Telephone
            <input
              name="phone"
              onChange={updateProfileField}
              placeholder="+221..."
              type="tel"
              value={profile.phone ?? ''}
            />
          </label>

          <label>
            GitHub
            <input
              name="github_url"
              onChange={updateProfileField}
              placeholder="https://github.com/..."
              type="url"
              value={profile.github_url ?? ''}
            />
          </label>

          <label>
            LinkedIn
            <input
              name="linkedin_url"
              onChange={updateProfileField}
              placeholder="https://linkedin.com/in/..."
              type="url"
              value={profile.linkedin_url ?? ''}
            />
          </label>

          <label>
            Site web
            <input
              name="website_url"
              onChange={updateProfileField}
              placeholder="https://..."
              type="url"
              value={profile.website_url ?? ''}
            />
          </label>

          <label>
            CV en ligne
            <input
              name="cv_url"
              onChange={updateProfileField}
              placeholder="https://..."
              type="url"
              value={profile.cv_url ?? ''}
            />
          </label>

          <label className="form-grid__full">
            Reseaux sociaux supplementaires
            <textarea
              name="social_links"
              onChange={updateProfileField}
              placeholder={'X | https://x.com/...\nYouTube | https://youtube.com/...'}
              rows="4"
              value={profile.social_links ?? ''}
            />
          </label>
        </div>

        <button className="button button--primary" disabled={isProfileSaving} type="submit">
          {isProfileSaving ? 'Enregistrement...' : 'Enregistrer le hero'}
        </button>
      </form>

      <form className="admin-form admin-section" id="admin-projects" onSubmit={handleProjectSubmit}>
        <div className="admin-form__heading">
          <div>
            <p className="eyebrow">Projets</p>
            <h2>Realisations</h2>
            <p>
              Ces projets alimentent la page Projets. Le resume est affiche a
              cote de la carte projet, en alternance gauche/droite.
            </p>
          </div>
          {isContentLoading && <p className="status-note">Chargement...</p>}
        </div>

        <div className="form-grid">
          <label>
            Titre
            <input
              name="title"
              onChange={updateProjectField}
              placeholder="Naatalfi"
              ref={projectTitleInputRef}
              required
              type="text"
              value={projectForm.title}
            />
          </label>

          <label>
            Slug URL
            <input
              name="slug"
              onChange={updateProjectField}
              placeholder="naatalfi"
              required
              type="text"
              value={projectForm.slug}
            />
          </label>

          <label className="form-grid__full">
            Resume affiche a cote
            <textarea
              name="short_description"
              onChange={updateProjectField}
              placeholder="Resume court du projet."
              required
              rows="3"
              value={projectForm.short_description}
            />
          </label>

          <label className="form-grid__full">
            Presentation detaillee
            <textarea
              name="full_description"
              onChange={updateProjectField}
              placeholder="Presentation generale du projet."
              rows="4"
              value={projectForm.full_description ?? ''}
            />
          </label>

          <label className="form-grid__full">
            Objectif
            <textarea
              name="objective"
              onChange={updateProjectField}
              placeholder="Quel probleme le projet cherche a resoudre ?"
              rows="3"
              value={projectForm.objective ?? ''}
            />
          </label>

          <label className="form-grid__full">
            Fonctionnement
            <textarea
              name="operation"
              onChange={updateProjectField}
              placeholder="Comment le projet fonctionne, cote utilisateur et cote technique ?"
              rows="3"
              value={projectForm.operation ?? ''}
            />
          </label>

          <label className="form-grid__full">
            Points forts
            <textarea
              name="strengths"
              onChange={updateProjectField}
              placeholder="Ce qui rend le projet solide ou interessant."
              rows="3"
              value={projectForm.strengths ?? ''}
            />
          </label>

          <label className="form-grid__full">
            Points faibles
            <textarea
              name="weaknesses"
              onChange={updateProjectField}
              placeholder="Limites actuelles, contraintes ou aspects a ameliorer."
              rows="3"
              value={projectForm.weaknesses ?? ''}
            />
          </label>

          <label className="form-grid__full">
            Perspectives
            <textarea
              name="perspectives"
              onChange={updateProjectField}
              placeholder="Evolutions prevues, prochaines fonctionnalites ou ameliorations."
              rows="3"
              value={projectForm.perspectives ?? ''}
            />
          </label>

          <label>
            Technologies
            <input
              name="technologies"
              onChange={updateProjectField}
              placeholder="React, Supabase, Vite"
              type="text"
              value={projectForm.technologies ?? ''}
            />
          </label>

          <label>
            Image principale
            <input
              name="cover_image"
              onChange={updateProjectField}
              placeholder="https://..."
              type="url"
              value={projectForm.cover_image ?? ''}
            />
          </label>

          <label>
            Lien GitHub
            <input
              name="github_url"
              onChange={updateProjectField}
              placeholder="https://github.com/..."
              type="url"
              value={projectForm.github_url ?? ''}
            />
          </label>

          <label>
            Lien demo
            <input
              name="demo_url"
              onChange={updateProjectField}
              placeholder="https://..."
              type="url"
              value={projectForm.demo_url ?? ''}
            />
          </label>

          <label>
            Statut
            <select
              name="status"
              onChange={updateProjectField}
              value={projectForm.status}
            >
              <option value="published">Publie</option>
              <option value="draft">Brouillon</option>
              <option value="archived">Archive</option>
            </select>
          </label>

          <label>
            Ordre
            <input
              name="display_order"
              onChange={updateProjectField}
              type="number"
              value={projectForm.display_order}
            />
          </label>

          <label className="checkbox-field">
            <input
              checked={projectForm.featured}
              name="featured"
              onChange={updateProjectField}
              type="checkbox"
            />
            Projet mis en avant sur l'accueil
          </label>
        </div>

        <div className="admin-actions">
          <button className="button button--primary" disabled={isContentSaving} type="submit">
            {projectForm.id ? 'Modifier le projet' : 'Ajouter le projet'}
          </button>
          {projectForm.id && (
            <button
              className="button button--secondary"
              onClick={() => setProjectForm(emptyProject)}
              type="button"
            >
              Annuler
            </button>
          )}
        </div>

        <div className="admin-list">
          {projects.map((project) => (
            <article className="admin-list-item" key={project.id}>
              <div>
                <strong>{project.title}</strong>
                <span>{project.status}</span>
              </div>
              <div className="admin-actions">
                <button
                  className="button button--secondary"
                  onClick={() => setProjectForm(formatProjectForForm(project))}
                  type="button"
                >
                  Modifier
                </button>
                <button
                  className="button button--secondary"
                  disabled={isContentSaving}
                  onClick={() => handleProjectDelete(project.id)}
                  type="button"
                >
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      </form>

      <form className="admin-form admin-section" id="admin-skills" onSubmit={handleSkillSubmit}>
        <div className="admin-form__heading">
          <div>
            <p className="eyebrow">A propos</p>
            <h2>Competences</h2>
            <p>
              Ces competences alimentent la page A propos et le bloc
              Competences de l'accueil. Aucun niveau en pourcentage n'est
              affiche.
            </p>
          </div>
          {isContentLoading && <p className="status-note">Chargement...</p>}
        </div>

        <div className="form-grid">
          <label>
            Nom
            <input
              name="name"
              onChange={updateSkillField}
              placeholder="React"
              ref={skillNameInputRef}
              required
              type="text"
              value={skillForm.name}
            />
          </label>

          <label>
            Categorie
            <input
              list="skill-categories"
              name="category"
              onChange={updateSkillField}
              placeholder="Langages de programmation"
              required
              type="text"
              value={skillForm.category}
            />
            <datalist id="skill-categories">
              {skillCategories.map((category) => (
                <option key={category} value={category} />
              ))}
            </datalist>
          </label>

          <label>
            Icone
            <input
              name="icon"
              onChange={updateSkillField}
              placeholder="Optionnel"
              type="text"
              value={skillForm.icon ?? ''}
            />
          </label>

          <label>
            Ordre
            <input
              name="display_order"
              onChange={updateSkillField}
              type="number"
              value={skillForm.display_order}
            />
          </label>
        </div>

        <div className="admin-actions">
          <button className="button button--primary" disabled={isContentSaving} type="submit">
            {skillForm.id ? 'Modifier la competence' : 'Ajouter la competence'}
          </button>
          {skillForm.id && (
            <button
              className="button button--secondary"
              onClick={() => setSkillForm(emptySkill)}
              type="button"
            >
              Annuler
            </button>
          )}
        </div>

        <div className="admin-list">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <section className="admin-list-group" key={category}>
              <h3>{category}</h3>
              <div className="admin-list">
                {categorySkills.map((skill) => (
                  <article className="admin-list-item" key={skill.id}>
                    <div>
                      <strong>{skill.name}</strong>
                      <span>{skill.icon || 'Competence'}</span>
                    </div>
                    <div className="admin-actions">
                      <button
                        className="button button--secondary"
                        onClick={() => setSkillForm({ ...emptySkill, ...skill })}
                        type="button"
                      >
                        Modifier
                      </button>
                      <button
                        className="button button--secondary"
                        disabled={isContentSaving}
                        onClick={() => handleSkillDelete(skill.id)}
                        type="button"
                      >
                        Supprimer
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </form>

      <form className="admin-form admin-section" id="admin-education" onSubmit={handleEducationSubmit}>
        <div className="admin-form__heading">
          <div>
            <p className="eyebrow">Diplomes</p>
            <h2>Education</h2>
            <p>
              Ces informations alimentent la page Diplomes & Certificats.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Diplome
            <input
              name="degree"
              onChange={updateEducationField}
              placeholder="Licence, Master..."
              required
              type="text"
              value={educationForm.degree}
            />
          </label>

          <label>
            Etablissement
            <input
              name="institution"
              onChange={updateEducationField}
              placeholder="Universite..."
              required
              type="text"
              value={educationForm.institution}
            />
          </label>

          <label>
            Date debut
            <input
              name="start_date"
              onChange={updateEducationField}
              type="date"
              value={educationForm.start_date ?? ''}
            />
          </label>

          <label>
            Date fin
            <input
              name="end_date"
              onChange={updateEducationField}
              type="date"
              value={educationForm.end_date ?? ''}
            />
          </label>

          <label>
            Ordre
            <input
              name="display_order"
              onChange={updateEducationField}
              type="number"
              value={educationForm.display_order}
            />
          </label>

          <label className="form-grid__full">
            Description
            <textarea
              name="description"
              onChange={updateEducationField}
              placeholder="Description courte du parcours."
              rows="3"
              value={educationForm.description ?? ''}
            />
          </label>
        </div>

        <div className="admin-actions">
          <button className="button button--primary" disabled={isContentSaving} type="submit">
            {educationForm.id ? 'Modifier le diplome' : 'Ajouter le diplome'}
          </button>
          {educationForm.id && (
            <button
              className="button button--secondary"
              onClick={() => setEducationForm(emptyEducation)}
              type="button"
            >
              Annuler
            </button>
          )}
        </div>

        <div className="admin-list">
          {education.map((item) => (
            <article className="admin-list-item" key={item.id}>
              <div>
                <strong>{item.degree}</strong>
                <span>{item.institution}</span>
              </div>
              <div className="admin-actions">
                <button
                  className="button button--secondary"
                  onClick={() => setEducationForm({ ...emptyEducation, ...item })}
                  type="button"
                >
                  Modifier
                </button>
                <button
                  className="button button--secondary"
                  disabled={isContentSaving}
                  onClick={() => handleEducationDelete(item.id)}
                  type="button"
                >
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      </form>

      <form className="admin-form admin-section" id="admin-certifications" onSubmit={handleCertificationSubmit}>
        <div className="admin-form__heading">
          <div>
            <p className="eyebrow">Certificats</p>
            <h2>Certifications</h2>
            <p>
              Ces certificats restent affiches uniquement dans la page Diplomes
              & Certificats.
            </p>
          </div>
        </div>

        <div className="form-grid">
          <label>
            Titre
            <input
              name="title"
              onChange={updateCertificationField}
              placeholder="Nom du certificat"
              required
              type="text"
              value={certificationForm.title}
            />
          </label>

          <label>
            Organisme
            <input
              name="issuer"
              onChange={updateCertificationField}
              placeholder="Cisco, Google..."
              required
              type="text"
              value={certificationForm.issuer}
            />
          </label>

          <label>
            Date obtention
            <input
              name="issue_date"
              onChange={updateCertificationField}
              type="date"
              value={certificationForm.issue_date ?? ''}
            />
          </label>

          <label>
            Ordre
            <input
              name="display_order"
              onChange={updateCertificationField}
              type="number"
              value={certificationForm.display_order}
            />
          </label>

          <label className="form-grid__full">
            Lien certificat
            <input
              name="credential_url"
              onChange={updateCertificationField}
              placeholder="https://..."
              type="url"
              value={certificationForm.credential_url ?? ''}
            />
          </label>

          <div className="form-grid__full photo-upload-field">
            <div className="photo-preview" aria-label="Apercu image certificat">
              {certificationImagePreview || certificationForm.image_url ? (
                <img
                  src={certificationImagePreview || certificationForm.image_url}
                  alt=""
                />
              ) : (
                <span>Image</span>
              )}
            </div>

            <label>
              Image locale du certificat
              <input
                accept="image/*"
                name="certification_image"
                onChange={updateCertificationImage}
                type="file"
              />
            </label>
          </div>
        </div>

        <div className="admin-actions">
          <button className="button button--primary" disabled={isContentSaving} type="submit">
            {certificationForm.id ? 'Modifier le certificat' : 'Ajouter le certificat'}
          </button>
          {certificationForm.id && (
            <button
              className="button button--secondary"
              onClick={() => {
                setCertificationForm(emptyCertification);
                setCertificationImageFile(null);
                setCertificationImagePreview('');
              }}
              type="button"
            >
              Annuler
            </button>
          )}
        </div>

        <div className="admin-list">
          {certifications.map((item) => (
            <article className="admin-list-item" key={item.id}>
              <div>
                <strong>{item.title}</strong>
                <span>{item.issuer}</span>
              </div>
              <div className="admin-actions">
                <button
                  className="button button--secondary"
                  onClick={() => editCertification(item)}
                  type="button"
                >
                  Modifier
                </button>
                <button
                  className="button button--secondary"
                  disabled={isContentSaving}
                  onClick={() => handleCertificationDelete(item.id)}
                  type="button"
                >
                  Supprimer
                </button>
              </div>
            </article>
          ))}
        </div>
      </form>
        </div>
      </div>
    </section>
  );
}
