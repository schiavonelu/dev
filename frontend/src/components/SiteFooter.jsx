// src/components/SiteFooter.jsx
import { Link } from "react-router-dom";
import { Trophy, CalendarDays, BookText, Users, Newspaper, Layers, History } from "lucide-react";
import BrandMark from "./BrandMark";

export default function SiteFooter() {
  return (
    <footer
      className="mt-12 border-t border-black/5 dark:border-white/10
                 bg-white/85 dark:bg-zinc-900/80
                 backdrop-blur supports-[backdrop-filter]:bg-white/70
                 dark:supports-[backdrop-filter]:bg-zinc-900/60"
    >
      {/* fascia brand come l’header */}
      <div
        className="h-1 w-full"
        style={{ background: "linear-gradient(90deg, var(--fc-accent), var(--fc-primary))" }}
      />

      <div
        className="container-gz py-10 grid gap-8 md:grid-cols-4
                   text-center md:text-left items-center md:items-start
                   justify-items-center md:justify-items-start
                   text-gray-800 dark:text-gray-100"
      >
        {/* brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <BrandMark size={28} />
            <span className="font-black">Carogna League</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-xs text-justify">
            XVII Edizione · Nuove sfide, nuovi protagonisti · Notizie, risultati e dati ufficiali della nostra Lega.
          </p>
        </div>

        {/* colonne link */}
        <div>
          <h4 className="font-semibold mb-2">Contenuti</h4>
          <ul className="space-y-1 text-sm flex flex-col items-center md:items-start">
            <li>
              <Link
                to="/articoli"
                className="px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--fc-primary)] hover:font-semibold inline-flex items-center gap-2"
              >
                <Newspaper size={16} /> Articoli
              </Link>
            </li>
            <li>
              <Link
                to="/competizioni"
                className="px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--fc-primary)] hover:font-semibold inline-flex items-center gap-2"
              >
                <Layers size={16} /> Competizioni
              </Link>
            </li>
            <li>
              <Link
                to="/classifica"
                className="px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--fc-primary)] hover:font-semibold inline-flex items-center gap-2"
              >
                <Trophy size={16} /> Classifica
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2">Lega</h4>
          <ul className="space-y-1 text-sm flex flex-col items-center md:items-start">
            <li>
              <Link
                to="/regolamento"
                className="px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--fc-primary)] hover:font-semibold inline-flex items-center gap-2"
              >
                <BookText size={16} /> Regolamento
              </Link>
            </li>
            <li>
              <Link
                to="/albo-d-oro"
                className="px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--fc-primary)] hover:font-semibold inline-flex items-center gap-2"
              >
                <Trophy size={16} /> Albo d’oro
              </Link>
            </li>
            <li>
              <Link
                to="/storia"
                className="px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 hover:text-[var(--fc-primary)] hover:font-semibold inline-flex items-center gap-2"
              >
                <History size={16} /> Storia
              </Link>
            </li>
          </ul>
        </div>

        {/* newsletter */}
        <div className="w-full max-w-xs">
          <h4 className="font-semibold mb-2">Newsletter</h4>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
            Aggiornamenti settimanali sulla lega.
          </p>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl px-3 py-2 outline-none
                         bg-white dark:bg-zinc-800
                         border border-black/10 dark:border-white/10
                         text-gray-900 dark:text-gray-100
                         placeholder-gray-400"
              placeholder="La tua email"
              type="email"
            />
            <button
              className="rounded-xl px-4 py-2 font-semibold
                         bg-[var(--fc-primary)] text-white
                         hover:opacity-90 transition"
            >
              Iscriviti
            </button>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-black/5 dark:border-white/10">
        <div className="container-gz py-4 text-xs text-gray-600 dark:text-gray-300 flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between">
          <span>© {new Date().getFullYear()} Carogna League · XVII Edizione</span>
          <div className="flex gap-3">
            <a href="#" className="px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">Privacy</a>
            <a href="#" className="px-2 py-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


