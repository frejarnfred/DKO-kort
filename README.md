# Spildevand og kvalitativ kodning — Danmarkskort

Interaktivt Leaflet-kort over spildevandsmålinger af rusmidler i seks danske byer, koblet med en kvalitativ kodning af rocker-/bandetilstedeværelse i samme byer.

## Formål

Kortet kombinerer to datalag på samme geografiske referencepunkter:

1. Spildevandsmålinger af rusmidler (indekstal, normaliseret til onsdag = 1), fra EUDA's 2026-datasæt.
2. Kvalitativ kodning af, om der er dokumenteret rocker-/bandetilstedeværelse i byen.

Formålet er at undersøge, om der kan identificeres geografisk sammenfald mellem de to lag.

## Dækning

Seks byer med spildevandsdata i EUDA-datasættet: København (Lynetten), Aarhus, Odense, Aalborg, Esbjerg, Næstved.

Data dækker årene 2013 til 2025, men kun 2025 har fuld dækning på tværs af alle seks byer og alle otte stoffer. Kortet viser derfor som udgangspunkt 2025 (`CURRENT_YEAR` i `src/config.js`).

Stoffer i datasættet: MDMA, amfetamin, cannabis, cocain, cotinin (`cot`, nikotin-markør), ethylsulfat (`ets`, alkohol-markør), ketamin, metamfetamin. Stoffer efterspurgt i den oprindelige korrespondance, men ikke til stede i datasættet: opioider, benzodiazepiner, pregabalin, kathinoner.

## Struktur

```
index.html            → siden, indlæser Leaflet fra CDN
src/config.js          → konstanter: årstal, ugedagsrækkefølge, datastier
src/map.js              → Leaflet-init, markørrendering, kobling til kvalitativt lag
src/substance-filter.js → bygger stof-knapperne, filtrerer data
src/detail-panel.js     → ugeprofil og kvalitativ kodning ved klik på en by
src/ui.js               → henter data, binder moduler sammen
data/points.geojson     → seks referencepunkter (by-centrum-koordinater)
data/samples.json       → spildevandsmålinger, én række per by/stof/år
data/qualitative.json   → kvalitativ kodning af rocker-/bandetilstedeværelse
```

## Kør lokalt

Filerne bruger `fetch()` til at hente JSON og GeoJSON, hvilket kræver en lokal server, ikke blot at åbne `index.html` direkte i browseren.

```
python3 -m http.server 8000
```

Åbn derefter `http://localhost:8000` i browseren.

## Data

**Spildevand**: hentet fra EUDA's 2026-udgivelse (`ww2026-all-data_en.csv`), filtreret til Danmark. Værdier er indekstal, ikke koncentration i mg, se `unit: "index_wednesday_eq_1"` i `samples.json`.

**Punkter**: koordinaterne i `points.geojson` er by-centrum, ikke de faktiske renseanlægskoordinater.

**Kvalitativ kodning**: `qualitative.json` dækker perioden 2021-2026 og bygger på offentligt tilgængelige kilder: NSK's rapportserie "Rocker- og bandesituationen i Danmark", politikredsenes pressemeddelelser om opholds- og samlingsstedsforbud, Rigspolitiets svar til Folketingets Retsudvalg, Anklagemyndighedens meddelelser samt regional nyhedsdækning. Hver post indeholder `groups` med navn, type, status, periode og `evidence`, plus `source_note` og `confidence` på by-niveau.

Væsentligt forbehold: der findes ingen offentlig, systematisk kortlægning af rocker- og bandegrupperingers tilstedeværelse fordelt på by. NSK's rapporter opgør kun landstal og navngiver konflikter uden geografi. By-fordelingen i denne fil er derfor udledt af klubhusadresser, myndighedsafgørelser og hændelsessteder, ikke af en officiel opgørelse. Aarhus er undtagelsen: Østjyllands Politi navngav i 2024 fire grupperinger med samlingssted i byen i et svar til Folketinget.

Dækningen er ujævn. Aarhus, Aalborg og København har relativt god kildedækning; Næstved har kun én dokumenteret gruppering i perioden og er den svageste. Fravær af fund er ikke det samme som fravær af grupperinger, og antallet af grupperinger per by afspejler i høj grad, hvor meget der er blevet skrevet om byen, ikke nødvendigvis hvor mange grupperinger der faktisk er.

## Kendte begrænsninger

- Kun seks faste byer, ingen mekanisme for at tilføje flere uden at redigere `points.geojson` og `samples.json` manuelt.
- Kortets markører viser kun ét årstal ad gangen (`CURRENT_YEAR`), sat manuelt i `src/config.js`, ikke beregnet dynamisk.
- Indeks-værdier fra EUDA og eventuelle fremtidige rå koncentrationstal (fx fra den danske nationale rapport) er ikke på samme skala og kan ikke vises direkte sammenligneligt i samme visning uden videre arbejde.
