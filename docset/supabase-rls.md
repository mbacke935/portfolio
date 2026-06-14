# Phase 5 - Regles RLS Supabase

## Objectif

Securiser les donnees du portfolio avec Row Level Security avant toute integration dynamique cote React.

Les regles doivent permettre :

- La lecture publique des donnees visibles dans le portfolio.
- L'envoi public d'un message de contact.
- Le blocage de la lecture publique des messages de contact.
- Le blocage des modifications non autorisees.
- La preparation d'une future page admin protegee.

## Tables publiques en lecture

Les tables suivantes peuvent etre lues par les visiteurs :

- `profiles`
- `projects`
- `skills`
- `education`
- `certifications`

La table `projects` doit exposer uniquement les projets publies :

```sql
status = 'published'
```

Ainsi, les projets en brouillon ou archives restent invisibles cote public.

## Table `contacts`

La table `contacts` accepte uniquement les insertions publiques.

Lecture publique :

- interdite

Insertion publique :

- autorisee avec validation minimale

Conditions recommandees :

- `name` doit contenir au moins 2 caracteres utiles.
- `email` doit avoir un format email basique valide.
- `message` doit contenir au moins 10 caracteres utiles.

Le fichier `docset/supabase-schema.sql` contient deja une policy d'insertion avec ces controles.

## Operations admin

Les operations suivantes ne doivent pas etre publiques :

- ajouter un profil
- modifier un profil
- supprimer un profil
- ajouter un projet
- modifier un projet
- supprimer un projet
- gerer les competences
- gerer l'education
- gerer les certifications
- lire les messages de contact
- supprimer les messages de contact

Ces operations seront ajoutees apres la mise en place de l'authentification admin.

## Strategie admin recommandee

Pour la future page `/admin`, il faudra :

1. Activer Supabase Auth.
2. Creer un utilisateur administrateur.
3. Ajouter un mecanisme permettant d'identifier les admins.
4. Ajouter les policies `insert`, `update`, `delete` reservees aux admins.
5. Proteger la route React `/admin`.

Approche recommandee :

- Garder la page `/admin` inaccessible aux utilisateurs non connectes.
- Verifier la session cote React.
- Laisser Supabase RLS comme barriere principale de securite.
- Ne jamais faire confiance uniquement a l'interface React.

## Policies actuellement prevues

Le fichier `docset/supabase-schema.sql` active RLS sur :

- `profiles`
- `projects`
- `skills`
- `education`
- `certifications`
- `contacts`

Policies incluses :

- Lecture publique de `profiles`.
- Lecture publique des projets avec `status = 'published'`.
- Lecture publique de `skills`.
- Lecture publique de `education`.
- Lecture publique de `certifications`.
- Insertion publique controlee dans `contacts`.

Policy volontairement absente :

- Aucune lecture publique de `contacts`.

## Checklist de validation Supabase

Apres execution du SQL dans Supabase :

- Verifier que RLS est active sur toutes les tables.
- Verifier qu'un visiteur anonyme peut lire `profiles`.
- Verifier qu'un visiteur anonyme peut lire uniquement les projets publies.
- Verifier qu'un visiteur anonyme peut lire `skills`, `education` et `certifications`.
- Verifier qu'un visiteur anonyme peut inserer un message valide dans `contacts`.
- Verifier qu'un visiteur anonyme ne peut pas lire `contacts`.
- Verifier qu'un message contact invalide est refuse.
- Verifier qu'aucune modification ou suppression publique n'est possible.

## Ordre d'execution

1. Creer le projet Supabase.
2. Ouvrir SQL Editor.
3. Executer `docset/supabase-schema.sql`.
4. Verifier les tables.
5. Verifier les policies RLS.
6. Inserer des donnees de test.
7. Tester les requetes publiques.

## Point de vigilance

La cle `VITE_SUPABASE_ANON_KEY` sera visible cote frontend. Ce n'est pas un probleme si les policies RLS sont correctes.

La securite repose sur Supabase RLS, pas sur le fait de cacher la cle publique.
