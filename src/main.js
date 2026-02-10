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

// OPTIONAL: If your basemap ever shows blank on GitHub Pages, uncomment and add a key.
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

        <!-- Domain codes for Priority are literally: High / Medium / Low -->
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

      <div class="section">
        <div style="font-size:13px; margin-bottom:8px;">Debug</div>
        <button id="debugBtn">Debug: Run test query</button>
        <pre id="debugOut" style="white-space:pre-wrap; font-size:12px; margin-top:10px; background:#0b1220; color:#dbeafe; padding:10px; border-radius:10px; max-height:220px; overflow:auto;">(click the button)</pre>
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
const debugBtn = document.getElementById("debugBtn");
const debugOut = document.getElementById("debugOut");

function setStatus(msg) {
  statusText.textContent = msg;
}
function setDebug(text) {
  debugOut.textContent = text;
}

// ---- Make points VERY visible ----
const pointRenderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    style: "circle",
    size: 14,
    color: [239, 68, 68, 1],
    outline: { color: [255, 255, 255, 1], width: 2 },
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

// ---- Filtering ----
function sqlValue(v) {
  return `'${String(v).replaceAll("'", "''")}'`;
}

function applyPriorityFilter() {
  const val = priorityFilter.value;

  if (val === "All") {
    streetlightsLayer.definitionExpression = null;
    return;
  }

  // Domain codes: "High", "Medium", "Low"
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

// ---- Debug test query ----
async function runDebugQuery() {
  setDebug("Running queries…");

  try {
    // count everything
    const countQ = streetlightsLayer.createQuery();
    countQ.where = "1=1";
    countQ.returnGeometry = false;

    const total = await streetlightsLayer.queryFeatureCount(countQ);

    // sample 5 features
    const featQ = streetlightsLayer.createQuery();
    featQ.where = "1=1";
    featQ.outFields = ["OBJECTID", "LightID", "Status", "Priority", "Condition", "NeedsReview"];
    featQ.returnGeometry = true;
    featQ.num = 5;

    const feats = await streetlightsLayer.queryFeatures(featQ);

    // extent
    const extQ = streetlightsLayer.createQuery();
    extQ.where = "1=1";
    const extentRes = await streetlightsLayer.queryExtent(extQ);

    const samples = (feats.features || []).map((f) => ({
      OBJECTID: f.attributes?.OBJECTID,
      LightID: f.attributes?.LightID,
      Status: f.attributes?.Status,
      Priority: f.attributes?.Priority,
      Condition: f.attributes?.Condition,
      NeedsReview: f.attributes?.NeedsReview,
      geometry: f.geometry ? { x: f.geometry.x, y: f.geometry.y, sr: f.geometry.spatialReference?.wkid } : null,
    }));

    setDebug(
      [
        `✅ queryFeatureCount(where="1=1") = ${total}`,
        "",
        `✅ sample features returned = ${samples.length}`,
        JSON.stringify(samples, null, 2),
        "",
        `✅ queryExtent(where="1=1")`,
        JSON.stringify(extentRes?.extent ? {
          xmin: extentRes.extent.xmin,
          ymin: extentRes.extent.ymin,
          xmax: extentRes.extent.xmax,
          ymax: extentRes.extent.ymax,
          wkid: extentRes.extent.spatialReference?.wkid
        } : null, null, 2),
      ].join("\n")
    );

    // If we got a real extent (not null), zoom to it
    if (extentRes?.extent) {
      await view.goTo(extentRes.extent.expand(1.3));
    }
  } catch (err) {
    console.error(err);
    setDebug(`❌ Debug query failed:\n${String(err?.message || err)}`);
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

debugBtn.addEventListener("click", runDebugQuery);

// ---- Load handling ----
(async () => {
  try {
    setStatus("Loading layer…");
    await streetlightsLayer.load();

    setStatus("Layer loaded. Waiting for view…");
    await view.when();

    // This is the key: get the actual layer view so we know it’s in the map pipeline
    const layerView = await view.whenLayerView(streetlightsLayer);

    // Watch for updating so we know if it’s stuck fetching
    layerView.watch("updating", (u) => {
      if (u) setStatus("Layer updating…");
      else updateLoadedCount();
    });

    applyClustering();
    applyPriorityFilter();
    await updateLoadedCount();

    // Auto-run debug once on load so you instantly see what the service returns
    await runDebugQuery();
  } catch (err) {
    console.error(err);
    setStatus("Layer failed to load — open console");
    setDebug(`❌ Load failed:\n${String(err?.message || err)}`);
  }
})();
