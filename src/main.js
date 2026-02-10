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

// OPTIONAL: If your basemap ever shows blank, uncomment and add a key.
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
        <div class="info" id="statusText">Loading…</div>
      </div>

      <div class="section">
        <div style="font-size:13px; margin-bottom:8px;">Filter</div>

        <!-- ✅ IMPORTANT: values MUST match domain codes: High/Medium/Low -->
        <select id="priorityFilter">
          <option value="All" selected>All</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
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

// UI
const statusText = document.getElementById("statusText");
const toggleLayer = document.getElementById("toggleLayer");
const priorityFilter = document.getElementById("priorityFilter");
const clearFilterBtn = document.getElementById("clearFilterBtn");
const resetViewBtn = document.getElementById("resetViewBtn");
const clusterToggle = document.getElementById("clusterToggle");

function setStatus(msg) {
  statusText.textContent = msg;
}

// ---- Make points VERY visible ----
const pointRenderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    style: "circle",
    size: 12,
    color: [239, 68, 68, 1],
    outline: { color: [255, 255, 255, 1], width: 1.5 },
  },
};

// Feature layer
const streetlightsLayer = new FeatureLayer({
  url: STREETLIGHTS_URL,
  outFields: ["*"],
  title: "Streetlights",
  renderer: pointRenderer,

  // ✅ Good for proving the layer is actually drawing + clickable
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
          { fieldName: "Inspector", label: "Inspector" },
          { fieldName: "Notes", label: "Notes" },
          { fieldName: "LastUpdated", label: "Last Updated" },
        ],
      },
    ],
  },
});

// Map + View
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

// ---- Clustering ----
const clusterConfig = {
  type: "cluster",
  clusterRadius: "60px",
  popupTemplate: {
    title: "Cluster summary",
    content: "This cluster represents {cluster_count} streetlights.",
  },
};

function applyClustering() {
  streetlightsLayer.featureReduction = clusterToggle.checked ? clusterConfig : null;
}

// ---- Filtering (Priority field is literally "Priority") ----
function sqlValue(v) {
  return `'${String(v).replaceAll("'", "''")}'`;
}

function applyPriorityFilter() {
  const val = priorityFilter.value;

  if (val === "All") {
    streetlightsLayer.definitionExpression = null;
    return;
  }

  // ✅ Domain codes are strings: "High" / "Medium" / "Low"
  streetlightsLayer.definitionExpression = `Priority = ${sqlValue(val)}`;
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

// ---- Wire up UI ----
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

clusterToggle.addEventListener("change", () => {
  applyClustering();
});

// ---- Load handling ----
streetlightsLayer
  .when(async () => {
    // ✅ This guarantees you zoom to where the points actually are
    const layerView = await view.whenLayerView(streetlightsLayer);

    applyClustering();
    applyPriorityFilter();
    await updateLoadedCount();

    // Zoom to layer extent (this is huge if your points aren't near your default center)
    const extent = await streetlightsLayer.queryExtent();
    if (extent?.extent) {
      await view.goTo(extent.extent.expand(1.2));
    }
  })
  .catch((err) => {
    console.error("Layer failed to load:", err);
    setStatus("Layer failed to load — check console");
  });
