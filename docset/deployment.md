# Phase 15 - Deploiement

## Objectif

Deployer le portfolio React + Supabase sur Vercel avec une configuration compatible React Router.

## Plateformes

- Code source : GitHub
- Frontend : Vercel
- Backend : Supabase

## Configuration Vercel

Framework :

```text
Vite
```

Build command :

```text
npm run build
```

Output directory :

```text
dist
```

Install command :

```text
npm install
```

## Variables d'environnement Vercel

Ajouter dans Vercel :

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

Si Supabase fournit une variable appelee `VITE_SUPABASE_PUBLISHABLE_KEY`, copier la meme valeur dans :

```text
VITE_SUPABASE_ANON_KEY
```

Le code actuel lit `VITE_SUPABASE_ANON_KEY`.

## Routes React sur Vercel

Le fichier suivant est requis :

```text
vercel.json
```

Il redirige toutes les routes vers `index.html` pour que React Router gere :

```text
/
/about
/projects
/projects/:slug
/contact
/admin
```

## Fichiers a ne pas versionner

Ces fichiers/dossiers doivent rester ignores par Git :

```text
.env
node_modules/
dist/
```

## Checklist avant push

- `npm.cmd run build` passe localement.
- `.env` n'est pas suivi par Git.
- `node_modules/` n'est pas suivi par Git.
- `dist/` n'est pas suivi par Git.
- `vercel.json` est commit.
- Les variables Supabase sont ajoutees dans Vercel.
- La protection Vercel est desactivee si le site doit etre public.

## Checklist apres deploiement

Tester :

```text
/
/about
/projects
/projects/naatalfi
/contact
/admin
```

Verifier :

- La page d'accueil repond.
- Les routes React directes ne retournent pas `NOT_FOUND`.
- Le formulaire contact affiche un message coherent.
- Les projets fallback ou Supabase s'affichent.
- Le site est lisible sur mobile et ordinateur.

## Point de securite

La route `/admin` est encore publique et non protegee par authentification.

Avant un partage public large, il faudra :

- proteger `/admin` ;
- ou masquer temporairement le lien admin ;
- ou mettre en place Supabase Auth.
