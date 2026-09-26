const fs = require('node:fs');
const path = require('node:path');
const {render,slugs} = require('../lib/horoscope-render');
const root = path.resolve(__dirname,'..');
const cache = new Map();
module.exports = function handler(req,res) {
  if(req.method !== 'GET' && req.method !== 'HEAD') {res.setHeader('Allow','GET, HEAD');return res.status(405).send('Method not allowed');}
  const slug = req.query.slug;
  if(typeof slug !== 'string' || (slug !== 'index' && !slugs.includes(slug))) return res.status(404).send('Faqja nuk u gjet.');
  const index=slugs.indexOf(slug);
  const key=index<0?null:['dash','dem','bin','gaf','luan','vir','pel','akr','she','bri','uju','pesh'][index];
  const at=new Date();
  const day=new Intl.DateTimeFormat('en-CA',{timeZone:'Europe/Tirane',year:'numeric',month:'2-digit',day:'2-digit'}).format(at);
  let entry=cache.get(slug);
  if(!entry || entry.day!==day) {
    const file=slug==='index'?'horoskopi.html':`horoskopi/${slug}/index.html`;
    entry={day,html:render(fs.readFileSync(path.join(root,file),'utf8'),key,at)};
    cache.set(slug,entry);
  }
  res.setHeader('Content-Type','text/html; charset=utf-8');
  res.setHeader('Cache-Control','public, max-age=0, must-revalidate');
  res.setHeader('Vercel-CDN-Cache-Control','max-age=60');
  res.setHeader('X-Horoscope-Rendered','server');
  return res.status(200).send(req.method==='HEAD'?'':entry.html);
};
