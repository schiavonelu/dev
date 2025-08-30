export default function FormationCard({ team, module, players = [], notes }){
  return (
    <div className="bg-white rounded-2xl shadow p-4">
      <div className="flex items-baseline justify-between">
        <h4 className="text-lg font-bold">{team}</h4>
        <span className="text-xs text-gray-500">{module}</span>
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-2 text-sm">
        {players.map((p,i)=> <li key={i} className="bg-gray-50 rounded px-2 py-1">{p}</li>)}
      </ul>
      {notes ? <p className="mt-3 text-xs text-gray-500">{notes}</p> : null}
    </div>
  );
}