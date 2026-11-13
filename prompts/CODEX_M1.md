# ASCean — Codex follow-up after M0 approval

Inspect AGENTS.md, docs/DECISIONS.md, docs/ARCHITECTURE.md and exact source SHA. Keep both applications and core decoupled.
One mechanic per PR. Proposed M1 candidate: 3D avoidance system based on simple steerable vectors, with clear 3D XYZ positions and deterministic collision-broadphase tests. This is engineering illustration, not calibrated fish ethology.

Acceptance:
- System operates on core data and has no DOM or rendering dependency.
- Lab visualization clearly contrasts detection, decision and resulting movement, including Z escape.
- No fish swims backwards due to glyph direction mismatch.
- Fixed-step, stable IDs, and grid-to-all-pairs equivalence remain tested.
- Run actual benchmarks and record platform, seed, count and runtime; do not invent values.
- No unapproved changes to MobiLab or original ASCuarium, no direct merge to main.
- Add source links, scientific uncertainty, test results and PCM checkpoint proposal in PR body.
Out of scope: simulated DNA, learning model, reproduction, metabolism, physical collision anatomy.
