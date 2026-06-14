# Authentification admin

## Objectif

Proteger la route `/admin` avec Supabase Auth avant d'activer les actions de gestion.

## Fonctionnement

- Le lien `Admin` affiche une icone de connexion dans le menu lateral.
- La page `/admin` affiche un formulaire de connexion si aucune session n'est active.
- La connexion utilise Supabase Auth avec email et mot de passe.
- Une session active affiche l'espace admin.
- Un bouton permet de se deconnecter.

## Fichiers concernes

```text
src/pages/Admin.jsx
src/services/authService.js
src/components/Navbar.jsx
src/lib/supabaseClient.js
src/styles/global.css
```

## Variables d'environnement

Le client Supabase accepte :

```text
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
```

ou :

```text
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
```

## Configuration Supabase

Dans Supabase :

1. Aller dans `Authentication`.
2. Creer un utilisateur admin.
3. Utiliser l'email et le mot de passe pour se connecter dans `/admin`.

## Securite

Cette protection masque l'interface admin aux visiteurs non connectes.

Les operations d'ecriture devront toujours etre protegees par RLS cote Supabase. L'interface React ne doit pas etre la seule barriere de securite.

## Donnees du hero d'accueil

Le hero d'accueil consomme la table `profiles`.

Champs utilises :

- `avatar_url` : photo professionnelle.
- `name` : nom complet.
- `title` : titre professionnel.
- `bio` : courte presentation.

L'espace admin devra permettre de modifier ces champs lors de la phase de gestion effective.

## Edition du profil hero

La page `/admin` permet maintenant de modifier :

- nom complet ;
- titre professionnel ;
- courte presentation ;
- URL de photo professionnelle ;
- upload d'une photo locale vers Supabase Storage ;
- localisation ;
- email ;
- telephone ;
- GitHub ;
- LinkedIn.

Pour que l'enregistrement fonctionne, executer dans Supabase SQL Editor :

```text
docset/admin-profile-edit.sql
```

Ce script autorise les utilisateurs authentifies a inserer, modifier et supprimer le profil public.

Pour utiliser des photos locales, executer aussi :

```text
docset/admin-storage.sql
```

Ce script cree le bucket public `profile-assets` et autorise l'upload pour les utilisateurs authentifies.
