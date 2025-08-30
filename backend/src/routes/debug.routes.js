import { Router } from 'express';
import { firestore } from '../utils/firebase.js';

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
    const sample = [ /* ... (articoli demo come già inviati) ... */ ];

    const batch = firestore.batch();
    const col = firestore.collection('articles');
    for (const a of sample) batch.set(col.doc(a.slug), a, { merge: false });
    await batch.commit();

    res.json({ ok: true, inserted: sample.length });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

export default router;




