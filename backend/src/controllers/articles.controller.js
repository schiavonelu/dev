import { firestore } from '../utils/firebase.js';
const col = () => firestore.collection('articles');

const ALLOWED_PAGE_SIZES = [6, 9];
const DEF_PAGE_SIZE = 9;
const clampPageSize = (n) => (ALLOWED_PAGE_SIZES.includes(n) ? n : DEF_PAGE_SIZE);
const norm = (s = '') => String(s).toLowerCase();

const stripUndefined = (obj) => {
  const out = {};
  Object.keys(obj || {}).forEach((k) => {
    const v = obj[k];
    if (v !== undefined) out[k] = v;
  });
  return out;
};

function toEnglishPayload(payload = {}) {
  const p = { ...payload };
  const out = {
    slug:        p.slug ?? p.Slug,
    title:       p.title ?? p.titolo,
    subtitle:    p.subtitle ?? p.sottotitolo,
    author:      p.author ?? p.autore,
    cover:       p.cover ?? p.coverUrl,
    excerpt:     p.excerpt ?? p.estratto,
    body:        p.body ?? p.corpo,
    category:    p.category ?? p.categoria,
    central:     (p.central ?? p.centrale) ? true : false,
    published:   (p.published ?? p.pubblicato) ? true : false,
    featured:    (p.featured  ?? p.evidenza)   ? true : false,
    tickerForce: (p.tickerForce ?? p.forzaTicker) ? true : false, // <— NEW
    readMinutes: p.readMinutes ?? p.durataLettura,
    tags:        p.tags ?? [],
    createdAt:   p.createdAt,
    updatedAt:   p.updatedAt,
    publishedAt: p.publishedAt,
  };
  if (typeof out.slug === 'string') {
    out.slug = out.slug
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  return out;
}

export async function listArticles(req, res, next) {
  try {
    const { published, q, tag, category } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = clampPageSize(parseInt(req.query.pageSize, 10) || DEF_PAGE_SIZE);

    let qRef = col();
    if (published === '1') qRef = qRef.where('published', '==', true);
    const snap = await qRef.get();

    let rows = [];
    snap.forEach(d => rows.push({ id: d.id, ...d.data() }));

    const qNorm = norm(q || '');
    const tagNorm = norm(tag || '');
    const catNorm = norm(category || '');

    if (qNorm) {
      rows = rows.filter(a => {
        const text = norm(`${a.title || ''} ${a.excerpt || ''} ${a.body || ''}`);
        return text.includes(qNorm);
      });
    }
    if (tagNorm) rows = rows.filter(a => (a.tags || []).map(norm).includes(tagNorm));
    if (catNorm) rows = rows.filter(a => norm(a.category || '') === catNorm);

    rows.sort((a, b) =>
      (b.publishedAt || 0) - (a.publishedAt || 0) ||
      (b.createdAt || 0) - (a.createdAt || 0)
    );

    const tagSet = new Set();
    const catSet = new Set();
    rows.forEach(a => {
      (a.tags || []).forEach(t => tagSet.add(t));
      if (a.category) catSet.add(a.category);
    });

    const total = rows.length;
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const safePage = Math.min(page, totalPages);
    const start = (safePage - 1) * pageSize;
    const items = rows.slice(start, start + pageSize);

    return res.json({
      items,
      page: safePage,
      pageSize,
      total,
      totalPages,
      availableTags: Array.from(tagSet).sort((a, b) => String(a).localeCompare(String(b))),
      availableCategories: Array.from(catSet).sort((a, b) => String(a).localeCompare(String(b))),
    });
  } catch (err) { return next(err); }
}

export async function getArticle(req, res, next) {
  try {
    const doc = await col().doc(req.params.slug).get();
    if (!doc.exists) return res.status(404).json({ error: 'Not found' });
    return res.json({ id: doc.id, ...doc.data() });
  } catch (err) { return next(err); }
}

export async function createArticle(req, res, next) {
  try {
    const payloadEn = toEnglishPayload(req.body);
    if (!payloadEn.slug) return res.status(400).json({ error: 'Slug required' });

    const now = Date.now();
    if (payloadEn.published && !payloadEn.publishedAt) payloadEn.publishedAt = now;
    if (!payloadEn.createdAt) payloadEn.createdAt = now;

    const clean = stripUndefined(payloadEn);
    const ref = col().doc(clean.slug);
    await ref.set(clean, { merge: false });
    const doc = await ref.get();
    return res.json({ id: ref.id, ...doc.data() });
  } catch (err) { return next(err); }
}

export async function updateArticle(req, res, next) {
  try {
    const slug = req.params.slug;
    const payloadEn = toEnglishPayload(req.body);

    const now = Date.now();
    if (payloadEn.published && !payloadEn.publishedAt) payloadEn.publishedAt = now;
    payloadEn.updatedAt = now;

    const clean = stripUndefined(payloadEn);
    const ref = col().doc(slug);
    await ref.set(clean, { merge: true });
    const doc = await ref.get();
    return res.json({ id: ref.id, ...doc.data() });
  } catch (err) { return next(err); }
}

export async function deleteArticle(req, res, next) {
  try {
    const slug = req.params.slug;
    await col().doc(slug).delete();
    return res.json({ ok: true });
  } catch (err) { return next(err); }
}









