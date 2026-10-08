import path from 'node:path';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { packager } from '@electron/packager';

const desktop=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const repository=path.dirname(desktop);
const metadata=JSON.parse(await fs.readFile(path.join(desktop,'package.json'),'utf8'));
const stage=path.join(desktop,'build','app');
const out=path.join(desktop,'out');
const args=new Set(process.argv.slice(2));
if(process.platform!=='darwin')throw new Error('Build the macOS bundle on a Mac.');
await fs.access(path.join(repository,'dist','index.html'));
// Only this generated staging directory is replaced; source dist is read-only.
await fs.rm(stage,{recursive:true,force:true});await fs.mkdir(stage,{recursive:true});
await fs.cp(path.join(repository,'dist'),path.join(stage,'site'),{recursive:true,dereference:true});
for(const file of ['main.cjs','protocol.cjs'])await fs.copyFile(path.join(desktop,file),path.join(stage,file));
await fs.writeFile(path.join(stage,'package.json'),JSON.stringify({name:metadata.name,productName:metadata.productName,version:metadata.version,main:'main.cjs',description:metadata.description,author:metadata.author,license:metadata.license},null,2)+'\n');
const icon=path.join(desktop,'assets','factory.icns');
try{await fs.access(icon);}catch{execFileSync(process.execPath,[path.join(desktop,'scripts','create-icon.mjs')],{stdio:'inherit'});}
const bundles=await packager({dir:stage,name:metadata.productName,platform:'darwin',arch:'arm64',electronVersion:metadata.devDependencies.electron,appBundleId:'com.getonecms.softwarefactory',appCategoryType:'public.app-category.developer-tools',appVersion:metadata.version,buildVersion:metadata.version,icon,out,overwrite:true,asar:true,prune:true,extendInfo:{NSHumanReadableCopyright:'Atlas × ONE · Offline software factory',NSHighResolutionCapable:true}});
for(const folder of bundles){
  const bundle=path.join(folder,`${metadata.productName}.app`);
  // Ad-hoc signing is sufficient for this local build, and makes bundle
  // integrity verifiable. It is not Developer ID signing or notarization.
  execFileSync('/usr/bin/codesign',['--force','--deep','--sign','-',bundle],{stdio:'inherit'});
  execFileSync('/usr/bin/codesign',['--verify','--deep','--strict',bundle],{stdio:'inherit'});
  console.log(`Built: ${bundle}`);
}
if(args.has('--install'))execFileSync(process.execPath,[path.join(desktop,'scripts','install-mac.mjs')],{stdio:'inherit'});
