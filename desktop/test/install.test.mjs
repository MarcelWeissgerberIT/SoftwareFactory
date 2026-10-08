import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {cpSync} from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {installMac} from '../scripts/install-mac.mjs';

async function fixture(callback){
  const root=await fs.mkdtemp(path.join(os.tmpdir(),'one-factory-installer-'));
  const desktop=path.join(root,'desktop'),applications=path.join(root,'Applications');
  const name='ONE Software Factory';
  const source=path.join(desktop,'out',`${name}-darwin-arm64`,`${name}.app`);
  const destination=path.join(applications,`${name}.app`);
  await fs.mkdir(source,{recursive:true});await fs.mkdir(destination,{recursive:true});
  await fs.writeFile(path.join(desktop,'package.json'),JSON.stringify({productName:name}));
  await fs.writeFile(path.join(source,'marker'),'new');await fs.writeFile(path.join(destination,'marker'),'old');
  const state={running:false,foreign:false};
  const run=(command,args)=>{
    if(command==='/usr/libexec/PlistBuddy')return args[1].includes('Identifier')?(state.foreign&&args[2].startsWith(destination)?'org.other.app':'com.getonecms.softwarefactory'):name;
    if(command==='/bin/ps')return state.running?`${destination}/Contents/MacOS/${name}\n`:'';
    if(command==='/usr/bin/codesign')return '';
    if(command==='/usr/bin/ditto'){cpSync(args[0],args[1],{recursive:true});return '';}
    throw new Error(`Unexpected command ${command}`);
  };
  try{await callback({desktop,applications,source,destination,state,run,log:()=>{}});}finally{await fs.rm(root,{recursive:true,force:true});}
}

test('default installation preserves an existing application',()=>fixture(async options=>{
  await assert.rejects(installMac(options),/already exists/);
  assert.equal(await fs.readFile(path.join(options.destination,'marker'),'utf8'),'old');
}));
test('explicit updates refuse running or foreign applications',()=>fixture(async options=>{
  options.state.running=true;
  await assert.rejects(installMac({...options,replace:true}),/Quit ONE/);
  options.state.running=false;options.state.foreign=true;
  await assert.rejects(installMac({...options,replace:true}),/different identity/);
  assert.equal(await fs.readFile(path.join(options.destination,'marker'),'utf8'),'old');
}));
test('explicit updates preserve the old bundle and install the verified staged copy',()=>fixture(async options=>{
  const result=await installMac({...options,replace:true});
  assert.equal(await fs.readFile(path.join(result.destination,'marker'),'utf8'),'new');
  assert.equal(await fs.readFile(path.join(result.backup,'marker'),'utf8'),'old');
  assert.ok(result.backup.startsWith(path.join(options.desktop,'out','backups')+path.sep));
  assert.deepEqual(await fs.readdir(options.applications),['ONE Software Factory.app']);
}));
