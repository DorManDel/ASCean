import {SCENARIOS,createScenario,advanceScenario,resetScenario,setOffspring,sampleScenario} from '../shared/mini-ecosystem-prototype.mjs';
const $=id=>document.getElementById(id);
const tanks=new Map(Object.keys(SCENARIOS).map(id=>[id,createScenario(id)]));
const templates=Object.entries(SCENARIOS).map(([id,info])=>`<article class="tank-card panel" data-tank-card="${id}"><div class="tank-top"><div><h3>${info.name}</h3><p>${info.objective}</p></div><span class="tiny-status">Illustrative</span></div><canvas class="tank-canvas" width="400" height="400" aria-label="Interactive ${info.name} scenario"></canvas><div class="tank-tools"><button data-tank-action="play" data-tank="${id}">▶ Play</button><button data-tank-action="step" data-tank="${id}" title="Single 0.5-second step">+ 0.5s</button><button data-tank-action="reset" data-tank="${id}">↺ Reset</button></div>${id==='predation'?`<label class="scenario-option">Predation outcome<select id="predationMode"><option value="escape">Escape via XYZ</option><option value="contact">Contact / bite attempt</option></select></label>`:''}<div class="tank-footer"><div class="tank-progress"><i></i></div><div class="tank-report" aria-live="polite">Ready · ${info.caveat}</div></div></article>`).join('');
$('miniTankGrid').innerHTML=templates;
function syncButtons(id){const s=tanks.get(id);const b=document.querySelector(`[data-tank-action="play"][data-tank="${id}"]`);if(b)b.textContent=s.playing?'Ⅱ Pause':s.t>=12?'↺ Replay':'▶ Play';}
$('miniTankGrid').addEventListener('click',e=>{const b=e.target.closest('[data-tank-action]');if(!b)return;const id=b.dataset.tank,s=tanks.get(id);if(!s)return;
 if(b.dataset.tankAction==='play'){if(s.t>=SCENARIOS[id].duration)resetScenario(s);s.playing=!s.playing;}
 if(b.dataset.tankAction==='step'){s.playing=false;advanceScenario(s,.25);advanceScenario(s,.25);}
 if(b.dataset.tankAction==='reset')resetScenario(s);
 syncButtons(id);draw(id);
});
$('predationMode').onchange=e=>{const s=tanks.get('predation');s.mode=e.target.value;resetScenario(s);syncButtons('predation');draw('predation');};
export function showOffspringInTank(children){const s=tanks.get('mating');setOffspring(s,children);s.playing=true;syncButtons('mating');draw('mating');}
function draw(id){const root=document.querySelector(`[data-tank-card="${id}"]`),s=tanks.get(id),info=SCENARIOS[id],c=root.querySelector('canvas'),ctx=c.getContext('2d'),w=c.width,h=c.height,data=sampleScenario(s);
 const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#16516b');bg.addColorStop(1,'#051b32');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 ctx.strokeStyle='#a5d4ef0d';for(let i=0;i<w;i+=40){ctx.beginPath();ctx.moveTo(i,0);ctx.lineTo(i,h);ctx.stroke();}
 for(let i=0;i<9;i++){const x=(i*53+19)%w,y=(i*97+20)%h;ctx.beginPath();ctx.arc(x,y,2.5,0,Math.PI*2);ctx.strokeStyle='#b4e9f94d';ctx.stroke();}
 ctx.fillStyle='#0f4555';ctx.beginPath();ctx.moveTo(0,365);for(let i=0;i<=400;i+=12)ctx.lineTo(i,363+Math.sin(i/30)*9);ctx.lineTo(400,400);ctx.lineTo(0,400);ctx.fill();
 ctx.font='11px ui-monospace,monospace';ctx.fillStyle='#d3edf6';ctx.fillText('TEST CELL · '+id.toUpperCase(),14,19);ctx.textAlign='right';ctx.fillText(data.t.toFixed(1)+' / '+info.duration+'s',386,19);ctx.textAlign='left';
 for(const a of data.actors){const x=a.x*w,y=a.y*h,z=a.z;ctx.save();ctx.globalAlpha=.6+.4*(1-z);ctx.translate(x,y);ctx.scale(a.dir,1);ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle=a.color;ctx.font=`bold ${a.small?16:28-Math.round(z*6)}px Consolas,ui-monospace,monospace`;ctx.fillText('><(((°>',0,0);ctx.restore();ctx.font='10px ui-sans-serif,system-ui';ctx.fillStyle='#cfe0ee';ctx.textAlign='center';ctx.fillText(a.name,x,y+29);ctx.fillStyle='#f5e9b1';ctx.font='9px ui-monospace';ctx.fillText('Z '+Math.round(z*30)+'m',x,y+41);}
 for(const p of data.particles){const x=p.x*w,y=p.y*h;ctx.fillStyle=p.color;ctx.beginPath();ctx.arc(x,y,p.type==='bite'?10:p.type==='egg'?5:7,0,Math.PI*2);ctx.fill();ctx.font='10px system-ui';ctx.fillStyle='#e7e9f3';ctx.textAlign='center';ctx.fillText(p.type,x,y+20);}
 const event=data.events.at(-1);ctx.textAlign='left';ctx.fillStyle='#def3ff';ctx.font='11px system-ui';ctx.fillText(event?event.text:'Press Play to run a seeded vignette',12,350,376);
 root.querySelector('.tank-progress i').style.width=(100*data.progress).toFixed(1)+'%';
 root.querySelector('.tank-report').textContent=(event?event.text:'Ready')+' · '+(id==='mating'&&!s.offspring.length?'Breed two parents in the panel above to see inherited fry.':info.caveat);
 syncButtons(id);
}
let previous=performance.now(),acc=0;
let visible=new Set(Object.keys(SCENARIOS));
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{for(const entry of entries){const id=entry.target.dataset.tankCard;if(entry.isIntersecting)visible.add(id);else visible.delete(id);}}, {rootMargin:'120px'});for(const card of $('miniTankGrid').children)observer.observe(card);}
function frame(now){const delta=Math.min(.1,Math.max(0,(now-previous)/1000));previous=now;acc+=delta;let steps=0;
 while(acc>=1/30&&steps<3){for(const [id,s] of tanks)if(s.playing)advanceScenario(s,1/30);acc-=1/30;steps++;}
 for(const id of visible)if(tanks.has(id))draw(id);
 requestAnimationFrame(frame);
}
for(const id of tanks.keys())draw(id);
requestAnimationFrame(frame);
window.ASCEAN_MINITANKS={getState:id=>{const s=tanks.get(id);return s?{t:s.t,playing:s.playing,events:s.events.map(x=>x.text),offspringCount:s.offspring.length,mode:s.mode}:null;}};
