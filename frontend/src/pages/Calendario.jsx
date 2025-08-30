import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

export default function Calendario(){
  return (
    <>
      <SiteHeader />
      <main className="container-gz py-8">
        <h1 className="text-2xl font-black mb-4">Calendario</h1>
        <div className="card p-6">
          <p className="text-sm text-gray-600">Calendario completo delle giornate. Sarà popolato automaticamente dalla sorgente leghe.fantacalcio appena collegata.</p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
