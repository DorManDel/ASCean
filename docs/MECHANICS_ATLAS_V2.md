# Mechanics Atlas V2 — UI approval checkpoint (2026-11-26)

## Approved scope
Owner approved the V2.3 UI as the starting baseline: Fish Blueprint (five semantic groups, horizontal wrapping field chips, fixed inspector title, human-view placeholder and linked memory map), Memory Explorer (six structure demos), Quantization (XYZ, bit trace, alignment) and Bitfield Playground (field-colored pack/unpack trace). This is approval of UI and educational demonstrations only, not an engine schema or scientific model approval.

## Review refinements
Compact title toggle, sidebar toggle, existing fullscreen Present; per-array colors in memory map/inspector distinct from field access-tier colors and hardware-region colors. Existing icons retained. Anatomy & Injury uses the previously authored standalone Fish Anatomy & Render Lab v2 template in a lazy-loaded iframe, explicitly marked illustrative. Overview unchanged. The current shared WorldPrototype lab is preserved at site/lab/.

## Gates before replacement
- Compare frozen baseline and review build; verify compact/sidebar/presentation on desktop and physical mobile, keyboard/touch, anatomy embed and all four data/memory interactions.
- Check source evidence and distinguish current reference, planned demos, integrated and validated.
- No production engine integration or performance claim from standalone prototypes.
- Preserve old archive branch backup/mechanics-lab-2026-11-25; keep main unchanged until PR review.

## Next
Memory Explorer visual refinement remains open. Next mechanism: 3D Spatial Search, then Swim & Locomotion, Time & FPS, Contact & Avoidance. Anatomy model evolves in parallel. Codex must preserve the approved layout; don't infer field types or alter existing mechanics without explicit review.
