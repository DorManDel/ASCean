# ASCean experiment review contract

**Mechanism state:** proposal → interactive prototype → measured → reviewed → package implementation → tests → owner approval → integration → published → PCM checkpoint.

Each mechanism requires:
1. One-line purpose and visible expected behavior (including intentional failure cases).
2. Inputs/outputs/units, deterministic seed, correct XYZ coordinates, storage footprint.
3. Source evidence vs synthetic toy data vs genuinely calibrated fish species data.
4. Baseline vs candidate; correctness oracle and measured performance, real FPS/TPS when shown.
5. Source commit and tests (including mobile/desktop), owner decision and rollback.
6. An interactive Lab page that imports the same accepted production package as the Ocean.

Examples: Spatial Hash results must equal exact brute force XYZ search; pause freezes world ticks; snapshots replay deterministic state; mass entries do not double count; higher render rate must not alter true physical speed.

The Lab is a design-and-approval surface; it is not itself scientific validation.
