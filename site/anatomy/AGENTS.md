# Anatomy editor instructions for Codex

**Owner-approved layout baseline:** ASCean v0.8 UI, SHA-256 \`74a7df17299c6d7430271d86c77b846c1a6c84ddadc2ee1426488f89f97db845\`, provided in an external chat review package. This experimental source is **not** automatically the code at this repository path. Read \`../../docs/ui/DEEPGLASS_BASELINE_V1.md\` before any change.

## Nonnegotiable safeguards
- Existing original v0.3 editor at \`site/anatomy/index.html\` and approved v0.8 UI are BOTH preserved references. Do not overwrite either without explicit staged migration and owner UI parity review.
- Freeze before modifying; after modification compare on 1440/390/360 widths and inspect original fish artwork and all controls.
- Reuse the existing ASCEAN_RIG, warp/landmarks, layer registry, PrismGlass slider, measurement and Undo/Redo. No simplified replacement.
- Adopt the seven logical responsibilities (Shell, Theme, Layout, Tool, Overlay, Inspector, Preset) only where extraction reduces duplication. Avoid manager-per-button/organ, singletons and event bus without justification.
- English-only source comments and clear unit/axis contracts; don't add speculative state variables.
- UI appearance never falsifies scientific calibration, actual physiology, World identity or snapshots.
- Require small PR, measured performance, tests, user screenshot approval, then record checkpoint in existing PCM \`projects/ascean\`. No automatic merge.
