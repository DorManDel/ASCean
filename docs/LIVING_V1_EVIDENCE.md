# Living V1 verification and review evidence

2026-11-15 (Asia/Jerusalem). Implementation source: `b24f62b1af0f2f3d393256ea242f4a4e1bd8b775`; integration base `6691e4b87f42129e68d83aa73000923d78eb9c74`; prior M0 source `e41f2dbac94d794e1bdd9a52b599ed9ca67fe637`; Hub source `79318a320a7f54223481451f4adcbe8c10e7e1af`. The following evidence/checkpoint commit also removes three inherited trailing-whitespace lines, with no model changes. Final PR head is reported in the handoff.

## Changed source groups

New runtime: `packages/core/src/living/{contracts,models,world,trial,research,index}.ts`. Shared UI: `apps/shared/living-view.ts`, `living.css`; app adapters `apps/{ocean,mechanics-lab}/living.ts`; routes `site/{ocean,lab}/living/index.html`; evidence page `site/science/living-v1.html`. Workspace export/build/scripts and PR-only verification/artifact workflows updated.

Proof: `tests/living.test.ts`, `tests/living-browser.mjs`, `tests/fixtures/living-seed42.{json,csv}`, `benchmarks/living.ts`. Source/contract records: `docs/LIVING_V1.md`, `docs/RESEARCH_FACTORY_IMPORT.md`, architecture/decisions/roadmap/mechanics registers and README. M0 and reference glyphs corrected; old Lab page selection safely persisted. Hub/archive/research files carried from the exact PR #4 source are inventoried in [Living V1](LIVING_V1.md). New entry links/catalog/status text preserve discoverability. The archived remote favicon was removed; no legacy simulation was replaced.

## Actual local checks

Environment: Windows 11 build 10.0.26200, Intel Core i7-14700F, Node 24.18.0, npm 11.16.0, Chromium 159.0.8154.6.

- `npm ci --offline --cache ../../.npm-cache`: passed in the isolated worktree. Pinned dependencies; no new package added. npm's esbuild postinstall warning remains; tsx works using the installed platform package without enabling scripts.
- `npm run typecheck`: passed.
- `npm test`: **34 passed**, zero failed (21 TypeScript tests including the saved-trial fixture; 13 preserved JS reference/Hub tests).
- `npm run build`: passed; 12 HTML entrypoints including all historical experiences and evidence page.
- `npm run smoke`, `npm run smoke:dev`: passed at 1280×820 and 390×820; all original/M0 routes and controls retained.
- `npm run smoke:living`, `node tests/living-browser.mjs --dev`: passed at 1440×900 and 390×900; causal ingestion/pause, JSON/CSV export/reopen, deterministic replay, counts/habitats, synthetic species, add/move/remove resources/organisms/obstacles, current/parameters/custom freshwater, Hub breeding/search/mini-tank step, archive routes and preference persistence. The final build also passed production Living smoke after adding meter export. The last policy change narrows its input type to a detached own-state projection; typecheck and all tests passed afterward; CI checks the final compiled revision.
- Desktop and 390 px screenshots visually inspected. Local proof: `test-results/living-{ocean,lab}-{1440,390}.png`. These are emulated viewports, not physical phones; no screen-reader/device certification.
- `git diff --check`: passed for local edits. Staging exposed three inherited Hub whitespace lines; corrected in the evidence commit. No modifications to `.github/workflows/pages.yml`.

Failures found and fixed: added navigation initially overflowed the old 390 px header, so links moved into page content; archived favicon attempted a blocked external request, removed without changing its mechanics; narrow glyphs enlarged without altering collision geometry. No unresolved browser error is suppressed by the test.

## Reproducible causal trial

`tests/fixtures/living-seed42.json`: seed 42, one fish, food action at tick 0 at (340,250,150) cm, quantity 0.3 g. At tick 600 (20 modeled seconds), gut=0.3 g, resource exhausted, material balance error=0, first ingestion latency=4.633333333333333 s, path=419.4256949470124 cm, contacts=0. Recorder contains 18 events and 60 observations. JSON: 30,111 bytes; CSV working-file size: 36,715 bytes before Git newline normalization. Both reopen/replay exactly. Browser-downloaded JSON/CSV are also retained locally in ignored `test-results/`.

The multi-seed meter uses a different offset-food fixture, (340,300,150) cm, 600 ticks per row. One measured Node run:

| Seed | Reflection reached / latency | Steering reached / latency | Reflection CPU ms | Steering CPU ms |
|---:|---|---|---:|---:|
| 1 | 0 / none | 1 / 4.8 s | 2.3615 | 1.6217 |
| 7 | 0 / none | 1 / 4.8 s | 1.6045 | 0.8733 |
| 42 | 0 / none | 1 / 4.8 s | 0.9293 | 0.8689 |

All six rows had zero contacts and zero modeled food-balance error. Serialized snapshots were 14,193–16,072 UTF-8 bytes. Whole-process heap sample: 9,842,720 bytes (not retained per-fish memory). No warm-up/order correction or statistical confidence interval; this is a small functional comparison, not a performance ranking. Browser telemetry during automation includes pause/scroll/background scheduling and is not a steady-state throughput benchmark. GPU, energy, allocation profiling and physical-phone performance remain unmeasured. Source output is `test-results/living-meter.json`; UI can export its own measured meter JSON.

## Review limits and next steps

Movement, senses, habitat values, synthetic species, hunger and ingestion require species/life-stage empirical calibration. Conservative sphere stops can jam; they are not CFD, anatomical contacts or injuries. No digestion/waste/energy solver or full organism lifecycle. Candidate scans/copies are not optimized for large populations. Replay limits, bounded history, surviving-fish outcome semantics and future design-only adaptive tiers are documented in [Living V1](LIVING_V1.md).

Next: owner review of the draft and assumptions; reviewed species-specific locomotion/perception calibration; then digestion/waste and contact-model specifications/tests. No private Research Factory/PCM access, no merge, no public deployment. CI produces compiled review artifacts only. Actual CI status and PR URL are reported in the final handoff; pending jobs are never inferred to have passed.
