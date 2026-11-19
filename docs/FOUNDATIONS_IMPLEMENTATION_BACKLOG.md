# Foundations Implementation Backlog

**Date:** 2026-11-20  
**Design status:** E-001, E-002, E-003, E-004 **ACCEPTED by owner**.  
**Implementation status:** open, scoped and not runtime-verified. The approvals do not authorize merging PR #8 or changing the existing Anatomy Engine.  
**Source of truth:** [FOUNDATIONS_REFINEMENT.md](FOUNDATIONS_REFINEMENT.md) and [DECISIONS.md](DECISIONS.md).

## E-004 — Open implementation decisions

| ID | Work item | Acceptance condition | Notes |
| --- | --- | --- | --- |
| E004-I01 | **Blueprint field/component merge policy** | Document and test `replace`, `add`, `remove` semantics, parent/child precedence, required-component protection, incompatible combinations, field-level override rights and unknown fields | Do not make empty/implicit merges silently destructive |
| E004-I02 | **Inheritance diagnostics / depth warning** | Implement cycle rejection, missing-parent/version errors, configurable advisory warning threshold, structured diagnostic codes, actionable parent path, deduplication and a Lab view | No arbitrary mandatory max depth in V1; bounded resources and cycle safety remain essential |
| E004-I03 | **Model interface contracts** | For each new biological mechanism, define only the shared contract actually needed (e.g. circulation); test distinct fish/octopus physiology without forcing shared anatomy or per-fish polymorphism in hot loops | Interface signatures await the mechanism's scientific/architecture stage |
| E004-I04 | **Immutable resolved Blueprint + versioning** | Freeze published version, pin instances to exact version, validate deterministic flatten/cache, migration rules, and no silent modification of existing entities | Exact serialization and cache-invalidation semantics need tests |
| E004-I05 | **Genotype, overrides, phenotype boundary** | Distinguish common reference genome, individual variants/alleles, instance config overrides, runtime state and experimentally supported genotype-to-phenotype mapping | No arbitrary mutation-as-species-change rule |
| E004-I06 | **Field Dictionary and anatomy mappings** | Stable FieldIDs, validation/units, Human/Schema/Memory views linked by ID, bidirectional actual anatomy landmarks, honest virtual/logical indices/offsets/bit representations | Demo Fish view currently schematic and not a scientific source |
| E004-I07 | **Production integration & benchmarks** | Map actual runtime state and benchmark under fixed reproducible conditions; tests for inheritance, old save migrations, entity creation/destruction, device layouts, snapshot roundtrip | Avoid turning reference prototypes directly into certified engine components |

## Cross-cutting foundation work

- [ ] E-003: specify typed-array expansion, ID/handle mapping and generation wrap protection; test stale handles, swap mapping, add/remove behavior and deterministic iteration.
- [ ] Ring buffers: state a separate overwrite/backpressure policy for the event queue and each history/telemetry stream; test wraparound and overflow.
- [ ] Field Registry: allocate stable field IDs and schema versions; compare binary and text representation sizes using real sample data.
- [ ] Complexity: record expected/worst-case time and extra space for each new operation, then measured latencies, allocations and active vs capacity.
- [ ] Diagnostics: align error codes, severity, correlation and de-duplication with existing EngineBootstrap diagnostics without inventing an extra global manager.
- [ ] Documentation & UI: the Foundations Explorer should surface accepted design separately from unimplemented code; preserve this distinction through merge/release.
- [ ] **Anatomy next**: audit the current Zebrafish Anatomy Engine source and existing visuals before proposing changes. Inventory anatomy landmarks, organs, swimming motion, user controls and regressions; do not rewrite or overwrite the old working prototype.

## Definition of done for each mechanism (six-stage contract)

1. Concept and scientific evidence.
2. Architecture/UML (interfaces, composition, inheritance when relevant).
3. Field contract (FieldIDs, type, owner, units, access frequency and anatomy link).
4. Memory/complexity specification.
5. Small implementation, same production core and interactive Lab explanation.
6. Validation, regression/performance evidence, reviewed PR, owner approval and compact PCM checkpoint.

**Governance:** work on scoped feature branch and reviewable PR. No direct push to main, automatic merge/deployment, guessed biological constants or invented benchmark numbers. PCM remains private; update only its existing `projects/ascean` project record.
