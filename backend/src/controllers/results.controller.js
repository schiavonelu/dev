// backend/src/controllers/results.controller.js

// ✅ RISULTATI: 1ª giornata (tutti 0-0) — 5 match
export async function getResults(req, res) {
  try {
    // opzionale: puoi leggere ?league, ?stage se vuoi in futuro
    // const { league, stage } = req.query;

    const data = [
      { home: "Richville",              away: "Senza Padroni FK",      gh: 0, ga: 0, date: "2025-08-23" },
      { home: "Leoni Indomabili",       away: "I Cugini di Bilancia",  gh: 0, ga: 0, date: "2025-08-23" },
      { home: "Atletico Macrì",         away: "Schalke 104",           gh: 0, ga: 0, date: "2025-08-23" },
      { home: "Poggioreal Club de Futbol", away: "F C Sanpa",         gh: 0, ga: 0, date: "2025-08-23" },
      { home: "Atletico Solopaca",      away: "Union Strunz",          gh: 0, ga: 0, date: "2025-08-23" },
    ];

    res.json(data);
  } catch (e) {
    console.error("[results] getResults error:", e);
    res.status(500).json({ error: e.message });
  }
}

// placeholder per future integrazioni
export async function refreshResults(_req, res) {
  res.json({ ok: true, message: "Refresh results bypassed (demo)." });
}


