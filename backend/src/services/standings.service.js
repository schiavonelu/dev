import Standing from '../models/Standing.js';
import { fetchStandingsFromSite } from './leghefantacalcio.js';

const leagueSlugFromEnv = () => process.env.LEAGUE_SLUG || 'carogna-league';

function normalizeStanding(row = {}, leagueSlug = leagueSlugFromEnv()) {
  const goalDiff = (row.goalsFor || 0) - (row.goalsAgainst || 0);
  return {
    leagueSlug,
    competition: 'campionato',
    team: row.team,
    played: row.played ?? null,
    wins: row.wins ?? null,
    draws: row.draws ?? null,
    losses: row.losses ?? null,
    goalsFor: row.goalsFor ?? null,
    goalsAgainst: row.goalsAgainst ?? null,
    goalDiff,
    points: row.points ?? 0,
    updatedAt: new Date(),
  };
}

export async function refreshStandingsFromSource(leagueSlug = leagueSlugFromEnv()) {
  const rows = await fetchStandingsFromSite();
  if (!rows.length) throw new Error('Nessuna classifica trovata su leghefantacalcio');

  const payload = rows.map((r) => normalizeStanding(r, leagueSlug));
  await Standing.deleteMany({ leagueSlug });
  await Standing.insertMany(payload);
  return payload;
}

export async function getStandingsForLeague(leagueSlug = leagueSlugFromEnv()) {
  let rows = await Standing.find({ leagueSlug }).sort({ points: -1, goalDiff: -1, goalsFor: -1 }).lean();
  if (!rows.length) rows = await refreshStandingsFromSource(leagueSlug);
  return rows;
}
