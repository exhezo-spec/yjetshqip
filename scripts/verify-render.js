const assert=require('node:assert/strict');
const fs=require('node:fs');
const {render,data,slugs}=require('../lib/horoscope-render');
const handler=require('../api/horoscope');
const at=new Date('2026-09-27T12:00:00Z');
const current=data(at);
assert.equal(current.day,'2026-09-27');
assert.equal(data(new Date('2026-09-26T21:59:59Z')).day,'2026-09-26');
assert.equal(data(new Date('2026-09-26T22:00:00Z')).day,'2026-09-27');
assert.equal(data(new Date('2026-10-25T00:30:00Z')).day,'2026-10-25');
assert.equal(data(new Date('2026-10-25T01:30:00Z')).day,'2026-10-25');
assert.equal(data(new Date('2026-12-31T23:00:00Z')).day,'2027-01-01');
const texts=new Set();
for(const [i,slug] of slugs.entries()) {
 const original=fs.readFileSync(`horoskopi/${slug}/index.html`,'utf8');
 const key=current.readings[i].key;
 const html=render(original,key,at);
 assert(html.includes('class="result-card visible" id="ditorResult"'),slug+' needs visible daily content');
 assert(html.includes(current.readings[i].daily.html),slug+' missing real daily text');
 assert(html.includes('datetime="2026-09-27"'));
 assert(!html.includes('id="daily-overview"'));
 assert.equal(render(html,key,at),html,'Rendering must be repeatable');
 const tomorrow=render(html,key,new Date('2026-09-28T12:00:00Z'));
 assert(tomorrow.includes('datetime="2026-09-28"'));
 assert(!tomorrow.includes(current.readings[i].daily.html),'Daily text should change');
 const guide=html.match(/<article class="sign-profile sign-guide"[\s\S]*?<\/article>/)[0];
 assert.equal((guide.match(/<h3>/g)||[]).length,4,slug+' missing guide sections');
 texts.add(guide);
 for(const match of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
  const schema=JSON.parse(match[1]);
  if(schema['@type']==='WebPage') assert.equal(schema.url,`https://yjetshqip.site/horoskopi/${slug}/`);
 }
}
assert.equal(texts.size,12);
const hub=render(fs.readFileSync('horoskopi.html','utf8'),null,at);
assert.equal((hub.match(/class="daily-summary"/g)||[]).length,12);
assert.equal(render(hub,null,at),hub);
assert(hub.includes('id="datat-e-shenjave"'));
function request(slug,method='GET') {
 const response={headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},send(body){this.body=body;return this;}};
 handler({method,query:{slug}},response);return response;
}
for(const slug of ['index',...slugs]) {
 const response=request(slug);
 assert.equal(response.code,200);
 assert.equal(response.headers['X-Horoscope-Rendered'],'server');
 assert(response.body.includes('datetime="'+data().day+'"'));
 assert.equal(request(slug).body,response.body,'Cache changed content');
}
assert.equal(request('../privacy.html').code,404);
assert.equal(request(['dashi','demi']).code,404);
assert.equal(request('dashi','POST').code,405);
assert.equal(request('dashi','HEAD').body,'');
console.log('PASS: 12 unique guides, dated server HTML, 13 endpoints, midnight/DST/year boundaries, repeated rendering, cache, 404/405/HEAD.');
