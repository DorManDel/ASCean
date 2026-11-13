# ASCean road map — approved workflow, not preapproved implementations

## M0 — Foundation (current draft PR #1)
- Shared TypeScript World and 2D side-view of 3D positions.
- Stable IDs, SoA, swap-and-remove, deterministic fixed-time movement.
- Mechanics Lab showing source-driven experiments; CI tests; architectural docs.
- Acceptance: tests/build, desktop/mobile review, owner approval.

## M1 — Perception and interaction
- 3D spatial search as modular service; comparison benchmark.
- Sensor modes (sight, lateral line, chemical cues) first as explicitly illustrative.
- 3D avoidance vs contact intentions; no overlapping fish after actual collision resolution.
- Separate prediction/avoidance from narrow-phase collision and from predator damage.

## M2 — Physics and environment baseline
- Force, mass/inertia, acceleration, drag and buoyancy with interchangeable strategies.
- Habitat zones: marine, freshwater, brackish; temperature, pH, salinity, oxygen and ammonia.
- Depth/pressure/light/clearance, current fields and reef shelter.
- Scientific parameter lookup and provenance for each species.

## M3 — Organism biology
- Derived bodyMassG from structural tissues, energy reserve mass, gut contents and reproductive mass (no double count).
- Structural growth vs body condition, SL/TL and anatomy dimensions.
- Food materials, diet profiles, ingestion, digestion, absorption, fecal waste and nitrogen excretion.
- Configurable biological clock separate from physics.

## M4 — Species/FishDex and genetics
- Versioned species model and source-backed FishDex, zebrafish freshwater first, clownfish marine later.
- Genome representation, alleles, inheritance and phenotype calibration from literature.
- Reproductive mode differences (egg laying, livebearing etc.), lifespan and developmental phases.

## M5 — Adaptive behavior and optimization
- Per-species and inherited trait-driven state/needs/strategies, explicit memory and inference.
- Controlled learning experiments and behavior evidence criteria, not one heavy model per fish.
- Real desktop/tablet/mobile profiling, frame time, memory, neighbor queries and renderer GPU path as needed.

Every milestone: experiment → evidence → explicit owner decision → small PR → tests → merge → verified release → PCM checkpoint. All exact scientific formulas remain open pending sources.
