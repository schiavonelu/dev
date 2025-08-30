// src/pages/Article.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { api } from "../api/client";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Spinner from "../components/Spinner";
import Breadcrumbs from "../components/Breadcrumbs";
import {
  CalendarDays,
  Tag,
  ArrowLeft,
  Newspaper,
  Home,
  FileText,
  User,
  Clock,
  Share2,
  Copy
} from "lucide-react";

/* ========== Utils ========== */
function formatDate(ts){
  if (!ts) return "";
  try {
    return new Date(Number(ts)).toLocaleDateString("it-IT", { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return ""; }
}
function getInitials(name = "") {
  return name.split(" ").filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join("") || "A";
}
function stripHtml(html=""){
  return String(html).replace(/<[^>]*>/g, " ");
}
function estimateReadingTimeFromHtml(html = "") {
  const plain = stripHtml(html);
  const words = (plain.trim().match(/\S+/g) || []).length;
  const minutes = Math.max(1, Math.ceil(words / 200)); // 200 wpm
  return { minutes, words };
}

// Mappa colori per le categorie (con fallback)
const CATEGORY_COLORS = {
  "Fantacalcio": { bg: "#0ea5e9", text: "#ffffff" },   // sky-500
  "Consigli":    { bg: "#22c55e", text: "#052e16" },   // green-500
  "Mercato":     { bg: "#f59e0b", text: "#422006" },   // amber-500
  "Infortuni":   { bg: "#ef4444", text: "#450a0a" },   // red-500
  "Statistiche": { bg: "#8b5cf6", text: "#2e1065" },   // violet-500
  "Editoriale":  { bg: "#14b8a6", text: "#042f2e" },   // teal-500
};
function getCategoryStyle(category) {
  if (!category) return {};
  const c = CATEGORY_COLORS[category] || { bg: "#334155", text: "#e2e8f0" }; // slate-700
  return { backgroundColor: c.bg, color: c.text };
}

export default function Article(){
  const { slug } = useParams();
  const [art, setArt] = useState(null);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [progress, setProgress] = useState(0);
  const articleRef = useRef(null);

  // ===== Markdown/BBCode leggero -> HTML (se dal pannello non puoi formattare) =====
  const escapeHtml = (s = "") => s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  function lightMarkdownToHtml(src = ""){
    if (!src) return "";
    let text = src.replace(/\r\n/g, "\n");

    // separatore --- -> <hr>
    text = text.replace(/^\s*---\s*$/gm, "<hr />");
    // Titoli # ## ###
    text = text.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
    text = text.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
    text = text.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

    // Liste puntate (gruppi di righe che iniziano con - o *)
    text = text.replace(/(?:^(?:-|\*)\s+.+(?:\n|$))+?/gm, (block) => {
      const items = block
        .trim()
        .split(/\n/)
        .map(l => l.replace(/^(?:-|\*)\s+/, "").trim())
        .filter(Boolean)
        .map(li => `<li>${li}</li>`)
        .join("");
      return `<ul>${items}</ul>`;
    });

    // Inline: **bold**, *italic*, __bold__, _italic_ + BBCode [b][/b] [i][/i]
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
    text = text.replace(/__(.+?)__/g, "<strong>$1</strong>");
    text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
    text = text.replace(/_(.+?)_/g, "<em>$1</em>");
    text = text.replace(/\[b\](.+?)\[\/b\]/g, "<strong>$1</strong>");
    text = text.replace(/\[i\](.+?)\[\/i\]/g, "<em>$1</em>");

    // Link: [testo](http...)
    text = text.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, `<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>`);

    // Paragrafi (blocchi divisi da riga vuota)
    const blocks = text
      .split(/\n\n+/)
      .map(b => b.trim())
      .filter(Boolean)
      .map(b => /^(<h\d|<ul|<hr|<p|<blockquote|<img|<figure)/.test(b) ? b : `<p>${b}</p>`);

    return blocks.join("\n");
  }

  // Se il body è già HTML lo uso così com’è, altrimenti converto la sintassi leggera
  const bodyHtml = useMemo(() => {
    const raw = art?.body || "";
    if (!raw) return "";
    if (/<\w+[^>]*>/g.test(raw)) return raw; // contiene già tag HTML
    return lightMarkdownToHtml(escapeHtml(raw));
  }, [art?.body]);

  // Fetch
  useEffect(()=>{
    let on = true;
    setLoading(true);
    (async ()=>{
      try{
        const r = await api.get(`/api/articles/${encodeURIComponent(slug)}`);
        if(!on) return;
        setArt(r.data);
        setErr("");
      }catch(e){
        setArt(null);
        setErr(e?.response?.status === 404 ? "Articolo non trovato." : (e?.message || "Errore"));
      } finally {
        on && setLoading(false);
      }
    })();
    return ()=>{ on=false };
  }, [slug]);

  // Lettura stimata (sul risultato HTML finale)
  const reading = useMemo(
    () => estimateReadingTimeFromHtml(bodyHtml || ""),
    [bodyHtml]
  );

  const authorName = art?.author?.name || art?.authorName || "";
  const authorAvatar = art?.author?.avatarUrl || art?.authorAvatar || "";
  const showAuthor = Boolean(authorName || authorAvatar);

  const cover = art?.coverUrl || art?.cover || "";
  const category = art?.category || art?.categoria || "";

  // Progress bar lettura (sul contenuto dell'articolo)
  useEffect(() => {
    const el = articleRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const winH = window.innerHeight || document.documentElement.clientHeight;
      const total = el.scrollHeight - winH; // quanto c'è da scorrere
      const scrolled = Math.min(Math.max(-rect.top, 0), total);
      const pct = total > 0 ? Math.round((scrolled / total) * 100) : 0;
      setProgress(pct);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [loading]);

  // Share helpers
  const handleShare = async () => {
    try {
      const shareData = {
        title: art?.title || 'Articolo',
        text: art?.subtitle || art?.excerpt || '',
        url: window.location.href
      };
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }
    } catch {}
  };
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  return (
    <>
      <SiteHeader />

      {/* Barra di progresso di lettura */}
      <div className="h-1 w-full bg-gray-100 sticky top-0 z-30">
        <div
          className="h-1 bg-[var(--fc-primary)] transition-[width] duration-150"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="container-gz py-6">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { to: '/', label: 'Home', icon: <Home size={14}/> },
          { to: '/articoli', label: 'Articoli', icon: <Newspaper size={14}/> },
          { label: art?.title || 'Dettaglio', icon: <FileText size={14}/> }
        ]}/>

        <div className="mb-4">
          <Link to="/" className="inline-flex items-center gap-2 nav-link">
            <ArrowLeft size={16}/> Torna alla Home
          </Link>
        </div>

        {loading ? <Spinner/> : err ? (
          <div className="card p-6">
            <p className="text-sm text-red-600">{err}</p>
          </div>
        ) : art ? (
          <article ref={articleRef} className="card overflow-hidden">
            {/* Cover */}
            {cover ? (
              <div className="relative">
                <img
                  src={cover}
                  alt={art.title || "Cover"}
                  className="w-full h-72 sm:h-[28rem] object-cover"
                  loading="lazy"
                />
                {/* Overlay sfumatura & badge categoria */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
                <div className="absolute bottom-3 left-3 flex flex-wrap items-center gap-2">
                  {category ? (
                    <span
                      className="inline-flex items-center rounded-full px-3 py-1 font-medium shadow-sm backdrop-blur-sm"
                      style={getCategoryStyle(category)}
                    >
                      {category}
                    </span>
                  ) : null}
                </div>
              </div>
            ) : (
              <div
                className="relative w-full h-56 sm:h-72 flex items-center justify-center"
                style={{background:'linear-gradient(135deg, var(--fc-primary), var(--fc-accent))'}}
              >
                <img
                  src="/logo-carogna-league.svg"
                  alt="Carogna League"
                  className="h-16 sm:h-20 opacity-90"
                  loading="lazy"
                  onError={(e)=>{ e.currentTarget.style.display='none'; }}
                />
              </div>
            )}

            <div className="p-6 sm:p-8">
              {/* Meta top: data, lettura, tag */}
              <div className="flex flex-wrap items-center gap-3 text-sm mb-4">
                {art.publishedAt ? (
                  <span className="inline-flex items-center gap-1 text-gray-600">
                    <CalendarDays size={16}/> {formatDate(art.publishedAt)}
                  </span>
                ) : null}

                {reading?.minutes ? (
                  <span className="inline-flex items-center gap-1 text-gray-600">
                    <Clock size={16}/> {reading.minutes} min lettura
                  </span>
                ) : null}

                {(art.tags || []).length ? (
                  <span className="inline-flex items-center gap-1 text-gray-700">
                    <Tag size={14}/>
                    <span className="flex flex-wrap gap-1">
                      {art.tags.map((t) => (
                        <Link
                          to={`/tag/${encodeURIComponent(t)}`}
                          key={t}
                          className="rounded-full px-2.5 py-0.5 text-xs font-medium border hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2"
                          style={{ backgroundColor: "rgba(34,197,94,0.12)", color: "#14532d", borderColor: "rgba(34,197,94,0.35)" }}
                        >
                          {t}
                        </Link>
                      ))}
                    </span>
                  </span>
                ) : null}

                {/* Share azioni */}
                <div className="ml-auto flex items-center gap-2">
                  <button
                    onClick={handleShare}
                    className="btn btn-light !py-1 !px-2 text-sm inline-flex items-center gap-1"
                    title="Condividi"
                  >
                    <Share2 size={16}/> <span className="hidden sm:inline">Condividi</span>
                  </button>
                  <button
                    onClick={handleCopyLink}
                    className="btn btn-ghost !py-1 !px-2 text-sm inline-flex items-center gap-1"
                    title="Copia link"
                  >
                    <Copy size={16}/> <span className="hidden sm:inline">Copia link</span>
                  </button>
                  {copied && (
                    <span className="text-xs text-green-700">Copiato!</span>
                  )}
                </div>
              </div>

              {/* Titolo */}
              <h1 className="text-3xl sm:text-4xl font-black leading-tight mb-2 tracking-tight text-justify">
                {art.title || "Senza titolo"}
              </h1>

              {/* Sottotitolo */}
              {art.subtitle ? (
                <h2 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4">
                  {art.subtitle}
                </h2>
              ) : null}

              {/* Autore + meta */}
              {showAuthor ? (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-11 h-11 rounded-full overflow-hidden ring-2 ring-gray-200 flex items-center justify-center bg-gray-100">
                    {authorAvatar ? (
                      <img src={authorAvatar} alt={authorName || "Autore"} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <span className="text-sm font-bold text-gray-600">{getInitials(authorName || "Autore")}</span>
                    )}
                  </div>
                  <div className="leading-tight">
                    <div className="text-sm font-semibold flex items-center gap-1">
                      <User size={14}/>{authorName || "Redazione"}
                    </div>
                    <div className="text-xs text-gray-600">
                      {art.publishedAt ? `${formatDate(art.publishedAt)} · ` : ""}{reading.minutes} min lettura
                    </div>
                  </div>
                </div>
              ) : null}

              {/* Estratto */}
              {art.excerpt ? (
                <p className="text-[15px] text-gray-800 mb-6 bg-gray-50/70 border border-gray-200 rounded-xl p-4">
                  {art.excerpt}
                </p>
              ) : null}

              {/* Body (HTML o markdown convertito) */}
              <div
                className="prose max-w-none text-[15px] leading-7 prose-headings:mt-6 prose-headings:mb-3 prose-h2:text-2xl prose-h3:text-xl prose-p:my-3 prose-img:rounded-xl prose-img:shadow-sm prose-a:underline-offset-2 prose-a:decoration-[var(--fc-primary)] hover:prose-a:opacity-90 text-justify font-sans"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </div>
          </article>
        ) : null}
      </main>
      <SiteFooter />
    </>
  );
}







