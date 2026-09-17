import { CURRENT_YEAR } from "./config.js";

let map;
let markersLayer;
let pointsById = {};
let qualitativeByCatchment = {};

// Denmark bounding box, roughly. Used to fit the initial view.
const DENMARK_BOUNDS = [
  [54.4, 7.5],
  [57.9, 15.5],
];

export function initMap() {
  map = L.map("map", { zoomControl: true });
  map.fitBounds(DENMARK_BOUNDS);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
    maxZoom: 18,
  }).addTo(map);

  markersLayer = L.layerGroup().addTo(map);

  return map;
}

export function setPoints(pointsGeoJson) {
  pointsById = {};
  for (const feature of pointsGeoJson.features) {
    pointsById[feature.properties.catchment_id] = feature;
  }
}

// qualitativeRecords: array from qualitative.json, one record per catchment_id.
export function setQualitative(qualitativeRecords) {
  qualitativeByCatchment = {};
  for (const record of qualitativeRecords) {
    qualitativeByCatchment[record.catchment_id] = record;
  }
}

// samples: array of sample records already filtered to one substance.
// For each catchment, only CURRENT_YEAR records are used; a catchment with
// no record for CURRENT_YEAR is skipped rather than showing stale data.
// onMarkerClick(catchmentId, sample) is called when a marker is clicked.
export function renderMarkers(samples, onMarkerClick) {
  markersLayer.clearLayers();

  const byCatchment = {};
  for (const s of samples) {
    if (s.year === CURRENT_YEAR) {
      byCatchment[s.catchment_id] = s;
    }
  }

  const values = Object.values(byCatchment)
    .map((s) => s.daily_mean)
    .filter((v) => v !== null && v !== undefined);
  const maxValue = values.length ? Math.max(...values) : 1;

  for (const [catchmentId, sample] of Object.entries(byCatchment)) {
    const feature = pointsById[catchmentId];
    if (!feature) continue;

    const [lon, lat] = feature.geometry.coordinates;
    const value = sample.daily_mean;
    const radius = value === null ? 6 : 6 + 18 * (value / maxValue);

    const qualitative = qualitativeByCatchment[catchmentId];
    const hasPresence = qualitative?.presence === true;

    const marker = L.circleMarker([lat, lon], {
      radius,
      color: hasPresence ? "#c53030" : "#2b6cb0",
      weight: hasPresence ? 2 : 1,
      fillColor: "#4299e1",
      fillOpacity: 0.6,
    });

    const presenceLabel = hasPresence
      ? " — kvalitativ kodning: tilstede"
      : "";
    marker.bindTooltip(
      `${feature.properties.city}: ${
        value === null ? "ingen data" : value.toFixed(1)
      }${presenceLabel}`
    );

    marker.on("click", () => onMarkerClick(catchmentId, sample, qualitative));

    markersLayer.addLayer(marker);
  }
}
