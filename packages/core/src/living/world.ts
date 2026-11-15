import type { Vec3, Fish, Snapshot, ExperimentDefinition, UserCommand, Action, SimulationEvent, Parameters, Habitat } from './contracts';
import { BOUNDS, DT, ZERO, add, sub, scale, length, unit, distance, turn, clamp, segmentDistance, vision, policy, sampleWater } from './models';
export function requireValue(ok: unknown,message: string): asserts ok { if(!ok) throw Error(message); }
const integer=(n:number,min=0,max=Number.MAX_SAFE_INTEGER)=>Number.isSafeInteger(n)&&n>=min&&n<=max;
const finite=(n:number,min:number,max:number)=>Number.isFinite(n)&&n>=min&&n<=max;
export function validatePosition(p: Vec3,margin=0) {
  requireValue(p&&(['x','y','z'] as const).every(a=>finite(p[a],margin,BOUNDS[a]-margin)),'Position outside experimental tank');
}
function validateVelocity(p: Vec3) { requireValue(p&&(['x','y','z'] as const).every(a=>finite(p[a],-100,100)),'Invalid current'); }
export function validateParameters(p: Parameters) {
  requireValue(p&&finite(p.speed,0,100)&&finite(p.acceleration,1,200)&&finite(p.turnRate,.1,6)&&finite(p.visionRange,10,1000)&&finite(p.fovDegrees,10,360)&&typeof p.passive==='boolean','Invalid experimental parameters');
}
function validateHabitat(h: Habitat) {
  requireValue(h&&['marine','brackish','freshwater'].includes(h.kind)&&typeof h.name==='string'&&h.name.length<100,'Invalid habitat');
  requireValue(finite(h.temperatureC,-2,40)&&finite(h.salinityPsu,0,45)&&finite(h.oxygenMgL,0,20)&&finite(h.turbidity,0,10)&&finite(h.surfaceY,BOUNDS.y,1000500)&&finite(h.densityKgM3,990,1040)&&finite(h.surfaceLight,0,1)&&finite(h.attenuationPerM,0,5),'Invalid water field');
  requireValue(h.kind==='freshwater'?h.salinityPsu<=.5:h.kind==='brackish'?h.salinityPsu>.5&&h.salinityPsu<30:h.salinityPsu>=30,'Habitat/salinity mismatch');
  validateVelocity(h.current);
}
function validateDefinition(d: ExperimentDefinition) {
  requireValue(d&&d.schema===1&&d.model==='living-1'&&typeof d.runId==='string'&&d.runId.length>0&&d.runId.length<=80,'Unsupported experiment');
  requireValue(integer(d.seed,0,0xffffffff)&&integer(d.count,1,100)&&['forager','cruiser'].includes(d.species)&&['steering','reflection'].includes(d.motion),'Invalid fixture');
  validateParameters(d.parameters); validateHabitat(d.habitat);
}
function allFinite(input: unknown,depth=0): void {
  requireValue(depth<30,'Snapshot nesting limit');
  if(typeof input==='number') requireValue(Number.isFinite(input),'Nonfinite state');
  else if(input&&typeof input==='object') for(const v of Object.values(input)) allFinite(v,depth+1);
}
export class LivingWorld {
  #s: Snapshot;
  constructor(input: ExperimentDefinition) {
    validateDefinition(input);
    this.#s={schema:1,model:'living-1',definition:structuredClone(input),tick:0,rng:input.seed,nextId:1,sequence:0,fish:[],food:[],obstacles:[],foodInputG:0,foodOutputG:0,events:[],observations:[],discardedEvents:0,discardedObservations:0};
    for(let i=0;i<input.count;i++) {
      const rows=input.count<=10?Math.min(input.count,5):10;
      const x=150+Math.floor(i/rows)*70,y=50+(i%rows)*(400/Math.max(1,rows-1));
      this.#s.fish.push(this.#fish({x,y:input.count===1?250:y,z:150},input.species));
    }
  }
  get tick(){return this.#s.tick;}
  get gutMassG(){return this.#s.fish.reduce((n,f)=>n+f.gutG,0);}
  snapshot(): Snapshot {return structuredClone(this.#s);}
  inspect(id:number) {const f=this.#s.fish.find(f=>f.id===id);return f?structuredClone(f):undefined;}
  #random(){this.#s.rng=(Math.imul(this.#s.rng,1664525)+1013904223)>>>0;return this.#s.rng/4294967296;}
  #id(){requireValue(this.#s.nextId<Number.MAX_SAFE_INTEGER,'ID exhausted');return this.#s.nextId++;}
  #fish(position:Vec3,species:'forager'|'cruiser'):Fish {
    const heading=unit({x:1,y:(this.#random()-.5)*.08,z:0});
    return {id:this.#id(),species,habitatKind:this.#s.definition.habitat.kind,position:{...position},heading,desired:{...heading},swimVelocity:ZERO(),waterDrift:ZERO(),worldVelocity:ZERO(),gutG:0,structuralG:2,reserveG:.2,capacityG:1,goal:'ready',target:null,perceived:{tick:0,candidates:0,detected:[],rejected:[]},pathCm:0,collisions:0,firstFoodTick:null};
  }
  #event(event:Omit<SimulationEvent,'schema'|'tick'>){
    this.#s.events.push({schema:1,tick:this.tick,...event});
    if(this.#s.events.length>512){this.#s.events.shift();this.#s.discardedEvents++;}
  }
  command(command: UserCommand) {
    requireValue(command?.schema===1&&command.runId===this.#s.definition.runId&&command.tick===this.tick&&command.sequence===this.#s.sequence,'Stale, duplicate or out-of-order command');
    const candidate=LivingWorld.restore(this.snapshot());
    candidate.#apply(structuredClone(command.action));
    candidate.#s.sequence++;
    candidate.#event({type:'command',detail:JSON.stringify(command.action)});
    LivingWorld.validate(candidate.#s);
    this.#s=candidate.#s;
  }
  #apply(a:Action) {
    const s=this.#s;
    if(a.type==='parameters'){validateParameters(a.value);s.definition.parameters=a.value;return;}
    if(a.type==='current'){validateVelocity(a.velocity);s.definition.habitat.current=a.velocity;return;}
    if(a.type==='remove'){
      const f=s.fish.find(e=>e.id===a.id),food=s.food.find(e=>e.id===a.id);
      requireValue(f||food||s.obstacles.some(e=>e.id===a.id),'Unknown entity');
      s.foodOutputG+=(f?.gutG??0)+(food?.quantityG??0);
      s.fish=s.fish.filter(e=>e.id!==a.id);s.food=s.food.filter(e=>e.id!==a.id);s.obstacles=s.obstacles.filter(e=>e.id!==a.id);return;
    }
    if(a.type==='move'){
      const e=[...s.fish,...s.food,...s.obstacles].find(e=>e.id===a.id);requireValue(e,'Unknown entity');
      validatePosition(a.position,'radiusCm' in e?e.radiusCm:'heading' in e?6:0);
      this.#placement(a.position,'radiusCm' in e?e.radiusCm:'heading' in e?6:0,a.id);
      e.position=a.position; return;
    }
    requireValue(s.fish.length+s.food.length+s.obstacles.length<500,'Fixture entity limit (500)');
    if(a.type==='addFood'){
      validatePosition(a.position);requireValue(finite(a.quantityG,.001,100),'Invalid food grams');this.#placement(a.position,0);
      s.food.push({id:this.#id(),position:a.position,quantityG:a.quantityG,kind:'pellet'});s.foodInputG+=a.quantityG;return;
    }
    if(a.type==='addFish'){
      requireValue(['forager','cruiser'].includes(a.species),'Unknown illustrative species');validatePosition(a.position,6);this.#placement(a.position,6);
      s.fish.push(this.#fish(a.position,a.species));return;
    }
    if(a.type==='addObstacle'){
      requireValue(finite(a.radiusCm,5,80),'Invalid obstacle radius');validatePosition(a.position,a.radiusCm);this.#placement(a.position,a.radiusCm);
      requireValue(!s.food.some(f=>distance(f.position,a.position)<=a.radiusCm),'Obstacle overlaps food');
      s.obstacles.push({id:this.#id(),position:a.position,radiusCm:a.radiusCm});return;
    }
    throw Error('Unknown command');
  }
  #placement(position:Vec3,radius:number,ignore=-1){
    requireValue(!this.#s.obstacles.some(o=>o.id!==ignore&&distance(position,o.position)<=radius+o.radiusCm),'Placement intersects obstacle');
    if(radius>0)requireValue(!this.#s.fish.some(f=>f.id!==ignore&&distance(position,f.position)<radius+6),'Placement intersects fish');
  }
  step(){
    const s=this.#s,p=s.definition.parameters,h=s.definition.habitat;
    requireValue(this.tick<10000000,'Trial tick limit reached');
    s.tick++;
    // All sensors sample the same start-of-tick state; policies never see rejection diagnostics.
    const sensed=s.fish.map(f=>vision(f,s.fish,s.food,s.obstacles,h,p,s.tick));
    for(const [index,f] of s.fish.entries()){
      f.perceived=sensed[index]!;
      const intent=policy({position:{...f.position},heading:{...f.heading},gutG:f.gutG,capacityG:f.capacityG},f.perceived.detected);
      let desired=intent.desired;
      // Boundary steering uses own position, not hidden resource state.
      const wall={x:0,y:0,z:0};
      for(const a of ['x','y','z'] as const){if(f.position[a]<45)wall[a]=1;else if(f.position[a]>BOUNDS[a]-45)wall[a]=-1;}
      if(length(wall)>0){desired=unit(add(desired,scale(wall,3)));intent.goal='wall avoidance';}
      if(p.passive){intent.goal='passive drift';intent.speedScale=0;intent.target=null;}
      if(intent.goal!==f.goal||intent.target!==f.target)this.#event({type:'decision',entityId:f.id,detail:`${intent.goal}; hunger=${(1-f.gutG/f.capacityG).toFixed(3)}; visible=${f.perceived.detected.map(e=>e.id).join(',')}; target=${intent.target??'none'}`});
      f.goal=intent.goal;f.target=intent.target;f.desired={...desired};
      const rotated=turn(f.heading,desired,p.turnRate*DT);
      const targetVelocity=scale(rotated,p.speed*(f.species==='cruiser'?.8:1)*intent.speedScale);
      const delta=sub(targetVelocity,f.swimVelocity);
      if(s.definition.motion==='steering'){
        f.swimVelocity=add(f.swimVelocity,scale(delta,Math.min(1,p.acceleration*DT/(length(delta)||1))));
        if(length(f.swimVelocity)>1e-8)f.heading=unit(f.swimVelocity);
      }
      f.waterDrift=sampleWater(h,f.position).current;
      const before={...f.position};
      let next=add(before,scale(add(f.swimVelocity,f.waterDrift),DT));
      if(s.definition.motion==='reflection'){
        // Labeled comparison baseline; feeding still uses the same limited sensory pathway.
        if(length(f.swimVelocity)<1e-6&&!p.passive)f.swimVelocity=scale(f.heading,p.speed);
        next=add(before,scale(add(scale(f.heading,p.passive?0:p.speed),f.waterDrift),DT));
        for(const a of ['x','y','z'] as const)if(next[a]<6||next[a]>BOUNDS[a]-6){next[a]=clamp(next[a],6,BOUNDS[a]-6);f.heading[a]*=-1;}
        f.swimVelocity=scale(f.heading,p.passive?0:p.speed);
      }
      let contact=false;
      for(const a of ['x','y','z'] as const){const bounded=clamp(next[a],6,BOUNDS[a]-6);if(bounded!==next[a])contact=true;next[a]=bounded;}
      // Conservative swept-sphere stop. No tunneling; not a calibrated contact-force model.
      if(s.obstacles.some(o=>segmentDistance(before,next,o.position)<o.radiusCm+6)||s.fish.some(other=>other.id!==f.id&&segmentDistance(before,next,other.position)<12)){next=before;contact=true;}
      if(contact){f.collisions++;this.#event({type:'contact',entityId:f.id,detail:'Swept contact stop / wall clamp; no injury model'});}
      f.position=next;f.worldVelocity=scale(sub(next,before),1/DT);f.pathCm+=distance(before,next);
      if(!p.passive&&f.target!==null){
        const food=s.food.find(e=>e.id===f.target);
        if(food&&f.perceived.detected.some(e=>e.id===food.id)&&distance(f.position,food.position)<=10&&!s.obstacles.some(o=>segmentDistance(f.position,food.position,o.position)<=o.radiusCm)){
          const amount=Math.min(food.quantityG,Math.max(0,f.capacityG-f.gutG),.6*DT);
          if(amount>1e-10){food.quantityG-=amount;f.gutG+=amount;f.firstFoodTick??=s.tick;this.#event({type:'ingest',entityId:f.id,amountG:amount,detail:`Food ${food.id} → gut; visual eligibility + distance ≤10 cm`});}
          if(food.quantityG<1e-10){s.foodOutputG+=food.quantityG;s.food=s.food.filter(e=>e.id!==food.id);}
        }
      }
      if(s.tick%10===0){s.observations.push({schema:1,tick:s.tick,fishId:f.id,position:{...f.position},goal:f.goal,detected:f.perceived.detected.map(e=>e.id),gutG:f.gutG,pathCm:f.pathCm,status:'sampled'});if(s.observations.length>512){s.observations.shift();s.discardedObservations++;}}
    }
  }
  metrics(){
    const s=this.#s,latencies=s.fish.flatMap(f=>f.firstFoodTick===null?[]:[f.firstFoodTick*DT]);
    return {status:'modeled' as const,reached:latencies.length,latencySeconds:latencies.length?Math.min(...latencies):null,pathCm:s.fish.reduce((n,f)=>n+f.pathCm,0),collisions:s.fish.reduce((n,f)=>n+f.collisions,0),foodBalanceErrorG:s.foodInputG-s.foodOutputG-s.food.reduce((n,f)=>n+f.quantityG,0)-s.fish.reduce((n,f)=>n+f.gutG,0)};
  }
  static validate(s: Snapshot){
    requireValue(s&&s.schema===1&&s.model==='living-1','Unsupported snapshot');allFinite(s);validateDefinition(s.definition);
    requireValue(integer(s.tick,0,10000000)&&integer(s.rng,0,0xffffffff)&&integer(s.nextId,1)&&integer(s.sequence)&&integer(s.discardedEvents)&&integer(s.discardedObservations),'Invalid clocks/allocator');
    requireValue(Array.isArray(s.fish)&&Array.isArray(s.food)&&Array.isArray(s.obstacles)&&s.fish.length+s.food.length+s.obstacles.length<=500,'Invalid entities');
    const ids=new Set<number>();
    for(const e of [...s.fish,...s.food,...s.obstacles]){requireValue(integer(e.id,1)&&e.id<s.nextId&&!ids.has(e.id),'Invalid entity identity');ids.add(e.id);validatePosition(e.position);}
    for(const f of s.fish){
      validatePosition(f.position,6);
      requireValue(['forager','cruiser'].includes(f.species)&&f.habitatKind===s.definition.habitat.kind&&Math.abs(length(f.heading)-1)<1e-7&&Math.abs(length(f.desired)-1)<1e-7,'Invalid fish profile/heading');
      requireValue(finite(f.gutG,0,1)&&f.capacityG===1&&f.structuralG===2&&f.reserveG===.2&&finite(f.pathCm,0,1e12)&&integer(f.collisions)&&typeof f.goal==='string'&&(f.target===null||integer(f.target,1))&&(f.firstFoodTick===null||integer(f.firstFoodTick,0,s.tick)),'Invalid fish stores/state');
      for(const v of [f.swimVelocity,f.worldVelocity,f.waterDrift])requireValue(v&&Object.values(v).length===3&&Object.values(v).every(n=>finite(n,-300,300)),'Invalid motion');
      requireValue(f.perceived&&integer(f.perceived.tick,0,s.tick)&&integer(f.perceived.candidates)&&Array.isArray(f.perceived.detected)&&Array.isArray(f.perceived.rejected)&&f.perceived.detected.length<=500&&f.perceived.rejected.length<=500,'Invalid perception');
      for(const e of f.perceived.detected){requireValue(integer(e.id,1)&&['fish','food'].includes(e.kind)&&e.channel==='vision'&&finite(e.distanceCm,0,2000),'Invalid stimulus');validatePosition(e.position);}
      for(const e of f.perceived.rejected)requireValue(integer(e.id,1)&&['range','outside FOV','occluded','dark'].includes(e.reason),'Invalid rejection diagnostic');
      requireValue(!s.obstacles.some(o=>distance(f.position,o.position)<o.radiusCm+6-1e-7)&&!s.fish.some(other=>other.id!==f.id&&distance(f.position,other.position)<12-1e-7),'Snapshot contains penetrating bodies');
    }
    for(const e of s.food)requireValue(e.kind==='pellet'&&finite(e.quantityG,0,100),'Invalid food');
    for(const e of s.obstacles){requireValue(finite(e.radiusCm,5,80),'Invalid obstacle');validatePosition(e.position,e.radiusCm);requireValue(!s.food.some(food=>distance(food.position,e.position)<=e.radiusCm)&&!s.obstacles.some(o=>o.id!==e.id&&distance(o.position,e.position)<=o.radiusCm+e.radiusCm),'Overlapping obstacle/resource');}
    requireValue(finite(s.foodInputG,0,1e12)&&finite(s.foodOutputG,0,s.foodInputG)&&Math.abs(s.foodInputG-s.foodOutputG-s.food.reduce((n,f)=>n+f.quantityG,0)-s.fish.reduce((n,f)=>n+f.gutG,0))<1e-7,'Food ledger mismatch');
    requireValue(Array.isArray(s.events)&&s.events.length<=512&&Array.isArray(s.observations)&&s.observations.length<=512,'Invalid bounded logs');
    for(const e of s.events)requireValue(e.schema===1&&integer(e.tick,0,s.tick)&&['command','decision','ingest','contact'].includes(e.type)&&typeof e.detail==='string'&&e.detail.length<2000,'Invalid event');
    for(const e of s.observations){requireValue(e.schema===1&&integer(e.tick,0,s.tick)&&integer(e.fishId,1)&&e.status==='sampled'&&Array.isArray(e.detected)&&finite(e.gutG,0,1)&&finite(e.pathCm,0,1e12)&&typeof e.goal==='string','Invalid observation');validatePosition(e.position);}
  }
  static restore(input: unknown){
    const s=structuredClone(input) as Snapshot;LivingWorld.validate(s);
    const w=new LivingWorld({...s.definition,count:1});w.#s=s;return w;
  }
}
