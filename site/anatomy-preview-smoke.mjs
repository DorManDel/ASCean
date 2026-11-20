import assert from "node:assert/strict";
import { chromium } from "playwright";

// This preview points to the committed ORIGINAL editor, not any rewrite.
// Third-party raw.githack.com requires a one-time HTML content acknowledgement.
const sha=process.env.PREVIEW_SHA;
assert.match(sha??"",/^[a-f0-9]{40}$/);
const url="https://raw.githack.com/DorManDel/ASCean/"+sha+"/site/anatomy/index.html";
let browser;
try{
  browser=await chromium.launch({headless:true});
  for(const width of [1280,390]){
    const page=await browser.newPage({viewport:{width,height:820}});
    await page.context().addCookies([{name:"__Http-phish",value:"1",url:"https://raw.githack.com/",httpOnly:true,secure:true,sameSite:"Lax"}]);
    const failures=[];
    page.on("pageerror",error=>failures.push(error.message));
    page.on("console",message=>{if(message.type()==="error")failures.push(message.text());});
    let response;
    for(let attempt=0;attempt<4;attempt++){
      response=await page.goto(url,{waitUntil:"networkidle",timeout:30000});
      if(response?.status()===200&&(await page.title()).includes("Unified Anatomy Workspace"))break;
      await new Promise(resolve=>setTimeout(resolve,2500));
    }
    assert.equal(response?.status(),200);
    assert.match(await page.title(),/Unified Anatomy Workspace v0\.3/);
    assert.ok(await page.locator('#stageContent [data-part="spine"]').count()>0);
    assert.ok(await page.locator("#layersList .layer").count()>=5);
    const before=await page.locator("#stageSize").innerText();
    await page.locator("#preset").selectOption("deep");
    assert.notEqual(await page.locator("#stageSize").innerText(),before);
    await page.locator("#undo").click();
    assert.equal(await page.locator("#stageSize").innerText(),before);
    assert.deepEqual(failures,[],"Public original editor console errors");
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    assert.ok(overflow<=3,"External original Anatomy editor overflow at "+width+"px: "+overflow);
    console.log("PASS original public editor "+width+"px "+url);
    await page.close();
  }
}finally{if(browser)await browser.close();}
