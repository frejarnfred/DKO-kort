// Fixed year for the overview map, per project decision (2026-09).
// EUDA 2025 data is the only year with complete coverage across all six
// Danish catchments and all eight substances. Update manually when a newer
// CSV export is added; this is not computed dynamically.
export const CURRENT_YEAR = 2025;

export const WEEKDAY_ORDER = [
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
  "monday",
  "tuesday",
];

export const WEEKDAY_LABELS = {
  wednesday: "Ons",
  thursday: "Tor",
  friday: "Fre",
  saturday: "Lør",
  sunday: "Søn",
  monday: "Man",
  tuesday: "Tir",
};

export const DATA_PATHS = {
  points: "data/points.geojson",
  samples: "data/samples.json",
  qualitative: "data/qualitative.json",
};
