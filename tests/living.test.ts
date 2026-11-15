import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Trial,LivingWorld,definition,DT,BOUNDS,vision,policy,dot,length,sub,distance,sampleWater,habitat,exportCsv,parseTrial,readReviewedFinding,meter} from '../packages/core/src/living';

test('same seed and commands reproduce complete state across render schedules',()=>{
  const a=new Trial(),b=new Trial();for(const t of [a,b]){t.command({type:'addFood',position:{x:340,y:250,z:150},quantityG:.3});t.resume();}
  for(let i=0;i<600;i++)a.advance(1/60);for(let i=0;i<200;i++)b.advance(1/20);
  assert.equal(a.world.tick,300);assert.deepEqual(a.world.snapshot(),b.world.snapshot());
  a.pause();const before=a.world.snapshot();a.advance(10);assert.deepEqual(a.world.snapshot(),before);a.step();assert.equal(a.world.tick,301);
});
test('food is reached causally, transferred into gut, and deterministic JSON/CSV replay succeeds',()=>{
  const t=new Trial();t.command({type:'addFood',position:{x:340,y:250,z:150},quantityG:.3});
  for(let i=0;i<600;i++)t.step();
  assert.equal(t.world.metrics().reached,1);assert.ok(t.world.inspect(1)!.gutG>.29);
  assert.ok(Math.abs(t.world.metrics().foodBalanceErrorG)<1e-10);
  assert.ok(t.world.snapshot().events.some(e=>e.type==='ingest'));
  for(const text of [JSON.stringify(t.result()),exportCsv(t.result())])assert.deepEqual(Trial.replay(parseTrial(text)).world.snapshot(),t.world.snapshot());
  const bad=t.result();bad.final.fish[0]!.position.x+=1;assert.throws(()=>Trial.replay(bad),/mismatch/);
});
test('candidate search does not grant vision: FOV, XYZ range, occlusion, light',()=>{
  const t=new Trial();const d=t.world.snapshot().definition,f=t.world.inspect(1)!;f.heading={x:1,y:0,z:0};
  const food={id:20,position:{x:250,y:250,z:150},quantityG:1,kind:'pellet' as const};
  const observe=(item=food,obstacles:any[]=[],h=d.habitat)=>vision(f,[f],[item],obstacles,h,d.parameters,0);
  assert.equal(observe().detected.length,1);
  assert.equal(observe({...food,position:{x:50,y:250,z:150}}).rejected[0]?.reason,'outside FOV');
  assert.equal(observe(food,[{id:21,position:{x:200,y:250,z:150},radiusCm:20}]).rejected[0]?.reason,'occluded');
  assert.equal(observe(food,[],{...d.habitat,surfaceLight:0}).rejected[0]?.reason,'dark');
  assert.equal(observe({...food,position:{x:250,y:250,z:1000}}).detected.length,0);
  assert.equal(observe(food,[],{...d.habitat,turbidity:10}).rejected[0]?.reason,'range');
});
test('hidden food cannot enter policy; moving visible food changes action',()=>{
  const a=new Trial(),b=new Trial();b.command({type:'addFood',position:{x:50,y:250,z:150},quantityG:1});a.step();b.step();
  for(const key of ['goal','target','heading','swimVelocity','position'] as const)assert.deepEqual(a.world.inspect(1)![key],b.world.inspect(1)![key]);
  const t=new Trial();t.command({type:'addFood',position:{x:340,y:280,z:150},quantityG:.3});t.step();const first=t.world.inspect(1)!;
  t.command({type:'move',id:2,position:{x:340,y:220,z:150}});t.step();const second=t.world.inspect(1)!;
  assert.ok(first.desired.y>0);assert.ok(second.desired.y<0);
  assert.equal(policy(first,[]).target,null);
});
test('bounded heading and water-relative acceleration; heading agrees with swim velocity',()=>{
  const t=new Trial();t.command({type:'addFood',position:{x:340,y:350,z:180},quantityG:1});
  for(let i=0;i<300;i++){
    const a=t.world.inspect(1)!;t.step();const b=t.world.inspect(1)!;
    assert.ok(Math.acos(Math.max(-1,Math.min(1,dot(a.heading,b.heading))))<=2*DT+1e-7);
    assert.ok(length(sub(b.swimVelocity,a.swimVelocity))<=60*DT+1e-7);
    if(length(b.swimVelocity)>1e-8)assert.ok(dot(b.heading,b.swimVelocity)>0);
    for(const axis of ['x','y','z'] as const)assert.ok(b.position[axis]>=6&&b.position[axis]<=BOUNDS[axis]-6);
  }
});
test('passive current changes displacement without reversing body heading',()=>{
  const t=new Trial();t.command({type:'parameters',value:{...definition().parameters,passive:true}});t.command({type:'current',velocity:{x:-20,y:0,z:0}});
  const before=t.world.inspect(1)!;t.step();const after=t.world.inspect(1)!;
  assert.ok(Math.abs(after.position.x-before.position.x+20*DT)<1e-9);assert.deepEqual(after.heading,before.heading);assert.equal(after.swimVelocity.x,0);
  assert.equal(after.waterDrift.x,-20);assert.ok(after.worldVelocity.x<0);
});
test('stable IDs, command validation, atomic rejection and detach protect World',()=>{
  const t=new Trial(definition(42,2));t.command({type:'remove',id:1});assert.equal(t.world.inspect(2)?.id,2);
  t.command({type:'addFish',position:{x:400,y:200,z:150},species:'cruiser'});assert.equal(t.world.inspect(3)?.id,3);
  const before=t.world.snapshot();t.world.inspect(2)!.position.x=999;assert.deepEqual(t.world.snapshot(),before);
  assert.throws(()=>t.command({type:'move',id:2,position:{x:Infinity,y:0,z:0}}));assert.deepEqual(t.world.snapshot(),before);
  assert.throws(()=>t.world.command({schema:1,runId:'stale',sequence:2,tick:0,action:{type:'remove',id:2}}));
  assert.throws(()=>t.command({type:'remove',id:999}));assert.deepEqual(t.world.snapshot(),before);
});
test('snapshot continuation preserves allocator, RNG, policies and observations',()=>{
  const t=new Trial();t.command({type:'addFood',position:{x:340,y:250,z:150},quantityG:.3});for(let i=0;i<50;i++)t.step();
  const restored=LivingWorld.restore(t.world.snapshot());for(let i=0;i<100;i++){restored.step();t.step();}
  assert.deepEqual(restored.snapshot(),t.world.snapshot());
  const c={schema:1 as const,runId:'trial-42',tick:150,sequence:1,action:{type:'addFish' as const,position:{x:500,y:300,z:100},species:'forager' as const}};
  restored.command(c);t.world.command(c);assert.deepEqual(restored.snapshot(),t.world.snapshot());
  for(const mutate of [(s:any)=>s.schema=2,(s:any)=>s.fish[0].heading.x=NaN,(s:any)=>s.foodInputG=100,(s:any)=>s.fish.push(s.fish[0]),(s:any)=>s.definition.habitat.kind='desert']){
    const bad=restored.snapshot();mutate(bad);assert.throws(()=>LivingWorld.restore(bad));
  }
});
test('food competition cannot duplicate mass; removals are explicit external exports',()=>{
  const t=new Trial(definition(7,2));t.command({type:'move',id:1,position:{x:150,y:240,z:150}});t.command({type:'move',id:2,position:{x:150,y:260,z:150}});
  t.command({type:'addFood',position:{x:170,y:250,z:150},quantityG:.1});
  for(let i=0;i<300;i++)t.step();assert.ok(t.world.gutMassG<=.1+1e-10);assert.ok(Math.abs(t.world.metrics().foodBalanceErrorG)<1e-10);
  t.command({type:'remove',id:1});assert.ok(Math.abs(t.world.metrics().foodBalanceErrorG)<1e-10);
});
test('swept obstacle contact prevents penetration and eating through geometry',()=>{
  const t=new Trial();t.command({type:'addObstacle',position:{x:210,y:250,z:150},radiusCm:20});t.command({type:'addFood',position:{x:260,y:250,z:150},quantityG:1});
  t.step();assert.equal(t.world.inspect(1)?.target,null);assert.equal(t.world.gutMassG,0);
  t.command({type:'parameters',value:{...definition().parameters,passive:true}});t.command({type:'current',velocity:{x:100,y:0,z:0}});
  for(let i=0;i<100;i++)t.step();assert.ok(distance(t.world.inspect(1)!.position,{x:210,y:250,z:150})>=26-1e-8);
});
test('water uses Y depth, compatible habitats and explicit scale limits',()=>{
  const h=habitat();const a=sampleWater(h,{x:0,y:400,z:0}),b=sampleWater(h,{x:0,y:400,z:299}),c=sampleWater(h,{x:0,y:300,z:0});
  assert.equal(a.pressurePa,b.pressurePa);assert.ok(c.pressurePa>a.pressurePa);
  assert.ok(Math.abs(c.pressurePa-a.pressurePa-h.densityKgM3*9.80665)<1e-7);
  for(const name of ['shallow marine','deep marine','brackish','freshwater'])assert.doesNotThrow(()=>new Trial(definition(42,10,name)));
  const d=definition();d.habitat.kind='freshwater';assert.throws(()=>new Trial(d));
});
test('pause-on-ingest and bounded history do not lose accepted replay commands',()=>{
  const t=new Trial();t.command({type:'addFood',position:{x:158,y:250,z:150},quantityG:.3});t.pauseOnIngest=true;t.resume();t.advance(.2);
  assert.equal(t.paused,true);assert.equal(t.world.tick,1);
  for(let i=0;i<520;i++)t.command({type:'current',velocity:{x:0,y:0,z:0}});
  assert.equal(t.world.snapshot().events.length,512);assert.ok(t.world.snapshot().discardedEvents>0);assert.equal(t.result().commands.length,521);
  assert.deepEqual(Trial.replay(t.result()).world.snapshot(),t.world.snapshot());
});
test('Research Factory boundary rejects drafts and executable coefficient payloads',()=>{
  const input={schema:1,id:'test-reviewed',kind:'finding',evidence:'illustrative',review:{status:'approved',reviewer:'fixture reviewer',date:'2026-11-15'},claim:'metadata-only fixture',sourceUrl:'https://example.org/paper',doi:null,species:'unspecified',lifeStage:'unspecified',habitat:'unknown',units:'none',license:'unknown: no asset import',uncertainty:'not calibrated',calibrationTest:'required before implementation',implementationRef:null};
  const r=readReviewedFinding(input);assert.ok(Object.isFrozen(r));assert.ok(Object.isFrozen(r.review));
  assert.throws(()=>readReviewedFinding({...input,review:{...input.review,status:'draft'}}));assert.throws(()=>readReviewedFinding({...input,coefficients:{speed:999}}));
});
test('meter compares same seeded fixture without claiming empirical validation',()=>{
  const rows=meter([42],600);assert.equal(rows.length,2);assert.equal(rows[1]!.metrics.reached,1);assert.equal(rows[0]!.mode,'reflection');assert.equal(rows[1]!.cpuStatus,'measured');
});
test('committed trial fixture replays, and visible competitors change policy without hidden senses',()=>{
  const result=JSON.parse(readFileSync('tests/fixtures/living-seed42.json','utf8'));
  assert.equal(Trial.replay(result).world.metrics().reached,1);
  const f=new Trial().world.inspect(1)!;
  assert.equal(policy(f,[{id:2,kind:'fish',position:{x:170,y:250,z:150},distanceCm:20,channel:'vision'}]).goal,'avoid visible neighbor');
  const s=new Trial(definition(42,2)).world.snapshot();s.fish[1]!.position={...s.fish[0]!.position};assert.throws(()=>LivingWorld.restore(s),/penetrating/);
});
