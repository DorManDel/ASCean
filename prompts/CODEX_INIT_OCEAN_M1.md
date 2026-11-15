# CODEX TASK: ASCean — Initial Ocean Foundation (M1)

**Status:** Ready for **human review**, not authorization to modify `main` or create a production release.

## Context and source of truth
Repository: https://github.com/DorManDel/ASCean
Working target: `development` branch; create a small `feature/m1-*` branch and open a PR to `development`.
Before editing: inspect current base SHA and read `AGENTS.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/MECHANICS.md`, `docs/DEVELOPMENT_HUB.md`, `docs/MECHANICS_INTEGRATION_QUEUE.md`, `docs/DEV_BRANCH_PREVIEW.md`.
The user's attached experiments are archived in `site/references`. The visual genes/biology and mass comparison are synthetic. Do not assume their code is production-ready or biologically validated.

## Objective
Implement the first *actual reusable* TypeScript ocean engine vertical slice, preserving the existing Hub, archived references and mini-aquarium test cells.

## Work stages / small PR commits
1. **Engine contracts:** `World`, `FishId`, `FishState`, `FixedStepClock`, `SpawnEvent`, `RemovedEvent`, `Snapshot`, `SpatialQuery`. Position XYZ in centimeters; X 10000, Y 5000, Z 3000. `World` owns numeric SoA TypedArrays, stable ID→slot lookup and swap/remove invariants.
2. **Core movement:** deterministic seeded fish, bounded XYZ swimming, pause/single step/replay and a separable physics strategy. Start with a labelled uncalibrated baseline; no species hydrodynamic coefficients.
3. **Rendering contracts:** Canvas/ASCII camera consumes World snapshots. Side XY camera must represent true Z (color/alpha, separate top view if needed); pressure uses Y, *not Z*.
4. **Reference adapter:** make `site/ocean` and `site/lab` consume this exact engine module, rather than maintaining duplicate world implementations. Preserve existing routes and Hub.
5. **Mini-aquarium integration contract:** define how a `ScenarioFixture` injects a seed, initial entities, events and constraints into the engine. **Do not copy scripted mini-tank animations as real biology**. Prepare a single fixture (e.g. two-fish separation) for integration with tests; leave the other mini-cells as clearly marked prototypes.
6. **Telemetry:** observed FPS/TPS; allocated numeric bytes versus full memory caveat; benchmark all-pairs neighbor checks against 3D grid with specified seed and population. Maintain mobile readability.

## Mandatory invariants and acceptance
- `node --test`: determinism, spawn/delete ID mapping, 3D neighbor parity, fixed tick independence from render Hz, pause, boundaries and contact candidates.
- `World` logic has no DOM, Canvas, network, global Math.random or UI state.
- Real code and diagrams expose status labels and scientific evidence clearly. Do not invent reproduction, diet, aggression, learning or injury math.
- API uses units cm/s/g, and numerical parameters record bounds/units.
- Reference files and prior working demos remain untouched except deliberate, reviewed changes.
- No modifications to MobiLab or original ASCuarium; PCM edits only through a private review PR.
- Provide test logs, output artifact, expected screenshots at 390px and 1440px, source commit SHA, observations, limitations, migration notes, rollback steps.
- Do not enable Pages or merge `development` into `main`.

## Output
A reviewable M1 PR with code, tests, links to live/preview evidence, updated `docs/DECISIONS.md` or ADR only when decisions change, `docs/MECHANICS_INTEGRATION_QUEUE.md` state updates, and a proposed compact PCM checkpoint. Ask for owner approval before merge.
