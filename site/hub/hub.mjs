import {DECISIONS,DEV_CONTRACTS,IMPLEMENTATION_PRINCIPLES} from '../shared/dev-register.mjs';
import {showOffspringInTank} from './mini-tanks.mjs';
import {rngFromSeed, founder, breed, phenotype, fishAscii, recoveryTrial} from '../shared/genetics-prototype.mjs';
import {swimAfter,accelerationCmS2} from '../shared/physics-prototype.mjs';
const $=id=>document.getElementById(id);
const escapeText=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const traits=[['bodyLength','Body length',4,12],['tailPower','Tail power',0,100],['curiosity','Curiosity',0,100],['boldness','Boldness',0,100],['regeneration','Regeneration',0,100],['sociability','Sociability',0,100],['aggression','Aggression',0,100],['gillEfficiency','Gill efficiency',0,100]];
const presets=[{name:'Parent A',bodyLength:8,bodyShape:1,tailPower:65,boldness:35,curiosity:75,regeneration:65,sociability:65,aggression:30,gillEfficiency:70,color:'#36bddb'},
{name:'Parent B',bodyLength:8,bodyShape:2,tailPower:78,boldness:75,curiosity:45,regeneration:65,sociability:65,aggression:30,gillEfficiency:70,color:'#e79b56'}];
let descriptors=structuredClone(presets),rng,parents=[],children=[],breedCount=0;
function createFounders(){rng=rngFromSeed($('seed').value);parents=descriptors.map((d,i)=>founder(d.name,d,rng,'P'+(i+1)));children=[];breedCount=0;renderParents();renderChildren();showOffspringInTank([],false);}
function fishView(fish,mini=false){const ph=phenotype(fish);return `<div class="fish-stage"><code style="color:${ph.color}">${escapeText(fishAscii(ph))}</code></div>`;}
function renderParents(){const root=$('parents');root.innerHTML=parents.map((fish,i)=>{
 const p=phenotype(fish);const d=descriptors[i];
 const short=traits.slice(0,4).map(([id,name,min,max])=>`<div class="range-control"><label for="trait-${i}-${id}">${name}<span id="trait-value-${i}-${id}">${d[id]}</span></label><input type="range" data-parent="${i}" data-field="${id}" id="trait-${i}-${id}" min="${min}" max="${max}" step="1" value="${d[id]}"></div>`).join('');
 const extra=traits.slice(4).map(([id,name,min,max])=>`<div class="range-control"><label for="trait-${i}-${id}">${name}<span id="trait-value-${i}-${id}">${d[id]}</span></label><input type="range" data-parent="${i}" data-field="${id}" id="trait-${i}-${id}" min="${min}" max="${max}" step="1" value="${d[id]}"></div>`).join('');
 return `<article class="parent-card" data-parent-card="${i}"><div class="parent-head"><strong>${escapeText(d.name)}</strong><span>G${fish.generation} · ${escapeText(fish.id)}</span></div>${fishView(fish)}<div class="parent-stats"><span>Color <span style="color:${p.color}">●</span></span><span>Body ${['Slim','Classic','Round'][p.bodyShape]}</span><span>Tail ${p.tailPower}</span></div><div class="parent-controls"><div class="range-control"><label for="shape-${i}">Body shape</label><select data-parent="${i}" data-field="bodyShape" id="shape-${i}"><option value="0" ${d.bodyShape===0?'selected':''}>Slim</option><option value="1" ${d.bodyShape===1?'selected':''}>Classic</option><option value="2" ${d.bodyShape===2?'selected':''}>Round</option></select></div><div class="range-control"><label for="color-${i}">Pigment</label><div class="color-control"><input data-parent="${i}" data-field="color" id="color-${i}" type="color" value="${d.color}"><span>${d.color}</span></div></div>${short}<details><summary>More heritable traits</summary><div class="extra-traits">${extra}</div></details></div></article>`;
 }).join('');}
function renderChildren(){const out=$('offspring');if(!children.length){out.innerHTML='<p class="muted center">Press Breed to generate offspring and compare the inherited traits.</p>';return;}
 out.innerHTML=children.map(child=>{const p=phenotype(child);return `<article class="offspring-card"><strong>${escapeText(child.id)}</strong><small> · G${child.generation}</small>${fishView(child,true)}<p>Length ${p.bodyLength} · Tail ${p.tailPower}<br>Bold ${p.boldness} · Social ${p.sociability}<br>Mutations ${child.mutations||0}</p><div class="adopt"><button data-promote="0" data-id="${escapeText(child.id)}" aria-label="Promote ${escapeText(child.id)} to Parent A">→ A</button><button data-promote="1" data-id="${escapeText(child.id)}" aria-label="Promote ${escapeText(child.id)} to Parent B">→ B</button></div></article>`;}).join('');}
$('parents').addEventListener('input',e=>{const field=e.target.dataset.field,index=Number(e.target.dataset.parent);if(!field||!(index===0||index===1))return;
 const d=descriptors[index],parent=parents[index];const value=field==='color'?e.target.value:Number(e.target.value);d[field]=value;
 if(field==='color'){const rgb=[0,2,4].map(k=>parseInt(value.slice(k+1,k+3),16));['pigmentR','pigmentG','pigmentB'].forEach((name,i)=>parent.genes[name]=[rgb[i],rgb[i]]);}else parent.genes[field]=[value,value];
 parent.engineered=true;const ph=phenotype(parent),card=$('parents').querySelector(`[data-parent-card="${index}"]`);
 card.querySelector('.fish-stage code').textContent=fishAscii(ph);card.querySelector('.fish-stage code').style.color=ph.color;
 const stats=card.querySelector('.parent-stats');stats.innerHTML=`<span>Color <span style="color:${ph.color}">●</span></span><span>Body ${['Slim','Classic','Round'][ph.bodyShape]}</span><span>Tail ${ph.tailPower}</span>`;
 const valueLabel=$(`trait-value-${index}-${field}`);if(valueLabel)valueLabel.textContent=value;
 if(field==='color')card.querySelector('.color-control span').textContent=value;
});
$('parents').addEventListener('change',e=>{if(e.target.dataset.field==='bodyShape')e.target.dispatchEvent(new Event('input',{bubbles:true}));});
$('offspring').addEventListener('click',e=>{const button=e.target.closest('button[data-promote]');if(!button)return;const child=children.find(c=>c.id===button.dataset.id);if(!child)return;
 const index=Number(button.dataset.promote),p=phenotype(child);parents[index]=child;descriptors[index]={...descriptors[index],...p,name:'Parent '+(index===0?'A':'B')};renderParents();$('breeder').scrollIntoView({behavior:'smooth',block:'start'});
});
$('breedButton').onclick=()=>{const rate=Number($('mutation').value)/100;children=Array.from({length:5},(_,i)=>breed(parents[0],parents[1],rng,`G${Math.max(...parents.map(x=>x.generation))+1}-${++breedCount}`,rate));renderChildren();showOffspringInTank(children.map(child=>({id:child.id,color:phenotype(child).color})));};
$('mutation').oninput=()=>{$('mutationOut').textContent=$('mutation').value+'%';};
$('resetParents').onclick=()=>{descriptors=structuredClone(presets);createFounders();};
$('seed').addEventListener('change',createFounders);
createFounders();
const mechanics=[
{id:'genome',title:'Genome & Breeding',category:'biology',icon:'♧',status:'reference',summary:'Diploid loci, seed-based inheritance, phenotype and lineage.',src:'../references/species-genome-lab.html#breed',evidence:'From uploaded Species & Genome Lab v0.8; toy loci, no molecular model.'},
{id:'regrowth',title:'Fin Recovery Trial',category:'biology',icon:'✚',status:'reference',summary:'Matched injury control vs damaged fin base.',src:'../references/species-genome-lab.html#recovery',evidence:'Toy regrowth coefficients. Recovery is not species-calibrated.'},
{id:'mass',title:'Mass & Swimming Physics',category:'physics',icon:'⚖',status:'reference',summary:'Body dimensions, mass, drag, acceleration and motion.',src:'../references/aquarium-mechanics-archive.html#mass',evidence:'CGS equations, but illustrative fish volume and drag.'},
{id:'contact',title:'Contact & Avoidance',category:'physics',icon:'⤳',status:'reference',summary:'Detect overlap, choose a response, approach or flee in XYZ.',src:'../references/aquarium-mechanics-archive.html#collision',evidence:'Behavior scenarios and collision visualizations, not production resolution.'},
{id:'spatial',title:'3D Spatial Search',category:'systems',icon:'◎',status:'core',summary:'Sparse grid, ID lookup, XYZ sensing radius and top/side cameras.',src:'../lab/',evidence:'Existing ASCean WorldPrototype uses 3D exact squared distances.'},
{id:'time',title:'Fixed Timestep & FPS',category:'systems',icon:'◷',status:'core',summary:'Render cadence versus fixed simulation ticks and frame-based bugs.',src:'../lab/',evidence:'Current core reference and time comparison are interactive, not actual Hz controls.'},
{id:'memory',title:'Memory Budget',category:'systems',icon:'▤',status:'reference',summary:'One million fish, SoA columns, snapshots, optional handles.',src:'../references/aquarium-mechanics-archive.html#memory',evidence:'Numeric allocation estimates; not runtime profiling.'},
{id:'quant',title:'Quantization & Bitfields',category:'systems',icon:'◈',status:'reference',summary:'8 / 12 / 16-bit snapshot precision and flag packing.',src:'../references/aquarium-mechanics-archive.html#precision',evidence:'Storage experiment; no lossy runtime packing approved.'},
{id:'blueprint',title:'Fish Blueprint',category:'systems',icon:'▦',status:'reference',summary:'Five data groups, memory classes, dimensions and field inspector.',src:'../references/aquarium-mechanics-archive.html#model',evidence:'Schema proposals, not all current runtime fields.'},
{id:'lookup',title:'Entity ID & Dense Slots',category:'systems',icon:'⧉',status:'reference',summary:'Stable fishId and swap-remove mapping separate from spatial cells.',src:'../references/aquarium-mechanics-archive.html#identity',evidence:'Current ASCean WorldPrototype also implements this pattern.'},
{id:'water',title:'Water Chemistry',category:'environment',icon:'≋',status:'reference',summary:'Spatial fields for salinity, pH, oxygen, ammonia (TAN) and currents.',src:'../references/aquarium-mechanics-archive.html#habitat',evidence:'Synthetic water map; not scientific predictions or fish tolerance.'},
{id:'pressure',title:'Depth, Pressure & Light',category:'environment',icon:'↧',status:'reference',summary:'Hydrostatic pressure, water clarity, sunlight attenuation and habitats.',src:'../references/aquarium-mechanics-archive.html#depthlab',evidence:'Pressure formula illustrative under constant density; light toy attenuation.'},
{id:'clock',title:'Biological Clock',category:'biology',icon:'◉',status:'reference',summary:'Time multipliers that keep physical and biological clocks distinct.',src:'../references/aquarium-mechanics-archive.html#bioclock',evidence:'Time flow visualization, not long-term ecological integration.'},
{id:'growth',title:'Growth & Condition',category:'biology',icon:'⌁',status:'reference',summary:'Genetic potential, age, food, oxygen and body reserves.',src:'../references/aquarium-mechanics-archive.html#growth',evidence:'Curve is synthetic, not a zebrafish calibration.'},
{id:'anatomy',title:'Anatomy & Injury',category:'biology',icon:'⊕',status:'reference',summary:'Clickable fish regions and severity-driven local ASCII changes.',src:'../references/aquarium-mechanics-archive.html#bio',evidence:'Region/visual system only; no validated damage physiology.'},
{id:'food',title:'Diet, Digestion & Waste',category:'biology',icon:'◇',status:'reference',summary:'Resource → ingestion → digestion → absorption → waste.',src:'../references/aquarium-mechanics-archive.html#feeding',evidence:'Food suitability demo; no balanced metabolism engine.'},
{id:'fishdex',title:'FishDex',category:'biology',icon:'☷',status:'reference',summary:'Species cards, habitat information and mini ASCII environments.',src:'../references/aquarium-mechanics-archive.html#fishdex',evidence:'Educational preview; sourced species parameters still to be built.'},
{id:'needs',title:'Needs & Decisions',category:'behavior',icon:'✧',status:'proposed',summary:'Curiosity, social drive, hunger, territoriality and predation.',src:'https://github.com/DorManDel/ASCean/blob/main/docs/MECHANICS.md',evidence:'State and inferred traits are planned; fish cannot learn in M0.'},
{id:'memory-ai',title:'Memory & Learning',category:'behavior',icon:'◌',status:'proposed',summary:'Memory of events and gradual adaptation in controlled scenarios.',src:'https://github.com/DorManDel/ASCean/blob/main/docs/ROADMAP.md',evidence:'Future research, not trained or implemented.'},
{id:'coral',title:'Reefs & Shelter',category:'environment',icon:'♒',status:'proposed',summary:'Habitat geometry, obstacle avoidance and species-specific refuge.',src:'https://github.com/DorManDel/ASCean/blob/main/docs/MECHANICS.md',evidence:'Design only; no reef physics or shelter pathfinding in core.'}
];
let category='all',query='',selectedMechanic=null;
function renderCatalog(){const matches=mechanics.filter(m=>(category==='all'||m.category===category)&&(`${m.title} ${m.summary} ${m.category} ${m.evidence}`).toLowerCase().includes(query));
 $('foundCount').textContent=`${matches.length} of ${mechanics.length} mechanics`;
 $('emptyResults').hidden=matches.length>0;
 $('mechanicsGrid').innerHTML=matches.map(m=>`<button type="button" class="mechanic-card" data-mechanic="${m.id}"><div class="card-top"><span class="mechanic-icon">${m.icon}</span><span class="status ${m.status}">${m.status==='core'?'Core reference':m.status==='reference'?'Interactive prototype':'Planned'}</span></div><h3>${m.title}</h3><p>${m.summary}</p><div class="card-bottom"><small class="status">${m.category}</small><span class="arrow">Inspect ↗</span></div></button>`).join('');
}
function selectMechanic(m){selectedMechanic=m.id;$('mechanicInspector').hidden=false;$('inspectorTitle').textContent=m.title;$('inspectorSummary').textContent=m.summary;
 $('inspectorFacts').innerHTML=`<ul><li>Status: ${m.status==='core'?'implemented reference core':m.status==='reference'?'restored standalone prototype':'planned only'}</li><li>${escapeText(m.evidence)}</li></ul>`;
 $('inspectorOpen').href=m.src;$('inspectorOpen').textContent=m.status==='proposed'?'Read plan ↗':'Open experiment ↗';$('mechanicInspector').scrollIntoView({behavior:'smooth',block:'nearest'});
}
$('mechanicsGrid').addEventListener('click',e=>{const card=e.target.closest('[data-mechanic]');if(!card)return;const m=mechanics.find(x=>x.id===card.dataset.mechanic);if(m)selectMechanic(m);});
$('mechanicSearch').oninput=e=>{query=e.target.value.trim().toLowerCase();renderCatalog();};
$('categoryFilters').onclick=e=>{const btn=e.target.closest('button[data-category]');if(!btn)return;category=btn.dataset.category;for(const b of $('categoryFilters').querySelectorAll('button')){const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));}renderCatalog();};
$('closeInspector').onclick=()=>{$('mechanicInspector').hidden=true;};renderCatalog();
const menu=$('menu'),sidebar=$('sidebar'),shade=$('shade');function setMenu(open){sidebar.classList.toggle('open',open);shade.hidden=!open;menu.setAttribute('aria-expanded',String(open));}menu.onclick=()=>setMenu(!sidebar.classList.contains('open'));shade.onclick=()=>setMenu(false);sidebar.addEventListener('click',e=>{if(e.target.closest('a'))setMenu(false);});
const r=(m,t,d)=>({massG:m,thrustDyn:t,dragGPerCm:d});let started=performance.now();
function updatePhysics(){const mass=+$('mass').value,thrust=+$('thrust').value,drag=+$('drag').value;
 $('massOutput').textContent=mass+' g';$('thrustOutput').textContent=thrust+' dyn';$('dragOutput').textContent=drag.toFixed(2);
 $('accel').textContent=accelerationCmS2(r(mass,thrust,drag),0).toFixed(2)+' cm/s²';$('speed').textContent=swimAfter(r(mass,thrust,drag),1).velocityCmS.toFixed(1)+' cm/s';started=performance.now();
}
for(const id of ['mass','thrust','drag'])$(id).oninput=updatePhysics;
$('restartSwim').onclick=()=>{started=performance.now();};
updatePhysics();
const cv=$('swimCompare'),ctx=cv.getContext('2d');let lastDraw=0;
function drawSwim(time){const elapsed=Math.max(0,(time-started)/1000),duration=6,t=elapsed%duration,base=swimAfter(r(6,22,.1),t),trial=swimAfter(r(+$('mass').value,+$('thrust').value,+$('drag').value),t);
 const w=cv.width,h=cv.height;const bg=ctx.createLinearGradient(0,0,0,h);bg.addColorStop(0,'#0f4056');bg.addColorStop(1,'#071b32');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 ctx.strokeStyle='#5d99b650';ctx.lineWidth=1;for(const y of [112,239]){ctx.beginPath();ctx.moveTo(38,y);ctx.lineTo(w-26,y);ctx.stroke();}
 const xFor=p=>38+(p.positionCm%480)/480*(w-85);
 for(const [fish,y,color,label] of [[base,112,'#77e6f1','BASELINE'],[trial,239,'#ffd18a','MODIFIED']]){
 ctx.fillStyle='#b4c9d9';ctx.font='12px system-ui';ctx.textAlign='left';ctx.fillText(`${label}   ${fish.velocityCmS.toFixed(1)} cm/s`,22,y-48);
 ctx.fillStyle=color;ctx.font='bold 31px ui-monospace,Consolas,monospace';ctx.textBaseline='middle';ctx.fillText('><(((°>',Math.min(w-154,xFor(fish)),y);
 }
 ctx.fillStyle='#b2cfe0';ctx.font='12px ui-monospace';ctx.fillText(`t = ${t.toFixed(1)} / ${duration}s   ·   same starting velocity: 0`,22,22);
}
function loop(now){if(now-lastDraw>=16){drawSwim(now);lastDraw=now;}requestAnimationFrame(loop);}requestAnimationFrame(loop);
// Publish only the educational reference API used by browser tests.
window.ASCEAN_HUB={mechanics:mechanics.map(({id,title,category,status})=>({id,title,category,status})), getGeneration:()=>children.map(c=>({id:c.id,generation:c.generation,parentIds:[...c.parentIds],genes:structuredClone(c.genes)}))};

// Developer & AI source-backed decision viewer.
let decisionStatus='all';
function renderDecisions(){const filtered=DECISIONS.filter(d=>decisionStatus==='all'||d.status===decisionStatus);
 $('decisionRows').innerHTML=filtered.map(d=>`<details class="decision-row"><summary><span class="decision-id">${d.id}</span><span>${escapeText(d.topic)}</span><span class="decision-label ${d.status}">${d.status}</span></summary><p>${escapeText(d.why)}</p></details>`).join('');
}
$('decisionFilters').addEventListener('click',e=>{const b=e.target.closest('button[data-status]');if(!b)return;decisionStatus=b.dataset.status;for(const x of $('decisionFilters').querySelectorAll('button')){const active=x===b;x.classList.toggle('active',active);x.setAttribute('aria-pressed',String(active));}renderDecisions();});
renderDecisions();
$('devMilestones').innerHTML=DEV_CONTRACTS.map(d=>`<details class="milestone"><summary><strong>${d.id}</strong><span>${escapeText(d.title)}</span><small>${escapeText(d.status)}</small></summary><p><b>Already:</b> ${escapeText(d.implemented)}</p><p><b>Missing:</b> ${escapeText(d.missing)}</p><p><b>Acceptance:</b> ${escapeText(d.gate)}</p></details>`).join('');
$('devPrinciples').innerHTML=IMPLEMENTATION_PRINCIPLES.map(x=>`<li>${escapeText(x)}</li>`).join('');
const workOrder='ASCean M1: inspect source SHA and docs, then extract a minimal shared TypeScript World + FixedStepClock, 3D lookup and reproducible movement into production packages. The Ocean and Lab must import identical modules. Provide seeded tests, mobile/desktop evidence, benchmark inputs and constraints, update DECISIONS and PCM checkpoint draft; open a PR to development. Do not merge, deploy, modify MobiLab/ASCuarium, or implement guessed biological coefficients.';
$('copyCodexBrief').onclick=async()=>{try{await navigator.clipboard.writeText(workOrder);$('copyCodexStatus').textContent='Copied.';}catch(e){$('copyCodexStatus').textContent='Clipboard not available; read the committed prompt.';}};
window.ASCEAN_HUB={...window.ASCEAN_HUB,decisions:DECISIONS.map(({id,status,topic})=>({id,status,topic})),devContracts:DEV_CONTRACTS.map(({id,title,status})=>({id,title,status}))};
