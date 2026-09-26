const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root,file),'utf8');
const files = fs.readdirSync(root).filter(f=>f.endsWith('.html'));
for(const dir of fs.readdirSync(path.join(root,'horoskopi'))) files.push('horoskopi/'+dir+'/index.html');
let scripts = 0;
for(const file of files) {
 const html = read(file);
 assert(!/^<<<<<<<|^>>>>>>>/m.test(html), file+' has merge conflicts');
 for(const match of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)) {
   if(match[1].includes('application/ld+json')) JSON.parse(match[2]);
   else if(match[2].trim()) { new vm.Script(match[2],{filename:file}); scripts++; }
 }
 const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
 assert.equal(new Set(ids).size,ids.length,file+' has duplicate IDs');
 for(const match of html.matchAll(/(?:href|src)="([^"#?]+)(?:[?#][^"]*)?"/g)) {
   const target=match[1];
   if(/^(?:https?:|mailto:|data:|tel:)/.test(target)||target.startsWith('/_vercel/')) continue;
   let local=target.startsWith('/') ? path.join(root,target.slice(1)) : path.resolve(root,path.dirname(file),target);
   assert(fs.existsSync(local),file+' has missing target '+target);
 }
}
for(const file of fs.readdirSync(path.join(root,'assets')).filter(f=>f.endsWith('.js'))) {new vm.Script(read('assets/'+file),{filename:file});scripts++;}
assert(!read('index.html').includes('ca-pub-XXXXXXXXXXXXXXXX'));
assert.equal((read('index.html').match(/data-sign-link=/g)||[]).length,12);
assert.equal((read('sitemap.xml').match(/<loc>/g)||[]).length,22);

// Execute the real horoscope scripts with a minimal DOM; no browser or network needed.
class Element {
 constructor(){this.dataset={};this.children=new Map();this.attrs={};this.handlers={};this.textContent='';this.innerHTML='';this.classList={add(){},remove(){}};}
 setAttribute(k,v){this.attrs[k]=v;}
 querySelector(s){if(!this.children.has(s))this.children.set(s,new Element());return this.children.get(s);}
 addEventListener(k,fn){this.handlers[k]=fn;}
 scrollIntoView(){}
 appendChild(){}
 focus(){}
 select(){}
}
function horoscope({saved=null,search='',pageSign='',blocked=false}={}) {
 const elements=new Map(); const byId=id=>{if(!elements.has(id))elements.set(id,new Element());return elements.get(id);};
 const tabs=[new Element(),new Element(),new Element()];
 const document={body:{dataset:{sign:pageSign}},getElementById:byId,createElement:()=>new Element(),
 querySelector:selector=>byId(selector),querySelectorAll:selector=>selector==='#subnav button'?tabs:[]};
 const values=new Map(saved?[['ys_sign',saved]]:[]);
 let copied,assigned;
 const location={origin:'https://yjetshqip.site',href:'https://yjetshqip.site/horoskopi.html'+search,search,assign:href=>{assigned=href;}};
 const ctx=vm.createContext({document,location,URL,URLSearchParams,matchMedia:()=>({matches:false}),
 history:{replaceState:(_,__,url)=>{location.href=String(url);}},window:{addEventListener(){}},
 navigator:{clipboard:{writeText:async text=>{copied=text;}}},
 localStorage:{getItem:k=>{if(blocked)throw Error();return values.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error();values.set(k,v);},removeItem:k=>values.delete(k)}});
 vm.runInContext(read('assets/horoscope.js'),ctx);
 vm.runInContext(read('assets/horoscope-actions.js'),ctx);
 return {ctx,byId,values,tabs,get copied(){return copied;},get assigned(){return assigned;}};
}
async function main(){
 const h=horoscope();
 for(const key of ['dash','dem','bin','gaf','luan','vir','pel','akr','she','bri','uju','pesh']) {
  for(const period of ['ditor','mujor','vjetor']) {
   vm.runInContext(`showHoroImpl('${key}','${period}',document.getElementById('test-button'))`,h.ctx);
   assert(h.byId(period+'Text').innerHTML.length>100,key+' '+period+' missing result');
   const a=h.byId(period+'Actions');
   assert(a.querySelector('[data-whatsapp]').href.startsWith('https://wa.me/?text='));
   await a.querySelector('[data-copy]').onclick();
   assert(h.copied.includes('/horoskopi/'));
  }
 }
 const a=h.byId('ditorActions');
 a.querySelector('[data-remember]').onclick();assert.equal(h.values.get('ys_sign'),'pesh');
 a.querySelector('[data-remember]').onclick();assert.equal(h.values.has('ys_sign'),false);
 const saved=horoscope({saved:'dem'});assert.equal(saved.byId('ditorName').textContent,'Demi');
 const explicit=horoscope({saved:'dem',search:'?sign=dash&period=mujor'});assert.equal(explicit.byId('mujorName').textContent,'Dashi');
 const page=horoscope({saved:'dem',search:'?sign=dem',pageSign:'dash'});assert.equal(page.byId('ditorName').textContent,'Dashi');
 vm.runInContext("showHoroImpl('dem','ditor',document.getElementById('test'))",page.ctx);assert.equal(page.assigned,'https://yjetshqip.site/horoskopi/demi/');
 horoscope({saved:'<script>',search:'?sign=__proto__&period=bad'});
 const blocked=horoscope({blocked:true,search:'?sign=dash'});blocked.byId('ditorActions').querySelector('[data-remember]').onclick();
 assert(blocked.byId('ditorStatus').textContent.includes('nuk lejon'));
 // Test success and failure without transmitting a real contact message.
 for(const ok of [true,false]) {
  const form=new Element(), feedback=new Element(),success=new Element();form.action='https://formspree.io/f/meenolkj';
  const document={getElementById:id=>({contactForm:form,formFeedback:feedback,successMsg:success})[id]};
  let requests=0;
  const ctx=vm.createContext({document,AbortController,setTimeout,clearTimeout,FormData:class{},fetch:async()=>{requests++;return {ok};}});
  vm.runInContext(read('assets/contact.js'),ctx);
  await form.handlers.submit.call(form,{preventDefault(){}});
  assert.equal(requests,1);assert.equal(form.querySelector('[type="submit"]').disabled,false);
  if(ok)assert.equal(form.hidden,true);else assert(feedback.textContent.includes('nuk u konfirmua'));
 }
 console.log(`PASS: ${files.length} HTML pages, ${scripts} scripts, local links, metadata JSON, 36 horoscope results, saved/deep-linked signs, blocked storage, sharing, contact success/failure.`);
}
main().catch(error=>{console.error(error);process.exitCode=1;});
