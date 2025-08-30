import { useMemo, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Breadcrumbs from "../components/Breadcrumbs";
import { Trophy, Users } from "lucide-react";

// dati statici (generati dall’Excel)
import seasonsData from "../data/albodoro.json";
import palmaresData from "../data/palmares.json";

// helper per slug stagione "2009-2010" <-> "2009/2010"
const toSlug = (s) => String(s).replaceAll("/", "-");

// helper per dividere "Squadra (Allenatore)" → { team, coach }
const splitTeamCoach = (s) => {
  const m = String(s ?? "").match(/^(.*?)(?:\s*\((.*?)\))?$/);
  return {
    team: m ? m[1].trim() : String(s ?? ""),
    coach: m && m[2] ? m[2].trim() : null,
  };
};

export default function AlboDoro(){
  const [tab, setTab] = useState("campioni");

  const seasons = useMemo(()=> (
    Array.isArray(seasonsData?.seasons) ? [...seasonsData.seasons] : []
  ), []);
  seasons.sort((a,b)=> String(b.season).localeCompare(String(a.season)));

  const palmares = useMemo(()=> (
    Array.isArray(palmaresData?.palmares) ? [...palmaresData.palmares] : []
  ), []);

  // individua dinamicamente le coppe presenti nel dataset
  const cupSet = useMemo(()=>{
    const set = new Set();
    seasons.forEach(s => s.competitions?.forEach(c => set.add(c.name)));
    // Ordine “classico”
    const order = ["Champions League","Europa League","Coppa Italia","Conference League"];
    const rest = [...set].filter(x => !order.includes(x)).sort();
    return [...order.filter(x=>set.has(x)), ...rest];
  }, [seasons]);

  return (
    <>
      <SiteHeader />
      <main className="min-h-screen relative">
        {/* soft background that adapts to dark mode */}
        <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900"/>

        <section className="container-gz py-8 space-y-6">
          <Breadcrumbs items={[
            { to: '/', label: 'Home' },
            { label: 'Albo d’oro', icon: <Trophy size={14}/> }
          ]}/>

          <header className="flex items-center justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-slate-100">Albo d’oro</h1>
            {/* Tabs – mobile compatti */}
            <div className="flex gap-2 ml-auto">
              <button
                aria-pressed={tab==='campioni'}
                aria-label="Vedi campioni"
                className={`btn ${tab==='campioni' ? 'btn-primary' : 'btn-outline'} rounded-2xl px-3 py-2 transition shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:focus-visible:ring-indigo-400/60`}
                onClick={()=>setTab('campioni')}
              >
                <Trophy size={16} className="mr-2"/> Campioni
              </button>
              <button
                aria-pressed={tab==='palmares'}
                aria-label="Vedi palmarès"
                className={`btn ${tab==='palmares' ? 'btn-primary' : 'btn-outline'} rounded-2xl px-3 py-2 transition shadow-sm hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/60 dark:focus-visible:ring-indigo-400/60`}
                onClick={()=>setTab('palmares')}
              >
                <Users size={16} className="mr-2"/> Palmarès
              </button>
            </div>
          </header>


          
          {tab === 'campioni' ? (
            <section className="card overflow-x-auto rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur">
              <div className="relative max-h-[70vh] overflow-y-auto">
                {/* edge fade for horizontal scroll */}
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-slate-900"/>
                <table className="min-w-full text-sm table-soft">
                  <thead className="sticky top-0 z-20 bg-slate-100/80 dark:bg-slate-800/70 backdrop-blur">
                    <tr className="text-slate-700 dark:text-slate-200">
                      <th className="px-4 py-2 text-left w-40">Stagione</th>
                      <th className="px-4 py-2 text-left">Campione</th>
                      <th className="px-4 py-2 text-left hidden sm:table-cell">2°</th>
                      <th className="px-4 py-2 text-left hidden md:table-cell">3°</th>
                      {cupSet.map((c)=>(
                        <th key={c} className="px-4 py-2 text-left whitespace-nowrap hidden lg:table-cell">{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-white/10">
                    {seasons.map((s, i)=>{
                      const ch = splitTeamCoach(s.champion);
                      const ru = splitTeamCoach(s.runnerUp);
                      const th = splitTeamCoach(s.third);
                      return (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5">
                          <td className="px-4 py-2 font-semibold text-slate-900 dark:text-slate-100">
                            <a className="footer-link px-0 py-0 underline decoration-slate-300/70 decoration-2 underline-offset-4 hover:decoration-indigo-400 dark:decoration-white/20"
                               href={`/albo-d-oro/${toSlug(s.season)}`}>
                              {s.season}
                            </a>
                          </td>
                          <td className="px-4 py-2 text-slate-800 dark:text-slate-200">
                            <div className="flex items-start gap-2">
                              <span className="badge-medal badge-gold mt-0.5">1</span>
                              <div>
                                <div className="leading-tight">{ch.team}</div>
                                {ch.coach && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">({ch.coach})</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 hidden sm:table-cell text-slate-700 dark:text-slate-300">
                            <div className="flex items-start gap-2">
                              <span className="badge-medal badge-bronze mt-0.5">2</span>
                              <div>
                                <div className="leading-tight">{ru.team}</div>
                                {ru.coach && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">({ru.coach})</div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-2 hidden md:table-cell text-slate-700 dark:text-slate-300">
                            <div className="flex items-start gap-2">
                              <span className="badge-medal badge-bronze mt-0.5">3</span>
                              <div>
                                <div className="leading-tight">{th.team}</div>
                                {th.coach && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">({th.coach})</div>
                                )}
                              </div>
                            </div>
                          </td>
                          {cupSet.map((name)=>{
                            const w = splitTeamCoach(s.competitions?.find(c=>c.name===name)?.winner || "—");
                            return (
                              <td key={name} className="px-4 py-2 hidden lg:table-cell text-slate-700 dark:text-slate-300">
                                <div className="leading-tight">{w.team}</div>
                                {w.coach && w.team !== "—" && (
                                  <div className="text-xs text-slate-500 dark:text-slate-400 leading-tight">({w.coach})</div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          ) : (
            <section className="card overflow-x-auto rounded-2xl border border-slate-200/70 dark:border-white/10 bg-white/70 dark:bg-slate-900/50 backdrop-blur">
              <div className="relative max-h-[70vh] overflow-y-auto">
                <div className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-slate-900"/>
                <table className="min-w-full text-sm table-soft">
                  <thead className="sticky top-0 z-20 bg-slate-100/80 dark:bg-slate-800/70 backdrop-blur">
                    <tr className="text-slate-700 dark:text-slate-200">
                      <th className="px-4 py-2 text-left">Squadra</th>
                      <th className="px-4 py-2 text-center">Campionati</th>
                      <th className="px-4 py-2 text-center hidden sm:table-cell">2°</th>
                      <th className="px-4 py-2 text-center hidden md:table-cell">3°</th>
                      <th className="px-4 py-2 text-center hidden md:table-cell">Piazzamenti</th>
                      {cupSet.map((c)=>(
                        <th key={c} className="px-4 py-2 text-center whitespace-nowrap hidden lg:table-cell">{c}</th>
                      ))}
                      <th className="px-4 py-2 text-center">Coppe tot.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200/70 dark:divide-white/10">
                    {palmares.map((r,i)=>{
                      const t = splitTeamCoach(r.team);
                      return (
                        <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5">
                          <td className="px-4 py-2 font-semibold text-slate-900 dark:text-slate-100">
                            <div className="leading-tight">{t.team}</div>
                            {t.coach && (
                              <div className="text-xs font-normal text-slate-500 dark:text-slate-400 leading-tight">({t.coach})</div>
                            )}
                          </td>
                          <td className="px-4 py-2 text-center text-slate-800 dark:text-slate-200">{r.championships}</td>
                          <td className="px-4 py-2 text-center hidden sm:table-cell text-slate-700 dark:text-slate-300">{r.runnerUps}</td>
                          <td className="px-4 py-2 text-center hidden md:table-cell text-slate-700 dark:text-slate-300">{r.thirds}</td>
                          <td className="px-4 py-2 text-center hidden md:table-cell text-slate-700 dark:text-slate-300">{r.placements}</td>
                          {cupSet.map((c)=>(
                            <td key={c} className="px-4 py-2 text-center hidden lg:table-cell text-slate-700 dark:text-slate-300">{r.cups?.[c] ?? 0}</td>
                          ))}
                          <td className="px-4 py-2 text-center font-semibold text-slate-900 dark:text-slate-100">{r.cupsTotal}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}




