# Mizanerie

Application de calcul de coût de revient, de prix de vente et de marges
pour les pâtissiers, traiteurs et vendeurs de desserts.

## Contenu

- `index.html` — page unique
- `app.js` — application compilée (React, sans dépendance externe au chargement)
- `manifest.webmanifest` + `icons/` — installation sur l'écran d'accueil
- `src/` — code source

## Déploiement

Site statique : aucun serveur à configurer.
Sur Vercel, laisser le répertoire racine tel quel, sans commande de build.

## Base de données

Supabase (projet `mizanerie`, région Paris). Les clés publiques sont dans
`src/cloud.js` ; elles sont conçues pour être publiques et sont protégées
par les règles de sécurité de la base (RLS).

## Développement

Le code source est en `src/`. Pour recompiler :

    npx esbuild src/standalone.jsx --bundle --minify --format=iife \
      --outfile=app.js --jsx=automatic --target=es2020
