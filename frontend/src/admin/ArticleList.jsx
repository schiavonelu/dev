import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import { Pencil, Trash2, RotateCw, Clock, Tag, Search } from "lucide-react";
import { apiToUi } from "./ArticleForm";
import Modal from "../components/Modal";

const PAGE_SIZE = 9;

const isRecent14d = (ts) => {
  const t = Number(ts || 0);
  if (!t) return false;
  return Date.now() - t <= 14 * 24 * 60 * 60 * 1000;
};

export default function ArticleList({ onNew, onEdit, onPreview }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [q, setQ] = useState("");
  const [loadingList, setLoadingList] = useState(false);
  const searchTimer = useRef(null);

  // Modal
  const [modal, setModal] = useState({ show: false, title: "", content: null, mode: "alert", onConfirm: null });
  const openAlert = (title, content) => setModal({ show: true, title, content, mode: "alert", onConfirm: null });
  const openConfirm = (title, content, onConfirm) => setModal({ show: true, title, content, mode: "confirm", onConfirm });
  const closeModal = () => setModal((m) => ({ ...m, show: false, onConfirm: null }));

  async function fetchList(p = 1, query = "") {
    setLoadingList(true);
    try {
      const r = await api.get("/api/articles", { params: { page: p, pageSize: PAGE_SIZE, q: query } });
      const data = Array.isArray(r.data) ? { items: r.data, page: 1, totalPages: 1 } : r.data;
      setItems((data.items || []).map(apiToUi));
      setPage(data.page || 1);
      setTotalPages(data.totalPages || 1);
    } catch (e) {
      openAlert("Errore caricamento", e?.response?.data?.error || e.message);
    } finally {
      setLoadingList(false);
    }
  }

  useEffect(() => { fetchList(1, ""); }, []);

  async function del(a) {
    openConfirm(
      "Conferma eliminazione",
      <>Vuoi eliminare l’articolo <strong>{a.titolo || a.title}</strong>? L’operazione non è reversibile.</>,
      async () => {
        try {
          await api.delete(`/api/articles/${a.slug}`);
          await fetchList(page, q);
          openAlert("Eliminato", "Articolo eliminato correttamente.");
        } catch (e) {
          openAlert("Errore eliminazione", e?.response?.data?.error || e.message);
        } finally {
          closeModal();
        }
      }
    );
  }

  function onSearchChange(v) {
    setQ(v);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      fetchList(1, v);
    }, 300);
  }

  function Pages() {
    if (totalPages <= 1) return null;
    const btn = (n, active=false) => (
      <button
        key={n}
        onClick={() => setPage(n)}
        className={`px-3 py-1 rounded-lg text-sm border ${
          active
            ? "bg-[color:var(--fc-primary)] text-white border-transparent"
            : "bg-white hover:bg-gray-50 border-gray-200"
        }`}
      >
        {n}
      </button>
    );
    const arr = [];
    for (let n = 1; n <= totalPages; n++) arr.push(btn(n, n===page));
    return <div className="flex items-center justify-center gap-2">{arr}</div>;
  }

  return (
    <>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Lista articoli</h1>
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={() => fetchList(page, q)}><RotateCw size={16} /> Aggiorna</button>
            <button className="btn btn-primary" onClick={onNew}>+ Nuovo</button>
          </div>
        </div>

        <div className="card p-3">
          <div className="relative">
            <input
              className="input w-full pr-9"
              placeholder="Cerca per titolo / testo…"
              value={q}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
              <Search size={18}/>
            </span>
          </div>
        </div>

        <div className="card p-4">
          <div className="divide-y">
            {loadingList ? (
              <div className="py-6 text-sm text-gray-500">Caricamento…</div>
            ) : items.length ? (
              items.map((a) => {
                const tickerEligibleAuto = a.pubblicato && !a.centrale && !a.evidenza && isRecent14d(a.publishedAt || a.createdAt);
                const tickerEligible = a.tickerForce || tickerEligibleAuto;
                return (
                  <div key={a.slug} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0 cursor-pointer" onClick={() => onPreview(a)}>
                      <div className="font-medium truncate">{a.titolo}</div>
                      {a.sottotitolo && <div className="text-xs text-gray-500 truncate">{a.sottotitolo}</div>}
                      <div className="text-xs text-gray-500 truncate flex items-center gap-2">
                        <span className="inline-flex items-center gap-1"><Tag size={12}/>{a.categoria}</span>
                        <span className="inline-flex items-center gap-1"><Clock size={12}/> {a.durataLettura} min</span>
                        <span className="text-gray-400">• {a.slug}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {a.centrale && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">Centrale</span>
                      )}
                      {a.evidenza && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">In evidenza</span>
                      )}
                      {tickerEligible && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">Ticker</span>
                      )}
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                        a.pubblicato
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}>
                        {a.pubblicato ? "Pubblicato" : "Bozza"}
                      </span>

                      <button
                        className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1"
                        onClick={() => onEdit(a)}
                      >
                        <Pencil size={14}/> Modifica
                      </button>
                      <button
                        className="px-2 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 flex items-center gap-1"
                        onClick={() => del(a)}
                      >
                        <Trash2 size={14}/> Elimina
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-sm text-gray-500 py-6">Nessun articolo.</div>
            )}
          </div>

          <div className="pt-4">
            <Pages />
          </div>
        </div>
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


