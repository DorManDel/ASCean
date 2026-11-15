# Living Ocean V1: reviewable experiment and integration record

Status: **runtime-tested illustrative vertical slice; owner review pending**. ASCean's permanent mission is a persistent ecosystem with autonomous organisms and matter/energy flows. This milestone implements one causal Living Fish + Food experiment, not the full biological roadmap. Ocean, Lab, Inspector and Sandbox controls call the same `@ascean/core/living` runtime.

## Reconcile and preserve (A)

Integration base `development`: `6691e4b87f42129e68d83aa73000923d78eb9c74`. M0 draft source: `e41f2dbac94d794e1bdd9a52b599ed9ca67fe637` (implementation `aff203dcfb8fd2c4c37f33cd4267225f567523a6`). Hub PR #4 source: `79318a320a7f54223481451f4adcbe8c10e7e1af`. Both remained unmerged at reconciliation. The feature worktree starts at M0 and carries the exact Hub changed-file set forward before the focused V1 changes. No branch was merged, rebased or reset. The original dirty worktree's eight modified files and architecture/research/HANDOFF proposals remain untouched; they are context, not silently committed in this PR.

| Experience / mechanism | Location | Truthful status |
|---|---|---|
| Living food, sensors, steering, recorder | `/ocean/living/`, `/lab/living/`; `packages/core/src/living/` | shared engine, runtime-tested, illustrative |
| M0 World, fixed clock, reflection | `/ocean/foundation/`, `/lab/foundation/` | preserved shared TypeScript baseline; glyph direction corrected |
| Existing Ocean / core Lab | `/ocean/`, `/lab/` | preserved educational JS reference; links to V1 |
| Search, toy genetics, mini-aquaria, physics | `/hub/` and `site/shared/*prototype.mjs` | restored from PR #4; scripted vignettes are explicitly separate from causal V1 |
| Genome / recovery, historical mechanics, food/gut anatomy | `site/references/{species-genome-lab,aquarium-mechanics-archive,food-gut-anatomy}.html` | archived interactive references, not integrated biology |
| Real genetics, growth, detailed injury, reproduction, bacteria, learning | design registries | missing from engine, not fake placeholders |

Archive code is carried from the existing owner-supplied Hub draft. Only the old remote ASCuarium favicon is replaced with an empty icon to keep the archived page self-contained; no other repository or externally sourced asset was modified/copied. No new datasets or images enter runtime. Hub research docs and on-site decision statuses A-018–023 are preserved. The search catalog now includes V1.

## Run and reproduce

From this isolated worktree, use Node 24:

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/ASCean/ocean/living/` or `/ASCean/lab/living/`. Choose 1/2/10 fish, habitat and synthetic species, then Run Trial. Add food at (340,250,150) cm. Select a fish and inspect its limited observations; pause-on-ingestion stops on an actual transfer. Coordinates also place/move food, organisms and spherical obstacles. A current is an explicit recorded action. The fixture has no automatic food choreography.

`tests/fixtures/living-seed42.json` and `.csv` are actual saved 600-tick trials: seed 42, one fish, 0.3 g food introduced at tick 0, all food transferred to gut. Reopen via file/text to deterministically replay and display the paused result. `npm run benchmark:living` regenerates fixtures and writes measured baseline/candidate results to ignored `test-results/living-meter.json`. The committed fixture is also a regression test.

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run smoke
npm run smoke:dev
npm run smoke:living
node tests/living-browser.mjs --dev
npm run benchmark:living
```

The build retains home, Ocean/Lab, M0, Hub, all three archive pages and the new evidence page. `npm run preview` serves compiled `/ASCean/` routes on port 4173. Smoke scripts own ports 4173 and 4183. Screenshots and downloaded trial artifacts are under ignored `test-results/`. Only UI overlay preference and the last valid legacy Lab topic persist after refresh; no World is silently restored. Reopening saved state is always explicit and paused.

## Shared system owners and mechanism specification (B)

- `contracts.ts`: versioned ExperimentDefinition, UserCommand, SimulationEvent, Observation, Snapshot and ExperimentResult. Fixed model `living-1`, schema 1. Other sensory capabilities explicitly unavailable.
- `world.ts`: authoritative IDs, fish/resources/obstacles, field configuration, PRNG, fixed tick, material ledger and bounded event/observation state. Stable monotonic safe-integer IDs span all entity kinds; no per-slot references escape. Inspection and snapshots are detached copies.
- `models.ts`: pure replaceable water sampling, candidate/vision filter, needs policy and vector/turn helpers. The scheduler samples all sensors from start-of-tick state, then integrates fish in stable array/ID order, resolves conservative swept contacts, transfers eligible food and samples observations.
- `trial.ts`: command recorder, wall-time runner, replay validation, CSV/JSON envelopes and meter comparison. `research.ts`: read-only Research Factory metadata boundary; no crawler, scheduler, database or automatic coefficient updates.
- `apps/shared/living-view.ts`: rendering and controls only. Ocean and Lab adapters share this exact instrument. Camera/selection never alter sensing or policy.

The experimental tank is 1,000 × 500 × 300 cm, a bounded lab fixture rather than a replacement of A-006's initial 100 × 50 × 30 m ocean target. X right, Y up, Z into screen. Fixed dt=1/30 s, no biological acceleration. Marine is default. Shallow/deep marine, brackish, freshwater and custom are separate field configurations; no mixing solver. Pressure is absolute `101325 + densityKgM3 * 9.80665 * ((surfaceY-y)/100)` Pa; Z is never hydrostatic depth. Deep marine uses a surface 300 m above the tank. Uniform temperature/salinity/O₂/current, normalized light attenuation and turbidity are illustrative and replaceable. No physiological habitat-tolerance response is asserted.

Two **synthetic**, habitat-compatible species profiles (forager/cruiser) differ only in illustrative speed scaling. They are not empirical named species. All organisms have separate structure (2 g), reserve (0.2 g) and gut (0–1 g) stores; values are fixtures. Structural dimensions, measured SL/TL, inheritance/lineage, organs, reserves expenditure, lifecycle and reproduction remain explicit future model capabilities. No reserve/energy consumption or growth is fabricated. Hunger is defined narrowly as `1-gut/capacity`; when full the fish stops seeking food. It does not digest or become hungry again in this slice.

Agent loop: World/Water → Vision → detected stimuli + own capacity deficit → visible-neighbor avoidance / approach food / search / satiation → desired steering → bounded swim velocity → world displacement + contacts → eligible ingestion/event. Vision samples full XYZ range, heading/FOV, light, turbidity and sphere occlusion. Candidate/rejection information is diagnostic ground truth only, never policy input. No remembered hidden target is chased. Hearing, chemical sensing, lateral-line disturbance, touch and physiological sensors have capability interfaces but no numeric fake readings. A future lateral-line model must sample near-field flow disturbance/gradients with source-supported receptor response; candidate radius alone is not that model.

Swim velocity is relative to water; heading follows the forward swim axis. Desired steering is separate. Candidate direction turns at most `turnRate*dt`; vector velocity change is clamped to `acceleration*dt`, preserving the heading bound. Current is added afterward. Actual displacement-derived world velocity can oppose heading during drift without drawing the body backward. Selected heading is projected onto the glyph; M0/legacy head-tail text was corrected too. Wall avoidance is anticipatory, with hard bounds as a final guard. Obstacles/peers use conservative swept-sphere stops; this avoids penetration but can jam and is not a hydrodynamic or social-force solver. Contact does not imply injury. Reflection is retained as a labeled baseline that ignores desired steering; ingestion still uses the same vision/eligibility rules.

Ingestion requires a currently detected pellet, positive quantity, gut capacity, ≤10 cm XYZ distance after integration and a clear obstacle segment. Transfer is capped at an illustrative 0.6 g/s. This is a software experiment coefficient, not a species feeding constant. Stable iteration resolves competition; no double consumption. Invariant: introduced food = remaining resources + gut contents + explicit removals (including gut exported when a fish is removed). Floating residue is accounted as removed. Structural/reserve mass lies outside this **food-material-only** ledger; no complete ecosystem mass/energy claim.

## Recorder, limitations and acceptance (C)

Commands carry schema, run ID, committed tick, monotonic sequence and typed action. UI resets allocate a fresh run ID outside the simulation; saved trials preserve their run ID. Validation occurs on a temporary World and rejects atomically. Snapshot/restore includes all current solver state, seed/RNG, allocator, policies, fields, logs and observations. Replay applies the same ordered tick-stamped commands, compares complete final state and modeled metrics, then opens paused. Supported guarantee: same model/schema and JS arithmetic; Linux CI and Windows local checks exercise the committed fixture, not every possible cross-platform trajectory.

Events and observations each retain 512 entries with explicit discard counts. Observations sample every 10 ticks, not every render frame. Commands are retained up to 4,096; further recording rejects rather than losing replay inputs. Import is limited to 10 MB and replay to 100,000 ticks. The general runner stops at 10 million ticks; exporting/replaying very long trials needs segmented checkpoint support in a later milestone. These are documented instrument limits, not life-history parameters. Fixture construction accepts 1–100 fish; commands allow up to 500 total entities. No large-population performance promise.

Meter: same three seeds and 600 ticks, reflection versus steering, offset food at (340,300,150). Food reached, first ingestion latency, path and contact count are **modeled**. CPU elapsed time and UTF-8 serialized snapshot size are **measured**. Browser FPS/TPS, update/draw durations are measured over a displayed interval. Heap sample is whole-process only; precise retained heap, GPU, energy and physical-phone metrics are unavailable. Timings are excluded from deterministic state. One short batch has JIT/order/noise bias and is not a rigorous performance ranking. Results currently count surviving fish; removal intentionally exports their gut but historical per-fish outcome aggregation is future work.

Acceptance tests cover reproducible seeds and render schedules; limited FOV/occlusion/darkness/XYZ senses; hidden food policy independence; changed food/visible neighbor response; turn/acceleration bounds; drift; stable identity; atomic command/snapshot rejection; no penetration; food conservation; snapshots and JSON/CSV replay; log bounds; read-only review gate. Browser tests exercise causal eating, pause event, explicit restore, 1/2/10 counts and habitats, desktop/390 px, Hub search/breeding, archive routes, persisted Lab topic and fresh World after reload. Physical phones and accessibility assistive technology have not been tested.

## Future contracts (design only) and owner gate (D)

Organism ownership will extend World via optional composition: species/life stage and inherited potential/lineage; measured SL/TL and disjoint mass stores; organs/functions; physiology/needs; sensory observations; bounded memory; policy; locomotion/contacts; injury; lifecycle and species-specific reproduction/care. Environment owns habitat fields and ecosystem matter reservoirs; fields/aggregates can later represent microbes/plankton/reef without per-molecule simulation. Missing capabilities are unavailable, never zero-valued fake measurements.

Adaptive updates are **design only**: focused/near/distant/aggregate tiers may change numerical resolution and sampling cadence, with explicit conservation, migration/snapshot and convergence tests. Separate render/physics/sense/biology rates must remain deterministic. Camera distance alone must not change ecological rules or remove organisms. Importance promotes ecological interactions, not merely rendered objects. No LOD, workers, heavy learning or full EngineBootstrap DAG is implemented here.

Next: owner reviews V1 and source/evidence labels; validate real species/life-stage locomotion/sensing against reviewed data; then design digestion/waste/reserve conservation and richer contact/obstacle behavior. Preserve future research direction without enabling speculative physiology now. No Research Factory or PCM write occurred. No merge or deployment; PR targets `development` under A-018. CI uploads compiled review artifacts only. The existing `main` Pages workflow still uploads raw `site/`; a separate reviewed release change is required before publishing the compiled applications.

Complexity baseline: candidate scanning is brute-force O(F × (F + resources) × obstacles), contact checks are O(F × (F + obstacles)), and snapshots/inspection allocate detached copies. Only the small fixture batch was measured; no spatial-index or large-population performance assertion follows. Decorative glyph size is enlarged on narrow screens and is not anatomical/collision geometry.
