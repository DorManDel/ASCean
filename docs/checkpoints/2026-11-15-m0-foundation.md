# M0 Foundation checkpoint proposal

2026-11-15 (Asia/Jerusalem). **Sanitized public proposal; not transferred to PCM.** No private registry access, merge or deployment. This bounded implementation is ready for owner review, not approved production biology.

- Repository: `DorManDel/ASCean`; branch: `feat/m0-foundation`.
- Pinned starting SHA: `6691e4b87f42129e68d83aa73000923d78eb9c74`.
- Tested implementation SHA: `aff203dcfb8fd2c4c37f33cd4267225f567523a6`. This checkpoint is a subsequent documentation-only commit, not part of that SHA.
- Prior work preserved: eight modified tracked architecture/readme/prompt files, plus `HANDOFF.md` and existing architecture/research/decision/checkpoint proposals remain unstaged. They are not included in the implementation commit.
- Decisions: A-002–006, A-012, A-016–017 followed. P-001/002 and ADR-018–020 remain provisional/proposed. [Implementation contract reconciliation](../decisions/M0-IMPLEMENTATION.md) records narrower scope and deferred lifecycle/command machinery.

## Changed files in implementation SHA

`.gitignore`, `.github/workflows/foundation.yml`, `package.json`, `package-lock.json`, `tsconfig.json`, `vite.config.ts`; `packages/core/{package.json,src/index.ts}`; `apps/ocean/{package.json,main.ts}`; `apps/mechanics-lab/{package.json,main.ts}`; `apps/shared/{env.d.ts,view.ts,view.css}`; `site/ocean/foundation/index.html`, `site/lab/foundation/index.html`; `tests/{core.test.ts,browser-smoke.mjs}`; `benchmarks/core.ts`; `docs/M0_FOUNDATION.md`, `docs/decisions/M0-IMPLEMENTATION.md`. This checkpoint adds only its own path.

## Test evidence

Windows 11 / build 10.0.26200; Intel Core i7-14700F; Node 24.18.0, npm 11.16.0. Lockfile pins all dependencies. Actual commands and results:

- `npm ci --offline --cache .npm-cache`: passed, 27 packages installed; audit reported zero vulnerabilities. Initial sandbox network install failed; approved installation populated cache. First clean install attempt encountered a running Vite native-module file lock; stopped that task's dev server and retry passed. npm warns esbuild's install script is not approved; tested tsx works through the installed platform package without enabling scripts.
- `npm run typecheck`: passed. Initial missing CSS typing fixed with Vite client types.
- `npm test`: 6 new core tests + 6 preserved prototype tests passed, zero failures. Covers identity/removal, detached data, XYZ oracle/reflection, seed/schedules/pause/step/reset, snapshot continuation/RNG/allocator, malformed snapshot atomic rejection and allocator exhaustion.
- `npm run build`: passed; five HTML routes emitted under the `/ASCean/` base.
- `npm run smoke` and `npm run smoke:dev`: each passed all five routes at 1280×820 and 390×820. Chromium 159.0.8154.6, headless desktop/narrow emulation; no physical phone tested. No JS/console errors or horizontal overflow; controls, inspection, restore rejection and replay comparison checked. Desktop and narrow screenshots visually inspected. Screenshots are local ignored artifacts, not publication assets.
- Initial direct dev launch exposed relative entrypoint resolution failure; explicit Vite aliases fixed it. Both launch modes are now CI smoke gates.
- `git diff --check` and staged equivalent: passed. Existing prototype source and deployment workflows unchanged.
- `npm run benchmark`: passed; 100 warm-up ticks, 1,000 measured ticks per population. Results below are one run, not capacity guarantees.

| Entities | Median ms/tick | p95 ms/tick | Snapshot bytes | Process heap bytes |
|---:|---:|---:|---:|---:|
| 1 | 0.0006 | 0.0021 | 424 | 8,620,208 |
| 100 | 0.0146 | 0.0333 | 17,389 | 8,571,720 |
| 1,000 | 0.1312 | 0.2085 | 172,389 | 12,234,408 |

Heap is process-wide instantaneous usage, not attributable/retained entity memory. Production smoke's mixed pause/run sample reported 60.2–60.6 FPS, 0.005–0.010 ms update/frame, 0.067–0.077 ms draw+inspection/frame, zero dropped wall time. Its ~8 TPS reflects brief resumed intervals, not steady-state throughput. GPU, energy, allocation counts, physical-phone and cross-browser measurements remain missing.

## Limitations and next milestone

One illustrative entity, private dense JS-number storage, no SoA/capacity optimization, no biology/forces/environment/spatial index. Full EngineBootstrap DAG, external run-qualified commands/events and command-log replay are explicitly deferred, not represented as implemented. Snapshot replay is limited to matching versions/runtime. Existing Pages workflow uploads raw `site/`; a separate reviewed build/release change must upload `dist/` before foundation publication. No deployment was triggered by this work.

Owner review: accept/revise bounded numeric/boundary/timing choices, choose target devices and future route integration. Next proposed milestone is module lifecycle plus typed command boundaries and their tests, not advanced biology. PCM transfer requires separate authorization and inspection of its private schema; none occurred here. No guessed tokens, work-time estimates, transcript dumps, external assets or private data included.

Launch instructions: [M0 Foundation](../M0_FOUNDATION.md). Resolve the draft PR URL in the final handoff; the implementation SHA above remains the evidence anchor.
