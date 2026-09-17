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

    const presence = qualitative.presence ?? null;

    const groupCount =
      qualitative.group_count ?? qualitative.groups?.length ?? 0;

    const qualHeading = document.createElement("p");
    qualHeading.className = "qualitative-heading";
    qualHeading.textContent =
      presence === true
        ? `Kvalitativ kodning (${
            qualitative.period ?? "periode ikke angivet"
          }): ${groupCount} grupperinger`
        : presence === false
        ? "Kvalitativ kodning: ingen registreret tilstedeværelse"
        : "Kvalitativ kodning: ikke kodet endnu";
    qualBlock.appendChild(qualHeading);

    if (presence === true && Array.isArray(qualitative.groups)) {
      const list = document.createElement("ul");
      list.className = "qualitative-groups";

      for (const group of qualitative.groups) {
        const item = document.createElement("li");
        item.className = "qualitative-group";

        const nameEl = document.createElement("span");
        nameEl.className = "qualitative-group-name";
        nameEl.textContent = group.name;
        item.appendChild(nameEl);

        const metaEl = document.createElement("span");
        metaEl.className = "qualitative-group-meta";
        metaEl.textContent = ` (${group.type ?? "type ukendt"}, ${
          group.years ?? "periode ukendt"
        })`;
        item.appendChild(metaEl);

        if (group.status) {
          const statusEl = document.createElement("div");
          statusEl.className = "qualitative-group-status";
          statusEl.textContent = group.status;
          item.appendChild(statusEl);
        }

        // Evidence text is long, so it sits behind a native disclosure
        // element to keep the panel scannable.
        if (group.evidence) {
          const details = document.createElement("details");
          const summary = document.createElement("summary");
          summary.textContent = "Belæg";
          details.appendChild(summary);
          const evidenceEl = document.createElement("p");
          evidenceEl.className = "qualitative-evidence";
          evidenceEl.textContent = group.evidence;
          details.appendChild(evidenceEl);
          item.appendChild(details);
        }

        list.appendChild(item);
      }

      qualBlock.appendChild(list);

      const sourceNote = document.createElement("p");
      sourceNote.className = "qualitative-source";
      const asOf = qualitative.as_of ? `Opdateret: ${qualitative.as_of}. ` : "";
      sourceNote.textContent = `${asOf}Kilder: ${
        qualitative.source_note || "ikke angivet"
      }`;
      qualBlock.appendChild(sourceNote);

      const confidenceNote = document.createElement("p");
      confidenceNote.className = "qualitative-source";
      confidenceNote.textContent = `Usikkerhed: ${
        qualitative.confidence || "ikke angivet"
      }`;
      qualBlock.appendChild(confidenceNote);
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
