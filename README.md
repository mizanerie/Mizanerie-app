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

Authentication -> URL Configuration :

    Site URL       https://mizanerie.com/app
    Redirect URLs  https://mizanerie.com/app/**

## Confidentialité

Chaque compte ne voit que ses propres données (Row Level Security).
Aucun rôle, administrateur compris, ne peut lire les matières, préparations,
recettes, productions ni l'historique des prix d'un autre utilisateur.
L'administration se limite aux e-mails et aux abonnements
(`admin_list_users`, `admin_set_plan`), et vérifie le droit côté serveur.

## Recompiler l'application

    npx esbuild src/standalone.jsx --bundle --minify --format=iife \
      --outfile=app/app.js --jsx=automatic --target=es2020 \
      --alias:lucide-react=./src/icons.js
