/**
 * Check a PUBLIC, commit-pinned static preview served through raw.githack.com.
 * This is NOT GitHub Pages deployment. No production site or branch is changed.
 */
import assert from "node:assert/strict";
import { chromium } from "playwright";

const sha = process.env.PREVIEW_SHA;
assert.match(sha ?? "", /^[0-9a-f]{40}$/,"PREVIEW_SHA must pin one commit");
const url = "https://raw.githack.com/DorManDel/ASCean/" + sha + "/site/anatomy/index.html";
const pause=milliseconds=>new Promise(resolve=>setTimeout(resolve,milliseconds));
let browser;
try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390]){
    const page=await browser.newPage({viewport:{width,height:820}});
    // rawgit.hack documents a first-visit HTML notice; automated browser tests
    // use its documented consent cookie. Human visitors may need to confirm once.
    await page.context().addCookies([{name:"__Http-phish",value:"1",url:"https://raw.githack.com/",httpOnly:true,secure:true,sameSite:"Lax"}]);
    const errors=[];
    page.on("pageerror",error=>errors.push(error.message));
    page.on("console",msg=>{if(msg.type()==="error")errors.push(msg.text());});
    let success=false,lastError=null;
    for(let attempt=0;attempt<4;attempt++){
      try{
        const response=await page.goto(url,{waitUntil:"networkidle",timeout:30000});
        assert.equal(response?.status(),200,"Public preview must return HTTP 200");
        assert.match(await page.title(),/Living Anatomy Foundation/);
        await page.locator("#layerList .layer-row").first().waitFor({timeout:15000});
        assert.equal(await page.locator("#partTitle").innerText(),"Heart");
        success=true;break;
      }catch(error){lastError=error;if(attempt!==3)await pause(4000);}
    }
    if(!success)throw lastError;
    await page.locator("#presetSkin").click();
    assert.equal(await page.locator('[data-layer="organs"]').count(),0);
    await page.locator("#presetXray").click();
    assert.equal(await page.locator('[data-layer="organs"]').count(),1);
    const before=await page.locator('[data-part="heart"]').getAttribute("cx");
    await page.locator("#anchorX").evaluate(el=>{el.value="0.61";el.dispatchEvent(new Event("input",{bubbles:true}));});
    const after=await page.locator('[data-part="heart"]').getAttribute("cx");
    assert.notEqual(before,after,"Personal anchor edits must move anatomy without editing the blueprint");
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    assert.ok(overflow<=3,"Horizontal overflow at "+width+"px: "+overflow);
    assert.deepEqual(errors,[],"Browser script errors on remote preview");
    console.log("PASS public preview "+width+"px "+url);
    await page.close();
  }
}finally{if(browser)await browser.close();}
