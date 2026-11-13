import test from "node:test";import assert from "node:assert/strict";
import {WorldPrototype,quantize,dequantize} from "./world-prototype.mjs";
test("dense removal preserves permanent IDs",()=>{
 const w=new WorldPrototype({capacity:6,count:0});
 const a=w.spawn({x:20}),b=w.spawn({x:30}),c=w.spawn({x:40});
 assert.equal(w.remove(b),true);assert.equal(w.slot(b),-1);assert.equal(w.slot(c),1);
 assert.equal(w.snapshot(c).x,40);assert.ok(w.spawn()>c);assert.equal(w.remove(b),false);
});
test("3D grid query matches brute force and rejects distant Z",()=>{
 const w=new WorldPrototype({capacity:8,count:0,cellCm:100});
 const a=w.spawn({x:100,y:100,z:100}),b=w.spawn({x:120,y:100,z:100});
 const c=w.spawn({x:100,y:100,z:900});w.rebuild();
 assert.deepEqual(w.neighbors(a,50).ids,[b]);
 assert.deepEqual(w.neighbors(a,50).ids,w.neighbors(a,50,"all").ids);
 assert.ok(!w.neighbors(a,50).ids.includes(c));
});
test("fixed simulation dt independent of display frame count",()=>{
 const opts={capacity:2,count:0};
 const a=new WorldPrototype(opts),b=new WorldPrototype(opts);
 const data={x:100,y:100,z:100,vx:40,vy:0,vz:0};
 const id=a.spawn(data);b.spawn(data);
 for(let n=0;n<30;n++)a.tick(1/30);
 for(let n=0;n<60;n++)b.tick(1/60);
 assert.ok(Math.abs(a.snapshot(id).x-b.snapshot(id).x)<.002);
});
test("8 and 16 bit depth quantization have bounded errors",()=>{
 const value=26.381;
 for(const bits of [8,16]){
   const q=quantize(value,0,30,bits);const v=dequantize(q,0,30,bits);
   assert.ok(Math.abs(value-v)<=30/(2**bits-1)/2+1e-9);
 }
});
test("reproducible seed",()=>{
 const a=new WorldPrototype({count:30,seed:123});
 const b=new WorldPrototype({count:30,seed:123});
 assert.deepEqual(Array.from(a.x),Array.from(b.x));
});
test("bounds and capacity",()=>{
 const w=new WorldPrototype({capacity:1,count:0});
 assert.ok(w.spawn());assert.equal(w.spawn(),null);w.tick(1/30);
});
