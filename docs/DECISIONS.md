# Decision register — 2026-11-13

State: **ACCEPTED** = user-approved direction; **PROVISIONAL** = first candidate requiring experiments; **OPEN** = not decided/calibrated; **DEFERRED** = after first implementation. Approval does not mean implemented or runtime-tested.

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

**Change policy:** convert a provisional/open item to accepted via dated decision record with rationale, alternatives, owner approval, supporting evidence and impact. Do not silently replace earlier decisions. Add ADR files under `docs/decisions/` when meaningful.

## 2026-11-13 — Development Hub extension (owner direction)

| ID | State | Decision | Rationale |
|---|---|---|---|
| A-018 | ACCEPTED | Dedicated `development` integration branch, feature PRs target development first | Keep published `main` stable while mechanics evolve |
| A-019 | ACCEPTED | Mechanics catalog with search, restored reference archive and Developer & AI workspace | Keep decisions, evidence, mechanics and implementation explanation discoverable in the site |
| A-020 | ACCEPTED | Independent mini-aquarium fixtures for mating, feeding/waste, predation, social behavior and future mechanisms | Validate behavior/UX and inspect events before engine integration |
| P-007 | PROVISIONAL | Seeded toy diploid trait inheritance shown in Hub as experimental model | Needs species-specific scientific evidence before it can be called DNA simulation |

The `site/shared/dev-register.mjs` mirrors key entries. Changes to an accepted decision require owner review and updates to both places. A successful demo is not a biological calibration.

| P-008 | PROVISIONAL | Food & Gut Anatomy X-ray, ingestion timeline and dry-mass ledger in a restored standalone reference | The provided 55% assimilation and duration are teaching inputs, not validated biological rates |

## 2026-11-13 — Research-data and MVP foundation decision

| ID | State | Decision | Reason |
|---|---|---|---|
| A-021 | ACCEPTED | Maintain central reference and data registry at docs/REFERENCE_AND_DATA.md, linked from the Hub | Keep scientific research, datasets, original code and usage rights discoverable |
| A-022 | ACCEPTED | No third-party dataset, source code, images or footage enters runtime/public assets without source-specific license, provenance and owner review | Public availability is not automatic reuse permission |
| A-023 | ACCEPTED | Codex MVP starts with ONE source-driven, deterministic World/WaterField/movement vertical slice shared by Ocean and Lab | Test foundations before implementing every proposed biological feature |
| P-009 | PROVISIONAL | Study SwimmingIndividuals, then FiMoS + OpenDrift, OceanBioME and OSMOSE in that order | Priorities can change after field, model and dataset audits |
| P-010 | PROVISIONAL | Split data into per-species shared profiles, per-entity hot state, derived values, transient computation and persisted snapshots | Compare field cost and evidence before adopting a large all-fish schema |

SwimmingIndividuals source audit: upstream src/create.jl declares 39 per-agent numeric columns; ASCean site/shared/world-prototype.mjs currently declares 8 numeric arrays. The two serve different purposes; field count is not a quality metric. See docs/REFERENCE_AND_DATA.md.
