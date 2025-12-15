import axios from 'axios';
import cheerio from 'cheerio';

const BASE_URL = process.env.LEGHE_BASE_URL || 'https://leghe.fantacalcio.it';
const LEAGUE_SLUG = process.env.LEAGUE_SLUG || 'carogna-league';
const LEAGUE_PATH = process.env.LEGHE_PATH || `/${LEAGUE_SLUG}`;

const toNumber = (value) => {
  if (value === undefined || value === null) return 0;
  const cleaned = String(value).replace(/[^0-9,.-]/g, '').replace(',', '.');
  const n = Number(cleaned);
  return Number.isNaN(n) ? 0 : n;
};

const cleanText = (value) => String(value || '').trim();

function resolveUrl(suffix) {
  return `${BASE_URL}${suffix.startsWith('/') ? '' : '/'}${suffix}`;
}

async function fetchHtml(path) {
  const url = resolveUrl(path || LEAGUE_PATH);
  const res = await axios.get(url, { headers: { 'User-Agent': 'carogna-league-bot/1.0' } });
  return res.data;
}

export async function fetchStandingsFromSite() {
  const html = await fetchHtml(`${LEAGUE_PATH}/classifica`);
  const $ = cheerio.load(html);
  const rows = [];

  $('table tbody tr').each((_, tr) => {
    const tds = $(tr).find('td');
    if (!tds.length) return;

    const team = cleanText($(tr).find('.team-name').text() || tds.eq(0).text());
    if (!team) return;

    const points = toNumber($(tr).find('.points, .pts').text() || tds.eq(1).text());
    const played = toNumber($(tr).find('.played').text() || tds.eq(2).text());
    const wins = toNumber($(tr).find('.wins').text() || tds.eq(3).text());
    const draws = toNumber($(tr).find('.draws').text() || tds.eq(4).text());
    const losses = toNumber($(tr).find('.losses').text() || tds.eq(5).text());
    const goalsFor = toNumber($(tr).find('.gf').text() || tds.eq(6).text());
    const goalsAgainst = toNumber($(tr).find('.gs').text() || tds.eq(7).text());

    rows.push({ team, points, played, wins, draws, losses, goalsFor, goalsAgainst });
  });

  return rows;
}

export async function fetchResultsFromSite() {
  const html = await fetchHtml(`${LEAGUE_PATH}/risultati`);
  const $ = cheerio.load(html);
  const matches = [];

  $('.match, .gara, .game, tr').each((_, el) => {
    const row = $(el);
    const home = cleanText(row.find('.team-home, .squadra_casa, .home, .team-a').text() || row.find('td').eq(0).text());
    const away = cleanText(row.find('.team-away, .squadra_ospite, .away, .team-b').text() || row.find('td').eq(2).text());
    const scoreRaw = row.find('.score, .punteggio, .result').text();
    const homeScoreRaw = cleanText(row.find('.score-home, .punteggio_casa').text() || scoreRaw.split('-')[0]);
    const awayScoreRaw = cleanText(row.find('.score-away, .punteggio_trasferta').text() || scoreRaw.split('-')[1]);

    if (!home || !away) return;

    const dateText = cleanText(row.find('.date, .data').text());
    const date = dateText ? new Date(dateText) : null;

    matches.push({
      home,
      away,
      scoreHome: toNumber(homeScoreRaw),
      scoreAway: toNumber(awayScoreRaw),
      date: date && !isNaN(date) ? date : null,
    });
  });

  return matches.filter(m => m.home || m.away);
}
