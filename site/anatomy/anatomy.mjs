import {
  ADULT_ZEBRAFISH_ANATOMY as bp, ANATOMY_LAYERS,
  createAnatomyInstance, validateInstance, resolveLandmark,
  resolvePart, resolveLayer, orderedLayers, setLayerOverride,
  setAnchorOverride, serializeInstance, parseInstance
} from "../shared/anatomy-model.mjs";

const $=id=>document.getElementById(id),ns="http://www.w3.org/2000/svg";
const makeSvg=(tag,attributes={})=>{
  const node=document.createElementNS(ns,tag);
  for(const [key,value] of Object.entries(attributes))node.setAttribute(key,String(value));
  return node;
};
const project=point=>({x:150+point.x*700,y:100+point.y*260});
const partById=Object.fromEntries(bp.parts.map(p=>[p.id,p]));
let instance=createAnatomyInstance("illustrative-entity-001");
let fieldView="human",showLandmarks=false,mode="anatomy";
instance=setLayerOverride(instance,"ascii",{visible:false});
instance=setLayerOverride(instance,"labels",{visible:false});
function log(message,error=false){
  $("diagnostics").textContent=(error?"ERROR: ":"")+message;
  $("diagnostics").style.color=error?"#ffb9b2":"#9fe6ca";
}
function selected(){const p=partById[instance.selectedPartId];return {p,point:resolveLandmark(p.anchorId,instance)};}
function choosePart(id){
  if(!partById[id])return;
  instance={...instance,selectedPartId:id};renderParts();renderInspector();renderStage();
}
function drawPart(part){
  const p=resolvePart(part.id,instance),pos=project(p.position),w=p.width*700,h=p.height*260;
  const attrs={fill:p.color,stroke:p.color,"stroke-width":2,"data-part":p.id,role:"button",tabindex:0,"aria-label":p.label};
  let e;
  if(p.id==="spine")e=makeSvg("path",{...attrs,d:"M "+(pos.x-w/2)+" "+(pos.y+10)+" Q "+pos.x+" "+(pos.y-20)+" "+(pos.x+w/2)+" "+(pos.y-30),fill:"none","stroke-width":4});
  else if(p.id==="intestine"){
    const x=pos.x,y=pos.y;
    e=makeSvg("path",{...attrs,d:"M "+(x-w*.52)+" "+(y-5)+" C "+(x-w*.19)+" "+(y-h*.8)+" "+(x-w*.02)+" "+(y+h*.75)+" "+(x+w*.25)+" "+(y-6)+" S "+(x+w*.46)+" "+(y+h*.25)+" "+(x+w*.55)+" "+(y+10),fill:"none","stroke-width":Math.max(5,h*.12),"stroke-linecap":"round"});
  }else if(p.kind==="fin"){
    const side=p.id==="dorsalFin"?-1:1;
    e=makeSvg("path",{...attrs,d:"M "+(pos.x-w/2)+" "+pos.y+" Q "+pos.x+" "+(pos.y+side*h*.9)+" "+(pos.x+w/2)+" "+pos.y+" Z","fill-opacity":.46});
  }else e=makeSvg("ellipse",{...attrs,cx:pos.x,cy:pos.y,rx:w/2,ry:h/2,"fill-opacity":p.id==="skull"?.2:.5});
  if(instance.selectedPartId===p.id)e.classList.add("focused");
  e.addEventListener("click",()=>choosePart(p.id));
  e.addEventListener("keydown",event=>{if(event.key==="Enter"||event.key===" "){event.preventDefault();choosePart(p.id);}});
  return e;
}
function renderStage(){
  const container=$("anatomyLayers");container.replaceChildren();
  for(const l of orderedLayers()){
    const presentation=resolveLayer(l.id,instance);if(!presentation.visible)continue;
    const group=makeSvg("g",{"data-layer":l.id,opacity:presentation.opacity});
    if(l.id==="body"){
      group.append(makeSvg("path",{d:"M300 238 C350 160 474 135 595 152 C730 169 817 197 864 237 Q853 280 775 311 C655 357 464 341 300 261 L155 343 L180 243 L155 143 Z",fill:"#508eaa","fill-opacity":.68,stroke:"#9ccee1","stroke-width":3}));
    }else if(l.id==="labels"){
      if(showLandmarks)for(const [id] of Object.entries(bp.landmarks)){
        const p=project(resolveLandmark(id,instance));group.append(makeSvg("circle",{cx:p.x,cy:p.y,r:3,fill:"#ffdd9c"}));
      }
      const p=partById[instance.selectedPartId],pos=project(resolveLandmark(p.anchorId,instance));
      const label=makeSvg("text",{x:pos.x+14,y:pos.y-14,fill:"#ffe1a1","font-size":17});
      label.textContent=p.label;group.append(label);
      const nose=project(resolveLandmark("snout",instance)),tail=project(resolveLandmark("tailBase",instance));
      group.append(makeSvg("path",{d:"M "+tail.x+" 385 H "+nose.x,stroke:"#efc47d","stroke-width":2,"stroke-dasharray":"7 5",fill:"none"}));
      const sl=makeSvg("text",{x:(tail.x+nose.x)/2,y:405,"text-anchor":"middle",fill:"#efc47d","font-size":13});
      sl.textContent="SL: snout → caudal-fin base (schematic landmarks)";group.append(sl);
    }else if(l.id==="ascii"){
      const glyph=makeSvg("text",{x:370,y:448,fill:"#d4bcff","font-family":"monospace","font-size":34,"letter-spacing":3});
      glyph.textContent="><(((º>";group.append(glyph);
    }else for(const part of bp.parts.filter(p=>p.layerId===l.id))group.append(drawPart(part));
    container.append(group);
  }
  $("selectionBanner").textContent=partById[instance.selectedPartId].label+" · anatomy region";
}
function renderLayers(){
  const root=$("layerList");root.replaceChildren();
  for(const l of ANATOMY_LAYERS){
    const state=resolveLayer(l.id,instance),wrap=document.createElement("div");wrap.className="layer-row";
    const check=document.createElement("input");check.type="checkbox";check.checked=state.visible;check.id="layer-"+l.id;check.setAttribute("aria-label","Show "+l.name);
    check.addEventListener("change",()=>{instance=setLayerOverride(instance,l.id,{visible:check.checked});renderStage();log(l.name+": "+(check.checked?"visible":"hidden"));});
    const label=document.createElement("label");label.htmlFor=check.id;label.textContent=l.name;
    const output=document.createElement("output");output.textContent=Math.round(state.opacity*100)+"%";
    const slider=document.createElement("input");slider.type="range";slider.min=0;slider.max=1;slider.step=.05;slider.value=state.opacity;slider.setAttribute("aria-label",l.name+" opacity");
    slider.addEventListener("input",()=>{instance=setLayerOverride(instance,l.id,{opacity:Number(slider.value)});output.textContent=Math.round(Number(slider.value)*100)+"%";renderStage();});
    wrap.append(check,label,output,slider);root.append(wrap);
  }
}
function renderParts(){
  const root=$("partList");root.replaceChildren();
  for(const part of bp.parts){
    const button=document.createElement("button");button.className="part-button";button.textContent=part.label;
    button.setAttribute("aria-current",String(part.id===instance.selectedPartId));
    const dot=document.createElement("span");dot.textContent="●";dot.style.color=part.color;button.append(dot);
    button.addEventListener("click",()=>choosePart(part.id));root.append(button);
  }
}
function renderField(){
  document.querySelectorAll("[data-view]").forEach(b=>b.setAttribute("aria-pressed",String(b.dataset.view===fieldView)));
  const {p,point}=selected(),ref=p.evidence.source;
  const values={
    human:p.label+"\n"+p.description+"\n\nIdentity: literature-supported.\nShape and position: illustrative.\nReference: "+ref,
    schema:"partId: "+p.id+"\nlayer: "+p.layerId+"\nanchor: "+p.anchorId+"\nfieldKey: "+(p.fieldKey??"not allocated")+"\ngeometry: "+p.kind+"\nspecies: Danio rerio\nstage: adult\nowner: inspector visual state",
    memory:"Species blueprint: shared immutable v"+bp.version+"\nInstance: "+instance.entityId+"\nPath: anchorOverrides["+JSON.stringify(p.anchorId)+"]\nResolved normalized (x,y): "+point.x.toFixed(3)+", "+point.y.toFixed(3)+"\nStored personal delta: "+Boolean(instance.anchorOverrides[p.anchorId])+"\nActual memory address/offset: unknown"
  };
  $("fieldDetail").textContent=values[fieldView];
}
function renderInspector(){
  const {p,point}=selected();$("partTitle").textContent=p.label;$("partMeaning").textContent=p.description;
  $("anchorName").textContent=p.anchorId;
  $("anchorX").value=point.x;$("anchorY").value=point.y;
  $("anchorXLabel").textContent=point.x.toFixed(3);$("anchorYLabel").textContent=point.y.toFixed(3);
  $("partSource").href=p.evidence.source;
  $("partSource").title="Literature supports organ identity, not exact coordinates";
  renderField();
}
function renderAll(){validateInstance(instance);renderLayers();renderParts();renderInspector();renderStage();}
for(const id of ["anchorX","anchorY"])$(id).addEventListener("input",()=>{
  const {p}=selected(),x=Number($("anchorX").value),y=Number($("anchorY").value);
  instance=setAnchorOverride(instance,p.anchorId,x,y);
  $("anchorXLabel").textContent=x.toFixed(3);$("anchorYLabel").textContent=y.toFixed(3);
  renderField();renderStage();log("Personal anchor override: "+p.anchorId);
});
$("resetAnchor").addEventListener("click",()=>{
  const {p}=selected(),xy=bp.landmarks[p.anchorId];
  instance=setAnchorOverride(instance,p.anchorId,xy.x,xy.y);renderInspector();renderStage();log("Restored anchor: "+p.anchorId);
});
function preset(name){
  const spec=name==="xray"?{body:.18,skeleton:1,organs:1,surface:.38,ascii:0,labels:.88}:{body:.9,skeleton:0,organs:0,surface:1,ascii:0,labels:.4};
  for(const [id,opacity] of Object.entries(spec))instance=setLayerOverride(instance,id,{visible:opacity>0,opacity});
  renderLayers();renderStage();log(name==="xray"?"X-ray is a visualization preset, not measured radiography.":"External silhouette preset.");
}
$("presetXray").addEventListener("click",()=>preset("xray"));
$("presetSkin").addEventListener("click",()=>preset("skin"));
$("resetVisual").addEventListener("click",()=>{instance={...instance,layerOverrides:{}};renderAll();log("Default layer settings restored");});
function setMode(){
  $("modeAnatomy").setAttribute("aria-pressed",String(mode==="anatomy"));
  $("modeASCII").setAttribute("aria-pressed",String(mode==="ascii"));
}
$("modeAnatomy").addEventListener("click",()=>{mode="anatomy";preset("xray");setMode();});
$("modeASCII").addEventListener("click",()=>{
  mode="ascii";
  for(const l of ANATOMY_LAYERS)instance=setLayerOverride(instance,l.id,{visible:["body","ascii","labels"].includes(l.id)});
  renderAll();setMode();
});
$("showLandmarks").addEventListener("click",()=>{
  showLandmarks=!showLandmarks;instance=setLayerOverride(instance,"labels",{visible:showLandmarks});
  $("showLandmarks").setAttribute("aria-pressed",String(showLandmarks));renderLayers();renderStage();
});
$("resetAll").addEventListener("click",()=>{
  instance=createAnatomyInstance("illustrative-entity-001");
  instance=setLayerOverride(instance,"ascii",{visible:false});
  instance=setLayerOverride(instance,"labels",{visible:false});
  mode="anatomy";showLandmarks=false;setMode();
  $("showLandmarks").setAttribute("aria-pressed","false");renderAll();log("Personal instance reset; Blueprint unchanged");
});
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>{fieldView=b.dataset.view;renderField();}));
$("exportInstance").addEventListener("click",()=>{
  const blob=new Blob([serializeInstance(instance)],{type:"application/json"}),url=URL.createObjectURL(blob);
  const a=document.createElement("a");a.href=url;a.download="ascean-anatomy-instance-v1.json";a.click();
  setTimeout(()=>URL.revokeObjectURL(url),1000);log("Exported full-precision instance deltas.");
});
$("importInstance").addEventListener("click",()=>$("inputInstance").click());
$("inputInstance").addEventListener("change",async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try{
    if(file.size>100000)throw Error("Import exceeds 100 KB limit");
    instance=parseInstance(await file.text());renderAll();log("Imported validated instance state.");
  }catch(err){log("Import rejected: "+err.message,true);}finally{e.target.value="";}
});
setMode();renderAll();log("M0 anatomy schematic loaded. No separate physics or physiology simulation.");
