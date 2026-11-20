import {chromium} from "playwright";
import assert from "node:assert/strict";
import {spawn} from "node:child_process";
const server=spawn("python3",["-m","http.server","8765","--directory","site"],{stdio:"ignore"});
const url="http://127.0.0.1:8765";
async function ready(){
  for(let i=0;i<50;i++){
    try{const response=await fetch(url+"/");if(response.ok)return;}catch{}
    await new Promise(r=>setTimeout(r,150));
  }
  throw Error("Local site did not become available");
}
let browser;
try{
  await ready();browser=await chromium.launch({headless:true});
  for(const width of [1280,390]){
    const page=await browser.newPage({viewport:{width,height:820}});
    const failures=[];page.on("pageerror",err=>failures.push(err.message));
    page.on("console",msg=>{if(msg.type()==="error")failures.push(msg.text());});
    await page.goto(url+"/lab/",{waitUntil:"networkidle"});
    assert.match(await page.title(),/Mechanics Lab/);
    assert.equal(await page.locator("#actualFps").count(),1);
    // Validates controls on both wide and narrow views.
    if(width<=760) await page.locator("#menu").click();
    await page.locator('[data-page="precision"]').click();
    const codeBefore=await page.locator("#code").innerText();
    await page.locator("#bitDepth").selectOption("8");
    const codeAfter=await page.locator("#code").innerText();
    assert.notEqual(codeBefore,codeAfter,"Quantization should update after bit change");
    if(width<=760) await page.locator("#menu").click();
    await page.locator('[data-page="space"]').click();
    const before=await page.locator("#zSelectedOut").innerText();
    await page.locator("#zSelected").evaluate(el=>{el.value="2500";el.dispatchEvent(new Event("input",{bubbles:true}));});
    const after=await page.locator("#zSelectedOut").innerText();assert.notEqual(before,after,"Z slider should update physical Z");
    await page.locator("#pauseSpatial").click();assert.match(await page.locator("#pauseSpatial").innerText(),/Resume/);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    assert.ok(overflow<=3,"Lab horizontal overflow "+overflow+"px at "+width+"px");
    assert.deepEqual(failures,[],"Browser errors in Lab at "+width+"px");
    await page.goto(url+"/foundations/",{waitUntil:"networkidle"});
    assert.match(await page.title(),/Foundations Explorer/);
    await page.locator('[data-tab="storage"]').click();
    const initialId=await page.locator("#soaRows").innerText();
    await page.locator("#removeFish").click();
    const changedId=await page.locator("#soaRows").innerText();
    assert.notEqual(initialId,changedId,"Swap-and-Pop demo updates active SoA");
    assert.match(await page.locator("#soaLog").innerText(),/Deleted #102/);
    await page.locator("#spawnFish").click();
    assert.match(await page.locator("#soaLog").innerText(),/slot 1, generation 2/);
    await page.locator('[data-tab="blueprint"]').click();
    await page.locator("#flattenButton").click();
    assert.match(await page.locator("#flattenText").innerText(),/Resolved Zebrafish Variant/);
    await page.locator('[data-diag="cycle"]').click();
    assert.match(await page.locator("#diagnostic").innerText(),/BP_INHERITANCE_CYCLE/);
    await page.locator('[data-tab="fields"]').click();
    await page.locator('[data-view="memory"]').click();
    assert.match(await page.locator("#fieldContent").innerText(),/0x40800000/);
    const foundationOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    assert.ok(foundationOverflow<=3,"Foundations horizontal overflow "+foundationOverflow+"px at "+width+"px");
    assert.deepEqual(failures,[],"Browser errors in Foundations at "+width+"px");
    await page.goto(url+"/anatomy/",{waitUntil:"networkidle"});
    assert.match(await page.title(),/Living Anatomy Foundation/);
    assert.match(await page.locator("#partTitle").innerText(),/Heart/);
    const firstHeartX=await page.locator('[data-part="heart"]').getAttribute("cx");
    await page.locator("#anchorX").evaluate(el=>{el.value="0.65";el.dispatchEvent(new Event("input",{bubbles:true}));});
    const secondHeartX=await page.locator('[data-part="heart"]').getAttribute("cx");
    assert.notEqual(firstHeartX,secondHeartX,"Anatomy personal anchor override must move organ");
    await page.locator("#presetSkin").click();
    assert.equal(await page.locator('[data-layer="organs"]').count(),0);
    await page.locator("#presetXray").click();
    assert.equal(await page.locator('[data-layer="organs"]').count(),1);
    await page.locator('[data-view="memory"]').click();
    assert.match(await page.locator("#fieldDetail").innerText(),/Actual memory address\/offset: unknown/);
    assert.equal(await page.locator('#partList').getByText(/Stomach/i).count(),0);
    const anatomyOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    assert.ok(anatomyOverflow<=3,"Anatomy overflow "+anatomyOverflow+"px at "+width+"px");
    assert.deepEqual(failures,[],"Browser errors in Anatomy at "+width+"px");
    await page.goto(url+"/ocean/",{waitUntil:"networkidle"});
    await page.locator("#play").click();assert.match(await page.locator("#play").innerText(),/Resume/);
    await page.locator("#step").click();
    const oceanOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    assert.ok(oceanOverflow<=3,"Ocean overflow "+oceanOverflow+"px at "+width+"px");
    assert.deepEqual(failures,[],"Browser errors at "+width+"px");
    console.log("PASS browser smoke at "+width+"px");
    await page.close();
  }
}finally{if(browser)await browser.close();server.kill();}
