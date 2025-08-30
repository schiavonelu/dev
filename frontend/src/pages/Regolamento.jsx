import { useMemo, useRef, useState, useEffect } from "react";
import { Search, Download, Trophy } from "lucide-react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import regolamentoPdf from "../assets/Regolamento-CarognaLeague-2025-26.pdf?url"; // <-- metti il PDF in src/assets/

// --- helpers ---
function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Highlight({ text, query }) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-amber-200 text-amber-900 px-0.5 rounded">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </>
  );
}

function AccordionItem({ id, title, children, isOpen, onToggle }) {
  return (
    <section id={id} className="border rounded-2xl bg-white/80 shadow-sm overflow-hidden transition">
      <button
        type="button"
        onClick={onToggle}
        className={classNames(
          "w-full text-left px-5 py-4 flex items-center gap-3 border-l-4 transition-colors",
          isOpen ? "bg-amber-50 border-amber-500" : "bg-white border-transparent hover:bg-neutral-50"
        )}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
      >
        <span
          className={classNames(
            "inline-flex h-8 w-8 items-center justify-center rounded-xl border text-xl font-bold",
            isOpen ? "bg-white text-amber-600" : "bg-neutral-50 text-amber-700"
          )}
        >
          {isOpen ? "–" : "+"}
        </span>
        <h2 className="text-lg font-bold text-amber-800">{title}</h2>
      </button>

      <div
        id={`${id}-content`}
        className={classNames(
          "transition-[max-height] duration-300 ease-in-out",
          isOpen ? "max-h-[9999px]" : "max-h-0"
        )}
      >
        <div className="p-5 pt-0">
          <article className="prose max-w-none">{children}</article>
        </div>
      </div>
    </section>
  );
}

export default function Regolamento() {
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState({});
  const containerRef = useRef(null);

  // --- sezioni del regolamento (COMPLETE) ---
  const sections = useMemo(
    () => [
      {
        id: "durata-composizione",
        title: "Durata e composizione della Lega",
        content: (
          <>
            <p>
              Il fantacalcio inizia l’11 settembre 2025 (~19:00) con la fantasta, partendo dalla 3ª giornata di Serie A,
              e termina alla 38ª giornata.
            </p>
            <p>
              La Lega è composta da 10 fantasquadre e segue in ogni sua parte il calendario ufficiale Serie A 2025/26.
              Anticipi, posticipi o recuperi disposti da FIGC/Lega Serie A valgono anche qui.
            </p>
          </>
        ),
      },
      {
        id: "asta",
        title: "Asta del Fantacalcio",
        content: (
          <>
            <p>
              L’asta si svolge su Fantalab. Ordine chiamata: Portieri → Difensori → Centrocampisti → Attaccanti.
              Prima chiamata: SCHALKE 104; poi chi ha più slot liberi nel ruolo successivo.
            </p>
            <ul>
              <li>In caso di problemi tecnici si avvisa su WhatsApp; l’asta può essere ripetuta o ripresa.</li>
              <li>Timer: prima chiamata 10s, ogni rilancio 7s.</li>
              <li>Lista calciatori online dal 2 settembre 2025.</li>
            </ul>
          </>
        ),
      },
      {
        id: "rose-formazioni",
        title: "Composizione delle rose e formazioni",
        content: (
          <>
            <p>Budget: 500 Magic Milioni (base d’asta 1). Rosa di 25 calciatori:</p>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th>Ruolo</th>
                    <th>Numero calciatori</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Portieri</td>
                    <td>3</td>
                  </tr>
                  <tr>
                    <td>Difensori</td>
                    <td>8</td>
                  </tr>
                  <tr>
                    <td>Centrocampisti</td>
                    <td>8</td>
                  </tr>
                  <tr>
                    <td>Attaccanti</td>
                    <td>6</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">Moduli ammessi:</p>
            <ul className="grid grid-cols-2 sm:grid-cols-4 gap-2 not-prose">
              {["3-4-3", "3-5-2", "4-5-1", "4-4-2", "4-3-3", "5-4-1", "5-3-2"].map((m) => (
                <li key={m} className="px-3 py-2 rounded-xl border text-sm text-center">
                  {m}
                </li>
              ))}
            </ul>
            <p className="mt-4">
              Formazione: 11 titolari + 14 panchinari (senza ordine). Attivo lo <em>switch</em> che sostituisce un
              titolare non partente con un panchinaro pre-selezionato senza contare cambio.
            </p>
            <p>
              Se non schieri la squadra, vale la formazione precedente. In caso di problemi, puoi inviarla entro l’orario
              della prima partita nel gruppo WhatsApp (fa fede l’orario del messaggio). La formazione salvata vale per tutte
              le competizioni.
            </p>
          </>
        ),
      },
      {
        id: "mercato",
        title: "Mercato e aggiornamento delle rose",
        content: (
          <>
            <p>Valori variabili per giornata. Non si può andare in passivo e le sostituzioni devono rispettare il ruolo.</p>
            <p>
              Max 27 compravendite stagionali (di cui 8 scambi). Sostituzione sempre aperta per chi lascia la Serie A, salvo
              la finestra di gennaio.
            </p>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr>
                    <th>Periodo Serie A</th>
                    <th>Cambi consentiti</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>3ª – 10ª</td>
                    <td>8 scambi</td>
                    <td>Regolamentati al punto 6</td>
                  </tr>
                  <tr>
                    <td>12ª – 14ª</td>
                    <td>5 cambi</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>23ª – 25ª</td>
                    <td>8 cambi</td>
                    <td>Extra budget 50 FM</td>
                  </tr>
                  <tr>
                    <td>30ª – 32ª</td>
                    <td>6 cambi</td>
                    <td>—</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              Mercato invernale: extra 50 FM utilizzabili solo in quella sessione. Aste di riparazione: valore
              proporzionato al prezzo aggiornato (FMV) al momento dello svincolo. Se un’asta resta deserta, entro il giorno
              successivo il giocatore è acquistabile a metà del valore (arrotondato per eccesso).
            </p>
          </>
        ),
      },
      {
        id: "scambi",
        title: "Scambi di mercato (Fasce e limiti)",
        content: (
          <>
            <p>I giocatori sono suddivisi in fasce per ruolo (FVM). Regole:</p>
            <ul>
              <li>1 vs 1: fasce uguali o max 2 step di differenza.</li>
              <li>2 vs 2: somma differenze ≤ 4 step.</li>
              <li>Finestre: prima della 3ª (entro 12/09/2025 h 18:00) e fino alla 10ª (entro 31/10/2025 h 18:00).</li>
              <li>Limiti: max 6 giocatori scambiati a stagione; max 2 scambi con la stessa squadra.</li>
            </ul>
            <div className="overflow-x-auto mt-4">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th>Fascia</th>
                    <th>Portieri</th>
                    <th>Difensori</th>
                    <th>Centrocampisti</th>
                    <th>Attaccanti</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>A</td>
                    <td>≥ 40</td>
                    <td>≥ 40</td>
                    <td>≥ 90</td>
                    <td>≥ 150</td>
                  </tr>
                  <tr>
                    <td>B</td>
                    <td>30–39</td>
                    <td>21–39</td>
                    <td>60–89</td>
                    <td>100–149</td>
                  </tr>
                  <tr>
                    <td>C</td>
                    <td>20–29</td>
                    <td>11–20</td>
                    <td>30–59</td>
                    <td>50–99</td>
                  </tr>
                  <tr>
                    <td>D</td>
                    <td>10–19</td>
                    <td>5–10</td>
                    <td>20–29</td>
                    <td>20–49</td>
                  </tr>
                  <tr>
                    <td>E</td>
                    <td>1–9</td>
                    <td>1–4</td>
                    <td>10–19</td>
                    <td>10–19</td>
                  </tr>
                  <tr>
                    <td>F</td>
                    <td>—</td>
                    <td>—</td>
                    <td>1–9</td>
                    <td>1–9</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        id: "calcolo-voti",
        title: "Modalità di calcolo, bonus e malus",
        content: (
          <>
            <p>
              Il punteggio squadra è la somma degli 11 titolari (e subentrati) sulla base del voto statistico (algoritmo
              Alvin482 su dati OPTA) + bonus/malus.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th>BONUS</th>
                      <th>Punteggio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Gol segnato</td>
                      <td>+3</td>
                    </tr>
                    <tr>
                      <td>Assist</td>
                      <td>+1</td>
                    </tr>
                    <tr>
                      <td>Rigore Parato</td>
                      <td>+3</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="overflow-x-auto">
                <table className="table-auto w-full">
                  <thead>
                    <tr>
                      <th>MALUS</th>
                      <th>Punteggio</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Ammonizione</td>
                      <td>-0,5</td>
                    </tr>
                    <tr>
                      <td>Espulsione</td>
                      <td>-1</td>
                    </tr>
                    <tr>
                      <td>Gol subito</td>
                      <td>-1</td>
                    </tr>
                    <tr>
                      <td>Autogol</td>
                      <td>-2</td>
                    </tr>
                    <tr>
                      <td>Rigore sbagliato</td>
                      <td>-3</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <h3>Voti d’ufficio</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="mt-0">Calciatori di movimento</h4>
                <ul>
                  <li>s.v. con bonus → 6 d’ufficio + bonus</li>
                  <li>s.v. espulso → 4 d’ufficio (malus incluso)</li>
                  <li>s.v. con rigore sbagliato/autogol → 6 – malus</li>
                  <li>s.v. senza bonus/malus o ≥ 15' giocati → 5,5 d’ufficio</li>
                </ul>
              </div>
              <div>
                <h4 className="mt-0">Portieri</h4>
                <ul>
                  <li>s.v. con ≥ 25' giocati (recupero escluso) → 6 ± bonus/malus</li>
                  <li>s.v. con &lt; 25' → non conteggiato</li>
                </ul>
              </div>
            </div>

            <h4 className="mt-6">Variazioni di calendario</h4>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th>Situazione</th>
                    <th>Punteggio</th>
                    <th>Note</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Partita rinviata</td>
                    <td>6 d’ufficio</td>
                    <td>Senza bonus/malus</td>
                  </tr>
                  <tr>
                    <td>Partita sospesa</td>
                    <td>6 d’ufficio</td>
                    <td>Solo se non giocata prima della giornata successiva</td>
                  </tr>
                  <tr>
                    <td>Anticipo/posticipo straordinario non giocato</td>
                    <td>6 d’ufficio</td>
                    <td>—</td>
                  </tr>
                  <tr>
                    <td>Giocatore squalificato</td>
                    <td>0</td>
                    <td>Escluso dalla regola</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        id: "competizioni",
        title: "Competizioni ufficiali",
        content: (
          <>
            <h3>Campionato</h3>
            <p>Lega a scontri diretti (3ª→38ª). Conversione punti → gol:</p>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th>Punteggio Fantacalcio</th>
                    <th>Gol</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>≤ 65,5</td>
                    <td>0</td>
                  </tr>
                  <tr>
                    <td>66 – 71,5</td>
                    <td>1</td>
                  </tr>
                  <tr>
                    <td>72 – 76,5</td>
                    <td>2</td>
                  </tr>
                  <tr>
                    <td>Ogni +4 punti</td>
                    <td>+1</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <ul>
              <li>No bonus fattore campo.</li>
              <li>3 punti vittoria, 1 pareggio, 0 sconfitta.</li>
              <li>Parità finale: somma punti → scontri diretti → criterio della Lega.</li>
            </ul>

            <h3 className="mt-6">Tornei Intermedi (Highlander)</h3>
            <p>Competizione “survivor”: ad ogni turno elimina chi fa il punteggio più basso.</p>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th>Periodo</th>
                    <th>Giornate Serie A</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1º Highlander</td>
                    <td>3ª – 11ª</td>
                  </tr>
                  <tr>
                    <td>2º Highlander</td>
                    <td>12ª – 20ª</td>
                  </tr>
                  <tr>
                    <td>3º Highlander</td>
                    <td>21ª – 29ª</td>
                  </tr>
                  <tr>
                    <td>4º Highlander</td>
                    <td>30ª – 38ª</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mt-6">Coppa Italia</h3>
            <p>Inizia alla 6ª: preliminare a girone unico (6 squadre non TDS, A/R). Prime 4 ai quarti.</p>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th>Fase</th>
                    <th>Giornate Serie A</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Preliminari</td>
                    <td>6ª – 15ª</td>
                  </tr>
                  <tr>
                    <td>Quarti</td>
                    <td>22ª – 24ª</td>
                  </tr>
                  <tr>
                    <td>Semifinali</td>
                    <td>26ª – 28ª</td>
                  </tr>
                  <tr>
                    <td>Finale</td>
                    <td>34ª</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mt-6">UEFA Cup (girone unico)</h3>
            <p>
              4ª → 21ª A/R tra tutte le squadre. Esito: 1º–4º → Champions; 5º–8º → Europa; 9º–10º → Conference.
            </p>

            <h3 className="mt-6">Champions League</h3>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th>Fase</th>
                    <th>Giornate Serie A</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Semifinali</td>
                    <td>27ª – 29ª</td>
                  </tr>
                  <tr>
                    <td>Finale</td>
                    <td>33ª</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mt-6">Europa League</h3>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th>Fase</th>
                    <th>Giornate Serie A</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Semifinali</td>
                    <td>27ª – 29ª</td>
                  </tr>
                  <tr>
                    <td>Finale</td>
                    <td>32ª</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h3 className="mt-6">Conference League</h3>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th>Fase</th>
                    <th>Giornate Serie A</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Preliminari</td>
                    <td>30ª – 31ª</td>
                  </tr>
                  <tr>
                    <td>Semifinali</td>
                    <td>32ª – 33ª</td>
                  </tr>
                  <tr>
                    <td>Finale</td>
                    <td>35ª</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        id: "quota-montepremi",
        title: "Quota di partecipazione & Montepremi",
        content: (
          <>
            <p>Quota per squadra: €100 (20€ all’asta + saldo entro 31/12/2025). Premi erogati a fine stagione.</p>
            <div className="overflow-x-auto">
              <table className="table-auto w-full text-sm">
                <thead>
                  <tr>
                    <th>Competizione</th>
                    <th>Posizione</th>
                    <th>Premio</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Campionato</td>
                    <td>1°</td>
                    <td>€ 300</td>
                  </tr>
                  <tr>
                    <td>Campionato</td>
                    <td>2°</td>
                    <td>€ 180</td>
                  </tr>
                  <tr>
                    <td>Campionato</td>
                    <td>3°</td>
                    <td>€ 100</td>
                  </tr>
                  <tr>
                    <td>Champions League</td>
                    <td>Vincitore</td>
                    <td>€ 120</td>
                  </tr>
                  <tr>
                    <td>Europa League</td>
                    <td>Vincitore</td>
                    <td>€ 80</td>
                  </tr>
                  <tr>
                    <td>Conference League</td>
                    <td>Vincitore</td>
                    <td>€ 40</td>
                  </tr>
                  <tr>
                    <td>Coppa Italia</td>
                    <td>Vincitore</td>
                    <td>€ 60</td>
                  </tr>
                  <tr>
                    <td>Torneo Intermedio (x4)</td>
                    <td>Vincitore</td>
                    <td>€ 30</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </>
        ),
      },
    ],
    []
  );

  // refs per scroll
  const sectionRefs = useRef({});
  useEffect(() => {
    sectionRefs.current = Object.fromEntries(
      sections.map((s) => [s.id, sectionRefs.current[s.id] || { el: null }])
    );
  }, [sections]);

  // ricerca: submit + apertura automatica mentre digiti (debounce)
  const handleSearch = (e) => {
    e?.preventDefault?.();
    if (!query.trim()) {
      setExpanded({});
      return;
    }

    const q = query.trim().toLowerCase();
    const nextExpanded = {};
    let firstMatchId = null;

    sections.forEach((s) => {
      const text = (document.getElementById(s.id)?.textContent || "").toLowerCase();
      const match = text.includes(q) || s.title.toLowerCase().includes(q);
      if (match) {
        nextExpanded[s.id] = true;
        if (!firstMatchId) firstMatchId = s.id;
      }
    });

    setExpanded(nextExpanded);

    setTimeout(() => {
      if (firstMatchId) {
        const el = document.getElementById(firstMatchId);
        el?.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 50);
  };

  useEffect(() => {
    const t = setTimeout(() => handleSearch(), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const toggle = (id) => setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <>
      <SiteHeader />
      <main ref={containerRef} className="container-gz py-8">
        <header className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-black ">
              Regolamento Carogna League 2025/26
            </h1>
            <p className="text-sm text-neutral-600">
              Tutte le regole ufficiali: asta, mercato, competizioni, punteggi.
            </p>
          </div>

          {/* Ricerca */}
          <form onSubmit={handleSearch} className="w-full sm:w-[30rem]">
            <label className="block text-sm font-medium mb-1" htmlFor="q">
              Cerca nel regolamento
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <Search className="h-5 w-5 text-neutral-500" />
              </span>
              <input
                id="q"
                type="search"
                placeholder='Cerca (es. "mercato invernale")'
                className="w-full rounded-2xl border pl-10 pr-10 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-amber-400"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  type="button"
                  aria-label="Pulisci"
                  onClick={() => setQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl border px-2 py-1 text-xs bg-white hover:bg-neutral-50"
                >
                  ✕
                </button>
              )}
            </div>
          </form>
        </header>

        {/* Azioni: Competizioni + Download PDF */}
<div className="mb-6 flex gap-3">
  {/* Versione compatta (mobile): solo icone */}
  <div className="flex gap-2 sm:hidden">
    <Link
      to="/competizioni"
      className="inline-flex items-center justify-center rounded-xl p-2 border bg-white hover:bg-emerald-50 text-emerald-700"
      title="Vai a Competizioni"
    >
      <Trophy size={20} />
    </Link>

    <a
      href={regolamentoPdf}
      download="Regolamento-CarognaLeague-2025-26.pdf"
      className="inline-flex items-center justify-center rounded-xl p-2 border bg-white hover:bg-amber-50 text-amber-700"
      title="Scarica PDF"
    >
      <Download size={20} />
    </a>
  </div>

  {/* Versione estesa (da sm in su): con testo */}
  <div className="hidden sm:flex gap-3">
    <Link
      to="/competizioni"
      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border bg-white hover:bg-emerald-50 text-emerald-700"
    >
      <Trophy size={18} />
      <span>Vai a Competizioni</span>
    </Link>

    <a
      href={regolamentoPdf}
      download="Regolamento-CarognaLeague-2025-26.pdf"
      className="inline-flex items-center gap-2 rounded-2xl px-4 py-2 border bg-white hover:bg-amber-50 text-amber-700"
    >
      <Download size={18} />
      <span>Scarica PDF</span>
    </a>
  </div>
</div>


        <div className="space-y-4">
          {sections.map((s) => (
            <div key={s.id} ref={(el) => (sectionRefs.current[s.id] = { el })}>
              <AccordionItem
                id={s.id}
                title={<Highlight text={s.title} query={query} />}
                isOpen={!!expanded[s.id]}
                onToggle={() => toggle(s.id)}
              >
                <div className="[&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_table_th]:text-left">
                  {s.content}
                </div>
              </AccordionItem>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </>
  );
}





