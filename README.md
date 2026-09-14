# Mizanerie

Coût de revient, prix de vente et marges pour les pâtissiers,
traiteurs et vendeurs de desserts.

## Structure

    index.html          page de présentation (mizanerie.com)
    app/                l'application (mizanerie.com/app)
    icons/              icônes (écran d'accueil, favicon)
    shots/              captures utilisées sur la page de présentation
    src/                code source de l'application

## Déploiement

Site statique : aucune commande de build. Sur Vercel, réglages par défaut.

## Base de données

Supabase, projet `mizanerie`, région Paris (eu-west-3).
Les clés dans `src/cloud.js` sont publiques par conception ; la protection
repose sur les règles de sécurité de la base (RLS).

Authentication -> URL Configuration :

    Site URL       https://mizanerie.com/app
    Redirect URLs  https://mizanerie.com/app/**

## Recompiler l'application

    npx esbuild src/standalone.jsx --bundle --minify --format=iife \
      --outfile=app/app.js --jsx=automatic --target=es2020 \
      --alias:lucide-react=./src/icons.js
