'use strict';
const {app,BrowserWindow,Menu,protocol,session,net,shell,dialog}=require('electron');
const path=require('node:path');
const {existsSync}=require('node:fs');
const {SCHEME,ORIGIN,isAppURL,isExternalURL,createHandler}=require('./protocol.cjs');

const APP_NAME='ONE Software Factory';
app.setName(APP_NAME);
app.enableSandbox();
protocol.registerSchemesAsPrivileged([{scheme:SCHEME,privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true,stream:true}}]);
let mainWindow=null;

async function openExternal(value){if(isExternalURL(value))await shell.openExternal(value);}
function createWindow(){
  const window=new BrowserWindow({
    width:1512,height:982,minWidth:960,minHeight:680,show:false,
    title:APP_NAME,backgroundColor:'#eef2f3',
    webPreferences:{sandbox:true,contextIsolation:true,nodeIntegration:false,nodeIntegrationInWorker:false,webSecurity:true,allowRunningInsecureContent:false,webviewTag:false,spellcheck:false}
  });
  mainWindow=window;
  window.once('ready-to-show',()=>window.show());
  window.on('closed',()=>{if(mainWindow===window)mainWindow=null;});
  window.webContents.setWindowOpenHandler(({url})=>{openExternal(url).catch(console.error);return {action:'deny'};});
  window.webContents.on('will-navigate',(event,url)=>{if(!isAppURL(url)){event.preventDefault();openExternal(url).catch(console.error);}});
  window.webContents.on('will-redirect',(event,url)=>{if(!isAppURL(url))event.preventDefault();});
  window.webContents.on('will-attach-webview',event=>event.preventDefault());
  window.loadURL(`${ORIGIN}/index.html`).catch(error=>dialog.showErrorBox(APP_NAME,error.message));
  return window;
}

const ready=app.whenReady().then(async()=>{
  const bundled=path.join(__dirname,'site');
  const site=existsSync(bundled)?bundled:path.join(__dirname,'..','dist');
  session.defaultSession.setPermissionRequestHandler((_contents,_permission,callback)=>callback(false));
  session.defaultSession.setPermissionCheckHandler(()=>false);
  // The renderer is entirely offline. Deliberate product/help links open in
  // the system browser; no remote content is loaded in the privileged app.
  session.defaultSession.webRequest.onBeforeRequest({urls:['http://*/*','https://*/*','ws://*/*','wss://*/*']},(_details,callback)=>callback({cancel:true}));
  session.defaultSession.on('will-download',(_event,item)=>{
    item.setSaveDialogOptions({title:'Save ONE Software Factory recording',defaultPath:path.join(app.getPath('downloads'),path.basename(item.getFilename()))});
  });
  protocol.handle(SCHEME,await createHandler(site,net));
  app.setAboutPanelOptions({applicationName:APP_NAME,applicationVersion:app.getVersion(),copyright:'Atlas × ONE · Offline workflow simulation',website:'https://getonecms.com'});
  Menu.setApplicationMenu(Menu.buildFromTemplate([
    {label:APP_NAME,submenu:[{role:'about'},{type:'separator'},{role:'hide'},{role:'hideOthers'},{role:'unhide'},{type:'separator'},{role:'quit'}]},
    {label:'Edit',submenu:[{role:'undo'},{role:'redo'},{type:'separator'},{role:'cut'},{role:'copy'},{role:'paste'},{role:'selectAll'}]},
    {label:'View',submenu:[{role:'reload'},{role:'toggleDevTools'},{type:'separator'},{role:'resetZoom'},{role:'zoomIn'},{role:'zoomOut'},{type:'separator'},{role:'togglefullscreen'}]},
    {role:'windowMenu'},
    {role:'help',submenu:[{label:'ONE website',click:()=>openExternal('https://getonecms.com')},{label:'Software Factory source',click:()=>openExternal('https://github.com/MarcelWeissgerberIT/SoftwareFactory')}]}
  ]));
  return createWindow();
}).catch(error=>{dialog.showErrorBox(APP_NAME,error.message);app.quit();throw error;});

app.on('activate',()=>{if(app.isReady()&&!BrowserWindow.getAllWindows().length)createWindow();});
app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});
module.exports={ready,getWindow:()=>mainWindow};
