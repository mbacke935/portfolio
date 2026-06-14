# Phase 9 - Services frontend

## Objectif

Centraliser tous les appels Supabase dans `src/services/`.

Les composants React ne doivent pas parler directement a Supabase. Ils consommeront les fonctions de service pendant les phases d'integration dynamique.

## Fichiers

```text
src/services/projectService.js
src/services/profileService.js
src/services/skillService.js
src/services/educationService.js
src/services/certificationService.js
src/services/contactService.js
```

## Services disponibles

### `projectService.js`

- `getProjects()`
- `getFeaturedProjects()`
- `getProjectBySlug(slug)`

Ces fonctions lisent uniquement les projets publies.

### `profileService.js`

- `getProfile()`

Cette fonction recupere le profil principal.

### `skillService.js`

- `getSkills()`

Cette fonction recupere les competences triees par categorie, ordre d'affichage et nom.

### `educationService.js`

- `getEducation()`

Cette fonction recupere le parcours de formation.

### `certificationService.js`

- `getCertifications()`

Cette fonction recupere les certifications.

### `contactService.js`

- `submitContactMessage(payload)`

Cette fonction insere un message dans la table `contacts`.

## Regles

- Les services importent `supabase` depuis `src/lib/supabaseClient.js`.
- Les pages et composants importeront les services, pas le client Supabase.
- Les erreurs Supabase sont remontees avec `throw`.
- Les listes retournent un tableau vide si aucune donnee n'existe.
- Les fonctions de detail peuvent retourner `null`.

## Checklist

- Tous les services prevus existent.
- Aucun composant React n'importe directement `supabase`.
- Le build reste valide.
- Les fonctions sont pretes pour la phase d'integration dynamique.
