# Phase 10 - Integration dynamique

## Objectif

Connecter les pages React aux services Supabase tout en gardant le site utilisable si Supabase n'est pas encore configure localement.

## Pages connectees

```text
src/pages/Home.jsx
src/pages/About.jsx
src/pages/Projects.jsx
src/pages/ProjectDetails.jsx
src/components/ContactForm.jsx
```

## Donnees chargees

- `Home` charge le profil principal via `getProfile()`.
- `About` charge le profil, les competences, l'education et les certifications.
- `Projects` charge les projets publies via `getProjects()`.
- `ProjectDetails` charge un projet publie via `getProjectBySlug(slug)`.
- `ContactForm` envoie les messages via `submitContactMessage()`.

## Fallbacks

Les donnees de demonstration sont centralisees dans :

```text
src/constants/fallbackData.js
```

Elles permettent de garder les pages lisibles lorsque :

- les variables Supabase ne sont pas encore configurees ;
- la base ne contient pas encore de donnees ;
- une requete echoue pendant le developpement.

## Hook de chargement

Le hook :

```text
src/hooks/useAsyncData.js
```

centralise les etats :

- `data`
- `error`
- `isLoading`

## Comportement attendu

- Les pages n'appellent jamais Supabase directement.
- Les pages appellent les services frontend.
- Les services appellent le client Supabase.
- Les messages de chargement et d'erreur restent visibles et responsives.
- Le formulaire de contact gere les etats succes, erreur et envoi en cours.

## Validation

- Le build doit fonctionner sans `.env` local.
- Le site doit afficher les donnees fallback sans Supabase configure.
- Apres configuration de `.env`, les services doivent interroger Supabase.
- Les policies RLS restent la protection principale.
