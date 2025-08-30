import { useEffect, useState, useMemo } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import HeroFeatured from "../components/HeroFeatured";
import NewsTicker from "../components/NewsTicker";
import ArticleCard from "../components/ArticleCard";
import HomeLeagueBlocks from "../components/HomeLeagueBlocks";
import Spinner from "../components/Spinner";
import EditorialBox from "../components/EditorialBox";
import { api } from "../api/client";

const pickItems = (data) => (Array.isArray(data) ? data : (data?.items || []));
const isRecent14d = (ts) => {
  const t = Number(ts || 0);
  if (!t) return false;
  return Date.now() - t <= 14 * 24 * 60 * 60 * 1000;
};
const scoreTime = (a) => Number(a.publishedAt || a.published_at || a.createdAt || 0);
const isCentral = (a) => !!(a.central ?? a.centrale);
const isFeatured = (a) => !!(a.featured ?? a.evidenza);
const hasTickerForce = (a) => !!(a.tickerForce ?? a.forzaTicker);

export default function Home(){
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [seedDone, setSeedDone] = useState(false);
  const [editorial, setEditorial] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        // Articoli
        const r = await api.get('/api/articles', { params: { published: 1, page: 1, pageSize: 60 } });
        const arr = pickItems(r.data);
        arr.sort((a,b) => scoreTime(b) - scoreTime(a));
        setItems(arr);

        // Editoriale: prendo alcuni e prendo il primo published lato client
        try {
          const er = await api.get('/api/editorials', { params: { page: 1, pageSize: 5 } });
          const eitems = pickItems(er.data);
          const sorted = [...eitems].sort((a,b) =>
            Number(b.publishedAt || b.createdAt || 0) - Number(a.publishedAt || a.createdAt || 0)
          );
          const firstPublished = sorted.find(x => !!x.published);
          setEditorial(firstPublished || null);
        } catch {
          setEditorial(null);
        }
      } catch (e) {
        console.error(e);
        setItems([]);
        setEditorial(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const { hero, cards, ticker } = useMemo(() => {
    if (!items.length) return { hero: null, cards: [], ticker: [] };
    const centralIdx = items.findIndex(isCentral);
    const heroArticle = centralIdx >= 0 ? items[centralIdx] : items[0];
    const rest = items.filter(x => (x.slug || x.id) !== (heroArticle.slug || heroArticle.id));
    const featured = rest.filter(isFeatured);
    const cards = [...featured];
    if (cards.length < 3) {
      const fillers = rest.filter(a => !isFeatured(a) && !isCentral(a));
      for (const f of fillers) {
        if (cards.length >= 3) break;
        cards.push(f);
      }
    }
    const ticker = rest
      .filter(a => !isCentral(a))
      .filter(a => hasTickerForce(a) || (!isFeatured(a) && isRecent14d(a.publishedAt || a.published_at || a.createdAt)));
    return { hero: heroArticle, cards: cards.slice(0, 3), ticker };
  }, [items]);

  async function seed() {
    try {
      await api.get('/api/_debug/seed-articles');
      setSeedDone(true);
      const r = await api.get('/api/articles', { params: { published: 1, page: 1, pageSize: 60 } });
      const arr = pickItems(r.data);
      arr.sort((a,b) => scoreTime(b) - scoreTime(a));
      setItems(arr);
    } catch (e) {
      alert('Impossibile creare i dati demo. Verifica ALLOW_DEBUG_SEED=1 nel backend.');
      console.error(e);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="container-gz py-6 space-y-6">
        {loading ? <Spinner/> : (
          <>
            {/* Ticker */}
            <div className="max-w-4xl mx-auto w-full">
              <NewsTicker items={ticker} />
            </div>

            {/* Hero */}
            {hero ? (
              <HeroFeatured a={hero} />
            ) : (
              <div className="card p-6 text-sm text-gray-600">
                Nessun articolo pubblicato. {import.meta.env.DEV && (
                  <button className="btn btn-primary ml-2" onClick={seed}>
                    Carica dati demo
                  </button>
                )}
                {seedDone && <span className="ml-2 text-green-700">Fatto!</span>}
              </div>
            )}

            {/* In evidenza */}
            <section className="pt-2">
              <h2 className="text-xl font-black mb-3">In evidenza</h2>
              {cards.length ? (
                <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
                  {cards.slice(0,3).map(a => (
                    <ArticleCard key={a.slug || a.id} a={a} />
                  ))}
                </div>
              ) : (
                <div className="card p-6 text-sm text-gray-600">Nessun articolo in evidenza.</div>
              )}
            </section>

            {/* Box Editoriale */}
            {editorial && (
              <EditorialBox
                title={editorial.title}
                subtitle={editorial.subtitle}
                excerpt={editorial.excerpt}
                href={`/editoriali/${encodeURIComponent(editorial.slug || editorial._id || editorial.id)}`}
                badge={editorial.badge || "Editoriale"}
                backgroundUrl={editorial.backgroundUrl || editorial.coverUrl || ""}
                author={{
                  name: editorial.author?.name || editorial.authorName || "Redazione",
                  avatarUrl: editorial.author?.avatarUrl || editorial.authorAvatar || ""
                }}
                publishedAt={editorial.publishedAt || editorial.createdAt}
                readingMinutes={editorial.readingMinutes || 3}
              />
            )}

            {/* Blocchi leghe */}
            <HomeLeagueBlocks />
          </>
        )}
      </main>
      <SiteFooter />
    </>
  );
}












