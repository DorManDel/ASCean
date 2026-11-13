/** Extracted from the user-supplied ASCean Species & Genome Lab v0.8.
 * Educational, deterministic diploid toy inheritance; not molecular genetics.
 * Do not treat trait sliders as real species genes. */
  const LOCI = Object.freeze({
    bodyLength:[4,12], bodyShape:[0,2], tailPower:[0,100], gillEfficiency:[0,100],
    regeneration:[0,100], boldness:[0,100], curiosity:[0,100],
    sociability:[0,100], aggression:[0,100], pigmentR:[0,255],
    pigmentG:[0,255], pigmentB:[0,255]
  });
  const ORDER = Object.keys(LOCI);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, Number.isFinite(v)?v:a));
  function rngFromSeed(input) {
    let state=2166136261;
    for(const ch of String(input)) {state ^= ch.charCodeAt(0); state = Math.imul(state,16777619)>>>0;}
    if(!state) state=0x6d2b79f5;
    return {
      next(){state=(state+0x6D2B79F5)>>>0;let t=state;t=Math.imul(t^(t>>>15),t|1);t ^= t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;},
      getState(){return state>>>0;}
    };
  }
  function draw(rng, min, max) {return min+Math.floor(rng.next()*(max-min+1));}
  function parseHex(s) {const m=/^#?([a-f\d]{6})$/i.exec(s||'');if(!m) return [70,200,230];return [0,2,4].map(i=>parseInt(m[1].slice(i,i+2),16));}
  function founder(name, descriptor, rng, id) {
    const rgb=parseHex(descriptor.color);
    const chosen={bodyLength:Number(descriptor.bodyLength),bodyShape:Number(descriptor.bodyShape),tailPower:Number(descriptor.tailPower),gillEfficiency:Number(descriptor.gillEfficiency),regeneration:Number(descriptor.regeneration),boldness:Number(descriptor.boldness),curiosity:Number(descriptor.curiosity),sociability:Number(descriptor.sociability),aggression:Number(descriptor.aggression),pigmentR:rgb[0],pigmentG:rgb[1],pigmentB:rgb[2]};
    const genes={};
    for(const key of ORDER){const [min,max]=LOCI[key];const n=clamp(Math.round(chosen[key]),min,max);const spread=key==='bodyShape'?0:key.startsWith('pigment')?28:key==='bodyLength'?2:12;genes[key]=[clamp(n+draw(rng,-spread,spread),min,max),clamp(n+draw(rng,-spread,spread),min,max)];}
    return {id,name:name||id,species:'reef-fish-v1',generation:0,parentIds:[],genes};
  }
  function breed(a,b,rng,id,mutationRate=0.02) {
    if(a.species!==b.species) throw Error('Species incompatible: hybridization must be explicitly configured');
    const genes={};let mutations=0;
    for(const key of ORDER) {
      const [low,high]=LOCI[key];
      genes[key]=[a.genes[key][draw(rng,0,1)],b.genes[key][draw(rng,0,1)]].map(value=>{
        if(rng.next()>=mutationRate) return value;
        mutations++; const magnitude=key==='bodyShape'?1:key==='bodyLength'?1:key.startsWith('pigment')?draw(rng,1,9):draw(rng,1,6);
        return clamp(value+(rng.next()<.5?-1:1)*magnitude,low,high);
      });
    }
    return {id,name:id,species:a.species,generation:Math.max(a.generation,b.generation)+1,parentIds:[a.id,b.id],genes,mutations};
  }
  function phenotype(fish) {
    const v={};for(const key of ORDER){const al=fish.genes[key];v[key]=Math.round((al[0]+al[1])/2);}
    const h=n=>clamp(v[n],0,255).toString(16).padStart(2,'0');
    v.color='#'+h('pigmentR')+h('pigmentG')+h('pigmentB');v.bodyShape=clamp(Math.round(v.bodyShape),0,2);
    return v;
  }
  function fishAscii(ph,dir=1){
    const n=clamp(Math.round(ph.bodyLength),4,12);
    let mid='(' .repeat(Math.max(2,n-2));
    if(ph.bodyShape===0)mid='=' .repeat(Math.max(2,n-2));
    if(ph.bodyShape===2)mid='O'.repeat(Math.max(2,n-2));
    const right='><'+mid+'°>';
    return dir===1?right:'<°'+(ph.bodyShape===0?'=':ph.bodyShape===2?'O':')').repeat(Math.max(2,n-2))+'><';
  }
  function recoveryTrial(initialIntegrity,regenTrait,baseDamage,ticks){
    const integrity=clamp(initialIntegrity,0,1),r=clamp(regenTrait/100,0,1),base=clamp(baseDamage,0,1),days=clamp(ticks,0,10000);
    // Toy policy: greater structural root damage reduces the achievable ceiling.
    const ceiling=clamp(1-base*0.85,integrity,1);
    const rate=0.001+r*0.003;return {integrity:clamp(integrity+rate*days,integrity,ceiling),ceiling,rate};
  }
  function chemicalSignal(woundSeverity,skinDamage,speciesFactor=1){
    const wound=clamp(woundSeverity,0,1),skin=clamp(skinDamage,0,1);
    return {blood:wound*0.75,alarmCue:skin*clamp(speciesFactor,0,1)};
  }

export {LOCI,ORDER,clamp,rngFromSeed,parseHex,founder,breed,phenotype,fishAscii,recoveryTrial,chemicalSignal};
