import Match from '../models/Match.js';
import { fetchResultsFromSite } from './leghefantacalcio.js';

const leagueSlugFromEnv = () => process.env.LEAGUE_SLUG || 'carogna-league';

function normalizeMatch(row = {}, leagueSlug = leagueSlugFromEnv()) {
  return {
    leagueSlug,
    round: row.round || 1,
    home: row.home,
    away: row.away,
    scoreHome: row.scoreHome ?? null,
    scoreAway: row.scoreAway ?? null,
    date: row.date || null,
  };
}

export async function refreshResultsFromSource(leagueSlug = leagueSlugFromEnv()) {
  const matches = await fetchResultsFromSite();
  if (!matches.length) throw new Error('Nessun risultato trovato su leghefantacalcio');

  const payload = matches.map((m) => normalizeMatch(m, leagueSlug));
  await Match.deleteMany({ leagueSlug });
  await Match.insertMany(payload);
  return payload;
}

export async function getResultsForLeague(leagueSlug = leagueSlugFromEnv()) {
  let matches = await Match.find({ leagueSlug }).sort({ date: 1 }).lean();
  if (!matches.length) matches = await refreshResultsFromSource(leagueSlug);
  return matches;
}
