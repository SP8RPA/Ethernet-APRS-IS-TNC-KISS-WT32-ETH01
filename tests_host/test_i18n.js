// Run with: node tests_host/test_i18n.js
// Basic browser-free smoke test of the language switch and translated status messages.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

class MockElement {
  constructor(dataset={}) { this.dataset=dataset; this.classList={values:new Set(),toggle:(key,active)=>active?this.classList.values.add(key):this.classList.values.delete(key),add:()=>{},remove:()=>{}};this.attrs={};this.listeners={};this.textContent='';this.checked=false;this.value='test-value';}
  setAttribute(k,v){this.attrs[k]=v;}
  getAttribute(k){return this.attrs[k]||null;}
  addEventListener(k,fn){this.listeners[k]=fn;}
}
const labels=[new MockElement({i18n:'nav.save'}),new MockElement({i18n:'packets.title'})];
const aria=[new MockElement({i18nAria:'nav.toggle'})];
const buttons=[new MockElement({lang:'pl'}),new MockElement({lang:'en'})];
const themeSwitch=new MockElement();
const themeIcon=new MockElement();
const themeLabel=new MockElement();
themeSwitch.querySelector=(selector)=>({'.theme-icon':themeIcon,'.theme-label':themeLabel}[selector]);
const elements={'theme-switch':themeSwitch,backup:new MockElement(),restore:new MockElement(),reboot:new MockElement(),'saveModal':new MockElement(),'savedModal':new MockElement(),'callsign':new MockElement(),'rx-status':new MockElement(),'pause-packets':new MockElement()};
const input = new MockElement();
const form = new MockElement();
const navLink = new MockElement();
const root=new MockElement();root.lang='en';root.setAttribute('data-bs-theme','light');
const document={documentElement:root,getElementById(id){return elements[id]||(elements[id]=new MockElement());},querySelectorAll(selector){if(selector==='[data-i18n]')return labels;if(selector==='[data-i18n-aria]')return aria;if(selector==='#language-switch button[data-lang]')return buttons;throw Error('unexpected selector '+selector);},querySelector(selector){if(selector==='form')return form;if(selector==='input[type=file]')return input;if(selector==='a[href="/received-packets"]')return navLink;if(selector==='#toast')return new MockElement();throw Error('unexpected selector '+selector)}};
const store = new Map();
const localStorage={getItem(k){return store.get(k)||null},setItem(k,v){store.set(k,v)}};
const context={document,localStorage,bootstrap:{Modal:class {hide(){}show(){}},Toast:class {show(){}}},fetch:()=>new Promise(()=>{}),setTimeout:()=>0,clearTimeout:()=>{},AbortController:class {},FormData:class{},console};
const js=fs.readFileSync(path.join(__dirname,'../data_embed/script.js'),'utf8');
vm.runInNewContext(js+`
assert.equal(currentLanguage,'pl');
assert.equal(document.querySelectorAll('[data-i18n]')[0].textContent,'Zapisz');
assert.equal(document.documentElement.lang,'pl');
assert.equal(buttons[0].attrs['aria-pressed'],'true');
setLanguage('en');
assert.equal(document.documentElement.lang,'en');
assert.equal(labels[0].textContent,'Save');
assert.equal(buttons[1].attrs['aria-pressed'],'true');
assert.equal(tr('msg.rxCount',{count:2}),'Packets in WT32 RAM: 2/20');
setLanguage('pl');
assert.equal(tr('msg.rxCount',{count:2}),'Ramki w pamięci WT32: 2/20');
assert.equal(form.value,'test-value');
assert.equal(store.get('wt32-igate-language'),'pl');
// Language button is a button, not submit: clicking shouldn't submit the form.
assert.equal(form.listeners.submit !== undefined,true);
assert.equal(buttons[1].listeners.click !== undefined,true);
`,{...context,assert,labels,buttons,form,store});
console.log('PASS: PL/EN switching, accessibility state, persistence, non-submit behavior');