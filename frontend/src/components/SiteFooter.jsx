// src/components/SiteFooter.jsx
import { Link } from "react-router-dom";
import { Trophy, CalendarDays, BookText, Users, Newspaper, Layers, History } from "lucide-react";
import BrandMark from "./BrandMark";

export default function SiteFooter() {
  return (
    <footer
      className="mt-12 text-white shadow-inner"
      style={{
        background:
          "linear-gradient(140deg, color-mix(in hsl, var(--fc-primary) 88%, #0a2b64), color-mix(in hsl, var(--fc-accent) 82%, #0b7c53))",
      }}
    >
      {/* fascia brand come l’header */}
      <div className="h-1 w-full bg-white/30" />

      <div
        className="container-gz py-10 grid gap-8 md:grid-cols-4
                   text-center md:text-left items-center md:items-start
                   justify-items-center md:justify-items-start
                   text-white"
      >
        {/* brand */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <BrandMark size={28} />
            <span className="font-black">Carogna League</span>
          </div>
          <p className="text-sm text-white/85 max-w-xs text-justify">
            XVII Edizione · Nuove sfide, nuovi protagonisti · Notizie, risultati e dati ufficiali della nostra Lega.
          </p>
        </div>

        {/* colonne link */}
        <div>
          <h4 className="font-semibold mb-2 text-white">Contenuti</h4>
          <ul className="space-y-1 text-sm flex flex-col items-center md:items-start">
            <li>
              <Link
                to="/articoli"
                className="px-2 py-1 rounded-lg hover:bg-white/10 hover:text-white hover:font-semibold inline-flex items-center gap-2"
              >
                <Newspaper size={16} /> Articoli
              </Link>
            </li>
            <li>
              <Link
                to="/competizioni"
                className="px-2 py-1 rounded-lg hover:bg-white/10 hover:text-white hover:font-semibold inline-flex items-center gap-2"
              >
                <Layers size={16} /> Competizioni
              </Link>
            </li>
            <li>
              <Link
                to="/classifica"
                className="px-2 py-1 rounded-lg hover:bg-white/10 hover:text-white hover:font-semibold inline-flex items-center gap-2"
              >
                <Trophy size={16} /> Classifica
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-2 text-white">Lega</h4>
          <ul className="space-y-1 text-sm flex flex-col items-center md:items-start">
            <li>
              <Link
                to="/regolamento"
                className="px-2 py-1 rounded-lg hover:bg-white/10 hover:text-white hover:font-semibold inline-flex items-center gap-2"
              >
                <BookText size={16} /> Regolamento
              </Link>
            </li>
            <li>
              <Link
                to="/albo-d-oro"
                className="px-2 py-1 rounded-lg hover:bg-white/10 hover:text-white hover:font-semibold inline-flex items-center gap-2"
              >
                <Trophy size={16} /> Albo d’oro
              </Link>
            </li>
            <li>
              <Link
                to="/storia"
                className="px-2 py-1 rounded-lg hover:bg-white/10 hover:text-white hover:font-semibold inline-flex items-center gap-2"
              >
                <History size={16} /> Storia
              </Link>
            </li>
          </ul>
        </div>

        {/* newsletter */}
        <div className="w-full max-w-xs">
          <h4 className="font-semibold mb-2 text-white">Newsletter</h4>
          <p className="text-sm text-white/85 mb-2">
            Aggiornamenti settimanali sulla lega.
          </p>
          <div className="flex gap-2">
            <input
              className="flex-1 rounded-xl px-3 py-2 outline-none
                         bg-white/10 border border-white/25
                         text-white placeholder-white/70
                         focus:ring focus:ring-white/25"
              placeholder="La tua email"
              type="email"
            />
            <button
              className="rounded-xl px-4 py-2 font-semibold
                         bg-white/90 text-[var(--fc-primary)]
                         hover:opacity-95 transition"
            >
              Iscriviti
            </button>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="border-t border-white/15">
        <div className="container-gz py-4 text-xs text-white/85 flex flex-col md:flex-row gap-2 md:gap-0 items-center justify-between">
          <span>© {new Date().getFullYear()} Carogna League · XVII Edizione</span>
          <div className="flex gap-3">
            <a href="#" className="px-2 py-1 rounded-lg hover:bg-white/10">Privacy</a>
            <a href="#" className="px-2 py-1 rounded-lg hover:bg-white/10">Cookie</a>
          </div>
        </div>
      </div>
    </footer>
  );
}


