# Run and review M0 Foundation

The foundation implements one illustrative ASCII entity in two views using the same TypeScript World. It is additive; existing static reference routes remain intact. See [scope and provisional choices](decisions/M0-IMPLEMENTATION.md). The wider architecture documentation in the working tree remains separate pre-existing work.

Use Node 24 (tested locally with 24.18.0):

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/ASCean/ocean/foundation/` or `http://127.0.0.1:5173/ASCean/lab/foundation/`. The runtime starts paused. Select the entity, single-step or resume; save/restore JSON from the text area. Reset restarts the saved seed. Snapshot restoration always pauses. The replay comparison leaves the displayed World unchanged.

```sh
npm run typecheck
npm test
npm run build
npx playwright install chromium
npm run smoke
npm run benchmark
npm run preview
```

Preview uses port 4173 and the same `/ASCean/` paths. Browser smoke starts/stops its own preview server on port 4173; leave that port free. Screenshots go to ignored `test-results/`. CI runs on PRs/manual dispatch only. The existing deployment workflow is unchanged: it still uploads `site/`, not the new compiled `dist/`. **Do not publish these TypeScript entrypoints using that old workflow.** A reviewed release change must build and upload `dist/` before this foundation can be deployed.

No external images, assets, datasets or private registry contents were imported. Dependencies are pinned in the lockfile. Core unit tests, existing prototype regressions and browser smoke are distinct from biological validation. No physical phone or GPU/energy profiling was performed.

Next bounded proposal: review these implementation choices, then add EngineBootstrap lifecycle and typed run-qualified commands with focused acceptance tests. No biological mechanism is authorized by this milestone.
