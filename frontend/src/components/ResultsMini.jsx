// src/components/ResultsMini.jsx
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function ResultsMini(){
  const [rows, setRows] = useState([]);

  useEffect(()=>{
    let on=true;
    (async ()=>{
      try{
        const league = import.meta.env.VITE_LEAGUE_SLUG || "";
        const r = await api.get("/api/results", { params: { league }});
        if(!on) return;
        const data = Array.isArray(r.data) ? r.data : [];
        const maxRound = data.reduce((m,x)=> Math.max(m, x.round||0), 0);
        const latest = data.filter(x => (x.round||0) === maxRound);
        // ordina alfabetico per avere layout stabile
        latest.sort((a,b)=> (a.home||'').localeCompare(b.home||''));
        setRows(latest);
      }catch{ setRows([]); }
    })();
    return ()=>{ on=false };
  }, []);

  return (
    <div className="card p-4">
      <h3 className="font-bold mb-3">Risultati giornata</h3>
      {rows.length ? (
        <div className="space-y-2">
          {rows.map((m,i)=>(
            <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-sm">
              <div className="truncate text-right">{m.home}</div>
              <div className="font-semibold text-center">
                {m.scoreFinal ? `${m.scoreHome}-${m.scoreAway}` : 'vs'}
              </div>
              <div className="truncate">{m.away}</div>
            </div>
          ))}
        </div>
      ) : <div className="text-sm text-gray-500">Nessun risultato disponibile.</div>}
    </div>
  );
}
