# Codex — ASCean M0 Foundation Review & Hardening

Read:
- AGENTS.md
- docs/ARCHITECTURE.md
- docs/DECISIONS.md
- docs/M0_ACCEPTANCE.md
- docs/MECHANICS_PROTOCOL.md
- docs/ROADMAP.md

## Source branch and task
Repository: https://github.com/DorManDel/ASCean
Current review PR: https://github.com/DorManDel/ASCean/pull/1
Source branch: feature/m0-foundation.
Do not edit main or the old ASCuarium/MobiLab repositories.

## Goal
Review and harden the *existing* M0 foundation, NOT rewrite it or invent marine biology.

Verify these invariants:
1. The two apps share packages/core rather than independent copies.
2. Stable ID remains correct after swap/remove/spawn.
3. 3D neighbors use x,y,z and match all-pairs brute force.
4. Fixed-step movement is independent of display refresh (test 60/120/165/240Hz in scenarios, not as actual device claims).
5. Pause stops updates and single step advances one tick.
6. Mobile 390px + desktop 1440px have no horizontal overflow or unusable controls.
7. Numeric allocation estimates exclude Map/spatial/rendering overhead.
8. Tests use seeded deterministic worlds.
9. Scientific scope labels make clear that motion is placeholder, not calibrated.
10. CI build does not publish on an unapproved PR.

## Review deliverables
- Summarize source SHA, changed files and test results.
- Find concrete bugs or unnecessary complexity; propose simplest safe fixes.
- If code needs changing, use a *new* feature branch/PR or update the approved draft only with clear owner consent. Never merge.
- Provide screenshots if browser testing is available.
- Provide measured benchmark data with full environment details; never fabricate.
- Prepare a minimal PCM checkpoint delta but do not change PCM main.

## Explicit M0 non-goals
No real genetics, trained fish AI, validated injury model, metabolism, reproduction, chemical reactions or millions-of-fish performance guarantees.
