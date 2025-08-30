import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { api } from "../api/client";
import Spinner from "../components/Spinner";

export default function Rose(){
  const [rows, setRows] = useState(null);
  const [err, setErr] = useState("");

  useEffect(()=>{
    let on=true;
    (async ()=>{
      try{
        const league = import.meta.env.VITE_LEAGUE_SLUG || "";
        // in attesa di endpoint /api/rosters, usiamo formations come base
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
        <h1 className="text-2xl font-black mb-4">Rose</h1>
        {err && <p className="text-red-600 text-sm mb-3">{err}</p>}
        {!rows ? <Spinner/> : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rows.map((f,i)=>(
              <div key={i} className="card p-4">
                <div className="font-bold mb-2">{f.team}</div>
                <ul className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
                  {(f.players || []).map((p, j)=> <li key={j} className="truncate">• {p}</li>)}
                </ul>
              </div>
            ))}
          </div>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
