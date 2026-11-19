# ASCean — long-lived engine contracts (architecture proposal)

## One engine, many applications
Ocean Simulator and Mechanics Lab must import **the same approved packages**, not duplicate logic. Old standalone prototypes in `site/shared` are deliberately tagged *reference only*. Codex M0 will migrate approved algorithms to shared TypeScript packages.

## Bootstrap and dependencies
`EngineBootstrap` resolves `EngineModule` dependency IDs via an acyclic graph, sets up modules in topological order and disposes them in reverse order. Reject duplicate IDs, missing dependencies and circular dependencies. Inject explicit services (World, Clock, SeededRng, DomainEventHub, Diagnostics), not unrestricted global singletons.

Proposed module lifecycle: `id`, `requires`, `setup(ctx)`, optional `fixedUpdate(ctx,dt)`, `dispose()`, `snapshot()`, `restore(state)`. Module initialization and memory ownership must be testable independently.

## Two kinds of events
- **DomainEventHub:** typed, ordered significant events (`FishSpawned`, `FoodConsumed`, `ContactResolved`, `InjuryRecorded`), with scoped subscriptions and explicit disposal.
- **UIListenerScope:** own DOM/UI subscriptions and abort/remove them on teardown.

Do **not** dispatch `FishMoved` thousands of times every simulation tick. Hot paths operate directly on numeric World state. Event subscribers must not leak across scene reloads.

## Organisms and modules
Everything can have an Entity ID: fish, plankton, algae, reefs, rocks, detritus. Optional abilities are composition: locomotion, sensing, body, digestion, metabolism, reproduction, anatomy, memory, behavior policies. Do not give all entities unnecessary fields. Share immutable species defaults. Model genetic potential separately from observed phenotype and environmental influence.

## Physics, space and time
World X right, Y up and Z into the screen; cm/s/g. **Hydrostatic pressure uses depth below water surface = surfaceY - Y, not viewing Z.** Separately control render time, fixed simulation time and configurable biological time. Any accelerated biology must account for environment, food and waste, not only aging.

Physics, collision and water-field modules are replaceable solvers. Keep broadphase proximity distinct from exact 3D contact and meaningful behavior, including avoidance/attack/care. A fish may dodge in X/Y/Z. Never treat demo values as scientific constants.

## Snapshots and replay
A World Snapshot is versioned **simulation state**, not an image. Include entities/IDs, component registries, world extents, simulator/bio tick, RNG state, module state and model versions. Capture experiment inputs/events and deterministic comparisons. Quantization and compression require explicit error/time/memory benchmarks.

## Testing and integration
Every accepted module needs typed contract tests, lifecycle/restart, output parity against an oracle where possible, reproducible snapshot roundtrip, lab visualization and mobile/performance measurements. Only after owner approval does the Lab import production packages and the module integrate with the Ocean. PCM checkpoint records only changes and evidence; no private PCM material in public Pages.

## Entity and Blueprint foundation refinement (2026-11-20)

The design conversation accepted E-001/E-002/E-003. The proposed E-004 Blueprint contract is in [FOUNDATIONS_REFINEMENT.md](FOUNDATIONS_REFINEMENT.md) and is **pending final owner approval**.

`EngineBootstrap` (engine module lifecycle already defined above) and a future `BlueprintResolver` (species definitions) are distinct, even if the latter is invoked during the former's setup.

Candidate BlueprintResolver pipeline: `load -> resolve parent links -> validate schema / component contracts / cycle checks -> flatten deterministic configuration -> publish immutable, versioned resolved blueprint -> instantiate entities`. No parent traversal on every fish Tick. Detect cycles and missing parents as errors; configurable long-chain warning without an arbitrary hard depth=2 rule. Structured, deduplicated diagnostics flow into logs and the Lab, not only a transient UI popup.

The hot SoA should not receive raw pointers from optional component code: stable IDs/validated generational handles route through a slot table. Optional biology systems may be updated at their own schedule. Interfaces express contracts for differing physiology but do not mandate per-entity virtual dispatch in every hot loop.

The future Field Dictionary holds stable FieldIDs; synchronized Human / Schema / Memory views link fish anatomy landmarks to real fields and their logical storage layouts. Numeric demo values are not calibrated biological constants.

No implementation claim is made by this contract addition.
