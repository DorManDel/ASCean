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

The new [`foundations/`](foundations/) page presents owner-accepted E-001/E-002/E-003/E-004 design decisions (implementation pending) in a separate responsive explorer. It includes an educational dense SoA/Free List/Swap-and-Pop interaction, Blueprint flatten and diagnostics, three-view Field Dictionary linked to an illustrative fish diagram, and the six-stage mechanics workflow. The page is *not* a runtime implementation of the proposed generational storage or scientific anatomy. It does not change existing `lab/` or `ocean/` engine behavior.

## Anatomy editor restoration — canonical baseline

The route [`anatomy/`](anatomy/) is the **original user-supplied `index (17).html`**, Unified Anatomy Workspace v0.3, committed **verbatim** to `feature/anatomy-editor-restoration`. It is *not* the inferior schematic M0 rewrite, which was stopped and PR #9 closed without merging.

Preserve every original capability: layers/visibility/locks, illustrated fish and ASCII overlays, normalized editable landmarks, independent part/layer transforms, morph presets, pan/zoom/touch, swim rig preview, Undo/Redo, v0.2 migration, JSON/Q16/SVG export and import. Follow a **baseline → regression test → targeted refinement → compare → owner review** workflow, not reimplementation.

The v0.3 editor is a UI/geometry proof, **not** a scientifically calibrated anatomical or physiological solver. All new research, Field Dictionary and engineering additions must be layered on top of the existing editor, backed by evidence and non-destructive migration.
