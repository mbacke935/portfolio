import { useEffect, useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabaseClient.js';
import {
  getCurrentSession,
  onAuthStateChange,
  signInAdmin,
  signOutAdmin,
} from '../services/authService.js';
import { getProfile, saveProfile } from '../services/profileService.js';
import { uploadProfilePhoto } from '../services/storageService.js';

const emptyProfile = {
  id: null,
  name: '',
  title: '',
  bio: '',
  email: '',
  phone: '',
  location: '',
  avatar_url: '',
  cv_url: '',
  github_url: '',
  linkedin_url: '',
  website_url: '',
};

const adminSections = ['Projets', 'Competences', 'Education', 'Certifications', 'Messages'];

export default function Admin() {
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
        setProfile(currentProfile ?? emptyProfile);
        setPhotoPreview(currentProfile?.avatar_url ?? '');
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

  function updateProfileField(event) {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
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
      setProfile(savedProfile);
      setPhotoFile(null);
      setPhotoPreview(savedProfile.avatar_url ?? '');
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
    <section className="page-section page-section--compact">
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
          L'interface est protegee par Supabase Auth. Les operations d'ecriture
          restent a connecter aux services admin.
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

      <form className="admin-form" onSubmit={handleProfileSubmit}>
        <div className="admin-form__heading">
          <div>
            <p className="eyebrow">Hero accueil</p>
            <h2>Profil public</h2>
            <p>
              Ces champs alimentent la photo, le nom complet, le titre et la
              courte presentation de la page d'accueil.
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
        </div>

        <button className="button button--primary" disabled={isProfileSaving} type="submit">
          {isProfileSaving ? 'Enregistrement...' : 'Enregistrer le hero'}
        </button>
      </form>

      <div className="admin-grid">
        {adminSections.map((section) => (
          <article className="admin-panel" key={section}>
            <h2>{section}</h2>
            <p>
              {section === 'Profil hero'
                ? 'Photo professionnelle, nom complet, titre et courte presentation.'
                : 'Gestion en preparation pour la phase Supabase.'}
            </p>
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
