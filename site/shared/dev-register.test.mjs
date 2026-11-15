import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { DECISIONS, DEV_CONTRACTS } from "./dev-register.mjs";

test("on-site decisions exist in version-controlled DECISIONS.md with matching statuses", () => {
 const doc=readFileSync("docs/DECISIONS.md","utf8");
 const ids=new Set();
 for(const d of DECISIONS){
   assert.ok(!ids.has(d.id),"Duplicate UI decision "+d.id);ids.add(d.id);
   const re=new RegExp("\\|\\s*"+d.id+"\\s*\\|\\s*"+({accepted:"ACCEPTED",provisional:"PROVISIONAL",open:"OPEN"}[d.status])+"\\s*\\|","m");
   assert.match(doc,re,"Missing/mismatched decision "+d.id);
 }
});
test("implementation contract IDs and descriptions are populated",()=>{
 const ids=new Set();for(const m of DEV_CONTRACTS){assert.ok(m.title&&m.status&&m.gate&&m.missing);assert.ok(!ids.has(m.id));ids.add(m.id);}
});
