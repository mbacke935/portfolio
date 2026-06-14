# Phase 13 - Formulaire de contact

## Objectif

Permettre a un visiteur d'envoyer un message professionnel depuis le portfolio.

Les messages sont envoyes vers la table Supabase `contacts` via le service frontend.

## Fichiers concernes

```text
src/pages/Contact.jsx
src/components/ContactForm.jsx
src/services/contactService.js
docset/supabase-rls.md
```

## Donnees envoyees

- `name`
- `email`
- `subject`
- `message`

## Validation cote client

- `name` : au moins 2 caracteres.
- `email` : format email basique valide.
- `message` : au moins 10 caracteres.
- `subject` : optionnel.

## Validation cote Supabase

La policy RLS d'insertion dans `contacts` verifie aussi :

- nom non vide ;
- email valide ;
- message suffisamment long.

Le frontend ameliore l'experience utilisateur, mais Supabase reste la barriere de securite.

## Etats utilisateur

Le formulaire gere :

- envoi en cours ;
- succes ;
- erreur de validation ;
- erreur Supabase ;
- mode demonstration si Supabase n'est pas configure.

## Accessibilite

- Champs requis marques avec `required`.
- Erreurs reliees aux champs avec `aria-describedby`.
- Champs invalides marques avec `aria-invalid`.
- Message de statut annonce avec `role="status"`.

## Responsivite

- Le formulaire reste sur une colonne.
- Les champs occupent toute la largeur disponible.
- Les boutons deviennent pleine largeur sur petit ecran.
