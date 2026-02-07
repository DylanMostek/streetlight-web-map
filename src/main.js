// src/main.js
import "./style.css";

// ArcGIS core
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Search from "@arcgis/core/widgets/Search";

// IMPORTANT for GitHub Pages
esriConfig.assetsPath = "./assets";

// Feature layer URL (Layer 0)
const STREETLIGHTS_URL =
  "https://services8.arcgis.com/jzdN07B7ZhRTxuzU/arcgis/rest/services/Streetlights_Inspections/FeatureServer/0";

// ---- Layout ----
document.querySelector("#app").innerHTML = `
  <div id="app-container">
    <div id="sidebar">
      <h2>Streetlight Web Map</h2>
      <p class="subtitle">Internal-style GIS operations viewer</p>

      <div class="section">
        <label style="display:flex; gap:8px; align-items:center;">
          <input id="toggleLayer" type="checkbox" checked />
          <span>Show Streetlights Layer</span>
        </label>
        <div class="info" id="statusText">Loading…</div>
      </div>

      <div class="section">
        <div style="font-size:13px; margin-bottom:8px;">Filter</div>
        <select id="priorityFilter">
          <option value="All" selected>All</option>
          <option value="High Priority">High Priority</option>
          <option value="Medium Priority">Medium Priority</option>
          <option value="Low Priority">Low Priority</option>
        </select>

        <button id="clearFilterBtn">Clear filter</button>
        <button id="resetViewBtn">Reset view</button>
      </div>

      <div class="section">
        <label style="display:flex; gap:8px; align-items:center;">
          <input id="clusterToggle" type="checkbox" checked />
          <span>Cluster points</span>
        </label>
        <div class="hint">Tip: Use Search (top-left) to jump to an address.</div>
      </div>
    </div>

    <div id="viewDiv"></div>
  </div>
`;

// ---- VISIBLE POINT RENDERER (THIS IS THE KEY FIX) ----
const pointRenderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    style: "circle",
    size: 8,
    color: "#ef4444",
    outline: {
      color: "#ffffff",
      width: 1,
    },
  },
};

// ---- Feature Layer ----
const streetlightsLayer = new FeatureLayer({
  url: STREETLIGHTS_URL,
  outFields: ["*"],
  title: "Streetlights",
  renderer: pointRenderer, // 👈 THIS MAKES THEM VISIBLE
});

// ---- Map + View ----
const map = new Map({
  basemap: "streets-navigation-vector",
  layers: [streetlightsLayer],
});

const view = new MapView({
  container: "viewDiv",
  map,
  center: [-96.7026, 40.8136], // Lincoln, NE
  zoom: 13,
});

// ---- Search ----
const search = new Search({ view });
view.ui.add(search, "top-left");

// ---- UI ----
const statusText = document.getElementById("statusText");
const toggleLayer = document.getElementById("toggleLayer");
const priorityFilter = document.getElementById("priorityFilter");
const clearFilterBtn = document.getElementById("clearFilterBtn");
const resetViewBtn = document.getElementById("resetViewBtn");
const clusterToggle = document.getElementById("clusterToggle");

// ---- Helpers ----
function setStatus(msg) {
  statusText.textContent = msg;
}

function guessPriorityField(layer) {
  const candidates = ["Priority", "priority", "PRIORITY"];
  const fields = (layer.fields || []).map((f) => f.name);
  return candidates.find((c) => fields.includes(c)) || null;
}

function applyPriorityFilter() {
  const val = priorityFilter.value;
  if (val === "All") {
    streetlightsLayer.definitionExpression = null;
    return;
  }

  const field = guessPriorityField(streetlightsLayer);
  if (!field) return;

  streetlightsLayer.definitionExpression = `${field} = '${val}'`;
}

async function updateLoadedCount() {
  try {
    const q = streetlightsLayer.createQuery();
    q.where = streetlightsLayer.definitionExpression || "1=1";
    q.returnGeometry = false;
    const count = await streetlightsLayer.queryFeatureCount(q);
    setStatus(`Loaded: ${count} features`);
  } catch {
    setStatus("Loaded");
  }
}

// ---- Clustering ----
const clusterConfig = {
  type: "cluster",
  clusterRadius: "60px",
};

function applyClustering() {
  streetlightsLayer.featureReduction =
    clusterToggle.checked ? clusterConfig : null;
}

// ---- Events ----
toggleLayer.addEventListener("change", () => {
  streetlightsLayer.visible = toggleLayer.checked;
});

priorityFilter.addEventListener("change", async () => {
  applyPriorityFilter();
  await updateLoadedCount();
});

clearFilterBtn.addEventListener("click", async () => {
  priorityFilter.value = "All";
  streetlightsLayer.definitionExpression = null;
  await updateLoadedCount();
});

resetViewBtn.addEventListener("click", () => {
  view.goTo({ center: [-96.7026, 40.8136], zoom: 13 });
});

clusterToggle.addEventListener("change", applyClustering);

// ---- Load ----
streetlightsLayer.when(async () => {
  applyClustering();
  applyPriorityFilter();
  await updateLoadedCount();
});
