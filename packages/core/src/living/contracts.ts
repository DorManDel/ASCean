import type { Vec3 } from '../index';
export type { Vec3 };
export type Evidence = 'source_verified' | 'calibrated' | 'illustrative' | 'proposed' | 'unknown';
export type HabitatKind = 'marine' | 'brackish' | 'freshwater';
export type Habitat = { name: string; kind: HabitatKind; temperatureC: number; salinityPsu: number; oxygenMgL: number; turbidity: number; surfaceY: number; densityKgM3: number; surfaceLight: number; attenuationPerM: number; current: Vec3 };
export type Parameters = { speed: number; acceleration: number; turnRate: number; visionRange: number; fovDegrees: number; passive: boolean };
export type ExperimentDefinition = { schema: 1; model: 'living-1'; runId: string; seed: number; count: number; species: 'forager' | 'cruiser'; habitat: Habitat; parameters: Parameters; motion: 'steering' | 'reflection' };
export type Stimulus = { id: number; kind: 'food' | 'fish'; position: Vec3; distanceCm: number; channel: 'vision' };
export type Perception = { tick: number; candidates: number; detected: Stimulus[]; rejected: { id: number; reason: 'range' | 'outside FOV' | 'occluded' | 'dark' }[] };
export type Fish = { id: number; species: 'forager' | 'cruiser'; habitatKind: HabitatKind; position: Vec3; heading: Vec3; desired: Vec3; swimVelocity: Vec3; waterDrift: Vec3; worldVelocity: Vec3; gutG: number; structuralG: number; reserveG: number; capacityG: number; goal: string; target: number | null; perceived: Perception; pathCm: number; collisions: number; firstFoodTick: number | null };
export type Food = { id: number; position: Vec3; quantityG: number; kind: 'pellet' };
export type Obstacle = { id: number; position: Vec3; radiusCm: number };
export type Action =
 | { type: 'addFood'; position: Vec3; quantityG: number }
 | { type: 'addFish'; position: Vec3; species: 'forager' | 'cruiser' }
 | { type: 'addObstacle'; position: Vec3; radiusCm: number }
 | { type: 'move'; id: number; position: Vec3 }
 | { type: 'remove'; id: number }
 | { type: 'current'; velocity: Vec3 }
 | { type: 'parameters'; value: Parameters };
export type UserCommand = { schema: 1; runId: string; tick: number; sequence: number; action: Action };
export type SimulationEvent = { schema: 1; tick: number; type: 'command' | 'decision' | 'ingest' | 'contact'; entityId?: number; detail: string; amountG?: number };
export type Observation = { schema: 1; tick: number; fishId: number; position: Vec3; goal: string; detected: number[]; gutG: number; pathCm: number; status: 'sampled' };
export type Snapshot = { schema: 1; model: 'living-1'; definition: ExperimentDefinition; tick: number; rng: number; nextId: number; sequence: number; fish: Fish[]; food: Food[]; obstacles: Obstacle[]; foodInputG: number; foodOutputG: number; events: SimulationEvent[]; observations: Observation[]; discardedEvents: number; discardedObservations: number };
export type ExperimentResult = { schema: 1; initial: Snapshot; commands: UserCommand[]; final: Snapshot; metrics: { status: 'modeled'; reached: number; latencySeconds: number | null; pathCm: number; collisions: number; foodBalanceErrorG: number }; note: string };
export interface SensorChannel { readonly name: 'vision' | 'lateral-line' | 'hearing' | 'chemical' | 'touch' | 'physiology'; readonly status: 'implemented' | 'unavailable'; }
export const SENSORS: readonly SensorChannel[] = [{ name: 'vision', status: 'implemented' }, ...(['lateral-line','hearing','chemical','touch','physiology'] as const).map(name => ({ name, status: 'unavailable' as const }))];
