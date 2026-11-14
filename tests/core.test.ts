import { test } from 'node:test';
import assert from 'node:assert/strict';
import { World, Runner, EXTENTS } from '../packages/core/src/index';

test('stable IDs survive swap removal, detached inspection and input edits', () => {
  const w = new World(); const p = { x: 1, y: 2, z: 3 }, v = { x: 0, y: 0, z: 0 };
  const a = w.spawn(p, v), b = w.spawn(p, v), c = w.spawn(p, v);
  p.x = 999; w.remove(b);
  assert.equal(w.inspect(c)?.slot, 1); assert.equal(w.inspect(a)?.position.x, 1);
  w.inspect(c)!.position.x = 999;
  assert.equal(w.inspect(c)?.position.x, 1); assert.equal(w.inspect(b), undefined);
  assert.ok(w.spawn(p, v) > c); assert.throws(() => w.remove(b));
});
test('fixed XYZ motion matches a simple interior oracle and reflects each wall', () => {
  const w = new World(42, .5);
  const id = w.spawn({ x: 100, y: 200, z: 300 }, { x: 2, y: -4, z: 6 });
  w.step(); assert.deepEqual(w.inspect(id)?.position, { x: 101, y: 198, z: 303 });
  const edge = w.spawn({ ...EXTENTS }, { x: 10, y: 20, z: 30 });
  w.step(); assert.deepEqual(w.inspect(edge)?.position, { x: 9995, y: 4990, z: 2985 });
  assert.deepEqual(w.inspect(edge)?.velocity, { x: -10, y: -20, z: -30 });
  const fast = w.spawn({ x: 0, y: 0, z: 0 }, { x: -10000, y: -10000, z: -10000 });
  w.step(); assert.deepEqual(w.inspect(fast)?.position, { x: 5000, y: 5000, z: 1000 });
});
test('seed, pause, single step, reset and render schedules preserve deterministic state', () => {
  const a = new Runner(12), b = new Runner(12), initial = a.world.snapshot();
  for (let i = 0; i < 100; i++) a.advance(.1);
  assert.deepEqual(a.world.snapshot(), initial);
  a.singleStep(); assert.equal(a.world.tick, 1); a.reset();
  assert.deepEqual(a.world.snapshot(), initial);
  a.resume(); b.resume();
  for (let i = 0; i < 60; i++) a.advance(1 / 60);
  for (let i = 0; i < 20; i++) b.advance(1 / 20);
  assert.equal(a.world.tick, 30); assert.deepEqual(a.world.snapshot(), b.world.snapshot());
  assert.throws(() => a.singleStep());
  a.pause(); a.resume(); assert.equal(a.advance(0), 0);
  assert.equal(a.advance(10), 8); assert.ok(a.droppedSeconds > 9);
  assert.notDeepEqual(new Runner(13).world.snapshot(), initial);
});
test('JSON snapshot continuation includes PRNG, slot order, allocator and clocks', () => {
  const a = new World(0); a.spawnTestEntity(); a.spawnTestEntity(); a.remove(1);
  for (let i = 0; i < 100; i++) a.step();
  const b = World.restore(JSON.parse(JSON.stringify(a.snapshot())));
  for (let i = 0; i < 300; i++) { a.step(); b.step(); }
  assert.equal(a.spawnTestEntity(), b.spawnTestEntity());
  assert.deepEqual(a.snapshot(), b.snapshot());
});
test('invalid snapshots reject atomically and inspection cannot mutate snapshots', () => {
  const r = new Runner(); const initial = r.world.snapshot();
  const mutations = [
    (s: any) => s.schema = 2, (s: any) => s.engine = 'future',
    (s: any) => s.bioScale = 2, (s: any) => s.bioSeconds = 99,
    (s: any) => s.rng = -1, (s: any) => s.tick = 1.5,
    (s: any) => s.nextId = 1, (s: any) => s.entities.push(s.entities[0]),
    (s: any) => s.entities[0].position.x = NaN,
    (s: any) => s.entities[0].velocity.z = Infinity,
    (s: any) => s.extents.y = 1, (s: any) => s.dt = 0,
  ];
  for (const mutate of mutations) {
    const bad = structuredClone(initial); mutate(bad);
    assert.throws(() => r.restore(bad)); assert.deepEqual(r.world.snapshot(), initial);
  }
  assert.throws(() => r.restore(null));
  const exhausted = structuredClone(initial); exhausted.nextId = Number.MAX_SAFE_INTEGER;
  const w = World.restore(exhausted); const before = w.snapshot();
  assert.throws(() => w.spawnTestEntity()); assert.deepEqual(w.snapshot(), before);
});
test('invalid construction and spawn do not mutate authoritative state', () => {
  assert.throws(() => new World(-1)); assert.throws(() => new World(1, Infinity));
  const w = new World(); const before = w.snapshot();
  assert.throws(() => w.spawn({ x: -1, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }));
  assert.deepEqual(w.snapshot(), before);
});
