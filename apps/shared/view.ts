import { EXTENTS, Runner } from '@ascean/core';
import './view.css';

export function mount(root: HTMLElement, runner: Runner, title: string) {
  root.innerHTML = `
    <nav><a href="../../">Home</a><a href="../../ocean/foundation/">Ocean foundation</a><a href="../../lab/foundation/">Lab foundation</a><a href="../">Reference demos</a></nav>
    <h1>${title} · M0 Foundation</h1>
    <p>Illustrative constant XYZ motion · shared TypeScript runtime · no calibrated biology.</p>
    <div class="layout"><section><canvas width="1000" height="500" aria-label="ASCII test entity in XY projection"></canvas>
    <div class="controls"><button id="play">Resume</button><button id="step">Single step</button><button id="reset">Reset seed</button><button id="select">Select test entity</button></div>
    <p id="clock"></p><p id="telemetry"></p></section>
    <section><h2>Authoritative inspection</h2><pre id="inspection">Select the entity.</pre>
    <p>X right, Y up, Z into screen. Water depth = surface Y − Y; Z is physical camera depth. All positions: cm; velocities: cm/s.</p>
    <p>Species, anatomy, genetics and biological rates: unavailable.</p></section></div>
    <section><h2>Versioned snapshot</h2><p>Save, step, restore and repeat. Restore pauses at the saved tick. Reset reproduces seed 42.</p>
    <div class="controls"><button id="save">Save snapshot</button><button id="restore">Restore snapshot</button><button id="compare">Check 60-tick replay</button></div>
    <label for="snapshot">Simulation state (JSON)</label><textarea id="snapshot" rows="8" spellcheck="false"></textarea><p id="message" role="status"></p></section>
    <details><summary>Source → Evidence → Interactive View → Test → Review → Publish</summary>
    <p>Source: packages/core/src/index.ts. Decisions A-002–006, A-012; provisional implementation choices are recorded in docs/decisions/M0-IMPLEMENTATION.md. Evidence: deterministic regression tests, not scientific validation. Owner review and publication pending.</p>
    <p>Lab experiment: select the entity, single-step, observe all three coordinates; save, step and restore. The replay check compares complete snapshots at equal ticks. Browser timings below are measured; they exclude GPU cost and do not establish scaling capacity.</p></details>`;
  const el = <T extends HTMLElement>(id: string) => root.querySelector<T>(`#${id}`)!;
  const canvas = root.querySelector('canvas')!;
  const context = canvas.getContext('2d')!;
  const scope = new AbortController();
  let selected: number | undefined;
  let last = performance.now(), meter = last, frames = 0, ticks = 0, updateMs = 0, renderMs = 0;
  let frame = 0;
  function paint() {
    context.fillStyle = '#061b29'; context.fillRect(0, 0, canvas.width, canvas.height);
    context.font = '24px monospace'; context.textAlign = 'center'; context.fillStyle = '#83f5d0';
    for (const e of runner.world.entities()) {
      context.globalAlpha = 1 - .6 * e.position.z / EXTENTS.z;
      context.fillText(e.velocity.x < 0 ? '<o)))><' : '><(((o>',
        55 + e.position.x / EXTENTS.x * 890, 30 + (1 - e.position.y / EXTENTS.y) * 440);
    }
    context.globalAlpha = 1;
    el('clock').textContent = `${runner.paused ? 'Paused' : 'Running'} · Tick ${runner.world.tick} · ${runner.world.seconds.toFixed(3)} s · Seed ${runner.world.seed}`;
    el('play').textContent = runner.paused ? 'Resume' : 'Pause';
    el<HTMLButtonElement>('step').disabled = !runner.paused;
    const entity = selected === undefined ? undefined : runner.world.inspect(selected);
    if (!entity) selected = undefined;
    el('inspection').textContent = entity ? JSON.stringify(entity, null, 2) : 'Select the entity.';
  }
  function action(id: string, fn: () => void) {
    el(id).addEventListener('click', () => {
      try { fn(); paint(); } catch (error) { el('message').textContent = `Rejected: ${(error as Error).message}`; }
    }, { signal: scope.signal });
  }
  action('play', () => { runner.paused ? runner.resume() : runner.pause(); last = performance.now(); });
  action('step', () => runner.singleStep());
  action('reset', () => { runner.reset(); selected = undefined; });
  action('select', () => { selected = runner.world.entities()[0]?.id; });
  canvas.addEventListener('click', event => {
    const rect = canvas.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width * 1000;
    const y = (event.clientY - rect.top) / rect.height * 500;
    selected = runner.world.entities().find(e => Math.abs(x - (55 + e.position.x / EXTENTS.x * 890)) < 65 && Math.abs(y - (30 + (1 - e.position.y / EXTENTS.y) * 440)) < 30)?.id;
    paint();
  }, { signal: scope.signal });
  action('save', () => { el<HTMLTextAreaElement>('snapshot').value = JSON.stringify(runner.world.snapshot(), null, 2); el('message').textContent = 'Snapshot saved locally in this text area.'; });
  action('restore', () => { runner.restore(JSON.parse(el<HTMLTextAreaElement>('snapshot').value)); last = performance.now(); el('message').textContent = 'Restored and paused.'; });
  action('compare', () => {
    const initial = runner.world.snapshot();
    // Both branches call the authoritative runtime, never a Lab-specific solver.
    const a = new Runner();
    const b = new Runner();
    a.restore(initial); b.restore(initial);
    for (let i = 0; i < 60; i++) a.singleStep();
    for (let i = 0; i < 30; i++) b.singleStep();
    b.restore(JSON.parse(JSON.stringify(b.world.snapshot())));
    for (let i = 0; i < 30; i++) b.singleStep();
    el('message').textContent = JSON.stringify(a.world.snapshot()) === JSON.stringify(b.world.snapshot()) ? 'PASS: complete 60-tick replay matches restored continuation.' : 'FAIL: replay differs.';
  });
  function render(now: number) {
    const start = performance.now(); ticks += runner.advance(Math.max(0, (now - last) / 1000));
    updateMs += performance.now() - start;
    const renderStart = performance.now(); paint(); renderMs += performance.now() - renderStart;
    last = now; frames++;
    if (now - meter >= 1000) {
      const seconds = (now - meter) / 1000;
      el('telemetry').textContent = `${(frames / seconds).toFixed(1)} FPS · ${(ticks / seconds).toFixed(1)} TPS · update ${(updateMs / frames).toFixed(3)} ms/frame · draw + inspection ${(renderMs / frames).toFixed(3)} ms/frame · dropped ${runner.droppedSeconds.toFixed(3)} wall s`;
      meter = now; frames = ticks = updateMs = renderMs = 0;
    }
    frame = requestAnimationFrame(render);
  }
  paint(); frame = requestAnimationFrame(render);
  const dispose = () => { cancelAnimationFrame(frame); scope.abort(); };
  window.addEventListener('pagehide', dispose, { once: true, signal: scope.signal });
  return dispose;
}
