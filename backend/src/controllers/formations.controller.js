// backend/src/controllers/formations.controller.js

// ✅ DEMO: rose/formazioni base
export async function getFormations(req, res) {
  try {
    const data = [
      {
        team: "Lupi FC",
        module: "3-4-3",
        starters: ["Portiere A","Difensore A","Difensore B","Difensore C","Centrocampista A","Centrocampista B","Centrocampista C","Centrocampista D","Attaccante A","Attaccante B","Attaccante C"],
        bench: ["panchinaro 1","panchinaro 2","panchinaro 3"]
      },
      {
        team: "Real Carogna",
        module: "4-3-3",
        starters: ["Portiere B","Difensore D","Difensore E","Difensore F","Difensore G","Centrocampista E","Centrocampista F","Centrocampista G","Attaccante D","Attaccante E","Attaccante F"],
        bench: ["panchinaro 1","panchinaro 2"]
      }
    ];
    res.json(data);
  } catch (e) {
    console.error('[formations] getFormations error:', e);
    res.status(500).json({ error: e.message });
  }
}

