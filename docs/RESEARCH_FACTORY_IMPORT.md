# Research Factory read-only contract v1

ASCean does not implement or depend on the separate Discovery → Normalize → Validate → Deduplicate → Synthesize → Human Review/Ledger → Experiment Proposal pipeline. Its database, scheduler and private ledger remain external. No private source was accessed in this milestone.

`readReviewedFinding(unknown)` in `packages/core/src/living/research.ts` accepts a detached schema-1 record with ID, kind (`finding` or `experiment-proposal`), explicit `review.status=approved`, reviewer/date, claim, HTTPS source URL, DOI or null, species, life stage, habitat, units, license, uncertainty, prospective calibration test and implementation reference or null. Empty required provenance rejects. Additional executable coefficients/configuration fields reject. The returned metadata and review record are frozen. It is never connected to a World mutator or network loader.

This boundary verifies schema and an approval assertion, not reviewer authenticity or scientific truth. An operator must obtain the record through an authorized trusted channel and review it. Unknown licensing permits metadata discussion only, not automatic asset/data reuse. A new parameter/model needs source-specific review, an implementation PR, a calibration test and owner acceptance; the import cannot silently alter coefficients.

Example records in tests are clearly synthetic metadata fixtures, not imported scientific findings. There are no actual Research Factory findings available to import in this worktree. Contract extensions, signed approvals and curated fixture ingestion can be proposed later without coupling the engine to the external service.

Sources consulted for this slice (2026-11-15):

| Source | Scope / rights | Use and uncertainty | Prospective calibration |
|---|---|---|---|
| [NOAA: pressure and depth](https://oceanservice.noaa.gov/facts/pressure.html) | Ocean hydrostatic context; no species/life stage, no asset imported; source-specific image rights not assumed | Qualitative depth dependence source-verified; uniform field values remain illustrative; cm→m conversion explicit | Compare pressure-depth profile with specified density and salinity/temperature conditions |
| [Mearns et al., DOI 10.7554/eLife.98347](https://doi.org/10.7554/eLife.98347) | Larval freshwater cichlids/medaka with zebrafish comparisons; article CC BY; no dataset/figure reused | Species-specific hunting strategies; does not validate our generic FOV, speed, hunger or ingestion values | Species/life-stage trajectory, visual-angle and capture-outcome measurements with matched habitat and units |

Cross-domain deterministic agents, conservative contact geometry and discrete event recorders are engineering inspiration, not empirical fish evidence. The on-site [evidence page](../site/science/living-v1.html) labels these boundaries alongside the interactive experiment.

Each record also requires an explicit `evidence` label: source_verified, calibrated, illustrative, proposed or unknown. Human approval and evidence strength are separate fields.
