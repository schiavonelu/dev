import { Link } from "react-router-dom";

export default function ArticleCard({ a }){
  const to = `/articoli/${encodeURIComponent(a.slug || a.id)}`;
  const cover = a.cover || a.coverUrl;
  const category = a.category || a.categoria || "News";
  const isCentral = !!(a.central ?? a.centrale);
  const isFeatured = !!(a.featured ?? a.evidenza);

  return (
    <article className="card card-hover overflow-hidden relative">
      {cover ? (
        <img src={cover} alt="" className="h-44 w-full object-cover" loading="lazy" />
      ) : (
        <div className="h-44 w-full" style={{background:'linear-gradient(135deg, #e6eefc, #f6fffb)'}} />
      )}

      {/* badge categoria */}
      <div className="absolute top-2 left-2">
        <span className="inline-flex items-center rounded-md bg-orange-500 text-white text-[11px] font-black px-2 py-0.5 shadow">
          {String(category).toUpperCase()}
        </span>
      </div>

      {/* mini-badge centrale / evidenza */}
      <div className="absolute top-2 right-2 space-x-1">
        {isCentral && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-700 border border-blue-200">
            Centrale
          </span>
        )}
        {isFeatured && (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            In evidenza
          </span>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-bold line-clamp-2 text-justify">{a.title || a.titolo}</h3>
        <p className="text-sm text-gray-600 line-clamp-3 text-justify">{a.excerpt || a.estratto}</p>

        <div className="flex items-center justify-end pt-1">
          <Link
            to={to}
            className="text-sm inline-flex items-center gap-1 group no-underline"
            style={{color:'var(--fc-primary)'}}
          >
            Leggi
            <span aria-hidden className="transition-transform duration-150 group-hover:translate-x-0.5">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
}



