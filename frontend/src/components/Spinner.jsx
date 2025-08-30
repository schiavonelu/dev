export default function Spinner(){
  return (
    <div className="py-10 text-center text-gray-400">
      <svg className="mx-auto h-7 w-7 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4A4 4 0 008 12H4z"/>
      </svg>
      <div className="mt-2 text-sm">Caricamento…</div>
    </div>
  );
}

