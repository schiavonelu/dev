import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { startCronJobs } from './jobs/index.js';

import standingsRoutes   from './routes/standings.routes.js';
import resultsRoutes     from './routes/results.routes.js';
import formationsRoutes  from './routes/formations.routes.js';
import articlesRoutes    from './routes/articles.routes.js';
import debugRoutes       from './routes/debug.routes.js';
import authRoutes        from './routes/auth.routes.js';
import editorialsRoutes  from './routes/editorials.routes.js'; // ⬅️ AGGIUNTO

const app = express();
app.set('trust proxy', 1);

const normalizeOrigin = (value) => value?.replace(/\/+$/, '');
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((v) => normalizeOrigin(v.trim()))
  .filter(Boolean);

app.use(cors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);

    const normalized = normalizeOrigin(origin);
    const isLocal = /^https?:\/\/localhost(:\d+)?$/.test(normalized) || /\.app\.github\.dev$/.test(normalized);
    const isEnvAllowed = allowedOrigins.some((allowed) => allowed === normalized);

    if (isLocal || isEnvAllowed) return cb(null, true);
    cb(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
}));

app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(express.json({ limit: '2mb' }));
app.use(morgan('dev'));

// health
app.get('/api/health', (_req, res) => res.json({ ok: true }));

// monta DEBUG PRIMA del resto (non è obbligatorio, ma utile)
app.use('/api/_debug', debugRoutes);
console.log('[debug] mounted at /api/_debug | seedEnabled =', process.env.ALLOW_DEBUG_SEED === '1');

// API principali
app.use('/api/standings',  standingsRoutes);
app.use('/api/results',    resultsRoutes);
app.use('/api/formations', formationsRoutes);
app.use('/api/articles',   articlesRoutes);
app.use('/api/editorials', editorialsRoutes); // ⬅️ NUOVO
app.use('/api/_auth',      authRoutes);

// 404
app.use((req, res) => res.status(404).json({ error: 'NOT_FOUND', path: req.path }));

// error handler
app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ error: 'INTERNAL_ERROR', detail: err.message || String(err) });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`API listening on :${PORT}`);
  startCronJobs(); // ⬅️ avvia i cron
});








