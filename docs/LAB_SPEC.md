# Aquarium Mechanics Lab — functional / UX specification

**Role:** interactive explainer, measurable workbench and human approval surface. No duplicated production simulation engine. The Lab should eventually import the same packages as the Ocean Simulator.

## Information architecture
Navigation tree with foldable categories:
- **Data & Memory:** Fish Blueprint, Body & Mass, Precision/Bit Packing, Identity/Lookups, Memory Budget.
- **World & Physics:** Spatial Search, Contact/Avoidance, Time/FPS, Water Chemistry, Ocean Depth/Light/Pressure, Habitat & Currents.
- **Biology & Behavior:** Growth/Condition, Anatomy/Injury, Diet/Digestion, Biological Clock, Genetics, Learning/Drives, FishDex.
- **Project:** Decisions, ADRs, Implementation Status, Benchmarks, Sources, Release Notes and version metadata.

## Presentation and responsiveness
- Clean title **Aquarium Mechanics Lab**; no version number, vague marketing slogans or pointless tags in main header.
- Light DLS-inspired glass sidebar, nested accordion/fold animation, mobile hamburger, accessible keyboard navigation. On mobile, prioritize one readable visualization and compact context.
- Compact, balanced one-screen layouts on desktop where sensible; no huge empty panels, horizontal overflow or controls detached from their diagram.
- Presentation mode: browser full-screen when available, next/previous with keyboard/clicker/touch, exit gracefully.
- ASCII aesthetic may use SVG and glyph-atlas techniques for scaling and clickable organ regions. Do not mistake a sprite stencil for actual anatomy or a generated image for scientific proof.
- Preserve user-generated experiments locally or via export, but do not silently upload personal data or telemetry.

## Acceptance per demonstration
- **What:** one-line objective, short bullets, meaningful units and explanation of each slider.
- **Visual:** baseline vs experimental behavior, with controls that visibly change the same model.
- **Truth:** show which values are authentic measured data vs synthetic illustration.
- **Test:** pause freezes *simulation state*; redraw may continue. Ensure Z changes affect both cameras and appearance.
- **Telemetry:** real FPS/TPS and measured query counts. Simulated high refresh settings must be clearly distinguished from actual monitor FPS.
- **Consistency:** no two independent fish models in the same growth/injury example; graph, shape, body metrics and selected organ reflect one data source.
- **Water:** selectable probe (position, Y depth, time), independent heatmap layers and combined visualization, current vectors and gradient scale, correct units.
- **Collision:** both fish have trajectories; avoid maneuvering in 3D, territorial/predator intent, contact and resolution stages are separately inspectable, with no instant unrealistic direction flip.
- **Mass:** show standard vs changed acceleration/drag with an actual motion comparison, not merely a parameter number.
- **Accessibility:** responsive PC/phone, no accidental scroll traps, reduced motion, contrast, focus states, touch targets.

## Prototype inheritance
Prior ASCuarium Mechanics Lab v3–v10 and UI Review designs are *design references only*. Reimplement/reuse selectively after source audit and license review. Do not label them runtime tested or scientific.
