# Scientific integrity, sources and calibration

**Principle:** ASCean should become biologically informative, but the fact that a mechanism is animated does not make its model scientifically valid.

## Evidence levels
- **source_verified:** specific statement or parameter traceable to a named source/publication.
- **calibrated:** model fit to a named dataset, with units, assumptions, residuals and domain.
- **runtime_tested:** implementation behavior observed in a controlled test; not a biological validation.
- **illustrative:** educational/test values used to show mechanics.
- **proposed/unknown:** not yet validated.

Each species parameter needs: species/taxon ID, measurement definition (SL vs TL), unit, reference, conditions (temp/salinity/life stage), scope/confidence, version and fallback behavior. Avoid implying observed fish genomes automatically generate color/behavior/size.

## Sources to start from (not imported datasets)
- [ZFIN](https://zfin.org/) — zebrafish genome, phenotype, anatomy and research links.
- [Ensembl](https://www.ensembl.org/) — genomic annotation resources.
- [FishBase](https://www.fishbase.se/) — species biology/ecology; check data licensing and attribution before reuse.
- [NOAA Ocean Service](https://oceanservice.noaa.gov/) — depth, ocean/light/pressure background.
- [US EPA aquatic ammonia](https://www.epa.gov/caddis/ammonia) — context on ammonia water quality.
- Peer-reviewed species papers and original datasets, with citations preserved.

## Material and energy budgets
Mass (g) ≠ energy. Total body wet mass is derived from *nonoverlapping* physical components: tissue + reserves + digestive contents + reproductive contents and anything else explicitly defined. Store a cached total only with invalidation tests. Nitrogen waste and feces affect the environment; detritus can feed appropriate species. Growth must account for energy/available matter; reproductive outputs must transfer mass from parent stores rather than creating it.

## Physical dimensions and water
- Default in-world units: cm, s, g. \`bodyMassG\` can represent microgram–tonne range numerically, but precision and meaningful fish-specific scales require benchmark/validation.
- Pressure \`Pabs = Psurface + rho*g*h\` with \`h\` the vertical submerged depth, not the Z-coordinate viewed from the side. Explicitly convert CGS world units to SI when using SI physical constants.
- Light depends on spectral attenuation, surface illumination and water properties; pressure, temperature and oxygen affect fish differently by species/life stage.
- Zebrafish is freshwater; it belongs in a suitable research habitat, not the default saltwater mix. Clownfish and deep-water species need different profiles/regions.

## Quantization and performance experiments
Test Float32, fixed-point and quantized snapshot values using min/max/error and real encode/decode time. 8/12/16-bit encoding requires explicit range and careful bit packing. Runtime memory = arrays + indexes + registries + graphics + overhead, not just bytes/fish.

## Research readiness gate
No "validated scientific simulator" language until experiments match reliable real-world observations under documented conditions and independent review. Build realistic foundations and make uncertainty inspectable.
