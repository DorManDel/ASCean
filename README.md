# ASCean — ASCII Ocean

A TypeScript-first, research-oriented ocean simulation platform. M0 is an engineering foundation, **not yet a validated ecosystem**.

## Applications
- Ocean Simulator — live side-view Canvas rendering of moving ASCII-style fish.
- Mechanics Lab — inspect real XYZ fish data, stable IDs, spawn/remove, sparse 3D grid, fixed ticks and live FPS/TPS.
- Both applications run the same reusable World implementation in packages/core.

## Local start
Requires Node.js 22+.

    npm install
    npm run check
    npm run build
    python -m http.server 5500 -d dist

Open http://localhost:5500/ in a browser.

## Layout
- apps/ocean — ocean interface.
- apps/mechanics-lab — interactive experiments.
- packages/core — SoA World, IDs, movement and clock.
- packages/rendering — shared 2D projection of 3D fish positions.
- tests — deterministic core tests.
- docs — decisions, review gates, architecture.
- prompts — Codex work briefs.

## Boundaries
M0 includes no calibrated biology, species-accurate growth, hydrostatic response, meaningful AI learning or ecosystem food-cycle simulation. These are later milestones and research topics. See docs/DECISIONS.md.

Workflow: source → interactive demo → tests → PR review → owner approval → merge → deployment verification → private PCM checkpoint.

The original ASCuarium and MobiLab projects remain untouched.
