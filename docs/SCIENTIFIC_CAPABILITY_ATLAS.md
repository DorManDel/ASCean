# ASCean · Living Organism Capability Atlas

Status: **Research / design inventory**, not implemented biology.
Date: 2026-11-13. Maintainer: ASCean Development Hub.

## Purpose

The engine must model a living, autonomous **aquatic organism** rather than assuming every entity is a bony fish. A creature combines capabilities: locomotor mechanism, buoyancy control, respiration, senses, dietary physiology, behavior, development and reproduction. Some capabilities are absent; some are stage-specific. Rendering ASCII fish is presentation only.

**Critical separation**
- Physical law: dimensionally valid equation with known assumptions, e.g. Newton/Archimedes/hydrostatic pressure.
- Empirical biological model: requires species, stage, environmental context, parameter sources and calibration.
- Illustrative teaching scenario: deterministic rule and clear visual, but no claim of biological prediction.
- Engine-integration status: separate from scientific evidence. A correct program can still model the wrong biology.

## Capability map: simplest to advanced

Priority: P0 = engine substrate; P1 = first validated interactions; P2 = basic organism; P3 = multi-species ecology; P4 = advanced biology/learning.

| ID | Domain | Case: organism can... | Relevant context / minimum test | Priority |
|---|---|---|---|---|
| C01 | Identity | Spawn, die, move dense array slot without changing ID | Deterministic seeded spawn/remove/snapshot | P0 |
| C02 | Time | Advance physics independently of browser FPS | 30 vs 60 vs 165 vs 240 synthetic renders | P0 |
| C03 | Coordinates | Move in XYZ; Y is vertical, Z into side camera | Ascend/descend and lateral depth tests | P0 |
| C04 | Dynamics | Accelerate in response to a known net force | Same thrust, different mass | P1 |
| C05 | Dynamics | Change world position due to current with motor off | Flow-only drift at neutral buoyancy | P1 |
| C06 | Dynamics | Experience drag relative to local water, not ground | Moving current + stationary vs propelling fish | P1 |
| C07 | Buoyancy | Hover, ascend, sink or rest depending on mass/volume/lift | Motor off and +/- buoyancy fixture | P1 |
| C08 | Buoyancy | Vary gas bladder volume/pressure where applicable | Descent changes gas buoyancy; species-specific | P3 |
| C09 | Locomotion | Orient head and generate forward propulsion | Heading-vs-velocity separation; no glyph gliding backward | P1 |
| C10 | Locomotion | Turn/roll/pitch with bounded rotational acceleration | Avoid instant 180° flip or unstable roll | P1 |
| C11 | Locomotion | Move backward using fins **only if capable** | Bluegill-style reverse vs drift, explicitly distinct | P3 |
| C12 | Locomotion | Use body/caudal undulation (BCF) | Eel-like vs tuna-like body/tail patterns | P2 |
| C13 | Locomotion | Use median/paired fin (MPF) propulsion | Reef hover/fin steering, species-specific | P2 |
| C14 | Locomotion | Use jet propulsion, bell pulsing or walking | Squid, jellyfish, bottom-dweller | P4 |
| C15 | Energy | Produce work; pay cost for swimming/active lift | No perpetual acceleration without fuel/force | P2 |
| C16 | Environment | Sense realistic temperature/salinity/pH/oxygen | Sample at exact XYZ and time | P2 |
| C17 | Environment | Experience hydrostatic pressure based on Y depth | Change Z only -> unchanged pressure | P1 |
| C18 | Environment | Sense reduced depth-dependent light | Spectral irradiance, turbidity, surface time | P2 |
| C19 | Environment | Swim through currents/eddies/turbulence | Speed/direction relative to local water sample | P2 |
| C20 | Environment | Navigate reefs, caves, sand, obstacles | Avoid intersection, enter shelter | P2 |
| C21 | Environment | Encounter nutrient and ammonia fields | Separate TAN and NH3, no universal "ammonia attraction" | P3 |
| C22 | Environment | Handle tide/day-night and seasons | Time-varying fields; not render-time animation | P3 |
| C23 | Senses | Detect nearby fish in true XYZ, with direction | Spatial-grid candidates != sensed neighbors | P1 |
| C24 | Senses | See through water with range affected by light/turbidity | Species visibility and occlusion test | P2 |
| C25 | Senses | Detect water motion using lateral line | Distinct from vision radius and hearing | P3 |
| C26 | Senses | Follow dissolved chemical cues | Advection/diffusion field, response is species-specific | P3 |
| C27 | Senses | Sense sounds/vibration/electric fields if capable | Non-universal electroreception in sharks/rays | P4 |
| C28 | Movement | Avoid potential collision in XYZ | Two fish approaching at same depth | P1 |
| C29 | Contact | Intentionally touch, bite, push or mate | Behavior decision before physical contact; body hit region | P2 |
| C30 | Contact | Separate overlapping physical volumes | Broadphase -> narrowphase -> resolution | P1 |
| C31 | Feeding | Detect, inspect and choose food by diet and mouth geometry | Suitable plankton vs oversized/non-diet prey | P2 |
| C32 | Feeding | Capture prey, miss, flee or stop pursuit | Predator and prey both move, no deterministic guaranteed bite | P2 |
| C33 | Digestion | Swallow and transfer gut contents over time | Food mass into gut is not immediate tissue | P2 |
| C34 | Digestion | Assimilate nutrients, spend energy and egest feces | Nonoverlapping matter/energy ledger | P2 |
| C35 | Excretion | Release nitrogen waste via species-appropriate pathways | Gill ammonia vs feces; environmental mass balance | P3 |
| C36 | Food web | Consume algae, zooplankton, prey, detritus if diet allows | Feces are possible detritus, NOT universal fish food | P3 |
| C37 | Physiology | Balance oxygen uptake and respiratory demand | Dissolved oxygen/temp/activity, species data | P3 |
| C38 | Physiology | Regulate water/salt balance | Freshwater zebrafish vs saltwater clownfish | P3 |
| C39 | Anatomy | Grow skeleton, tissue and fin dimensions | Standard Length vs Total Length | P3 |
| C40 | Condition | Gain/lose reserves, stomach content or reproductive contents | Body mass derived from physical compartments | P2 |
| C41 | Life history | Develop through embryo/larva/juvenile/adult stages | Stage alters locomotion, diet and reproduction | P3 |
| C42 | Life history | Grow based on species/genetics/food/environment | Biological Hybrid Growth, calibrated curves | P3 |
| C43 | Life history | Age, starve, recover, become sick, die | No instant disappearance without matter/energy policy | P3 |
| C44 | Anatomy | Experience fin/eye/gill injury with local consequences | Damage location -> capacity change; healing time evidence | P4 |
| C45 | Behavior | Choose forage/rest/explore/flee based on drives and senses | Finite-state vs utility-policy fixtures | P2 |
| C46 | Behavior | Seek shelter, maintain distance or territory | Reef, rock, current and predator presence | P2 |
| C47 | Behavior | Investigate/socialize/court without guaranteed mating | State transitions and context-specific intent | P3 |
| C48 | Behavior | Shoal/school via local social interactions | Observable trajectory rules; not uncalibrated "Boids = fish" | P3 |
| C49 | Behavior | Migrate vertically/daily/seasonally | Daylight, risk, food, physiology, species capability | P3 |
| C50 | Behavior | Change color, ink, emit light or camouflage | Squid chromatophores, deep sea species | P4 |
| C51 | Reproduction | Spawn eggs, fertilize, guard nests or brood | Species-specific external/internal reproduction | P3 |
| C52 | Reproduction | Bear live offspring, sex-change or use special strategies | Shark modes; clownfish social sex change | P4 |
| C53 | Genetics | Inherit a known validated trait model from two parents | Toy diploid visual loci NOT real genome prediction | P4 |
| C54 | Learning | Remember places, food, danger or social outcomes | Decaying/spatial memory and deterministic tests | P3 |
| C55 | Learning | Adapt policy after experience | A/B behavioral trials and no per-fish LLM default | P4 |
| C56 | Ecology | Decompose corpses/waste and recycle matter | Detrital loop, microbial simplified pool | P3 |
| C57 | Ecology | Experience populations, resource competition and carrying capacity | Growth under depletion and starvation | P4 |
| C58 | Measurement | Log precise state/events, reproduce from seed and version | Expected replay, state hash, tests | P0 |
| C59 | Presentation | Render parts made of ASCII glyphs with body pose | Heading correct, fin animation bounded, Z fades | P1 |
| C60 | Research | Trace every coefficient and claim to evidence | Species/taxon, DOI, units, stage, confidence, license | P0 |

## Organism architecture: composition instead of "one Fish AI"

\`\`\`text
Organism (ID, speciesId, age, physical state)
 ├─ Geometry & MassComposition
 ├─ MovementCapability (BCF / MPF / jet / pulse / walking / other)
 ├─ BuoyancyCapability (bladder / lipid + lift / passive / regulated / none)
 ├─ RespirationCapability (gill ventilation / ram / buccal / air ...)
 ├─ PerceptionCapability (vision / lateral line / chemo / hearing / electrical ...)
 ├─ NutritionCapability (diet profile, gut, absorption, excretion)
 ├─ BehaviorPolicy (FSM → utility model → learning optionally)
 ├─ ReproductiveStrategy (eggs / livebearing / brooding / sex-change ...)
 ├─ LifeStage & GrowthModel
 └─ RenderProfile (ASCII parts / glyph sprite / camera)
\`\`\`

Capabilities are populated from a versioned species reference and can vary by life stage. The generic World owns state and transforms; no class hierarchy forces every sea animal to have fins, gills, a swim bladder or a vertebrate genome.

### Candidate pilot organisms (NOT yet calibrated)

| Pilot | Habitat | Why include | Avoid false generalization |
|---|---|---|---|
| Zebrafish (Danio rerio) | Freshwater research tank | ZFIN developmental anatomy, growth stages, tests | Not a saltwater animal |
| Ocellaris clownfish (Amphiprion ocellaris) | Marine reef/anemone | Fins, shelter, social hierarchy and reproduction | Sex changes arise under species-typical social contexts |
| Nurse shark (Ginglymostoma cirratum) | Marine bottom/reef | Resting, buccal respiration, benthic behavior | "Every shark must keep swimming" is false |
| Shortfin mako / active ram ventilator | Pelagic marine | Constant movement in service of respiration | Do not copy nurse shark mode |
| Squid (cephalopod) | Marine | Jet propulsion, camouflage and ink | Not a fish; no tail-fin model |
| Jellyfish (scyphozoan) | Marine | Bell pulses and passive drift | Very different anatomy and locomotion |

### Scientific reference anchors

- **Fish locomotion modes:** Sfakiotakis et al. (1999), IEEE DOI https://doi.org/10.1109/48.757275
- **Aquatic propulsion scaling:** Saadat et al. (2017) https://doi.org/10.1103/PhysRevFluids.2.083102
- **Buoyancy / swim bladder:** Pelster (2021) https://doi.org/10.1002/jez.2460
- **Shark respiration differences:** https://ocean.si.edu/ocean-life/sharks-rays/sharks
- **Clownfish protandry:** https://doi.org/10.1152/physrev.00044.2019
- **Cephalopod ink:** https://pmc.ncbi.nlm.nih.gov/articles/PMC4052311/
- **Jellyfish hydrodynamics:** https://doi.org/10.1146/annurev-marine-031120-091442
- **Collective motion (data-derived, not just boids):** https://pmc.ncbi.nlm.nih.gov/articles/PMC3219116/
- **Comparative ecosystem ABM (published 2026-11-06):** https://doi.org/10.1371/journal.pcbi.1013610 ; code https://github.com/mattwoodstock/SwimmingIndividuals
- **3D fish tracking:** https://doi.org/10.5061/dryad.5d972
- **Documented organism staging:** https://zfin.org/zf_info/zfbook/stages/

## Engineering rule

Each Cxx case gets: unit-aware input/output, parameters + provenance, deterministic fixture, mini aquarium controls, expected observed outcomes, failure/edge cases, property tests, optional video reference and status in PCM. Do not mark SCIENTIFICALLY_CALIBRATED just because the behavior looks plausible.
