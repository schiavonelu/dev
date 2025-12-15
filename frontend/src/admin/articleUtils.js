const CATEGORIES = ["News", "Fantacalcio", "Regolamento"];

const initArticle = {
  titolo: "",
  sottotitolo: "",
  slug: "",
  autore: "",
  cover: "",
  estratto: "",
  corpo: "",
  categoria: "News",
  centrale: false,
  pubblicato: false,
  evidenza: false,
  tickerForce: false,
  durataLettura: 0,
};

const autoSlug = (s = "") =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

function calcolaDurataLettura(html = "") {
  const plain = String(html).replace(/<[^>]*>/g, " ");
  const words = (plain.trim().match(/\S+/g) || []).length;
  return Math.max(1, Math.ceil(words / 200));
}

// UI <-> API mapping
const uiToApi = (ui) => ({
  title: ui.titolo,
  subtitle: ui.sottotitolo,
  author: ui.autore,
  slug: ui.slug,
  cover: ui.cover,
  excerpt: ui.estratto,
  body: ui.corpo,
  category: ui.categoria,
  central: ui.centrale,
  published: ui.pubblicato,
  featured: ui.evidenza,
  tickerForce: ui.tickerForce,
  readMinutes: calcolaDurataLettura(ui.corpo),
});

const apiToUi = (a) => ({
  titolo: a.title ?? a.titolo ?? "",
  sottotitolo: a.subtitle ?? a.sottotitolo ?? "",
  slug: a.slug ?? "",
  autore: a.author ?? a.autore ?? "",
  cover: a.cover ?? a.coverUrl ?? "",
  estratto: a.excerpt ?? a.estratto ?? "",
  corpo: a.body ?? a.corpo ?? "",
  categoria: a.category ?? a.categoria ?? "News",
  centrale: !!(a.central ?? a.centrale),
  pubblicato: !!(a.published ?? a.pubblicato),
  evidenza: !!(a.featured ?? a.evidenza),
  tickerForce: !!(a.tickerForce ?? a.forzaTicker),
  durataLettura: a.readMinutes ?? a.durataLettura ?? calcolaDurataLettura(a.body || a.corpo || ""),
  publishedAt: a.publishedAt || a.published_at,
  createdAt: a.createdAt,
});

export {
  apiToUi,
  autoSlug,
  CATEGORIES,
  calcolaDurataLettura,
  initArticle,
  uiToApi,
};
