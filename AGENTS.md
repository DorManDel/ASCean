# ASCean — agent instructions (Codex / Claude / human contributors)

## Project intent
Build a biologically credible, modular ocean ecosystem simulation with an ASCII aesthetic. Treat the Mechanics Lab as the explainer and validation workbench, NOT as a second source of simulation logic.

## Mandatory working agreement
1. Read `README.md`, `docs/DECISIONS.md`, `docs/ARCHITECTURE.md`, `docs/ROADMAP.md`, and this file before implementing.
2. Work on a feature branch and a small PR. **Never push directly to main, merge, deploy or alter other repositories without owner approval.**
3. Check repo status and pin base commit SHA; do not silently overwrite user work. Report files changed, tests run, measurements and limitations.
4. Do not convert a demo curve, reference article or intuition into a species-level biological constant. Mark **source_verified / calibrated / illustrative / proposed / unknown** as applicable.
5. Runtime logic must live in reusable packages; both applications import it. Prototypes may be isolated until approved. Prefer simple TypeScript and deterministic pure-function tests.
6. Keep `World` as the data owner. Stable fish/entity IDs differ from array slots. Keep 3D world space distinct from the XY rendered side view; pressure depth follows vertical position (Y), not Z camera depth.
7. Every new mechanism needs a short specification, interactive Lab demonstration, acceptance criteria, regression tests, performance considerations, and an architecture/decision update.
8. No per-fish LLM or unexplained training loop. Begin with deterministic drives, state, memory and policies; benchmark learning methods if proposed.
9. Measure performance before optimizing, quantizing or rewriting in WebGL/WASM/C++. Never claim one-million-fish real-time support from memory arithmetic alone.
10. PCM is a **private** project registry. Create proposed, compact, evidence-backed checkpoint records via an authorized reviewable PR. No automatic transcript dumps, guessed token counts, or inferred work time.

## Minimum PR checklist
- [ ] Scope and decision IDs cited; any open assumptions remain explicitly open.
- [ ] Core tests pass; precise commands/results included.
- [ ] Visual changes checked on desktop and narrow mobile, with actual devices identified when tested.
- [ ] Profile CPU/GPU/memory where relevant; note missing measurements.
- [ ] Docs and Mechanics Lab agree with source code and scientific evidence.
- [ ] Safety/privacy review for any externally sourced assets, datasets or public Pages content.
- [ ] Owner approval requested; no premature publication.

## Proposed project structure
```
apps/ocean/           # real ecosystem UI
apps/mechanics-lab/   # interactive teaching/measurement workbench
packages/core/ packages/physics/ packages/environment/
packages/biology/ packages/behavior/ packages/species/
packages/rendering/
docs/ tests/ benchmarks/ prompts/
```

**Do not implement all packages in M0.** Establish build/test boundaries and a minimal vertical slice first.
