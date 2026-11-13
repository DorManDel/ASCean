# Architecture proposal — one repository, two applications

\`\`\`text
                    docs / mechanisms / decisions / evidence
                                 |
    +----------------------------+-----------------------------+
    |                                                          |
 apps/ocean                                            apps/mechanics-lab
  - ecosystem UI                                        - isolated demos
  - scene & controls                                    - controls & explainer
  - visualization                                       - test visualizations
    |                                                          |
    +------------------- shared packages ----------------------+
                      core World + Scheduler
                  /          |            \
             physics      environment     biology
                  \          |            /
                  behavior + species definitions
                           |
                       rendering
\`\`\`

## World and identity
- \`World\` owns active entity counts, dense numeric columns, capacity, creation/removal and identity resolution.
- Initial storage candidate: Structure of Arrays via TypedArrays. \`fishId\` is stable; \`slot\` is movable. Spawn/delete uses dense indexing and swap-and-remove, updating \`id→slot\`.
- \`Map<FishId,Slot>\` is *identity lookup*; a separate **3D spatial index** answers who is nearby. These solve different problems.
- Shared species reference data is stored once. Optional genome, anatomy, injury, lineage and gut state use separate registries or handles. A field's hot/warm/cold class is about access patterns, not disk storage.
- Example logical groups: Identity, Motion, Biology, Behavior, Extended Data. These are semantic groups, **not** a requirement to allocate one object per fish.

## Coordinate, unit and time contracts
- Internal distance cm, time s, mass g. Display converts to mm/cm/m and mg/g/kg/tonne.
- X horizontal; Y vertical; Z physical depth into screen. The XY side camera projects these into the viewport. Water-column depth/pressure uses **surfaceY - currentY**, never Z merely because the viewer calls Z "depth".
- Separate wall clock, deterministic fixed simulation ticks, render requestAnimationFrame, and **configurable biological time**. A time multiplier must preserve or explicitly approximate metabolic/environmental processes, not simply increment age without costs.
- Seeded PRNG and stable update order for replay. Capture snapshots plus input/event logs and schema versions.

## System boundaries (replaceable)
\`\`\`text
Commands / inputs
    ↓
Scheduler: environment → sensing → behavior → movement/physics
        → contacts/events → metabolism/life → structural changes
    ↓
World / resource registries ←→ SpatialIndex
    ↓                         ↓
Renderer                 Metrics / Benchmarks
    ↓
Ocean UI & Lab UI
\`\`\`

System order and frequencies are initial **proposals**; correctness tests can change them. Separate broad-phase spatial search from exact XYZ distance and physical contact resolution. Intended predation/social contact does not permit permanent body penetration.

## Phase-specific fidelity
- M0: boundaries, TypeScript workspace, tests, mock display with no invented science.
- M1: deterministic World, stable IDs, minimal motion in full XYZ, fixed timestep.
- M2: index, query parity, steering, collision pipeline, real performance telemetry.
- M3+: nutrition/mass ledgers, growth, environment, species traits and more advanced mechanics after review.

## Rendering, memory and acceleration
Start Canvas 2D / glyph rendering with cached assets; compare real update/render/DOM cost. Preserve source/solver independence so WebGL, Worker or later C++/WASM is optional, not assumed. Avoid premature bit packing and quantization; test positional accuracy, speed, total heap impact and snapshot round-trips first. A million fish at 72 raw numeric bytes/fish costs ~68.7MiB **before** index maps, registries, physics, graphics and JS overhead.

## Repository shape (target, not completed)
\`\`\`text
ASCean/
  apps/ocean/
  apps/mechanics-lab/
  packages/core/
  packages/physics/
  packages/environment/
  packages/biology/
  packages/behavior/
  packages/species/
  packages/rendering/
  docs/ decisions/ research/ mechanics/
  tests/ benchmarks/ prompts/
\`\`\`
