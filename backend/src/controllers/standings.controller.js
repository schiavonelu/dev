// backend/src/controllers/standings.controller.js
import { firestore } from '../utils/firebase.js';
import { parse as parseCsvSync } from 'csv-parse/sync';

function cleanStr(v) {
  if (v == null) return '';
  return String(v).trim();
}
function toNum(v) {
  if (v === null || v === undefined || v === '') return 0;
  return Number(String(v).replace(',', '.')) || 0;
}
function normalizeStandingRow(r, idx) {
  const rawTeam =
    r.team ?? r.Team ?? r.Squadra ?? r.squadra ?? r.Nome ?? r['Nome squadra'];
  const team = cleanStr(rawTeam) || `Team ${idx + 1}`;

  const points = toNum(r.points ?? r.Punti ?? r.pt ?? r.Pt ?? r.PT ?? r.score ?? r['Punti ']);
  const gf     = toNum(r.gf ?? r.GF ?? r['Gol fatti'] ?? r['GF '] ?? r['GF']);
  const gs     = toNum(r.gs ?? r.GS ?? r.GA ?? r['Gol subiti'] ?? r['GS '] ?? r['GA']);
  const played = toNum(r.played ?? r.Giocate ?? r.G ?? r['Partite giocate'] ?? r.Partite);
  const won    = toNum(r.won ?? r.V ?? r.Vittorie);
  const draw   = toNum(r.draw ?? r.N ?? r.Pareggi ?? r.Nulli);
  const lost   = toNum(r.lost ?? r.P ?? r.Sconfitte);

  return { team, points, gf, gs, played, won, draw, lost };
}
function sortStandings(arr) {
  return [...arr].sort((a, b) =>
    (b.points || 0) - (a.points || 0) ||
    ((b.gf || 0) - (b.gs || 0)) - ((a.gf || 0) - (a.gs || 0)) ||
    (b.gf || 0) - (a.gf || 0)
  );
}
function pathForLeague(league) {
  const lg = cleanStr(league) || cleanStr(process.env.LEAGUE_SLUG) || 'default';
  return { docRef: firestore.doc(`leagues/${lg}/standings/current`), league: lg };
}

async function getDocItems(docRef) {
  const snap = await docRef.get();
  if (!snap.exists) return null;
  const data = snap.data() || {};
  const items = Array.isArray(data.items) ? data.items : [];
  return items.length ? items : null;
}

// --------- CONTROLLERS ---------

// GET /api/standings?league=...
export async function getStandings(req, res) {
  try {
    const askedLeague = cleanStr(req.query.league);
    const envLeague = cleanStr(process.env.LEAGUE_SLUG);
    const tried = [];

    // 1) prova lo slug richiesto (se presente)
    if (askedLeague) {
      const { docRef } = pathForLeague(askedLeague);
      tried.push(askedLeague);
      const items = await getDocItems(docRef);
      if (items) return res.json(sortStandings(items));
    }

    // 2) prova lo slug dell'env
    if (envLeague && envLeague !== askedLeague) {
      const { docRef } = pathForLeague(envLeague);
      tried.push(envLeague);
      const items = await getDocItems(docRef);
      if (items) return res.json(sortStandings(items));
    }

    // 3) prova 'default'
    if ('default' !== askedLeague && 'default' !== envLeague) {
      const { docRef } = pathForLeague('default');
      tried.push('default');
      const items = await getDocItems(docRef);
      if (items) return res.json(sortStandings(items));
    }

    // 4) demo assoluta solo se davvero non c’è niente
    const demo = [
      { team: "SENZA PADRONI FK", points: 0, gf: 0, gs: 0 },
      { team: "I CUGINI DI BILANCIA", points: 0, gf: 0, gs: 0 },
      { team: "LEONI INDOMABILI", points: 0, gf: 0, gs: 0 },
      { team: "F C SANPA", points: 0, gf: 0, gs: 0 },
      { team: "UNION STRUNZ", points: 0, gf: 0, gs: 0 },
      { team: "ATLETICO MACRI", points: 0, gf: 0, gs: 0 },
      { team: "POGGIOREAL CLUB DE FUTBOL", points: 0, gf: 0, gs: 0 },
      { team: "RICHVILLE", points: 0, gf: 0, gs: 0 },
      { team: "ATLETICO SOLOPACA", points: 0, gf: 0, gs: 0 },
      { team: "SCHALKE 104", points: 0, gf: 0, gs: 0 },
    ];
    return res.json(demo);
  } catch (e) {
    console.error('[standings] getStandings error:', e);
    res.status(500).json({ error: e.message });
  }
}

// POST /api/standings/refresh?league=...
export async function refreshStandings(req, res) {
  try {
    const { docRef, league } = pathForLeague(req.query.league);
    const snap = await docRef.get();
    if (!snap.exists) return res.json({ ok: false, message: 'Nessuna classifica salvata', league });
    const data = snap.data() || {};
    res.json({ ok: true, league, updatedAt: data.updatedAt || null, rows: (data.items || []).length });
  } catch (e) {
    console.error('[standings] refresh error:', e);
    res.status(500).json({ error: e.message });
  }
}

// POST /api/standings/import?league=...
// Accetta:
// - multipart/form-data con field "file" (CSV) e opz. "delimiter"
// - JSON: { sheet:'https://docs.google.com/...output=csv', delimiter?:','|';' }
// - JSON: { items:[ { team, points, gf, gs, played?, won?, draw?, lost? }, ... ] }
export async function importCsv(req, res) {
  try {
    const { docRef, league } = pathForLeague(req.query.league);
    let rows = [];

    if (req.file?.buffer) {
      const delimiter = req.body?.delimiter || ';';
      const text = req.file.buffer.toString('utf8');
      const parsed = parseCsvSync(text, { columns: true, skip_empty_lines: true, trim: true, delimiter });
      rows = parsed.map(normalizeStandingRow);
    } else if (req.body?.sheet) {
      const delimiter = req.body?.delimiter || ',';
      const r = await fetch(req.body.sheet);
      if (!r.ok) throw new Error('Impossibile scaricare il CSV dal foglio');
      const text = await r.text();
      const parsed = parseCsvSync(text, { columns: true, skip_empty_lines: true, trim: true, delimiter });
      rows = parsed.map(normalizeStandingRow);
    } else if (Array.isArray(req.body?.items)) {
      rows = req.body.items.map(normalizeStandingRow);
    } else {
      return res.status(400).json({ error: 'Nessun dato da importare. Usa file CSV, oppure body.sheet, oppure body.items.' });
    }

    rows = sortStandings(rows);
    await docRef.set({ items: rows, updatedAt: Date.now(), source: 'import' }, { merge: true });
    res.json({ ok: true, league, rows: rows.length });
  } catch (e) {
    console.error('[standings] importCsv error:', e);
    res.status(500).json({ error: e.message });
  }
}



