# Mizanerie

Coût de revient, prix de vente, marges et stock pour les pâtissiers,
traiteurs et vendeurs de desserts.

## Structure

    index.html          page de présentation (mizanerie.com)
    app/                l'application (mizanerie.com/app)
    icons/ shots/       icônes et captures
    src/                code source de l'application

## Base de données

Supabase, projet `mizanerie`, région Paris (eu-west-3).
Stock : colonnes `ingredients.stock` et `stock_min` (unité de base : g, ml, pièce),
table `stock_moves` (historique) et fonction `apply_stock_moves`.

## Recompiler

    npx esbuild src/standalone.jsx --bundle --minify --format=iife \
      --outfile=app/app.js --jsx=automatic --target=es2020 \
      --alias:lucide-react=./src/icons.js
