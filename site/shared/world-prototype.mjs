/**
 * ASCean reference mechanics ONLY. Uncalibrated educational World prototype.
 * World units: centimetres; X horizontal, Y vertical, Z into screen.
 * This is not the approved future engine/packages/core implementation.
 */
export const EXTENTS = Object.freeze({x:10000,y:5000,z:3000});
export function quantize(value,min,max,bits=16){
  if(!Number.isFinite(value)||!(max>min)||![8,16].includes(bits))throw Error("Invalid quantizer input");
  const levels=2**bits-1;
  return Math.round(Math.max(0,Math.min(1,(value-min)/(max-min)))*levels);
}
export function dequantize(code,min,max,bits=16){
  if(!Number.isInteger(code)||code<0||code>2**bits-1)throw Error("Invalid quantized code");
  return min+code/(2**bits-1)*(max-min);
}
export class WorldPrototype {
  constructor({capacity=600,count=180,seed=42,extents=EXTENTS,cellCm=500}={}){
    this.capacity=capacity;this.count=0;this.nextId=1;
    this.seed=seed>>>0;this.extents=extents;this.cellCm=cellCm;
    this.id=new Uint32Array(capacity);
    this.x=new Float32Array(capacity);this.y=new Float32Array(capacity);this.z=new Float32Array(capacity);
    this.vx=new Float32Array(capacity);this.vy=new Float32Array(capacity);this.vz=new Float32Array(capacity);
    this.bodyMassG=new Float32Array(capacity);
    this.slotById=new Map();this.cells=new Map();this.tickCount=0;
    for(let i=0;i<count;i++)this.spawn();
    this.rebuild();
  }
  random(){this.seed=(Math.imul(this.seed,1664525)+1013904223)>>>0;return this.seed/4294967296;}
  spawn(data={}){
    if(this.count>=this.capacity)return null;
    const slot=this.count++,id=this.nextId++;
    this.id[slot]=id;
    this.x[slot]=data.x??this.random()*this.extents.x;
    this.y[slot]=data.y??this.random()*this.extents.y;
    this.z[slot]=data.z??this.random()*this.extents.z;
    this.vx[slot]=data.vx??(this.random()-.5)*120;
    this.vy[slot]=data.vy??(this.random()-.5)*75;
    this.vz[slot]=data.vz??(this.random()-.5)*45;
    this.bodyMassG[slot]=data.bodyMassG??(1+this.random()*20);
    this.slotById.set(id,slot);return id;
  }
  slot(id){return this.slotById.get(id)??-1;}
  snapshot(id){
    const i=this.slot(id);if(i<0)return null;
    return {id,x:this.x[i],y:this.y[i],z:this.z[i],vx:this.vx[i],vy:this.vy[i],vz:this.vz[i],bodyMassG:this.bodyMassG[i]};
  }
  remove(id){
    const idx=this.slot(id);if(idx<0)return false;
    const last=--this.count, moved=this.id[last];
    if(idx!==last){
      for(const key of ["id","x","y","z","vx","vy","vz","bodyMassG"])this[key][idx]=this[key][last];
      this.slotById.set(moved,idx);
    }
    this.slotById.delete(id);return true;
  }
  tick(dt){
    if(!Number.isFinite(dt)||dt<=0||dt>0.1)throw Error("Bad fixed step");
    for(let i=0;i<this.count;i++){
      for(const [p,v,limit] of [["x","vx",this.extents.x],["y","vy",this.extents.y],["z","vz",this.extents.z]]){
        let next=this[p][i]+this[v][i]*dt;
        if(next<0){next=-next;this[v][i]=Math.abs(this[v][i]);}
        if(next>limit){next=2*limit-next;this[v][i]=-Math.abs(this[v][i]);}
        this[p][i]=Math.max(0,Math.min(limit,next));
      }
    }
    this.tickCount++;this.rebuild();
  }
  key(a,b,c){return a+","+b+","+c;}
  rebuild(){
    this.cells.clear();const s=this.cellCm;
    for(let i=0;i<this.count;i++){
      const key=this.key(Math.floor(this.x[i]/s),Math.floor(this.y[i]/s),Math.floor(this.z[i]/s));
      if(!this.cells.has(key))this.cells.set(key,[]);
      this.cells.get(key).push(i);
    }
  }
  neighbors(id,radiusCm,method="grid"){
    const i=this.slot(id);if(i<0)return {ids:[],checks:0,candidateCount:0};
    if(!(radiusCm>=0))throw Error("Invalid radius");
    let candidateSlots=[];
    if(method==="all"){
      for(let j=0;j<this.count;j++)candidateSlots.push(j);
    }else if(method==="grid"){
      const s=this.cellCm,n=Math.ceil(radiusCm/s);
      const a=Math.floor(this.x[i]/s),b=Math.floor(this.y[i]/s),c=Math.floor(this.z[i]/s);
      for(let dx=-n;dx<=n;dx++)for(let dy=-n;dy<=n;dy++)for(let dz=-n;dz<=n;dz++){
        const list=this.cells.get(this.key(a+dx,b+dy,c+dz));
        if(list)candidateSlots.push(...list);
      }
    }else throw Error("Unknown method");
    const ids=[];let checks=0;const radiusSquared=radiusCm*radiusCm;
    for(const j of candidateSlots){
      if(j===i)continue;checks++;
      const x=this.x[i]-this.x[j],y=this.y[i]-this.y[j],z=this.z[i]-this.z[j];
      if(x*x+y*y+z*z<=radiusSquared)ids.push(this.id[j]);
    }
    return {ids,checks,candidateCount:candidateSlots.length};
  }
  numericBytes(){
    return [this.id,this.x,this.y,this.z,this.vx,this.vy,this.vz,this.bodyMassG].reduce((n,a)=>n+a.byteLength,0);
  }
}
