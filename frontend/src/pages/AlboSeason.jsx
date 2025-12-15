import { useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Breadcrumbs from "../components/Breadcrumbs";
import { Trophy } from "lucide-react";
import seasonsData from "../data/albodoro.json";

const fromSlug = (s) => String(s).replaceAll("-", "/");

export default function AlboSeason(){
  const { season: slug } = useParams();
  const seasonKey = fromSlug(slug || "");
  const seasons = useMemo(
    () => (Array.isArray(seasonsData?.seasons) ? seasonsData.seasons : []),
    []
  );
  const data = useMemo(
    () => seasons.find((s) => String(s.season) === String(seasonKey)),
    [seasons, seasonKey]
  );

  if (!data) return <Navigate to="/albo-d-oro" replace />;

  return (
    <>
      <SiteHeader />
      <main className="container-gz py-8 space-y-6">
        <Breadcrumbs items={[
          { to: '/', label: 'Home' },
          { to: '/albo-d-oro', label: 'Albo d’oro', icon: <Trophy size={14}/> },
          { label: data.season }
        ]}/>

        <header className="flex items-center justify-between">
          <h1 className="text-2xl font-black">
            Stagione {data.season}
          </h1>
          <Link to="/albo-d-oro" className="btn btn-outline">Torna all’albo</Link>
        </header>

        {/* Podio */}
        <section className="grid md:grid-cols-3 gap-4">
          <div className="card p-5">
            <div className="badge-medal badge-gold mb-2">1</div>
            <div className="text-sm text-gray-500">Campione</div>
            <div className="text-lg font-bold">{data.champion}</div>
            {data.championManager && (
              <div className="text-xs text-gray-500 mt-1">Allenatore: {data.championManager}</div>
            )}
          </div>
          <div className="card p-5">
            <div className="badge-medal badge-bronze mb-2">2</div>
            <div className="text-sm text-gray-500">Secondo</div>
            <div className="text-lg font-bold">{data.runnerUp}</div>
            {data.runnerUpManager && (
              <div className="text-xs text-gray-500 mt-1">Allenatore: {data.runnerUpManager}</div>
            )}
          </div>
          <div className="card p-5">
            <div className="badge-medal badge-bronze mb-2">3</div>
            <div className="text-sm text-gray-500">Terzo</div>
            <div className="text-lg font-bold">{data.third}</div>
            {data.thirdManager && (
              <div className="text-xs text-gray-500 mt-1">Allenatore: {data.thirdManager}</div>
            )}
          </div>
        </section>

        {/* Altre competizioni */}
        <section className="card p-5">
          <h2 className="text-lg font-bold mb-3">Competizioni</h2>
          {data.competitions?.length ? (
            <div className="relative max-h-[60vh] overflow-y-auto">
              <table className="min-w-full text-sm table-soft">
                <thead className="sticky top-0 z-20 bg-slate-100/80 dark:bg-slate-800/70 backdrop-blur">
                  <tr>
                    <th className="px-4 py-2 text-left">Competizione</th>
                    <th className="px-4 py-2 text-left">Vincitore</th>
                  </tr>
                </thead>
                <tbody>
                  {data.competitions.map((c, i)=>(
                    <tr key={i} className="hover:bg-slate-50 dark:hover:bg-white/5">
                      <td className="px-4 py-2">{c.name}</td>
                      <td className="px-4 py-2">{c.winner || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-sm text-gray-500">Nessun dato registrato.</div>
          )}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

