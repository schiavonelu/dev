import { ChevronLeft, ChevronRight } from "lucide-react";

function makePages(page, totalPages, max = 7) {
  if (totalPages <= max) return Array.from({length: totalPages}, (_,i)=> i+1);
  const pages = new Set([1, totalPages, page]);
  pages.add(page-1); pages.add(page+1);
  pages.add(2); pages.add(totalPages-1);
  const arr = Array.from(pages).filter(p=> p>=1 && p<=totalPages).sort((a,b)=>a-b);
  const out = [];
  for (let i=0; i<arr.length; i++){
    out.push(arr[i]);
    if (arr[i+1] && arr[i+1] !== arr[i]+1) out.push('…');
  }
  return out;
}

export default function Pagination({ page, totalPages, onChange }) {
  const pages = makePages(page, Math.max(1, totalPages||1));
  return (
    <div className="mt-6 flex items-center justify-center">
      <nav className="inline-flex items-center gap-1">
        <button
          className="btn btn-ghost px-3 py-1.5"
          onClick={()=>onChange(Math.max(1, page-1))}
          disabled={page<=1}
          aria-label="Pagina precedente"
        >
          <ChevronLeft size={16}/>
        </button>
        {pages.map((p,i)=> p === '…' ? (
          <span key={`e${i}`} className="px-2 select-none text-gray-500">…</span>
        ) : (
          <button
            key={p}
            onClick={()=>onChange(p)}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
              p===page ? 'text-white' : 'text-gray-700 hover:bg-gray-100'
            }`}
            style={p===page ? { background:'var(--fc-primary)'} : {}}
            aria-current={p===page ? 'page' : undefined}
          >
            {p}
          </button>
        ))}
        <button
          className="btn btn-ghost px-3 py-1.5"
          onClick={()=>onChange(Math.min(totalPages||1, page+1))}
          disabled={page >= (totalPages||1)}
          aria-label="Pagina successiva"
        >
          <ChevronRight size={16}/>
        </button>
      </nav>
    </div>
  );
}

