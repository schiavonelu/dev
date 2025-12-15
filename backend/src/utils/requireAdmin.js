// src/utils/requireAdmin.js
import { authAdmin } from './firebase.js';

export async function requireAdmin(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' });

    if (!authAdmin) return res.status(503).json({ error: 'Firebase admin non configurato' });

    const decoded = await authAdmin.verifyIdToken(token, true);
    const email = (decoded.email || '').toLowerCase();
    const whitelist = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(s => s.trim().toLowerCase())
      .filter(Boolean);

    const byClaim = decoded.admin === true || decoded?.claims?.admin === true;
    const byWhitelist = email && whitelist.includes(email);

    if (!(byClaim || byWhitelist)) {
      return res.status(403).json({ error: 'FORBIDDEN', reason: 'not admin' });
    }
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized', detail: e.message });
  }
}

