const test=require('node:test');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs/promises');
const os=require('node:os');
const {fileURLToPath}=require('node:url');
const {resolveRequest,isExternalURL,isAppURL,contentPolicy,createHandler}=require('../protocol.cjs');
const root='/bundle/site';
test('only serves files inside the application origin and root',()=>{
  assert.equal(resolveRequest(root,'getonecms-factory://app/'),path.join(root,'index.html'));
  assert.equal(resolveRequest(root,'getonecms-factory://app/assets/demo.mp4'),path.join(root,'assets/demo.mp4'));
  for(const url of ['https://getonecms.com/','getonecms-factory://attacker/index.html','getonecms-factory://user@app/index.html','getonecms-factory://app/%2e%2e%2fsecret','getonecms-factory://app/%00','getonecms-factory://app/%5csecret','getonecms-factory://app:999/index.html'])assert.equal(resolveRequest(root,url),null,url);
});
test('external navigation allows only explicit product/source HTTPS links',()=>{
  assert.equal(isExternalURL('https://getonecms.com'),true);
  assert.equal(isExternalURL('https://github.com/MarcelWeissgerberIT/SoftwareFactory/issues'),true);
  for(const url of ['http://getonecms.com','file:///etc/passwd','https://getonecms.com.attacker.test','https://getonecms.com@attacker.test','https://github.com/another/repo','javascript:alert(1)'])assert.equal(isExternalURL(url),false,url);
  assert.equal(isAppURL('getonecms-factory://app/index.html'),true);
});
test('CSP hashes only the known import map and permits local recording blobs',()=>{
  const policy=contentPolicy('<script type="importmap">{"imports":{"three":"./vendor/three.module.js"}}</script><script>alert(1)</script>');
  assert.match(policy,/script-src 'self' 'sha256-[A-Za-z0-9+/]+=*'/);
  assert.match(policy,/media-src 'self' blob:/);
  assert.doesNotMatch(policy,/script-src[^;]*unsafe-inline|unsafe-eval|https:/);
});
test('handler serves bundled assets with security headers and rejects symlink escapes',async()=>{
  const directory=await fs.mkdtemp(path.join(os.tmpdir(),'one-factory-protocol-'));
  try{
    const site=path.join(directory,'site');await fs.mkdir(site);
    await fs.writeFile(path.join(site,'index.html'),'<script type="importmap">{"imports":{}}</script>');
    await fs.writeFile(path.join(site,'demo.mp4'),'local-video');
    await fs.writeFile(path.join(directory,'private.txt'),'outside-site');
    await fs.symlink(path.join(directory,'private.txt'),path.join(site,'escape.txt'));
    const calls=[];
    const handler=await createHandler(site,{fetch:async(url,options)=>{
      calls.push({url,options});
      return new Response(options.method==='HEAD'?null:await fs.readFile(fileURLToPath(url)),{status:200});
    }});
    const makeRequest=(pathname,method='GET',headers={})=>({url:`getonecms-factory://app/${pathname}`,method,headers:new Headers(headers)});
    const response=await handler(makeRequest('demo.mp4','GET',{Range:'bytes=0-4'}));
    assert.equal(response.status,200);
    assert.equal(await response.text(),'local-video');
    assert.equal(response.headers.get('content-type'),'video/mp4');
    assert.equal(response.headers.get('x-content-type-options'),'nosniff');
    assert.match(response.headers.get('content-security-policy'),/media-src 'self' blob:/);
    assert.equal(calls[0].options.headers.Range,'bytes=0-4');
    const head=await handler(makeRequest('demo.mp4','HEAD'));
    assert.equal(head.status,200);assert.equal(await head.text(),'');
    const callCount=calls.length;
    for(const filename of ['escape.txt','missing.txt','%2e%2e%2fprivate.txt'])assert.equal((await handler(makeRequest(filename))).status,404,filename);
    assert.equal((await handler(makeRequest('demo.mp4','POST'))).status,405);
    assert.equal(calls.length,callCount,'rejected requests never reach the file fetcher');
  }finally{await fs.rm(directory,{recursive:true,force:true});}
});
