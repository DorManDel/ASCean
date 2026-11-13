import {WorldPrototype,quantize,dequantize} from "../shared/world-prototype.mjs";
const $=id=>document.getElementById(id);
const pages=["entities","precision","space","time","body","modules"];
let current="space",world=new WorldPrototype({count:180,seed:47}),selected=1;
let paused=false,acc=0,prev=performance.now(),fpsWindow=prev,frameCount=0,tickCount=0;
const TIME_STEP=1/30;
let time=0,bodyData={};
const fieldData={
 id:["Uint32 · stable fish identity","An ID never changes. Dense slots may move after deletion."],
 species:["Uint16 / species registry · proposed","The species definition is shared across many fish. Currently absent from the toy World."],
 world:["World instance identifier","World ID is shared by its fish and is not repeated in every numeric column."],
 x:["Float32 × 3 · cm","Three physical coordinates (X horizontal, Y vertical, Z into screen)."],
 velocity:["Float32 × 3 · cm/s","Velocity is independent of frame rate. Future motion needs validated forces and drag."],
 mass:["Float32 · grams (prototype)","Final bodyMassG should be derived from non-overlapping physical stores."],
 length:["Float32 · cm (proposed)","Standard Length and Total Length are distinct measurements."],
 energy:["Normalized energy state (proposed)","Energy is not grams. Metabolic and mechanical energy models remain open."],
 state:["Uint8 / enum (proposed)","Discrete state is a candidate for future bit packing after profiling."],
 genome:["Uint32 handle (proposed)","Genetic data is optional, species-dependent and stored outside hot motion columns."]
};
function pageTo(id){
 if(!pages.includes(id))return;
 current=id;
 for(const p of pages) $("page-"+p).classList.toggle("is-current",p===id);
 document.querySelectorAll("[data-page]").forEach(b=>b.setAttribute("aria-current",b.dataset.page===id?"page":"false"));
 $("navigation").classList.remove("open");$("scrim").classList.remove("open");
 if(id==="space") updateSpatialControls();
}
document.querySelectorAll("[data-page]").forEach(b=>b.addEventListener("click",()=>pageTo(b.dataset.page)));
$("menu").onclick=()=>{$("navigation").classList.toggle("open");$("scrim").classList.toggle("open");};
$("scrim").onclick=()=>{$("navigation").classList.remove("open");$("scrim").classList.remove("open");};
$("present").onclick=async()=>{
 document.body.classList.toggle("presentation");
 const active=document.body.classList.contains("presentation");
 $("present").textContent=active?"⨯ Exit":"⛶ Presentation";
 if(active&&document.documentElement.requestFullscreen){try{await document.documentElement.requestFullscreen();}catch{}}
 else if(!active&&document.fullscreenElement){try{await document.exitFullscreen();}catch{}}
};
window.addEventListener("keydown",e=>{
 if(e.target instanceof HTMLInputElement||e.target instanceof HTMLSelectElement||e.target instanceof HTMLTextAreaElement)return;
 if(e.key==="Escape"&&document.body.classList.contains("presentation")){$("present").click();return;}
 if(!document.body.classList.contains("presentation"))return;
 const index=pages.indexOf(current);
 if(e.key==="ArrowRight"){pageTo(pages[(index+1)%pages.length]);e.preventDefault();}
 if(e.key==="ArrowLeft"){pageTo(pages[(index+pages.length-1)%pages.length]);e.preventDefault();}
});
document.querySelectorAll("[data-field]").forEach(b=>b.onclick=()=>{
 document.querySelectorAll("[data-field]").forEach(x=>x.classList.toggle("active",x===b));
 const [type,meaning]=fieldData[b.dataset.field];
 $("fieldName").textContent=b.textContent;$("fieldInfo").textContent=type;$("fieldDetails").textContent=meaning;
});
document.querySelector('[data-field="id"]').click();
let ids=new WorldPrototype({capacity:12,count:4,seed:123});
let selectedIdentity=ids.id[1];
function refreshIds(){
 $("idRows").replaceChildren();
 for(let i=0;i<ids.count;i++){
   const tr=document.createElement("tr");const button=document.createElement("button");button.textContent="#"+ids.id[i];
   button.style.background=ids.id[i]===selectedIdentity?"#4b4586":"#1d3550";button.style.color="white";button.style.border="1px solid #3e5d7e";button.style.borderRadius="6px";
   button.onclick=()=>{selectedIdentity=ids.id[i];refreshIds();};
   for(const content of [String(i),button,ids.bodyMassG[i].toFixed(2)]){
     const td=document.createElement("td");if(content instanceof HTMLElement)td.appendChild(content);else td.textContent=content;tr.appendChild(td);
   }
   $("idRows").appendChild(tr);
 }
 $("slotText").textContent="ID "+selectedIdentity+" resolves to dense slot "+ids.slot(selectedIdentity)+".";
}
$("idRemove").onclick=()=>{if(ids.remove(selectedIdentity)){selectedIdentity=ids.count?ids.id[0]:null;}refreshIds();};
$("idSpawn").onclick=()=>{const id=ids.spawn();if(id!==null)selectedIdentity=id;refreshIds();};
$("idReset").onclick=()=>{ids=new WorldPrototype({capacity:12,count:4,seed:123});selectedIdentity=ids.id[1];refreshIds();};refreshIds();
function updateQuant(){
 const value=+$("zQuant").value,bits=+$("bitDepth").value,code=quantize(value,0,30,bits);
 const restored=dequantize(code,0,30,bits);
 $("zQuantOut").textContent=value.toFixed(3)+" m";$("code").textContent=String(code);
 $("decoded").textContent=restored.toFixed(4)+" m";$("error").textContent=(Math.abs(restored-value)*100).toFixed(3)+" cm";
 $("quantLine").style.width=(restored/30*100)+"%";
 const n=+$("populationBudget").value;$("budgetOut").textContent=n.toLocaleString();
 $("bytesOut").textContent=(n*32/1048576).toFixed(2)+" MiB";
 $("z8Out").textContent=(n/1048576).toFixed(2)+" MiB";
 $("z16Out").textContent=(n*2/1048576).toFixed(2)+" MiB";
}
["zQuant","bitDepth","populationBudget"].forEach(x=>$(x).addEventListener("input",updateQuant));updateQuant();
function zColors(depth){
 return "hsl("+Math.round(173+depth*80)+" 85% "+Math.round(83-depth*22)+"%)";
}
function selectedSnapshot(){return world.snapshot(selected);}
function updateSpatialControls(){
 const f=selectedSnapshot();if(!f)return;
 $("selectId").textContent="#"+selected;$("zSelected").value=Math.round(f.z/10)*10;
 $("zSelectedOut").textContent=(f.z/100).toFixed(2)+" m";
 updateCounts();
}
function updateCounts(){
 const f=selectedSnapshot();if(!f)return;
 const r=+$("sensing").value,method=$("queryMethod").value;
 const result=world.neighbors(selected,r,method);
 $("radiusOut").textContent=r+" cm";$("nearCount").textContent=result.ids.length;
 $("distanceChecks").textContent=result.checks;$("cellCount").textContent=world.cells.size;
 $("spatialNote").textContent="Selected #"+selected+": X "+(f.x/100).toFixed(1)+" m · Y "+(f.y/100).toFixed(1)+" m · Z "+(f.z/100).toFixed(1)+" m. Candidates "+result.candidateCount+", exact neighbors "+result.ids.length+".";
}
function drawWorld(canvas,topView=false){
 const c=canvas.getContext("2d"),W=canvas.width,H=canvas.height;
 const g=c.createLinearGradient(0,0,0,H);g.addColorStop(0,topView?"#0d3049":"#0c4d67");g.addColorStop(1,"#051728");c.fillStyle=g;c.fillRect(0,0,W,H);
 c.lineWidth=1;c.strokeStyle="#9fcbe620";
 for(let x=0;x<=W;x+=90){c.beginPath();c.moveTo(x,0);c.lineTo(x,H);c.stroke();}
 for(let y=0;y<=H;y+=80){c.beginPath();c.moveTo(0,y);c.lineTo(W,y);c.stroke();}
 const r=+$("sensing").value,fx=x=>x/world.extents.x*W;
 const fy=y=>topView?y/world.extents.z*H:(1-y/world.extents.y)*H;
 const neighbors=new Set(world.neighbors(selected,r,"grid").ids);
 c.textAlign="center";c.textBaseline="middle";
 for(let i=0;i<world.count;i++){
   const id=world.id[i],isSelected=id===selected;
   const depth=world.z[i]/world.extents.z;
   c.globalAlpha=.35+.65*(1-depth);
   c.fillStyle=isSelected?"#ffd28a":neighbors.has(id)?"#74ecc4":zColors(depth);
   const x=fx(world.x[i]),y=fy(topView?world.z[i]:world.y[i]);
   if(topView){c.beginPath();c.arc(x,y,isSelected?6:2.5,0,Math.PI*2);c.fill();}
   else{c.font=(isSelected?"22":"13")+"px Consolas,monospace";c.fillText(isSelected?"><(((º>":">•<",x,y);}
 }
 c.globalAlpha=1;
 const s=selectedSnapshot();
 if(s){
   const x=fx(s.x),y=fy(topView?s.z:s.y);
   c.strokeStyle="#ffd18a";c.lineWidth=2;c.setLineDash([6,5]);c.beginPath();
   c.ellipse(x,y,Math.min(r/world.extents.x*W,W),Math.min((r/(topView?world.extents.z:world.extents.y))*H,H),0,0,Math.PI*2);c.stroke();c.setLineDash([]);
   c.textAlign="left";c.fillStyle="#ffd18a";c.font="14px system-ui";c.fillText("#"+s.id,Math.min(W-40,x+10),Math.max(12,y-10));
 }
 c.fillStyle="#dbf7ff";c.font="12px monospace";c.textAlign="left";
 c.fillText(topView?"TOP X/Z · same 3D fish positions":"SIDE X/Y · tap dot to select",12,20);
}
$("side").addEventListener("click",ev=>{
 const rect=$("side").getBoundingClientRect();
 const x=(ev.clientX-rect.left)/rect.width*world.extents.x;
 const y=(1-(ev.clientY-rect.top)/rect.height)*world.extents.y;
 let best=Infinity,id=selected;
 for(let i=0;i<world.count;i++){const dx=(world.x[i]-x)/world.extents.x*900,dy=(world.y[i]-y)/world.extents.y*410;const d=dx*dx+dy*dy;if(d<best){best=d;id=world.id[i];}}
 selected=id;updateSpatialControls();
});
$("top").addEventListener("click",ev=>{
 const rect=$("top").getBoundingClientRect();const x=(ev.clientX-rect.left)/rect.width*world.extents.x;
 const z=(ev.clientY-rect.top)/rect.height*world.extents.z;
 let best=Infinity,id=selected;
 for(let i=0;i<world.count;i++){const dx=(world.x[i]-x)/world.extents.x*900,dy=(world.z[i]-z)/world.extents.z*320;const d=dx*dx+dy*dy;if(d<best){best=d;id=world.id[i];}}
 selected=id;updateSpatialControls();
});
$("zSelected").oninput=()=>{
 const i=world.slot(selected);
 if(i>=0){world.z[i]=+$("zSelected").value;world.rebuild();updateSpatialControls();}
};
$("sensing").oninput=updateCounts;$("queryMethod").onchange=updateCounts;
$("population").onchange=()=>{
 world=new WorldPrototype({count:+$("population").value,capacity:600,seed:47});selected=world.id[0];paused=false;acc=0;
 $("pauseSpatial").textContent="⏸ Pause";updateSpatialControls();
};
$("pauseSpatial").onclick=()=>{paused=!paused;$("pauseSpatial").textContent=paused?"▶ Resume":"⏸ Pause";};
$("stepSpatial").onclick=()=>{paused=true;$("pauseSpatial").textContent="▶ Resume";world.tick(TIME_STEP);tickCount++;updateSpatialControls();};
$("resetSpatial").onclick=()=>{$("population").onchange();};
function drawTime(){
 const canvas=$("timeCanvas"),c=canvas.getContext("2d"),W=canvas.width,H=canvas.height;
 const hz=+$("displayHz").value,tps=+$("simHz").value;
 c.fillStyle="#071c2d";c.fillRect(0,0,W,H);
 const labels=["Time based · 40 cm/s","Fixed-step snapshot · 40 cm/s","Wrong per-frame assumption"];
 const positions=[time*40,Math.floor(time*tps)/tps*40,time*40*(hz/60)];
 labels.forEach((label,i)=>{
   const y=68+i*110;
   c.font="15px system-ui";c.fillStyle="#c5e4f3";c.textAlign="left";c.fillText(label,20,y-30);
   c.strokeStyle="#395a72";c.beginPath();c.moveTo(20,y+16);c.lineTo(W-20,y+16);c.stroke();
   c.fillStyle=i===2?"#ffb99b":i===1?"#bca8fb":"#84e8ce";
   c.font="29px Consolas,monospace";
   const x=25+((positions[i]%400+400)%400)/400*(W-80);
   c.fillText("><(((º>",x,y+11);
 });
 c.fillStyle="#9ab9d0";c.font="13px system-ui";c.fillText("Selected display: "+hz+" Hz (scenario only) · Sim: "+tps+" TPS",20,H-15);
}
["displayHz","simHz"].forEach(id=>$(id).oninput=()=>{
 $("displayHzOut").textContent=$("displayHz").value+" Hz";$("simHzOut").textContent=$("simHz").value+" TPS";drawTime();
});
const massColors=["#64bbef","#ad9afa","#f1c77c","#8ee6bb"];
function updateBody(){
 const names=["tissue","reserves","gut","repro"];
 const values=names.map(n=> +$(n).value);const sum=values.reduce((a,b)=>a+b,0);
 names.forEach((n,i)=>$(n+"Out").textContent=values[i].toFixed(1)+" g");
 $("totalMass").textContent=sum.toFixed(1)+" g";
 const bars=$("massBars");bars.replaceChildren();
 values.forEach((v,i)=>{const bar=document.createElement("i");bar.style.width=(v/sum*100)+"%";bar.style.background=massColors[i];bar.style.height="100%";bar.style.borderRadius="0";bars.append(bar);});
 const canvas=$("bodyCanvas"),c=canvas.getContext("2d"),W=canvas.width,H=canvas.height;
 c.fillStyle="#081e32";c.fillRect(0,0,W,H);
 c.textAlign="center";c.textBaseline="middle";
 const bodyScale=.76+values[1]/12*.30+values[3]/8*.20;
 c.save();c.translate(W/2,H/2+14);
 c.strokeStyle="#5ab7d4";c.fillStyle="#23729080";c.lineWidth=3;
 c.beginPath();c.ellipse(0,0,205,65*bodyScale,0,0,Math.PI*2);c.fill();c.stroke();
 c.beginPath();c.moveTo(-205,0);c.lineTo(-290,-54);c.lineTo(-280,55);c.closePath();c.stroke();c.fill();
 c.fillStyle="#b8f5fa";c.font="40px Consolas,monospace";c.fillText("><(((º>",0,0);
 c.restore();
 c.textAlign="left";c.font="14px system-ui";c.fillStyle="#d2eaf4";c.fillText("Same fish · reserve / condition changes",22,24);
 c.fillText("Structural length is unchanged in this toy demo",22,H-17);
}
["tissue","reserves","gut","repro"].forEach(id=>$(id).addEventListener("input",updateBody));
updateBody();updateSpatialControls();drawTime();
function frame(now){
 const dt=Math.min(.08,Math.max(0,(now-prev)/1000));prev=now;frameCount++;time+=dt;
 if(!paused){acc+=dt;let guard=0;while(acc>=TIME_STEP&&guard<4){world.tick(TIME_STEP);acc-=TIME_STEP;guard++;tickCount++;}}
 if(current==="space"){drawWorld($("side"));drawWorld($("top"),true);}
 if(current==="time")drawTime();
 if(now-fpsWindow>=1000){const seconds=(now-fpsWindow)/1000;$("actualFps").textContent=Math.round(frameCount/seconds);$("actualTps").textContent=Math.round(tickCount/seconds);frameCount=0;tickCount=0;fpsWindow=now;updateCounts();}
 requestAnimationFrame(frame);
}
pageTo("space");requestAnimationFrame(frame);
