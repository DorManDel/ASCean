import type {World} from "../../core/src/world.js";
export function renderTank(canvas:HTMLCanvasElement,world:World,selected:number|null=null,grid=false):void{
  const ctx=canvas.getContext("2d");if(!ctx)return;
  const w=canvas.width,h=canvas.height;
  const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,"#115f7d");bg.addColorStop(1,"#06162b");
  ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  if(grid){ctx.strokeStyle="#a1d7f022";for(let x=0;x<w;x+=80){ctx.beginPath();ctx.moveTo(x,0);ctx.lineTo(x,h);ctx.stroke();}for(let y=0;y<h;y+=80){ctx.beginPath();ctx.moveTo(0,y);ctx.lineTo(w,y);ctx.stroke();}}
  ctx.textAlign="center";ctx.textBaseline="middle";
  for(let i=0;i<world.count;i++){
    const x=world.x[i]/world.widthCm*w,y=(1-world.y[i]/world.heightCm)*h,z=world.z[i]/world.depthCm;
    ctx.globalAlpha=.4+.6*(1-z);ctx.font=Math.round(11+6*(1-z))+"px monospace";
    ctx.fillStyle=world.id[i]===selected?"#ffd478":"hsl("+Math.floor(174+z*76)+" 85% 72%)";
    ctx.fillText(world.vx[i]>=0?"><((°>":"<°))><",x,y);
    if(world.id[i]===selected){ctx.beginPath();ctx.strokeStyle="#ffe3a0";ctx.arc(x,y,13,0,Math.PI*2);ctx.stroke();}
  }
  ctx.globalAlpha=1;ctx.textAlign="left";ctx.font="13px monospace";ctx.fillStyle="#e0f5ff";
  ctx.fillText("ASCean   |   Side Camera XY   |   Z in simulation",12,20);
}
export function pickFish(canvas:HTMLCanvasElement,world:World,clientX:number,clientY:number):number|null{
  const rect=canvas.getBoundingClientRect();
  const px=(clientX-rect.left)/rect.width*canvas.width,py=(clientY-rect.top)/rect.height*canvas.height;
  let nearest=24*24,selected:number|null=null;
  for(let i=0;i<world.count;i++){
    const dx=world.x[i]/world.widthCm*canvas.width-px,dy=(1-world.y[i]/world.heightCm)*canvas.height-py;
    const dist=dx*dx+dy*dy;if(dist<nearest){nearest=dist;selected=world.id[i];}
  }
  return selected;
}
