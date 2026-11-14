/** Illustrative infrastructure only: no biological parameters or swimming solver. */
export type Vec3 = { x: number; y: number; z: number };
export type Entity = { id: number; position: Vec3; velocity: Vec3 };
export const EXTENTS: Readonly<Vec3> = Object.freeze({ x: 10000, y: 5000, z: 3000 });
const axes = ['x', 'y', 'z'] as const;
export type Snapshot = {
  schema: 1; engine: 'm0-1'; model: 'illustrative-reflection-1';
  units: 'cm,s,g'; extents: Vec3; seed: number; rng: number;
  tick: number; dt: number; bioScale: 1; bioSeconds: number;
  nextId: number; entities: Entity[];
};
function check(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message);
}
function uint(value: number) { return Number.isInteger(value) && value >= 0 && value <= 0xffffffff; }
function validEntity(entity: Entity) {
  check(Number.isSafeInteger(entity.id) && entity.id > 0, 'Invalid ID');
  for (const axis of axes) {
    check(Number.isFinite(entity.position?.[axis]) && entity.position[axis] >= 0 && entity.position[axis] <= EXTENTS[axis], 'Invalid position');
    check(Number.isFinite(entity.velocity?.[axis]) && Math.abs(entity.velocity[axis]) <= 10000, 'Invalid illustrative velocity');
  }
}

export class World {
  #entities: Entity[] = [];
  #slots = new Map<number, number>();
  #nextId = 1;
  #tick = 0;
  #rng: number;
  readonly seed: number;
  readonly dt: number;
  constructor(seed = 42, dt = 1 / 30) {
    check(uint(seed), 'Seed must be uint32');
    check(Number.isFinite(dt) && dt > 0 && dt <= 1, 'dt must be in (0,1] seconds');
    this.seed = seed; this.#rng = seed; this.dt = dt;
  }
  get tick() { return this.#tick; }
  get count() { return this.#entities.length; }
  get seconds() { return this.#tick * this.dt; }
  #random() {
    this.#rng = (Math.imul(1664525, this.#rng) + 1013904223) >>> 0;
    return this.#rng / 4294967296;
  }
  spawn(position: Vec3, velocity: Vec3): number {
    check(this.#nextId < Number.MAX_SAFE_INTEGER, 'ID allocator exhausted');
    const entity = structuredClone({ id: this.#nextId, position, velocity });
    validEntity(entity);
    this.#slots.set(entity.id, this.#entities.length);
    this.#entities.push(entity); this.#nextId++;
    return entity.id;
  }
  spawnTestEntity() {
    check(this.#nextId < Number.MAX_SAFE_INTEGER, 'ID allocator exhausted');
    return this.spawn({ x: 5000, y: 2500, z: 1500 }, {
      x: 100 + this.#random() * 100, y: 50 + this.#random() * 50, z: 25 + this.#random() * 50,
    });
  }
  remove(id: number) {
    const slot = this.#slots.get(id);
    check(slot !== undefined, 'Unknown entity');
    const last = this.#entities.pop()!;
    if (slot < this.#entities.length) { this.#entities[slot] = last; this.#slots.set(last.id, slot); }
    this.#slots.delete(id);
  }
  inspect(id: number): (Entity & { slot: number; tick: number }) | undefined {
    const slot = this.#slots.get(id);
    return slot === undefined ? undefined : structuredClone({ ...this.#entities[slot]!, slot, tick: this.#tick });
  }
  entities(): Entity[] { return structuredClone(this.#entities); }
  step() {
    check(this.#tick < Number.MAX_SAFE_INTEGER, 'Clock exhausted');
    for (const entity of this.#entities) for (const axis of axes) {
      const length = EXTENTS[axis];
      const unfolded = entity.position[axis] + entity.velocity[axis] * this.dt;
      const phase = ((unfolded % (2 * length)) + 2 * length) % (2 * length);
      entity.position[axis] = phase <= length ? phase : 2 * length - phase;
      if (phase === 0) entity.velocity[axis] = Math.abs(entity.velocity[axis]);
      else if (phase === length) entity.velocity[axis] = -Math.abs(entity.velocity[axis]);
      else if (phase > length) entity.velocity[axis] *= -1;
    }
    this.#tick++;
  }
  snapshot(): Snapshot {
    return { schema: 1, engine: 'm0-1', model: 'illustrative-reflection-1', units: 'cm,s,g',
      extents: { ...EXTENTS }, seed: this.seed, rng: this.#rng, tick: this.#tick,
      dt: this.dt, bioScale: 1, bioSeconds: this.seconds, nextId: this.#nextId, entities: this.entities() };
  }
  static restore(input: unknown): World {
    // Work on a detached temporary World. A failure never touches a running World.
    const s = structuredClone(input) as Snapshot;
    check(s && s.schema === 1 && s.engine === 'm0-1' && s.model === 'illustrative-reflection-1', 'Unsupported snapshot version');
    check(s.units === 'cm,s,g' && axes.every(a => s.extents?.[a] === EXTENTS[a]), 'Unsupported world units/extents');
    check(s.bioScale === 1 && s.bioSeconds === s.tick * s.dt, 'Unsupported biological clock');
    check(Number.isSafeInteger(s.tick) && s.tick >= 0 && uint(s.rng), 'Invalid clock/RNG');
    check(Number.isSafeInteger(s.nextId) && s.nextId > 0 && Array.isArray(s.entities), 'Invalid allocator/entities');
    const world = new World(s.seed, s.dt);
    for (const entity of s.entities) {
      validEntity(entity);
      check(entity.id < s.nextId && !world.#slots.has(entity.id), 'Duplicate ID or invalid allocator');
      world.#slots.set(entity.id, world.#entities.length); world.#entities.push(entity);
    }
    world.#tick = s.tick; world.#rng = s.rng; world.#nextId = s.nextId;
    return world;
  }
}

/** Wall time schedules fixed ticks; it never becomes simulation dt. */
export class Runner {
  #world: World;
  #paused = true;
  #accumulator = 0;
  droppedSeconds = 0;
  constructor(seed = 42) { this.#world = new World(seed); this.#world.spawnTestEntity(); }
  get world() { return this.#world; }
  get paused() { return this.#paused; }
  pause() { this.#paused = true; this.#accumulator = 0; }
  resume() { this.#paused = false; this.#accumulator = 0; }
  singleStep() { check(this.#paused, 'Pause before stepping'); this.#world.step(); }
  advance(seconds: number) {
    check(Number.isFinite(seconds) && seconds >= 0, 'Invalid wall duration');
    if (this.#paused) return 0;
    const budget = 8 * this.#world.dt;
    const total = this.#accumulator + seconds;
    this.droppedSeconds += Math.max(0, total - budget);
    this.#accumulator = Math.min(total, budget);
    let ticks = 0;
    while (this.#accumulator + 1e-12 >= this.#world.dt && ticks < 8) {
      this.#world.step(); this.#accumulator = Math.max(0, this.#accumulator - this.#world.dt); ticks++;
    }
    return ticks;
  }
  reset() { const next = new World(this.#world.seed, this.#world.dt); next.spawnTestEntity(); this.#world = next; this.pause(); this.droppedSeconds = 0; }
  restore(snapshot: unknown) { const next = World.restore(snapshot); this.#world = next; this.pause(); this.droppedSeconds = 0; }
}
