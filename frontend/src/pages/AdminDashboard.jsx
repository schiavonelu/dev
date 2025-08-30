import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import Modal from "../components/Modal";
import Spinner from "../components/Spinner";
import { LogOut } from "lucide-react";

// nuovi componenti
import ArticleForm, { initArticle, apiToUi as apiToUiArticle } from "../admin/ArticleForm";
import ArticleList from "../admin/ArticleList";

// SEZIONI aggiuntive editoriali (se già implementate altrove):
import EditorialList from "../admin/EditorialList";
import EditorialForm from "../admin/EditorialForm";

export default function AdminDashboard() {
  const nav = useNavigate();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  // Sezioni esistenti: "new", "list" (articoli).
  // Aggiungiamo "art-detail", "ed-new", "ed-list".
  const [section, setSection] = useState("list");

  // Stato articolo corrente (per edit/detail)
  const [currentArticleSlug, setCurrentArticleSlug] = useState(null);
  const [currentArticleUI, setCurrentArticleUI] = useState(initArticle);

  // Editoriali temp
  const [tmpEditorial, setTmpEditorial] = useState(null);

  // Modal (riuso)
  const [modal, setModal] = useState({ show: false, title: "", content: "", mode: "alert", onConfirm: null });
  const openConfirm = (title, content, onConfirm) => setModal({ show: true, title, content, mode: "confirm", onConfirm });
  const closeModal = () => setModal((m) => ({ ...m, show: false, onConfirm: null }));

  // Auth guard minimo
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      if (!u) nav("/admin/login");
    });
    return () => unsub();
    // eslint-disable-next-line
  }, []);

  function askLogout() {
    openConfirm("Conferma logout", "Vuoi davvero uscire dall'area amministratore?", async () => {
      await signOut(auth);
      nav("/admin/login", { replace: true });
    });
  }

  // Handlers articoli
  function goNewArticle() {
    setCurrentArticleSlug(null);
    setCurrentArticleUI(initArticle);
    setSection("new");
  }
  function goEditArticle(uiArticle) {
    setCurrentArticleSlug(uiArticle.slug);
    setCurrentArticleUI(uiArticle);
    setSection("new");
  }
  function goPreviewArticle(uiArticle) {
    setCurrentArticleSlug(uiArticle.slug);
    setCurrentArticleUI(uiArticle);
    setSection("art-detail");
  }

  return (
    <div className="min-h-screen flex">
      <AdminSidebar
        expanded={sidebarExpanded}
        setExpanded={setSidebarExpanded}
        section={section}
        setSection={(s) => {
          if (s !== "ed-new") setTmpEditorial(null);
          setSection(s);
        }}
      />

      <div className="flex-1">
        <div className="sticky top-0 z-40 bg-white border-b">
          <div className="container-gz h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="font-black">Admin</div>
              <div className="text-sm text-gray-500 pl-2">/ {
                section === "new" ? "inserimento articolo" :
                section === "list" ? "lista articoli" :
                section === "art-detail" ? "dettaglio articolo" :
                section === "ed-new" ? "inserimento editoriale" :
                "lista editoriali"
              }</div>
            </div>
            <button onClick={askLogout} className="btn btn-outline text-sm flex items-center gap-2">
              <LogOut size={18} /> Logout
            </button>
          </div>
        </div>

        <main className="p-6 space-y-6">
          {/* ===== ARTICOLI: LISTA ===== */}
          {section === "list" && (
            <ArticleList
              onNew={goNewArticle}
              onEdit={goEditArticle}
              onPreview={goPreviewArticle}
            />
          )}

          {/* ===== ARTICOLI: FORM ===== */}
          {section === "new" && (
            <ArticleForm
              editingSlug={currentArticleSlug}
              initialData={currentArticleUI}
              onCancel={() => setSection("list")}
              onSaved={() => setSection("list")}
            />
          )}

          {/* ===== ARTICOLI: DETAIL ===== */}
          {section === "art-detail" && (
            <ArticleDetail
              a={currentArticleUI}
              onBack={() => setSection("list")}
              onEdit={goEditArticle}
            />
          )}

          {/* ===== EDITORIALI: LISTA ===== */}
          {section === "ed-list" && (
            <EditorialList
              onNew={() => setSection("ed-new")}
              onEdit={(it) => { setTmpEditorial(it); setSection("ed-new"); }}
            />
          )}

          {/* ===== EDITORIALI: FORM ===== */}
          {section === "ed-new" && (
            <EditorialForm
              editing={tmpEditorial}
              onCancel={() => { setTmpEditorial(null); setSection("ed-list"); }}
              onSaved={() => { setTmpEditorial(null); setSection("ed-list"); }}
            />
          )}
        </main>
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
    </div>
  );
}
















