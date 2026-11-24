# ASCean DeepGlass — Icon & Visual Polish Review

**Status:** design review, no editor source rewrite. **Date:** 2026-11-25.

## Strategy
- General toolbar/command icons: choose exactly one public SVG family: [Lucide](https://lucide.dev/guide/) **recommended**, or [Tabler](https://tabler.io/icons) as alternative. Do not visually mix families in the same toolbar. Credit/license requirements apply when vendoring SVG assets.
- Build a separate original **ASCean Anatomy Icons** pack for parts such as tail, body, eye, mouth, dorsal/pectoral/pelvic/anal fins, jaw, gills, heart, intestine, spine and circulation. Use 24×24 source grid, support 16/20/24 px, clearly differentiated silhouettes/region emphasis; no cartoon-fish-per-button.
- Icon metadata: stable semantic key, caption, fallback text, tooltip and aria-label, role, source/license, accent semantic token, active/hidden/locked states. Never hardcode icon geometry per layer row.
- Use the actual official ASCuarium icon until a separately approved brand replacement exists. Do not invent logos.

## Candidate semantic mapping
| Region | Icon (Lucide name candidate) |
| --- | --- |
| Select / Pan | \`mouse-pointer-2\` / \`hand\` |
| Zoom in/out / Fit | \`zoom-in\` / \`zoom-out\` / \`maximize\` |
| Grid / Landmarks | \`grid-3x3\` / \`crosshair\` |
| Measure line/path/area | \`ruler\` / \`route\` / \`pentagon\` |
| Undo / Redo | \`undo-2\` / \`redo-2\` |
| Layers / Visibility / Lock | \`layers-3\` / \`eye\`, \`eye-off\` / \`lock\`, \`lock-open\` |
| Events / Activity | \`history\`, \`activity\` |
| Anatomy / Atlas | \`book-open\` (temporary; future bespoke skeletal icon) |
| Settings / Save / Seed | \`settings\` / \`save\` / \`dice-5\` |
| Presentation / Fullscreen | \`presentation\` / \`expand\` |
| Thermal / X-ray / Circulation | \`thermometer\` / \`scan\` / \`activity\` (analysis overlays; illustrative until calibrated) |

**Not final:** check exact icon names against installed library version and compare stroke, optical scale, visual meaning and low-resolution readability.

## Polish passes
1. Top header: three semantic groups (Brand | Entity/Last action | Commands), compact spacing and clear keyboard labels.
2. Selection curtain: reduce nested borders, preserve contrast for selected/hover/focus/disabled; subtle PrismGlass accent.
3. Panel density: keep side tabs sticky within each scroll container. Mobile canvas stays prominent; controls never clip.
4. Motion: velocity-reactive **PrismGlass** slider and small material reactions only; reduced-motion and low GPU-cost fallbacks.
5. Presentation: single fullscreen control, shared frame grid, optional layer/inspector hiding and reversible layout preset.

## Acceptance
- User selects icon family and reviews side-by-side screenshot/storyboard.
- Icons pass 16/20/24 px legibility, 44 px touch area, keyboard focus, tooltip semantics.
- Original rig/atlas/warp/measurement functions unchanged.
- UI screenshots compared with exact v0.8 baseline hash.
