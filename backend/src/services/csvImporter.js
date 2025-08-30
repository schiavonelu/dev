// backend/src/services/csvImporter.js
import { parse as parseSync } from 'csv-parse/sync';
import { parse as parseStream } from 'csv-parse';

/** Utilità comune */
function toNum(v) {
  if (v === null || v === undefined || v === '') return 0;
  return Number(String(v).replace(',', '.')) || 0;
}

/** Parse CSV "base" (sincrono) — ritorna array di record */
export function parseCSV(input, {
  columns = true,
  skip_empty_lines = true,
  trim = true,
  delimiter = ';',
  ...rest
} = {}) {
  const text = Buffer.isBuffer(input) ? input.toString('utf8') : String(input || '');
  return parseSync(text, { columns, skip_empty_lines, trim, delimiter, ...rest });
}

/** Parse CSV in streaming (da Readable) — ritorna Promise<array> */
export function parseCSVStream(readable, {
  columns = true,
  skip_empty_lines = true,
  trim = true,
  delimiter = ';',
  ...rest
} = {}) {
  return new Promise((resolve, reject) => {
    const rows = [];
    const parser = parseStream({ columns, skip_empty_lines, trim, delimiter, ...rest });
    readable
      .on('error', reject)
      .pipe(parser)
      .on('data', rec => rows.push(rec))
      .on('error', reject)
      .on('end', () => resolve(rows));
  });
}

/**
 * STANDINGS — normalizza varie intestazioni comuni:
 * accetta colonne come: team/Squadra/Team/Nome, points/Punti/Pt, gf/GF, gs/GA/GS, played/G/Vittorie/pareggi...
 * Ritorna: [{ team, points, gf, gs, played, won, draw, lost }]
 */
export function parseStandingsCsv(input, opts = {}) {
  const rows = parseCSV(input, opts);
  const out = rows.map((r, idx) => {
    const team =
      r.team ?? r.Team ?? r.Squadra ?? r.squadra ?? r.Nome ?? r['Nome squadra'] ?? `Team ${idx + 1}`;

    const points =
      toNum(r.points ?? r.Punti ?? r.pt ?? r.Pt ?? r.PT ?? r.score ?? r['Punti ']);

    const gf = toNum(r.gf ?? r.GF ?? r['Gol fatti'] ?? r['GF '] ?? r['GF']);
    const gs = toNum(r.gs ?? r.GS ?? r.GA ?? r['Gol subiti'] ?? r['GS '] ?? r['GA']);

    const played = toNum(r.played ?? r.Giocate ?? r.G ?? r['Partite giocate'] ?? r.Partite);
    const won    = toNum(r.won ?? r.V ?? r.Vittorie);
    const draw   = toNum(r.draw ?? r.N ?? r.Pareggi ?? r.Nulli);
    const lost   = toNum(r.lost ?? r.P ?? r.Sconfitte);

    return { team, points, gf, gs, played, won, draw, lost };
  });

  // ordina per punti, poi differenza reti
  out.sort((a, b) =>
    (b.points || 0) - (a.points || 0) ||
    ((b.gf - b.gs) - (a.gf - a.gs)) ||
    (b.gf - a.gf)
  );

  return out;
}

/**
 * RESULTS — normalizza risultati:
 * accetta colonne come: home/casa, away/trasferta, gh/gf_home, ga/gf_away, date/data
 * Ritorna: [{ home, away, gh, ga, date? }]
 */
export function parseResultsCsv(input, opts = {}) {
  const rows = parseCSV(input, opts);
  return rows.map((r) => {
    const home =
      r.home ?? r.casa ?? r.Home ?? r['Squadra Casa'] ?? r['Home Team'];
    const away =
      r.away ?? r.trasferta ?? r.Away ?? r['Squadra Ospite'] ?? r['Away Team'];

    const gh = toNum(r.gh ?? r.gf_home ?? r.home_goals ?? r['Gol Casa'] ?? r['GF_C']);
    const ga = toNum(r.ga ?? r.gf_away ?? r.away_goals ?? r['Gol Ospite'] ?? r['GF_T']);

    const date = r.date ?? r.data ?? r.match_date ?? null;
    return { home, away, gh, ga, date };
  }).filter(m => m.home && m.away);
}

/**
 * FIXTURES (prossimo turno) — normalizza:
 * accetta colonne come: home, away, when/data/ora
 * Ritorna: [{ home, away, when }]
 */
export function parseFixturesCsv(input, opts = {}) {
  const rows = parseCSV(input, opts);
  return rows.map((r) => {
    const home = r.home ?? r.casa ?? r.Home ?? r['Squadra Casa'];
    const away = r.away ?? r.trasferta ?? r.Away ?? r['Squadra Ospite'];
    const when = r.when ?? r.data ?? r.ora ?? r['Data/Ora'] ?? '';
    return { home, away, when };
  }).filter(m => m.home && m.away);
}

