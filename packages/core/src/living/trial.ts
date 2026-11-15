import type { Action, ExperimentDefinition, ExperimentResult, Snapshot, UserCommand } from './contracts';
import { LivingWorld, requireValue } from './world';
import { DT, definition } from './models';
export class Trial {
  #world: LivingWorld;
  #initial: Snapshot;
  #commands: UserCommand[]=[];
  paused=true;
  pauseOnIngest=false;
  #acc=0;
  droppedWallSeconds=0;
  constructor(d:ExperimentDefinition=definition()){this.#world=new LivingWorld(d);this.#initial=this.#world.snapshot();}
  get world(){return this.#world;}
  command(action:Action){
    requireValue(this.#commands.length<4096,'Command recorder full; export and start a new trial');
    const command:UserCommand={schema:1,runId:this.#initial.definition.runId,tick:this.world.tick,sequence:this.#initial.sequence+this.#commands.length,action:structuredClone(action)};
    this.#world.command(command);this.#commands.push(command);
  }
  pause(){this.paused=true;this.#acc=0;}
  resume(){this.paused=false;this.#acc=0;}
  step(){
    const before=this.#world.gutMassG;
    this.#world.step();
    if(this.pauseOnIngest&&this.#world.gutMassG>before)this.pause();
  }
  advance(seconds:number){
    requireValue(Number.isFinite(seconds)&&seconds>=0,'Invalid wall interval');if(this.paused)return 0;
    const total=this.#acc+seconds;this.droppedWallSeconds+=Math.max(0,total-8*DT);this.#acc=Math.min(total,8*DT);
    let ticks=0;while(this.#acc+1e-12>=DT&&ticks<8&&!this.paused){this.#acc=Math.max(0,this.#acc-DT);this.step();ticks++;}return ticks;
  }
  result():ExperimentResult{return {schema:1,initial:structuredClone(this.#initial),commands:structuredClone(this.#commands),final:this.#world.snapshot(),metrics:this.world.metrics(),note:'Illustrative model; logs are bounded samples. Metrics describe modeled outcomes, not biological validation. Timings are not replay state.'};}
  static replay(input:unknown){
    const r=structuredClone(input) as ExperimentResult;
    requireValue(r?.schema===1&&Array.isArray(r.commands)&&r.commands.length<=4096,'Unsupported trial');
    LivingWorld.validate(r.initial);LivingWorld.validate(r.final);
    requireValue(r.final.tick>=r.initial.tick&&r.final.tick-r.initial.tick<=100000,'Replay limit 100000 ticks');
    const t=new Trial(r.initial.definition);t.#world=LivingWorld.restore(r.initial);t.#initial=r.initial;
    let cursor=0;
    while(true){
      while(cursor<r.commands.length&&r.commands[cursor]!.tick===t.world.tick){const c=r.commands[cursor++]!;t.world.command(c);t.#commands.push(c);}
      if(t.world.tick===r.final.tick)break;
      requireValue(cursor===r.commands.length||r.commands[cursor]!.tick>t.world.tick,'Commands not tick ordered');t.step();
    }
    requireValue(cursor===r.commands.length,'Commands exceed final tick');
    requireValue(JSON.stringify(t.world.snapshot())===JSON.stringify(r.final),'Replay mismatch: state, model or log changed');
    requireValue(JSON.stringify(t.world.metrics())===JSON.stringify(r.metrics),'Replay mismatch: reported outcomes changed');
    return t;
  }
}
const quote=(value:unknown)=>`"${String(value).replaceAll('"','""')}"`;
/** CSV rows carry the exact versioned trial as a quoted payload, plus human-readable samples. */
export function exportCsv(result:ExperimentResult){
  return ['record,tick,fishId,detail','trial,,,\"'+JSON.stringify(result).replaceAll('"','""')+'\"',...result.final.events.map(e=>['event',e.tick,e.entityId??'',e.detail].map(quote).join(',')),...result.final.observations.map(o=>['observation',o.tick,o.fishId,JSON.stringify(o)].map(quote).join(','))].join('\r\n');
}
export function parseTrial(text:string):unknown{
  requireValue(text.length<=10000000,'Trial file limit 10 MB');
  if(text.trimStart().startsWith('{'))return JSON.parse(text);
  const match=text.match(/^record,tick,fishId,detail\r?\ntrial,,,"((?:[^"\r\n]|"")*)"(?:\r?\n|$)/);
  requireValue(match,'Unsupported CSV trial envelope');return JSON.parse(match[1]!.replaceAll('""','"'));
}
export type MeterRow={seed:number;mode:'steering'|'reflection';ticks:number;metrics:ExperimentResult['metrics'];cpuMs:number;cpuStatus:'measured';snapshotBytes:number;memoryStatus:'measured serialized UTF-8 bytes; heap/GPU unavailable'};
export function meter(seeds=[1,7,42],ticks=600):MeterRow[]{
  return seeds.flatMap(seed=>(['reflection','steering'] as const).map(mode=>{
    const d=definition(seed);d.motion=mode;const t=new Trial(d);
    t.command({type:'addFood',position:{x:340,y:300,z:150},quantityG:.3});
    const start=performance.now();for(let i=0;i<ticks;i++)t.step();const cpuMs=performance.now()-start;
    return {seed,mode,ticks,metrics:t.world.metrics(),cpuMs,cpuStatus:'measured' as const,snapshotBytes:new TextEncoder().encode(JSON.stringify(t.world.snapshot())).length,memoryStatus:'measured serialized UTF-8 bytes; heap/GPU unavailable' as const};
  }));
}
