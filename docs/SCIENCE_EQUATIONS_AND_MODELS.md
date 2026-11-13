# ASCean · Equation & Biological Model Register

Date: 2026-11-13. Research notebook **only**; coefficients for named species require data, provenance and tests.
See [capability atlas](SCIENTIFIC_CAPABILITY_ATLAS.md) and [research/data pipeline](SPECIES_RESEARCH_PIPELINE.md).

## Coordinate/units contract

World: X horizontal right, Y vertical **up**, Z into screen. Sea-surface height Y_surface may vary. **Depth below surface**: h_m = max(0,(Y_surface_cm - Y_cm)/100). Never use Z for hydrostatic pressure or vertical sunlight attenuation.

Internal state may be cm/s/g, but physics equations are expressed in **SI units** for clarity and dimensional audit:
- x_m = x_cm / 100; v_m/s = v_cm/s / 100; a_cm/s² = 100 a_m/s².
- m_kg = m_g / 1000; V_m³ = V_cm³ / 1e6.
- Force N = kg m s⁻²; rho kg m⁻³; pressure Pa; energy J.
- Use types or suffixes to prohibit mixing Newtons/dynes, centimeters/meters and J/ergs.

## A. Rigid-body / locomotion starting equations

### M01. Linear mechanics (physical law)
F_net = F_thrust + F_drag + F_buoyancy + F_gravity + F_lift + F_contact + ...;
dv/dt = F_net / m_effective
dx/dt = v_world

Effective inertia/added mass can matter when water moves with the body; M1 must label any ordinary m-only baseline as simplified. Do not add forces without units.

### M02. Thrust, heading, drift (interface, not a calibrated propulsion formula)
v_rel = v_world - u_water(x,y,z,t)
F_thrust = T(state, motor, morphology) * heading_unit
Power ≈ F_thrust · v_rel where physically appropriate

**Heading is not velocity**: fish may be drifting sideways/backward in current while still facing forward. ASCII glyphs face heading and not sign(vx). Body/fin articulation must not abruptly flip 180 degrees with vx or a random state flag. Negative forward propulsion requires explicit species capability.

### M03. Quadratic drag in a defined flow regime (approximate model)
F_drag = -0.5 * rho_water * C_D * A_projected * |v_rel| * v_rel

This vector expression is dimensionally consistent (|v|v). C_D depends on Reynolds number, body pose and flow regime; A changes with geometry. At sufficiently small Re, viscous drag laws differ. Compare drag methods experimentally; no universal fish C_D.

### M04. Buoyancy / gravity (physical law, material model provisional)
F_buoyancy = rho_water * g * V_displaced * Y_up
F_gravity = -m * g * Y_up
F_vertical_net = (rho_water V_displaced - m)g + F_dynamic_lift,y + F_vertical_propulsion

Still water: neutral -> approximate hover, negative -> sink, positive -> rise. A neutrally buoyant animal in moving water drifts with that water if no relative velocity. An animal resting on seabed can be supported by contact force. Negative buoyancy does not imply "must always swim"; species can rest safely.

### M05. Swim bladder / depth (candidate approximation for gas-bearing fish only)
P_absolute(h)=P_surface + rho_water*g*h
P*V_gas ≈ constant when temperature and gas amount held fixed (Boyle's law), **not** a fixed species response.
Gas uptake/release, wall compliance and physiology need species-appropriate time-scale and calibration. Sharks do not have a teleost swim bladder.

### M06. Rotational dynamics / heading
tau = I * alpha; omega_next = clamp(omega + alpha*dt, -omega_max, omega_max)
orientation_next = normalize(orientation * rotation(omega*dt))

For M1, use a bounded-turn steering approximation with yaw/pitch and correct orientation; later model roll and hydrodynamic torque. Fish orientation changes continuously; swim direction and current-drift are distinct.

### M07. Dimensionless locomotor measures (research)
Re = rho * U * L / mu ; St = f * A_tail / U
f = tail-beat frequency; A_tail = peak-to-peak tail excursion by the cited definition; L body length; U water-relative swim speed.
Saadat et al. 2017 find efficient cruise clusters in studied swimmers at St about 0.2–0.4 together with A/L around 0.1–0.3; these are **empirical ranges, not a universal prescribed law**. St is undefined at U=0; code must handle near-zero U safely.
DOI: https://doi.org/10.1103/PhysRevFluids.2.083102
Swimming modes: https://doi.org/10.1109/48.757275

## B. Environment

### E01. Pressure (physical law, locally uniform density)
P(h) = P_surface + rho_water*g*h, h>=0, based on Y.
Hydrostatic gradients in stratified water should integrate rho(h) g dh.
NOAA: https://oceanservice.noaa.gov/facts/pressure.html

### E02. Light attenuation (physics-based optical model)
E_d(h,lambda) = E_d(0,lambda) * exp(-integral_0^h K_d(s,lambda) ds)
Constant K_d yields exp(-K_d h) as a homogeneous-water approximation; optical properties depend on spectrum, turbidity and water components.
Ocean optics source: https://ioccg.org/wp-content/uploads/2022/01/mobley-oceanicopticsbook.pdf
Do not equate low light with zero visibility or set one universal depth cutoff for all species.

### E03. Advection–diffusion–reaction (continuum model)
dC/dt + div(u_water * C) = div(D grad C) + Sources - Sinks + Reactions
Use for dissolved chemicals/nutrients/temperature analogues with correct units and conservation controls. First M2 might use analytical or uniform fixed fields; don't implement a full Navier–Stokes solver before test.

### E04. Temperature / salinity / oxygen / TAN
rho_water = rho(T,S,P), empirical equation of state with reference convention.
TAN is NH3 + NH4+ measured in suitable units. Toxic un-ionized NH3 fraction depends on pH, temperature, and salinity via equilibrium chemistry; species susceptibility differs. Do **not** use a hand-chosen universal toxic threshold or claim ammonia attracts fish.
Environment source: https://emodnet.ec.europa.eu/en/physics ; ammonia context https://www.epa.gov/caddis/ammonia

### E05. Water field interface
sample(XYZ,t) -> {u_water_mps, density_kg_m3, temperature_C, salinity, DO_mg_L, pH, TAN_mg_N_L, opticalAttenuation, pressurePa, habitatId}
Each sample includes provenance, valid range, missing-value status and timestamp. Never default unknown research data to a fabricated species measurement.

## C. Body growth, organism composition & physiology

### B01. Mass conservation / material ledger
M_total = M_structure + M_reserve_material + M_gut_contents + M_reproductive_contents (+ other non-overlapping stores)
Delta M_total = ingested matter - feces - excreted matter - other exported matter + exchange fluxes
Avoid double-counting tissue water and reserves. **Energy (J) is not mass (g)**. Reserve energy must map to reserve material through a documented composition/energy density assumption.

### B02. Length-weight relationship (empirical)
W = a * L^b
W wet mass, L explicitly identified SL or TL, units and population/season/sex/life-stage context mandatory. Useful for cross-check and priors; not a conservation law.
Meta-analysis: https://doi.org/10.1111/j.1439-0426.2006.00805.x

### B03. von Bertalanffy growth curve (empirical population model)
L(t) = L_inf*(1-exp(-K*(t-t0)))
A possible fit/benchmark for observed growth. Does not replace our **Biological Hybrid Growth** mechanics linking nutrition, stage, genes and environment.
FishBase discussion: https://www.fishbase.se/FishOnLine/English/FOL_BiodiversityAndMorphology.htm

### B04. Dynamic Energy Budget (DEB) (theory family, not one generic universal fish equation)
dE_reserve/dt = assimilation - mobilization
p_growth = kappa*p_mobilized - p_somatic_maintenance
p_reproduction = (1-kappa)*p_mobilized - p_maturity_maintenance
Actual models use stage-specific structure, reserve composition, maturity and temperature relationships; compare calibrated scientific models against observations before implementing.
Theory: https://doi.org/10.1111/j.1365-2656.2000.00448.x
Applied species example: https://doi.org/10.1016/j.ecolmodel.2020.109051
New multi-taxon ABM comparative: https://doi.org/10.1371/journal.pcbi.1013610

### B05. Food capture and digestion
Encounter/capture: conditioned on prey detection, heading/range, mouth aperture, diet and prey escape.
Gut change: gut_mass(t+dt)=gut_mass + swallowed_mass - absorbed_material - egested_feces - other outputs
Nutrients/water/energy have separate ledgers. Our recovered Food & Gut Anatomy reference uses 55% teaching absorption; it is **NOT** a calibrated species efficiency.
Existing visual: ../site/references/food-gut-anatomy.html

### B06. Respiration
Oxygen uptake and metabolic demand depend on species, body mass, water temp, activity and oxygen availability. Do not prescribe a single Q10 or scaling exponent for all animals. A shark requiring ram ventilation has different resting constraints than a nurse shark; air-breathing mammals require surface access.
Source: https://ocean.si.edu/ocean-life/sharks-rays/sharks

## D. Sensing, groups and ecology

### S01. Visibility and prey perception
Detection probability/range is a function of light at XYZ/time, optical attenuation/turbidity, prey angular size/contrast, sensory capability, fish heading and occlusion. A 3D grid only filters candidates, not what the fish "sees".
Relevant scientific implementation: https://doi.org/10.1371/journal.pcbi.1013610

### S02. Social movement
A baseline model may encode short-range repulsion, mid-range attraction and turning toward neighbors; calibrate with trajectory data and species-specific visual fields. Simple averaged alignment is **not guaranteed**: field experiments found complex speed and directional interactions among golden shiners.
Data-derived fish interaction: https://pmc.ncbi.nlm.nih.gov/articles/PMC3219116/
Collective agent model: https://jmvidal.cse.sc.edu/library/couzin02a.pdf

### S03. Predation / foraging (illustrative statistical model)
Holling Type II consumption = (a * N) / (1 + a*h*N) as a candidate functional response for population/resource processes, where a is attack/search rate and h handling time. It does **not** determine a single fish's body-region bite or make a predator strike infallible.

### S04. Individual decision policy (design, not a biological equation)
action* = argmax_{a in valid_actions} U(a | sensed_state, needs, memory, available_energy)
Utility/policy must be bounded, species-specific, deterministic under a fixed seed and expensive sensors scheduled at independent rates. An FSM can implement initial states: REST, EXPLORE, FORAGE, FEED, FLEE, SOCIALIZE, COURT, RECOVER. This is a programming strategy, not a claim about neural organization of fish.

### S05. Genetics and reproduction
Offspring traits from two parent allele pools only if genetic model, ploidy, locus mapping and phenotype rules have evidence. Our seeded synthetic Genome Lab demonstrates a **teaching inheritance mechanism**, not a verified real fish genotype-to-phenotype function. Nonsexual species and alternative reproductive modes require separate strategies.

## Acceptance tests and edge cases

Physics:
- F=0, no current, neutral buoyancy -> approximately no acceleration.
- Same fish in moving water with propulsion off -> advects; relative velocity relaxes toward local current.
- Negative buoyancy -> downward trend, except support/active lift.
- Positive buoyancy -> upward trend.
- Zero relative speed -> no NaN in quadratic drag or St.
- Low speed near the surface -> clamp without teleport; finite pressure and depth.
- A fish heading right in left-flow may move left **without** swapping mouth/tail.
- Backward swim must be an explicitly enabled propulsor mode; no "negative vx = reversed swimming" shortcut.
- No stable interpenetration of bodies; large dt requires swept tests or substeps.
- NaN/out-of-bounds, paused clock, contact with floor/reef, varying species sizes.
- Quaternion/angle turn bounds and zero-length direction vectors.

Biology:
- Eating moves material from world food to gut, not directly to mass or energy.
- Egestion reduces gut and adds world detritus.
- No body mass created during spawning; transfer parent reproductive material to eggs/offspring with accounted exchanges.
- Visual child genes deterministic under seed; scientifically unvalidated tags visible.
- Dark/low oxygen/cold water lead to scenario-dependent effects, not instant universal death.

## Gate to promote a model to "calibrated"

1. Model ID + paper/DOI + source dataset/license.
2. Taxon ID, sex, life stage, habitat, environmental range, length measure, units.
3. Reproducible fitting procedure and uncertainty/error envelope.
4. Holdout comparison against observed trajectory/growth/energetics.
5. Regression/performance tests on desktop and real phone.
6. Dated review, approved decision and PCM checkpoint.

Unvalidated values are NEVER silently stored as scientific defaults.
