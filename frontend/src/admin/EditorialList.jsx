import { useEffect, useState } from "react";
import { api } from "../api/client";
import { Pencil, Trash2, RotateCw, CalendarDays, Clock, BadgeInfo } from "lucide-react";
import Modal from "../components/Modal";

export default function EditorialList({ onEdit, onNew }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [modal, setModal] = useState({ show: false, title: "", content: null, mode: "alert", onConfirm: null });
  const openAlert = (title, content) => setModal({ show: true, title, content, mode: "alert", onConfirm: null });
  const openConfirm = (title, content, onConfirm) => setModal({ show: true, title, content, mode: "confirm", onConfirm });
  const closeModal = () => setModal((m) => ({ ...m, show: false, onConfirm: null }));

  async function load() {
    setLoading(true);
    try {
      const r = await api.get("/api/editorials", { params: { page: 1, pageSize: 100 } });
      setItems((r.data?.items || []).map(x => ({ ...x, id: x.id || x._id })));
    } catch (e) {
      openAlert("Errore caricamento", e?.response?.data?.error || e.message);
    } finally { setLoading(false); }
  }

  useEffect(() => { load(); }, []);

  async function removeItem(it) {
    openConfirm(
      "Conferma eliminazione",
      <>Eliminare l’editoriale <strong>{it.title}</strong>? L’operazione non è reversibile.</>,
      async () => {
        try {
          await api.delete(`/api/editorials/${encodeURIComponent(it.slug || it.id)}`);
          await load();
          openAlert("Eliminato", "Editoriale eliminato correttamente.");
        } catch (e) {
          openAlert("Errore eliminazione", e?.response?.data?.error || e.message);
        } finally {
          closeModal();
        }
      }
    );
  }

  return (
    <>
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Lista Editoriali</h1>
          <div className="flex gap-2">
            <button className="btn btn-outline" onClick={load}><RotateCw size={16}/> Aggiorna</button>
            <button className="btn btn-primary" onClick={onNew}>+ Nuovo</button>
          </div>
        </div>

        <div className="card p-0 overflow-hidden">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr className="text-left">
                <th className="p-3">Titolo</th>
                <th className="p-3">Badge</th>
                <th className="p-3">Pubblicato</th>
                <th className="p-3">Data</th>
                <th className="p-3">Lettura</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="p-4 text-gray-500" colSpan={6}>Caricamento…</td></tr>
              ) : items.length ? items.map(it => (
                <tr key={it.id} className="border-t">
                  <td className="p-3">
                    <div className="font-medium">{it.title}</div>
                    {it.subtitle ? <div className="text-xs text-gray-500">{it.subtitle}</div> : null}
                    {it.slug ? <div className="text-[11px] text-gray-400">/{it.slug}</div> : null}
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-100 text-indigo-700 border border-indigo-200">
                      <BadgeInfo size={12}/>{it.badge || "Editoriale"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${
                      it.published ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}>{it.published ? "Pubblicato" : "Bozza"}</span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-700">
                      <CalendarDays size={14}/> {it.publishedAt ? new Date(Number(it.publishedAt)).toLocaleDateString("it-IT") : "—"}
                    </span>
                  </td>
                  <td className="p-3">
                    <span className="inline-flex items-center gap-1 text-xs text-gray-700">
                      <Clock size={14}/> {it.readingMinutes || 3} min
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button className="px-2 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 flex items-center gap-1" onClick={() => onEdit(it)}>
                        <Pencil size={14}/> Modifica
                      </button>
                      <button className="px-2 py-1 rounded-lg text-xs font-medium bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 flex items-center gap-1" onClick={() => removeItem(it)}>
                        <Trash2 size={14}/> Elimina
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td className="p-4 text-gray-500" colSpan={6}>Nessun editoriale.</td></tr>
              )}
            </tbody>
          </table>
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

