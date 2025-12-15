import { getResultsForLeague, refreshResultsFromSource } from '../services/results.service.js';

// RISULTATI presi da leghefantacalcio.it e salvati su Mongo
export async function getResults(req, res) {
  try {
    const league = req.query.league || process.env.LEAGUE_SLUG;
    const data = await getResultsForLeague(league);
    res.json(data);
  } catch (e) {
    console.error('[results] getResults error:', e);
    res.status(500).json({ error: e.message });
  }
}

export async function refreshResults(req, res) {
  try {
    const league = req.query.league || process.env.LEAGUE_SLUG;
    const data = await refreshResultsFromSource(league);
    res.json({ ok: true, league, rows: data.length });
  } catch (e) {
    console.error('[results] refresh error:', e);
    res.status(500).json({ error: e.message });
  }
}


