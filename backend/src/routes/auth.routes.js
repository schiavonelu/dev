// src/routes/auth.routes.js
import { Router } from 'express';
import { requireAuth } from '../utils/requireAuth.js';

const router = Router();

router.get('/me', requireAuth, async (req, res) => {
  const u = req.user || {};
  const email = (u.email || '').toLowerCase();
  const whitelist = (process.env.ADMIN_EMAILS || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  const byClaim = u.admin === true || u?.claims?.admin === true;
  const byWhitelist = email && whitelist.includes(email);
  const isAdmin = !!(byClaim || byWhitelist);

  res.json({ email: u.email || null, isAdmin, reason: byClaim ? 'claim' : (byWhitelist ? 'whitelist' : null) });
});

export default router;

