# Mechanic lifecycle and evidence policy

1. PROPOSED — state physical/biological question and expected outcomes.
2. VISUAL DEMO — small isolated experiment in Mechanics Lab.
3. APPROVED DESIGN — owner approves behavior and UI; never imply tested source.
4. IMPLEMENTED — production engine module used by the demo, no shadow code copies.
5. TESTED — deterministic unit/integration checks; actual measured device benchmark if performance-related.
6. REVIEWED — owner + code reviewer check boundary correctness and evidence.
7. MERGED — approved integration to main.
8. DEPLOYED — verify URL, deployed SHA, device compatibility and failure behavior.
9. CHECKPOINT — register only summary/delta in PCM with source commit, evidence and open questions.

Each experiment should display simple explanations, a controllable visual, fields/units, code link, scientific source if applicable, and known limits.
Performance measurement log format: platform, browser, resolution, DPR, fish count, seed, tick rate, frame rate, heap measurement if available, algorithm, elapsed time, date, commit SHA.
