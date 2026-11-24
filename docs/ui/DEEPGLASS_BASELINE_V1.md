# ASCean DeepGlass — Layout Baseline Lock v1

**Owner approval:** 2026-11-25, layout approval only. **Scope:** Anatomy UI review v0.8.
**Canonical exact prototype in user's review package:** \`ASCean_Anatomy_UI_Review_v08.html\`, 3,001,176 bytes, SHA-256 \`74a7df17299c6d7430271d86c77b846c1a6c84ddadc2ee1426488f89f97db845\`.
**Frozen deliverable:** \`ASCean_DeepGlass_Baseline_v1.zip\` delivered as a chat attachment; the full 3 MB experimental prototype has **not** been added to this repository. Do not claim that branch's current \`site/anatomy/index.html\` is the v0.8 prototype; it is the earlier original Workspace v0.3. Before implementation, Codex must import the user's frozen v0.8 attachment into an isolated working branch and verify its SHA-256.

## LOCKED (change only through owner-reviewed, regression-tested migration)
- Desktop shell: header, left Layers/Parts, central fish canvas, right Smart Inspector, bottom readouts.
- Mobile canvas-first workflow and inner tab navigation, without losing original editor controls.
- Original anatomical illustration, SVG/ASCII rig, warp links, transform controls, Undo/Redo, editable layers.
- Grid, zoom/pan, two-point/multi-point/polygon/circle measurement and explicit calibration warning.
- Activity history, save/import distinction and the existing PrismGlass slider interaction behavior.
- The same authoritative World remains the only eventual source of physics, life and sensors.

## OPEN visual decisions
- System icon family selection (one library in a single UI), custom anatomy icons, replacement logo.
- Fine header spacing, acrylic/liquid refraction, curtain selection/highlights, microinteractions.
- Final slider geometry/feel and mobile density. No arbitrary replacement with stock range controls.

## Approved seven **logical responsibilities**, not seven required Manager classes
1. \`WorkspaceShell\` — page regions, navigation, presentation and fullscreen.
2. \`ThemeSystem\` — theme tokens, recipes, density, motion; **DeepGlass** brand and **PrismGlass** slider recipe.
3. \`LayoutEngine\` — panel measurements/visibility/resizing and responsive placement.
4. \`ToolController\` — select, pan, zoom, anchor and measurement action modes.
5. \`OverlayRegistry\` — independently toggleable analytical views, evidence status and render order.
6. \`InspectorRegistry\` — field-based panels that react to entity capabilities; not organ simulation.
7. \`PresetService\` — schema-validated workspace presets, separate from fish editor presets and world snapshots.

**UI generic; biology species-specific.** The editor observes one authoritative World; it never invents organ physiology for display.

## Formats must remain separate
- WorkspaceLayoutPreset: theme + sizes + visible panels + viewport + tab selection.
- EntityEditorPreset: reference to species Blueprint + individual visual/editing deltas.
- MeasurementDocument: rig-space points + shape + unit/calibration + assumptions.
- WorldStateSnapshot: entire seed + tick + PRNG state + entity and coral state + versions; a future separate simulator feature.

## Delivery gates
- Preserve exact experimental source and compare hashes before work.
- Component/token extraction is a behavior-preserving incremental refactor, not a UI replacement.
- Golden screenshots at desktop 1440px and mobile 390/360px; keyboard and pointer interactions; import/export/Undo/Redo.
- Per-step code review, measurable performance and owner visual approval.
- The existing private PCM record \`projects/ascean\` gets the checkpoint, never a duplicate project.
- No production merge/Pages deployment approved by this layout decision.

## Scientific analysis overlay guardrail
Thermal, X-ray, circulation, sensory, injury and lifecycle are planned **features** of the Overlay Registry/Inspector, NOT validated biological implementations. Thermal in an aquatic ectotherm is often dominated by water temperature; a stylized IR-camera palette is not actual organism heat emission through water. Always show provenance, measurement status and uncertainty.
