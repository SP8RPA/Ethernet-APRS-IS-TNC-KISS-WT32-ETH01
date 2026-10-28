// node tests_host/test_theme.js
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

class MockElement {
  constructor(dataset = {}) {
    this.dataset = dataset; this.attrs = {}; this.listeners = {};
    this.textContent = ''; this.value = 'test-value'; this.checked = false;
    this.classList = {toggle() {}, add() {}, remove() {}};
  }
  setAttribute(name, value) {this.attrs[name] = value;}
  getAttribute(name) {return this.attrs[name] ?? null;}
  addEventListener(name, handler) {this.listeners[name] = handler;}
}
const themeSwitch = new MockElement();
const themeIcon = new MockElement();
const themeLabel = new MockElement();
themeSwitch.querySelector = (s) => ({'.theme-icon': themeIcon, '.theme-label': themeLabel}[s]);
const labels = [new MockElement({i18n:'nav.save'}), new MockElement({i18n:'packets.title'})];
const aria = [new MockElement({i18nAria: 'nav.toggle'})];
const buttons = [new MockElement({lang:'pl'}), new MockElement({lang:'en'})];
const elements={backup:new MockElement(),restore:new MockElement(),reboot:new MockElement(),
 'saveModal':new MockElement(),'savedModal':new MockElement(),
 'callsign':new MockElement(),'rx-status':new MockElement(),'pause-packets':new MockElement(),
 'theme-switch':themeSwitch};
const input = new MockElement(), form = new MockElement(), navLink = new MockElement();
const root = new MockElement(); root.setAttribute('data-bs-theme','light'); root.lang='pl';
const document = {documentElement:root, getElementById:(id)=>elements[id]||(elements[id]=new MockElement()),
  querySelectorAll(sel){if(sel==='[data-i18n]')return labels;if(sel==='[data-i18n-aria]')return aria;
    if(sel==='#language-switch button[data-lang]')return buttons;throw Error('unexpected '+sel);},
  querySelector(sel){if(sel==='form')return form;if(sel==='input[type=file]')return input;
    if(sel==='a[href="/received-packets"]')return navLink;if(sel==='#toast')return new MockElement();
    throw Error('unexpected '+sel);}}
const storage=new Map();
const localStorage={getItem(k){return storage.get(k)||null},setItem(k,v){storage.set(k,v)}};
const ctx={document,localStorage,
 bootstrap:{Modal:class{show(){}hide(){}},Toast:class{show(){}}},
 fetch:()=>new Promise(()=>{}),setTimeout:()=>0,clearTimeout:()=>{},AbortController:class{},FormData:class{},console,assert,
 themeSwitch,themeIcon,themeLabel,storage,form,buttons,root};
const js=fs.readFileSync(path.join(__dirname,'../data_embed/script.js'),'utf8');
vm.runInNewContext(js+`
assert.equal(currentTheme,'light');
assert.equal(themeLabel.textContent,'Ciemny motyw');
assert.equal(themeSwitch.attrs['aria-pressed'],'false');
assert.equal(root.getAttribute('data-bs-theme'),'light');
themeSwitch.listeners.click({preventDefault(){}});
assert.equal(root.getAttribute('data-bs-theme'),'dark');
assert.equal(storage.get('wt32-igate-theme'),'dark');
assert.equal(themeLabel.textContent,'Jasny motyw');
assert.equal(themeSwitch.attrs['aria-pressed'],'true');
setLanguage('en');
assert.equal(themeLabel.textContent,'Light mode');
assert.equal(root.getAttribute('data-bs-theme'),'dark');
assert.equal(storage.get('wt32-igate-language'),'en');
setTheme('light');
assert.equal(themeLabel.textContent,'Dark mode');
assert.equal(root.getAttribute('data-bs-theme'),'light');
assert.equal(storage.get('wt32-igate-theme'),'light');
assert.equal(form.value,'test-value');
`,ctx);
console.log('PASS: dark/light switch, PL/EN labels, localStorage, aria state, form preservation');