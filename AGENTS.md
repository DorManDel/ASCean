# ASCean — contract for Codex, Claude and human contributors

## Scope and protected repositories
ASCean is a new, independent repository. Do not modify DorManDel/MobiLab or DorManDel/ASCuarium.
All development follows feature branch → tests → evidence → reviewable PR → explicit owner approval → merge → verify deployment → PCM checkpoint.

## Before modifying code
1. Read this file, docs/DECISIONS.md, docs/ARCHITECTURE.md, and docs/MECHANICS_PROTOCOL.md.
2. Identify exact source branch and commit SHA; state what is implemented versus only proposed.
3. Make changes in small, testable increments; avoid giant speculative rewrites.
4. Update interactive Mechanics Lab for every new mechanic, using the exact shared core module wherever practical.
5. Run npm run check and npm run build. Supply evidence, platform, limitations and rollback steps.
6. Do not merge, enable Pages, release or claim mobile performance without explicit owner acceptance.

## Invariants
- Core must not depend on DOM, Canvas or browser globals.
- Units are centimeters, seconds, grams; World X=10000cm, Y=5000cm, Z=3000cm.
- World is actual 3D; screen is XY side projection. 3D sensing considers XYZ.
- Identity is stable and separate from dense slot index; swap-and-remove updates ID mapping.
- Hot numerical state uses SoA TypedArrays; never pack/quantize without measured accuracy and memory tradeoffs.
- Simulated time is independent of requestAnimationFrame and display Hz.
- Seeded deterministic test cases required for algorithmic changes.
- No invented biological parameters, "real DNA simulation", hydrodynamics, injury equations or benchmark measurements.
- Record unverified science as provisional; species records need sources and appropriate freshwater/marine habitat.
- Research scope includes bioenergetics, environmental chemistry, anatomy, organism growth, diet, excretion, reproduction and behavioral learning, but no M0 implementation claims.

## Definition of ready
Every approved mechanic includes: goal, data contract, interactive preview, algorithm, tests, benchmark conditions, scientific evidence if applicable, known unknowns, rollback plan and PCM checkpoint proposal.
