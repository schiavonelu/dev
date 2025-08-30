import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { api } from "../api/client";
import Spinner from "../components/Spinner";

export default function Formations(){
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  useEffect(()=>{
    let on=true;
    (async ()=>{
      try{
        const league = import.meta.env.VITE_LEAGUE_SLUG || "";
        const r = await api.get("/api/formations", { params: { league }});
        if(!on) return;
        setRows(Array.isArray(r.data) ? r.data : []);
      }catch(e){ setErr(e?.response?.data?.error || e.message); }
    })();
    return ()=>{ on=false };
  }, []);

  return (
    <>
      <SiteHeader />
      <main className="container-gz py-8">
        <h1 className="text-2xl font-black mb-4">Formazioni</h1>
        {err && <p className="text-red-600 text-sm mb-3">{err}</p>}
        {!rows ? <Spinner/> : (
          <div className="grid md:grid-cols-2 gap-6">
            {rows.map((f,i)=>(
              <div key={i} className="card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-bold">{f.team}</div>
                  <div className="text-xs text-gray-500">{f.round ? `G${f.round}` : ''}</div>
                </div>
                <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                  {(f.players || []).map((p, j)=> <li key={j} className="truncate">• {p}</li>)}
                </ul>
                {f.notes ? <p className="text-xs text-gray-500 mt-2">{f.notes}</p> : null}
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}

