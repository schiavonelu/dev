import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function ResultsTicker(){
  const [rows, setRows] = useState([]);
  const [err, setErr] = useState("");

  useEffect(()=>{
    let ok = true;
    (async ()=>{
      try{
        const league = import.meta.env.VITE_LEAGUE_SLUG || "";
        const r = await api.get("/api/results", { params: { league }});
        if(!ok) return;
        const data = Array.isArray(r.data) ? r.data : [];
        // prendi l'ultima giornata
        const maxRound = data.reduce((m, x)=> Math.max(m, x.round||0), 0);
        const latest = data.filter(x => (x.round||0) === maxRound);
        setRows(latest);
      }catch(e){
        setErr(e?.response?.data?.error || e.message);
      }
    })();
    return ()=>{ ok=false };
  }, []);

  if (err || !rows.length) return null;

  return (
    <section className="border-y bg-white">
      <div className="container-gz py-3">
        <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
          <span className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded-lg text-white"
                style={{background:'var(--fc-accent)'}}>Risultati</span>
          {rows.map((m,i)=>(
            <div key={i} className="text-sm text-gray-800 whitespace-nowrap">
              <span className="font-medium">{m.home}</span> {m.scoreHome}-{m.scoreAway} <span className="font-medium">{m.away}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
