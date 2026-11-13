# Vision — what ASCean should become

**Product:** a living, scientifically informed ocean simulation where fish are organisms, not merely decorative sprites. An intentional contrast: high biological/physical modeling ambition, stylized ASCII/character rendering.

## Experiences
- **Ocean:** autonomous fish moving in true 3D; a projected side-view aquarium for desktop, mobile, screensaver/wallpaper and possibly native runtime later.
- **Mechanics Lab:** every mechanism can be explained in plain language, manipulated live, compared against a baseline and measured. A user can see *what* an algorithm changes and *why*.
- **FishDex:** species pages with sourced morphology, habitat, feeding, reproduction, sensory traits, anatomy, life cycle, evidence confidence and a small ASCII scene.
- **Research mode:** deterministic experiments, seeds, snapshots, time scaling, calibration data, reproducible runs, metrics and source provenance.

## Biological realism direction
Individual fish may differ in genetics, morphology, life stage, condition, personality/drives, experience, injuries and learned behavior. These dimensions should interact through explicit interfaces instead of one giant fish script. Species physiology and habitat tolerance are evidence-backed and versioned. Zebrafish is the first **freshwater research reference**, not the default occupant of a saltwater ocean. Marine fish (e.g., clownfish) and other taxa follow via separate profiles.

## Physical environment
Initial *engineering sandbox*: X 100m wide, Y 50m vertical, Z 30m into the screen. Saltwater by default; fresh/brackish habitats are separate configurations or regions. Water fields may include salinity, temperature, pH, dissolved O2, ammonia/TAN, flow, turbidity, irradiance and pressure. Reefs, rocks, caves and shelters are structural habitat, not mere decoration. Very deep species require different volumes/scales.

## Performance ambition
Hundreds of fish first, then thousands and beyond by measurement. Validate per-system update cost, allocations, neighbor-query behavior, memory and rendering independently. Progressive simulation fidelity or differing update cadences are *candidate optimizations*, subject to scientific and behavioral validity.

## Non-goals of first milestone
No claim of a fully calibrated ecosystem, million-fish live performance, actual DNA-to-phenotype inference, 3D fluid dynamics, autonomous agent cognition, or scientific use readiness. Establish reproducible foundations first.
