import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function StandingsWidget(){
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(()=> {
    let ok = true;
    (async ()=>{
      try{
        const league = import.meta.env.VITE_LEAGUE_SLUG || "";
        const r = await api.get("/api/standings", { params: { league } });
        if(!ok) return;
        const data = Array.isArray(r.data) ? r.data : (r.data.items || []);
        data.sort((a,b)=>
          (b.points||0)-(a.points||0) ||
          ((b.gf||0)-(b.gs||0)) - ((a.gf||0)-(a.gs||0)) ||
          (b.gf||0)-(a.gf||0)
        );
        setRows(data.slice(0,6));
      }catch(e){
        setErr(e?.response?.data?.error || e.message);
      }
    })();
    return ()=>{ ok=false };
  }, []);

  if (err) return null;

  return (
    <section className="container-gz py-8">
      <div className="card p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold">Classifica</h2>
          <a href="/classifica" className="text-sm" style={{color:'var(--fc-primary)'}}>Vedi tutto</a>
        </div>
        <div className="divide-y">
          {rows.length ? rows.map((t, i)=>(
            <div key={t.team} className="py-2 grid grid-cols-[2rem_1fr_auto] items-center gap-3">
              <div className="text-right font-bold text-gray-500">{i+1}</div>
              <div className="truncate">{t.team}</div>
              <div className="font-semibold">{t.points ?? 0}</div>
            </div>
          )) : <div className="text-sm text-gray-500 py-4">Classifica non disponibile.</div>}
        </div>
      </div>
    </section>
  );
}

