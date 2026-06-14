# Phase 8 - Configuration Supabase cote React

## Objectif

Configurer le client Supabase dans React sans connecter encore les pages aux donnees dynamiques.

La connexion aux tables sera faite dans les services frontend pendant la phase 9.

## Fichier principal

```text
src/lib/supabaseClient.js
```

Ce fichier :

- lit les variables d'environnement Vite ;
- cree le client Supabase ;
- exporte une instance `supabase` reutilisable ;
- bloque clairement l'execution si les variables requises sont absentes.

## Variables d'environnement

Fichier local :

```text
.env
```

Modele versionne :

```text
.env.example
```

Variables attendues :

```text
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Regles importantes

- `.env` ne doit pas etre commit.
- `.env.example` doit rester commit pour documenter les variables.
- La cle `anon` est publique cote frontend.
- La securite doit rester geree par les policies RLS Supabase.
- Les composants React ne doivent pas importer directement `supabase`.
- Les appels Supabase doivent passer par les services dans `src/services/`.

## Checklist

- Le fichier `.env.example` contient les deux variables attendues.
- `src/lib/supabaseClient.js` exporte `supabase`.
- Le build echoue clairement si les variables manquent dans un code qui importe le client.
- Les pages ne dependent pas encore directement de Supabase.
- Les prochaines integrations passeront par les services frontend.
