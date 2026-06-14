# Phase 7 - Layout global

## Objectif

Centraliser la structure commune de toutes les pages du portfolio.

Le layout doit garantir une experience coherente sur mobile et ordinateur.

## Structure

```text
MainLayout
  Skip link
  Navbar
  Main Content
  Footer
```

## Fichiers concernes

```text
src/layouts/MainLayout.jsx
src/components/Navbar.jsx
src/components/Footer.jsx
src/styles/global.css
```

## Responsabilites

### `MainLayout`

- Encadrer toutes les pages React.
- Afficher la navigation globale.
- Afficher le contenu actif via `Outlet`.
- Afficher le footer global.
- Fournir un lien d'evitement vers le contenu principal.

### `Navbar`

- Afficher les liens principaux :
  - Accueil
  - A propos
  - Projets
  - Contact
  - Admin
- Indiquer la route active.
- Rester utilisable sur mobile et ordinateur.

### `Footer`

- Afficher les informations globales du portfolio.
- Rester lisible sur petits et grands ecrans.

## Contraintes UI

- Palette : bleu-fonce, bleu-clair et blanc.
- Aucun debordement horizontal.
- Navigation lisible sur mobile.
- Contenu principal accessible au clavier.
- Footer adapte en colonne sur mobile.
- Animations simples et non bloquantes.

## Checklist de validation

- Le layout est applique a toutes les routes principales.
- Le lien d'evitement apparait au focus clavier.
- La navigation indique la page active.
- Le footer reste visible apres le contenu.
- L'affichage reste correct sur mobile.
- L'affichage reste correct sur ordinateur.
