# ASCean mechanics integration queue — 2026-11-13

**Source references:** uploaded Mechanics Lab (v10) and Species & Genome Lab (v0.8), now archived under `site/references`.
**Statuses:** archived reference != approved production implementation. Engine packages and tests are required for each graduation.

| Priority | Mechanic | Current demo | Next engine contract | Verification gate |
|---|---|---|---|---|
| P0 | World + time + identity | Current core reference | `World`, stable `FishId`, `Clock`, snapshot/event API | Seed, tick/replay, swap-remove |
| P0 | Ocean camera / ASCII body | Current core reference | `render(worldSnapshot, camera)` decoupled | Correct XY/Z and pause |
| P0 | Breeding inheritance | Interactive diploid toy | `SpeciesProfile`, `Genotype`, `inherit`, `expressPhenotype` | Seeded loci, lineage, species gate, explicit toy marker |
| P0 | Hub and catalog | Interactive hub | Typed mechanic manifest, decisions, status and links | Search, responsive layout, source parity |
| P1 | Movement / mass / drag | Toy CGS comparison | `ForceAccumulator`, `PhysicsStrategy`, `BodyMassG` | Dimensional tests, numeric error, adjustable mass |
| P1 | 3D neighbors & collision | Spatial World prototype + collision archive | `SpatialIndex`, `CollisionCandidate`, `ContactEvent` | 3D parity, no penetrating resolved state, swept test plan |
| P1 | Curious/social/territorial/predator | Four scripted vignettes + contact archive | `Senses`, `Needs`, `Intent`, `Steering` | inspectable decision + XYZ movement, no instant teleport |
| P2 | Food to feces/ammonia | Scripted waste cell + digestion archive | `FoodResource`, `Gut`, `WasteEvent`, `EnvironmentMatter` | conservation bookkeeping; species-specific food |
| P2 | Reproduction mode | Egg spawning vignette | egg vs livebearing `ReproductionStrategy` | biological reference + lifecycle |
| P2 | Injury & repair | Clickable anatomy + matched fin trial | `AnatomyRegion`, `InjuryEvent`, `RecoveryModel` | region hit + sourced effects and limits |
| P3 | Ocean chemistry/depth | Heat maps/probe archive | `EnvironmentStore`, `WaterSample`, `CurrentField` | sample XYZ/Y-depth + sourced ranges |
| P3 | Hybrid growth / FishDex | Growth/condition and species archive | sourced `SpeciesProfile`, `GrowthModel` | mass ledger + measured datasets |
| P3 | Memory & learning | Design only | `Memory`, state/policy interface, experiment fixture | compare baseline vs learned, no black-box per fish |

### Trial stage vocabulary
DESIGN_REFERENCE → INTERACTIVE_PROTOTYPE → SOURCE_VERIFIED → TESTED → OWNER_APPROVED → INTEGRATED → RELEASED.
Each step needs an evidence link; never confuse genetic *toy inheritance* with biological correctness.
