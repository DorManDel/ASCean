/** Curated source-backed design register; mirrored in docs/DECISIONS.md. */
export const DECISIONS=[
 {id:'A-001',status:'accepted',topic:'Independent ASCean repository',why:'Protect the original ASCuarium and MobiLab; build an extensible standalone simulator.'},
 {id:'A-002',status:'accepted',topic:'One engine, two applications',why:'Mechanics Lab and Ocean Simulator should use the same engine systems after approval.'},
 {id:'A-004',status:'accepted',topic:'World owns state, systems own behavior',why:'Keep rendering, biology, physics and decision models replaceable.'},
 {id:'A-005',status:'accepted',topic:'Internal units: centimeters, seconds, grams',why:'Store numerical data consistently, format µg/mg/g/kg/t and cm/m for humans.'},
 {id:'A-006',status:'accepted',topic:'100m × 50m × 30m initial test world',why:'X horizontal, Y vertical, Z into the side camera. Water depth derives from Y, not Z.'},
 {id:'A-007',status:'accepted',topic:'Marine default; freshwater/brackish zones',why:'Species inhabit compatible environments; zebrafish are not native to seawater.'},
 {id:'A-009',status:'accepted',topic:'Biological Hybrid Growth',why:'Long-term age, genetics, nutrition, health and habitat—not a direct age-to-size slider.'},
 {id:'A-011',status:'accepted',topic:'Total body mass derived from physical compartments',why:'Structural tissues, reserves, gut and reproductive contents must not double-count mass.'},
 {id:'A-012',status:'accepted',topic:'Configurable biological clock',why:'Research can accelerate development without changing the render refresh rate.'},
 {id:'A-013',status:'accepted',topic:'Default avoidance with intentional contact',why:'Social/territorial/predatory motives can approach, but physical interpenetration needs resolution.'},
 {id:'A-014',status:'accepted',topic:'Species-specific reproduction',why:'Egg laying, livebearing and other strategies are not universal.'},
 {id:'A-016',status:'accepted',topic:'Preview → test → approve → Codex → PCM',why:'Do not equate a visually convincing animation with working simulation physics.'},
 {id:'P-001',status:'provisional',topic:'TypedArray SoA, Map lookup, sparse 3D grid',why:'A reasonable baseline, subject to population/device benchmarking.'},
 {id:'P-004',status:'provisional',topic:'16-bit saved-position quantization',why:'Snapshot-only candidate; validate precision, encoding and total memory.'},
 {id:'P-005',status:'provisional',topic:'Replaceable mass/thrust/drag physics strategy',why:'Start with dimensionally documented toy physics, calibrate before applying to species.'},
 {id:'O-001',status:'open',topic:'Mass composition and energy conservation',why:'Define material flows for growth, digestion, waste and reproduction.'},
 {id:'O-003',status:'open',topic:'Genetics: real loci vs simulated traits',why:'Preserve named trait metadata, inheritance model, evidence and mutation boundaries.'},
 {id:'O-005',status:'open',topic:'Habitat and water chemistry solvers',why:'Salinity, pH, temperature, oxygen, TAN, pressure, light and currents.'},
 {id:'O-006',status:'open',topic:'Collision shape, injury and healing',why:'Exact contact, swept movement, event targeting and region-specific damage need research.'},
 {id:'O-007',status:'open',topic:'Cognition, memory and learning',why:'Start with policy/drive state; controlled learning later, not an LLM per fish.'},
 {id:'O-008',status:'open',topic:'Performance and device targets',why:'Profile FPS, TPS, allocations, battery and numerical accuracy on target hardware.'}
];
export const DEV_CONTRACTS=[
 {id:'M0',title:'Foundation',status:'reference engine + browser demo',implemented:'Seeded XYZ WorldPrototype, IDs, SoA, grid and fixed-step reference.',missing:'Scientific force/drag, collision solver, bio metabolism and transferable production packages.',gate:'CI tests and UX review on dev branch.'},
 {id:'M1',title:'Initial ocean',status:'Codex task prepared',implemented:'One World owner and static route skeleton already exist.',missing:'Reusable TypeScript package modules, integrator, 3D motion and minimal event bus.',gate:'PR with tests showing same core in Lab and Ocean, not forked logic.'},
 {id:'M2',title:'Physics & contact',status:'prototype reference only',implemented:'Illustrative body mass, thrust, drag, proximity and avoidance previews.',missing:'Species-calibrated force laws, detection/resolution, body geometry, continuous contact.',gate:'Deterministic XYZ tests, conservation/invariant checks and on-device benchmarks.'},
 {id:'M3',title:'Behavior & mini habitats',status:'scripted vignettes only',implemented:'Mini test cells show proposed mating, waste, predator and social event flows.',missing:'Actual drives, food material ledger, environment fields, learned decisions.',gate:'Demonstrate independent repeated experiments at fixed tick with inspectable events.'},
 {id:'M4+',title:'Scientific ecosystem',status:'research backlog',implemented:'Prototypes and decision registry document concepts.',missing:'Evidence-backed FishDex, species physiology, growth, reproduction and genetics.',gate:'Source provenance, model uncertainty and validation datasets.'}
];
export const IMPLEMENTATION_PRINCIPLES=[
 'Every accepted mechanic is a reusable package with pure domain logic; Canvas is only a consumer.',
 'Use fixed ticks, seeded experiments, stable IDs and XYZ constraints; never tie behavior to monitor Hz.',
 'A mini-aquarium is a reproducible fixture. The Ocean imports approved logic, not a copy of the vignette.',
 'Record decision ID, units, source provenance, tests, benchmarks, and rollback in each PR.',
 'Mark speculative biology illustrative until species/strain/life stage and coefficients are sourced.',
 'Code review and owner approval are required before merging development into main and publishing.'
];
