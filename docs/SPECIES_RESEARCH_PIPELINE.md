# ASCean · Species, Observation, Footage & Evidence Pipeline

Status: research plan; none of the external databases are automatically imported. Date 2026-11-13.

## Rules

- Species are not hard-coded subclasses. A SpeciesProfile selects **capabilities**: locomotion, breathing, senses, food, morphology, buoyancy, life cycle, reproduction and behavior.
- Each value must have a source/DOI/record ID, conditions, evidence tier, units, permission to store/use and last verification.
- Observational footage supports **what fish actually do**; a behavioral observation does not by itself provide hydrodynamic coefficients or prove a universal response.
- Unknown fields remain \`null\`/Unknown, never filled with generated "realistic" numerical values.
- Reuse media/datasets only under checked terms and attribution; links to licensed videos do not imply permission to copy or train on them.
- Data provenance is separate from whether engine code passes tests.

## Databases selected for evaluation

| Source | Primary role | Useful fields | Caveat |
|---|---|---|---|
| [WoRMS](https://www.marinespecies.org/rest/) | Canonical marine taxonomy, AphiaID and synonyms | accepted name, classification, citations/distribution | Taxonomy is not a habitat tolerance model |
| [FishBase](https://www.fishbase.org/) | Fishes: ecology, growth, diet and life history | length, weight, diet, max age, environments, references | API documents CC BY-NC; review use terms, attribution and any commercial intent before importing |
| [SeaLifeBase](https://www.sealifebase.org/) | Non-fish marine organisms | biodiversity ecology, species references | coverage/availability varies; check licensing |
| [OBIS](https://manual.obis.org/access) | Marine species observation records | locations, time, depth, observation metadata | Occurrence ≠ full tolerated range or absence |
| [ZFIN](https://zfin.org/) | Zebrafish genetics/anatomy/development | stages, ontology, phenotypes and source publications | Zebrafish freshwater only, not typical ocean fish |
| [NOAA NCEI Ocean Exploration](https://www.ncei.noaa.gov/products/ocean-exploration) | Ocean water, habitats, footage and observed taxa | annotated ROV videos, depth/time/location | Deep-sea ROV footage is not automatically a typical fish behavior sample |
| [EMODnet Physics](https://emodnet.ec.europa.eu/en/physics) | Current/temp/salinity/turbidity environmental measurements | spatial profiles and time series | QC levels vary; not one ocean condition |
| [EMODnet Bathymetry](https://emodnet.ec.europa.eu/en/bathymetry-2) | Seafloor depth and reef geography | bathymetric grids | Resolution too coarse for a small aquarium obstacle |
| [Scientific Data fish segmentation/tracking 2026](https://www.nature.com/articles/s41597-026-07786-z) | Annotated real fish footage | tracks, masks, individual motion | Check annotation schema, source habitat and data license |
| [3D fish motion dataset, Dryad](https://doi.org/10.5061/dryad.5d972) | Multi-camera high-speed motion/forces | 3D body pose and trajectories | Large files; validate exact experimental setup |
| [MBARI Deep-Sea Guide](https://www.mbari.org/data/deep-sea-guide/) | Deep marine organism observations | annotated life forms/habitat | Portal is undergoing redevelopment; usage rights specific to asset |
| [NOAA Ocean Exploration video](https://www.ncei.noaa.gov/access/ocean-exploration/video/index.html) | Visual behavior teaching/annotation | timestamp, depth, video and species | NOAA Okeanos videos on official media kit are public domain with NOAA credit; verify each asset |
| [SwimmingIndividuals](https://github.com/mattwoodstock/SwimmingIndividuals) | Comparative open scientific ABM code/math | detection, dynamic depth, bioenergetics, superindividual scaling | Its superindividual model and Julia/GPU stack are not our same one-fish-one-agent design |

Scientific anchors: https://doi.org/10.1371/journal.pcbi.1013610 (published 2026-11-06), https://doi.org/10.1109/48.757275, https://pmc.ncbi.nlm.nih.gov/articles/PMC3219116/.

## First pilot research queue

1. \`Danio rerio\` (zebrafish): fresh water, developmental staging and body tracking. Validated anatomy reference, not marine habitat.
2. \`Amphiprion ocellaris\` (clownfish): marine reef, site fidelity/social hierarchy, fin maneuvering, spawning and protandry (verify exact species study).
3. \`Ginglymostoma cirratum\` (nurse shark): benthic resting and buccal pumping; compare with shortfin mako ram ventilation.
4. \`Isurus oxyrinchus\` (shortfin mako): active pelagic swimming, ram ventilation, different buoyancy/locomotion.
5. Squid species with documented jet propulsion, ink and chromatophore behavior (select named species before coefficients).
6. Jellyfish such as Aurelia species: pulsatile bell motion and ambient current drift.

**Never mix incompatible example habitats in one shared sample aquarium** unless the scenario explicitly studies incompatible exposure and makes it clear this is not a sustainable habitat.

## SpeciesProfile source schema (illustrative type contract)

\`\`\`ts
type EvidenceTier = "unknown" | "illustrative" | "literature" | "calibrated";
type SourceRef = {
  authority: "WoRMS" | "FishBase" | "SeaLifeBase" | "ZFIN" | "NOAA" | "paper" | "dataset";
  idOrDoi: string; url: string; citation?: string; accessedAt: string;
  license?: string; conditions?: string; evidenceTier: EvidenceTier;
};
type ResearchParameter<T> = {
  value: T | null; unit: string; measurementMethod?: string;
  speciesId: string; lifeStage?: string; habitat?: string;
  uncertainty?: string; reference: SourceRef;
};
type SpeciesProfile = {
  scientificName: string; taxonIds: {aphiaId?: number; fishBaseId?: number; zfinId?: string};
  locomotionCapabilities: string[];
  buoyancyCapability: string | null;
  ventilationCapability: string | null;
  senses: string[];
  dietaryCapacities: string[];
  reproductionStrategy: string | null;
  references: SourceRef[];
};
\`\`\`

No fake exact life stage counts or gene loci by default. FishDex can have an explicit "Unknown / source requested" value and an evidence indicator.

## Footage-to-behavior annotation format

Each annotation links to an immutable source asset:

\`\`\`json
{
  "species": "scientific name or unknown",
  "sourceUrl": "video page",
  "sourceLicense": "verify before reuse",
  "videoTimeStartSeconds": 0,
  "videoTimeEndSeconds": 0,
  "event": "TURN | CRUISE | BURST | FLEE | FEED | REST | HOVER | SCHOOL | COURT | SPAWN | UNKNOWN",
  "fishHeading": "estimated with confidence, optional",
  "waterVelocity": null,
  "bodyLengthDefinition": "SL | TL | unknown",
  "environment": {"depthM": null, "temperatureC": null, "lightLux": null, "habitat": null},
  "annotator": "user / researcher / model with review",
  "evidenceTier": "observed_not_calibrated",
  "qualityNotes": "occlusion, camera motion, scale unknown"
}
\`\`\`

Original media, extracted tracks, scientific parameter fits and engine tests are distinct assets. Do not infer real-world speed from pixels/frame without spatial scale, camera calibration and FPS metadata.

## Pipeline

Taxonomic ID → research citations/permission check → anatomical/behavior footage → manually review observed action categories → record data conditions and units → fit model → holdout validation → source-linked parameter registry → mini aquarium scenario → reproducible test → owner approval → engine integration → PCM checkpoint.

Use seed + scenario/commit SHA + environment snapshot. Distinguish source-verified behavior from scientifically calibrated outcomes, and always disclose unknowns.

## Reference assets to start with

- NOAA Ocean Exploration Media Kit: https://oceanexplorer.noaa.gov/about/media-kit/ (public domain NOAA/Okeanos footage with NOAA credit, check specifics)
- NOAA Video Portal: https://www.ncei.noaa.gov/access/ocean-exploration/video/index.html
- MBARI Deep-Sea Guide: https://www.mbari.org/data/deep-sea-guide/
- Annotated fish tracking dataset (Scientific Data 2026): https://www.nature.com/articles/s41597-026-07786-z
- Dryad multi-camera 3D tracking: https://doi.org/10.5061/dryad.5d972
- Pelster buoyancy/swimbladder review: https://doi.org/10.1002/jez.2460
