// backend/src/routes/formations.routes.js
import { Router } from 'express';
import { getFormations } from '../controllers/formations.controller.js';

const router = Router();

// GET /api/formations?league=...
router.get('/', getFormations);

export default router;
