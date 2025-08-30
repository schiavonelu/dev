import { useEffect, useMemo, useState } from "react";
import { api } from "../api/client";
import { Clock, Tag } from "lucide-react";
import Modal from "../components/Modal";

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

export default function ArticleForm({
  editingSlug = null,
  initialData = null,
  onCancel,
  onSaved,
}) {
  const [form, setForm] = useState(initialData || initArticle);
  const [saving, setSaving] = useState(false);
  const [preview, setPreview] = useState(true);
  const [err, setErr] = useState("");

  // Modal
  const [modal, setModal] = useState({ show: false, title: "", content: null, mode: "alert", onConfirm: null });
  const openAlert = (title, content) => setModal({ show: true, title, content, mode: "alert", onConfirm: null });
  const closeModal = () => setModal((m) => ({ ...m, show: false, onConfirm: null }));

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  useEffect(() => {
    setForm((f) => ({ ...f, durataLettura: calcolaDurataLettura(f.corpo) }));
  }, [form.corpo]);

  async function saveArticle(e) {
    e?.preventDefault?.();
    setSaving(true);
    setErr("");
    try {
      const payload = uiToApi(form);
      if (!payload.title?.trim()) throw new Error("Inserisci un titolo.");
      if (!payload.slug) payload.slug = autoSlug(payload.title);

      if (editingSlug && editingSlug !== payload.slug) {
        await api.post("/api/articles", payload);
        await api.delete(`/api/articles/${editingSlug}`);
      } else if (editingSlug) {
        await api.patch(`/api/articles/${editingSlug}`, payload);
      } else {
        await api.post("/api/articles", payload);
      }
      onSaved?.();
    } catch (e) {
      const msg = e?.response?.data?.error || e.message;
      setErr(msg);
      openAlert("Errore salvataggio", <div className="whitespace-pre-wrap">{msg}</div>);
    } finally {
      setSaving(false);
    }
  }

  const articlePreview = useMemo(
    () => (
      <article className="card p-4 space-y-2">
        <div className="text-xs text-gray-500">Anteprima</div>
        <h3 className="text-xl font-black">{form.titolo || "Titolo…"}</h3>
        {form.sottotitolo && <h4 className="text-md text-gray-700">{form.sottotitolo}</h4>}
        {form.cover ? <img src={form.cover} alt="cover" className="rounded-xl" /> : null}
        <p className="text-gray-600 italic">{form.estratto}</p>
        <div className="text-xs text-gray-600 flex items-center gap-2">
          <span className="inline-flex items-center gap-1"><Tag size={14}/>{form.categoria}</span>
          <span className="inline-flex items-center gap-1"><Clock size={14}/> ~{form.durataLettura} min</span>
        </div>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: form.corpo || "<p>Corpo (HTML)…</p>" }} />
        <div className="text-xs text-gray-500">Autore: {form.autore || "—"}</div>
      </article>
    ),
    [form]
  );

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{editingSlug ? "Modifica Articolo" : "Inserimento Articolo"}</h1>
        <div className="flex gap-2">
          <button className="btn" onClick={onCancel}>Annulla</button>
          <button className="btn btn-primary" onClick={() => setPreview((p) => !p)}>{preview ? "Nascondi" : "Mostra"} Anteprima</button>
          <button className="btn btn-primary" onClick={saveArticle} disabled={saving}>
            {saving ? "Salvataggio…" : editingSlug ? "Salva Modifiche" : "Salva Articolo"}
          </button>
        </div>
      </div>

      {err && <p className="text-sm text-red-600 whitespace-pre-wrap">{err}</p>}

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={saveArticle} className="card p-4 space-y-3">
          <input className="input" placeholder="Titolo" value={form.titolo} onChange={(e) => setForm((f) => ({ ...f, titolo: e.target.value }))} />
          <input className="input" placeholder="Sottotitolo" value={form.sottotitolo} onChange={(e) => setForm((f) => ({ ...f, sottotitolo: e.target.value }))} />
          <input className="input" placeholder="Autore" value={form.autore} onChange={(e) => setForm((f) => ({ ...f, autore: e.target.value }))} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Categoria</label>
              <select className="input mt-1" value={form.categoria} onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="flex items-end gap-4">
              <label className="text-sm flex items-center gap-2">
                <input type="checkbox" checked={form.centrale} onChange={(e) => setForm((f) => ({ ...f, centrale: e.target.checked }))} />
                Centrale (hero)
              </label>
              <label className="text-sm flex items-center gap-2">
                <input type="checkbox" checked={form.evidenza} onChange={(e) => setForm((f) => ({ ...f, evidenza: e.target.checked }))} />
                In evidenza (card)
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input className="input" placeholder="Slug (auto se vuoto)" value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} />
            <input className="input" placeholder="URL Immagine di Copertina" value={form.cover} onChange={(e) => setForm((f) => ({ ...f, cover: e.target.value }))} />
          </div>

          <textarea className="textarea" rows={2} placeholder="Estratto" value={form.estratto} onChange={(e) => setForm((f) => ({ ...f, estratto: e.target.value }))} />

          <div>
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Corpo (HTML semplice)</label>
              <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                <Clock size={14}/> ~{form.durataLettura} min lettura
              </span>
            </div>
            <textarea className="textarea mt-1" rows={8} placeholder="<p>Contenuto…</p>"
              value={form.corpo} onChange={(e) => setForm((f) => ({ ...f, corpo: e.target.value }))} />
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <label className="text-sm flex items-center gap-2">
              <input type="checkbox" checked={form.pubblicato} onChange={(e) => setForm((f) => ({ ...f, pubblicato: e.target.checked }))} /> Pubblicato
            </label>
            <label className="text-sm flex items-center gap-2">
              <input type="checkbox" checked={form.tickerForce} onChange={(e) => setForm((f) => ({ ...f, tickerForce: e.target.checked }))} /> Mostra nel ticker (forzato)
            </label>
          </div>
        </form>

        <div className={`space-y-3 ${preview ? "" : "hidden lg:block"}`}>{articlePreview}</div>
      </div>

      <Modal
        show={modal.show}
        onClose={closeModal}
        title={modal.title}
        mode={modal.mode}
        onConfirm={modal.onConfirm}
      >
        {modal.content}
      </Modal>
    </>
  );
}

export { initArticle, apiToUi };


