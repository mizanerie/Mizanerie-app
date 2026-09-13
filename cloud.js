/* ════════════════════════════════════════════════════════════════════════
   NUAGE — comptes et synchronisation (Supabase, sans dépendance externe)

   Principe :
   - Hors connexion (version gratuite) : les données restent sur l'appareil.
   - Connecté : le nuage fait autorité. Chaque enregistrement part aussitôt.
   - À la première connexion, les données locales sont transférées dans le compte.
   ════════════════════════════════════════════════════════════════════════ */

const SUPABASE_URL = "https://ltogttawtqwjjlxaewhz.supabase.co";
const SUPABASE_KEY = "sb_publishable_MHqk8a9g4iqD-tPWxPjjNQ_uAxFyDQH";
const SESSION_KEY = "mizanerie:session";

/* ─────────── Stockage du jeton (localStorage si disponible) ─────────── */
const localStore = {
  get(k) { try { return window.localStorage?.getItem(k) ?? null; } catch { return null; } },
  set(k, v) { try { window.localStorage?.setItem(k, v); } catch { /* mode privé */ } },
  del(k) { try { window.localStorage?.removeItem(k); } catch { /* ignore */ } },
};

let session = null;
try { const raw = localStore.get(SESSION_KEY); if (raw) session = JSON.parse(raw); } catch { session = null; }

function setSession(s) {
  session = s;
  if (s) localStore.set(SESSION_KEY, JSON.stringify(s));
  else localStore.del(SESSION_KEY);
}
export const getSession = () => session;
export const isSignedIn = () => !!session?.access_token;
export const userEmail = () => session?.user?.email || "";

/* ─────────── Erreurs traduisibles ─────────── */
export class CloudError extends Error {
  constructor(code, message, raw) { super(message); this.code = code; this.raw = raw; }
}
function mapAuthError(status, body) {
  const msg = (body?.error_description || body?.msg || body?.message || "").toLowerCase();
  if (msg.includes("invalid login")) return "auth.badCredentials";
  if (msg.includes("already registered") || msg.includes("already been registered")) return "auth.emailTaken";
  if (msg.includes("password") && msg.includes("6")) return "auth.weakPassword";
  if (msg.includes("email") && msg.includes("invalid")) return "auth.badEmail";
  if (msg.includes("not confirmed")) return "auth.notConfirmed";
  if (msg.includes("rate limit") || status === 429) return "auth.tooMany";
  return "auth.generic";
}

async function authFetch(path, body, method = "POST") {
  let r;
  try {
    r = await fetch(`${SUPABASE_URL}/auth/v1${path}`, {
      method,
      headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch { throw new CloudError("net.offline"); }
  const txt = await r.text();
  let json = null;
  try { json = txt ? JSON.parse(txt) : null; } catch { /* réponse vide */ }
  if (!r.ok) throw new CloudError(mapAuthError(r.status, json), json?.msg || "", json);
  return json;
}

/* ─────────── Authentification ─────────── */
export async function signUp(email, password) {
  const res = await authFetch("/signup", { email: email.trim(), password });
  if (res?.access_token) { setSession(res); return { signedIn: true }; }
  return { signedIn: false, needsConfirm: true };
}
export async function signIn(email, password) {
  const res = await authFetch("/token?grant_type=password", { email: email.trim(), password });
  setSession(res);
  return res;
}
export async function resetPassword(email, redirectTo) {
  await authFetch("/recover", { email: email.trim(), ...(redirectTo ? { gotrue_meta_security: {} } : {}) });
}
export async function signOut() {
  try { if (session) await rest("/auth/v1/logout", { method: "POST", raw: true }); } catch { /* ignore */ }
  setSession(null);
}
async function refresh() {
  if (!session?.refresh_token) throw new CloudError("auth.expired");
  const res = await authFetch("/token?grant_type=refresh_token", { refresh_token: session.refresh_token });
  setSession(res);
  return res;
}

/* ─────────── Appels à la base ─────────── */
async function rest(path, { method = "GET", body, headers = {}, raw = false, retry = true } = {}) {
  if (!session?.access_token) throw new CloudError("auth.expired");
  let r;
  try {
    r = await fetch(SUPABASE_URL + path, {
      method,
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${session.access_token}`,
        "Content-Type": "application/json",
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch { throw new CloudError("net.offline"); }

  if (r.status === 401 && retry) { await refresh(); return rest(path, { method, body, headers, raw, retry: false }); }
  const txt = await r.text();
  if (!r.ok) {
    let j = null; try { j = JSON.parse(txt); } catch { /* texte brut */ }
    const m = /FREE_LIMIT_REACHED:(\w+):(\d+)/.exec(j?.message || txt || "");
    if (m) throw new CloudError("limit", m[1], { table: m[1], cap: Number(m[2]) });
    throw new CloudError("db.generic", j?.message || txt, j);
  }
  if (raw || !txt) return null;
  try { return JSON.parse(txt); } catch { return null; }
}
const db = (p, o) => rest("/rest/v1" + p, o);

/* ─────────── Conversion entre l'application et la base ─────────── */
const num = (v) => (v === "" || v === null || v === undefined ? null : String(v));
const str = (v) => (v === null || v === undefined ? "" : String(v));

function itemsToRows(items, parent, key) {
  return items.map((it, i) => ({
    [key]: parent,
    client_id: it.id || null,
    position: i,
    ingredient_id: it.kind === "ingredient" ? it.refId : null,
    source_prep_id: it.kind === "preparation" ? it.refId : null,
    fixed_amount: it.kind === "fixed" ? num(it.amount) : null,
    label: it.kind === "fixed" ? it.label || null : null,
    qty: it.kind === "fixed" ? null : num(it.qty),
    unit: it.kind === "fixed" ? null : it.unit,
  }));
}
function rowToItem(r) {
  if (r.fixed_amount !== null) return { id: r.client_id || r.id, kind: "fixed", label: str(r.label), amount: str(r.fixed_amount) };
  const kind = r.ingredient_id ? "ingredient" : "preparation";
  return { id: r.client_id || r.id, kind, refId: r.ingredient_id || r.source_prep_id, qty: str(r.qty), unit: r.unit };
}
const ingToRow = (i) => ({
  id: i.id, name: i.name, category: i.category || null, price: num(i.price),
  pack_count: num(i.packCount || 1), qty_per_pack: num(i.qtyPerPack), unit: i.unit, pack_label: i.packLabel || null,
});
const rowToIng = (r) => ({
  id: r.id, name: r.name, category: str(r.category), price: str(r.price),
  packCount: str(r.pack_count), qtyPerPack: str(r.qty_per_pack), unit: r.unit, packLabel: str(r.pack_label),
  createdAt: Date.parse(r.created_at) || Date.now(),
});
const prepToRow = (p) => ({ id: p.id, name: p.name, category: p.category || null, yield_qty: num(p.yieldQty), yield_unit: p.yieldUnit, notes: p.notes || null });
const recToRow = (r) => ({
  id: r.id, name: r.name, category: r.category || null, yield_pieces: num(r.yieldPieces),
  margin_mode: r.marginMode || "prix_vente", target_margin_rate: num(r.targetRate), selling_price: num(r.sellingPrice), notes: r.notes || null,
});
const prodToRow = (p) => ({ id: p.id, produced_on: p.date, lot_number: p.lot || null, notes: p.notes || null });

/* ─────────── Lecture complète du compte ─────────── */
export async function pullAll() {
  const [profile, sub, ings, preps, recs, items, prods, lines, hist] = await Promise.all([
    db("/profiles?select=*&limit=1"),
    db("/subscriptions?select=*&limit=1"),
    db("/ingredients?select=*&order=created_at"),
    db("/preparations?select=*&order=created_at"),
    db("/recipes?select=*&order=created_at"),
    db("/composition_items?select=*&order=position"),
    db("/productions?select=*&order=produced_on.desc"),
    db("/production_lines?select=*"),
    db("/ingredient_price_history?select=*&order=changed_at"),
  ]);
  const byPrep = new Map(), byRec = new Map();
  for (const r of items || []) {
    const m = r.preparation_id ? byPrep : byRec;
    const k = r.preparation_id || r.recipe_id;
    if (!m.has(k)) m.set(k, []);
    m.get(k).push(rowToItem(r));
  }
  const p = profile?.[0] || {};
  const s = sub?.[0] || {};
  return {
    settings: {
      businessName: str(p.business_name), lang: p.lang || "fr", currency: p.currency || "MAD",
      priceLabel: p.price_label || "aucun", marginMode: p.margin_mode || "prix_vente",
      defaultRatePct: p.default_margin_rate ? String(Number(p.default_margin_rate) * 100) : "",
      onboarded: true,
    },
    subscription: {
      plan: s.plan || "free",
      expiresAt: s.expires_at || null,
      trialEndsAt: s.trial_ends_at || null,
      premium: s.plan === "premium" && (!s.expires_at || new Date(s.expires_at) > new Date()),
    },
    ingredients: (ings || []).map(rowToIng),
    preparations: (preps || []).map((r) => ({
      id: r.id, name: r.name, category: str(r.category), yieldQty: str(r.yield_qty), yieldUnit: r.yield_unit,
      notes: str(r.notes), items: byPrep.get(r.id) || [], createdAt: Date.parse(r.created_at) || Date.now(),
    })),
    recipes: (recs || []).map((r) => ({
      id: r.id, name: r.name, category: str(r.category), yieldPieces: str(r.yield_pieces),
      marginMode: r.margin_mode, targetRate: str(r.target_margin_rate), sellingPrice: str(r.selling_price),
      notes: str(r.notes), items: byRec.get(r.id) || [], createdAt: Date.parse(r.created_at) || Date.now(),
    })),
    productions: (prods || []).map((r) => ({
      id: r.id, date: r.produced_on, lot: str(r.lot_number), notes: str(r.notes),
      lines: (lines || []).filter((l) => l.production_id === r.id).map((l) => ({ recipeId: l.recipe_id, quantity: str(l.quantity) })),
      createdAt: Date.parse(r.created_at) || Date.now(),
    })),
    priceHistory: (hist || []).map((h) => ({
      id: String(h.id), ingredientId: h.ingredient_id, oldPrice: h.old_price === null ? null : str(h.old_price),
      newPrice: str(h.new_price), oldDesc: str(h.old_unit_desc), newDesc: str(h.new_unit_desc), at: Date.parse(h.changed_at) || Date.now(),
    })),
  };
}

/* ─────────── Écritures ─────────── */
const UPSERT = { Prefer: "resolution=merge-duplicates,return=minimal" };

export const saveProfile = (s) => db("/profiles?user_id=eq." + session.user.id, {
  method: "PATCH", headers: { Prefer: "return=minimal" },
  body: {
    business_name: s.businessName || null, lang: s.lang, currency: s.currency,
    price_label: s.priceLabel, margin_mode: s.marginMode,
    default_margin_rate: s.defaultRatePct === "" ? null : String(Number(String(s.defaultRatePct).replace(",", ".")) / 100),
  },
});

export const saveIngredient = (i) => db("/ingredients", { method: "POST", headers: UPSERT, body: [ingToRow(i)] });
export const deleteIngredient = (id) => db("/ingredients?id=eq." + id, { method: "DELETE", raw: true });

export async function savePreparation(p) {
  await db("/preparations", { method: "POST", headers: UPSERT, body: [prepToRow(p)] });
  await db("/composition_items?preparation_id=eq." + p.id, { method: "DELETE", raw: true });
  if (p.items.length) await db("/composition_items", { method: "POST", headers: { Prefer: "return=minimal" }, body: itemsToRows(p.items, p.id, "preparation_id") });
}
export const deletePreparation = (id) => db("/preparations?id=eq." + id, { method: "DELETE", raw: true });

export async function saveRecipe(r) {
  await db("/recipes", { method: "POST", headers: UPSERT, body: [recToRow(r)] });
  await db("/composition_items?recipe_id=eq." + r.id, { method: "DELETE", raw: true });
  if (r.items.length) await db("/composition_items", { method: "POST", headers: { Prefer: "return=minimal" }, body: itemsToRows(r.items, r.id, "recipe_id") });
}
export const deleteRecipe = (id) => db("/recipes?id=eq." + id, { method: "DELETE", raw: true });

export async function saveProduction(p) {
  await db("/productions", { method: "POST", headers: UPSERT, body: [prodToRow(p)] });
  await db("/production_lines?production_id=eq." + p.id, { method: "DELETE", raw: true });
  if (p.lines.length) await db("/production_lines", { method: "POST", headers: { Prefer: "return=minimal" },
    body: p.lines.map((l) => ({ production_id: p.id, recipe_id: l.recipeId, quantity: num(l.quantity) })) });
}
export const deleteProduction = (id) => db("/productions?id=eq." + id, { method: "DELETE", raw: true });

export const deleteAccount = () => db("/rpc/delete_my_account", { method: "POST", raw: true });

/* ─────────── Transfert des données locales au premier compte ─────────── */
export async function uploadLocal(data) {
  await saveProfile(data.settings);
  for (const i of data.ingredients) await saveIngredient(i);
  for (const p of data.preparations) await savePreparation(p);
  for (const r of data.recipes) await saveRecipe(r);
  for (const p of data.productions) await saveProduction(p);
}

/* Vrai si le compte est vide : on peut y verser les données locales sans risque. */
export async function isEmptyAccount() {
  const [i, p, r] = await Promise.all([
    db("/ingredients?select=id&limit=1"),
    db("/preparations?select=id&limit=1"),
    db("/recipes?select=id&limit=1"),
  ]);
  return !(i?.length || p?.length || r?.length);
}
