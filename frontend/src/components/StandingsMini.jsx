import { useEffect, useState } from "react";
import { api } from "../api/client";

const byRank = (a, b) =>
  (b.points || 0) - (a.points || 0) ||
  ((b.gf || 0) - (b.gs || 0)) - ((a.gf || 0) - (a.gs || 0)) ||
  (b.gf || 0) - (a.gf || 0);

export default function StandingsMini(){
  const [rows, setRows] = useState([]);

  useEffect(()=> {
    let on = true;
    (async ()=>{
      try{
        const league = import.meta.env.VITE_LEAGUE_SLUG || "";
        const r = await api.get("/api/standings", { params: { league } });
        if (!on) return;
        const data = Array.isArray(r.data) ? r.data : (r.data?.items || []);
        const norm = data.map((t)=>({
          team: (t.team ?? t.name ?? "—").trim(),
          points: t.points ?? t.pt ?? 0,
          gf: t.gf ?? t.goalsFor ?? 0,
          gs: t.gs ?? t.goalsAgainst ?? 0,
        })).sort(byRank);
        setRows(norm.slice(0, 8));
      } catch {
        setRows([]);
      }
    })();
    return ()=> { on = false; };
  }, []);

  return (
    <div className="rounded-2xl shadow-sm border border-black/5 dark:border-white/10 overflow-hidden bg-gradient-to-br from-white to-emerald-50 dark:from-zinc-900 dark:to-zinc-900/50">
      <div className="px-4 py-3 bg-white/50 dark:bg-black/20">
        <h3 className="font-bold">Classifica (top 8)</h3>
      </div>

      {rows.length ? (
        <ul className="divide-y divide-black/5 dark:divide-white/10">
          {rows.map((t, i) => {
            const rank = i + 1;
            const pill =
              rank === 1
                ? "from-amber-400 to-amber-600 text-white"
                : rank <= 3
                ? "from-emerald-400 to-emerald-600 text-white"
                : "from-gray-200 to-gray-300 text-gray-800 dark:from-white/10 dark:to-white/5 dark:text-white";
            return (
              <li
                key={t.team}
                className="grid grid-cols-[2.25rem_1fr_auto] items-center gap-3 px-4 py-2 hover:bg-black/[0.03] dark:hover:bg-white/5"
              >
                <div className={`text-[11px] font-black rounded-md px-2 py-1 bg-gradient-to-br ${pill} text-center`}>
                  {rank}
                </div>
                <div className="truncate">{t.team}</div>
                <div className="font-semibold">{t.points}</div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="px-4 py-6 text-sm text-gray-500">Classifica non disponibile.</div>
      )}
    </div>
  );
}



