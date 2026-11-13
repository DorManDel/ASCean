# ASCean — Open Simulation & Research Reference Library

**Reviewed:** 2026-11-13 | **Status:** External research sources; none automatically integrated into ASCean. Reviewed for architecture, modeling questions and experiment design, not as an unreviewed source-code pool.

## In one paragraph: what is SwimmingIndividuals?

[SwimmingIndividuals.jl](https://github.com/mattwoodstock/SwimmingIndividuals) is a **Julia agent-based marine ecosystem simulation framework**. Each agent or *superindividual* carries its own state and takes part in rules for movement, feeding/predation, energy expenditure, growth, reproduction and mortality, influenced by environmental grids. Its [2026 PLOS Computational Biology paper](https://doi.org/10.1371/journal.pcbi.1013610) describes visual prey detection, bioenergetics, diel vertical migration, fisheries effects and GPU/CPU acceleration. It is useful for designing ecological interactions but **not** a drop-in fish-body hydrodynamic renderer, anatomical injury system or verified individual DNA-to-personality predictor.

**Code license check:** GitHub metadata currently reports no repository-level license for SwimmingIndividuals (as of this review). The research paper's CC BY license does NOT automatically license the code. Study and cite it; obtain or clarify software permission before copying/deriving implementation.

## Simulators & computational models

| Source | Link | What it models | ASCean experiment priority |
|---|---|---|---|
| SwimmingIndividuals | https://github.com/mattwoodstock/SwimmingIndividuals | Individual/superindividual marine ecology, habitat, predator detection, energy and reproduction | Ecosystem agent lifecycle, event ordering, spatial index; P1 research |
| OSMOSE | https://github.com/osmose-model/osmose | Multispecies fish interactions, size-based predation, growth, mortality and fishing; schools/2D regions | Food-web realism, predator-prey size rules; P1 |
| GoFish | https://github.com/vmahan1998/GoFish | Modular migratory-fish ABMs, tidal responses, salinity/contaminants | FSM/behavior and habitat response; P1 |
| FiMoS (FishBehavStateSim) | https://sardine-colaboration.github.io/FiMoS/ | Self-propelled movement with Markov-switching behavior states and downloadable labeled trajectories | Explore/rest/flee/forage states and test trajectories; P1 |
| Fish schooling WebGL demo | https://github.com/vetemaa/fish-simulation | Boids-style cohesion/alignment/separation plus predator and obstacle response | Visual schooling reference, NOT calibrated shoal biology; P1 |
| OpenDrift | https://github.com/OpenDrift/opendrift | Ocean particle drift via currents/winds/waves and optional process modules | Motor-off drifting / food particle transport; P1 |
| Ichthyop | https://github.com/ichthyop/ichthyop | Eggs and larvae advected by ocean flow, development and dispersal | Larval movement and reproductive lifecycle; P2 |
| Oceananigans.jl | https://github.com/CliMA/Oceananigans.jl | CPU/GPU ocean fluid dynamics, pressure and flow grids | Advanced water physics reference; do not embed full CFD into first browser build; P2 |
| OceanBioME.jl | https://github.com/OceanBioME/OceanBioME.jl | Nutrients, phytoplankton, zooplankton, detritus and carbonate chemistry | Food → plankton → waste → nutrients cycle; P2 |
| Atlantis ecosystem | https://github.com/Atlantis-Ecosystem-Model | Spatial marine ecosystem simulation across food webs and fisheries | Long-term ecological dynamics; P3 |

## Species facts and data

| Dataset | Link | Use | Limitation |
|---|---|---|---|
| WoRMS API | https://www.marinespecies.org/rest/ | Marine organism canonical names, AphiaID, classification and synonyms | Taxonomy ≠ physiological parameter |
| FishBase / API | https://www.fishbase.se/ , https://fishbaseapi.readme.io/reference/license | Fish diet, length/weight, life history, reproduction and references | FishBase API states CC BY-NC; commercial reuse requires permission |
| SeaLifeBase | https://www.sealifebase.org/ | Marine animals other than fish | Coverage/license per source |
| OBIS | https://obis.org/data/access/ | Marine occurrence locations, timestamps and depth metadata | Presence ≠ complete tolerance range or behavior |
| ZFIN | https://zfin.org/ | Zebrafish anatomy, genes, developmental stages and citations | Freshwater research taxon; not an ocean-species profile |
| EMODnet Physics | https://emodnet.ec.europa.eu/en/physics | Temperature, currents, salinity and observations | Coarse ocean data need controlled scaling to our test tank |
| FathomNet | https://database.fathomnet.org/ | Real underwater organism images, segmentation and annotations | Per-image/per-annotation license, no universal license |
| NOAA Ocean Exploration Video | https://www.ncei.noaa.gov/access/ocean-exploration/video/index.html | ROV video with dates, depth and location; real creatures for movement observation | Ocean Exploration portal videos public domain with NOAA attribution; video is observational, not a force dataset |

## How we turn a source into a mechanic

1. Select a **question**: e.g. what happens when current flows left and a fish faces right but stops propelling?
2. Select 1–3 **sources**, exact mathematical model and scope; distinguish laws from species-calibrated parameters.
3. Record empirical source data with taxon, age/stage, habitat, units, method, date, identifier and permission.
4. Create a reproducible **mini aquarium scenario**, fixed seed, inputs, outputs and expected assertions.
5. Implement one reusable TypeScript system independent of Canvas/ASCII.
6. Compare outputs with source observation or dataset, add quantitative uncertainty; only then consider biological calibration.
7. Review, approve, PR to development, benchmark and PCM checkpoint. **Do not integrate without acceptance.**

## Recommended first 4 science experiments

- **P1 Movement/Drift:** OpenDrift current model ideas + Newton/Archimedes; motor off vs tide, sink/hover, renderer heading unaffected by velocity sign.
- **P1 Behavior state:** FiMoS/GoFish. REST → EXPLORE → FLEE with limited field of view, state transition reason and event log.
- **P1 Predator/prey:** OSMOSE sizing/encounter and SwimmingIndividuals localized prey sensing. Two live fish, 3D pursuit, optional miss; separate collision and bite event.
- **P2 Matter cycle:** OceanBioME NPZD as conceptual nutrient inspiration. Food → gut → feces/detritus → decomposer/nutrients. Use real nonnegative, conserved material ledger; no invented digestion efficiency.

## Software rights & scientific integrity

Open GitHub repos are not automatically permissively licensed. Check each repository LICENSE and its dataset licenses before copying source, assets or training models. Cite papers and track scientific models separately from computational tests. Some licenses are GPL/copyleft or noncommercial and may affect ASCean. The current source index is a research plan, **not a legal opinion**.

Use the named sources as architecture/math inspiration and design new code under ASCean's own reviewed implementations.
