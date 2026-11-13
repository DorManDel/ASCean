import {seededWorld} from "../../../packages/core/src/world.js";
import {FixedStepClock} from "../../../packages/core/src/clock.js";
import {renderTank,pickFish} from "../../../packages/rendering/src/canvas.js";
function el(id:string):HTMLElement{const x=document.getElementById(id);if(!x)throw Error(id);return x;}
const canvas=el("scene") as HTMLCanvasElement,input=el("radius") as HTMLInputElement,method=el("method") as HTMLSelectElement;
let world=seededWorld(),clock=new FixedStepClock(),selected:number|null=1,guides=false;
let previous=performance.now(),meter=previous,frames=0,ticks=0;
function inspect():void{
  const f=selected==null?null:world.fish(selected);
  const found=f?world.neighbors(f.id,+input.value,method.value as "grid"|"all"):null;
  el("inspector").textContent=f?"Fish #"+f.id+" · slot "+f.slot+" · X "+f.x.toFixed(0)+"cm · Y "+f.y.toFixed(0)+"cm · Z "+f.z.toFixed(0)+"cm":"No fish selected";
  el("cells").textContent=String(world.occupiedCells);el("checks").textContent=String(found?.checks??0);
  el("neighbors").textContent=String(found?.ids.length??0);el("bytes").textContent=(world.numericBytes/1024).toFixed(1)+" KiB";
  el("radiusOutput").textContent=input.value+" cm";
}
canvas.addEventListener("click",e=>{const fish=pickFish(canvas,world,e.clientX,e.clientY);if(fish!==null){selected=fish;inspect();}});
el("pause").onclick=()=>{clock.paused=!clock.paused;el("pause").textContent=clock.paused?"Resume":"Pause";};
el("step").onclick=()=>{clock.paused=true;el("pause").textContent="Resume";clock.singleStep(dt=>world.step(dt));inspect();};
el("spawn").onclick=()=>{for(let i=0;i<25;i++)world.spawn();world.rebuildGrid();inspect();};
el("remove").onclick=()=>{if(selected!==null)world.remove(selected);selected=world.count?world.id[0]:null;world.rebuildGrid();inspect();};
el("guides").onclick=()=>{guides=!guides;};
input.oninput=inspect;method.onchange=inspect;
inspect();
function frame(now:number):void{
  const dt=(now-previous)/1000;previous=now;
  ticks+=clock.advance(dt,step=>world.step(step));frames++;
  renderTank(canvas,world,selected,guides);
  if(now-meter>=1000){const secs=(now-meter)/1000;el("fps").textContent=(frames/secs).toFixed(0);el("tps").textContent=(ticks/secs).toFixed(0);meter=now;frames=0;ticks=0;inspect();}
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
