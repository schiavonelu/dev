import { useEffect, useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api/client";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Spinner from "../components/Spinner";
import EditorialBox from "../components/EditorialBox";
import Breadcrumbs from "../components/Breadcrumbs";
import { Home, Newspaper, FileText } from "lucide-react";

function formatDate(ts) {
  if (!ts) return "";
  try {
    return new Date(Number(ts)).toLocaleDateString("it-IT", { day: "2-digit", month: "2-digit", year: "numeric" });
  } catch { return ""; }
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

  return (
    <>
      <SiteHeader />
      <main key={idOrSlug} className="container-gz py-6 space-y-6">
        {/* ✅ Breadcrumb uniforme (come Storia) */}
        <Breadcrumbs items={[
          { to: "/", label: "Home", icon: <Home size={14}/> },
          { to: "/editoriali", label: "Editoriali", icon: <Newspaper size={14}/> }, // se non hai la lista, togli 'to'
          { label: item?.title || "Editoriale", icon: <FileText size={14}/> }
        ]}/>

        {loading ? (
          <Spinner />
        ) : err ? (
          <div className="card p-6 text-sm text-red-600">{err}</div>
        ) : item ? (
          <>
            {/* ❌ niente bottone "Leggi l'editoriale" qui */}
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
              showCTA={false} // ⬅️ nasconde il pulsante
            />

            {/* ✅ solo contenuto: niente meta duplicata qui sotto */}
            <article id="contenuto" className="card p-6 sm:p-8">
              <div
                className="prose max-w-none prose-p:my-3 prose-h2:mt-6 prose-h2:mb-3 whitespace-pre-wrap"
                dangerouslySetInnerHTML={{ __html: item.body || "" }}
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




