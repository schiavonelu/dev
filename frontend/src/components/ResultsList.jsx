export default function ResultsList({ matches = [] }){
  if(!matches.length){
    return <div className="bg-white rounded-2xl shadow p-4 text-sm text-gray-500">Nessun risultato disponibile.</div>;
  }
  return (
    <div className="bg-white rounded-2xl shadow divide-y">
      {matches.map((m,i)=>(
        <div key={i} className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-500">G.{m.round ?? "-"}</span>
            <span className="font-medium">{m.home}</span>
            <span className="px-2 tabular-nums font-bold">
              {Number.isFinite(m.scoreHome) && Number.isFinite(m.scoreAway) ? `${m.scoreHome} - ${m.scoreAway}` : "-"}
            </span>
            <span className="font-medium">{m.away}</span>
          </div>
          <div className="text-xs text-gray-400">{m.date ? new Date(m.date).toLocaleString() : ""}</div>
        </div>
      ))}
    </div>
  );
}