// src/utils/requireAuth.js
import { authAdmin } from './firebase.js';

export async function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) return res.status(401).json({ error: 'Missing Bearer token' });
    const decoded = await authAdmin.verifyIdToken(token, true);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Unauthorized', detail: e.message });
  }
}
