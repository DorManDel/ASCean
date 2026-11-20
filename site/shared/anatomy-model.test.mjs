import test from "node:test";
import assert from "node:assert/strict";
import {
  ADULT_ZEBRAFISH_ANATOMY as bp,
  validateBlueprint, createAnatomyInstance, validateInstance,
  resolvePart, resolveLayer, resolveLandmark, orderedLayers,
  setAnchorOverride, setLayerOverride, serializeInstance, parseInstance
} from "./anatomy-model.mjs";

test("adult Zebrafish blueprint has correct stage, reference links and no true stomach",()=>{
  assert.equal(validateBlueprint(bp),true);
  assert.equal(bp.speciesId,"danio_rerio");
  assert.equal(bp.stage,"adult");
  assert.equal(bp.environment,"freshwater");
  assert.equal(bp.parts.some(p=>p.id==="stomach"),false);
  assert.ok(bp.parts.some(p=>p.id==="intestinalBulb"));
  assert.ok(Object.isFrozen(bp));
  assert.ok(Object.isFrozen(bp.landmarks));
  assert.ok(Object.isFrozen(bp.parts[0]));
  for(const p of bp.parts){
    assert.ok(p.evidence.source.startsWith("https://"));
    assert.equal(p.evidence.placement,"illustrative");
  }
});

test("ordered visual layers have deterministic, unique drawing roles",()=>{
  const layers=orderedLayers();
  assert.deepEqual(layers.map(l=>l.id),["body","skeleton","organs","surface","ascii","labels"]);
  assert.equal(new Set(layers.map(l=>l.id)).size,layers.length);
  for(let i=1;i<layers.length;i++)assert.ok(layers[i].order>layers[i-1].order);
});

test("individual overrides do not change shared species defaults or another fish",()=>{
  const a=createAnatomyInstance("entity-42"),b=createAnatomyInstance("entity-43");
  const initial=bp.landmarks.heartSite;
  const changed=setAnchorOverride(a,"heartSite",0.72,0.60);
  assert.notEqual(changed,a);
  assert.equal(resolvePart("heart",changed).position.x,0.72);
  assert.deepEqual(resolveLandmark("heartSite",b),initial);
  assert.deepEqual(bp.landmarks.heartSite,initial);
  assert.deepEqual(a.anchorOverrides,{});
  assert.equal(changed.blueprint.id,bp.id);
});

test("layer visibility is display-only and unchanged defaults are omitted",()=>{
  const a=createAnatomyInstance("entity-42");
  const off=setLayerOverride(a,"organs",{visible:false});
  assert.equal(resolveLayer("organs",off).visible,false);
  assert.equal(resolveLayer("organs",a).visible,true);
  assert.equal(bp.parts.some(x=>x.id==="heart"),true);
  const restored=setLayerOverride(off,"organs",{visible:true});
  assert.equal(restored.layerOverrides.organs,undefined);
});

test("full precision export/import keeps personal deltas and version",()=>{
  const a=createAnatomyInstance("entity-42");
  const b=setLayerOverride(setAnchorOverride(a,"eye",0.87913,0.35527),"skeleton",{opacity:.43});
  const json=serializeInstance(b);
  const restored=parseInstance(json);
  assert.deepEqual(restored,b);
  assert.equal(restored.anchorOverrides.eye.x,.87913);
});

test("invalid anchors, layer edits and Blueprint versions are rejected",()=>{
  const a=createAnatomyInstance("entity-42");
  assert.throws(()=>setAnchorOverride(a,"bogus",0.2,0.1),/ANATOMY_ANCHOR_UNKNOWN/);
  assert.throws(()=>setAnchorOverride(a,"heartSite",Infinity,0.1),/ANATOMY_INSTANCE_ANCHOR_INVALID/);
  assert.throws(()=>setLayerOverride(a,"organs",{opacity:2}),/ANATOMY_INSTANCE_OPACITY_INVALID/);
  assert.throws(()=>setLayerOverride(a,"organs",{mystery:true}),/ANATOMY_INSTANCE_LAYER_FIELD_INVALID/);
  assert.throws(()=>parseInstance(JSON.stringify({...a,blueprint:{id:bp.id,version:2}})),/ANATOMY_INSTANCE_BLUEPRINT_MISMATCH/);
});

test("scientific invalidity: cannot add a true stomach to adult Zebrafish",()=>{
  const clone=structuredClone(bp);
  clone.parts.push({...clone.parts[0],id:"stomach"});
  assert.throws(()=>validateBlueprint(clone),/ZEBRAFISH_STOMACH_NOT_APPLICABLE/);
});

test("an anatomy instance cannot hold a missing selected part",()=>{
  const a=createAnatomyInstance("entity-42");
  assert.throws(()=>validateInstance({...a,selectedPartId:"not-a-part"}),/ANATOMY_INSTANCE_PART_UNKNOWN/);
});
