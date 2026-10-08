import path from 'node:path';
import fs from 'node:fs/promises';
import os from 'node:os';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const script=fileURLToPath(import.meta.url);
const desktopRoot=path.resolve(path.dirname(script),'..');
const expectedBundleId='com.getonecms.softwarefactory';

async function existing(pathname){
  try{return await fs.lstat(pathname);}catch(error){if(error.code==='ENOENT')return null;throw error;}
}

// Filesystem parameters and the command runner allow tests against disposable
// bundles. The CLI always uses this checkout and the user's Applications folder.
export async function installMac({desktop=desktopRoot,applications=path.join(os.homedir(),'Applications'),replace=false,run=execFileSync,log=console.log}={}){
  const {productName}=JSON.parse(await fs.readFile(path.join(desktop,'package.json'),'utf8'));
  const source=path.join(desktop,'out',`${productName}-darwin-arm64`,`${productName}.app`);
  const destination=path.join(applications,`${productName}.app`);
  const verify=bundle=>run('/usr/bin/codesign',['--verify','--deep','--strict',bundle],{stdio:'inherit'});
  const validateIdentity=async bundle=>{
    const entry=await existing(bundle);
    if(!entry?.isDirectory()||entry.isSymbolicLink())throw new Error(`Expected an application directory: ${bundle}`);
    const info=path.join(bundle,'Contents','Info.plist');
    const value=key=>String(run('/usr/libexec/PlistBuddy',['-c',`Print :${key}`,info],{encoding:'utf8'})).trim();
    if(value('CFBundleIdentifier')!==expectedBundleId||value('CFBundleName')!==productName)throw new Error(`Refusing an application with a different identity: ${bundle}`);
    verify(bundle);
  };
  const assertNotRunning=()=>{
    const processes=String(run('/bin/ps',['-axo','command='],{encoding:'utf8'}));
    if(processes.split('\n').some(command=>command.trimStart().startsWith(`${destination}/Contents/`)))throw new Error(`Quit ${productName} before installing an update.`);
  };
  await validateIdentity(source);
  await fs.mkdir(applications,{recursive:true});
  const previous=await existing(destination);
  if(previous&&!replace)throw new Error(`An app already exists at ${destination}. Use --replace to back up and update this application explicitly.`);
  if(previous){await validateIdentity(destination);assertNotRunning();}
  const temporary=await fs.mkdtemp(path.join(applications,'.one-factory-install-'));
  const staged=path.join(temporary,`${productName}.app`);
  let backup=null;
  try{
    run('/usr/bin/ditto',[source,staged],{stdio:'inherit'});
    await validateIdentity(staged);
    assertNotRunning();
    if(previous){
      const backups=path.join(desktop,'out','backups');await fs.mkdir(backups,{recursive:true});
      const timestamp=new Date().toISOString().replace(/[:.]/g,'-');
      const folder=await fs.mkdtemp(path.join(backups,`${timestamp}-`));
      backup=path.join(folder,`${productName}.app`);
      await fs.rename(destination,backup);
    }else if(await existing(destination)){
      throw new Error(`An app appeared at ${destination} during installation; it will not be replaced.`);
    }
    try{await fs.rename(staged,destination);}catch(error){
      if(backup){
        try{await fs.rename(backup,destination);}catch(restoreError){throw new AggregateError([error,restoreError],`Installation failed. The previous app is preserved at ${backup}.`);}
      }
      throw error;
    }
    if(backup)log(`Previous app preserved: ${backup}`);
    log(`Installed: ${destination}`);
    return {destination,backup};
  }finally{
    await fs.rm(temporary,{recursive:true,force:true});
  }
}

if(process.argv[1]&&path.resolve(process.argv[1])===script){
  const args=new Set(process.argv.slice(2));
  for(const arg of args)if(arg!=='--replace')throw new Error(`Unknown installer option: ${arg}`);
  await installMac({replace:args.has('--replace')});
}
