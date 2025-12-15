import Article from '../models/Article.js';

const ALLOWED_PAGE_SIZES = [6, 9, 12];
const DEF_PAGE_SIZE = 9;
const clampPageSize = (n) => (ALLOWED_PAGE_SIZES.includes(n) ? n : DEF_PAGE_SIZE);
const norm = (s = '') => String(s).toLowerCase();

const normalizeSlug = (slug) =>
  String(slug || '')
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

const sanitizePayload = (payload = {}) => {
  const p = { ...payload };
  const base = {
    slug:        p.slug ?? p.Slug,
    title:       p.title ?? p.titolo,
    subtitle:    p.subtitle ?? p.sottotitolo,
    author:      p.author ?? p.autore,
    cover:       p.cover ?? p.coverUrl,
    excerpt:     p.excerpt ?? p.estratto,
    body:        p.body ?? p.corpo,
    category:    p.category ?? p.categoria,
    published:   (p.published ?? p.pubblicato) ? true : false,
    featured:    (p.featured  ?? p.evidenza)   ? true : false,
    readMinutes: p.readMinutes ?? p.durataLettura,
    tags:        p.tags ?? [],
    tickerForce: (p.tickerForce ?? p.forzaTicker) ? true : false,
  };

  if (typeof base.slug === 'string') base.slug = normalizeSlug(base.slug);
  return base;
};

export async function listArticles(req, res, next) {
  try {
    const { published, q, tag, category } = req.query;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const pageSize = clampPageSize(parseInt(req.query.pageSize, 10) || DEF_PAGE_SIZE);

    const criteria = {};
    if (published === '1') criteria.published = true;

    let rows = await Article.find(criteria).lean();

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
    const doc = await Article.findOne({ slug: req.params.slug }).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(doc);
  } catch (err) { return next(err); }
}

export async function createArticle(req, res, next) {
  try {
    const payload = sanitizePayload(req.body);
    if (!payload.slug) return res.status(400).json({ error: 'Slug required' });

    const now = Date.now();
    if (payload.published && !payload.publishedAt) payload.publishedAt = now;
    if (!payload.createdAt) payload.createdAt = now;

    const doc = await Article.create(payload);
    return res.json(doc);
  } catch (err) { return next(err); }
}

export async function updateArticle(req, res, next) {
  try {
    const slug = req.params.slug;
    const payload = sanitizePayload(req.body);

    const now = Date.now();
    if (payload.published && !payload.publishedAt) payload.publishedAt = now;
    payload.updatedAt = now;

    const doc = await Article.findOneAndUpdate(
      { slug },
      payload,
      { new: true, upsert: false }
    ).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    return res.json(doc);
  } catch (err) { return next(err); }
}

export async function deleteArticle(req, res, next) {
  try {
    const slug = req.params.slug;
    await Article.deleteOne({ slug });
    return res.json({ ok: true });
  } catch (err) { return next(err); }
}









