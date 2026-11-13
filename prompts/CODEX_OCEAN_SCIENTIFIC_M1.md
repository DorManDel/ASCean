# CODEX TASK — ASCean Initial Living Ocean: Scientific-First M1

**Status: handoff proposal. Must be reviewed and owner-approved before autonomous implementation.**
Canonical repo: https://github.com/DorManDel/ASCean
Target base: development. Start a fresh feature/m1-physics-vertical-slice branch from CURRENT development SHA. Open PR to development only; do not touch main, MobiLab, old ASCuarium or PCM main.

## Before work — MUST READ
- AGENTS.md
- docs/DECISIONS.md
- docs/ARCHITECTURE.md
- docs/MECHANICS.md
- docs/SCIENTIFIC_CAPABILITY_ATLAS.md
- docs/SCIENCE_EQUATIONS_AND_MODELS.md
- docs/SPECIES_RESEARCH_PIPELINE.md
- prompts/CODEX_INIT_OCEAN_M1.md
- site/shared/world-prototype.mjs and all Hub mini-aquarium fixtures

The owner wants an autonomous, life-like ASCII Ocean, ultimately multi-species. Current HTML labs are experimental references, not a scientific or engine implementation. Preserve them, do not silently rewrite them.

## Goal for FIRST PR ONLY

Build one reusable, testable, physically consistent **movement vertical slice** that the Ocean and Mechanics Lab both call. Do NOT implement all biology, learning or a fluid solver.

1. **World & time**
   - Stable ID/slot SoA TypedArrays, reproducible seed, spawn/delete, bounded XYZ, clock independent of RAF and FPS.
   - X right, Y vertical up, Z into camera. Depth = surfaceY - fishY; Z is not pressure depth.
   - Physics equation interface in SI, unit conversions from cm/s/g explicitly documented.
   - Versioned snapshot/replay tests; don’t use Math.random directly in systems.
2. **Water field**
   - Implement interface sample(x,y,z,t) -> { currentWorldMps, densityKgM3, pressurePa, temperatureC? }.
   - Start with uniform water density and uniform current; pressure from vertical depth and g. No invented chemistry.
   - Leave space for future pH, salinity, light, TAN, oxygen without pretending to calculate them.
3. **Physical motion with replaceable strategy**
   - Separate thrust command/heading from world velocity.
   - Starter net force = thrust + gravity + buoyancy + quadratic water-relative drag + contact.
   - Use displaced physical volume and body mass to compute buoyancy; **not** an ellipsoid volume estimated from raw length and height and presented as biological truth.
   - Clearly label input C_D, A, body mass, displaced volume and propulsion as **illustrative parameters** until calibrated.
   - Clamp dt/forces safely; guard zero speed, zero radius, NaN, range and 3D bounds.
4. **Orientation & renderer**
   - Fish faces its actual body heading, NOT sign(vx) or direction of current drift.
   - Positive throttle generates forward thrust according to heading; backward propulsion is a separate allowed species capability, not a default animation glitch.
   - Continuous yaw/pitch turn rate and bounded acceleration; no instantaneous 180° flip.
   - ASCII fish assembled from **tail, body, head, fins/eyes** using reusable glyph strings and anchor points. Use a Canvas glyph atlas/offscreen sprite only if it improves consistency; keep parts separable for anatomy/growth/damage.
   - Renderer only reads current/interpolated world pose; it cannot mutate simulation.
5. **Prototype capabilities (not calibrated species)**
   - Define LocomotionCapability, BuoyancyCapability, VentilationCapability, SensingCapability and BehaviorPolicy contracts.
   - Instantiate two **anonymous educational morphotypes**, one neutral hovering and one slightly negative-buoyant. Do not label them real zebrafish or sharks without data.
   - UI clearly separates motor on/off, water current and buoyancy.
6. **Mini aquarium physics fixtures**
   - A: no motor + still water + neutral buoyancy → approx hover.
   - B: no motor + uniform current → drift with water.
   - C: negative buoyancy + no motor/lift → descend; floor support handles resting.
   - D: positive buoyancy + no motor → ascend.
   - E: motor ON against current → world velocity depends on thrust vs flow.
   - F: fish heading right, current left strong enough to move it left; glyph **still faces right**.
   - G: near-zero relative speed → finite drag and no Strouhal singularity.
   - H: Z-only motion changes XYZ and top-view but not Y-based pressure.
   - I: two bodies approaching same XYZ → no stable overlap, staged detection/avoid/resolution; if full solver too large, create separate subsequent PR rather than fake completion.
   - Mating, feeding/poop, predator aggression and social learning remain *scripted* mini labs until a later dedicated engine PR.

## Testing & diagnostics
- Core deterministic replay across 30/60/165 synthetic display refresh schedules.
- Typed arrays state and stable identity under swap/remove and re-add.
- All-pairs vs spatial-grid parity in seeded worlds.
- SI unit dimension tests for force and acceleration; pressure only changes with Y; buoyancy sign and rest/drift cases.
- Heading, velocity, motor effort and fin animation never conflated.
- No NaN, unbounded angular flip, tunneling (swept-test plan), or perpetual energy gain.
- Desktop 1440x900 and mobile 390x844 Playwright checks with screenshots; no horizontal scrolling/control overflow.
- Record actual FPS/TPS and numeric allocations versus total memory; no made-up million-fish claim.
- Run CI; attach actual logs, screenshots, device/browser, seed, source SHA, test case list and known limitations.

## Phased implementation / PR slicing

M1-A: generic World + clock + water-field mock + independent Canvas renderer + test harness.
M1-B: mass, current, drag, buoyancy & heading (minimal SI strategy) + deterministic physics mini aquarium, plus tests.
M1-C: optional glyph-assembled ASCII fish renderer and rendering parity tests.
M1-D (separate after approval): contact detection/steering/resolution. No fake 3D avoidance.
M2: sensory models, behaviors (REST, EXPLORE, FLEE, FORAGE) and food events.
M3: gut material ledgers, feces, oxygen and excretion → environment.
M4+: calibrated species, physiology, body growth, real reproduction/inheritance, learning and population ecology.

**Stop after each small PR and ask owner to accept before expanding scope.** In particular, "Implement 60 capabilities" is NOT M1.

## Research/comparative sources
- https://doi.org/10.1109/48.757275 — locomotion strategies.
- https://doi.org/10.1103/PhysRevFluids.2.083102 — swimming scale parameters, not universal constants.
- https://doi.org/10.1002/jez.2460 — swim bladder depth/buoyancy.
- https://ocean.si.edu/ocean-life/sharks-rays/sharks — ventilation differences.
- https://doi.org/10.1371/journal.pcbi.1013610 — 2026 open ecosystem ABM architecture (Julia superindividuals, different scale).
- https://doi.org/10.1111/j.1365-2656.2000.00448.x — Dynamic Energy Budget.
- https://pmc.ncbi.nlm.nih.gov/articles/PMC3219116/ — experimentally measured schooling response.
- https://www.ncei.noaa.gov/access/ocean-exploration/video/index.html — footage for research, verify reuse rights.

## Reviewer output contract
- list source branches + starting and ending SHA
- changed modules/files, unit/type contracts, assumptions and explicit TODOs
- tests passed/failed with command output
- screenshots and measured timing, at least desktop/mobile browser
- clear distinction implemented physics vs illustrative controls vs species calibration
- upgrade plan & safe rollback
- PR to development, no self merge
- PCM checkpoint delta in private PR, no secrets/public PCM data
