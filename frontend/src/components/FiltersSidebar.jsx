// src/components/FiltersSidebar.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { X, Filter, ChevronDown, Check, Layers, Tag as TagIcon } from "lucide-react";

export default function FiltersSidebar({
  openMobile = false,
  onCloseMobile = () => {},
  availableTags = [],
  availableCategories = [],
  selectedTag = "",
  setSelectedTag = () => {},
  selectedCategory = "",
  setSelectedCategory = () => {},
  publishedOnly = true,
  setPublishedOnly = () => {},
  onClear = () => {},
}) {
  /* ---------- Categoria: dropdown "headless" con ricerca ---------- */
  const [catOpen, setCatOpen] = useState(false);
  const [catQuery, setCatQuery] = useState("");
  const catBtnRef = useRef(null);
  const catListRef = useRef(null);

  // Reset filtro testuale ogni volta che riapri il menu (FIX visibilità)
  useEffect(() => {
    if (catOpen) setCatQuery("");
  }, [catOpen]);

  // Chiudi se clicchi fuori
  useEffect(() => {
    function onDocClick(e) {
      if (!catOpen) return;
      const btn = catBtnRef.current;
      const list = catListRef.current;
      if (btn && btn.contains(e.target)) return;
      if (list && list.contains(e.target)) return;
      setCatOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [catOpen]);

  // Chiudi con ESC
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") setCatOpen(false);
    }
    if (catOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [catOpen]);

  // Categorie uniche + ordinate
  const categories = useMemo(() => {
    const fallback = ["Notizie", "Articoli", "News Fantacalcio", "Regolamento"];
    const src = (availableCategories?.length ? availableCategories : fallback).filter(Boolean);
    return Array.from(new Set(src)).sort((a, b) => a.localeCompare(b, "it"));
  }, [availableCategories]);

  const filteredCategories = useMemo(() => {
    const q = catQuery.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.toLowerCase().includes(q));
  }, [categories, catQuery]);

  const topCatPills = useMemo(() => categories.slice(0, 6), [categories]);

  /* ---------- Tags come badge ---------- */
  const tags = useMemo(() => {
    const uniq = Array.from(new Set((availableTags || []).filter(Boolean)));
    return uniq.sort((a, b) => a.localeCompare(b, "it"));
  }, [availableTags]);

  const body = (
    <div className="p-4 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold flex items-center gap-2">
          <Filter size={18}/> Filtri
        </h3>
        <div className="flex items-center gap-2">
          <button className="text-sm text-gray-600 hover:text-gray-900" onClick={onClear}>
            Azzera
          </button>
        </div>
      </div>

      {/* Stato */}
      <div>
        <label className="text-sm font-semibold">Stato</label>
        <div className="mt-2 flex flex-col gap-2 text-sm">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={publishedOnly} onChange={(e)=>setPublishedOnly(e.target.checked)} />
            Solo pubblicati
          </label>
        </div>
      </div>

      {/* Categoria */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold flex items-center gap-2">
            <Layers size={16}/> Categoria
          </label>
          {!!selectedCategory && (
            <button
              className="text-xs text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedCategory("")}
            >
              Pulisci
            </button>
          )}
        </div>

        {/* Pills rapide */}
        {!!topCatPills.length && (
          <div className="flex flex-wrap gap-2">
            {topCatPills.map((c) => {
              const active = selectedCategory === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(active ? "" : c)}
                  className={`px-3 py-1.5 rounded-full text-sm border transition ${
                    active
                      ? "bg-[color:var(--fc-primary)] text-white border-transparent"
                      : "bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
                  }`}
                  title={c}
                >
                  {c}
                </button>
              );
            })}
          </div>
        )}

        {/* Dropdown completo con ricerca */}
        <div className="relative">
          <button
            ref={catBtnRef}
            type="button"
            className="input w-full flex items-center justify-between"
            onClick={() => setCatOpen((o) => !o)}
            aria-haspopup="listbox"
            aria-expanded={catOpen}
          >
            <span className={`${selectedCategory ? "text-gray-900" : "text-gray-500"}`}>
              {selectedCategory || "Tutte le categorie"}
            </span>
            <ChevronDown size={18} className="shrink-0" />
          </button>

          {catOpen && (
            <div
              ref={catListRef}
              className="absolute z-20 mt-1 w-full rounded-xl border border-gray-200 bg-white shadow-lg"
              role="listbox"
              tabIndex={-1}
            >
              {/* Search-in-dropdown */}
              <div className="p-2 border-b bg-gray-50">
                <input
                  className="input w-full"
                  placeholder="Cerca categoria…"
                  value={catQuery}
                  onChange={(e) => setCatQuery(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="max-h-60 overflow-auto py-1">
                {/* 'Tutte' */}
                <div
                  role="option"
                  aria-selected={!selectedCategory}
                  className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                    !selectedCategory ? "bg-gray-50" : ""
                  }`}
                  onClick={() => { setSelectedCategory(""); setCatOpen(false); }}
                >
                  <span>Tutte le categorie</span>
                  {!selectedCategory && <Check size={16} />}
                </div>

                {filteredCategories.length ? (
                  filteredCategories.map((c) => {
                    const active = selectedCategory === c;
                    return (
                      <div
                        key={c}
                        role="option"
                        aria-selected={active}
                        className={`px-3 py-2 text-sm cursor-pointer flex items-center justify-between hover:bg-gray-50 ${
                          active ? "bg-gray-50" : ""
                        }`}
                        onClick={() => { setSelectedCategory(active ? "" : c); setCatOpen(false); }}
                      >
                        <span className="truncate">{c}</span>
                        {active && <Check size={16} />}
                      </div>
                    );
                  })
                ) : (
                  <div className="px-3 py-3 text-sm text-gray-500">Nessun risultato.</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Tag */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-semibold flex items-center gap-2">
            <TagIcon size={16}/> Tag
          </label>
          {!!selectedTag && (
            <button
              className="text-xs text-gray-600 hover:text-gray-900"
              onClick={() => setSelectedTag("")}
            >
              Pulisci
            </button>
          )}
        </div>

        {tags.length ? (
          <div className="flex flex-wrap gap-2">
            {/* 'Tutti' */}
            <button
              type="button"
              onClick={() => setSelectedTag("")}
              className={`px-2.5 py-1.5 rounded-full text-xs border transition ${
                !selectedTag
                  ? "bg-gray-900 text-white border-transparent"
                  : "bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
              }`}
            >
              Tutti
            </button>

            {tags.map((t) => {
              const active = selectedTag === t;
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(active ? "" : t)}
                  className={`px-2.5 py-1.5 rounded-full text-xs border transition ${
                    active
                      ? "bg-[color:var(--fc-primary)] text-white border-transparent"
                      : "bg-white hover:bg-gray-50 border-gray-200 text-gray-800"
                  }`}
                  title={t}
                >
                  {t}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="text-xs text-gray-500">Nessun tag disponibile.</div>
        )}
      </div>

      {/* Azioni */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <button className="btn btn-outline w-1/2" onClick={onClear}>Pulisci</button>
        <button className="btn btn-primary w-1/2 lg:hidden" onClick={onCloseMobile}>Applica</button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop */}
      <aside className="hidden lg:block card sticky top-20 h-fit">{body}</aside>

      {/* Mobile drawer */}
      {openMobile && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={onCloseMobile} />
          <div className="absolute top-0 right-0 h-full w-[85%] max-w-sm bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-4 h-14">
              <div className="font-bold">Filtri</div>
              <button className="btn btn-ghost" onClick={onCloseMobile}><X size={18}/></button>
            </div>
            {body}
          </div>
        </div>
      )}
    </>
  );
}


