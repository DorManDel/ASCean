# Anatomy Preservation Contract — canonical baseline

**Status:** binding project process after owner correction (2026-11-20).  
**Source of truth:** user's `index (17).html`, **Unified Anatomy Workspace v0.3**, restored without modifying the supplied text into [`site/anatomy/index.html`](../site/anatomy/index.html). The stored source text was directly compared against the original supplied Library file and found identical.  
**Review:** [PR #10](https://github.com/DorManDel/ASCean/pull/10). The low-fidelity replacement [PR #9](https://github.com/DorManDel/ASCean/pull/9) was closed **without merge** and must never be treated as the new baseline.

## Why

The user already has a sophisticated, functioning Anatomy Workspace. Replacing it with a much simpler schematic destroyed value (anatomic controls, design fidelity and rich overlays) even when the new model passed unit tests. From now on, improve **the actual existing editor** with small, testable changes.

## Original feature inventory — preserve unless owner explicitly approves a change

| Area | Existing in user source | Regression expectations |
| --- | --- | --- |
| Layout | Three-pane desktop, mobile canvas-first/editor controls, dark glass design | No horizontal overflow; content readable and tappable on phone |
| Fish media | Embedded transparent fish illustration and original ASCII overlay | Do not replace with simplified ellipse/polygon or discard glyph characters |
| Layers | Fish illustration, ASCII, body contour, optional legacy overlay, skull/jaw, vertebrae, tail bones, heart, intestine | Visibility/opacity/lock/selection stay independent |
| Shape | Balanced, slender, deep, elongated fish presets; fish width/height; auto-align illustration | Moving fish frame must preserve normalized anatomy |
| Rig | Editable named landmarks; relative X/Y part position, X/Y sizing, uniform scale, rotation | Per-part transforms stay local; no loss on serialization |
| Interaction | Select/drag, pan, wheel/touch zoom, zoom fit, optional anchors/grid, swim preview | Phone and desktop workflows retained |
| History | Undo/Redo and reset per part/workspace | Full state restored across edits, imported geometry included |
| Serialization | Full-precision JSON, lossy Q16 landmarks, anatomy-only SVG; v0.2 SVG import as legacy comparison | Explicit version migration, roundtrip and error labels |
| Biology | Skeleton and organ overlays remain *illustrative*, not authoritative physiological state | No invented organ coordinates, BPM, calibrated dimensions or second World |

## Where new ideas go

1. **Source references:** `index (17).html` as canonical functional UI; `standalone(1).html` as independent glyph/warp reference; `standalone (1).html` as demo biology/events reference; original `WORKSPACE_IMPLEMENTATION_PLAN.md` as future unification checklist.
2. **First:** capture working baseline screenshots (phone + desktop), controls list and regression tests **before** a refactor.
3. **Next:** improve the existing editor's actual anatomy with ZFIN/ZFA or atlas-supported names and landmark registration, *without* downgrading artwork or controls.
4. **Then:** connect shared `FieldID` registry through an optional overlay/inspector with Human/Schema/Memory views, bidirectional anatomy links. No fake numeric FieldIDs or addresses.
5. **Later:** isolate reusable rig/schema/renderer modules with golden-snapshot/JSON fixtures and migration tests; keep original behavior and versioned file formats.
6. **Eventually:** attach visual anatomy to the authoritative World read-only; compute organ mechanics in species-specific systems, not animation-only UI. 3D Z/occlusion must have separately reviewed data and scientific evidence.

## Non-negotiable change gate

**Read original → inventory and screenshot → identify a single defect/goal → specify expected before/after → minimal patch → unit + Playwright + phone tests → compare → owner approval.**

- No independent new Anatomy UI parallel to the existing editor.
- No merge or production Pages deployment merely for preview.
- No claim of scientific accuracy from illustrative drawings.
- No loss of original controls just to introduce a cleaner ECS model.
- PCM's existing `projects/ascean` stores the compact checkpoint and points to this file.

## Validation evidence

- Locally rendered original user HTML at 390px and 1280px; 9 original layers, visible heart/spine, zero JS errors/viewport overflow; presets, Undo/Redo and visibility toggles behaved as designed. This is browser simulation, not actual phone QA.
- GitHub PR's automated CI must pass for the preserved baseline and public preview before it is called verified externally.
