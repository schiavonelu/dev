import cron from 'node-cron';
import axios from 'axios';


export function scheduleRefresh(){
if(!process.env.CRON_REFRESH || !process.env.ADMIN_TOKEN) return;
// Esempio: ogni ora di sabato-domenica (matchday) 09:00-23:00
cron.schedule('0 9-23 * * 6,0', async () => {
try {
await axios.post(`${process.env.PUBLIC_URL}/api/standings/refresh`,
{ league: process.env.LEAGUE_SLUG },
{ headers: { 'x-admin-token': process.env.ADMIN_TOKEN } });
console.log('Standings refresh ok');
} catch(e){ console.error('Standings refresh failed', e.message); }
});
}