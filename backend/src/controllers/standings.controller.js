import Standing from '../models/Standing.js';
import { getStandingsForLeague, refreshStandingsFromSource } from '../services/standings.service.js';
import { parse as parseCsvSync } from 'csv-parse/sync';

function cleanStr(v) { return String(v || '').trim(); }

// --------- CONTROLLERS ---------

// GET /api/standings?league=...
export async function getStandings(req, res) {
  try {
    const league = cleanStr(req.query.league) || process.env.LEAGUE_SLUG;
    const items = await getStandingsForLeague(league);
    return res.json(items);
  } catch (e) {
    console.error('[standings] getStandings error:', e);
    res.status(500).json({ error: e.message });
  }
}

// POST /api/standings/refresh?league=...
export async function refreshStandings(req, res) {
  try {
    const league = cleanStr(req.query.league) || process.env.LEAGUE_SLUG;
    const items = await refreshStandingsFromSource(league);
    res.json({ ok: true, league, updatedAt: new Date(), rows: items.length });
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
    const league = cleanStr(req.query.league) || process.env.LEAGUE_SLUG;
    let rows = [];

    if (req.file?.buffer) {
      const delimiter = req.body?.delimiter || ';';
      const text = req.file.buffer.toString('utf8');
      const parsed = parseCsvSync(text, { columns: true, skip_empty_lines: true, trim: true, delimiter });
      rows = parsed;
    } else if (req.body?.sheet) {
      const delimiter = req.body?.delimiter || ',';
      const r = await fetch(req.body.sheet);
      if (!r.ok) throw new Error('Impossibile scaricare il CSV dal foglio');
      const text = await r.text();
      const parsed = parseCsvSync(text, { columns: true, skip_empty_lines: true, trim: true, delimiter });
      rows = parsed;
    } else if (Array.isArray(req.body?.items)) {
      rows = req.body.items;
    } else {
      return res.status(400).json({ error: 'Nessun dato da importare. Usa file CSV, oppure body.sheet, oppure body.items.' });
    }

    const mapped = rows.map((r) => ({
      leagueSlug: league,
      competition: 'campionato',
      team: r.team || r.Team || r.Squadra,
      points: Number(r.points ?? r.Punti ?? 0),
      played: Number(r.played ?? r.Giocate ?? r.Partite ?? 0),
      wins: Number(r.won ?? r.V ?? 0),
      draws: Number(r.draw ?? r.N ?? 0),
      losses: Number(r.lost ?? r.P ?? 0),
      goalsFor: Number(r.gf ?? r.GF ?? 0),
      goalsAgainst: Number(r.gs ?? r.GS ?? 0),
      goalDiff: Number(r.gf ?? r.GF ?? 0) - Number(r.gs ?? r.GS ?? 0),
      updatedAt: new Date(),
    })).filter(r => r.team);

    await Standing.deleteMany({ leagueSlug: league });
    if (mapped.length) await Standing.insertMany(mapped);
    res.json({ ok: true, league, rows: mapped.length });
  } catch (e) {
    console.error('[standings] importCsv error:', e);
    res.status(500).json({ error: e.message });
  }
}



