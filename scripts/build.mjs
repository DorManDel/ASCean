import {cpSync,mkdirSync} from "node:fs";
mkdirSync("dist",{recursive:true});
for(const path of ["index.html","styles","apps/ocean/index.html","apps/mechanics-lab/index.html"])cpSync(path,"dist/"+path,{recursive:true,force:true});
console.log("ASCean dist ready.");
