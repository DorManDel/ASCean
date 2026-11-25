# Existing SVG Icon Review — Sources & Licenses

**Review only · 2026-11-26 · branch design/deepglass-existing-svg-review**

This folder contains **47 original, externally sourced SVG files** and a DeepGlass comparison gallery. Their vector paths and markup were copied from the upstream project sources **without reconstruction, redrawing, tracing from PNG, or geometric edits**. The gallery uses CSS masking to recolor the unchanged files.

## Sources

1. **Lucide:** 37 UI icons from https://github.com/lucide-icons/lucide/tree/main/icons (ISC; some Feather-derived icons additionally MIT). See vendor/LICENSE-LUCIDE.txt. Recommended **single UI chrome family**.
2. **Tabler Icons:** 5 anatomy/category candidates from https://github.com/tabler/tabler-icons/tree/main/icons/outline (MIT). See vendor/LICENSE-TABLER.txt.
3. **Health Icons:** 5 anatomy/category candidates from https://github.com/resolvetosavelives/healthicons/tree/main/public/icons/svg/outline/body (CC0 icons; website code MIT). See vendor/LICENSE-HEALTH-ICONS.txt.

Original upstream SVG file paths and stable candidate semantic IDs are in icons.json. No production replacements are approved.

## Required process

- Compare source SVGs at 20, 24 and 36 px with DeepGlass background/toolbar. Do not mix multiple system icon families in a single toolbar.
- **Missing anatomy:** dorsal / pectoral / pelvic / anal fins, zebrafish-specific gill arches, specialized fish heart. Generic fish silhouettes are not acceptable substitutes for named anatomical regions.
- Health Icons usually depict **human anatomy** and must NOT imply scientifically accurate adult zebrafish organs.
- Review body/tail -> fins -> head/senses -> internal organs separately; use species/stage-specific scientific references when needed.
- Use the gallery's Export choices to download ascean_existing_icons_feedback.json and report Keep / Compare / Reject.
- The approved DeepGlass v0.8 layout, artwork, motion, editor rig and stored fish presets are unaffected.
- Original SVG files are unchanged; theme recoloring occurs only through CSS masking, and exact license texts are retained.

**No PNG or traced bitmap is included.** All icon artwork comes from pre-existing vector files.
