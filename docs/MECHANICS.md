# Mechanism register — planned scope and dependencies

**This is a design inventory, not an implementation status list.** Mechanisms may be illustrated in old HTML prototypes but are not thereby integrated.

| Domain | Mechanism | Inputs/outputs | First implementation gate |
|---|---|---|---|
| Core | World/ID/SoA | entity data → safe spawn/delete/lookups | M1 + tests |
| Core | Fixed time & replay | events/seed/ticks → deterministic state | M1 + replay comparison |
| Memory | Float32/packing/quantization | field bounds → error/bytes/time comparison | M1/Lab |
| Physics | XYZ motion, mass, drag, buoyancy | forces/environment → velocity/position | M2, model labeled |
| Space | Sparse 3D index, sensory radius | positions + senses → exact neighbors | M2, brute-force parity |
| Interaction | Avoidance, social curiosity, territorial aggression, predation | sensor + drives → intent + contact | M2/M3 |
| Collisions | Broadphase → contact → nonpenetration → event | body proxies + trajectories → resolved state | M2 |
| Environment | Salinity, temperature, pH, DO, TAN/NH3, nutrients | location/time → water sample | M3 |
| Environment | Depth/pressure/light/current/turbidity | vertical water depth, optical properties → exposures | M3 |
| Habitat | Reefs, rocks, plants, shelter | obstacle geometry + species needs → navigation/cover | M3 |
| Biology | Body dimensions, SL/TL, composition | age, tissues, nutrition → shape/mass | M4 |
| Biology | Food resources → ingest/digest/absorb/waste | mass/energy/nutrients → reserves, matter flux | M4 |
| Biology | Hybrid growth, development, aging | species/genetics + environment → biological state | M4 |
| Biology | Species reproduction + lineage | strategy, life stage, mate context → offspring | M4/M5 |
| Biology | Genome/traits/phenotype | inherited model + context → potential traits | M5, evidence-gated |
| Biology | Anatomy, injury, repair/regeneration | anatomy/contact → damage/function/healing | M5 |
| Intelligence | Perception, drives, state machines, memory, adaptive policies | sensed world + memory → actions | M3 then M6 |
| Presentation | FishDex & ASCII body glyphs | species/anatomy → readable image and provenance | M3+ |
| Research | Performance telemetry and calibration | real runs + datasets → tests, uncertainty, reports | every milestone |

## Design details to preserve
- **Body:** lengthCm, bodyHeightCm, bodyWidthCm, bodyMassG; both SL and TL; organ/fin geometry may differ. Structural tissues vs energy reserves vs digestive and reproductive contents without double-counting. Fecal waste may be processed by appropriate detritivores; not automatically edible to all fish.
- **Behavior:** genetics sets potentials or dispositions, but decisions also depend on energy, hunger, social setting, learning, prey/predator proximity, sensed cues and habitat.
- **Senses:** sight, lateral line, chemical detection differ in range and direction; range may vary by state. Spatial grids are candidate finders, not consciousness or vision.
- **Collisions:** a fish can evade via X/Y/Z. Intentional bite contact specifies body region and produces events; no long-term penetration.
- **Pressure:** vertical depth below water surface drives hydrostatic pressure; physical Z is *distance into the screen*.
- **Science:** avoid guessed organ, genome, lifespan or toxin thresholds. Link each measured parameter to source/experiment and expose uncertainty.

## Mechanism template
Each mechanism in `docs/mechanics/<slug>.md` should include:
```text
ID / status / owner / revision
Problem · expected behavior · alternative approaches
Data contract (inputs, units, outputs, storage)
Interactive experiment & expected observations
Scientific basis vs illustrative assumptions
Correctness tests · performance budget · mobile tests
Decision links · changed source paths · rollback plan
```

## 2026-11-13 — Recovered prototypes / status

The Hub restores prior experimental body mass/thrust/drag, geometry, 3D collision stages, water chemistry/pressure, diet/digestion, growth, injury and FishDex as interactive *reference archives*. These are not production engine systems.

New scenario fixtures: spawning, feeding → waste, predator attack/3D escape and social investigation. Their movement/events are deterministic scripted illustrations and are unit-tested as such; the next engine milestone will implement reusable systems and test conservation/physics claims independently.

See `docs/MECHANICS_INTEGRATION_QUEUE.md` for priority, inputs/outputs and acceptance gates.
