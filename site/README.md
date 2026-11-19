# ASCean static site — M0 reference

Routes: `/` main hub; `/lab/` interactive experiments; `/ocean/` ASCII sandbox. Both pages import `shared/world-prototype.mjs`, a **temporary educational implementation**. No independently verified species physics or biology.

## Run locally
```bash
cd site
python -m http.server 8000
# http://localhost:8000
node --test shared/world-prototype.test.mjs
```
Browser ES modules require HTTP(S), so don't open index.html directly with `file://`.

## Publish
Owner selects Repository Settings → Pages → Build and deployment → Source = GitHub Actions. Then `.github/workflows/pages.yml` deploys `site/` on main. Live URL is expected to be `https://dormandel.github.io/ASCean/`, but **verify the Actions run and URL before claiming publication**.

## Next
Codex M0 will introduce TypeScript workspace, shared packages, DI/bootstrap, typed events and snapshots after architectural review. Do not silently treat a toy algorithm here as approved scientific engine code.

## Foundations decision explorer (design review)

The new [`foundations/`](foundations/) page presents accepted E-001/E-002/E-003 design decisions and proposed E-004 in a separate responsive explorer. It includes an educational dense SoA/Free List/Swap-and-Pop interaction, Blueprint flatten and diagnostics, three-view Field Dictionary linked to an illustrative fish diagram, and the six-stage mechanics workflow. The page is *not* a runtime implementation of the proposed generational storage or scientific anatomy. It does not change existing `lab/` or `ocean/` engine behavior.
