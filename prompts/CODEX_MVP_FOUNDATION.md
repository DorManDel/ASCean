# CODEX — ASCean MVP FOUNDATION (research-informed, implementable first vertical slice)

## Project mission
ASCean: "An OCEAN simulator made letter by letter." An autonomous, eventually multi-species aquatic ecosystem with source-backed physics/biology, modular creature capabilities, and ASCII body-part rendering. We want a research-ready *architecture*, not false claims that day-one MVP is calibrated ecology.

**DO NOT implement the entire ecosystem in one task.**

Repository: https://github.com/DorManDel/ASCean
Existing development review: https://github.com/DorManDel/ASCean/pull/4
Protected refs: main (production) and development (integration). Existing ASCuarium/MobiLab are reference-only and MUST NOT be modified.

## Your immediate task — M1-A (one PR only)
Build a runnable **one-engine/two-app** foundation from the current ASCean baseline. Preserve existing Hub, original historical HTML experiment references and mini-aquariums, without silently turning scripted demonstrations into claims of actual simulation.

Before editing:
1. Inspect actual GitHub repo and both main/development/feature heads. Review open PR #4 before choosing a base; if the Development Hub changes are not integrated into development, do not accidentally lose them. Report the intended base SHA and branch relation.
2. Read AGENTS.md, docs/DECISIONS.md, docs/ENGINE_COMPONENT_CONTRACTS.md, docs/ROADMAP.md, docs/REFERENCE_AND_DATA.md, docs/OPEN_SOURCE_SIMULATORS_AND_DATASETS.md, docs/SCIENTIFIC_CAPABILITY_ATLAS.md, docs/SCIENCE_EQUATIONS_AND_MODELS.md, docs/SPECIES_RESEARCH_PIPELINE.md, and site/shared/world-prototype.mjs.
3. Verify exact source/test status. Prototypes under site/references and site/shared are experiments, not authorized production physics or biology.
4. Create a new feature branch, e.g. feature/mvp-world-current-20261113, from an owner-approved integration base. If branching relationship is ambiguous, provide a plan and open a **draft** PR rather than merging.

### Implement within M1-A

**Core engine**
- TypeScript-first, no DOM/Canvas in core; explicit World, EntityId, OrganismRef, FixedStepClock, SeededRng and Snapshot contracts.
- Dense SoA typed state only for fields proven hot. Stable entity ID != array slot. Swap-remove updates ID map; all entities can be fish, algae, food, waste or obstacles.
- World initial coordinate range X=10000cm right, Y=5000cm up, Z=3000cm into screen. Internally cm/s/g; physically derived force equations use SI conversion utilities and dimensional tests.
- Seed + initial state + input controls reproducibly determine the result. Snapshot needs schema version, RNG state, time and module state.
- Render clock independent of fixed physics clock; configurable *biological* time exists as a contract, not a fake metabolism engine. Pause/single-step must stop/advance physics deterministically.

**Minimal environment and movement vertical slice**
- WaterField interface, initially uniform constant current vector and uniform illustrative water density. Pressure = P_surface + rho*g*depth where depth follows Y only.
- Movement owns separate body heading, motor/propulsion command, water-relative velocity and world velocity.
- Physically consistent but clearly **illustrative** force strategy: F_net = thrust + gravity + buoyancy + drag + contact; displace volume is an explicit input; drag uses v_relative = v_world - u_water and full vector quadratic law, with units and finite guards.
- Fish with zero motor may drift in current, hover if neutrally buoyant, or descend/rise if buoyancy differs. A fish being pushed backward by water is **not** actively reverse swimming; do not flip its facing based on sign(vx).
- Bound turns; avoid instantaneous 180° flip; Z is real motion, independent from screen orientation.

**Shared presentation**
- Both Ocean Simulator and Mechanics Lab consume the same production World and movement system, no duplicate shadow physics in one application.
- Assemble ASCII character-based fish art from separate head/body/tail/fins with anchor points or a small glyph atlas, while keeping anatomy data independent of rendering.
- Show real observed FPS and TPS, not a pretend monitor-Hz slider. Maintain responsive 390px and 1440px UX; clear "Illustrative / Engine Implemented / Research Validated" status labels.
- Provide mini-tank A (no motor neutral buoyancy still water), B (no motor + current drift), C (slightly heavy fish sinks until bottom/contact), D (slightly light fish rises), E (fish headed right while moving left in current, facing stays right), F (Z moves but hydrostatic pressure does not change if Y unchanged).
- Reuse existing four scripted mini-tanks (mating, poop/digestion, attack, social), **label as prototypes**; do not present those as implemented physics.

**Required model separation**
- Agent hot state vs species shared constants vs event/scratch/derived fields.
- Compare SwimmingIndividuals' 39 individual StructArray columns with ASCean's 8 reference-world columns. A bigger array is not automatically better. Propose field ownership and estimated bytes per entity; do not add all upstream 39 columns.
- SpeciesProfile includes taxonomy/source ID + optional capability IDs (locomotion, buoyancy, ventilation, senses, diet, reproduction), with null for unknown calibrated values.
- DataRef/ParameterRef contains URL/DOI, units, stage/population, calibration type, uncertainty, accessedAt and license. No internet import or bundled third-party code/data by default.

### Test M1-A before review
- Deterministic replay and snapshot roundtrip (seed, spawn/remove, physics).
- Fixed-tick invariance under synthetic render frequencies 30/60/165/240 Hz.
- 3D neighbor query equals exhaustive oracle on seeded scenes.
- Position/velocity/force and buoyancy SI unit tests, pressure(Y not Z), drift without propulsion, neutral/up/down buoyancy.
- Sign(vx) change in countercurrent does not invert body heading or swap ASCII head/tail.
- No NaN/Infinity, invalid dt/volume, zero relative velocity, near wall/bottom/surface, empty world, high density, CPU budget; identify tunneling/overlap cases rather than faking solved collisions.
- Browser screenshot and checks for mobile (390px) and desktop (1440px); no overflow, controls usable, interaction buttons really work.
- Benchmarks at 100, 1000, 10000 on measured hardware, or honestly state unavailable. Separate numeric TypedArray allocation from total runtime/browser memory. No claims at one million fish.

**Deliverable gate**
Open one PR to development (or stacked PR targeting feature branch if Hub PR #4 still unmerged), not main; no self merge/release. Include changed-file summary, exact base/head SHA, commands/tests/logs, screenshots, measured runtime/device, scientific limitations, rollback and a compact private PCM checkpoint *proposal*. Do not edit PCM main.

## After M1-A approval, separate PRs (DO NOT implement now)
- M1-B: robust collision candidate + avoidance intent + non-penetration/contact resolution in XYZ, evidence-rich two-fish fixture.
- M1-C: decision-state module REST/EXPLORE/FORAGE/FLEE and sensory input adapters; FiMoS/GoFish are research references.
- M2-A: food as physical resource, ingestion into gut, fecal detritus emission; proper mass ledger with nonnegative conservation. OceanBioME is inspiration, not a copied formula. No invented species digestion rates.
- M2-B: predation/feeding sized encounters; OSMOSE and SwimmingIndividuals for research, bite location/anatomy later.
- M3+: body composition, source-calibrated species, reproduction, real genetics, FishDex, learning/memory and ecosystem outcomes.

## Sources and permissions
- Scientific reference index: docs/REFERENCE_AND_DATA.md
- SwimmingIndividuals paper: https://doi.org/10.1371/journal.pcbi.1013610
- Source: https://github.com/mattwoodstock/SwimmingIndividuals/blob/main/src/create.jl
- FiMoS: https://sardine-colaboration.github.io/FiMoS/
- OpenDrift: https://github.com/OpenDrift/opendrift
- OSMOSE: https://github.com/osmose-model/osmose
- OceanBioME: https://github.com/OceanBioME/OceanBioME.jl

Do not copy code from unlicensed repos or ingest FishBase/noncommercial data into a public or commercial product without reviewing terms. Scientific research is used for independent implementation and calibration; a published paper's open-access license does not automatically license source code, datasets, artwork or video.

## Codex response format
1. Current repo/branches/head SHAs and what is already implemented.
2. Proposed minimum file/module changes, field schema, physics equations and unit choices.
3. M1-A PR implementation and actual tests/results, or a clear blocker.
4. Engine ↔ Lab wiring screenshots and mini-tank behavior.
5. Source licensing/scientific assumptions and uncalibrated inputs.
6. Next approval gate and PCM checkpoint delta.
**Do not claim the simulation is scientifically validated at M1-A.**
