// backend/src/middlewares/requireAdmin.js
import { authAdmin } from '../utils/firebase.js';

const admins = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map(s => s.trim().toLowerCase())
  .filter(Boolean);

export async function requireAdmin(req, res, next) {
  try {
    // In dev, puoi bypassare con ALLOW_INSECURE_IMPORT=1
    if (process.env.ALLOW_INSECURE_IMPORT === '1') return next();

    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'NO_TOKEN' });

    const decoded = await authAdmin.verifyIdToken(token);
    const email = (decoded.email || '').toLowerCase();

    if (decoded.admin === true || admins.includes(email)) {
      req.user = decoded;
      return next();
    }
    return res.status(403).json({ error: 'NOT_ADMIN' });
  } catch (e) {
    console.error('[auth] requireAdmin error', e);
    return res.status(401).json({ error: 'INVALID_TOKEN' });
  }
}

