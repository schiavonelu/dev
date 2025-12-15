import { Router } from 'express';
import Article from '../models/Article.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    ok: true,
    base: '/api/_debug',
    seedEnabled: process.env.ALLOW_DEBUG_SEED === '1',
    endpoints: ['GET /health', 'GET /seed-articles'],
  });
});

router.get('/health', (req, res) => {
  res.json({ ok: true, seedEnabled: process.env.ALLOW_DEBUG_SEED === '1' });
});

router.get('/seed-articles', async (req, res) => {
  try {
    if (process.env.ALLOW_DEBUG_SEED !== '1') {
      return res.status(403).json({ error: 'Debug seed disabilitato. Metti ALLOW_DEBUG_SEED=1 nel .env' });
    }
    const now = Date.now();
    const sample = [
      {
        slug: 'benvenuti-nel-carogna-league',
        title: 'Benvenuti nel Carogna League',
        excerpt: 'Demo di articolo per popolare il DB Mongo.',
        body: 'Questo è un esempio di articolo creato automaticamente per verificare la pipeline.',
        cover: '',
        author: 'Redazione',
        tags: ['demo'],
        published: true,
        publishedAt: now,
        createdAt: now,
      },
    ];

    await Article.insertMany(sample);

    res.json({ ok: true, inserted: sample.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;




