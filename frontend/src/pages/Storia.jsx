// src/pages/Storia.jsx
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import Breadcrumbs from "../components/Breadcrumbs";
import { History, Trophy, CalendarDays, BookText } from "lucide-react";
import { Link } from "react-router-dom";

export default function Storia(){
  return (
    <>
      <SiteHeader />

      <main className="container-gz py-6 space-y-6">
        {/* Breadcrumb */}
        <Breadcrumbs items={[
          { to: "/", label: "Home" },
          { label: "Storia", icon: <History size={14}/> }
        ]}/>

        {/* Hero intro */}
        <section className="card overflow-hidden">
          <div className="relative p-6 md:p-10">
            <div
              className="absolute inset-0 pointer-events-none opacity-[.10]"
              style={{ background: 'radial-gradient(1200px 400px at 0% 0%, var(--fc-primary), transparent), radial-gradient(1200px 400px at 100% 100%, var(--fc-accent), transparent)' }}
            />
            <h1 className="relative text-3xl md:text-4xl font-black mb-2">La nostra storia</h1>
            <p className="relative text-lg text-gray-600 max-w-3xl text-justify">
              La Carogna League è giunta alla <strong>XVI edizione</strong>: un traguardo storico, nato nel 2009 e
              alimentato da amicizia, competizione leale e una grande passione per il calcio.
              Poche regole chiare, tanta continuità: è questo il nostro segreto.
            </p>
          </div>
        </section>

        {/* Blocco "cenni storici" */}
        <article className="card p-6 prose max-w-none text-justify">
          <h2>Le origini</h2>
          <p className="mb-4">
            La lega nasce nel 2009 dall’idea di un gruppo di amici e colleghi accomunati dalla stessa passione:
            parlare di calcio, sfidarsi ogni weekend e condividere il rito del fantacalcio. Fin da subito la
            filosofia è stata semplice: mantenere una struttura familiare, migliorando la qualità anno dopo anno
            senza snaturare l’identità della competizione.
          </p>

          <h2>Evoluzione e tradizione</h2>
          <p className="mb-4">
            Con il passare delle stagioni sono arrivate piccole ma significative innovazioni: nuove competizioni
            interne, regole più chiare, strumenti digitali per gestire rose e risultati, contenuti editoriali e
            momenti di condivisione. La tradizione però è rimasta il riferimento: asta, regolamento “essenziale” e
            fair play. Oggi le colonne portanti sono ancora gli stessi amici che hanno acceso la scintilla: la
            loro costanza ha reso la Carogna League una realtà solida e longeva.
          </p>

          <h2 className="mb-4">Lo spirito della League</h2>
          <ul>
            <li className="mb-2"><strong>Amicizia prima di tutto</strong>: la competizione è dura, ma il rispetto non manca mai.</li>
            <li className="mb-2"><strong>Continuità</strong>: poche modifiche, tutte ragionate, per una lega riconoscibile.</li>
            <li className="mb-4"><strong>Passione</strong>: il fantacalcio è un gioco, ma lo viviamo con serietà e cura dei dettagli.</li>
          </ul>

          <h2>Momenti e rivalità</h2>
          <p className="mb-4">
            Dalle rimonte impossibili ai gol all’ultimo minuto del posticipo del lunedì: ogni edizione ha scritto
            pagine indimenticabili. Le rivalità sportive si sono trasformate in racconti che, stagione dopo stagione,
            alimentano il folklore della lega.
          </p>

          <h2 className="mb-4">Record & Hall of Fame</h2>
          <ul>
            <li className="mb-2"><strong>Edizioni disputate:</strong> 16</li>
            <li className="mb-2"><strong>Albo d’oro:</strong> consulta la pagina dedicata per scoprire tutte le squadre campioni.</li>
            <li className="mb-4"><strong>Record singoli:</strong> punti stagionali, serie utili, capocannoniere… in aggiornamento.</li>
          </ul>

          <h2>Guardando avanti</h2>
          <p className="mb-4">
            Continueremo a migliorare l’esperienza della lega: contenuti editoriali, statistiche, calendario e
            strumenti per seguire tutto con facilità. La tradizione resta il faro, l’innovazione la nostra bussola.
            Buon fantacalcio a tutti!
          </p>
        </article>

        {/* I numeri in breve */}
        <section className="grid gap-4 sm:grid-cols-3">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="text-yellow-600" /> <h3 className="font-bold">Albo d’oro</h3>
            </div>
            <p className="text-sm text-gray-600">
              Scopri tutte le squadre campioni delle 16 edizioni.
            </p>
            <Link to="/albo-d-oro" className="btn btn-outline mt-3">Vai all’albo</Link>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3 mb-2">
              <CalendarDays className="text-emerald-600" /> <h3 className="font-bold">Competizioni</h3>
            </div>
            <p className="text-sm text-gray-600">
              Dalla prima giornata di campionato alle finali di coppe europee: tutte le date che contano.
            </p>
            <Link to="/competizioni" className="btn btn-outline mt-3">Vedi competizioni</Link>
          </div>

          <div className="card p-5">
            <div className="flex items-center gap-3 mb-2">
              <BookText className="text-sky-600" /> <h3 className="font-bold">Regolamento</h3>
            </div>
            <p className="text-sm text-gray-600">
              Tradizione, poche regole chiare e fair play. Il nostro modo di giocare.
            </p>
            <Link to="/regolamento" className="btn btn-outline mt-3">Vai al regolamento</Link>
          </div>
        </section>

        {/* Timeline semplice */}
        <section className="card p-6">
          <h2 className="text-xl font-black mb-4">Cronologia essenziale</h2>
          <ol className="relative border-l pl-6" style={{borderColor:'var(--fc-border)'}}>
            <li className="mb-6">
              <div className="w-2 h-2 rounded-full bg-[var(--fc-primary)] absolute -left-1.5 mt-2" />
              <h3 className="font-semibold">2009 – Fondazione</h3>
              <p className="text-sm text-gray-600">
                Nasce la Carogna League: gruppo di amici e colleghi, prima asta “storica”.
              </p>
            </li>
            <li className="mb-6">
              <div className="w-2 h-2 rounded-full bg-[var(--fc-primary)] absolute -left-1.5 mt-2" />
              <h3 className="font-semibold">2010–2016 – Consolidamento</h3>
              <p className="text-sm text-gray-600">
                Regole affinate, prime rivalità, contenuti editoriali e statistiche.
              </p>
            </li>
            <li className="mb-6">
              <div className="w-2 h-2 rounded-full bg-[var(--fc-primary)] absolute -left-1.5 mt-2" />
              <h3 className="font-semibold">2017–2023 – Nuove competizioni</h3>
              <p className="text-sm text-gray-600">
                Coppe e format speciali arricchiscono il calendario senza snaturare la tradizione.
              </p>
            </li>
            <li>
              <div className="w-2 h-2 rounded-full bg-[var(--fc-primary)] absolute -left-1.5 mt-2" />
              <h3 className="font-semibold">2024–oggi – XVI edizione</h3>
              <p className="text-sm text-gray-600">
                La lega è un appuntamento fisso: community, articoli, risultati e classifica in tempo reale.
              </p>
            </li>
          </ol>
        </section>

        {/* CTA finale */}
        <section className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-black">Vuoi ripercorrere tutte le stagioni?</h3>
            <p className="text-sm text-gray-600">
              Consulta albo d’oro, competizioni e articoli d’archivio.
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/albo-d-oro" className="btn btn-primary">Albo d’oro</Link>
            <Link to="/competizioni" className="btn btn-outline">Competizioni</Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}


