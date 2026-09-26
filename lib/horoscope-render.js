const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'assets/horoscope.js'), 'utf8');
const program = new vm.Script(source.slice(0, source.indexOf("document.getElementById('mujorBadge')")) + `
this.readings = ORDER.map(key => ({key, sign:S[key], daily:buildDailyHTML(key,S[key],doy)}));
this.day = [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
this.dayLabel = now.toLocaleDateString('sq-AL',{day:'numeric',month:'long',year:'numeric'});
`);
const slugs = ['dashi','demi','binjaket','gaforrja','luani','virgjeresha','peshorja','akrepi','shigjetari','bricjapi','ujori','peshqit'];
function data(at = new Date()) {
  class Clock extends Date { constructor(...args){super(...(args.length ? args : [at.getTime()]));} }
  const context = vm.createContext({Date:Clock});
  program.runInContext(context, {timeout:1000});
  return {readings:context.readings,day:context.day,label:context.dayLabel};
}
function fill(html,id,content) {
  const pattern = new RegExp('(<([a-z0-9]+)[^>]*\\bid="'+id+'"[^>]*>)[\\s\\S]*?(<\\/\\2>)');
  return html.replace(pattern, (_,open,tag,close) => open + content + close);
}
function render(html, key, at = new Date()) {
  const current = data(at);
  if(key) {
    const item=current.readings.find(row=>row.key===key);
    if(!item) throw new Error('Unknown sign');
    const {sign,daily}=item;
    html=html.replace(/class="result-card(?: visible)?" id="ditorResult"/, 'class="result-card visible" id="ditorResult"');
    for(const [id,value] of Object.entries({ditorSym:sign.s,ditorName:sign.n,ditorDates:sign.d,ditorPlanet:'Planeti simbolik: '+sign.pl+' · Elementi: '+sign.el,ditorText:daily.html,ditorAdvice:daily.ad,ditorReadDate:`Leximi i datës <time datetime="${current.day}">${current.label}</time> · Ora e Shqipërisë`})) html=fill(html,id,value);
    for(const [i,id] of ['sLove','sWork','sHealth','sMoney'].entries()) html=fill(html,id,'★'.repeat(daily.r[i])+'☆'.repeat(5-daily.r[i]));
    html=fill(html,'ditorLucky',`<span class="lucky-tag">Numri simbolik: ${daily.ln}</span><span class="lucky-tag">Ngjyra: ${daily.lc}</span>`);
    html=fill(html,'ditorSecs','');
  } else {
    const summaries=current.readings.map((item,i)=>{
      const overview=item.daily.html.match(/<p>([\s\S]*?)<\/p>/)[1];
      return `<article class="daily-summary"><h3><a href="/horoskopi/${slugs[i]}/">${item.sign.n}</a></h3><p>${overview}</p><a href="/horoskopi/${slugs[i]}/">Lexo horoskopin e plotë →</a></article>`;
    }).join('\n');
    html=html.replace(/<!-- DAILY_OVERVIEW -->[\s\S]*?<!-- END_DAILY_OVERVIEW -->/, `<!-- DAILY_OVERVIEW --><section class="sign-profile" id="daily-overview"><h2>Horoskopi ditor shqip: ${current.label}</h2><p>Leximi për <time datetime="${current.day}">${current.label}</time>, sipas orës së Shqipërisë. Zgjidh një shenjë për dashurinë, punën dhe reflektimin e ditës.</p><div class="daily-summary-grid">${summaries}</div></section><!-- END_DAILY_OVERVIEW -->`);
  }
  return html;
}
module.exports={data,render,slugs};
