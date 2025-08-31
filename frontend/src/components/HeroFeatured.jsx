// src/components/HeroFeatured.jsx
import { Link } from "react-router-dom";
import { CalendarDays } from "lucide-react";

function fmt(ts){
  if(!ts) return "";
  try { return new Date(Number(ts)).toLocaleDateString("it-IT"); }
  catch { return ""; }
}

function CatBadge({ text }) {
  if (!text) return null;
  return (
    <span className="inline-flex items-center rounded-md bg-orange-500 text-white text-xs font-black px-2 py-1 shadow">
      {String(text).toUpperCase()}
    </span>
  );
}

export default function HeroFeatured({ a }) {
  if (!a) return null;
  const to = `/articoli/${encodeURIComponent(a.slug || a.id)}`;
  const cover = a.cover || a.coverUrl;

  return (
    <Link to={to} className="block group rounded-2xl overflow-hidden relative shadow-lg text-justify">
      {cover ? (
        <img
          src={cover}
          alt={a.title || "Articolo"}
          className="w-full h-[44vh] sm:h-[52vh] md:h-[60vh] object-cover transition group-hover:scale-[1.01]"
          loading="lazy"
        />
      ) : (
        <div
          className="w-full h-[44vh] sm:h-[52vh] md:h-[60vh]"
          style={{ background: 'linear-gradient(135deg, var(--fc-primary), var(--fc-accent))' }}
        />
      )}

      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
        <div className="mb-2">
          <CatBadge text={a.category || a.categoria || "News"} />
        </div>
        <h2 className="text-white font-black leading-tight text-2xl sm:text-4xl md:text-5xl drop-shadow-md">
          {a.title}
        </h2>
        <div className="mt-2 flex items-center gap-3 text-white/90 text-sm drop-shadow">
          {a.author && <span>{a.author}</span>}
          {a.publishedAt && (
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={16} /> {fmt(a.publishedAt)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}


