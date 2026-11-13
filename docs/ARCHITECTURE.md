# ASCean — M0 architecture

## Source of truth
TypeScript under packages/core/src is runtime source; docs and prototype screenshots are explanatory, not execution evidence.

## Data flow
requestAnimationFrame → FixedStepClock → World.step(dt) → World.rebuildGrid() → Canvas renderer.
UI and renderer have no authority over fish biological state; the core is runnable without the browser.

## Concrete implemented modules
- packages/core/src/world.ts: stable Fish ID, dense numeric TypedArrays, O(1) expected Map lookup, O(1) slot update swap-and-remove, seeded RNG, 3D sparse grid, exact sphere distance checks.
- packages/core/src/clock.ts: capped accumulator 30 TPS by default; pause and single-step.
- packages/rendering/src/canvas.ts: 2D Canvas side camera with Z-dependent color and alpha.
- apps/ocean: live simple swimming/boundary reflection for testing engine performance and interface.
- apps/mechanics-lab: selection, inspector, spawn/remove, 3D neighbors, compare grid vs all-pairs, observed FPS/TPS.
- tests/world.test.mjs: invariant tests for stable IDs, spatial agreement, deterministic initialization and fixed step.

## Current limits
The engine does not simulate biological metabolism, mass-dependent acceleration, marine chemistry, real collision response, schooling AI, learning, genetic inheritance, organ injuries, reproductions or physical swimming models. These remain development plans.

## Planned module boundaries (not yet created)
- physics: forces, inertia, buoyancy, water drag, collision detection/avoidance/resolution.
- environment: salinity, temperature, pH, dissolved oxygen, TAN / NH3, pressure, depth light and currents.
- biology: mass ledger, nutrition, digestion, waste, growth, developmental stages, reproduction.
- behavior: species-specific drives and states; later memory and evidence-based adaptive learning.
- species: sourced FishDex with biological metadata, anatomy, tolerance profiles, genome provenance.
- rendering: character glyphs, anatomical part masks, Z layering and optional GPU rendering.

## Memory
M0 has eight 4-byte typed numeric arrays, so 32 bytes per allocated capacity slot, excluding JS Map, spatial cell arrays, DOM, renderer and allocator overhead. Count is not equal to allocated capacity. Never call this figure total app RAM.

## Design gates
An approved interactive demo is NOT proof of scientific calibration. Require code tests and separately calibrated species evidence for biological claims.
