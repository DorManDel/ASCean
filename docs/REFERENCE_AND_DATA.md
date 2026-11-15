# ASCean — REFERENCE & DATA

**Reviewed:** 2026-11-13. **Status:** Candidate references, not automatically imported or scientifically calibrated.
**Purpose:** Central research map for programmers, biology reviewers, Codex and the Development Hub.
**Related:** [equations](SCIENCE_EQUATIONS_AND_MODELS.md), [capabilities](SCIENTIFIC_CAPABILITY_ATLAS.md), [species pipeline](SPECIES_RESEARCH_PIPELINE.md), [engine contracts](ENGINE_COMPONENT_CONTRACTS.md).

## 1. Simulation projects

| Project | What it does | What we could learn | Priority |
|---|---|---|---|
| [SwimmingIndividuals](https://github.com/mattwoodstock/SwimmingIndividuals) | Individual/superindividual marine ecosystems using Julia: energy, growth, reproduction, prey detection, habitat, fishing | Species traits → agent state → ecosystem updates; localized prey lookup, validation and GPU batching | **P0: architecture and agent fields** |
| [OSMOSE](https://github.com/osmose-model/osmose) | Multispecies ecosystems: predation, growth, starvation and reproduction | Food webs, size-based prey compatibility, population effects | P2 |
| [GoFish](https://vmahan1998.github.io/GoFish/) ([repo](https://github.com/vmahan1998/GoFish)) | Migrating fish respond to tides, habitats and estuarine conditions | Behavioral rules, migration and environmental response | P1 |
| [FiMoS](https://sardine-colaboration.github.io/FiMoS/) | Fish movement and switching behavioral states | State transitions and labeled trajectories for REST/EXPLORE/FLEE/FORAGE | **P1: behavior** |
| [Fish Schooling Demo](https://vetemaa.github.io/fish-simulation/) ([repo](https://github.com/vetemaa/fish-simulation)) | Visual schooling, predator avoidance and obstacle avoidance | Group movement, visualization and debugging; Boids alone is not validated fish behavior | P2 |
| [OpenDrift](https://github.com/OpenDrift/opendrift) | Advection/drift using ocean currents, wind and waves | Motor-off fish drift; plankton, feces and eggs transported by water | **P1: water-relative motion** |
| [Ichthyop](https://github.com/ichthyop/ichthyop) | Larvae and eggs transported by water | Larval movement, survival and dispersal | P2 |
| [Oceananigans](https://github.com/CliMA/Oceananigans.jl) | Fluid dynamics, mixing and water flows | Water/eddy/current numerical methods; not suitable for wholesale browser MVP port | P3 |
| [OceanBioME](https://github.com/OceanBioME/OceanBioME.jl) | Nutrients, phyto/zooplankton, detritus and biogeochemistry | Biological recycling and food → waste → nutrients → food loops | **P2: material ecology** |
| [Atlantis Ecosystem Model](https://github.com/Atlantis-Ecosystem-Model) | Marine ecosystem and fishery management models | Long-term trophic feedback | P3 |

**Suggested study order:** SwimmingIndividuals → FiMoS and OpenDrift → OceanBioME → OSMOSE. These are independent research sources, not installation dependencies. Check their code licenses before copying.

## 2. Databases and observed data

| Database | What we can obtain | ASCean use | Caveat |
|---|---|---|---|
| [FishBase](https://www.fishbase.se/) | Diet, growth, SL/TL, weight, longevity, ecology, original citations | Source-linked FishDex parameters and growth candidates | Website presently says CC BY-NC 4.0; older API docs say CC BY-NC 3.0; verify per dataset/version. Commercial use needs permission |
| [WoRMS API](https://www.marinespecies.org/rest/) | Scientific names, taxonomy, synonyms, AphiaID | Canonical marine species IDs | Taxonomy is not physiological tolerance |
| [OBIS](https://obis.org/data/access/) ([API](https://api.obis.org/)) | Marine occurrence, location/time and sometimes depth | Species distribution evidence | Occurrence is not a complete habitat envelope; records have their own licenses |
| [ZFIN](https://zfin.org/) | Zebrafish anatomy, development, genetics and phenotype literature | First freshwater research species | Not a saltwater fish |
| [FathomNet](https://database.fathomnet.org/) | Underwater organism images, annotations, segmentation masks | ASCII sprite anatomy reference and body part detection | Image/training rights vary |
| [NOAA Video Portal](https://www.ncei.noaa.gov/access/ocean-exploration/video/index.html) | Underwater footage with context | Observe real movements, behaviors, depth and ecology | Check each video license; pixels alone do not imply speed |
| [EMODnet Physics](https://emodnet.ec.europa.eu/en/physics) | Temperature, salinity, current and marine measurements | Compare synthetic water fields with recorded conditions | Scale, quality and regional coverage |
| [SeaLifeBase](https://www.sealifebase.org/) | Biology of non-fish marine life | Squid, jellyfish and additional marine animals | Coverage and individual content rights vary |
| [EMODnet Bathymetry](https://emodnet.ec.europa.eu/en/bathymetry-2) | Seabed depth maps | Future terrain and depth profiles | Not a centimeter-resolution reef mesh |

## 3. How SwimmingIndividuals represents its fish

Source code inspected directly at the upstream main branch on 2026-11-13.

- [src/create.jl](https://github.com/mattwoodstock/SwimmingIndividuals/blob/main/src/create.jl) — construct_individuals initializes a Julia StructArray with **39 per-agent numeric fields**, and initialize_individuals draws starting lengths and body masses from distributions related to species traits and habitat.
- [src/utilities.jl](https://github.com/mattwoodstock/SwimmingIndividuals/blob/main/src/utilities.jl) — separates MarineModel, species parameter records, MarineEnvironment, MarineDepths, spatial data and agent arrays.
- [examples/Mackerel/traits.csv](https://github.com/mattwoodstock/SwimmingIndividuals/blob/main/examples/Mackerel/traits.csv) — named King Mackerel example with Max_age, Min_Size, Max_Size, length–weight coefficients (LWR_a/b), Swim_velo, School_Size, reproductive maturity, stomach capacity and respiration parameters.
- [inputs/resource_traits.csv](https://github.com/mattwoodstock/SwimmingIndividuals/blob/main/inputs/resource_traits.csv) — nonfocal resources (including sharks, cetaceans and prey groups) have their own records.
- [inputs/envi_pref.csv](https://github.com/mattwoodstock/SwimmingIndividuals/blob/main/inputs/envi_pref.csv) — pref_min, opt_min, opt_max and pref_max for temperature, bathymetry, salinity.
- [inputs/reproduction.csv](https://github.com/mattwoodstock/SwimmingIndividuals/blob/main/inputs/reproduction.csv) — month-indexed reproductive activity.
- [inputs/environment.nc](https://github.com/mattwoodstock/SwimmingIndividuals/blob/main/inputs/environment.nc) and [examples/Mackerel/environment.nc](https://github.com/mattwoodstock/SwimmingIndividuals/blob/main/examples/Mackerel/environment.nc) — binary NetCDF environmental grids; values were NOT inspected in this audit.
- [src/energy.jl](https://github.com/mattwoodstock/SwimmingIndividuals/blob/main/src/energy.jl) — bioenergetic/recruitment models and fallbacks when some optional parameter files are absent. Fallbacks are **not raw measurements**.
- [PLOS 2026 paper](https://doi.org/10.1371/journal.pcbi.1013610) — source, inputs and processing scripts are reportedly available in the repository/supporting material; the paper reports comparisons with migration, diving and King Mackerel growth observations.

Agent fields in construct_individuals: 
- Identity/spatial: unique_id, x, y, z, pool_x, pool_y, pool_z, cell_id, sorted_id, temp_idx, cell_starts, cell_ends.
- Body/energy: length, abundance, biomass_ind, biomass_school, biomass_init, energy, gut_fullness, cost, ration_energy, ration_biomass, successful_ration.
- Life: alive, active, mature, age, generation, repro_energy.
- Perception/predation: vis_prey, best_prey_dist, best_prey_idx, best_prey_sp, best_prey_type.
- Movement/state: mig_status, target_z, interval, target_pool_x, target_pool_y.

There are 39, but some are temporary computation/indexing fields. Abundance and biomass_school can encode superindividual schools, so one simulated agent can represent multiple real animals. The exact source/calibration for each King Mackerel CSV number needs a per-parameter citation audit; do not assume every sample cell is directly measured.

## 4. Compare to ASCean honestly

Source: [ASCean prototype](../site/shared/world-prototype.mjs). Its currently implemented **8 numeric arrays** are id, XYZ, VX/VY/VZ and bodyMassG; fixed-step reflect-at-bounds, seeded random spawn and 3D spatial-index lookups. It has no scientifically calibrated physiology. Genome Lab is synthetic inheritance; Food/Gut Anatomy is scripted education. Neither is a real fish dataset.

We have **designed**, not implemented, extra compartments: separate SL/TL, body dimensions, organs, reserve material, gut material, reproductive material, species/taxon profile, habitat tolerance, heading/movement strategy, behavior/memory. This scope may be richer at the single-body/anatomical level but does not beat a peer-reviewed and validated ecosystem simulation yet.

**Do not optimize on number of fields.** For each field decide: per-species shared? per-agent varying? derived? transient scratch? persisted? data type? unit? update rate? measured source? required for biology? bytes and CPU time at 100 / 10k / 1M animals? Never pack until measured.

## 5. Source-to-engine ingestion contract

1. **Discover:** record title, version, direct URL, DOI/dataset ID and contacted author if needed.
2. **License check:** original code, data, images and video independently. No scraping/importing/training without permissions. FishBase non-commercial condition may conflict with later commercialization.
3. **Identify:** WoRMS AphiaID where relevant; exact scientific name/synonym; distinguish zebrafish freshwater from marine test scenes.
4. **Parameterize:** a ResearchValue has value or null, unit, uncertainty, conditions (stage/size/sex/habitat), original citation, accessedAt, license, validation level and intended engine consumer.
5. **Observe:** footage annotation records behavior, time, fish heading, tailbeats, landmarks, camera motion, size calibration, depth/current context and uncertainty. Video motion alone is not measured Newtonian force.
6. **Calibrate:** fit/compare against independently held-out observations; document equations, parameter provenance and error envelopes.
7. **Integrate:** first deterministic mini-aquarium, then reusable pure engine system, then Ocean + PCM evidence. Expose simulation vs verified scientific data as separate states.

**Example record, deliberately missing unknown real values:**

    {
      "taxon": "Amphiprion ocellaris",
      "parameter": "standardLengthCm",
      "value": null,
      "unit": "cm",
      "stage": "adult",
      "sourceUrl": null,
      "license": "UNVERIFIED",
      "quality": "UNKNOWN"
    }

## 6. Permission / attribution gates

| Material | Before ASCean reuses it |
|---|---|
| Scientific paper | Cite model and accurately state assumptions; paper CC BY does not automatically authorize code copying |
| Software repository | Check explicit software LICENSE or contact authors; GitHub publicly visible is not a license |
| Research CSV/NetCDF | Check dataset-specific rights and proper attribution, including sources used by the authors |
| FishBase records | Record CC BY-NC terms and link DataRef; ask permission for commercial use |
| FathomNet / NOAA footage | Check per-asset rights; training/redistribution restrictions may differ from viewing |
| Observational models | Separate measured outcomes from modeling assumptions and theoretical parameters |

**SwimmingIndividuals author outreach (potential, not sent):** request exact provenance of trait coefficients, units, uncertainty/ranges, data reuse/license and example model calibration. For code, ask for a software license or explicit permission.

## 7. Research / Codex order of work

**P0:** inspect SwimmingIndividuals agent fields and compare with our state schema; do not port code.
**P1:** use FiMoS movement-state examples and OpenDrift water-relative motion to define one small physical/behavior scenario with seed and tests.
**P2:** use OceanBioME as a conceptual reference for detritus → nutrients → plankton, with mass conservation.
**P3:** use OSMOSE for size-dependent predation/food-web rules once predator physics and stomach events are real.

Every experiment must attach a source, assumptions, a source/evidence status, a reproducible seed, tests, a screenshot/visual comparison, and a review decision. 
