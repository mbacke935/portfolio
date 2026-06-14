# Phase 14 - Optimisation

## Objectif

Ameliorer le SEO, le partage social, la performance frontend et l'accessibilite de base avant le deploiement final.

## Optimisations realisees

### SEO de base

Le fichier `index.html` contient :

- `description`
- `robots`
- `theme-color`
- titre de page

### Open Graph et Twitter

Le fichier `index.html` contient :

- `og:type`
- `og:title`
- `og:description`
- `og:site_name`
- `twitter:card`
- `twitter:title`
- `twitter:description`

### Performance React

Les pages sont chargees avec `React.lazy` et `Suspense`.

Cela permet de decouper le bundle par route au lieu de charger toutes les pages dans le fichier principal.

### Images

Les images de detail projet et de galerie utilisent `loading="lazy"`.

### Accessibilite et motion

Les animations respectent `prefers-reduced-motion`.

## Fichiers concernes

```text
index.html
src/routes/AppRoutes.jsx
src/styles/global.css
```

## Checklist

- Le build Vite doit passer.
- Le bundle principal doit etre reduit par le lazy loading des routes.
- Les routes doivent continuer a fonctionner.
- Les meta tags doivent etre presents dans `index.html`.
- Les animations doivent etre reduites si l'utilisateur prefere moins de mouvement.
