// src/main.js
import "./style.css";

// ArcGIS core
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Search from "@arcgis/core/widgets/Search";

esriConfig.assetsPath = "./assets";

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

// ---- Make points VERY visible ----
const pointRenderer = {
  type: "simple",
  symbol: {
    type: "simple-marker",
    style: "circle",
    size: 12, // bigger so you can't miss it
    color: [239, 68, 68, 1], // bright red
    outline: { color: [255, 255, 255, 1], width: 1.5 },
  },
};

const streetlightsLayer = new FeatureLayer({
  url: STREETLIGHTS_URL,
  outFields: ["*"],
  title: "Streetlights",
  renderer: pointRenderer,
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

// ---------- Priority detection (THE REAL FIX) ----------
let priorityFieldName = null;
// maps UI label -> coded value (or string) stored in the feature layer
let priorityValueMap = null;

function buildPriorityMappingFromDomain(layer) {
  const fields = layer.fields || [];

  // Find a field with a coded value domain that includes High/Medium/Low
  for (const f of fields) {
    const domain = f.domain;
    if (!domain || domain.type !== "codedValue") continue;

    const coded = domain.codedValues || [];
    const names = coded.map((cv) => String(cv.name).toLowerCase());

    const hasHigh = names.some((n) => n.includes("high"));
    const hasMed = names.some((n) => n.includes("medium") || n.includes("med"));
    const hasLow = names.some((n) => n.includes("low"));

    if (hasHigh && hasMed && hasLow) {
      priorityFieldName = f.name;

      // Build label -> code mapping
      const map = {};
      for (const cv of coded) {
        const nm = String(cv.name).toLowerCase();
        if (nm.includes("high")) map["High Priority"] = cv.code;
        if (nm.includes("medium") || nm.includes("med")) map["Medium Priority"] = cv.code;
        if (nm.includes("low")) map["Low Priority"] = cv.code;
      }

      // If your domain labels are literally "High Priority", this still works.
      // If they're "High", this still works.
      priorityValueMap = map;

      console.log("✅ Priority field detected:", priorityFieldName);
      console.log("✅ Priority mapping:", priorityValueMap);
      return;
    }
  }

  // If we get here, we didn’t find a coded domain.
  priorityFieldName = null;
  priorityValueMap = null;
  console.warn("⚠️ No coded priority domain found. Fields:", fields.map((x) => x.name));
}

function sqlValue(v) {
  // numbers should NOT be in quotes, strings should be in quotes
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "1" : "0";
  return `'${String(v).replaceAll("'", "''")}'`;
}

function applyPriorityFilter() {
  const val = priorityFilter.value;

  if (val === "All") {
    streetlightsLayer.definitionExpression = null;
    return;
  }

  // If we detected a coded domain mapping, use it
  if (priorityFieldName && priorityValueMap && priorityValueMap[val] !== undefined) {
    const code = priorityValueMap[val];
    streetlightsLayer.definitionExpression = `${priorityFieldName} = ${sqlValue(code)}`;
    return;
  }

  // Fallback: try a literal text match on common field names
  const candidates = ["Priority", "priority", "PRIORITY", "OutagePriority", "outage_priority"];
  const fields = (streetlightsLayer.fields || []).map((f) => f.name);
  const found = candidates.find((c) => fields.includes(c));

  if (!found) {
    streetlightsLayer.definitionExpression = null;
    setStatus("Loaded (filter field not found — showing all)");
    return;
  }

  streetlightsLayer.definitionExpression = `${found} = ${sqlValue(val)}`;
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
    setStatus("Loaded (count failed)");
  }
}

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
    // Detect the real priority field + mapping FIRST
    buildPriorityMappingFromDomain(streetlightsLayer);

    applyClustering();
    applyPriorityFilter();
    await updateLoadedCount();
  })
  .catch((err) => {
    console.error("Layer failed to load:", err);
    setStatus("Layer failed to load — check console");
  });
