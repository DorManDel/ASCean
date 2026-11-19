# Decision register — 2026-11-13

State: **ACCEPTED** = user-approved design direction (not implemented); **REVIEW** = proposed, awaiting final approval; **PROVISIONAL** = first candidate requiring experiments; **OPEN** = not decided/calibrated; **DEFERRED** = after first implementation. Approval does not mean implemented or runtime-tested.

| ID | State | Decision / proposed alternative | Why |
|---|---|---|---|
| A-001 | ACCEPTED | New independent public repository **ASCean** | Separate from old ASCuarium and MobiLab |
| A-002 | ACCEPTED | Two apps in same repository: Ocean Simulator + Mechanics Lab | Single codebase for approved mechanisms |
| A-003 | ACCEPTED | TypeScript-first; C++/WASM may come later | Start simple, profile first |
| A-004 | ACCEPTED | `World` data owner, systems modular; renderer separate | Extensible simulation and testability |
| A-005 | ACCEPTED | cm, seconds, grams internally; adaptive UI units | Fish can span large size/mass ranges |
| A-006 | ACCEPTED | X 100m, Y 50m, Z 30m initial world | Side view XY, genuine XYZ space |
| A-007 | ACCEPTED | Marine scene default; freshwater/brackish allowed in dedicated habitats | Species-specific ecological suitability |
| A-008 | ACCEPTED | Zebrafish first scientific reference, many species planned | Research data availability; zebrafish freshwater |
| A-009 | ACCEPTED | Biological Hybrid Growth | Genetics/species + stage, nutrition and environment |
| A-010 | ACCEPTED | Track Standard Length (SL) and Total Length (TL), body height/width, mass | Distinguish body vs caudal fin morphology |
| A-011 | ACCEPTED | Total mass derived from nonoverlapping physical components | Organism consistency, not arbitrary HP-like weight changes |
| A-012 | ACCEPTED | Configurable biological clock, separate physical/render timing | Research acceleration and normal simulation |
| A-013 | ACCEPTED | Avoidance by default; intentional social, territorial or predatory contact possible | Behavioral diversity; nonpenetration physically |
| A-014 | ACCEPTED | Reproductive strategy depends on species; anatomical injury represented | Do not apply pregnancy/organ behaviors universally |
| A-015 | ACCEPTED | FishDex + sourced species profiles + mini ASCII habitat | Learning and research-oriented presentation |
| A-016 | ACCEPTED | Mechanism lifecycle: design → interactive prototype → review → implement → test → approve → integrate → PCM checkpoint | Prevent drifting specifications |
| A-017 | ACCEPTED | Existing repositories' main branches untouched; reviewable PRs before merge | Safe history and code governance |
| E-001 | ACCEPTED | Hybrid ECS + hot SoA, warm/cold/shared data grouped by access pattern | Dense update loops and modular storage; benchmark instead of guessing costs |
| E-002 | ACCEPTED | Species Blueprint + Component Registry for required/allowed systems and biology-specific validation | Generic core, different anatomies, shared definitions |
| E-003 | ACCEPTED | Stable uint64 EntityID; generational (uint32 slot, uint32 generation) handle; stable recycled slot table + Free List; dense hot SoA Swap-and-Pop; selective stable/sparse registries; ring buffers for event/sensor/motion/telemetry | Protect stale references and support efficient iteration without moving every entity |
| E-004 | ACCEPTED | Composition First; interfaces for species-specific mechanisms; max one parent Blueprint; no cycles; configurable depth warnings without an arbitrary hard cap; validate/flatten/cache on load; immutable versioned defaults; individual genotype/overrides/runtime state; structured diagnostics | Owner approved the design on 2026-11-20; implementation details remain open and no runtime validation is claimed |
| F-001 | ACCEPTED | Stable FieldID Registry and Human/Schema/Memory views with bidirectional anatomical links | Single explainable, typed source of field meaning and storage |
| W-001 | ACCEPTED | Six-stage mechanism contract: concept → UML → fields → memory/complexity → implementation/lab → validation/checkpoint | Scientific provenance, efficiency, regressions, and reproducibility |
| P-001 | PROVISIONAL | TypedArray SoA, ID→slot Map, swap-and-remove, 3D sparse grid | Benchmark against alternatives |
| P-002 | PROVISIONAL | Float32 motion and body metrics, per-field data tiers | Precision and memory must be measured |
| P-003 | PROVISIONAL | Canvas glyph/ASCII rendering, later optional WebGL | Rendering benchmark needed |
| P-004 | PROVISIONAL | Quantized 16-bit snapshot positions, bit-packed flags only if useful | Must validate round-trip and cost |
| P-005 | PROVISIONAL | Initially simplified replaceable force/drag/mass physics | Avoid presenting as calibrated swimming |
| P-006 | PROVISIONAL | Modular deterministic drive/state/policy model before learning algorithms | Observe believable behavior and cost |
| O-001 | OPEN | Body composition schema, tissue/reserves/digestion/reproductive mass | Need mass and energy conservation contracts |
| O-002 | OPEN | Food chemistry, diet, digestion and waste (including detritus reuse) | Biological evidence and balances |
| O-003 | OPEN | Individual genome representation and crossovers, genotype/phenotype mapping | No arbitrary claim that DNA predicts traits |
| O-004 | OPEN | Species calibration and actual quantitative growth curves | Need provenance and context |
| O-005 | OPEN | Habitat field representation, organism tolerances, current and lighting solver | Scientific and computational tradeoffs |
| O-006 | OPEN | Collisions, anatomy/function/damage/healing fidelity | Research, collision tests, visual design |
| O-007 | OPEN | AI memory/learning, ecological time scaling and tiered simulation | Must design benchmarks and ethical/scientific claims |
| O-008 | OPEN | Target devices, FPS/TPS/energy/ram budgets, rendering backend | No measured baselines yet |
| D-001 | DEFERRED | C++/WASM, per-fish heavy ML, advanced hydrodynamics | Only after profiling and model validation |

**Foundation refinement (2026-11-20):** See [FOUNDATIONS_REFINEMENT.md](FOUNDATIONS_REFINEMENT.md) for exact E-001–E-004 contracts, diagnostic codes, Field Dictionary and workflow. E-001/E-003 supersede the *storage and identity parts* of provisional P-001; its spatial-grid candidate remains provisional. Distinguish design approval from running implementation and verified benchmarks. E-004 is **ACCEPTED** as an architectural direction following explicit owner approval on 2026-11-20; outstanding implementation details live in [FOUNDATIONS_IMPLEMENTATION_BACKLOG.md](FOUNDATIONS_IMPLEMENTATION_BACKLOG.md).

**Change policy:** convert a provisional/open item to accepted via dated decision record with rationale, alternatives, owner approval, supporting evidence and impact. Do not silently replace earlier decisions. Add ADR files under `docs/decisions/` when meaningful.
