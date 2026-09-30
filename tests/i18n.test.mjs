import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const source=await readFile(new URL('../dist/i18n.js',import.meta.url),'utf8');
const load=key=>import(`data:text/javascript;base64,${Buffer.from(source+`\n// ${key}`).toString('base64')}`);

test('English is the default; an explicit German choice persists and unsupported saved values do not override the default',async()=>{
 const saved=new Map();
 globalThis.localStorage={getItem:key=>saved.get(key),setItem:(key,value)=>saved.set(key,value)};
 try {
  const first=await load('first');assert.equal(first.getLanguage(),'en');
  first.setLanguage('de');assert.equal((await load('reload')).getLanguage(),'de');
  saved.set('software-factory-language','fr');assert.equal((await load('invalid')).getLanguage(),'en');
  first.setLanguage('en');assert.equal(saved.get('software-factory-language'),'en');
 } finally {delete globalThis.localStorage;}
});

test('recorded simulation events can be displayed in both languages without altering their source',async()=>{
 const {t,setLanguage}=await load('events');
 const events=['Design überarbeiten: verständliche Statusbegriffe, Kontrast und Lesbarkeit','QA-Nacharbeit: Leere Listen verständlich erklären','Design 3 sichtbar umgesetzt','Plan freigeben bestätigt'];
 const original=[...events];
 setLanguage('en');
 assert.deepEqual(events.map(t),['Revise design: clear status labels, contrast and readability','QA rework: Explain empty lists clearly','Design 3 visibly implemented','Approve plan confirmed']);
 setLanguage('de');assert.deepEqual(events.map(t),original);assert.deepEqual(events,original);
});
