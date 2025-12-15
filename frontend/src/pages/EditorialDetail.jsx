import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Spinner from "../components/Spinner";
import EditorialBox from "../components/EditorialBox";
import Breadcrumbs from "../components/Breadcrumbs";
import { Home, Newspaper, FileText } from "lucide-react";

// --- Markdown/BBCode leggero -> HTML (come Article.jsx) ---
const escapeHtml = (s = "") =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function lightMarkdownToHtml(src = "") {
  if (!src) return "";
  let text = String(src).replace(/\r\n/g, "\n");

  // separatore
  text = text.replace(/^\s*---\s*$/gm, "<hr />");

  // titoli
  text = text.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  text = text.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  text = text.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // liste puntate
  text = text.replace(/(?:^(?:-|\*)\s+.+(?:\n|$))+?/gm, (block) => {
    const items = block
      .trim()
      .split(/\n/)
      .map((l) => l.replace(/^(?:-|\*)\s+/, "").trim())
      .filter(Boolean)
      .map((li) => `<li>${li}</li>`)
      .join("");
    return `<ul>${items}</ul>`;
  });

  // inline bold/italic + BBCode
  text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
  text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
  text = text.replace(/_(.+?)_/g, "<em>$1</em>");
  text = text.replace(/\[b\](.+?)\[\/b\]/g, "<strong>$1</strong>");
  text = text.replace(/\[i\](.+?)\[\/i\]/g, "<em>$1</em>");

  // link
  text = text.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
    `<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>`
  );

  // paragrafi
  const blocks = text
    .split(/\n\n+/)
    .map((b) => b.trim())
    .filter(Boolean)
    .map((b) =>
      /^(<h\d|<ul|<hr|<p|<blockquote|<img|<figure)/.test(b) ? b : `<p>${b}</p>`
    );

  return blocks.join("\n");
}

export default function EditorialDetail() {
  const { idOrSlug } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let on = true;
    (async () => {
      setLoading(true);
      try {
        const r = await api.get(`/api/editorials/${encodeURIComponent(idOrSlug)}`);
        if (!on) return;
        setItem(r.data);
        setErr("");
      } catch (e) {
        if (!on) return;
        setItem(null);
        setErr(e?.response?.status === 404 ? "Editoriale non trovato." : (e?.message || "Errore"));
      } finally {
        on && setLoading(false);
      }
    })();
    return () => { on = false; };
  }, [idOrSlug]);

  const readingMinutes = useMemo(() => {
    if (item?.readingMinutes) return item.readingMinutes;
    const plain = String(item?.body || "").replace(/<[^>]*>/g, " ");
    const words = (plain.trim().match(/\S+/g) || []).length;
    return Math.max(1, Math.ceil(words / 200));
  }, [item?.body, item?.readingMinutes]);

  // Body convertito: se è già HTML lo usa, altrimenti converte markdown/BBCode
  const bodyHtml = useMemo(() => {
    const raw = item?.body || "";
    if (!raw) return "";
    if (/<\w+[^>]*>/.test(raw)) return raw; // già HTML
    return lightMarkdownToHtml(escapeHtml(raw));
  }, [item?.body]);

  return (
    <>
      <SiteHeader />
      <main key={idOrSlug} className="container-gz py-6 space-y-6">
        <Breadcrumbs items={[
          { to: "/", label: "Home", icon: <Home size={14}/> },
          { to: "/editoriali", label: "Editoriali", icon: <Newspaper size={14}/> },
          { label: item?.title || "Editoriale", icon: <FileText size={14}/> }
        ]}/>

        {loading ? (
          <Spinner />
        ) : err ? (
          <div className="card p-6 text-sm text-red-600">{err}</div>
        ) : item ? (
          <>
            <EditorialBox
              title={item.title}
              subtitle={item.subtitle}
              excerpt={item.excerpt}
              href="#"
              badge={item.badge || "Editoriale"}
              backgroundUrl={item.backgroundUrl || item.coverUrl || ""}
              author={{ name: item.author?.name || "Redazione", avatarUrl: item.author?.avatarUrl || "" }}
              publishedAt={item.publishedAt || item.createdAt}
              readingMinutes={readingMinutes}
              showCTA={false}
            />

            <article id="contenuto" className="card p-6 sm:p-8 text-justify">
              <div
                className="prose max-w-none prose-p:my-3 prose-h2:mt-6 prose-h2:mb-3 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </article>
          </>
        ) : (
          <div className="card p-6 text-sm text-gray-600">Nessun contenuto da mostrare.</div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}





