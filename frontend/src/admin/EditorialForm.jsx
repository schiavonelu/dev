import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Clock } from "lucide-react";
import Modal from "../components/Modal";

const init = {
  title: "", subtitle: "", excerpt: "", body: "",
  slug: "", badge: "Editoriale",
  backgroundUrl: "", coverUrl: "",
  author: { name: "Redazione", avatarUrl: "" },
  readingMinutes: 3,
  published: false, publishedAt: null,
};

const autoSlug = (s="") =>
  s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-z0-9]+/g,"-").replace(/(^-|-$)/g,"");

// Converter per l’anteprima nel form (Markdown/BBCode -> HTML)
const escapeHtml = (s="") =>
  s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

function lightMarkdownToHtml(src=""){
  if(!src) return "";
  let t = String(src).replace(/\r\n/g,"\n");

  // --- separatore
  t = t.replace(/^\s*---\s*$/gm,"<hr />");

  // --- titoli
  t = t.replace(/^###\s+(.+)$/gm,"<h3>$1</h3>");
  t = t.replace(/^##\s+(.+)$/gm,"<h2>$1</h2>");
  t = t.replace(/^#\s+(.+)$/gm,"<h1>$1</h1>");

  // --- liste puntate
  t = t.replace(/(?:^(?:-|\*)\s+.+(?:\n|$))+?/gm,(b)=>`<ul>${
    b.trim().split(/\n/).map(l=>l.replace(/^(?:-|\*)\s+/,"").trim()).filter(Boolean).map(li=>`<li>${li}</li>`).join("")
  }</ul>`);

  // --- inline bold/italic + BBCode
  t = t.replace(/\*\*(.+?)\*\*/g,"<strong>$1</strong>")
       .replace(/__(.+?)__/g,"<strong>$1</strong>")
       .replace(/\*(.+?)\*/g,"<em>$1</em>")
       .replace(/_(.+?)_/g,"<em>$1</em>")
       .replace(/\[b\](.+?)\[\/b\]/g,"<strong>$1</strong>")
       .replace(/\[i\](.+?)\[\/i\]/g,"<em>$1</em>");

  // --- link
  t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    `<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>`);

  // --- paragrafi
  const blocks = t.split(/\n\n+/).map(b=>b.trim()).filter(Boolean)
    .map(b=>/^(<h\d|<ul|<hr|<p|<blockquote|<img|<figure)/.test(b)?b:`<p>${b}</p>`);

  return blocks.join("\n");
}

export default function EditorialForm({ editing, onCancel, onSaved }) {
  const [form, setForm] = useState(init);
  const [saving, setSaving] = useState(false);

  // Modal
  const [modal, setModal] = useState({ show: false, title: "", content: null, mode: "alert", onConfirm: null });
  const openAlert = (title, content) => setModal({ show: true, title, content, mode: "alert", onConfirm: null });
  const closeModal = () => setModal((m) => ({ ...m, show: false, onConfirm: null }));

  useEffect(() => { setForm(editing ? { ...init, ...editing } : init); }, [editing]);

  function onChange(e){
    const { name, value, type, checked } = e.target;
    if (name.startsWith("author.")) {
      const k = name.split(".")[1];
      setForm(s => ({ ...s, author: { ...s.author, [k]: value }}));
    } else {
      setForm(s => ({ ...s, [name]: type === "checkbox" ? checked : value }));
    }
  }

  function calcReading(html=""){
    const plain = String(html).replace(/<[^>]*>/g, " ");
    const words = (plain.trim().match(/\S+/g) || []).length;
    return Math.max(1, Math.ceil(words / 200));
  }

  async function onSubmit(e){
    e.preventDefault();
    setSaving(true);
    try{
      const payload = { ...form };
      if (!payload.title?.trim()) throw new Error("Inserisci un titolo.");
      if (!payload.slug) payload.slug = autoSlug(payload.title);
      payload.readingMinutes = calcReading(payload.body);
      if (payload.published && !payload.publishedAt) payload.publishedAt = Date.now();

      if (editing?.id || editing?._id || editing?.slug) {
        const key = encodeURIComponent(editing.slug || editing.id || editing._id);
        await api.put(`/api/editorials/${key}`, payload);
      } else {
        await api.post(`/api/editorials`, payload);
      }
      onSaved?.();
    } catch (e) {
      openAlert("Errore salvataggio", e?.response?.data?.error || e.message);
    } finally { setSaving(false); }
  }

  // HTML per anteprima (senza toccare cosa salvi: il DB conserva il body com’è)
  const previewBodyHtml = (/<\w+[^>]*>/.test(form.body)
    ? form.body
    : lightMarkdownToHtml(escapeHtml(form.body || "")));

  const previewExcerptHtml = (/<\w+[^>]*>/.test(form.excerpt)
    ? form.excerpt
    : lightMarkdownToHtml(escapeHtml(form.excerpt || "")));

  return (
    <>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">{editing ? "Modifica Editoriale" : "Nuovo Editoriale"}</h1>
          <div className="flex gap-2">
            <button className="btn" onClick={onCancel}>Annulla</button>
            <button className="btn btn-primary" onClick={onSubmit} disabled={saving}>
              {saving ? "Salvataggio…" : "Salva"}
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="grid lg:grid-cols-2 gap-6">
          <div className="card p-4 space-y-3">
            <input className="input" name="title" placeholder="Titolo" value={form.title} onChange={onChange} />
            <input className="input" name="subtitle" placeholder="Sottotitolo" value={form.subtitle} onChange={onChange} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="input" name="slug" placeholder="Slug (auto se vuoto)" value={form.slug || ""} onChange={onChange} />
              <input className="input" name="badge" placeholder="Badge" value={form.badge} onChange={onChange} />
            </div>

            <input className="input" name="backgroundUrl" placeholder="Background URL (immagine consigliata larga)" value={form.backgroundUrl} onChange={onChange} />
            <input className="input" name="coverUrl" placeholder="Cover URL (fallback)" value={form.coverUrl} onChange={onChange} />

            <textarea className="textarea" rows={3} name="excerpt" placeholder="Estratto" value={form.excerpt} onChange={onChange} />

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-sm font-medium text-gray-700">Body (HTML o Markdown leggero)</label>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={14}/>{' '}~{calcReading(form.body)} min lettura
                </span>
              </div>
              <textarea className="textarea mt-1" rows={10} name="body" placeholder="<p>Contenuto…</p>" value={form.body} onChange={onChange} />
              <div className="prose max-w-none mt-2 p-3 bg-gray-50 border rounded-lg"
                   dangerouslySetInnerHTML={{ __html: previewBodyHtml || "<p class='text-gray-500'>Anteprima…</p>" }} />
            </div>

            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" checked={!!form.published} onChange={onChange} />
              Pubblicato
            </label>
          </div>

          <div className="card p-4 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="input" name="author.name" placeholder="Autore" value={form.author?.name || ""} onChange={onChange} />
              <input className="input" name="author.avatarUrl" placeholder="Avatar URL" value={form.author?.avatarUrl || ""} onChange={onChange} />
            </div>

            {/* Anteprima minimale */}
            <div className="border rounded-xl overflow-hidden">
              <div className="relative h-40 bg-gray-100">
                {form.backgroundUrl ? (
                  <img src={form.backgroundUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full" style={{background:'linear-gradient(135deg, var(--fc-primary), var(--fc-accent))'}} />
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
                <div className="absolute inset-0 p-4 text-white">
                  <div className="text-[11px] font-semibold opacity-90">{form.badge || "Editoriale"}</div>
                  <div className="font-black text-lg leading-tight line-clamp-2">{form.title || "Titolo…"}</div>
                  <div className="text-white/90 text-sm line-clamp-1">{form.subtitle}</div>
                </div>
              </div>
              <div className="p-3 text-sm">
                <div className="text-gray-600 line-clamp-2"
                     dangerouslySetInnerHTML={{ __html: previewExcerptHtml }} />
              </div>
            </div>
          </div>
        </form>
      </section>

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



