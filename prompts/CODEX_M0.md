# Codex handoff — M0 Foundation (proposal, not authorization to merge)

You are implementing the **foundation only** for [ASCean](https://github.com/DorManDel/ASCean), an independent TypeScript-first ocean simulation.

## Before coding
Read \`AGENTS.md\`, \`docs/DECISIONS.md\`, \`docs/ARCHITECTURE.md\`, \`docs/LAB_SPEC.md\`, \`docs/ROADMAP.md\`, \`docs/SCIENCE.md\`. Audit existing repo and cite the exact current base SHA. Explain ambiguities briefly. Do not edit ASCuarium, MobiLab or PCM repositories in this task.

## M0 deliverables
- Set up a small TypeScript workspace with \`apps/ocean\`, \`apps/mechanics-lab\`, \`packages/core\` and tests; other packages may be documented boundary stubs.
- Build a minimal runnable side-view canvas with a real \`World\` data owner and a reproducible seed; do not claim biological realism.
- Include a single reusable mechanics demonstration that imports from the same core package as Ocean (not duplicated calculation code).
- Add a test harness for fish ID vs dense slot, swap-and-remove, seed determinism, fixed-step timing and basic XYZ→XY projection.
- Add CI for typecheck, tests and build; introduce performance logging without fabricated FPS or heap numbers.
- Provide a README with dev/test/deploy commands and a roadmap/backlog tied to decision IDs.
- Provide GitHub Pages plan/workflow in the PR, **do not publish or merge until owner approval**.

## Keep these constraints
- World dimensions: X=10,000cm, Y=5,000cm, Z=3,000cm.
- Time and units: cm/s/g; Y is vertical, Z is viewing depth. Pressure is based on Y water-column depth.
- Identity is stable, index is movable; independent ID lookup and spatial proximity index.
- SoA/typed arrays are a candidate implementation for hot fields, not an excuse to pack every field.
- Human-readable ASCII/Glyph presentation; no WebGL/WASM optimization until measured.
- No fabricated genetics, feeding, injury, learning, calibrated fluid mechanics or species parameters.
- Mobile and desktop constraints must be documented and smoke-tested before release.

## Required final response to owner
List files changed, commit SHA, what works, commands and actual test results, known limitations, follow-up questions, and link to the **draft PR**. Do not say a simulator is scientifically verified.
