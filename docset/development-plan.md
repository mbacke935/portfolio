# Plan de developpement - Portfolio React + Supabase

## Objectif du projet

Construire un portfolio professionnel, dynamique et evolutif avec React, Vite, Supabase et Vercel.

Le portfolio doit permettre d'ajouter ou modifier des projets depuis Supabase sans modifier le code React.

## Exigence transversale - Responsivite

La responsivite mobile et ordinateur doit etre prise en compte a chaque phase du projet.

Pour chaque nouvelle page, composant, layout, formulaire ou fonctionnalite :

- Verifier l'affichage sur mobile.
- Verifier l'affichage sur ordinateur.
- Eviter les debordements horizontaux.
- Garder les textes lisibles sur petits et grands ecrans.
- Adapter les grilles, formulaires, menus et cards selon la largeur d'ecran.
- Tester les routes principales dans les deux formats avant de valider la phase.

## Stack technique

- Frontend : React + Vite
- Routing : React Router
- Backend as a Service : Supabase
- Base de donnees : PostgreSQL via Supabase
- Deploiement frontend : Vercel
- Gestion des donnees : services React dedies, sans appels directs a Supabase dans les composants

## Phase 1 - Cadrage fonctionnel

Pages principales :

- Accueil
- A propos
- Projets
- Detail projet
- Contact
- Admin

Pages optionnelles futures :

- Education
- Certifications
- Blog technique

Fonctions principales :

- Afficher un profil professionnel
- Afficher les projets depuis Supabase
- Afficher les competences depuis Supabase
- Consulter le detail d'un projet via une URL dediee
- Envoyer un message de contact vers Supabase
- Ajouter un projet sans modifier le code
- Gerer les informations depuis une page admin : ajouter, modifier et supprimer les donnees du portfolio

Preferences visuelles validees :

- Couleur principale : bleu-fonce
- Couleur secondaire : bleu-clair
- Couleur de base : blanc
- Animations simples dans les pages, utiles a la navigation et a la comprehension

## Phase 2 - Initialisation du projet

Objectif : obtenir un projet Vite executable proprement.

Actions :

- Initialiser Vite avec React
- Completer `package.json`
- Configurer `vite.config.js`
- Installer les dependances principales :
  - `react`
  - `react-dom`
  - `react-router-dom`
  - `@supabase/supabase-js`
- Verifier que le serveur de developpement fonctionne
- Verifier que la page de base s'affiche correctement sur mobile et ordinateur

## Phase 3 - Architecture cible

Structure recommandee :

```text
src/
  assets/
  components/
  constants/
  hooks/
  layouts/
    MainLayout.jsx
  lib/
    supabaseClient.js
  pages/
    Admin.jsx
    About.jsx
    Contact.jsx
    Home.jsx
    ProjectDetails.jsx
    Projects.jsx
  routes/
    AppRoutes.jsx
  services/
    certificationService.js
    contactService.js
    educationService.js
    profileService.js
    projectService.js
    skillService.js
  styles/
    global.css
  App.jsx
  main.jsx
```

Principe important :

Aucun composant React ne doit appeler Supabase directement. Les appels base de donnees passent par les fichiers dans `src/services/`.

Chaque layout et chaque page doivent etre concus mobile-first, puis adaptes aux ecrans ordinateur.

## Phase 4 - Schema Supabase

Fichier de reference :

```text
docset/supabase-schema.sql
```

Ce fichier contient la creation des tables, les contraintes, les index, les triggers `updated_at` et les regles RLS initiales.

### Table `profiles`

Champs :

- `id`
- `name`
- `title`
- `bio`
- `email`
- `phone`
- `location`
- `avatar_url`
- `cv_url`
- `github_url`
- `linkedin_url`
- `website_url`
- `created_at`
- `updated_at`

### Table `projects`

Champs :

- `id`
- `title`
- `slug`
- `short_description`
- `full_description`
- `technologies`
- `github_url`
- `demo_url`
- `cover_image`
- `gallery`
- `status`
- `featured`
- `display_order`
- `created_at`
- `updated_at`

Notes :

- `technologies` peut etre un `text[]` ou un champ JSON.
- `gallery` peut etre un `text[]` ou un champ JSON.
- `slug` doit etre unique.

### Table `skills`

Champs :

- `id`
- `name`
- `category`
- `level`
- `icon`
- `display_order`

Categories possibles :

- Frontend
- Backend
- Database
- DevOps
- Reseaux
- Cybersecurite
- IA

### Table `education`

Champs :

- `id`
- `institution`
- `degree`
- `start_date`
- `end_date`
- `description`
- `display_order`

### Table `certifications`

Champs :

- `id`
- `title`
- `issuer`
- `issue_date`
- `credential_url`
- `display_order`

### Table `contacts`

Champs :

- `id`
- `name`
- `email`
- `subject`
- `message`
- `created_at`

## Phase 5 - Regles RLS Supabase

Fichier de reference :

```text
docset/supabase-rls.md
```

Activer RLS sur toutes les tables.

Regles recommandees :

- Lecture publique autorisee :
  - `profiles`
  - `projects`
  - `skills`
  - `education`
  - `certifications`
- Insertion publique autorisee :
  - `contacts`
- Lecture publique interdite :
  - `contacts`
- Modification et suppression :
  - reservees a l'administration dans Supabase au depart

## Phase 6 - Routes React

Fichier de reference :

```text
docset/react-routes.md
```

Routes principales :

```text
/
/about
/projects
/projects/:slug
/contact
/admin
*
```

Routes optionnelles futures :

```text
/education
/certifications
```

Toutes les pages doivent utiliser le layout global `MainLayout`.

Les routes doivent etre testees sur mobile et ordinateur, notamment les pages longues et les pages avec grilles.

## Phase 7 - Layout global

Fichier de reference :

```text
docset/main-layout.md
```

Composant :

```text
src/layouts/MainLayout.jsx
```

Structure :

```text
Navbar
Main Content
Footer
```

Le layout centralise la structure commune de toutes les pages.

Le layout doit rester lisible et utilisable sur mobile et ordinateur :

- Navbar responsive
- Contenu sans debordement horizontal
- Footer adapte aux petits ecrans

## Phase 8 - Configuration Supabase cote React

Fichier de reference :

```text
docset/supabase-client.md
```

Fichier :

```text
src/lib/supabaseClient.js
```

Variables d'environnement :

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

La cle `anon` peut etre exposee cote frontend, mais les politiques RLS doivent proteger les donnees sensibles.

## Phase 9 - Services frontend

Fichier de reference :

```text
docset/frontend-services.md
```

Fichiers :

```text
src/services/projectService.js
src/services/profileService.js
src/services/skillService.js
src/services/educationService.js
src/services/certificationService.js
src/services/contactService.js
```

Responsabilites :

- `projectService.js` : recuperer les projets, les projets mis en avant et un projet par slug
- `profileService.js` : recuperer le profil principal
- `skillService.js` : recuperer les competences
- `educationService.js` : recuperer le parcours
- `certificationService.js` : recuperer les certifications
- `contactService.js` : inserer un message de contact

## Phase 10 - Integration dynamique

Fichier de reference :

```text
docset/dynamic-integration.md
```

Objectif : connecter React a Supabase.

Actions :

- Tester une premiere requete Supabase depuis React
- Charger le profil depuis `profiles`
- Charger les projets depuis `projects`
- Charger les competences depuis `skills`
- Envoyer les messages de contact vers `contacts`
- Verifier les etats chargement, succes et erreur sur mobile et ordinateur

## Phase 11 - UI / UX

Fichier de reference :

```text
docset/ui-ux.md
```

Elements a construire :

- Navbar responsive
- Footer professionnel
- Cards projets
- Page detail projet
- Formulaire de contact
- Page admin de gestion des informations
- Sections competences
- Sections education et certifications si necessaire

Contraintes :

- Design responsive mobile et desktop
- Interface sobre et professionnelle
- Lisibilite prioritaire
- Animations simples et utiles
- Palette basee sur bleu-fonce, bleu-clair et blanc

## Phase 11.1 - Page admin

Objectif :

Permettre de gerer les informations du portfolio depuis une interface dediee.

Route :

```text
/admin
```

Fonctionnalites attendues :

- Ajouter des informations
- Modifier des informations
- Supprimer des informations
- Gerer les projets
- Gerer le profil
- Gerer les competences
- Gerer l'education
- Gerer les certifications

Contraintes importantes :

- La page admin devra etre protegee avant le deploiement public.
- Les operations d'ecriture passeront par des services dedies.
- Les regles RLS Supabase devront empecher les modifications non autorisees.
- Les formulaires et tableaux admin devront etre utilisables sur mobile et ordinateur.

## Phase 12 - Projets dynamiques

Fichier de reference :

```text
docset/dynamic-projects.md
```

Objectif central :

Ajouter un projet depuis Supabase et le voir apparaitre automatiquement dans React.

Fonctionnement :

- Ajouter une ligne dans `projects`
- Renseigner `slug`, descriptions, images, technologies et liens
- React recupere les donnees via `projectService.js`
- La page `/projects/:slug` affiche le detail automatiquement
- La liste et la page detail doivent rester responsives sur mobile et ordinateur

Exemple d'URL :

```text
/projects/naatalfi
```

## Phase 13 - Formulaire de contact

Fichier de reference :

```text
docset/contact-form.md
```

Fonctionnalites :

- Formulaire React controle
- Validation basique
- Envoi vers la table `contacts`
- Message de succes ou d'erreur
- Formulaire utilisable confortablement sur mobile et ordinateur

Donnees envoyees :

- `name`
- `email`
- `subject`
- `message`

## Phase 14 - Optimisation

Actions :

- Ajouter les meta tags essentiels
- Ajouter les donnees Open Graph pour LinkedIn
- Optimiser les images
- Mettre en place le lazy loading si necessaire
- Verifier les performances React
- Verifier l'accessibilite de base
- Verifier les performances et l'affichage sur mobile et ordinateur

## Phase 15 - Deploiement

Frontend :

- GitHub
- Vercel

Backend :

- Supabase

Etapes :

- Initialiser le depot Git
- Pousser le projet sur GitHub
- Connecter GitHub a Vercel
- Ajouter les variables d'environnement dans Vercel
- Deployer automatiquement
- Verifier les routes et les appels Supabase en production
- Verifier le rendu final en production sur mobile et ordinateur

## Phase 16 - Evolutions futures

Pistes :

- Ajout de projets cybersecurite
- Ajout de projets IA
- Ajout de certifications
- Ajout d'un blog technique
- Ajout d'un dashboard admin
- Gestion des images via Supabase Storage

## Priorite absolue

Avant de construire les composants React :

1. Initialiser Vite.
2. Creer le projet Supabase.
3. Concevoir les tables.
4. Configurer les regles RLS.
5. Tester une requete React vers Supabase.

Une fois cette base validee, le developpement de l'interface peut commencer proprement.
