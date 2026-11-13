# Codex handoff — ASCean M0, do not execute until owner says go

Read \`AGENTS.md\`, \`docs/ARCHITECTURE.md\`, \`docs/DECISIONS.md\`, \`docs/ENGINE_COMPONENT_CONTRACTS.md\`, \`docs/TECH_STACK.md\`, \`docs/EXPERIMENT_PROTOCOL.md\`, \`docs/ROADMAP.md\` first. Pin exact main/source SHA and report unknowns.

Build a **generic, testable simulation engine shell**, not a giant Fish class. Target TypeScript strict + npm workspaces + Vite. Two apps Ocean Simulator and Mechanics Lab import identical production packages. Preserve the route paths currently under \`site/\`, and remove duplicate prototype code only when migrated and tested.

Implement bounded M0:
- World + stable EntityId and dense storage interfaces; no fish-only core.
- EngineBootstrap dependency DAG, ordered initialization/disposal, per-module lifecycle and error tests.
- Typed DomainEventHub for significant events plus disposable UI Listener Scope; no per-entity per-tick events.
- Fixed SimulationClock, configurable bio-clock interface, seeded PRNG and deterministic step.
- WorldSnapshot schema and versioned save/restore including entities, registries, clocks, random state and module state.
- Renderer adapter for ASCII Canvas; 3D XYZ world with XY side projection. Water depth is Y, not Z.
- Experiment runner interface, real measured telemetry, reference algorithm tests and CI.
- Two responsive app shells that share working \`packages/core\` source.

Explicitly **do not** implement fabricated genetics, full hydrodynamics, calibrated species metabolism, neural networks or complete AI ecology in M0. Leave modular interfaces and documented science questions. Do not touch legacy repositories or PCM private data. Work on a branch → tests/CI → draft PR; never merge or publish without owner approval.

Acceptance: deterministic seeded tests; ID continuity after swap/remove; startup/teardown tests; clean listeners; snapshot roundtrip; mobile/desktop screenshots; fixed speed vs high refresh; exact changed files, benchmark results and commit SHA. Document what is not validated.
