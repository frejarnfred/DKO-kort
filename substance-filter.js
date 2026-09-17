let activeSubstance = null;
let onChangeCallback = () => {};

export function getActiveSubstance() {
  return activeSubstance;
}

// samples: full unfiltered sample array, used only to derive the list of
// substances present in the data (so new substances added later show up
// automatically without editing this file).
export function buildSubstanceButtons(samples, containerEl, onChange) {
  onChangeCallback = onChange;

  const substances = [...new Set(samples.map((s) => s.substance))].sort();
  activeSubstance = substances[0] ?? null;

  containerEl.innerHTML = "";
  for (const substance of substances) {
    const btn = document.createElement("button");
    btn.textContent = substance;
    btn.className = "substance-btn";
    btn.dataset.substance = substance;
    btn.setAttribute(
      "aria-pressed",
      substance === activeSubstance ? "true" : "false"
    );

    btn.addEventListener("click", () => {
      if (activeSubstance === substance) return;
      activeSubstance = substance;
      for (const other of containerEl.querySelectorAll(".substance-btn")) {
        other.setAttribute(
          "aria-pressed",
          other.dataset.substance === substance ? "true" : "false"
        );
      }
      onChangeCallback(activeSubstance);
    });

    containerEl.appendChild(btn);
  }

  return activeSubstance;
}

export function filterBySubstance(samples, substance) {
  return samples.filter((s) => s.substance === substance);
}
