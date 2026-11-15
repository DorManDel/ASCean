# ASCean Development Hub — UX, Source Audit & Design

## Purpose
Use `site/hub/` as the first stop for mechanics discovery and experimentation, with an immediately available **Species & Genome Playground**. Both Ocean and Lab should eventually import approved production packages, not the source code of these visual vignettes.

## Navigation / information architecture
1. Genetics playground — two adjustable diploid parents, seeded five-offspring batch and generation promotion.
2. Mini aquarium test cells — mating/spawning, food/digestion/waste, predation/Z escape, social investigation. Each has play/pause/reset/manual step and a visible event trace.
3. Mechanics catalog — full-text search, categories, source status, inspect action and exact reference link.
4. Mass/thrust/drag — baseline vs edited force dynamics, toy CGS coefficients and motion illustration.
5. Developer & AI — decision register, implementation gates, Codex and developer rules.
6. Development pipeline — prototype → evidence → implementation → owner review → private PCM checkpoint.

## Recovered material and provenance
- `site/references/species-genome-lab.html`: user's attached 2026-11-13 `Species_Genome_Lab (1).html`, preserved as an interactive archive with only hash deep-link navigation addition.
- `site/references/aquarium-mechanics-archive.html`: user's attached `index (3).html`, preserved as an archive with only hash deep-link navigation addition.
- `site/shared/genetics-prototype.mjs`: pure domain helper extracted from the user-supplied species prototype. It is *not* an implementation of real DNA genetics; its trait loci and equal allelic average are illustrative.
- `site/shared/physics-prototype.mjs`: documented replaceable mass/thrust/drag toy comparison in CGS units, not calibrated locomotion.
- `site/shared/mini-ecosystem-prototype.mjs`: deterministic event vignettes for describing integration requirements, not ecological/physical simulation. Separate node tests cover repeatability, event timing, offspring usage and XYZ escape.

## Research / truth contract
A mechanism has two independent axes: *engineering status* (proposed, visually prototyped, source implemented, runtime tested, owner integrated) and *scientific confidence* (illustrative, literature grounded, calibrated, validated). Avoid words like "realistic biology" in any UI section that only scripts events.

## Future integration
Codex M1 should implement a minimal reusable World package and entity/event contract. The Hub presents the same module and reports source version; mini-tanks remain separate until behavior models graduate. Do not promote the standalone HTML archives into production engine logic wholesale.

## UX acceptance
- Search yields matching cards and no-result state.
- Two parents can breed with a repeatable seed; offspring are available for the mating mini aquarium, including lineage and body color.
- Each mini cell can pause, step 0.5 seconds, reset and replay; predation changes X/Z in escape mode and shows a contact-only demonstration separately.
- Decision status filters and developer milestones are readable on desktop and mobile without horizontal overflow.
- Two archived experiments can be opened by anchor links at their intended panel.
- Reproduction, digestion, AI cognition, tissue regrowth and physical collision all stay explicitly marked illustrative where appropriate.
- No changes to original ASCuarium or MobiLab repositories.
