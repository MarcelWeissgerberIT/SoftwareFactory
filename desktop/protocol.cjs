'use strict';
const path = require('node:path');
const fs = require('node:fs/promises');
const { createHash } = require('node:crypto');
const { pathToFileURL } = require('node:url');

const SCHEME = 'getonecms-factory';
const HOST = 'app';
const ORIGIN = `${SCHEME}://${HOST}`;
const MIME = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json', '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.webp':'image/webp', '.ico':'image/x-icon', '.mp4':'video/mp4', '.webm':'video/webm', '.woff2':'font/woff2', '.woff':'font/woff' };

function within(root, candidate) {
  const relative = path.relative(root, candidate);
  return relative === '' || (!relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative));
}
function resolveRequest(root, requestURL) {
  let url, decoded;
  try { url = new URL(requestURL); decoded = decodeURIComponent(url.pathname); } catch { return null; }
  if (url.protocol !== `${SCHEME}:` || url.host !== HOST || url.username || url.password || decoded.includes('\0') || decoded.includes('\\')) return null;
  const relative = decoded.replace(/^\/+/, '') || 'index.html';
  const candidate = path.resolve(root, relative);
  return within(root, candidate) ? candidate : null;
}
function isAppURL(value) {
  try { const u=new URL(value); return u.protocol===`${SCHEME}:` && u.host===HOST && !u.username && !u.password; } catch { return false; }
}
function isExternalURL(value) {
  try {
    const u=new URL(value);
    return u.protocol==='https:' && !u.username && !u.password && (
      ['getonecms.com','www.getonecms.com'].includes(u.hostname) ||
      (u.hostname==='github.com' && (u.pathname==='/MarcelWeissgerberIT/SoftwareFactory' || u.pathname.startsWith('/MarcelWeissgerberIT/SoftwareFactory/')))
    );
  } catch { return false; }
}
function contentPolicy(html) {
  // The only inline script is the website's import map. Hash exact content;
  // ordinary scripts still need to come from the bundled app origin.
  const hashes=[];
  for (const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)) {
    if (/\bsrc\s*=/i.test(match[1]) || !/\btype\s*=\s*["']importmap["']/i.test(match[1])) continue;
    hashes.push(`'sha256-${createHash('sha256').update(match[2]).digest('base64')}'`);
  }
  return ["default-src 'self'", `script-src 'self' ${hashes.join(' ')}`, "style-src 'self' 'unsafe-inline'", "img-src 'self' data: blob:", "media-src 'self' blob:", "font-src 'self' data:", "connect-src 'self' blob:", "worker-src 'self' blob:", "object-src 'none'", "base-uri 'self'", "form-action 'none'", "frame-src 'none'"].join('; ');
}
async function createHandler(root, net) {
  const realRoot = await fs.realpath(root);
  const policy = contentPolicy(await fs.readFile(path.join(root,'index.html'),'utf8'));
  return async request => {
    if (!['GET','HEAD'].includes(request.method)) return new Response('Method not allowed',{status:405});
    const candidate=resolveRequest(root,request.url);
    if (!candidate) return new Response('Not found',{status:404});
    try {
      const realFile=await fs.realpath(candidate);
      if (!within(realRoot,realFile) || !(await fs.stat(candidate)).isFile()) return new Response('Not found',{status:404});
      const headers={};
      const range=request.headers.get('range'); if(range)headers.Range=range;
      const source=await net.fetch(pathToFileURL(candidate).toString(),{method:request.method,headers});
      const responseHeaders=new Headers(source.headers);
      responseHeaders.set('Content-Type',MIME[path.extname(candidate).toLowerCase()]||'application/octet-stream');
      responseHeaders.set('Content-Security-Policy',policy);
      responseHeaders.set('X-Content-Type-Options','nosniff');
      responseHeaders.set('Referrer-Policy','no-referrer');
      return new Response(request.method==='HEAD'?null:source.body,{status:source.status,statusText:source.statusText,headers:responseHeaders});
    } catch { return new Response('Not found',{status:404}); }
  };
}
module.exports={SCHEME,ORIGIN,resolveRequest,within,isAppURL,isExternalURL,contentPolicy,createHandler};
