import { DATA_PATHS } from "./config.js";
import { initMap, setPoints, setQualitative, renderMarkers } from "./map.js";
import {
  buildSubstanceButtons,
  filterBySubstance,
} from "./substance-filter.js";
import { initDetailPanel, showDetailPanel } from "./detail-panel.js";

async function loadJSON(path) {
  const res = await fetch(path);
  if (!res.ok) {
    throw new Error(`Failed to load ${path}: ${res.status}`);
  }
  return res.json();
}

function cityNameFor(pointsGeoJson, catchmentId) {
  const feature = pointsGeoJson.features.find(
    (f) => f.properties.catchment_id === catchmentId
  );
  return feature ? feature.properties.city : catchmentId;
}

async function main() {
  const [pointsGeoJson, samples, qualitative] = await Promise.all([
    loadJSON(DATA_PATHS.points),
    loadJSON(DATA_PATHS.samples),
    loadJSON(DATA_PATHS.qualitative),
  ]);

  initMap();
  setPoints(pointsGeoJson);
  setQualitative(qualitative);

  const detailPanelEl = document.getElementById("detail-panel");
  initDetailPanel(detailPanelEl);

  function rerender(substance) {
    const filtered = filterBySubstance(samples, substance);
    renderMarkers(filtered, (catchmentId, sample, qualitativeRecord) => {
      const cityName = cityNameFor(pointsGeoJson, catchmentId);
      showDetailPanel(cityName, sample, qualitativeRecord);
    });
  }

  const buttonsContainer = document.getElementById("substance-buttons");
  const initialSubstance = buildSubstanceButtons(
    samples,
    buttonsContainer,
    rerender
  );
  rerender(initialSubstance);
}

main().catch((err) => {
  console.error(err);
  document.getElementById("app-error").textContent =
    "Kunne ikke indlæse data. Se konsollen for detaljer.";
});
