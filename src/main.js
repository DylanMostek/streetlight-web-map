import "./style.css";

import Map from "@arcgis/core/Map";
import MapView from "@arcgis/core/views/MapView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Legend from "@arcgis/core/widgets/Legend";
import Expand from "@arcgis/core/widgets/Expand";
import Search from "@arcgis/core/widgets/Search";

// =======================
// CONFIG
// =======================
const FEATURE_LAYER_URL =
  "https://services8.arcgis.com/jzdN07B7ZhRTxuzU/arcgis/rest/services/Streetlights_Inspections/FeatureServer/0";

// Fallback start (used if extent query is weird)
const FALLBACK_CENTER = [-96.7, 40.81]; // Lincoln-ish
const FALLBACK_ZOOM = 13;

// =======================
// PAGE LAYOUT
// =======================
document.querySelector("#app").innerHTML = `
  <div id="app-container">
    <div id="sidebar">
      <h2>Streetlight Web Map</h2>
      <p class="subtitle">Internal-style GIS operations viewer</p>

      <div class="section">
        <label>
          <input type="checkbox" id="layerToggle" checked />
          Show Streetlights Layer
        </label>
        <div id="loadedInfo" class="info">Loading layer…</div>
      </div>

      <div class="section">
        <label for="filterSelect">Filter</label>
        <select id="filterSelect">
          <option value="ALL">All</option>
          <option value="BROKEN">Broken</option>
          <option value="HIGH">High Priority</option>
          <option value="NEEDSREVIEW">Needs Review</option>
        </select>

        <button id="clearBtn">Clear filter</button>
        <button id="resetViewBtn">Reset view</button>
      </div>

      <div class="section">
        <label>
          <input type="checkbox" id="clusterToggle" checked />
          Cluster points
        </label>
      </div>

      <p class="hint">Tip: Use Search (top-left) to jump to an address.</p>
    </div>

    <div id="viewDiv"></div>
  </div>
`;

// =======================
// MAP + VIEW
// =======================
const map = new Map({
  basemap: "streets-navigation-vector",
});

const view = new MapView({
  container: "viewDiv",
  map,
  center: FALLBACK_CENTER,
  zoom: FALLBACK_ZOOM,
});

// =======================
// SEARCH WIDGET
// =======================
const search = new Search({ view });
view.ui.add(search, "top-left");

// =======================
// FEATURE LAYER
// =======================
const streetlightLayer = new FeatureLayer({
  url: FEATURE_LAYER_URL,
  outFields: ["*"],
  popupTemplate: {
    title: "Light {LightID}",
    content: [
      {
        type: "text",
        text:
          "<b>Status:</b> {Status}<br/>" +
          "<b>Priority:</b> {Priority}<br/>" +
          "<b>Needs Review:</b> {NeedsReview}",
      },
      {
        type: "fields",
        fieldInfos: [
          { fieldName: "Condition", label: "Condition" },
          { fieldName: "InspectionDate", label: "Inspection Date" },
          { fieldName: "Inspector", label: "Inspector" },
          { fieldName: "Notes", label: "Notes" },
        ],
      },
    ],
  },
});

// Clustering (default ON)
streetlightLayer.featureReduction = {
  type: "cluster",
  clusterRadius: "60px",
};

map.add(streetlightLayer);

// =======================
// LEGEND (EXPAND)
// =======================
const legend = new Legend({ view });
const legendExpand = new Expand({
  view,
  content: legend,
  expanded: false,
});
view.ui.add(legendExpand, "top-right");

// =======================
// UI ELEMENTS
// =======================
const layerToggle = document.getElementById("layerToggle");
const filterSelect = document.getElementById("filterSelect");
const clearBtn = document.getElementById("clearBtn");
const resetViewBtn = document.getElementById("resetViewBtn");
const clusterToggle = document.getElementById("clusterToggle");
const loadedInfoEl = document.getElementById("loadedInfo");

let defaultExtent = null;

// =======================
// ZOOM TO DATA (RELIABLE)
// =======================
streetlightLayer.when(async () => {
  try {
    const extentResult = await streetlightLayer.queryExtent({
      where: "1=1",
    });

    if (extentResult?.extent) {
      const expanded = extentResult.extent.expand(1.6);

      const width = expanded.xmax - expanded.xmin;
      const height = expanded.ymax - expanded.ymin;

      // Guardrail against world-sized extents
      if (width > 10 || height > 10) {
        await view.goTo({ center: FALLBACK_CENTER, zoom: FALLBACK_ZOOM });
        defaultExtent = view.extent;
      } else {
        await view.goTo(expanded);
        defaultExtent = expanded;
      }
    } else {
      await view.goTo({ center: FALLBACK_CENTER, zoom: FALLBACK_ZOOM });
      defaultExtent = view.extent;
    }

    await updateLoadedCount();
  } catch (err) {
    console.error(err);
    await view.goTo({ center: FALLBACK_CENTER, zoom: FALLBACK_ZOOM });
    defaultExtent = view.extent;
    loadedInfoEl.textContent = "Layer loaded (fallback view)";
  }
});

// =======================
// FILTER LOGIC
// =======================
function buildWhereClause(choice) {
  if (choice === "BROKEN") return "Status = 'Broken'";
  if (choice === "HIGH") return "Priority = 'High'";
  if (choice === "NEEDSREVIEW")
    return "NeedsReview = 1 OR NeedsReview = 'Yes' OR NeedsReview = true";
  return "1=1";
}

// =======================
// EVENTS
// =======================
layerToggle.addEventListener("change", (e) => {
  streetlightLayer.visible = e.target.checked;
});

filterSelect.addEventListener("change", async (e) => {
  streetlightLayer.definitionExpression = buildWhereClause(e.target.value);
  await updateLoadedCount();
});

clearBtn.addEventListener("click", async () => {
  streetlightLayer.definitionExpression = "1=1";
  filterSelect.value = "ALL";
  await updateLoadedCount();
});

resetViewBtn.addEventListener("click", async () => {
  if (defaultExtent) {
    await view.goTo(defaultExtent);
  }
});

clusterToggle.addEventListener("change", (e) => {
  streetlightLayer.featureReduction = e.target.checked
    ? { type: "cluster", clusterRadius: "60px" }
    : null;
});

// =======================
// FEATURE COUNT
// =======================
async function updateLoadedCount() {
  try {
    const count = await streetlightLayer.queryFeatureCount({
      where: streetlightLayer.definitionExpression || "1=1",
    });
    loadedInfoEl.textContent = `Loaded: ${count} features`;
  } catch {
    loadedInfoEl.textContent = "Loaded: count unavailable";
  }
}
