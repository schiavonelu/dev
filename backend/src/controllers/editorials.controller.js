// backend/controllers/editorials.controller.js
import { firestore as db } from "../../src/utils/firebase.js"; // ⬅️ adatta il path se serve

const nowMs = () => Date.now();
const toNumber = (v, d = 0) => (isNaN(parseInt(v, 10)) ? d : parseInt(v, 10));
const slugify = (s = "") =>
  s.toString().toLowerCase()
    .normalize("NFKD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "")
    .slice(0, 120);

const COL = "editorials";

export async function list(req, res) {
  try {
    const page = Math.max(1, toNumber(req.query.page, 1));
    const pageSize = Math.min(100, Math.max(1, toNumber(req.query.pageSize, 20)));
    const publishedOnly = !!req.query.published;

    let q = db.collection(COL);
    if (publishedOnly) q = q.where("published", "==", true);
    q = q.orderBy("publishedAt", "desc");

    const snap = await q.offset((page - 1) * pageSize).limit(pageSize).get();
    const items = snap.docs.map(d => ({ id: d.id, _id: d.id, ...d.data() }));

    let total = items.length;
    try {
      const { getCountFromServer } = await import("firebase-admin/firestore");
      const ct = await getCountFromServer(
        publishedOnly ? db.collection(COL).where("published","==",true) : db.collection(COL)
      );
      total = ct.data().count;
    } catch {}

    res.json({ items, total, page, pageSize });
  } catch (e) {
    console.error("[editorials.list]", e);
    res.status(500).json({ error: "INTERNAL_ERROR", detail: e.message });
  }
}

export async function getByIdOrSlug(req, res) {
  try {
    const { idOrSlug } = req.params;
    const byId = await db.collection(COL).doc(idOrSlug).get();
    if (byId.exists) return res.json({ id: byId.id, _id: byId.id, ...byId.data() });

    const qs = await db.collection(COL).where("slug", "==", idOrSlug).limit(1).get();
    if (!qs.empty) {
      const d = qs.docs[0];
      return res.json({ id: d.id, _id: d.id, ...d.data() });
    }
    return res.status(404).json({ error: "NOT_FOUND" });
  } catch (e) {
    console.error("[editorials.get]", e);
    res.status(500).json({ error: "INTERNAL_ERROR", detail: e.message });
  }
}

export async function create(req, res) {
  try {
    const p = req.body || {};
    let data = {
      title: p.title?.trim(),
      subtitle: p.subtitle || "",
      excerpt: p.excerpt || "",
      body: p.body || "",
      slug: p.slug ? slugify(p.slug) : slugify(p.title || ""),
      badge: p.badge || "Editoriale",
      backgroundUrl: p.backgroundUrl || p.coverUrl || "",
      coverUrl: p.coverUrl || "",
      author: {
        name: p.author?.name || p.authorName || "Redazione",
        avatarUrl: p.author?.avatarUrl || p.authorAvatar || "",
      },
      readingMinutes: p.readingMinutes ? Number(p.readingMinutes) : 3,
      published: !!p.published,
      publishedAt: p.published ? (p.publishedAt || nowMs()) : null,
      createdAt: nowMs(),
      updatedAt: nowMs(),
    };
    if (!data.title) return res.status(400).json({ error: "TITLE_REQUIRED" });

    if (data.slug) {
      const exists = await db.collection(COL).where("slug","==",data.slug).limit(1).get();
      if (!exists.empty) data.slug = `${data.slug}-${Math.random().toString(36).slice(2,6)}`;
    }

    const ref = await db.collection(COL).add(data);
    const doc = await ref.get();
    res.status(201).json({ id: ref.id, _id: ref.id, ...doc.data() });
  } catch (e) {
    console.error("[editorials.create]", e);
    res.status(500).json({ error: "INTERNAL_ERROR", detail: e.message });
  }
}

export async function update(req, res) {
  try {
    const { idOrSlug } = req.params;
    let ref = db.collection(COL).doc(idOrSlug);
    let doc = await ref.get();
    if (!doc.exists) {
      const qs = await db.collection(COL).where("slug","==",idOrSlug).limit(1).get();
      if (qs.empty) return res.status(404).json({ error: "NOT_FOUND" });
      ref = qs.docs[0].ref;
      doc = await ref.get();
    }

    const prev = doc.data() || {};
    const p = req.body || {};
    const next = {
      ...prev,
      ...p,
      slug: p.slug ? slugify(p.slug) : (prev.slug || slugify(p.title || prev.title || "")),
      author: {
        name: p.author?.name ?? prev.author?.name ?? "Redazione",
        avatarUrl: p.author?.avatarUrl ?? prev.author?.avatarUrl ?? "",
      },
      updatedAt: nowMs(),
    };
    if (next.published && !next.publishedAt) next.publishedAt = nowMs();
    if (!next.published) next.publishedAt = null;

    await ref.set(next, { merge: true });
    const fresh = await ref.get();
    res.json({ id: fresh.id, _id: fresh.id, ...fresh.data() });
  } catch (e) {
    console.error("[editorials.update]", e);
    res.status(500).json({ error: "INTERNAL_ERROR", detail: e.message });
  }
}

export async function remove(req, res) {
  try {
    const { idOrSlug } = req.params;
    let ref = db.collection(COL).doc(idOrSlug);
    let doc = await ref.get();
    if (!doc.exists) {
      const qs = await db.collection(COL).where("slug","==",idOrSlug).limit(1).get();
      if (qs.empty) return res.status(404).json({ error: "NOT_FOUND" });
      ref = qs.docs[0].ref;
    }
    await ref.delete();
    res.json({ ok: true });
  } catch (e) {
    console.error("[editorials.remove]", e);
    res.status(500).json({ error: "INTERNAL_ERROR", detail: e.message });
  }
}

