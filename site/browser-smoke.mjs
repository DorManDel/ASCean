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
    // The original supplied Unified Anatomy Workspace v0.3 is our baseline.
    // Protect its actual controls: layers, organs, presets, undo/redo and visibility.
    await page.goto(url+"/anatomy/",{waitUntil:"networkidle"});
    assert.match(await page.title(),/Unified Anatomy Workspace v0\.3/);
    assert.ok(await page.locator("#layersList .layer").count()>=5,"Original editor layers must render");
    assert.ok(await page.locator('#stageContent [data-part="heart"]').count()>0,"Original rig heart shape must render");
    const initialSize=await page.locator("#stageSize").innerText();
    await page.locator("#preset").selectOption("slender");
    const slenderSize=await page.locator("#stageSize").innerText();
    assert.notEqual(initialSize,slenderSize,"Species morphology presets must resize the existing rig");
    await page.locator("#undo").click();
    assert.equal(await page.locator("#stageSize").innerText(),initialSize,"Undo must restore original morphology");
    await page.locator("#redo").click();
    assert.equal(await page.locator("#stageSize").innerText(),slenderSize,"Redo must preserve original actions");
    if(width<=760) await page.locator("#quickSelect").selectOption("part:bowel");
    else await page.locator('#layersList [data-choose="part:bowel"]').first().click();
    assert.equal(await page.locator("#selectedName").innerText(),"Intestine");
    await page.locator("#toggleVis").click();
    assert.equal(await page.locator('#stageContent [data-part="bowel"]').count(),0);
    await page.locator("#toggleVis").click();
    assert.ok(await page.locator('#stageContent [data-part="bowel"]').count()>0);
    await page.locator("#zoomIn").click();
    assert.match(await page.locator("#zoomOutLabel").innerText(),/%/);
    const anatomyOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    assert.ok(anatomyOverflow<=3,"Original Anatomy horizontal overflow "+anatomyOverflow+"px at "+width+"px");
    assert.deepEqual(failures,[],"Browser errors in original Anatomy at "+width+"px");
    // Real third-party SVG icon review; no changes to editor or biological state.
    await page.goto(url+"/icon-review/",{waitUntil:"networkidle"});
    assert.match(await page.title(),/Existing SVG Icon Review/);
    assert.equal(await page.locator(".tile").count(),47,"37 system + 10 anatomy original source icons");
    const missingMasks=await page.evaluate(async()=>{
      const manifest=await (await fetch("./icons.json")).json();
      const paths=[...manifest.system,...manifest.anatomy].map(x=>x.path);
      const missing=[];
      for(const path of paths){const r=await fetch(path);if(!r.ok||!(await r.text()).includes("<svg"))missing.push(path);}
      return missing;
    });
    assert.deepEqual(missingMasks,[],"All gallery icons must be actual accessible SVG source files");
    await page.locator('.tile[data-id="mouse-pointer-2"] [data-value="keep"]').click();
    assert.match(await page.locator("#progress").innerText(),/1 reviewed/);
    const imgOverflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    assert.ok(imgOverflow<=3,"Icon gallery overflow at "+width+"px: "+imgOverflow);
    assert.deepEqual(failures,[],"Browser errors in icon review at "+width+"px");
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
