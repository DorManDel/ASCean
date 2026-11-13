import {seededWorld} from "../../../packages/core/src/world.js";
import {FixedStepClock} from "../../../packages/core/src/clock.js";
import {renderTank} from "../../../packages/rendering/src/canvas.js";
function el(id:string):HTMLElement{const x=document.getElementById(id);if(!x)throw Error(id);return x;}
const canvas=el("scene") as HTMLCanvasElement;
let world=seededWorld(),clock=new FixedStepClock();
let previous=performance.now(),meter=previous,frames=0,ticks=0;
el("pause").onclick=()=>{clock.paused=!clock.paused;el("pause").textContent=clock.paused?"Resume":"Pause";};
el("spawn").onclick=()=>{for(let i=0;i<25;i++)world.spawn();world.rebuildGrid();};
el("reset").onclick=()=>{world=seededWorld();clock=new FixedStepClock();el("pause").textContent="Pause";};
function frame(now:number):void{
  const dt=(now-previous)/1000;previous=now;
  ticks+=clock.advance(dt,step=>world.step(step));frames++;
  renderTank(canvas,world);
  el("count").textContent=String(world.count);el("tick").textContent=String(world.tick);
  if(now-meter>=1000){const secs=(now-meter)/1000;el("fps").textContent=(frames/secs).toFixed(0);el("tps").textContent=(ticks/secs).toFixed(0);meter=now;frames=0;ticks=0;}
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
