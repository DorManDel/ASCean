# Anatomy Editor — Modular Architecture & Code Policy (PROPOSAL)

**Status:** REVIEW ONLY. **Date:** 2026-11-20. This document is a proposed engineering contract, **not** authorization to restructure the current editor or change its approved UI.  
**Baseline:** user's original `index (17).html` / Unified Anatomy Workspace v0.3, restored verbatim at `site/anatomy/index.html` on this branch. The user's phone walkthrough (2026-11-20) demonstrated live rig preview, anatomy selection, opacity/layer edits and transforms.  
**Previous decisions:** E-001–E-004 entity/Blueprint foundations are accepted. `ANATOMY_PRESERVATION_CONTRACT.md` remains mandatory.

## The goal

**Preserve existing editor fidelity** while making state, rig calculation, renderer, controls, serialization and history testable independently. Do not create a Manager for each organ, layer or button; avoid speculative frameworks and dependency injection.

## Verified observations in the original code

- `ASCEAN_RIG` already encapsulates reusable geometry and versioned data: `makeState`, `worldPoint`, `normalizedPoint`, `partTransform`, `layerTransform`, `setPreset`, `validate`, `compact`, `autoAlignArt`.
- The second script contains one editor closure with `state`, `selected`, `history`, `future`, rendering, pointer handling, import/export and UI wiring.
- A generic-ish numeric control already exists: `numberControl(key,label)` with `controlListeners(container,keys)`. **Extend this rather than replacing it.**
- Labels, `ranges`, `setField` bounds, percent-to-domain conversion and output formatting are in different locations. This is a concrete **single-source-of-truth** consolidation target.
- `render()` replaces `stageContent.innerHTML`. Measure drag/animation performance before proposing incremental SVG updates.
- `checkpoint()` keeps up to 65 serialized snapshots; preserve exact Undo/Redo behavior, with drag gestures grouped into one transaction.
- Current baseline preserves original embedded fish art, ASCII layer, external overlays, part selection and independent transforms. The simplified schematic PR #9 is closed and superseded.

## Thin architecture (logical, not compulsory new classes)

```text
EditorShell (wires modules; no business rules)
  ├─ ControlFactory + ControlSpecs ----> editor actions
  ├─ Selection / Viewport UI ----------> editor actions
  └─ EditorStore + History <----------- single state owner
                 |
                 +--> Existing ASCEAN_RIG pure geometry & validation
                 +--> SVG Renderer + Viewport
                 +--> Import/Export (version-aware)
                 +--> Optional anatomy Field Registry adapter

Species Blueprint = external, immutable shared config, never the UI state
LivingWorld = external authoritative simulation, not owned by this editor
```

**Coordinator naming:** prefer `EditorShell` or `EditorController`, not `MainManager` that centralizes every mechanism. The coordinator wires modules and handles lifecycle; geometry, validation, paint and save logic stay in their respective modules.

**Module extraction candidate AFTER visual baseline approval** (each move a separate behavior-preserving PR/commit):

```text
site/anatomy/
  index.html              Existing DOM and media; preserve unchanged until baseline approved
  editor-shell.mjs        Boot/wiring, control event subscription and cleanup only
  editor-state.mjs        State, selected target, Undo/Redo transactions
  editor-controls.mjs     ControlSpecs, factories and shared input/value interaction
  editor-canvas.mjs       SVG drawing + viewport/pan/zoom adapter
  editor-io.mjs           Import/export, legacy migration, schema validation
  editor-rig.mjs          Extraction/adaptation of existing ASCEAN_RIG calculations
  editor-tokens.css       Design tokens, sizing, spacing, colors, motion/fallbacks
```

This is an **upper bound, not a quota**. Merge files when splitting adds indirection without a distinct responsibility. Do not add an event bus, DI container, framework migration or per-organ classes without a demonstrated need.

## The UI first, then code simplification

The user already provided precise UI references:
- `index (17).html` is the **current experience**: retain its artwork, hierarchy, panel roles and existing workflows.
- `liquid_ui_playground_v3_mobile(1).html` is an **interaction/material reference**, not a mandate to import its Tailwind prototype code.
- Meniscus liquid slider reference (user-supplied text): track 6–8px, thumb capsule about 36×22px (or round 22–28px), clear-glass enlargement around 1.2–1.4× while dragged, correct disabled/rest state; use accessible numeric input and reduced motion. This is a design target, not a new functional implementation.
- Previous user direction: adaptive liquid glass curtain is a **planned/compare/implemented visual comparison component**, separate from the ordinary per-field numeric slider; independent X/Y scaling, uniform scale, tilt, crop, warp default ON with independently switchable links; long-standing ASCII/illustration/anatomy overlay controls; mobile canvas-first layout with Layers/Inspector/Atlas panels.
- No original feature is to be removed for UI simplicity. First create a **visual catalog** comparing original control and candidate approved control at same size, touch target, hover/drag and disabled states; get owner approval before changing controls or restructuring layout.

## Control definitions — one source of truth

The **domain** stores normalized values (e.g. `sizeX=1.0`), while UI conversion happens once from declarative metadata.

```ts
type NumericControlSpec = {
  key: "dx" | "dy" | "sizeX" | "sizeY" | "scale" | "rotation";
  label: string;
  min: number;     // domain units
  max: number;
  step: number;    // domain units
  unit: "ratio" | "degree";
  group: "transform";
};

const sizeXControl: NumericControlSpec = {
  key: "sizeX", label: "Width",
  min: 0.25, max: 3, step: 0.01,
  unit: "ratio", group: "transform"
};
```

The factory gets the spec + current value + `onChange` callback. It renders one generic **liquid slider with numeric input**, not a unique control per organ. All conversions (ratio ↔ percent, rad/deg when relevant), label, bounds and validation derive from one spec. A single source of **FieldID metadata** may eventually drive the inspector; do not allocate arbitrary IDs now.

### Interaction pipeline

```text
pointer / keyboard / numeric entry
 -> ControlSpec normalization & validation
 -> EditorAction (target/field/value)
 -> EditorStore update (one owner)
 -> Dirty flags / requestAnimationFrame render
 -> History transaction on commit (one drag = one Undo)
 -> optional document serialization
```

Preserve correct keyboard, pointer, touch and error behavior. Rendering and history do not own species biological state. Avoid global mutable event emitters unless a cross-module feature proves they are needed.

## Sizes & shared configuration

**Do not put every number in an unstructured `common.ts`.** Separate by meaning:

| Location | Owns | Must not own |
| --- | --- | --- |
| `editor-tokens.css` | spacing, touch sizes, radii, glass material, colors, panels, responsive breakpoints, focus and reduced-motion | biological geometry, absolute organ positions |
| `ControlSpecs` | UI min/max, step, precision, unit, field formatting and editability | CSS layout or biological source values |
| `Rig/Species Blueprint` | landmarks, relative organ relationships, calibrated morphology when available, stage/sex/version | UI slider sizes or button colors |
| `EditorStore` | user selection, optional local overrides, viewport, history | duplicate species blueprint, alternate LivingWorld |

## Code rules for humans and Codex (proposed)

1. **Preserve the baseline.** Never replace artwork/ASCII, remove editor functions, rename serialized fields, or rewrite a working subsystem without explicit owner approval and before/after parity proof.
2. **One responsibility and one data owner.** A field has one canonical definition; no duplicate geometry constants, duplicated range tables or unrelated side effects in renderers.
3. **Prefer data-driven composition to inheritance.** Use a single shared control factory, one `ControlSpec` per property, model-specific strategies only when implementations genuinely diverge.
4. **No manager inflation.** `EditorShell` coordinates, not computes everything. No per-layer/per-organ Manager, DI framework, event bus, AbstractFactory, or singleton without evidence.
5. **Minimal, intentional names.** Domain concepts (`anchorX`, `selectedPartId`, `viewportZoom`); `x/y` only for local geometric points. Never add variables merely for renaming or to satisfy a style pattern.
6. **English source docs/comments.** Public-facing technical names in English; Hebrew learning explanations outside code. Add JSDoc for non-obvious state, units, transform order, mutable side effects, serialization and evidence quality. Comments explain *why* and invariant, not `i++ // increment i`.
7. **Document API and coordinate contracts.** Normalized coordinates vs SVG pixels vs World coordinates, +Y directions, standard vs total length, reference offsets/warp behavior and units cannot silently vary.
8. **No fake precision.** Mark illustrative biology; provenance required before promoting any geometry or physiological value to scientifically calibrated.
9. **One edit transaction.** One continuous drag produces one Undo entry. Reset/import/lock/visibility are intentional actions with tested history.
10. **Performance evidence.** Reuse nodes and partial redraw only if profiler warrants it. Measure frame time and allocations on mobile and desktop; no invented FPS or memory savings.
11. **Tests as part of every refactor.** Unit tests for rig/math/schema; Playwright at 390px and 1280px; snapshots of key UI views; import/export roundtrip; original control inventory unchanged unless approved.
12. **Reviewable changes.** Small branch commits, `Before → Change → After → Tests → Evidence → PCM checkpoint`. No merge or Pages deployment without owner approval.

## Deliberate implementation order

**Gate A — UI alignment (no functional refactor yet):** show original controls next to proposed Meniscus-style numeric control, layer rows, bottom-sheet mobile navigation and separate compare-curtain. Include 390px and desktop screenshots with real source artwork. Owner decides exactly which UI becomes baseline.

**Gate B — no-visual-change consolidation:** centralize ranges/labels/formatters/validators into ControlSpecs while keeping original DOM outputs and snapshots; verify no regression in existing editor.

**Gate C — extract state/history and pure rig logic carefully:** every extraction must retain original v0.3 serialization and Undo/Redo, with golden fixtures and snapshot comparisons.

**Gate D — renderer/viewport optimization:** measure before/after, preserve content, apply rAF scheduling or targeted SVG updates only where measured bottlenecks justify them.

**Gate E — incremental anatomy biology:** connect FieldIDs/anatomy landmark lookups, scientific provenance and later read-only World snapshots; never create a separate physiological engine in the editor.

**Approval request:** Do we adopt the organization and code policy above, including the exact UI controls and interaction appearance? Until approved, this remains a draft specification and must not trigger source refactoring.
