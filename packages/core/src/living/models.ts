import type { Vec3, Habitat, Parameters, ExperimentDefinition, Fish, Food, Obstacle, Perception } from './contracts';
export const BOUNDS = Object.freeze({ x: 1000, y: 500, z: 300 });
export const DT = 1 / 30;
export const ZERO = (): Vec3 => ({ x: 0, y: 0, z: 0 });
export const add = (a: Vec3, b: Vec3): Vec3 => ({ x:a.x+b.x,y:a.y+b.y,z:a.z+b.z });
export const sub = (a: Vec3, b: Vec3): Vec3 => ({ x:a.x-b.x,y:a.y-b.y,z:a.z-b.z });
export const scale = (a: Vec3, n: number): Vec3 => ({ x:a.x*n,y:a.y*n,z:a.z*n });
export const dot = (a: Vec3, b: Vec3) => a.x*b.x+a.y*b.y+a.z*b.z;
export const length = (a: Vec3) => Math.hypot(a.x,a.y,a.z);
export const unit = (a: Vec3): Vec3 => length(a) > 1e-12 ? scale(a,1/length(a)) : { x:1,y:0,z:0 };
export const distance = (a: Vec3,b: Vec3) => length(sub(a,b));
export const clamp = (n: number, lo: number, hi: number) => Math.max(lo,Math.min(hi,n));
export function turn(from: Vec3, to: Vec3, maxAngle: number): Vec3 {
  const angle=Math.acos(clamp(dot(from,to),-1,1));
  if(angle<=maxAngle) return {...to};
  let tangent=sub(to,scale(from,dot(from,to)));
  if(length(tangent)<1e-9) tangent=Math.abs(from.y)<.9 ? sub({x:0,y:1,z:0},scale(from,from.y)) : sub({x:0,y:0,z:1},scale(from,from.z));
  return unit(add(scale(from,Math.cos(maxAngle)),scale(unit(tangent),Math.sin(maxAngle))));
}
export function segmentDistance(a: Vec3,b: Vec3,c: Vec3) {
  const ab=sub(b,a), t=clamp(dot(sub(c,a),ab)/(dot(ab,ab)||1),0,1);
  return distance(add(a,scale(ab,t)),c);
}
export function habitat(name='shallow marine'): Habitat {
  const kind = name==='freshwater' ? 'freshwater' : name==='brackish' ? 'brackish' : 'marine';
  return {name,kind,temperatureC:name==='deep marine'?8:24,salinityPsu:kind==='marine'?35:kind==='brackish'?15:0,
    oxygenMgL:7,turbidity:0,surfaceY:BOUNDS.y+(name==='deep marine'?30000:0),densityKgM3:kind==='freshwater'?1000:1025,
    surfaceLight:1,attenuationPerM:name==='deep marine'?.005:.05,current:ZERO()};
}
export const DEFAULT_PARAMETERS: Parameters = {speed:45,acceleration:60,turnRate:2,visionRange:320,fovDegrees:140,passive:false};
export function definition(seed=42,count=1,name='shallow marine'): ExperimentDefinition {
  return {schema:1,model:'living-1',runId:`trial-${seed}`,seed,count,species:'forager',habitat:habitat(name),parameters:{...DEFAULT_PARAMETERS},motion:'steering'};
}
export function sampleWater(h: Habitat,p: Vec3) {
  const depthM=Math.max(0,h.surfaceY-p.y)/100;
  return { depthM, pressurePa:101325+h.densityKgM3*9.80665*depthM,temperatureC:h.temperatureC,salinityPsu:h.salinityPsu,
    oxygenMgL:h.oxygenMgL,turbidity:h.turbidity,light:h.surfaceLight*Math.exp(-h.attenuationPerM*depthM),current:{...h.current},status:'illustrative' as const };
}
/** Candidate distance alone never grants perception. No camera inputs. */
export function vision(f: Fish,fish: readonly Fish[],food: readonly Food[],obstacles: readonly Obstacle[],h: Habitat,p: Parameters,tick: number): Perception {
  const out: Perception={tick,candidates:0,detected:[],rejected:[]};
  const light=sampleWater(h,f.position).light;
  const range=p.visionRange/(1+h.turbidity);
  for(const item of [...food.map(e=>({...e,kind:'food' as const})),...fish.filter(e=>e.id!==f.id).map(e=>({...e,kind:'fish' as const}))]) {
    const d=distance(f.position,item.position);
    if(d>p.visionRange) continue;
    out.candidates++;
    let reason: Perception['rejected'][number]['reason'] | undefined;
    if(light<.01) reason='dark';
    else if(d>range) reason='range';
    else if(d>1e-9 && dot(f.heading,unit(sub(item.position,f.position)))<Math.cos(p.fovDegrees*Math.PI/360)) reason='outside FOV';
    else if(obstacles.some(o=>segmentDistance(f.position,item.position,o.position)<=o.radiusCm)) reason='occluded';
    if(reason) out.rejected.push({id:item.id,reason});
    else out.detected.push({id:item.id,kind:item.kind,position:{...item.position},distanceCm:d,channel:'vision'});
  }
  out.detected.sort((a,b)=>a.distanceCm-b.distanceCm||a.id-b.id);
  return out;
}
/** Policy receives limited observations plus its own state; rejected candidates are diagnostics only. */
export function policy(f: Pick<Fish,'position'|'heading'|'gutG'|'capacityG'>,detected: Perception['detected']) {
  const hunger=1-f.gutG/f.capacityG;
  const neighbor=detected.find(e=>e.kind==='fish'&&e.distanceCm<35);
  if(neighbor) return {goal:'avoid visible neighbor',target:null,desired:unit(sub(f.position,neighbor.position)),speedScale:.5};
  const target=detected.find(e=>e.kind==='food');
  if(hunger>.01&&target) return {goal:'approach visible food',target:target.id,desired:unit(sub(target.position,f.position)),speedScale:Math.min(1,target.distanceCm/30)};
  if(hunger<=.01) return {goal:'satiated',target:null,desired:f.heading,speedScale:0};
  return {goal:'search (no visible food)',target:null,desired:turn(f.heading,{x:-f.heading.y,y:f.heading.x,z:f.heading.z},.012),speedScale:.35};
}
