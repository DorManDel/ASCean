/** ASCean M0. All dimensions centimeters; time seconds. No biological calibration. */
export type FishId = number;
export type FishInput = Partial<{x:number;y:number;z:number;vx:number;vy:number;vz:number;energy:number;}>;
export type NeighborMethod = "grid" | "all";
export class World {
  readonly capacity:number;
  readonly widthCm=10000; readonly heightCm=5000; readonly depthCm=3000;
  count=0; tick=0; private nextId=1; private seed:number;
  readonly id:Uint32Array; readonly x:Float32Array; readonly y:Float32Array; readonly z:Float32Array;
  readonly vx:Float32Array; readonly vy:Float32Array; readonly vz:Float32Array; readonly energy:Float32Array;
  private readonly slots=new Map<FishId,number>();
  private readonly cells=new Map<string,number[]>();
  cellSizeCm=500;
  constructor(capacity=2000, seed=42){
    if(!Number.isInteger(capacity)||capacity<1)throw new RangeError("capacity");
    this.capacity=capacity; this.seed=seed>>>0;
    this.id=new Uint32Array(capacity);this.x=new Float32Array(capacity);this.y=new Float32Array(capacity);
    this.z=new Float32Array(capacity);this.vx=new Float32Array(capacity);this.vy=new Float32Array(capacity);
    this.vz=new Float32Array(capacity);this.energy=new Float32Array(capacity);
  }
  random():number{this.seed=(Math.imul(1664525,this.seed)+1013904223)>>>0;return this.seed/4294967296;}
  spawn(d:FishInput={}):FishId|null{
    if(this.count===this.capacity)return null;
    const i=this.count++,id=this.nextId++;this.id[i]=id;
    this.x[i]=d.x??this.random()*this.widthCm;this.y[i]=d.y??this.random()*this.heightCm;
    this.z[i]=d.z??this.random()*this.depthCm;
    this.vx[i]=d.vx??(this.random()-.5)*100;this.vy[i]=d.vy??(this.random()-.5)*60;
    this.vz[i]=d.vz??(this.random()-.5)*30;this.energy[i]=d.energy??100;
    this.slots.set(id,i);return id;
  }
  slotOf(id:FishId):number{return this.slots.get(id)??-1;}
  remove(id:FishId):boolean{
    const i=this.slots.get(id);if(i===undefined)return false;
    const last=this.count-1,moved=this.id[last];
    if(i!==last){for(const arr of [this.id,this.x,this.y,this.z,this.vx,this.vy,this.vz,this.energy])arr[i]=arr[last];this.slots.set(moved,i);}
    this.slots.delete(id);this.count--;return true;
  }
  fish(id:FishId){const i=this.slotOf(id);return i<0?null:{id,slot:i,x:this.x[i],y:this.y[i],z:this.z[i],energy:this.energy[i]};}
  step(dt:number):void{
    if(!Number.isFinite(dt)||dt<=0||dt>.25)throw new RangeError("dt");
    for(let i=0;i<this.count;i++){
      for(const [pos,vel,limit] of [[this.x,this.vx,this.widthCm],[this.y,this.vy,this.heightCm],[this.z,this.vz,this.depthCm]] as const){
        let p=pos[i]+vel[i]*dt;
        if(p<0){p=-p;vel[i]=Math.abs(vel[i]);}
        if(p>limit){p=2*limit-p;vel[i]=-Math.abs(vel[i]);}
        pos[i]=Math.max(0,Math.min(limit,p));
      }
    }
    this.tick++;this.rebuildGrid();
  }
  private key(x:number,y:number,z:number){return x+":"+y+":"+z;}
  rebuildGrid(cellSize=this.cellSizeCm):void{
    if(!(cellSize>0)||!Number.isFinite(cellSize))throw new RangeError("cellSize");
    this.cellSizeCm=cellSize;this.cells.clear();
    for(let i=0;i<this.count;i++){
      const key=this.key(Math.floor(this.x[i]/cellSize),Math.floor(this.y[i]/cellSize),Math.floor(this.z[i]/cellSize));
      let list=this.cells.get(key);if(!list){list=[];this.cells.set(key,list);}list.push(i);
    }
  }
  get occupiedCells():number{return this.cells.size;}
  neighbors(id:FishId,radius:number,method:NeighborMethod="grid"):{ids:FishId[];checks:number}{
    const i=this.slotOf(id);if(i<0)return{ids:[],checks:0};
    if(!Number.isFinite(radius)||radius<0)throw new RangeError("radius");
    let candidates:number[]=[];
    if(method==="all")candidates=Array.from({length:this.count},(_,j)=>j);
    else{
      const size=this.cellSizeCm,n=Math.ceil(radius/size);
      const cx=Math.floor(this.x[i]/size),cy=Math.floor(this.y[i]/size),cz=Math.floor(this.z[i]/size);
      for(let x=cx-n;x<=cx+n;x++)for(let y=cy-n;y<=cy+n;y++)for(let z=cz-n;z<=cz+n;z++){
        const list=this.cells.get(this.key(x,y,z));if(list)candidates.push(...list);
      }
    }
    const ids:FishId[]=[];let checks=0;
    for(const j of candidates){if(i===j)continue;checks++;
      const dx=this.x[j]-this.x[i],dy=this.y[j]-this.y[i],dz=this.z[j]-this.z[i];
      if(dx*dx+dy*dy+dz*dz<=radius*radius)ids.push(this.id[j]);
    }
    return{ids,checks};
  }
  /** Allocated numerical arrays only, excluding maps, grid and rendering. */
  get numericBytes(){return [this.id,this.x,this.y,this.z,this.vx,this.vy,this.vz,this.energy].reduce((n,a)=>n+a.byteLength,0);}
}
export function seededWorld(count=160,seed=42,capacity=2000):World{
  const world=new World(capacity,seed);for(let i=0;i<count;i++)world.spawn();
  world.rebuildGrid();return world;
}
