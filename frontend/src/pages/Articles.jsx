import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../api/client";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import FiltersSidebar from "../components/FiltersSidebar";
import Pagination from "../components/Pagination";
import ArticleCard from "../components/ArticleCard";
import Spinner from "../components/Spinner";
import Breadcrumbs from "../components/Breadcrumbs";
import { Search, SlidersHorizontal, X, Newspaper, Home } from "lucide-react";

export default function Articles(){
  const [sp, setSp] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [openFilters, setOpenFilters] = useState(false);

  const qInit = sp.get('q') || '';
  const tagInit = sp.get('tag') || '';
  const catInit = sp.get('cat') || '';
  const pageInit = parseInt(sp.get('page') || '1', 10);
  const publishedInit = sp.get('pub') !== '0';
  const psInit = parseInt(sp.get('ps') || '9', 10);
  const pageSizeInit = [6,9].includes(psInit) ? psInit : 9;

  const [q, setQ] = useState(qInit);
  const [debouncedQ, setDebouncedQ] = useState(qInit);
  const [tag, setTag] = useState(tagInit);
  const [category, setCategory] = useState(catInit);
  const [publishedOnly, setPublishedOnly] = useState(publishedInit);
  const [page, setPage] = useState(isNaN(pageInit) ? 1 : pageInit);
  const [pageSize, setPageSize] = useState(pageSizeInit);

  const [items, setItems] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // sync URL
  useEffect(()=>{
    const params = new URLSearchParams();
    if (debouncedQ) params.set('q', debouncedQ);
    if (tag) params.set('tag', tag);
    if (category) params.set('cat', category);
    if (!publishedOnly) params.set('pub', '0');
    if (page > 1) params.set('page', String(page));
    if (pageSize !== 9) params.set('ps', String(pageSize));
    setSp(params, { replace: true });
    // eslint-disable-next-line
  }, [debouncedQ, tag, category, publishedOnly, page, pageSize]);

  // debounce search
  useEffect(()=>{
    const t = setTimeout(()=> setDebouncedQ(q), 250);
    return ()=> clearTimeout(t);
  }, [q]);

  // fetch
  useEffect(()=>{
    let on = true;
    setLoading(true);
    (async ()=>{
      try{
        const r = await api.get('/api/articles', {
          params: {
            q: debouncedQ || undefined,
            tag: tag || undefined,
            category: category || undefined,
            published: publishedOnly ? 1 : undefined,
            page,
            pageSize
          }
        });
        if(!on) return;
        const data = r.data;
        if (Array.isArray(data)) {
          setItems(data);
          setAvailableTags([]);
          setAvailableCategories([]);
          setTotal(data.length);
          setTotalPages(1);
        } else {
          setItems(data.items || []);
          setAvailableTags(Array.isArray(data.availableTags) ? data.availableTags : []);
          setAvailableCategories(Array.isArray(data.availableCategories) ? data.availableCategories : []);
          setTotal(data.total || 0);
          setTotalPages(data.totalPages || 1);
        }
      } catch (e) {
        console.error('Errore caricamento articoli:', e);
        if (on) {
          setItems([]); setAvailableTags([]); setAvailableCategories([]); setTotal(0); setTotalPages(1);
        }
      } finally {
        on && setLoading(false);
      }
    })();
    return ()=>{ on=false };
  }, [debouncedQ, tag, category, publishedOnly, page, pageSize]);

  function clearFilters(){
    setQ(''); setTag(''); setCategory(''); setPublishedOnly(true); setPage(1);
  }

  // reset pagina quando cambiano filtri/ricerca/pageSize
  useEffect(()=>{ setPage(1); }, [debouncedQ, tag, category, publishedOnly, pageSize]);

  const grid = useMemo(()=>(
    loading ? <Spinner/> : (
      items.length ? (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3">
          {items.map(a => <ArticleCard key={a.slug || a.id} a={a} />)}
        </div>
      ) : (
        <div className="card p-6">
          <div className="text-sm text-gray-600">Nessun articolo trovato.</div>
        </div>
      )
    )
  ), [loading, items]);

  return (
    <>
      <SiteHeader />
      <main className="container-gz py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs items={[
          { to: '/', label: 'Home', icon: <Home size={14}/> },
          { label: 'Articoli', icon: <Newspaper size={14}/> }
        ]}/>

        <div className="flex items-center justify-between gap-3 mb-4">
          <h1 className="text-2xl font-black">Articoli</h1>
          <div className="flex items-center gap-2">
            {/* page size switch 6/9 */}
            <div className="hidden md:flex items-center gap-1 text-sm">
              <span className="text-gray-600">Mostra</span>
              {[6,9].map(n=>(
                <button
                  key={n}
                  onClick={()=>setPageSize(n)}
                  className={`px-2 py-1 rounded-md font-semibold transition ${
                    pageSize===n ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  style={pageSize===n ? { background:'var(--fc-primary)'} : {}}
                >{n}</button>
              ))}
              <span className="text-gray-600">/ pagina</span>
            </div>
            <div className="lg:hidden">
              <button className="btn btn-outline flex items-center gap-2" onClick={()=>setOpenFilters(true)}>
                <SlidersHorizontal size={16}/> Filtri
              </button>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-[18rem_1fr] gap-6">
          {/* Sidebar filtri */}
          <FiltersSidebar
            openMobile={openFilters}
            onCloseMobile={()=>setOpenFilters(false)}
            availableTags={availableTags}
            availableCategories={availableCategories}
            selectedTag={tag}
            setSelectedTag={setTag}
            selectedCategory={category}
            setSelectedCategory={setCategory}
            publishedOnly={publishedOnly}
            setPublishedOnly={setPublishedOnly}
            onClear={clearFilters}
          />

          {/* Colonna destra: ricerca + griglia + paginazione */}
          <section>
            {/* barra di ricerca: lente + clear */}
            <div className="card p-3 mb-4">
              <div className="relative">
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Search size={18}/>
                </span>
                <input
                  className="input pl-10 pr-9"
                  placeholder="Cerca per titolo o testo…"
                  value={q}
                  onChange={(e)=>setQ(e.target.value)}
                />
                {q && (
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-800"
                    aria-label="Pulisci ricerca"
                    onClick={()=>setQ('')}
                  >
                    <X size={16}/>
                  </button>
                )}
              </div>
              {/* page size in mobile */}
              <div className="mt-3 md:hidden flex items-center gap-2 text-sm">
                <span className="text-gray-600">Mostra</span>
                {[6,9].map(n=>(
                  <button
                    key={n}
                    onClick={()=>setPageSize(n)}
                    className={`px-2 py-1 rounded-md font-semibold transition ${
                      pageSize===n ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    style={pageSize===n ? { background:'var(--fc-primary)'} : {}}
                  >{n}</button>
                ))}
                <span className="text-gray-600">/ pagina</span>
              </div>
            </div>

            {grid}

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
              total={total}
              pageSize={pageSize}
            />
          </section>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
