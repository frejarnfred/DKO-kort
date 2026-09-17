import { WEEKDAY_ORDER, WEEKDAY_LABELS, CURRENT_YEAR } from "./config.js";

let panelEl;

export function initDetailPanel(containerEl) {
  panelEl = containerEl;
  panelEl.classList.add("detail-panel", "hidden");
}

export function closeDetailPanel() {
  panelEl.classList.add("hidden");
  panelEl.innerHTML = "";
}

// cityName: display name, sample: the sample record for this catchment,
// substance and CURRENT_YEAR (already filtered upstream). qualitative is
// optional: the record from qualitative.json for this catchment, if any.
export function showDetailPanel(cityName, sample, qualitative) {
  panelEl.classList.remove("hidden");
  panelEl.innerHTML = "";

  const heading = document.createElement("h3");
  heading.textContent = `${cityName} — ${sample.substance} (${CURRENT_YEAR})`;
  panelEl.appendChild(heading);

  if (qualitative) {
    const qualBlock = document.createElement("div");
    qualBlock.className = "qualitative-block";

    const qualHeading = document.createElement("p");
    qualHeading.className = "qualitative-heading";
    qualHeading.textContent = qualitative.presence
      ? "Kvalitativ kodning: rocker-/bandegruppering registreret tilstede"
      : "Kvalitativ kodning: ingen registreret tilstedeværelse";
    qualBlock.appendChild(qualHeading);

    if (qualitative.presence) {
      const groupType = document.createElement("p");
      groupType.className = "qualitative-detail";
      groupType.textContent = qualitative.group_type ?? "";
      qualBlock.appendChild(groupType);

      const sourceNote = document.createElement("p");
      sourceNote.className = "qualitative-source";
      sourceNote.textContent = `Kilde og forbehold: ${
        qualitative.source_note ?? "ikke angivet"
      } (${qualitative.confidence ?? "usikkerhed ikke angivet"})`;
      qualBlock.appendChild(sourceNote);
    }

    panelEl.appendChild(qualBlock);
  }

  const note = document.createElement("p");
  note.className = "detail-note";
  note.textContent = `Indeks, onsdag = 1. Ugentligt gennemsnit: ${
    sample.weekday_mean ?? "ingen data"
  }, weekend: ${sample.weekend_mean ?? "ingen data"}.`;
  panelEl.appendChild(note);

  const chart = document.createElement("div");
  chart.className = "weekday-chart";

  const values = WEEKDAY_ORDER.map((day) => sample.weekday_values?.[day]);
  const maxValue = Math.max(...values.filter((v) => v !== null && v !== undefined), 1);

  for (const day of WEEKDAY_ORDER) {
    const value = sample.weekday_values?.[day];
    const bar = document.createElement("div");
    bar.className = "weekday-bar";

    const fill = document.createElement("div");
    fill.className = "weekday-bar-fill";
    fill.style.height = value ? `${(value / maxValue) * 100}%` : "2%";
    if (value === null || value === undefined) {
      fill.classList.add("weekday-bar-missing");
    }

    const label = document.createElement("span");
    label.className = "weekday-bar-label";
    label.textContent = WEEKDAY_LABELS[day];

    const valueLabel = document.createElement("span");
    valueLabel.className = "weekday-bar-value";
    valueLabel.textContent = value !== null && value !== undefined ? value : "–";

    bar.appendChild(valueLabel);
    bar.appendChild(fill);
    bar.appendChild(label);
    chart.appendChild(bar);
  }

  panelEl.appendChild(chart);

  const closeBtn = document.createElement("button");
  closeBtn.textContent = "Luk";
  closeBtn.className = "detail-close-btn";
  closeBtn.addEventListener("click", closeDetailPanel);
  panelEl.appendChild(closeBtn);
}
