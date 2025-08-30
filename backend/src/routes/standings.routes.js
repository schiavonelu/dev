// backend/src/routes/standings.routes.js
import { Router } from 'express';
import multer from 'multer';
import {
  getStandings,
  refreshStandings,
  importCsv,
} from '../controllers/standings.controller.js';
import { requireAdmin } from '../middlewares/requireAdmin.js';

const router = Router();
const upload = multer();

// GET /api/standings?league=...
router.get('/', getStandings);

// POST /api/standings/refresh
router.post('/refresh', requireAdmin, refreshStandings);

// POST /api/standings/import (CSV upload | Google Sheet CSV | JSON)
router.post('/import', requireAdmin, upload.single('file'), importCsv);

export default router;


