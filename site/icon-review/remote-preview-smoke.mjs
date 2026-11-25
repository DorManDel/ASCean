import { chromium } from "playwright";
import assert from "node:assert/strict";
const sha=process.env.PREVIEW_SHA;
assert.match(sha??"",/^[0-9a-f]{40}$/);
const target="https://raw.githack.com/DorManDel/ASCean/"+sha+"/site/icon-review/index.html";
let browser;
try {
  browser=await chromium.launch({headless:true});
  for(const width of [390,1280]) {
    const context=await browser.newContext({viewport:{width,height:820}});
    await context.addCookies([{name:"__Http-phish",value:"1",url:"https://raw.githack.com/",secure:true,httpOnly:true,sameSite:"Lax"}]);
    const page=await context.newPage();
    const errors=[];page.on("pageerror",e=>errors.push(e.message));
    let ready=false;
    for(let attempt=0;attempt<4;attempt++) {
      const response=await page.goto(target,{waitUntil:"networkidle",timeout:45000});
      if(response?.status()===200&&(await page.title()).includes("Existing SVG Icon Review")){ready=true;break;}
      await new Promise(r=>setTimeout(r,4000));
    }
    assert.ok(ready,"Public SVG review must load actual HTML from GitHub proxy");
    assert.equal(await page.locator(".tile").count(),47);
    const health=await page.evaluate(async()=>{
      const files=["./vendor/lucide/mouse-pointer-2.svg","./vendor/tabler/fish.svg","./vendor/health/intestine.svg"];
      return await Promise.all(files.map(async f=>{const r=await fetch(f);return [f,r.status,(await r.text()).includes("<svg")];}));
    });
    assert.ok(health.every(x=>x[1]===200&&x[2]),JSON.stringify(health));
    await page.locator(".tile[data-id=\"mouse-pointer-2\"] [data-value=\"keep\"]").click();
    assert.match(await page.locator("#progress").innerText(),/1 reviewed/);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
    assert.ok(overflow<=3,"Icon public gallery overflow at "+width+"px: "+overflow);
    assert.deepEqual(errors,[]);
    console.log("PASS public existing SVG icons "+width+"px "+target);
    await context.close();
  }
} finally { if(browser) await browser.close(); }
