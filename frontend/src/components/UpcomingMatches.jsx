import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function UpcomingMatches(){
  const [rows, setRows] = useState([]);

  useEffect(()=>{
    let on=true;
    (async ()=>{
      try{
        const league = import.meta.env.VITE_LEAGUE_SLUG || "";
        const r = await api.get("/api/results", { params: { league }});
        if(!on) return;
        const data = Array.isArray(r.data) ? r.data : [];
        const now = Date.now();
        const upcoming = data
          .filter(m => m.scheduledAt && Number(m.scheduledAt) > now && !m.scoreFinal)
          .sort((a,b)=> Number(a.scheduledAt)-Number(b.scheduledAt))
          .slice(0,6);
        setRows(upcoming);
      }catch{ setRows([]); }
    })();
    return ()=>{ on=false };
  }, []);

  return (
    <div className="card p-4">
      <h3 className="font-bold mb-3">Prossimo turno</h3>
      {rows.length ? (
        <div className="space-y-2 text-sm">
          {rows.map((m,i)=>(
            <div key={i} className="flex items-center justify-between gap-2">
              <div className="min-w-0 truncate">{m.home} vs {m.away}</div>
              <div className="text-xs px-2 py-1 rounded-lg text-white" style={{background:'var(--fc-primary)'}}>
                {m.round ? `G${m.round}` : '—'}
              </div>
            </div>
          ))}
        </div>
      ) : <div className="text-sm text-gray-500">In attesa di calendario.</div>}
    </div>
  );
}

