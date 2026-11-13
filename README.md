# ASCean — ASCII Ocean

**A research-oriented living ocean simulator, rendered with the character of ASCII art.**

ASCean is a new, independent project. Its long-term goal is a modular, testable 3D ecological and biological simulation with a 2D side-view ocean, diverse fish species, habitats, physics, genetics, development, feeding, reproduction, behavior and, eventually, experimentation with learning. **Scientific fidelity is an ambition, not a current validation claim.**

## Two applications, one engine

- **Ocean Simulator** — the actual evolving ecosystem.
- **Mechanics Lab** — compact, interactive experiments explaining, comparing and testing each mechanism. The Lab and Simulator import the same production packages when a mechanism is approved.
- **FishDex** — sourced species encyclopedia, biological profiles and an ASCII mini-aquarium, part of the planned experience.
- **PCM** — private evidence/decision/checkpoint registry; GitHub code remains the implementation source of truth.

The original [ASCuarium](https://github.com/DorManDel/ASCuarium) and [MobiLab](https://github.com/DorManDel/MobiLab) are independent references. **Do not copy or modify their code without explicit review.**

## Start here

| Document | Purpose |
|---|---|
| [Vision & boundaries](docs/VISION.md) | The end goal and non-goals |
| [Architecture](docs/ARCHITECTURE.md) | Monorepo, World, Systems, rendering, data flow |
| [Decision register](docs/DECISIONS.md) | Approved, provisional, open and deferred |
| [Mechanics inventory](docs/MECHANICS.md) | Biological, physical and AI mechanisms |
| [Mechanics Lab design](docs/LAB_SPEC.md) | Interactive explanations, responsive UX and acceptance |
| [Roadmap](docs/ROADMAP.md) | M0–M6 with testable gates |
| [Scientific evidence policy](docs/SCIENCE.md) | Source quality, calibration, conservation and uncertainty |
| [Workflow and PCM](docs/WORKFLOW.md) | Prototype → review → Codex → verify → checkpoint |
| [Codex M0 brief](prompts/CODEX_M0.md) | First implementation handoff |
| [AGENTS.md](AGENTS.md) | Instructions for coding assistants |

## Initial architectural target (not yet implemented)

```text
apps/ocean             apps/mechanics-lab
           \           /
             packages/*
core · physics · environment · biology · behavior · species · rendering
                 |
               tests / benchmarks / evidence
```

**Language:** TypeScript first. **Simulation:** world coordinates in cm, seconds, grams; world X=100m, Y=50m, Z=30m. **View:** XY side projection with true Z depth. **Data:** typed-array SoA and stable entity IDs as a starting design. **Rendering:** ASCII/Canvas first; WebGL/WASM only with profiling evidence.

## Status

**2026-11-13:** ASCean main contains a source-tested, educational reference Ocean Sandbox + Core Mechanics Lab. The reusable scientific engine is still pending. The expanded Development Hub, historical experiments and breeding prototypes are in a feature PR to `development` and are not yet a production Pages release. Do not claim prototype animations are scientifically calibrated.

**Privacy:** this is a public repository. Never add PCM private registry contents, credentials, unpublished data, or personal information.

## First experimental website (under review)

The [Ocean Sandbox](site/ocean/) and [Core Mechanics Lab](site/lab/) are static reference experiences merged through [PR #3](https://github.com/DorManDel/ASCean/pull/3). They share a single educational World module. **No calibrated scientific engine is claimed yet.**

Website after GitHub Pages is enabled and deployed: https://dormandel.github.io/ASCean/ . Owner must select **Settings → Pages → Source → GitHub Actions**, then verify the deployment. Until verified, this is the expected URL, not a live-site claim.

[Component and bootstrap contracts](docs/ENGINE_COMPONENT_CONTRACTS.md) · [Technology choices](docs/TECH_STACK.md) · [Experiment approval process](docs/EXPERIMENT_PROTOCOL.md) · [Codex M0 foundation prompt](prompts/CODEX_ENGINE_FOUNDATION_M0.md)

## Development Hub — feature review

[ASCean Development Hub](site/hub/) combines the two owner-supplied interactive HTML references, seeded two-fish breeding, four mini aquarium event traces, searchable mechanics and an on-site Developer & AI/decisions reference.

- [Review PR #4](https://github.com/DorManDel/ASCean/pull/4) — feature branch targets `development`, not `main`.
- [Mechanics audit and integration queue](docs/MECHANICS_INTEGRATION_QUEUE.md)
- [Branch / safe preview plan](docs/DEV_BRANCH_PREVIEW.md)
- [Codex Initial Ocean M1 brief](prompts/CODEX_INIT_OCEAN_M1.md)

Production GitHub Pages is separate from the development preview artifact. Do not enable a development Pages deployment that replaces the live main site. Owners approve merges and releases explicitly.
