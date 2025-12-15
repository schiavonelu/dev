import Article from '../models/Article.js';
import Match from '../models/Match.js';
import Standing from '../models/Standing.js';
import { refreshResultsFromSource } from '../services/results.service.js';
import { refreshStandingsFromSource } from '../services/standings.service.js';

function defaultArticleSeed() {
  const now = new Date();
  return {
    slug: 'benvenuti-nel-carogna-league',
    title: 'Benvenuti nel Carogna League',
    excerpt: 'Articolo di benvenuto creato automaticamente per popolare il database.',
    body: 'Questo contenuto viene generato al primo avvio per verificare che la connessione a MongoDB funzioni correttamente.',
    cover: '',
    author: 'Redazione',
    tags: ['demo'],
    published: true,
    publishedAt: now,
    createdAt: now,
  };
}

export async function bootstrapDatabase() {
  const leagueSlug = process.env.LEAGUE_SLUG || 'carogna-league';
  const report = { leagueSlug, articlesSeeded: 0, standingsSeeded: false, resultsSeeded: false };

  // articoli: crea un placeholder se il DB è vuoto
  const articleCount = await Article.estimatedDocumentCount();
  if (articleCount === 0) {
    const seed = defaultArticleSeed();
    try {
      await Article.create(seed);
      report.articlesSeeded = 1;
    } catch (err) {
      console.warn('[bootstrap] impossibile creare l\'articolo di benvenuto:', err.message);
    }
  }

  // standings: se non ci sono righe, tenta uno scraping iniziale
  const standingsCount = await Standing.countDocuments({ leagueSlug });
  if (standingsCount === 0) {
    try {
      await refreshStandingsFromSource(leagueSlug);
      report.standingsSeeded = true;
    } catch (err) {
      console.warn('[bootstrap] impossibile popolare la classifica:', err.message);
    }
  }

  // risultati: se non ci sono partite, tenta uno scraping iniziale
  const matchCount = await Match.countDocuments({ leagueSlug });
  if (matchCount === 0) {
    try {
      await refreshResultsFromSource(leagueSlug);
      report.resultsSeeded = true;
    } catch (err) {
      console.warn('[bootstrap] impossibile popolare i risultati:', err.message);
    }
  }

  return report;
}
