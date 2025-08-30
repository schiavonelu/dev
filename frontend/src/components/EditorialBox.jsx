import { Link } from "react-router-dom";
import { CalendarDays, Clock, Quote, User } from "lucide-react";

function formatDate(ts){
  if (!ts) return "";
  try {
    return new Date(Number(ts)).toLocaleDateString("it-IT", { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return ""; }
}
const initials = (name="") => name.split(" ").filter(Boolean).slice(0,2).map(s=>s[0]?.toUpperCase()).join("") || "A";

export default function EditorialBox({
  title = "Editoriale della Settimana",
  subtitle = "Il punto sul fantacalcio",
  excerpt = "Analisi, tendenze e strategie per anticipare il prossimo turno.",
  href = "/articoli",
  badge = "Editoriale",
  backgroundUrl = "",
  author = { name: "Redazione", avatarUrl: "" },
  publishedAt = Date.now(),
  readingMinutes = 3,
  showCTA = true, // ⬅️ NEW
}) {
  return (
    <section className="relative rounded-2xl overflow-hidden shadow-md border border-gray-200" aria-label="Box editoriale">
      {/* bg */}
      <div className="absolute inset-0">
        {backgroundUrl ? (
          <img src={backgroundUrl} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full" style={{background:'linear-gradient(135deg, var(--fc-primary), var(--fc-accent))'}} />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/20" />
      </div>

      {/* content */}
      <div className="relative px-5 sm:px-8 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 min-w-0 text-white">
            {badge ? (
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-white/10 ring-1 ring-white/25 backdrop-blur">
                <Quote size={14}/> {badge}
              </span>
            ) : null}

            <h2 className="mt-3 text-2xl sm:text-3xl lg:text-4xl font-black leading-tight">{title}</h2>
            {subtitle && <p className="mt-1 text-lg sm:text-xl text-white/90 font-semibold">{subtitle}</p>}
            {excerpt && <p className="mt-4 text-sm sm:text-base text-white/90 max-w-3xl">{excerpt}</p>}

            <div className="mt-5 flex flex-wrap items-center gap-4 text-white/85">
              {(author?.name || author?.avatarUrl) && (
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full overflow-hidden ring-2 ring-white/20 bg-white/10 flex items-center justify-center">
                    {author?.avatarUrl ? (
                      <img src={author.avatarUrl} alt={author.name || "Autore"} className="w-full h-full object-cover" loading="lazy" />
                    ) : <span className="text-xs font-bold">{initials(author?.name || "A")}</span>}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <User size={16}/>{author?.name || "Redazione"}
                  </div>
                </div>
              )}
              <div className="inline-flex items-center gap-1 text-sm">
                <CalendarDays size={16}/> {formatDate(publishedAt)}
              </div>
              {!!readingMinutes && (
                <div className="inline-flex items-center gap-1 text-sm">
                  <Clock size={16}/> {readingMinutes} min lettura
                </div>
              )}
            </div>

            {showCTA && (
              <div className="mt-6">
                <Link to={href} className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold bg-white text-gray-900 hover:opacity-95 active:opacity-90 transition shadow-sm">
                  Leggi l’editoriale
                </Link>
              </div>
            )}
          </div>

          <div className="hidden lg:block w-[360px] shrink-0">
            <div className="h-[220px] rounded-xl bg-white/10 ring-1 ring-white/20 backdrop-blur flex items-center justify-center">
              <span className="text-white/80 font-semibold tracking-wide">Fantacalcio • Focus</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



