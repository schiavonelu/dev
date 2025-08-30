import { parse as parseCsvSync } from 'csv-parse/sync';
import { firestore } from '../utils/firebase.js';

// Helpers -------------------------------------------------
function toNum(v) {
  if (v == null || v === '') return 0;
  return Number(String(v).replace(',', '.')) || 0;
}
function normalizeRow(r, idx) {
  const team =
    r.team ?? r.Team ?? r.Squadra ?? r.Nome ?? `Team ${idx + 1}`;
  return {
    team,
    points: toNum(r.points ?? r.Punti ?? r.pt ?? r.Pt ?? r.PT),
    gf:     toNum(r.gf ?? r.GF ?? r['Gol fatti'] ?? r['GF']),
    gs:     toNum(r.gs ?? r.GS ?? r.GA ?? r['Gol subiti'] ?? r['GS']),
    played: toNum(r.played ?? r.Giocate ?? r.G ?? r.Partite),
    won:    toNum(r.won ?? r.V ?? r.Vittorie),
    draw:   toNum(r.draw ?? r.N ?? r.Pareggi),
    lost:   toNum(r.lost ?? r.P ?? r.Sconfitte),
  };
}
function sortRows(arr) {
  return arr.sort((a, b) =>
    (b.points || 0) - (a.points || 0) ||
    ((b.gf - b.gs) - (a.gf - a.gs)) ||
    (b.gf - a.gf)
  );
}
function leagueDoc() {
  const league = process.env.LEAGUE_SLUG || 'default';
  return { league, docRef: firestore.doc(`leagues/${league}/standings/current`) };
}

// Job principale ------------------------------------------
export async function runStandingsImportFromSheet() {
  const url = process.env.STANDINGS_SHEET_CSV_URL;
  if (!url) {
    console.warn('[cron][standings] STANDINGS_SHEET_CSV_URL non impostato: skip.');
    return { ok: false, skip: true, reason: 'NO_SHEET_URL' };
  }
  const delimiter = process.env.STANDINGS_DELIMITER || ',';
  const { league, docRef } = leagueDoc();

  const r = await fetch(url);
  if (!r.ok) throw new Error(`fetch CSV fallito: HTTP ${r.status}`);
  const text = await r.text();

  const parsed = parseCsvSync(text, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    delimiter,
  });

  let rows = parsed.map(normalizeRow);
  rows = sortRows(rows);

  await docRef.set(
    { items: rows, updatedAt: Date.now(), source: 'sheet' },
    { merge: true }
  );

  return { ok: true, league, rows: rows.length };
}


