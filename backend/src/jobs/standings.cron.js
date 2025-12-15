import { refreshStandingsFromSource } from '../services/standings.service.js';

// Job principale ------------------------------------------
export async function runStandingsImportFromSheet() {
  const league = process.env.LEAGUE_SLUG || 'carogna-league';
  const rows = await refreshStandingsFromSource(league);
  return { ok: true, league, rows: rows.length };
}


