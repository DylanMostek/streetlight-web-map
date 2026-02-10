// src/main.js
import "./style.css";

// ArcGIS core
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Search from "@arcgis/core/widgets/Search";

// ✅ Fix for GitHub Pages: load ArcGIS assets from Esri CDN
esriConfig.assetsPath = "https://js.arcgis.com/4.30/@arcgis/core/assets";

// OPTIONAL: basemap key if you ever need it
// esriConfig.apiKey = "PASTE_YOUR_ARCGIS_API_KEY_HERE";

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
          <span>Show Streetlights Layer</span>
        </label>
        <div class="info" id="statusText">Booting…</div>
      </div>

      <div class="section">
        <div style="font-size:13px; margin-bottom:8px;">Filter</div>

        <!-- IMPORTANT: Domain codes are literally: High / Medium / Low -->
        <select id="priorityFilter">
          <option value="All" selected>All</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
          <option value="(null)">Priority is blank (null)</option>
        </select>

        <div style="display:flex; gap:8px; margin-top:10px;">
          <button id="clearFilterBtn" style="flex:1;">Clear</button>
          <button id="resetViewBtn" style="flex:1;">Reset view</button>
        </div>

        <div class="hint" style="margin-top:10px;">
          Note: Most features currently have Priority = null, so filtering High/Medium/Low may show only a few.
        </div>
      </div>

      <div class="section">
        <label style="display:flex; gap:8px; align-items:center;">
          <input id="clusterToggle" type="checkbox" checked />
          <span>Cluster points</span>
        </label>
        <div class="hint">Tip: Use Search (top-left) to jump to an address.</div>
      </div>

      <div class="section">
        <div style="font-size:13px; margin-bottom:8px;">Debug</div>
        <button id="zoomBtn">Zoom to sample points</button>
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
const clusterToggle = document.getElementById("clusterToggle");
const zoomBtn = document.getElementById("zoomBtn");

function setStatus(msg) {
  statusText.textContent = msg;
}

// ---- Make points SUPER visible ----
const pointRenderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    style: "circle",
    size: 16,
    color: [239, 68, 68, 1], // bright red
    outline: { color: [255, 255, 255, 1], width: 2.5 },
  },
};

const streetlightsLayer = new FeatureLayer({
  url: STREETLIGHTS_URL,
  outFields: ["*"],
  title: "Streetlights",
  renderer: pointRenderer,
  popupEnabled: true,
  popupTemplate: {
    title: "Streetlight {LightID}",
    content: [
      {
        type: "fields",
        fieldInfos: [
          { fieldName: "Status", label: "Status" },
          { fieldName: "Priority", label: "Priority" },
          { fieldName: "Condition", label: "Condition" },
          { fieldName: "NeedsReview", label: "Needs Review" },
          { fieldName: "Inspector", label: "Inspector" },
          { fieldName: "Notes", label: "Notes" },
        ],
      },
    ],
  },
});

const map = new Map({
  basemap: "streets-navigation-vector",
  layers: [streetlightsLayer],
});

const view = new MapView({
  container: "viewDiv",
  map,
  center: [-96.7026, 40.8136],
  zoom: 13,
});

const search = new Search({ view });
view.ui.add(search, "top-left");

// ---- Clustering (make clusters OBVIOUS) ----
const clusterConfig = {
  type: "cluster",
  clusterRadius: "70px",
  labelingInfo: [
    {
      deconflictionStrategy: "none",
      labelExpressionInfo: { expression: "Text($feature.cluster_count, '#,###')" },
      symbol: {
        type: "text",
        color: "white",
        haloColor: "black",
        haloSize: 1,
        font: { size: 12, weight: "bold" },
      },
      labelPlacement: "center-center",
    },
  ],
  popupTemplate: {
    title: "Cluster",
    content: "This cluster represents {cluster_count} streetlights.",
  },
  // Big blue cluster bubbles so you SEE them
  renderer: {
    type: "simple",
    symbol: {
      type: "simple-marker",
      style: "circle",
      size: 26,
      color: [59, 130, 246, 0.9],
      outline: { color: [255, 255, 255, 1], width: 2 },
    },
  },
};

function applyClustering() {
  streetlightsLayer.featureReduction = clusterToggle.checked ? clusterConfig : null;
}

// ---- Filtering ----
function sqlString(v) {
  return `'${String(v).replaceAll("'", "''")}'`;
}

function applyPriorityFilter() {
  const val = priorityFilter.value;

  if (val === "All") {
    streetlightsLayer.definitionExpression = null;
    return;
  }

  if (val === "(null)") {
    streetlightsLayer.definitionExpression = "Priority IS NULL";
    return;
  }

  // Domain codes are: "High", "Medium", "Low"
  streetlightsLayer.definitionExpression = `Priority = ${sqlString(val)}`;
}

async function updateLoadedCount() {
  try {
    const q = streetlightsLayer.createQuery();
    q.where = streetlightsLayer.definitionExpression || "1=1";
    q.returnGeometry = false;
    const count = await streetlightsLayer.queryFeatureCount(q);
    setStatus(`Loaded: ${count} features`);
  } catch (e) {
    console.error(e);
    setStatus("Loaded (count failed — check console)");
  }
}

// ---- Zoom to actual points (NOT the broken world extent) ----
async function zoomToPoints() {
  try {
    const q = streetlightsLayer.createQuery();
    q.where = streetlightsLayer.definitionExpression || "1=1";
    q.returnGeometry = true;
    q.num = 2000;

    const res = await streetlightsLayer.queryFeatures(q);
    const geoms = res.features.map((f) => f.geometry).filter(Boolean);

    if (!geoms.length) {
      alert("No geometries returned for current filter.");
      return;
    }

    // goTo supports an array of geometries and computes an extent for them
    await view.goTo(geoms, { duration: 700 });
  } catch (e) {
    console.error(e);
    alert("Zoom failed. Check console.");
  }
}

// ---- Wire up UI ----
toggleLayer.addEventListener("change", () => {
  streetlightsLayer.visible = toggleLayer.checked;
});

priorityFilter.addEventListener("change", async () => {
  applyPriorityFilter();
  await updateLoadedCount();
  await zoomToPoints();
});

clearFilterBtn.addEventListener("click", async () => {
  priorityFilter.value = "All";
  streetlightsLayer.definitionExpression = null;
  await updateLoadedCount();
  await zoomToPoints();
});

resetViewBtn.addEventListener("click", () => {
  view.goTo({ center: [-96.7026, 40.8136], zoom: 13 });
});

clusterToggle.addEventListener("change", async () => {
  applyClustering();
  await updateLoadedCount();
});

zoomBtn.addEventListener("click", zoomToPoints);

// ---- Load handling ----
(async () => {
  try {
    setStatus("Loading layer…");
    await streetlightsLayer.load();

    setStatus("Waiting for view…");
    await view.when();

    // Ensure layer is actually in view pipeline
    const layerView = await view.whenLayerView(streetlightsLayer);

    layerView.watch("updating", (u) => {
      if (u) setStatus("Layer updating…");
      else updateLoadedCount();
    });

    applyClustering();
    applyPriorityFilter();

    await updateLoadedCount();
    await zoomToPoints();
  } catch (err) {
    console.error(err);
    setStatus("Layer failed to load — open console");
  }
})();
