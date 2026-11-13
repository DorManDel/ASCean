# Roadmap — thin vertical slices, measurable acceptance gates

| Phase | Deliverable | Done only when… |
|---|---|---|
| **M0 Foundation** | TypeScript workspace, two app shells, modular boundaries, tests/CI, Mechanics Lab navigation, ADRs and measurement harness | CI and simple smoke pass; build/deploy instructions reviewed; owner approves PR |
| **M1 World Core** | Stable World/Fish IDs, SoA, spawn/remove, fixed deterministic ticks, XYZ motion, side-view ASCII | identity and swap tests pass, replay deterministic, desktop/mobile demo measured |
| **M2 Interaction & Space** | 3D candidate index, exact neighbor checks, motion/avoidance/contact pipeline | grid results match brute-force oracle; pause/Z/collision test cases; telemetry |
| **M3 Habitat & Behavior** | environment samples, simple food resources, drives/needs and modular policies | independent systems, reproducible scenarios, stated modeling assumptions |
| **M4 Body & Life** | mass ledger, SL/TL, staged growth, diet/digestion/waste, time-scale coupling | mass bookkeeping and biological assumptions documented/tested |
| **M5 Species/Genome/Anatomy** | sourced FishDex, species-specific reference parameters, optional genome/anatomy/injury/lineage | traceability to evidence, no invented genetic claims |
| **M6 Learning/Scaling** | memory/adaptation experiments, WebGL/workers/WASM evaluation | A/B evidence of benefit, correctness preserved, device benchmarks |

## M0 deliverables in detail
1. Create root workspace with `apps/ocean`, `apps/mechanics-lab`, `packages/core` and `tests`; stub other packages as boundaries, not fake implementations.
2. Keep both apps buildable, but ensure only one minimal test mechanism with truthful status.
3. Add CI for typecheck, lint, unit tests, build; smoke accessibility on narrow viewport as tooling permits.
4. Introduce `src` ownership contracts, seeded clock/RNG, logging adapter and minimal performance harness.
5. Publish a design/implementation status page in the Lab with links to tested source and decision IDs.
6. Prepare GitHub Pages workflow *as a PR* and release only after explicit owner review and verification.
7. Create a **private PCM checkpoint proposal**, linked to ASCean PR and exact source SHA.

## Milestone metrics (not promised targets)
Record device/browser, render FPS, simulation TPS, total JS heap (when available), typed-array bytes, spawn/delete throughput, neighbor query checks/cost, energy and battery if measurable. Run small → 100 → 1k → 10k, then higher only if justified. Performance goals are set after a real baseline.

## Explicit exclusions from M0
No fake autonomous learning, no invented biological equations, no WebGL/WASM rewrite, no merging of older ASCuarium or MobiLab projects, no unreviewed public scientific claims.
