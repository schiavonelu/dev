import { useEffect, useRef, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Tag } from "lucide-react";

const INTERVAL_MS = 10000;

function ellipsis(s = "", max = 90) {
  const t = String(s).trim().replace(/\s+/g, " ");
  if (t.length <= max) return t;
  const cut = t.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return (lastSpace > 40 ? cut.slice(0, lastSpace) : cut) + "…";
}

function Row({ item }) {
  const to = `/articoli/${encodeURIComponent(item.slug || item.id)}`;

  const category  = item.category  || item.categoria  || "News";
  const title     = (item.title    || item.titolo     || "").trim();
  const subtitle  = (item.subtitle || item.sottotitolo|| "").trim();
  const excerpt   = (item.excerpt  || item.estratto   || "").trim();

  // Mostra sempre TITOLO (in grassetto); il SOTTOTITOLO se presente (ben evidenziato);
  // se manca il sottotitolo, usa l’estratto (troncato) come seconda riga.
  const hasSubtitle = !!subtitle;
  const line2 = hasSubtitle ? subtitle : (excerpt ? ellipsis(excerpt, 90) : "");

  return (
    <div className="h-16 flex items-center gap-3 px-3 transition-colors hover:bg-black/[0.03]">
      {/* badge categoria */}
      <span className="inline-flex items-center rounded-md bg-orange-500 text-white text-[11px] font-black px-2 py-0.5 whitespace-nowrap">
        {String(category).toUpperCase()}
      </span>

      {/* blocco cliccabile — NO underline */}
      <Link to={to} className="flex-1 overflow-hidden no-underline">
        {/* TITOLO ben evidente */}
        <div className="truncate font-semibold">
          {title || line2 || "Articolo"}
        </div>
        {/* SOTTOTITOLO ben visibile, altrimenti estratto troncato */}
        {line2 && (
          <div className={`truncate text-xs ${hasSubtitle ? "text-gray-800 font-medium" : "text-gray-600"}`}>
            {line2}
          </div>
        )}
      </Link>

      {(item.tags?.length > 0) && (
        <span className="hidden sm:inline-flex items-center gap-1 text-gray-500 text-xs">
          <Tag size={14}/> {item.tags[0]}
        </span>
      )}
    </div>
  );
}

export default function NewsTicker({ items = [] }) {
  const list = Array.isArray(items) ? items : [];
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!list.length) return;
    if (timer.current) clearInterval(timer.current);
    if (!paused) {
      timer.current = setInterval(() => setI((v) => (v + 1) % list.length), INTERVAL_MS);
    }
    return () => timer.current && clearInterval(timer.current);
  }, [list.length, paused]);

  const dots = useMemo(() => Array.from({ length: list.length }, (_, idx) => idx), [list.length]);

  if (!list.length) return null;
  const cur = list[i];

  return (
    <div
      className="card overflow-hidden h-16 flex items-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-live="polite"
    >
      <div className="w-full">
        <div key={cur.slug || cur.id || i} className="animate-slide-up">
          <Row item={cur} />
        </div>
      </div>

      {/* indicatori a puntini (clickabili) */}
      <div className="pr-3 pl-2 hidden sm:flex items-center gap-1">
        {dots.map((d) => (
          <button
            key={d}
            onClick={() => setI(d)}
            aria-label={`Mostra notizia ${d + 1}`}
            className={`h-1.5 w-1.5 rounded-full transition ${
              d === i ? "bg-gray-800" : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div>
    </div>
  );
}




