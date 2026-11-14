import { World } from '../packages/core/src/index';
import { cpus, platform, release } from 'node:os';
console.log(JSON.stringify({ node: process.version, os: `${platform()} ${release()}`, cpu: cpus()[0]?.model }));
for (const count of [1, 100, 1000]) {
  const w = new World(); for (let i = 0; i < count; i++) w.spawnTestEntity();
  for (let i = 0; i < 100; i++) w.step();
  const samples: number[] = [];
  for (let i = 0; i < 1000; i++) { const t = performance.now(); w.step(); samples.push(performance.now() - t); }
  samples.sort((a, b) => a - b);
  console.log(JSON.stringify({ count, warmupTicks: 100, measuredTicks: 1000, medianMs: samples[500], p95Ms: samples[950], snapshotBytes: Buffer.byteLength(JSON.stringify(w.snapshot())), processHeapBytes: process.memoryUsage().heapUsed }));
}
