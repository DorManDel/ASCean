/**
 * ASCean Anatomy Foundation M0: source-labeled, stage-specific SCHEMATIC geometry.
 * No World, event loop, organ physiology, collision, or scientifically calibrated coordinates.
 * A rendered SVG shape is not a measured anatomical volume.
 */
const evidenceBase = Object.freeze({
  ontology: "https://github.com/ZFIN/zebrafish-anatomical-ontology",
  histology: "https://journals.sagepub.com/doi/10.1177/0192623311409597",
  dissection: "https://pubmed.ncbi.nlm.nih.gov/20203557",
  atlas: "https://zfin.atlassian.net/wiki/spaces/general/pages/1892876451/Anatomy%2BAtlases%2Band%2BResources"
});

export const ANATOMY_LAYERS = deepFreeze([
  {id:"body",name:"Body silhouette",order:10,opacity:0.38,description:"Outer contour is a schematic, not a measured tissue volume"},
  {id:"skeleton",name:"Skeletal landmarks",order:20,opacity:0.88,description:"Approximate vertebral region, not segmented individual bones"},
  {id:"organs",name:"Internal organs",order:30,opacity:0.92,description:"Illustrative lateral placement; overlaps and shape are not volumetric"},
  {id:"surface",name:"Surface / eye / fins",order:40,opacity:0.90,description:"Anatomical surface and orientation cues"},
  {id:"ascii",name:"Original ASCII representation",order:50,opacity:0.80,description:"Symbolic overlay, independent of biological truth"},
  {id:"labels",name:"Landmarks / labels",order:60,opacity:1,description:"Inspector annotations, no organism state"}
]);

const landmarks = {
  tailFork: {x:0.055,y:0.51},
  tailBase: {x:0.225,y:0.515},
  snout: {x:0.983,y:0.52},
  eye: {x:0.875,y:0.355},
  gill: {x:0.78,y:0.485},
  heartSite: {x:0.777,y:0.655},
  spineMid: {x:0.51,y:0.41},
  gutMid: {x:0.515,y:0.665},
  intestinalBulbRegion: {x:0.66,y:0.64},
  swimBladderMid: {x:0.475,y:0.43},
  kidneyRegion: {x:0.49,y:0.29},
  brainRegion: {x:0.895,y:0.30},
  anus: {x:0.265,y:0.805},
  back: {x:0.51,y:0.165},
  belly: {x:0.52,y:0.835},
  dorsalFin: {x:0.485,y:0.16},
  analFin: {x:0.295,y:0.82},
  pectoralFin: {x:0.76,y:0.68},
  jaw: {x:0.90,y:0.665}
};

const part = (id,label,layerId,anchorId,kind,width,height,more={}) => ({
  id,label,layerId,anchorId,kind,width,height,
  evidence: {
    identity:"literature_supported",
    shape:"illustrative",
    placement:"illustrative",
    speciesStage:"adult",
    source:more.source??evidenceBase.histology
  },
  description:more.description??"Schematic display only; quantitative placement is uncalibrated.",
  color:more.color??"#b7d9ef",
  fieldKey:more.fieldKey??null
});

export const ADULT_ZEBRAFISH_ANATOMY = deepFreeze({
  id:"danio_rerio_anatomy",
  version:1,
  speciesId:"danio_rerio",
  speciesName:"Danio rerio",
  stage:"adult",
  environment:"freshwater",
  coord:"normalized lateral profile, head at +X, +Y down; NOT World Y/Z",
  evidenceSources:evidenceBase,
  placementCalibration:"not_calibrated",
  landmarks,
  layers:ANATOMY_LAYERS,
  parts:[
    part("spine","Vertebral column","skeleton","spineMid","line",0.49,0.05,{color:"#b8e8f1",description:"Axial skeletal region; vertebra count and actual shape not registered."}),
    part("skull","Skull / cranium","skeleton","brainRegion","ellipse",0.13,0.21,{color:"#b0d0ee",description:"Schematic skull envelope; precise cranial bones not resolved."}),
    part("gills","Gills","organs","gill","ellipse",0.125,0.31,{color:"#f099a5",fieldKey:"demo:gill-region",description:"Respiratory structures; displayed lateral footprint is illustrative."}),
    part("heart","Heart","organs","heartSite","ellipse",0.064,0.135,{color:"#f4728c",fieldKey:"demo:heart-site",description:"Anterior ventral heart region; actual chambers / flow not simulated."}),
    part("intestinalBulb","Intestinal bulb","organs","intestinalBulbRegion","ellipse",0.16,0.14,{color:"#e9b46d",fieldKey:"demo:intestinal-bulb",description:"Zebrafish does not have a true stomach; anterior intestinal bulb is represented."}),
    part("intestine","Intestine","organs","gutMid","curve",0.28,0.22,{color:"#ffcd8b",fieldKey:"demo:intestine",description:"Folded intestinal tract, schematically drawn; no gut motion model."}),
    part("swimBladder","Swim bladder","organs","swimBladderMid","ellipse",0.26,0.11,{color:"#8ad1f1",fieldKey:"demo:swim-bladder",description:"Buoyancy organ, depicted schematically; no pressure/volume solver."}),
    part("kidney","Kidney region","organs","kidneyRegion","ellipse",0.28,0.065,{color:"#ac94d6",fieldKey:"demo:kidney",description:"Adult kidney situated dorsally; tissue not segmented."}),
    part("brain","Brain region","organs","brainRegion","ellipse",0.095,0.12,{color:"#b39fea",fieldKey:"demo:brain",description:"Brain region inside skull; no cellular map."}),
    part("eye","Eye","surface","eye","ellipse",0.045,0.095,{color:"#e7f7fd",fieldKey:"demo:eye",description:"External visible eye; field of view not modeled."}),
    part("dorsalFin","Dorsal fin","surface","dorsalFin","fin",0.19,0.27,{color:"#79bedb",fieldKey:"demo:dorsal-fin",description:"Schematic dorsal fin attachment."}),
    part("pectoralFin","Pectoral fin","surface","pectoralFin","fin",0.125,0.15,{color:"#8fcad9",fieldKey:"demo:pectoral-fin",description:"Lateral pectoral fin, not a fin-ray articulation model."}),
    part("analFin","Anal fin","surface","analFin","fin",0.10,0.16,{color:"#81b9d6",fieldKey:"demo:anal-fin",description:"Schematic anal fin attachment."})
  ],
  // Keys are explicitly illustrative aliases. Allocate canonical FieldIDs through the
  // real Field Registry only after reviewing uniqueness, schema versions, and ownership.
  fields: [
    {key:"demo:standard-length",name:"Standard Length",unit:"cm",anchors:["snout","tailBase"],meaning:"Snout to caudal-fin base, excluding caudal fin",source:evidenceBase.histology},
    {key:"demo:heart-site",name:"Heart site",unit:"normalized",anchors:["heartSite"],meaning:"Anatomical landmark, not heartbeat rate",source:evidenceBase.histology},
    {key:"demo:swim-bladder",name:"Swim bladder site",unit:"normalized",anchors:["swimBladderMid"],meaning:"Schematic position, not volume estimate",source:evidenceBase.histology}
  ]
});

/** Freeze nested species definitions so visual edits cannot alter shared defaults. */
export function deepFreeze(value){
  if(value&&typeof value==="object"&&!Object.isFrozen(value)){
    for(const x of Object.values(value))deepFreeze(x);
    Object.freeze(value);
  }
  return value;
}

const plainCopy = x => JSON.parse(JSON.stringify(x));
const layerById = Object.fromEntries(ANATOMY_LAYERS.map(x=>[x.id,x]));
const partsById = Object.fromEntries(ADULT_ZEBRAFISH_ANATOMY.parts.map(x=>[x.id,x]));

export function validateBlueprint(bp=ADULT_ZEBRAFISH_ANATOMY){
  if(!bp||typeof bp.id!=="string"||!Number.isSafeInteger(bp.version))throw Error("ANATOMY_BLUEPRINT_INVALID");
  const layerIDs=new Set(),partIDs=new Set();
  for(const l of bp.layers){if(layerIDs.has(l.id)||!Number.isFinite(l.order))throw Error("ANATOMY_LAYER_DUPLICATE_OR_INVALID");layerIDs.add(l.id);}
  for(const [id,xy] of Object.entries(bp.landmarks)){
    if(!id||![xy.x,xy.y].every(n=>Number.isFinite(n)&&n>=-0.5&&n<=1.5))throw Error("ANATOMY_ANCHOR_OUT_OF_RANGE: "+id);
  }
  for(const p of bp.parts){
    if(partIDs.has(p.id)||!layerIDs.has(p.layerId)||!bp.landmarks[p.anchorId])throw Error("ANATOMY_PART_REFERENCE_INVALID: "+p.id);
    if(!(p.width>0&&p.height>0))throw Error("ANATOMY_PART_DIMENSIONS_INVALID: "+p.id);
    partIDs.add(p.id);
  }
  if(bp.speciesId==="danio_rerio"&&bp.stage==="adult"&&partIDs.has("stomach"))throw Error("ZEBRAFISH_STOMACH_NOT_APPLICABLE");
  return true;
}
validateBlueprint();

export function createAnatomyInstance(entityId,blueprint=ADULT_ZEBRAFISH_ANATOMY){
  if(!(typeof entityId==="string"&&entityId.trim()))throw Error("ANATOMY_ENTITY_ID_REQUIRED");
  validateBlueprint(blueprint);
  return {
    schemaVersion:1,
    entityId,
    blueprint:{id:blueprint.id,version:blueprint.version},
    anchorOverrides:{},
    layerOverrides:{},
    selectedPartId:"heart"
  };
}
export function validateInstance(instance,bp=ADULT_ZEBRAFISH_ANATOMY){
  if(!instance||instance.schemaVersion!==1||!instance.blueprint||instance.blueprint.id!==bp.id||instance.blueprint.version!==bp.version)throw Error("ANATOMY_INSTANCE_BLUEPRINT_MISMATCH");
  if(typeof instance.entityId!=="string"||!instance.entityId.trim())throw Error("ANATOMY_ENTITY_ID_REQUIRED");
  for(const [id,xy] of Object.entries(instance.anchorOverrides||{})){
    if(!bp.landmarks[id]||!xy||![xy.x,xy.y].every(n=>Number.isFinite(n)&&n>=-0.5&&n<=1.5))throw Error("ANATOMY_INSTANCE_ANCHOR_INVALID: "+id);
  }
  for(const [id,cfg] of Object.entries(instance.layerOverrides||{})){
    if(!bp.layers.find(l=>l.id===id)||!cfg||typeof cfg!=="object")throw Error("ANATOMY_INSTANCE_LAYER_INVALID: "+id);
    for(const k of Object.keys(cfg))if(!["visible","opacity"].includes(k))throw Error("ANATOMY_INSTANCE_LAYER_FIELD_INVALID: "+k);
    if("visible" in cfg&&typeof cfg.visible!=="boolean")throw Error("ANATOMY_INSTANCE_VISIBILITY_INVALID");
    if("opacity" in cfg&&(!Number.isFinite(cfg.opacity)||cfg.opacity<0||cfg.opacity>1))throw Error("ANATOMY_INSTANCE_OPACITY_INVALID");
  }
  if(!bp.parts.some(p=>p.id===instance.selectedPartId))throw Error("ANATOMY_INSTANCE_PART_UNKNOWN");
  return true;
}
export function resolveLandmark(id,instance,bp=ADULT_ZEBRAFISH_ANATOMY){
  if(!bp.landmarks[id])throw Error("ANATOMY_ANCHOR_UNKNOWN: "+id);
  return instance.anchorOverrides[id]??bp.landmarks[id];
}
export function resolvePart(partId,instance,bp=ADULT_ZEBRAFISH_ANATOMY){
  validateInstance(instance,bp);
  const p=bp.parts.find(x=>x.id===partId);
  if(!p)throw Error("ANATOMY_PART_UNKNOWN: "+partId);
  return {...p,position:{...resolveLandmark(p.anchorId,instance,bp)},presentation:"illustrative-not-calibrated"};
}
export function resolveLayer(layerId,instance,bp=ADULT_ZEBRAFISH_ANATOMY){
  const l=bp.layers.find(x=>x.id===layerId);
  if(!l)throw Error("ANATOMY_LAYER_UNKNOWN: "+layerId);
  const edit=instance.layerOverrides[layerId]??{};
  return {...l,visible:edit.visible??true,opacity:edit.opacity??l.opacity};
}
export function orderedLayers(bp=ADULT_ZEBRAFISH_ANATOMY){
  return [...bp.layers].sort((a,b)=>a.order-b.order||a.id.localeCompare(b.id));
}
export function setLayerOverride(instance,layerId,value,bp=ADULT_ZEBRAFISH_ANATOMY){
  const l=bp.layers.find(x=>x.id===layerId);if(!l)throw Error("ANATOMY_LAYER_UNKNOWN");
  const proposed={...instance.layerOverrides,[layerId]:{...(instance.layerOverrides[layerId]??{}),...value}};
  const cfg=proposed[layerId];
  // Remove default-value deltas: an unchanged instance references only its Blueprint.
  for(const key of Object.keys(cfg)){
    if((key==="visible"&&cfg[key]===true)||(key==="opacity"&&cfg[key]===l.opacity))delete cfg[key];
  }
  if(!Object.keys(cfg).length)delete proposed[layerId];
  const next={...instance,layerOverrides:proposed};
  validateInstance(next,bp);return next;
}
export function setAnchorOverride(instance,anchorId,x,y,bp=ADULT_ZEBRAFISH_ANATOMY){
  if(!bp.landmarks[anchorId])throw Error("ANATOMY_ANCHOR_UNKNOWN");
  const overrides={...instance.anchorOverrides,[anchorId]:{x,y}};
  if(x===bp.landmarks[anchorId].x&&y===bp.landmarks[anchorId].y)delete overrides[anchorId];
  const next={...instance,anchorOverrides:overrides};validateInstance(next,bp);return next;
}
export function serializeInstance(instance,bp=ADULT_ZEBRAFISH_ANATOMY){
  validateInstance(instance,bp);
  return JSON.stringify(instance,null,2);
}
export function parseInstance(serialized,bp=ADULT_ZEBRAFISH_ANATOMY){
  const raw=JSON.parse(serialized);validateInstance(raw,bp);return plainCopy(raw);
}
export {evidenceBase};
