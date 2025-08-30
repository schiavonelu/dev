import cron from 'node-cron';
import { runStandingsImportFromSheet } from './standings.cron.js';

export function startCronJobs() {
  if (process.env.CRON_ENABLED !== '1') {
    console.log('[cron] disabilitato (CRON_ENABLED!=1)');
    return;
  }

  const tz = process.env.TZ || 'Europe/Rome';
  const expr = process.env.CRON_STANDINGS_SCHEDULE || '0 8 * * 1,2';

  console.log(`[cron] standings attivo: ${expr} TZ=${tz}`);
  cron.schedule(
    expr,
    async () => {
      try {
        console.log('[cron] import standings da sheet…');
        const out = await runStandingsImportFromSheet();
        console.log('[cron] OK:', out);
      } catch (e) {
        console.error('[cron] ERRORE standings:', e);
      }
    },
    { timezone: tz }
  );

  if (process.env.CRON_RUN_ON_BOOT === '1') {
    (async () => {
      try {
        console.log('[cron] run on boot: import standings da sheet…');
        const out = await runStandingsImportFromSheet();
        console.log('[cron] boot OK:', out);
      } catch (e) {
        console.error('[cron] boot errore:', e);
      }
    })();
  }
}


