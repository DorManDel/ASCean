import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
const server=spawn('python3',['-m','http.server','8768','--directory','site'],{stdio:'ignore'});
const base='http://127.0.0.1:8768';
let browser;
try {
 for(let i=0;i<60;i++){try{if((await fetch(base+'/hub/')).ok)break;}catch{}await new Promise(resolve=>setTimeout(resolve,150));}
 browser=await chromium.launch({headless:true});
 for(const width of [1440,390]){
  const page=await browser.newPage({viewport:{width,height:860}}),errors=[];
  page.on('pageerror',err=>errors.push(err.message));
  page.on('console',msg=>{if(msg.type()==='error')errors.push(msg.text());});
  await page.goto(base+'/hub/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('.parent-card').count(),2);
  assert.equal(await page.locator('.tank-card').count(),4);
  await page.locator('#breedButton').click();
  assert.equal(await page.locator('.offspring-card').count(),5);
  assert.equal(await page.evaluate(()=>window.ASCEAN_MINITANKS.getState('mating').offspringCount),5);
  await page.locator('[data-tank-action="step"][data-tank="waste"]').click();
  assert.ok((await page.evaluate(()=>window.ASCEAN_MINITANKS.getState('waste').t))>=.5);
  await page.locator('#mechanicSearch').fill('ammonia');
  assert.ok(await page.locator('.mechanic-card').count()>=1);
  await page.locator('#mechanicSearch').fill('');
  await page.locator('#decisionFilters [data-status="open"]').click();
  assert.ok(await page.locator('.decision-row').count()>=4);
  const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
  assert.ok(overflow<=3,'Horizontal overflow at '+width+': '+overflow);
  assert.deepEqual(errors,[],'Client JS errors at '+width);
  console.log('Hub PASS',width,'px');
  await page.close();
 }
} finally {if(browser)await browser.close();server.kill();}
