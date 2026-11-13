# Planned mechanics catalog (design reference)

| Topic | Present status | Mechanic / experiment |
|---|---|---|
| World storage | M0 source code | Dense SoA, fixed capacity, stable ID mapping, swap-and-remove |
| Time | M0 source code | Fixed tick; configurable *biological* clock is future |
| Spatial search | M0 source code | Sparse 3D cells, spherical neighbor checks; benchmarks open |
| Display | M0 source code | 2D side-view XY, Z alpha/color; future ASCII glyph atlas |
| Physics | Proposed | Body mass → inertia/force, water drag, buoyancy, pressure |
| Contact | Proposed | 3D detection, avoidance, controlled engagement, overlap resolution |
| Habitat | Proposed | Salinity/pH/oxygen/TAN/temperature/current/light probe with species tolerance |
| Sensing | Proposed | Eye sight, chemical field, lateral line, different dynamic ranges |
| Food web | Proposed | Food resource as physical matter; species diet; detritus as possible food for qualified feeders |
| Metabolism | Proposed | Energy budget, reserves, gut contents, nutrient uptake and waste |
| Growth | Approved direction only | Biological hybrid growth, SL/TL, structural size vs nutritional condition |
| Anatomy | Research preview only | Organ and fin dimensions, site-specific injury and severity, eventual visual ASCII mask |
| Reproduction | Proposed | Egg laying/livebearing and species-specific developmental stages |
| Genetics | Research preview only | Source-grounded genes/phenotype plus explicitly simulated heritable traits |
| FishDex | Proposed | Species encyclopedia, references and small independent aquarium demo |
| Adaptive AI | Proposed | Needs, states, strategy, memory, learnable policy in controlled tests |
| Performance | Measured CI tests only | Numeric footprint, all-pairs vs grid timing, scalable rendering; no 1M claim |

"Proposed" must never be described as working software. Research illustration must not be described as scientifically validated.
