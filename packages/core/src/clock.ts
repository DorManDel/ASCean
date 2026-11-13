/** Tick-based simulation clock, independent of display refresh. */
export class FixedStepClock {
  paused=false; accumulator=0;
  readonly step:number;
  readonly maxSteps:number;
  constructor(tps=30,maxSteps=4){
    if(!(tps>0)||!(maxSteps>0))throw new RangeError("clock");
    this.step=1/tps;
    this.maxSteps=maxSteps;
  }
  advance(elapsed:number,update:(dt:number)=>void):number{
    if(this.paused)return 0;
    this.accumulator+=Math.min(.1,Math.max(0,elapsed));
    let steps=0;while(this.accumulator>=this.step&&steps<this.maxSteps){
      update(this.step);this.accumulator-=this.step;steps++;
    }
    if(steps===this.maxSteps)this.accumulator=Math.min(this.accumulator,this.step);
    return steps;
  }
  singleStep(update:(dt:number)=>void){update(this.step);}
}
