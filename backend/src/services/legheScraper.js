import axios from 'axios';
import * as cheerio from 'cheerio';


export async function fetchPublicStandings({ leagueSlug }){
// Esempio: https://leghe.fantacalcio.it/<slug>/classifica
const url = `https://leghe.fantacalcio.it/${leagueSlug}/classifica`;
const { data: html } = await axios.get(url, {
headers: {
'User-Agent': 'Mozilla/5.0 (compatible; FantalcioBot/1.0)'
},
timeout: 15000
});
const $ = cheerio.load(html);


// Parser difensivo: cerca righe della classifica
const rows = [];
$("a, tr, li").each((_, el) => {
const text = $(el).text().trim();
// Heuristics: riga con nome squadra e numeri. Adatta ai selettori della tua lega!
if(/\d+\s*-?\s*\d*/.test(text) && text.length > 3){
const team = $(el).find('a, span, div').first().text().trim() || text.split(/\s{2,}/)[0];
// Punti all’ultima colonna numerica trovata
const nums = text.match(/\d+/g)?.map(n => parseInt(n,10)) || [];
const points = nums.at(-1) ?? null;
if(team && points !== null){
rows.push({ team, points });
}
}
});


// De-duplica e ordina
const seen = new Map();
for(const r of rows){ if(!seen.has(r.team)) seen.set(r.team, r); }
return Array.from(seen.values()).sort((a,b)=> b.points - a.points);
}