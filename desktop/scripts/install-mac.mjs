import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const desktop=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const {productName}=JSON.parse(await fs.readFile(path.join(desktop,'package.json'),'utf8'));
const source=path.join(desktop,'out',`${productName}-darwin-arm64`,`${productName}.app`);
const applications=path.join(os.homedir(),'Applications');
const destination=path.join(applications,`${productName}.app`);
await fs.access(source);await fs.mkdir(applications,{recursive:true});
let exists=false;try{await fs.lstat(destination);exists=true;}catch(error){if(error.code!=='ENOENT')throw error;}
if(exists)throw new Error(`An app already exists at ${destination}. Move it to a backup location explicitly before installing; it will not be replaced automatically.`);
execFileSync('/usr/bin/ditto',[source,destination],{stdio:'inherit'});
execFileSync('/usr/bin/codesign',['--verify','--deep','--strict',destination],{stdio:'inherit'});
console.log(`Installed: ${destination}`);
