# Phase 6 - Routes React

## Objectif

Mettre en place une navigation React claire, stable et responsive pour les pages principales du portfolio.

Toutes les routes utilisent `MainLayout`, qui centralise :

- Navbar
- Contenu principal
- Footer

## Routes principales

| Route | Page | Role |
| --- | --- | --- |
| `/` | `Home` | Page d'accueil du portfolio |
| `/about` | `About` | Profil, parcours et competences |
| `/projects` | `Projects` | Liste des projets |
| `/projects/:slug` | `ProjectDetails` | Detail d'un projet dynamique |
| `/contact` | `Contact` | Formulaire de contact |
| `/admin` | `Admin` | Gestion future des informations |
| `*` | `NotFound` | Page 404 |

## Fichiers concernes

```text
src/routes/AppRoutes.jsx
src/layouts/MainLayout.jsx
src/pages/Home.jsx
src/pages/About.jsx
src/pages/Projects.jsx
src/pages/ProjectDetails.jsx
src/pages/Contact.jsx
src/pages/Admin.jsx
src/pages/NotFound.jsx
```

## Contraintes

- Toutes les pages doivent rester utilisables sur mobile et ordinateur.
- Aucune route principale ne doit provoquer un rechargement complet de page.
- Les liens internes doivent utiliser `Link` ou `NavLink` de React Router.
- Les routes inconnues doivent afficher une page 404 claire.
- La route `/admin` restera statique jusqu'a la mise en place de l'authentification.

## Checklist de validation

- `/` affiche l'accueil.
- `/about` affiche la page a propos.
- `/projects` affiche la liste des projets.
- `/projects/naatalfi` affiche une page detail avec le slug.
- `/contact` affiche le formulaire.
- `/admin` affiche la page admin.
- Une route inconnue affiche `NotFound`.
- La navigation fonctionne sur mobile et ordinateur.
