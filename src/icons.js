import React from "react";
const mk = (els, opts = {}) => ({ size = 24, strokeWidth = 2, className }) =>
  React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor",
    strokeWidth: opts.fixed || strokeWidth, strokeLinecap: "round", strokeLinejoin: "round", className, "aria-hidden": true },
    ...els.map((e, i) => typeof e === "string" ? React.createElement("path", { key: i, d: e })
      : React.createElement(e[0], { key: i, ...e[1] })));

/* Accueil : toit simple, lignes continues */
export const Home = mk(["M3.6 10.4 12 3.8l8.4 6.6", "M5.6 12v7.2a1 1 0 0 0 1 1h10.8a1 1 0 0 0 1-1V12"]);
/* Matières premières : sac d'ingrédients */
export const ShoppingBasket = mk(["M6.2 8h11.6l-1 11.2a1.6 1.6 0 0 1-1.6 1.5H8.8a1.6 1.6 0 0 1-1.6-1.5z", "M9.4 8V6.2a2.6 2.6 0 0 1 5.2 0V8"]);
/* Préparations : bol avec vapeur */
export const Soup = mk(["M3.8 11.6h16.4a8.2 8.2 0 0 1-16.4 0z", "M9.2 7.4c0-.9.9-.9.9-1.8s-.9-.9-.9-1.8", "M14.8 7.4c0-.9.9-.9.9-1.8s-.9-.9-.9-1.8"]);
/* Coûts : étiquette de prix */
export const Cake = mk(["M20.2 12.3 12.6 19.9a1.6 1.6 0 0 1-2.3 0l-6.2-6.2a1.6 1.6 0 0 1-.4-1.5l1.3-6a1.6 1.6 0 0 1 1.2-1.2l6-1.3a1.6 1.6 0 0 1 1.5.4l6.5 6.5a1.6 1.6 0 0 1 0 2.3z", ["circle", { cx: 8.9, cy: 8.9, r: 1.35 }]]);
/* Production : caisses empilées */
export const Factory = mk(["M3.6 14.4h7v6.2h-7z", "M13.4 14.4h7v6.2h-7z", "M8.5 3.4h7v6.2h-7z"]);
/* Réglages : engrenage */
export const Settings = mk(["M19.6 13.1a7.7 7.7 0 0 0 0-2.2l2-1.5-2-3.4-2.4.9a7.7 7.7 0 0 0-1.9-1.1L14.9 3h-3.8l-.4 2.8a7.7 7.7 0 0 0-1.9 1.1l-2.4-.9-2 3.4 2 1.5a7.7 7.7 0 0 0 0 2.2l-2 1.5 2 3.4 2.4-.9a7.7 7.7 0 0 0 1.9 1.1l.4 2.8h3.8l.4-2.8a7.7 7.7 0 0 0 1.9-1.1l2.4.9 2-3.4z", ["circle", { cx: 13, cy: 12, r: 2.7 }]]);

export const Plus = mk(["M12 5.2v13.6", "M5.2 12h13.6"]);
export const Search = mk([["circle", { cx: 11, cy: 11, r: 6.6 }], "m20 20-4.3-4.3"]);
export const Trash2 = mk(["M3.6 6.4h16.8", "M9 6.4V4.8a1.4 1.4 0 0 1 1.4-1.4h3.2A1.4 1.4 0 0 1 15 4.8v1.6", "M6.6 6.4l.9 13a1.6 1.6 0 0 0 1.6 1.5h5.8a1.6 1.6 0 0 0 1.6-1.5l.9-13", "M10.4 10.6v6", "M13.6 10.6v6"]);
export const ChevronLeft = mk(["m14.6 19-7-7 7-7"]);
export const FileDown = mk(["M13.6 3.4H7a1.6 1.6 0 0 0-1.6 1.6v14a1.6 1.6 0 0 0 1.6 1.6h10a1.6 1.6 0 0 0 1.6-1.6V8.4z", "M13.6 3.4v5h5", "M12 11.6v5.2", "m9.6 14.4 2.4 2.4 2.4-2.4"]);
export const TrendingUp = mk(["m3.6 16.8 5.4-5.4 3.4 3.4 7.8-7.8", "M15.4 7h4.8v4.8"]);
export const TrendingDown = mk(["m3.6 7.2 5.4 5.4 3.4-3.4 7.8 7.8", "M15.4 17h4.8v-4.8"]);
export const AlertTriangle = mk(["M10.7 3.9 2.9 17.4a1.5 1.5 0 0 0 1.3 2.3h15.6a1.5 1.5 0 0 0 1.3-2.3L13.3 3.9a1.5 1.5 0 0 0-2.6 0z", "M12 9.4v4", "M12 16.6v.01"]);
export const Info = mk([["circle", { cx: 12, cy: 12, r: 8.6 }], "M12 11.4v5", "M12 7.9v.01"]);
export const Check = mk(["m4.8 12.4 4.6 4.6 9.8-10"]);
