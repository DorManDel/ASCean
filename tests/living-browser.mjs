import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdirSync,readFileSync} from 'node:fs';
const server=spawn(process.execPath,['node_modules/vite/bin/vite.js',...(process.argv.includes('--dev')?[]:['preview']),'--host','127.0.0.1','--port','4183','--strictPort'],{stdio:'pipe'});
const base='http://127.0.0.1:4183/ASCean/';let browser;
try{
 for(let i=0;i<80;i++){try{if((await fetch(base)).ok)break;}catch{}if(i===79)throw Error('Server unavailable');await new Promise(r=>setTimeout(r,100));}
 mkdirSync('test-results',{recursive:true});browser=await chromium.launch();console.log('Chromium',browser.version(),process.platform,'emulated desktop/mobile');
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
  for(const route of ['ocean/living/','lab/living/']){
   await page.goto(base+route);await page.locator('#food').click();assert.match(await page.locator('#status').innerText(),/Applied addFood/);
   await page.locator('#pauseEvent').check();await page.locator('#play').click();
   await page.waitForFunction(()=>document.querySelector('#events').textContent.includes('ingest'),null,{timeout:15000});
   assert.match(await page.locator('#clock').innerText(),/Paused/);assert.match(await page.locator('#inspect').innerText(),/Gut: 0\.020/);
   await page.locator('#replay').click();assert.match(await page.locator('#status').innerText(),/PASS/);
   const download=page.waitForEvent('download');await page.locator('#json').click();await(await download).saveAs(`test-results/trial-${width}.json`);
   const exported=JSON.parse(await page.locator('#trialText').inputValue());assert.equal(exported.schema,1);assert.ok(exported.final.events.some(e=>e.type==='ingest'));
   await page.locator('#reset').click();await page.locator('#reopen').click();assert.match(await page.locator('#status').innerText(),/Reopened and replay verified/);
   const csvDownload=page.waitForEvent('download');await page.locator('#csv').click();await(await csvDownload).saveAs(`test-results/trial-${width}.csv`);await page.locator('#reset').click();await page.locator('#reopen').click();assert.match(await page.locator('#status').innerText(),/Reopened/);
   // Loading a recorded fixture is explicit and must match authoritative replay.
   await page.locator('#trialText').fill(readFileSync('tests/fixtures/living-seed42.json','utf8'));await page.locator('#reopen').click();assert.match(await page.locator('#clock').innerText(),/Tick 600/);
   await page.locator('#scene').scrollIntoViewIfNeeded();await page.screenshot({path:`test-results/living-${route.startsWith('ocean')?'ocean':'lab'}-${width}.png`,fullPage:true});
   assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3),`Overflow ${route} ${width}`);
   for(const [count,habitat] of [['2','freshwater'],['10','deep marine'],['1','brackish']]){await page.locator('#count').selectOption(count);await page.locator('#habitat').selectOption(habitat);await page.locator('#run').click();await page.locator('#play').click();assert.match(await page.locator('#clock').innerText(),new RegExp(count+' fish'));}
   await page.locator('#overlay').uncheck();await page.reload();assert.equal(await page.locator('#overlay').isChecked(),false);assert.match(await page.locator('#clock').innerText(),/Tick 0/);
   await page.locator('#x').fill('450');await page.locator('#food').click();await page.locator('#entity').selectOption('2');await page.locator('#x').fill('600');await page.locator('#move').click();assert.match(await page.locator('#inspect').innerText(),/600/);await page.locator('#remove').click();
   await page.locator('#x').fill('400');await page.locator('#y').fill('350');await page.locator('#species').selectOption('cruiser');await page.locator('#fish').click();await page.locator('#entity').selectOption('3');assert.match(await page.locator('#inspect').innerText(),/cruiser/);
   await page.locator('#x').fill('500');await page.locator('#y').fill('250');await page.locator('#obstacle').click();await page.locator('#entity').selectOption('4');await page.locator('#x').fill('550');await page.locator('#move').click();assert.match(await page.locator('#inspect').innerText(),/550/);await page.locator('#remove').click();
   await page.locator('#current').click();await page.locator('#step').click();assert.match(await page.locator('#clock').innerText(),/current 20/);
   await page.locator('details.panel > summary').click();await page.locator('#passive').check();await page.locator('#parameters').click();assert.match(await page.locator('#status').innerText(),/Applied parameters/);
   await page.locator('#habitat').selectOption('custom');await page.locator('#custom > summary').click();await page.locator('#waterKind').selectOption('freshwater');await page.locator('#salinity').fill('0');await page.locator('#run').click();await page.locator('#play').click();assert.match(await page.locator('#clock').innerText(),/custom/);assert.match(await page.locator('#inspect').innerText(),/freshwater cruiser/);
   if(width===1440&&route.startsWith('lab')){await page.locator('#meter').click();await page.waitForFunction(()=>document.querySelector('#status').textContent.includes('Meter complete'));assert.match(await page.locator('#meterResults').innerText(),/steering seed 42: reached 1/);}
  }
  await page.goto(base+'hub/');await page.locator('#breedButton').click();assert.equal(await page.locator('.offspring-card').count(),5);assert.equal(await page.locator('.tank-card').count(),4);await page.locator('[data-tank-action="step"][data-tank="waste"]').click();assert.ok(await page.evaluate(()=>window.ASCEAN_MINITANKS.getState('waste').t>=.5));await page.locator('#mechanicSearch').fill('sensory');assert.match(await page.locator('#mechanicsGrid').innerText(),/Living Fish/);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+3));
  await page.goto(base+'lab/');if(width===390)await page.locator('#menu').click();await page.locator('[data-page="precision"]').click();await page.reload();assert.ok(await page.locator('#page-precision').isVisible());
  for(const route of ['','ocean/','ocean/foundation/','lab/foundation/','references/species-genome-lab.html','references/food-gut-anatomy.html','references/aquarium-mechanics-archive.html','science/living-v1.html'])assert.equal((await page.goto(base+route)).status(),200);
  assert.deepEqual(errors,[]);console.log('PASS Living controls, ingestion, JSON/CSV, counts/habitats, Hub, Lab persistence, archives',width);await page.close();
 }
}finally{await browser?.close();server.kill();}
