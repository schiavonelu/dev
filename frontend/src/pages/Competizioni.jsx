import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { useMemo, useState } from "react";
import calendario from "../data/competizioni.json"; // <— usa il JSON rigenerato

function Badge({ children, tone = "default" }) {
  const base =
    "inline-flex items-center justify-center px-2.5 py-1 rounded-full text-xs font-semibold border transition-colors";
  const cls = {
    default: base + " bg-gray-100 border-gray-200 text-gray-700 dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-200",
    campionato: base + " bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-200",
    uefa: base + " bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/30 dark:border-blue-800 dark:text-blue-200",
    ucl: base + " bg-indigo-50 border-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:border-indigo-800 dark:text-indigo-200",
    el: base + " bg-amber-50 border-amber-200 text-amber-700 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-200",
    conf: base + " bg-teal-50 border-teal-200 text-teal-700 dark:bg-teal-900/30 dark:border-teal-800 dark:text-teal-200",
    coppa: base + " bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-900/30 dark:border-rose-800 dark:text-rose-200",
    ti: base + " bg-fuchsia-50 border-fuchsia-200 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:border-fuchsia-800 dark:text-fuchsia-200",
  };
  return <span className={cls[tone] ?? cls.default}>{children}</span>;
}

export default function Competizioni() {
  const [q, setQ] = useState("");

  const rows = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return calendario;
    return calendario.filter((r) =>
      String(r.g ?? "").includes(term) ||
      (r.campionato ?? "").toLowerCase().includes(term) ||
      (r.uefa ?? "").toLowerCase().includes(term) ||
      (r.ucl ?? "").toLowerCase().includes(term) ||
      (r.el ?? "").toLowerCase().includes(term) ||
      (r.conf ?? "").toLowerCase().includes(term) ||
      (r.coppa ?? "").toLowerCase().includes(term) ||
      (r.ti ?? "").toLowerCase().includes(term)
    );
  }, [q]);

  return (
    <>
      <SiteHeader />
      <main className="container-gz py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-black tracking-tight">Competizioni</h1>
        </div>

        <div className="card p-4 md:p-6 bg-white dark:bg-neutral-900/70 border border-gray-200 dark:border-neutral-800">
          

          <div className="mb-4 flex items-center gap-2">
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Cerca: giornata o voce (es. ‘Girone’, ‘Quarti’, ‘Finale’, ‘Torneo Intermedio’)…"
              className="w-full md:w-96 input bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-400"
            />
          </div>

          {/* wrapper con scroll e header sticky (anche mobile) */}
          <div className="rounded-2xl border border-gray-200 dark:border-neutral-800 overflow-x-auto">
            <div className="max-h-[70vh] overflow-auto">
              <table className="min-w-full text-sm">
                <thead className="sticky top-0 z-20 bg-gray-50/90 dark:bg-neutral-900/90 backdrop-blur">
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-neutral-200">Giornata</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-neutral-200 text-center">Campionato</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-neutral-200 text-center">UEFA CUP</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-neutral-200 text-center">CHAMPIONS LEAGUE</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-neutral-200 text-center">EUROPA LEAGUE</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-neutral-200 text-center">CONFERENCE</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-neutral-200 text-center">COPPA ITALIA</th>
                    <th className="px-4 py-3 font-semibold text-gray-700 dark:text-neutral-200 text-center">TORNEO INTERMEDIO</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                  {rows.map((r) => (
                    <tr key={String(r.g) + (r.campionato ?? "")} className="hover:bg-gray-50/60 dark:hover:bg-neutral-800/60">
                      <td className="px-4 py-3 font-semibold text-gray-900 dark:text-neutral-100">{r.g ?? "—"}{r.g ? "°" : ""}</td>

                      <td className="px-4 py-3 text-center">{r.campionato ? <Badge tone="campionato">{r.campionato}</Badge> : <span className="text-gray-400 dark:text-neutral-500">—</span>}</td>
                      <td className="px-4 py-3 text-center">{r.uefa ? <Badge tone="uefa">{r.uefa}</Badge> : <span className="text-gray-400 dark:text-neutral-500">—</span>}</td>
                      <td className="px-4 py-3 text-center">{r.ucl ? <Badge tone="ucl">{r.ucl}</Badge> : <span className="text-gray-400 dark:text-neutral-500">—</span>}</td>
                      <td className="px-4 py-3 text-center">{r.el ? <Badge tone="el">{r.el}</Badge> : <span className="text-gray-400 dark:text-neutral-500">—</span>}</td>
                      <td className="px-4 py-3 text-center">{r.conf ? <Badge tone="conf">{r.conf}</Badge> : <span className="text-gray-400 dark:text-neutral-500">—</span>}</td>
                      <td className="px-4 py-3 text-center">{r.coppa ? <Badge tone="coppa">{r.coppa}</Badge> : <span className="text-gray-400 dark:text-neutral-500">—</span>}</td>
                      <td className="px-4 py-3 text-center">{r.ti ? <Badge tone="ti">{r.ti}</Badge> : <span className="text-gray-400 dark:text-neutral-500">—</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 text-xs text-gray-500 dark:text-neutral-400">
            Ad ogni giornata di Campionato di Serie A corrisponde una o più competizioni della nostra lega.
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}









