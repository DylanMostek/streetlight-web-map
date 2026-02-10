// src/main.js
import "./style.css";

// ArcGIS core
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import GraphicsLayer from "@arcgis/core/layers/GraphicsLayer";
import Graphic from "@arcgis/core/Graphic";
import Search from "@arcgis/core/widgets/Search";

// ✅ Fix for GitHub Pages: load ArcGIS assets from Esri CDN
esriConfig.assetsPath = "https://js.arcgis.com/4.30/@arcgis/core/assets";

// OPTIONAL: If basemap ever goes blank on GitHub Pages, uncomment and add a key.
// esriConfig.apiKey = "YOUR_ARCGIS_API_KEY_HERE";

const STREETLIGHTS_URL =
  "https://services8.arcgis.com/jzdN07B7ZhRTxuzU/arcgis/rest/services/Streetlights_Inspections/FeatureServer/0";

// --- Layout ---
document.querySelector("#app").innerHTML = `
  <div id="app-container">
    <div id="sidebar">
      <h2>Streetlight Web Map</h2>
      <p class="subtitle">Internal-style GIS operations viewer</p>

      <div class="section">
        <label style="display:flex; gap:8px; align-items:center;">
          <input id="toggleLayer" type="checkbox" checked />
          <span>Show Streetlights</span>
        </label>
        <div class="info" id="statusText">Loading…</div>
      </div>

      <div class="section">
        <div style="font-size:13px; margin-bottom:8px;">Filter</div>

        <!-- Your domain codes are literally: High / Medium / Low -->
        <select id="priorityFilter">
          <option value="All" selected>All</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
          <option value="(null)">Priority is blank (null)</option>
        </select>

        <button id="clearFilterBtn">Clear filter</button>
        <button id="resetViewBtn">Reset view</button>

        <div class="hint" style="margin-top:10px;">
          Heads up: a lot of your features have Priority = null, so High/Medium/Low might show only a few.
        </div>
      </div>

      <div class="section">
        <div style="font-size:13px; margin-bottom:8px;">Debug</div>
        <button id="zoomBtn">Zoom to loaded streetlights</button>
      </div>
    </div>

    <div id="viewDiv"></div>
  </div>
`;

// UI
const statusText = document.getElementById("statusText");
const toggleLayer = document.getElementById("toggleLayer");
const priorityFilter = document.getElementById("priorityFilter");
const clearFilterBtn = document.getElementById("clearFilterBtn");
const resetViewBtn = document.getElementById("resetViewBtn");
const zoomBtn = document.getElementById("zoomBtn");

function setStatus(msg) {
  statusText.textContent = msg;
}

function sqlString(v) {
  return `'${String(v).replaceAll("'", "''")}'`;
}

function buildWhereFromUI() {
  const val = priorityFilter.value;

  if (val === "All") return "1=1";
  if (val === "(null)") return "Priority IS NULL";

  // domain codes: High/Medium/Low
  return `Priority = ${sqlString(val)}`;
}

// --- Data source (FeatureLayer used ONLY for querying) ---
const streetlightsSource = new FeatureLayer({
  url: STREETLIGHTS_URL,
  outFields: ["*"],
  title: "Streetlights (source)",
});

// --- Display layer (GraphicsLayer draws dots reliably) ---
const streetlightsGraphics = new GraphicsLayer({
  title: "Streetlights (display)",
});

// Bright, obvious dot symbol
const dotSymbol = {
  type: "simple-marker",
  style: "circle",
  size: 18,
  color: [239, 68, 68, 1],
  outline: { color: [255, 255, 255, 1], width: 3 },
};

const map = new Map({
  basemap: "streets-navigation-vector",
  layers: [streetlightsGraphics],
});

const view = new MapView({
  container: "viewDiv",
  map,
  center: [-96.7026, 40.8136],
  zoom: 13,
});

const search = new Search({ view });
view.ui.add(search, "top-left");

// ---- Core: re-query + redraw graphics whenever filter changes ----
async function refreshStreetlights() {
  const where = buildWhereFromUI();

  try {
    setStatus("Loading streetlights…");

    const q = streetlightsSource.createQuery();
    q.where = where;
    q.returnGeometry = true;
    q.outFields = ["*"];
    q.num = 2000;

    const res = await streetlightsSource.queryFeatures(q);
    const feats = res.features || [];

    streetlightsGraphics.removeAll();

    for (const f of feats) {
      if (!f.geometry) continue;

      const g = new Graphic({
        geometry: f.geometry,
        symbol: dotSymbol,
        attributes: f.attributes,
        popupTemplate: {
          title: "Streetlight {LightID}",
          content: `
            <div><b>Status:</b> {Status}</div>
            <div><b>Priority:</b> {Priority}</div>
            <div><b>Condition:</b> {Condition}</div>
            <div><b>Needs Review:</b> {NeedsReview}</div>
            <div><b>Inspector:</b> {Inspector}</div>
            <div><b>Notes:</b> {Notes}</div>
          `,
        },
      });

      streetlightsGraphics.add(g);
    }

    setStatus(`Loaded: ${feats.length} streetlights`);
    return feats;
  } catch (e) {
    console.error(e);
    setStatus("Failed to load streetlights — check console");
    return [];
  }
}

async function zoomToGraphics() {
  const graphics = streetlightsGraphics.graphics.toArray();
  const geoms = graphics.map((g) => g.geometry).filter(Boolean);

  if (!geoms.length) {
    alert("No streetlights to zoom to for this filter.");
    return;
  }

  await view.goTo(geoms, { duration: 700 });
}

// ---- UI wiring ----
toggleLayer.addEventListener("change", () => {
  streetlightsGraphics.visible = toggleLayer.checked;
});

priorityFilter.addEventListener("change", async () => {
  await refreshStreetlights();
  await zoomToGraphics();
});

clearFilterBtn.addEventListener("click", async () => {
  priorityFilter.value = "All";
  await refreshStreetlights();
  await zoomToGraphics();
});

resetViewBtn.addEventListener("click", () => {
  view.goTo({ center: [-96.7026, 40.8136], zoom: 13 });
});

zoomBtn.addEventListener("click", zoomToGraphics);

// ---- Boot ----
(async () => {
  try {
    setStatus("Loading source layer…");
    await streetlightsSource.load();
    await view.when();

    await refreshStreetlights();
    await zoomToGraphics();
  } catch (e) {
    console.error(e);
    setStatus("Init failed — check console");
  }
})();
