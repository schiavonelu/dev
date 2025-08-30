// src/pages/Standings.jsx
import { useEffect, useMemo, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Spinner from "../components/Spinner";
import { api } from "../api/client";

function normalizeRow(r) {
  const toNum = (v) => (v === undefined || v === null || v === "" ? 0 : Number(v));
  const team = (r.team ?? r.name ?? r.Squadra ?? "—").trim();

  const played = toNum(r.played ?? r.Giocate ?? r.G ?? r["Partite giocate"]);
  const won    = toNum(r.won    ?? r.V ?? r.Vittorie);
  const draw   = toNum(r.draw   ?? r.N ?? r.Pareggi);
  const lost   = toNum(r.lost   ?? r.P ?? r.Sconfitte);
  const gf     = toNum(r.gf     ?? r.GF ?? r.goalsFor ?? r["Gol fatti"]);
  const gs     = toNum(r.gs     ?? r.GS ?? r.GA ?? r.goalsAgainst ?? r["Gol subiti"]);
  const points = toNum(r.points ?? r.Pt ?? r.pt ?? r.PT);
  const total  = toNum(r.totalPoints ?? r.ptTotali ?? r["pt totali"] ?? r["PT totali"]);
  const dr     = toNum(r.dr ?? gf - gs);

  return { team, played, won, draw, lost, gf, gs, dr, points, total };
}

const sorter = (a, b) =>
  (b.points || 0) - (a.points || 0) ||
  (b.dr || 0) - (a.dr || 0) ||
  (b.gf || 0) - (a.gf || 0);

export default function Standings(){
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  useEffect(()=> {
    let on = true;
    (async ()=>{
      try{
        const league = import.meta.env.VITE_LEAGUE_SLUG || "";
        const r = await api.get("/api/standings", { params: { league } });
        if (!on) return;
        const arr = (Array.isArray(r.data) ? r.data : (r.data?.items || []))
          .map(normalizeRow)
          .sort(sorter);
        setRows(arr);
      }catch(e){
        setErr(e?.response?.data?.error || e.message);
        setRows([]);
      }
    })();
    return ()=> { on = false; };
  }, []);

  const hasTotal = useMemo(()=> (rows || []).some(x => x.total && x.total !== 0), [rows]);

  return (
    <>
      <SiteHeader />
      <main className="container-gz py-8">
        <h1 className="text-2xl font-black mb-4">Classifica</h1>
        {err && <p className="text-red-600 text-sm mb-3">{err}</p>}
        {!rows ? <Spinner/> : (
          // ⬇️ stesso background della mini standing
          <div className="rounded-2xl border border-black/5 dark:border-white/10 overflow-hidden bg-gradient-to-br from-white to-emerald-50 dark:from-zinc-900 dark:to-zinc-900/50 text-gray-900 dark:text-gray-100">
            <div className="overflow-auto">
              <table className="min-w-[820px] w-full text-sm">
                <thead>
                  <tr className="text-left bg-white/80 dark:bg-zinc-800/90 text-gray-700 dark:text-gray-100 border-b border-black/5 dark:border-white/10">
                    <th className="px-3 py-2 font-semibold">#</th>
                    <th className="px-3 py-2 font-semibold">Squadra</th>
                    <th className="px-3 py-2 text-right font-semibold">G</th>
                    <th className="px-3 py-2 text-right font-semibold">V</th>
                    <th className="px-3 py-2 text-right font-semibold">N</th>
                    <th className="px-3 py-2 text-right font-semibold">P</th>
                    <th className="px-3 py-2 text-right font-semibold">G+</th>
                    <th className="px-3 py-2 text-right font-semibold">G-</th>
                    <th className="px-3 py-2 text-right font-semibold">DR</th>
                    <th className="px-3 py-2 text-right font-semibold">PT</th>
                    {hasTotal && <th className="px-3 py-2 text-right font-semibold">PT Totali</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((t,i)=>{
                    const rank = i+1;
                    const pill =
                      rank === 1
                        ? "from-amber-400 to-amber-600 text-white"
                        : rank <= 3
                        ? "from-emerald-400 to-emerald-600 text-white"
                        : "from-gray-200 to-gray-300 text-gray-800 dark:from-white/10 dark:to-white/5 dark:text-white";

                    // zebra più visibile in dark
                    const zebra = i % 2 === 0
                      ? "bg-white/70 dark:bg-white/[0.07]"
                      : "bg-white/40 dark:bg-white/[0.04]";

                    return (
                      <tr
                        key={t.team}
                        className={`${zebra} border-t border-black/5 dark:border-white/10 hover:bg-black/[0.06] dark:hover:bg-white/10 transition-colors`}
                      >
                        <td className="px-3 py-2">
                          <span className={`text-[11px] font-black rounded-md px-2 py-1 bg-gradient-to-br ${pill}`}>
                            {rank}
                          </span>
                        </td>
                        <td className="px-3 py-2 font-medium">{t.team}</td>
                        <td className="px-3 py-2 text-right">{t.played}</td>
                        <td className="px-3 py-2 text-right">{t.won}</td>
                        <td className="px-3 py-2 text-right">{t.draw}</td>
                        <td className="px-3 py-2 text-right">{t.lost}</td>
                        <td className="px-3 py-2 text-right">{t.gf}</td>
                        <td className="px-3 py-2 text-right">{t.gs}</td>
                        <td className="px-3 py-2 text-right font-medium">{t.dr}</td>
                        <td className="px-3 py-2 text-right font-semibold">{t.points}</td>
                        {hasTotal && <td className="px-3 py-2 text-right">{t.total}</td>}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}






