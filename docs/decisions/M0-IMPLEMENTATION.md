# M0 implementation scope and contract reconciliation

2026-11-15. Status: **implemented for review; choices provisional**. The owner's M0 Foundation request authorizes this bounded slice, not acceptance of all ADR-018–020 proposals. A-002–006, A-012, A-016–017 remain authoritative. No P/O item is promoted to accepted.

The existing architecture audit and proposed lifecycle/data/inspection contracts were read, not repeated. Their broader M0/M1 plan includes features beyond the requested one-entity slice. This document records the bounded proposal instead of silently treating that full plan as implemented.

| Contract | This slice | Remaining proposal / owner gate |
|---|---|---|
| Two applications, one World | Both app entrypoints import `@ascean/core`; shared view contains no motion solver | Third Sandbox packaging remains ADR-018 |
| World owns data; stable IDs differ from slots | Private dense entity array, ID→slot Map, swap/remove, monotonically increasing safe integer IDs | P-001/002 stay provisional: ordinary JS Float64 numbers establish a baseline; typed-array SoA/capacity benchmarks deferred |
| XYZ, cm/s/g; XY view | 10,000 × 5,000 × 3,000 cm; Y up; Z opacity only in view; water depth explained from Y | No pressure or environment solver |
| Deterministic fixed ticks and seed | 1/30 s default; integer tick; versioned uint32 LCG (1664525, 1013904223); stable slot iteration | Replay guarantee only same implementation/runtime; cross-runtime evidence absent |
| Boundary behavior | Analytical mirrored interval reflection on each axis; arbitrary multiple crossings supported | Illustrative replacement for a future force/contact solver, no biological claim |
| Timing | Paused initially; step only while paused; resume/reset clears backlog; at most 8 catch-up ticks/frame, discarded wall time reported | Biological clock serialized at scale 1 only; acceleration rejected |
| Inspection and restore | Detached selected-ID inspection; reset clears selection; restore rebinds by ID; invalid restore leaves current World untouched | Run-qualified references required before external commands/history; selection is local to this view |
| Versioned snapshots | JSON schema/engine/model, units/extents, tick/dt/bio time, seed/RNG, allocator, slot order, all enabled state | No extra module/cadence/command state exists in this slice; unknown required versions reject |
| Lifecycle and commands | Single motion module directly called by Runner; controls own their listeners/animation teardown; no UI entity edits | Full EngineBootstrap DAG, typed queued edit commands/events, fault recovery and replay logs deferred as a separate proposed milestone. No claim those acceptance rows pass |
| Existing routes | `/`, `/ocean/`, `/lab/` retained; additive `/ocean/foundation/`, `/lab/foundation/` under `/ASCean/` | Route replacement and release workflow change need owner review |

## Mechanism specification and acceptance

Seed generates only illustrative initial velocity at the world center. Each tick integrates `position + velocity * dt`, mirrors coordinates into bounds, and adjusts velocity direction. No forces, fish species, calibrated values or biological constants are introduced. Velocity magnitude is limited to 10,000 cm/s per axis solely as an illustrative input-validation bound; dt is limited to (0,1] seconds. These are software constraints, not physiology.

Acceptance: same seed and equal tick count yield identical complete snapshots; paused rendering changes no authoritative state; step advances exactly one tick; XYZ follows an independent interior oracle; boundary reflection remains bounded; removed IDs never reappear; detached data cannot mutate World; restore-and-continue preserves allocator/RNG; invalid snapshots reject atomically. `tests/core.test.ts` covers these gates. Existing six prototype tests remain intact.

Interactive Lab: select entity, step, inspect position/velocity, save, advance, restore, and run the visible 60-tick replay comparison. Ocean uses the identical runtime and view. Browser smoke tests controls and all five routes at desktop/narrow widths. Values carry **illustrative** status; unsupported biology is unavailable rather than fabricated zeroes.

Performance: O(N) motion and detached inspection copies; O(1) ID lookup/removal; JSON snapshot O(N). No index or extra biology packages. `benchmarks/core.ts` measures 100 warm-up and 1,000 sample ticks at 1/100/1,000 entities. UI reports measured frame/tick throughput, update and draw+inspection CPU duration, and dropped wall time. GPU, energy, precise retained heap, allocation counts and physical-mobile performance remain unmeasured. No million-fish claim.

Owner review is still required before merge, integration into reference routes or publication. PCM transfer is separately authorized; this implementation does not access PCM.
