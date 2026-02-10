// src/main.js
import "./style.css";

// ArcGIS core
import esriConfig from "@arcgis/core/config";
import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Search from "@arcgis/core/widgets/Search";

// ✅ Fix for GitHub Pages: load ArcGIS assets from Esri CDN (no local ./assets needed)
esriConfig.assetsPath = "https://js.arcgis.com/4.30/@arcgis/core/assets";

// ✅ IMPORTANT: If your basemap + services need a key, uncomment and paste your key.
// esriConfig.apiKey = "PASTE_YOUR_ARCGIS_API_KEY_HERE";

// ✅ We will try layer 0 first, then auto-fallback to layer 1 if 0 is empty/blocked.
const SERVICE_BASE =
  "https://services8.arcgis.com/jzdN07B7ZhRTxuzU/arcgis/rest/services/Streetlights_Inspections/FeatureServer";
const LAYER_URL_0 = `${SERVICE_BASE}/0`;
const LAYER_URL_1 = `${SERVICE_BASE}/1`;

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

const map = new Map({
  basemap: "streets-navigation-vector",
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

function applyClustering(layer) {
  layer.featureReduction = clusterToggle.checked ? clusterConfig : null;
}

// ---------- Priority detection ----------
let priorityFieldName = null;
let priorityValueMap = null;

function buildPriorityMappingFromDomain(layer) {
  const fields = layer.fields || [];

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

      const map = {};
      for (const cv of coded) {
        const nm = String(cv.name).toLowerCase();
        if (nm.includes("high")) map["High Priority"] = cv.code;
        if (nm.includes("medium") || nm.includes("med"))
          map["Medium Priority"] = cv.code;
        if (nm.includes("low")) map["Low Priority"] = cv.code;
      }

      priorityValueMap = map;

      console.log("✅ Priority field detected:", priorityFieldName);
      console.log("✅ Priority mapping:", priorityValueMap);
      return;
    }
  }

  priorityFieldName = null;
  priorityValueMap = null;
  console.warn(
    "⚠️ No coded priority domain found. Fields:",
    fields.map((x) => x.name)
  );
}

function sqlValue(v) {
  if (typeof v === "number") return String(v);
  if (typeof v === "boolean") return v ? "1" : "0";
  return `'${String(v).replaceAll("'", "''")}'`;
}

function applyPriorityFilter(layer) {
  const val = priorityFilter.value;

  if (val === "All") {
    layer.definitionExpression = null;
    return;
  }

  // Use coded-domain mapping if available
  if (priorityFieldName && priorityValueMap && priorityValueMap[val] !== undefined) {
    const code = priorityValueMap[val];
    layer.definitionExpression = `${priorityFieldName} = ${sqlValue(code)}`;
    return;
  }

  // Fallback field names
  const candidates = [
    "Priority",
    "priority",
    "PRIORITY",
    "OutagePriority",
    "outage_priority",
  ];
  const fields = (layer.fields || []).map((f) => f.name);
  const found = candidates.find((c) => fields.includes(c));

  if (!found) {
    layer.definitionExpression = null;
    setStatus("Loaded (filter field not found — showing all)");
    return;
  }

  layer.definitionExpression = `${found} = ${sqlValue(val)}`;
}

async function updateLoadedCount(layer) {
  try {
    const q = layer.createQuery();
    q.where = layer.definitionExpression || "1=1";
    q.returnGeometry = false;
    const count = await layer.queryFeatureCount(q);
    setStatus(`Loaded: ${count} features`);
  } catch (e) {
    console.error("❌ Count failed:", e);
    setStatus("Loaded (count failed — check console)");
  }
}

// ---------- Layer chooser / auto fallback ----------
function makeStreetlightsLayer(url) {
  return new FeatureLayer({
    url,
    outFields: ["*"],
    title: "Streetlights",
    renderer: pointRenderer,

    // helps click-testing + proves features exist once loaded
    popupEnabled: true,
    popupTemplate: {
      title: "Streetlight",
      content: "ObjectID: {OBJECTID}",
    },
  });
}

async function tryUseLayer(url) {
  const layer = makeStreetlightsLayer(url);

  // Log if layer view fails
  layer.on("layerview-create-error", (e) => {
    console.error("❌ layerview-create-error:", e);
    setStatus("Layer view error — open console");
  });

  // Load layer metadata first
  await layer.load();

  // Quick sanity query: can we count anything at all?
  const q = layer.createQuery();
  q.where = "1=1";
  q.returnGeometry = false;

  const count = await layer.queryFeatureCount(q);
  return { layer, count };
}

let streetlightsLayer = null;

async function initStreetlights() {
  setStatus("Loading…");

  // Remove any previous layer from map
  if (streetlightsLayer) {
    map.remove(streetlightsLayer);
    streetlightsLayer = null;
  }

  try {
    // Try layer 0
    const res0 = await tryUseLayer(LAYER_URL_0);
    console.log("✅ Using FeatureServer/0, count:", res0.count);
    streetlightsLayer = res0.layer;
    map.add(streetlightsLayer);

    // If it returns 0, auto-try layer 1 (common when /0 is not the actual layer)
    if (res0.count === 0) {
      console.warn("⚠️ Layer 0 returned 0 features. Trying layer 1…");
      map.remove(streetlightsLayer);

      const res1 = await tryUseLayer(LAYER_URL_1);
      console.log("✅ Using FeatureServer/1, count:", res1.count);
      streetlightsLayer = res1.layer;
      map.add(streetlightsLayer);
    }

    // Now that the active layer is set, wire everything up
    await streetlightsLayer.when();

    // Detect mapping after fields exist
    buildPriorityMappingFromDomain(streetlightsLayer);

    applyClustering(streetlightsLayer);
    applyPriorityFilter(streetlightsLayer);
    await updateLoadedCount(streetlightsLayer);

    // If we *still* have 0, warn clearly (usually sharing/auth)
    const sanity = await streetlightsLayer.queryFeatureCount(streetlightsLayer.createQuery());
    if (sanity === 0) {
      console.warn(
        "⚠️ Still 0 features. This usually means the layer is not public or requires a token."
      );
      setStatus("Loaded: 0 features (check layer sharing / token)");
    }
  } catch (err) {
    console.error("❌ Failed to init streetlights:", err);
    setStatus("Layer failed to load/query — open console");
  }
}

// ---- Wire up UI ----
toggleLayer.addEventListener("change", () => {
  if (!streetlightsLayer) return;
  streetlightsLayer.visible = toggleLayer.checked;
});

priorityFilter.addEventListener("change", async () => {
  if (!streetlightsLayer) return;
  applyPriorityFilter(streetlightsLayer);
  await updateLoadedCount(streetlightsLayer);
});

clearFilterBtn.addEventListener("click", async () => {
  if (!streetlightsLayer) return;
  priorityFilter.value = "All";
  streetlightsLayer.definitionExpression = null;
  await updateLoadedCount(streetlightsLayer);
});

resetViewBtn.addEventListener("click", () => {
  view.goTo({ center: [-96.7026, 40.8136], zoom: 13 });
});

clusterToggle.addEventListener("change", () => {
  if (!streetlightsLayer) return;
  applyClustering(streetlightsLayer);
});

// Kick off
initStreetlights();
