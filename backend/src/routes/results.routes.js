// backend/src/routes/results.routes.js
import { Router } from 'express';
import { getResults, refreshResults } from '../controllers/results.controller.js';

const router = Router();

// GET /api/results?league=...
router.get('/', getResults);

// POST /api/results/refresh
router.post('/refresh', refreshResults);

export default router;
