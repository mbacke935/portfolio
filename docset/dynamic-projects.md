# Phase 12 - Projets dynamiques

## Objectif

Permettre d'ajouter un projet depuis Supabase et de le voir apparaitre automatiquement dans React sans modifier le code.

## Flux attendu

1. Ajouter une ligne dans la table `projects`.
2. Renseigner un `slug` unique.
3. Mettre `status` a `published`.
4. Ajouter les technologies, liens et images.
5. React recupere les donnees via `projectService.js`.
6. `/projects` affiche automatiquement la carte.
7. `/projects/:slug` affiche automatiquement le detail.

## Champs importants

- `title` : nom du projet.
- `slug` : identifiant URL, par exemple `naatalfi`.
- `short_description` : texte court pour la carte.
- `full_description` : description complete pour la page detail.
- `technologies` : tableau `text[]`.
- `github_url` : lien GitHub optionnel.
- `demo_url` : lien demo optionnel.
- `cover_image` : image principale optionnelle.
- `gallery` : tableau `text[]` d'images optionnelles.
- `status` : doit etre `published` pour apparaitre publiquement.
- `featured` : utile pour les futurs projets mis en avant.
- `display_order` : controle l'ordre d'affichage.

## Exemple SQL

```sql
insert into public.projects (
  title,
  slug,
  short_description,
  full_description,
  technologies,
  github_url,
  demo_url,
  cover_image,
  gallery,
  status,
  featured,
  display_order
) values (
  'Naatalfi',
  'naatalfi',
  'Application de demonstration pour le portfolio.',
  'Description complete du projet, objectifs, architecture et resultats.',
  array['React', 'Supabase', 'Vite'],
  'https://github.com/username/naatalfi',
  'https://naatalfi.example.com',
  'https://example.com/cover.jpg',
  array['https://example.com/screen-1.jpg', 'https://example.com/screen-2.jpg'],
  'published',
  true,
  1
);
```

## Validation

- Le projet apparait sur `/projects`.
- La carte affiche le titre, la description courte et les technologies.
- `/projects/naatalfi` affiche le detail.
- Les liens GitHub et demo s'ouvrent dans un nouvel onglet.
- La galerie s'affiche si `gallery` contient des URLs.
- Le projet disparait du public si `status` n'est pas `published`.

## Responsivite

- La grille projets passe en une colonne sur mobile.
- La galerie passe en une colonne sur mobile.
- Les titres longs doivent rester dans leur conteneur.
- Les images gardent un ratio stable.
