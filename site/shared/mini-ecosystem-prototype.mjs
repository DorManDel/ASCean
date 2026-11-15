/** Educational deterministic scenario traces. NOT calibrated animal physiology. */
export const SCENARIOS=Object.freeze({
 mating:{name:'Mating & spawning',kind:'biology',duration:12,objective:'Approach → egg release → seeded offspring',caveat:'Toy egg-spawning vignette. Real mating eligibility and development are species-dependent.'},
 waste:{name:'Feeding & waste',kind:'biology',duration:12,objective:'Eat → digest → feces and dissolved waste cue',caveat:'No nutrient, nitrogen or energy conservation model yet; waste is a scripted educational event.'},
 predation:{name:'Predation & escape',kind:'behavior',duration:12,objective:'Pursue → 3D escape / bite-attempt event',caveat:'Visual pursuit only; no forces, biological injury or anatomical contact solver.'},
 social:{name:'Social investigation',kind:'behavior',duration:12,objective:'Approach → keep distance → circle',caveat:'Not learned behavior; no species-specific social calibration.'}
});
const schedules={
 mating:[[2.1,'Courtship: parents approach'],[4.2,'Gamete release / eggs (illustrative)'],[7.2,'Hatching preview / lineage candidate']],
 waste:[[1.5,'Food available'],[3.1,'Ingestion event'],[5.2,'Digestion phase (simplified)'],[7.1,'Fecal particle released'],[8.8,'Dissolved nitrogen: future field coupling']],
 predation:[[1.8,'Predator detects target'],[3.1,'Prey response / steering choice'],[5.6,'Bite attempt or XYZ escape']],
 social:[[1.4,'Social curiosity activated'],[3.1,'Approach with separation'],[5.1,'Pair circling / investigation']]
};
export function createScenario(id,{seed=1,offspring=[]}={}){
 if(!SCENARIOS[id])throw new RangeError('unknown scenario');
 return {id,seed,t:0,playing:false,speed:1,offspring:offspring.map(c=>({id:c.id,color:c.color??'#b5a2f4'})),events:[],mode:'escape'};
}
export function advanceScenario(s,dt){
 if(!Number.isFinite(dt)||dt<0||dt>.25)throw new RangeError('dt');
 const old=s.t;s.t=Math.min(SCENARIOS[s.id].duration,s.t+dt*s.speed);
 if(SCENARIOS[s.id].duration-s.t<1e-8)s.t=SCENARIOS[s.id].duration;
 for(const [at,event] of schedules[s.id])if(old<at&&s.t>=at)s.events.push({at,text:event});
 if(s.t>=SCENARIOS[s.id].duration)s.playing=false;
 return s;
}
export function resetScenario(s){s.t=0;s.events=[];s.playing=false;return s;}
export function setOffspring(s,children){if(s.id!=='mating')throw new RangeError('not a mating scenario');
 s.offspring=children.map(c=>({id:c.id,color:c.color??'#b5a2f4'}));resetScenario(s);}
function clamp(v,a=0,b=1){return Math.max(a,Math.min(b,v));}
export function sampleScenario(s){
 const t=s.t,actors=[],particles=[];
 if(s.id==='mating'){
  actors.push({x:clamp(.17+.044*t,.17,.42),y:.5,z:.18,dir:1,color:'#73dcf2',name:'Parent A'});
  actors.push({x:clamp(.83-.044*t,.58,.83),y:.5,z:.18,dir:-1,color:'#f2b77a',name:'Parent B'});
  if(t>=4.2)for(let i=0;i<5;i++){
   const x=.43+(i%3)*.06,y=.58+Math.floor(i/3)*.075;
   if(t<7.2||!s.offspring.length)particles.push({type:'egg',x,y,color:'#ffe6a0'});
   else actors.push({x:x+Math.sin(t+i)*.025,y:y-Math.min(.18,(t-7.2)*.016),z:.13+(i%2)*.18,dir:1,color:s.offspring[i%s.offspring.length].color,name:'G1 '+s.offspring[i%s.offspring.length].id,small:true});
  }
 }
 if(s.id==='waste'){
  actors.push({x:.15+(t*.047)%0.7,y:.50+Math.sin(t*2)*.04,z:.17,dir:1,color:'#6ddde8',name:'Feeder'});
  if(t>=1.5&&t<3.1)particles.push({x:.33,y:.24+Math.min(.28,(t-1.5)*.12),type:'food',color:'#b9e489'});
  if(t>=7.1)particles.push({x:.48+.022*(t-7.1),y:clamp(.52+.08*(t-7.1)),type:'feces',color:'#bd9373'});
  if(t>=8.8)particles.push({x:.67,y:.63,type:'water',color:'#c6a8ff'});
 }
 if(s.id==='predation'){
  const chase=t*0.072;
  actors.push({x:clamp(.12+chase,.12,.85),y:.48,z:.12,dir:1,color:'#f19b9f',name:'Predator'});
  const escape=s.mode!=='contact'&&t>=3.1;
  actors.push({x:escape?clamp(.63+(t-3.1)*.045,.63,.92):.66,y:escape?.48-Math.min(.14,(t-3.1)*.016):.48,z:escape?clamp(.12+(t-3.1)*.12,.12,.86):.12,dir:1,color:'#93e1b6',name:'Prey'});
  if(t>5.6&&s.mode==='contact')particles.push({x:.66,y:.43,type:'bite',color:'#ffcf84'});
 }
 if(s.id==='social'){
  const phase=Math.max(0,t-4.6);
  actors.push({x:clamp(.18+t*.045,.18,.43)+.045*Math.sin(phase),y:.49+.065*Math.sin(phase*1.4),z:.2,dir:1,color:'#82dce9',name:'Fish A'});
  actors.push({x:clamp(.84-t*.042,.57,.84)+.045*Math.sin(phase+Math.PI),y:.56+.065*Math.sin(phase*1.4+Math.PI),z:.3,dir:-1,color:'#e5b4ff',name:'Fish B'});
 }
 return {t,actors,particles,events:s.events.slice(),progress:t/SCENARIOS[s.id].duration,completed:t===SCENARIOS[s.id].duration};
}
