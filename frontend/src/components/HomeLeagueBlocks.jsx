import { useEffect, useState } from "react";
import { api } from "../api/client";
import { CalendarDays, Trophy, Flag } from "lucide-react";

// --- DATI PROVVISORI (finché non arrivano dall'API) ---
// 1ª Giornata → Risultati (tutti 0-0)
const demoResults = [
  { home: "RICHVILLE", away: "SENZA PADRONI FK", gh: 0, ga: 0 },
  { home: "LEONI INDOMABILI", away: "I CUGINI DI BILANCIA", gh: 0, ga: 0 },
  { home: "ATLETICO MACRI", away: "SCHALKE 104", gh: 0, ga: 0 },
  { home: "POGGIOREAL CLUB DE FUTBOL", away: "F C SANPA", gh: 0, ga: 0 },
  { home: "ATLETICO SOLOPACA", away: "UNION STRUNZ", gh: 0, ga: 0 },
];

// 2ª Giornata → Prossimo turno (tutti 0-0 per ora, solo etichetta "2ª giornata")
const demoNext = [
  { home: "I Cugini di Bilancia", away: "Richville", when: "2ª giornata" },
  { home: "F C Sanpa", away: "Atletico Solopaca", when: "2ª giornata" },
  { home: "Schalke 104", away: "Poggioreal Club De Futbol", when: "2ª giornata" },
  { home: "Senza Padroni FK", away: "Atletico Macrì", when: "2ª giornata" },
  { home: "Union Strunz", away: "Leoni Indomabili", when: "2ª giornata" },
];

const demoTable = [
  { team: "SENZA PADRONI FK", points: 0, gf: 0, gs: 0 },
  { team: "I CUGINI DI BILANCIA", points: 0, gf: 0, gs: 0 },
  { team: "LEONI INDOMABILI", points: 0, gf: 0, gs: 0 },
  { team: "F C SANPA", points: 0, gf: 0, gs: 0 },
  { team: "UNION STRUNZ", points: 0, gf: 0, gs: 0 },
  { team: "ATLETICO MACRI", points: 0, gf: 0, gs: 0 },
  { team: "POGGIOREAL CLUB DE FUTBOL", points: 0, gf: 0, gs: 0 },
  { team: "RICHVILLE", points: 0, gf: 0, gs: 0 },
  { team: "ATLETICO SOLOPACA", points: 0, gf: 0, gs: 0 },
  { team: "SCHALKE 104", points: 0, gf: 0, gs: 0 },
];

// --- helpers ---
const pickItems = (data) => (Array.isArray(data) ? data : (data?.items || []));
const sortTable = (arr) =>
  [...arr].sort(
    (a, b) =>
      (b.points || 0) - (a.points || 0) ||
      ((b.gf || 0) - (b.gs || 0)) - ((a.gf || 0) - (a.gs || 0)) ||
      (b.gf || 0) - (a.gf || 0)
  );

const mapResult = (m) => ({
  home: (m.home ?? m.homeTeam ?? m.home_name ?? m.h ?? "—").toString().trim(),
  away: (m.away ?? m.awayTeam ?? m.away_name ?? m.a ?? "—").toString().trim(),
  gh:   m.gh   ?? m.homeGoals ?? m.hg ?? m.home_score ?? m.hs ?? 0,
  ga:   m.ga   ?? m.awayGoals ?? m.ag ?? m.away_score ?? m.as ?? 0,
});

// Card con gradient leggibile in dark
function Card({ tone = "emerald", icon, title, children, footer }) {
  const tones = {
    emerald: "from-emerald-50 to-emerald-100 dark:from-emerald-950/60 dark:to-emerald-900/20",
    indigo:  "from-indigo-50 to-indigo-100 dark:from-indigo-950/60 dark:to-indigo-900/20",
    amber:   "from-amber-50 to-amber-100 dark:from-amber-950/60 dark:to-amber-900/20",
  };
  const badgeBg = {
    emerald: "bg-emerald-200/90 text-emerald-900 dark:bg-emerald-700/60 dark:text-emerald-100",
    indigo:  "bg-indigo-200/90 text-indigo-900 dark:bg-indigo-700/60 dark:text-indigo-100",
    amber:   "bg-amber-200/90 text-amber-900 dark:bg-amber-700/60 dark:text-amber-100",
  }[tone];

  return (
    <div className={`rounded-2xl shadow-sm border border-black/5 dark:border-white/10 bg-gradient-to-br ${tones[tone]} text-gray-900 dark:text-gray-100 overflow-hidden`}>
      <div className="px-4 pt-4 pb-2 flex items-center justify-between bg-white/40 dark:bg-black/20">
        <div className="flex items-center gap-3">
          <div className={`size-9 rounded-xl grid place-items-center ${badgeBg}`}>
            {icon}
          </div>
          <h3 className="font-bold">{title}</h3>
        </div>
        {footer}
      </div>
      <div className="px-4 pb-4">{children}</div>
    </div>
  );
}

function SkeletonRow({ cols = 3 }) {
  return (
    <div className="py-2 animate-pulse">
      <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${cols}, minmax(0,1fr))` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-3 rounded bg-gray-200/70 dark:bg-white/10" />
        ))}
      </div>
    </div>
  );
}

export default function HomeLeagueBlocks() {
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState([]);
  const [next, setNext] = useState([]);
  const [table, setTable] = useState([]);

  useEffect(() => {
    let on = true;
    (async () => {
      setLoading(true);
      try {
        const league = import.meta.env.VITE_LEAGUE_SLUG || "";

        const [rRes, rTab] = await Promise.allSettled([
          api.get("/api/results", { params: { league } }),
          api.get("/api/standings", { params: { league } }),
        ]);

        // RISULTATI (fallback = 1ª giornata)
        let rs = [];
        if (rRes.status === "fulfilled") {
          const raw = pickItems(rRes.value.data);
          rs = raw.map(mapResult);
        }
        if (!rs.length) rs = demoResults;

        // CLASSIFICA
        let tb = [];
        if (rTab.status === "fulfilled") {
          tb = pickItems(rTab.value.data).map((t) => ({
            team: (t.team ?? t.name ?? "—").toString().trim(),
            points: t.points ?? t.pt ?? 0,
            gf: t.gf ?? t.goalsFor ?? 0,
            gs: t.gs ?? t.goalsAgainst ?? 0,
          }));
        }
        if (!tb.length) tb = demoTable;
        tb = sortTable(tb);

        if (!on) return;
        setResults(rs.slice(0, 5));            // mostra SEMPRE 5 match
        setNext(demoNext.slice(0, 5));         // prossimo turno: 5 match (2ª giornata)
        setTable(tb.slice(0, 10));
      } catch {
        if (!on) return;
        setResults(demoResults.slice(0, 5));
        setNext(demoNext.slice(0, 5));
        setTable(sortTable(demoTable).slice(0, 10));
      } finally {
        if (on) setLoading(false);
      }
    })();
    return () => { on = false; };
  }, []);

  return (
    <section className="grid md:grid-cols-3 gap-6 pt-4">
      {/* Risultati (1ª giornata) */}
      <Card tone="emerald" icon={<Flag size={18} />} title="Risultati">
        <ul className="divide-y divide-black/5 dark:divide-white/10">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={3} />)
            : (results || []).map((m, i) => (
                <li
                  key={i}
                  className="py-2 text-sm grid grid-cols-[1fr_auto_1fr] items-center gap-2"
                >
                  {/* home a destra */}
                  <span className="truncate text-right">{m.home}</span>
                  {/* punteggio centrale */}
                  <span className="font-semibold rounded px-2 py-0.5 bg-white/70 dark:bg-white/10 border border-black/5 dark:border-white/10 text-center">
                    {m.gh} - {m.ga}
                  </span>
                  {/* away a sinistra */}
                  <span className="truncate text-left">{m.away}</span>
                </li>
              ))}
        </ul>
      </Card>

      {/* Prossimo turno (2ª giornata) */}
      <Card tone="indigo" icon={<CalendarDays size={18} />} title="Prossimo turno">
        <ul className="divide-y divide-black/5 dark:divide-white/10">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} cols={3} />)
            : (next || []).map((m, i) => (
                <li
                  key={i}
                  className="py-2 text-sm grid grid-cols-[1fr_auto_1fr] items-center gap-2"
                >
                  <span className="truncate text-right">{m.home}</span>
                  <span className="text-xs text-gray-600 dark:text-gray-300 text-center">
                    {m.when || ""}
                  </span>
                  <span className="truncate text-left">{m.away}</span>
                </li>
              ))}
        </ul>
      </Card>

      {/* Classifica */}
      <Card
        tone="amber"
        icon={<Trophy size={18} />}
        title="Classifica"
        footer={
          <a
            href="/classifica"
            className="text-xs font-medium hover:underline"
            style={{ color: "var(--fc-primary)" }}
            aria-label="Vai alla classifica completa"
          >
            Vedi classifica completa →
          </a>
        }
      >
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-white/60 dark:bg-white/5">
              <tr>
                <th className="px-2 py-1 text-left">#</th>
                <th className="px-2 py-1 text-left">Squadra</th>
                <th className="px-2 py-1 text-right">Pt</th>
              </tr>
            </thead>
            <tbody>
              {(table || []).map((t, i) => (
                <tr
                  key={t.team || i}
                  className="border-t border-black/5 dark:border-white/10 hover:bg-black/[0.03] dark:hover:bg-white/5"
                >
                  <td className="px-2 py-1">
                    {/* 1° oro, 2-3 verde, altri neutri */}
                    <span
                      className={[
                        "text-[11px] font-black rounded-md px-2 py-0.5 inline-block",
                        i === 0
                          ? "bg-gradient-to-br from-amber-400 to-amber-600 text-white"
                          : i <= 2
                          ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white"
                          : "bg-gradient-to-br from-gray-200 to-gray-300 text-gray-800 dark:from-white/10 dark:to-white/5 dark:text-white",
                      ].join(" ")}
                    >
                      {i + 1}
                    </span>
                  </td>
                  <td className="px-2 py-1">{t.team}</td>
                  <td className="px-2 py-1 text-right font-semibold">{t.points ?? t.pt ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </section>
  );
}


