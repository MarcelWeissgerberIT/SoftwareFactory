import {readFile,readdir,stat} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {resolve,dirname} from 'node:path';
const root=resolve('dist');
async function files(dir){const out=[];for(const name of await readdir(dir)){const path=resolve(dir,name);const info=await stat(path);if(info.isDirectory()){if(name!=='vendor')out.push(...await files(path))}else out.push(path)}return out}
for(const file of await files(root)){
 if(file.endsWith('.js')){const source=await readFile(file,'utf8');const result=spawnSync(process.execPath,['--input-type=module','--check'],{input:source,encoding:'utf8'});if(result.status)throw new Error(`${file}: ${result.stderr}`);for(const match of source.matchAll(/from\s+['"](\.\.?\/[^'"]+)['"]/g))await stat(resolve(dirname(file),match[1]));}
 if(file.endsWith('.html')){const source=await readFile(file,'utf8');for(const match of source.matchAll(/(?:href|src)=["'](\.\/[^"'#?]+)["']/g))await stat(resolve(dirname(file),match[1]));}
}
console.log('Syntax and local asset references verified.');
