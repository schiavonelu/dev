import { useEffect, useMemo, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { api } from "../api/client";
import Spinner from "../components/Spinner";

export default function Results(){
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  useEffect(()=>{
    let on=true;
    (async ()=>{
      try{
        const league = import.meta.env.VITE_LEAGUE_SLUG || "";
        const r = await api.get("/api/results", { params: { league }});
        if(!on) return;
        setRows(Array.isArray(r.data) ? r.data : []);
      }catch(e){ setErr(e?.response?.data?.error || e.message); }
    })();
    return ()=>{ on=false };
  }, []);

  const byRound = useMemo(()=>{
    const m = new Map();
    (rows||[]).forEach(x=>{
      const k = x.round || 0;
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(x);
    });
    return Array.from(m.entries()).sort((a,b)=> b[0]-a[0]); // round desc
  }, [rows]);

  return (
    <>
      <SiteHeader />
      <main className="container-gz py-8">
        <h1 className="text-2xl font-black mb-4">Risultati</h1>
        {err && <p className="text-red-600 text-sm mb-3">{err}</p>}
        {!rows ? <Spinner/> : (
          <div className="space-y-6">
            {byRound.map(([round, list])=>(
              <section key={round} className="card p-4">
                <h2 className="font-bold mb-3">Giornata {round}</h2>
                <div className="divide-y">
                  {list.map((m,i)=>(
                    <div key={i} className="py-2 grid grid-cols-[1fr_auto_1fr] gap-3 items-center">
                      <div className="truncate text-right">{m.home}</div>
                      <div className="font-semibold text-center">
                        {m.scoreFinal ? `${m.scoreHome}-${m.scoreAway}` : 'vs'}
                      </div>
                      <div className="truncate">{m.away}</div>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

