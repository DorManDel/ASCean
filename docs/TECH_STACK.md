# ASCean stack — selected starting point

| Layer | Choose now | Future comparison |
|---|---|---|
| Core/domain | TypeScript (browser-compatible, strict contracts) | C++/WASM only if real benchmarks justify |
| Apps | One repo: \`apps/ocean\` + \`apps/mechanics-lab\` | Native desktop/mobile adapters |
| Workspace | npm workspaces + Vite after Codex M0 | Alternate bundlers only if needed |
| Visual | Canvas 2D ASCII/glyphs, independent of XYZ model | WebGL2 / WebGPU after profiling |
| Simulation | Fixed step, seeded RNG, modular systems | Workers / scaling strategies |
| Tests | Node unit tests, CI; Playwright smoke after workspace setup | Real-device perf |
| Release | GitHub Pages public site, GitHub Actions workflow | Dedicated host only if functionality requires |
| Persistence | Local JSON snapshot/export first | Remote sync and databases later |

## Why
TypeScript suits an accessible browser-first lab, GitHub Pages and composable runtime modules. It is not a guarantee of a million concurrent active organisms. We will benchmark numeric fields, spatial index, render cost and bio updates before optimizing.

## Stage zero: publish a static reference lab
\`site/\` contains a no-build prototype; \`site/shared/world-prototype.mjs\` is imported by both the Lab and Ocean Sandbox. It is intentionally *not yet* \`packages/core\`. This makes the design testable immediately without locking scientific or architecture decisions.

## GitHub Pages
GitHub workflow: \`.github/workflows/pages.yml\`, uploads the \`site/\` folder on merges to main. GitHub Pages administrative Source setting cannot be changed through the currently available connector. **Owner action:** Repository → Settings → Pages → Build and deployment → Source: GitHub Actions. Confirm actual successful deployment before sharing the public site as live.

Once the Vite workspace exists, change workflow to run \`npm ci && npm run build\` and upload the built \`dist/\` directory; ensure the asset base path is \`/ASCean/\`.

Original ASCuarium and MobiLab repositories stay separate; PCM is private.
