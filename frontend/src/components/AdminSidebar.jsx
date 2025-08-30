// src/components/AdminSidebar.jsx
import { FilePlus2, List as ListIcon, PenLine, Newspaper, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminSidebar({ expanded, setExpanded, section, setSection }) {
  const link = (key, label, Icon) => (
    <button
      onClick={() => setSection(key)}
      className={`w-full text-left px-3 py-2 rounded-lg transition flex items-center gap-2 ${
        section === key ? "bg-[color:var(--fc-primary)] text-white" : "hover:bg-gray-100"
      } ${expanded ? "justify-start" : "justify-center"}`}
      title={label}
      aria-label={label}
    >
      <Icon size={18} />
      {expanded && <span className="truncate">{label}</span>}
    </button>
  );

  return (
    <aside className={`self-stretch bg-white border-r p-4 transition-all duration-300 flex flex-col ${expanded ? "w-64" : "w-16"}`}>
      <div className={`flex items-center ${expanded ? "justify-between" : "justify-center"} mb-6`}>
        {expanded && <div className="font-black">Admin</div>}
        <button
          className="btn btn-ghost p-1"
          onClick={() => setExpanded((e) => !e)}
          aria-label={expanded ? "Chiudi sidebar" : "Apri sidebar"}
          title={expanded ? "Chiudi" : "Apri"}
        >
          {expanded ? <ChevronLeft /> : <ChevronRight />}
        </button>
      </div>

      <nav className="space-y-1 flex-1">
        {/* ARTICOLI */}
        <div className={`px-2 text-xs uppercase tracking-wide ${expanded ? "block" : "hidden"} text-gray-500 mb-1`}>Articoli</div>
        {link("new", "Inserimento Articoli", FilePlus2)}
        {link("list", "Lista Articoli", ListIcon)}

        {/* EDITORIALI */}
        <div className={`px-2 text-xs uppercase tracking-wide ${expanded ? "block" : "hidden"} text-gray-500 mt-4 mb-1`}>Editoriali</div>
        {link("ed-new", "Nuovo Editoriale", PenLine)}
        {link("ed-list", "Lista Editoriali", Newspaper)}
      </nav>
    </aside>
  );
}






