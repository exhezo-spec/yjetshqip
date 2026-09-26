// Run `node scripts/build-sign-pages.js` after changing the horoscope template/data.
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const write = (file, text) => { fs.mkdirSync(path.dirname(path.join(root,file)), {recursive:true}); fs.writeFileSync(path.join(root,file), text); };
const source = read('assets/horoscope.js');
const context = vm.createContext({});
vm.runInContext(source.slice(0, source.indexOf("document.getElementById('mujorBadge')")) + '\nthis.signData = S; this.order = ORDER;', context);
const {signData, order} = context;
const slugs = ['dashi','demi','binjaket','gaforrja','luani','virgjeresha','peshorja','akrepi','shigjetari','bricjapi','ujori','peshqit'];
const descriptions = [
 'Dashi lidhet tradicionalisht me iniciativën dhe guximin. Një pyetje e dobishme për reflektim: ku mund ta kthesh vrullin në një hap të vogël e të menduar mirë?',
 'Demi lidhet tradicionalisht me durimin dhe qëndrueshmërinë. Reflekto mbi rutinat që të japin qetësi dhe mbi një ndryshim të vogël që mund të të bëjë mirë.',
 'Binjakët lidhen tradicionalisht me kureshtjen dhe komunikimin. Një bisedë ku dëgjon po aq sa flet mund të të ndihmojë të shohësh një këndvështrim tjetër.',
 'Gaforrja lidhet tradicionalisht me përkujdesjen dhe ndjenjën e përkatësisë. Reflekto mbi mënyrën si kujdesesh për veten ndërsa u kushton kohë njerëzve të afërt.',
 'Luani lidhet tradicionalisht me krijimtarinë dhe vetëshprehjen. Mendo për një ide që do të doje ta ndaje dhe për mënyrën si mund t’u lësh hapësirë edhe të tjerëve.',
 'Virgjëresha lidhet tradicionalisht me vëmendjen ndaj detajeve dhe organizimin. Zgjidh një detyrë që mund ta thjeshtosh, pa kërkuar përsosmëri në çdo hap.',
 'Peshorja lidhet tradicionalisht me ekuilibrin dhe bashkëpunimin. Reflekto mbi një zgjedhje ku mund të respektosh nevojat e tua dhe të dëgjosh ato të të tjerëve.',
 'Akrepi lidhet tradicionalisht me thellësinë dhe këmbënguljen. Pyet veten se çfarë meriton vëmendjen tënde dhe çfarë mund ta lësh pas me qetësi.',
 'Shigjetari lidhet tradicionalisht me eksplorimin dhe të mësuarit. Një ide e re, një libër ose një bisedë mund të bëhen pikënisja e një interesi të ri.',
 'Bricjapi lidhet tradicionalisht me përgjegjësinë dhe planifikimin. Reflekto mbi një qëllim afatgjatë dhe zgjidh një hap realist, duke lënë vend edhe për pushim.',
 'Ujori lidhet tradicionalisht me pavarësinë dhe idetë e reja. Mendo si mund të provosh një qasje tjetër dhe ta shpjegosh qartë atë te njerëzit me të cilët bashkëpunon.',
 'Peshqit lidhen tradicionalisht me imagjinatën dhe ndjeshmërinë. Jepi hapësirë krijimtarisë dhe reflekto mbi kufijtë që të ndihmojnë të ruash qetësinë.'
];
const links = order.map((key,i) => `<a class="sign-choice" data-sign-link="${key}" data-sign-name="${signData[key].n}" href="/horoskopi/${slugs[i]}/"><span aria-hidden="true">${signData[key].s}</span>${signData[key].n}<small>${signData[key].d}</small></a>`).join('\n');
const picker = `<div class="sign-picker">${links}</div>\n<a class="return-sign" id="returnSign" hidden></a>`;
let home = read('index.html');
home = home.replace(/<!-- SIGN_PICKER -->[\s\S]*?<!-- END_SIGN_PICKER -->|<!-- SIGN_PICKER -->/, '<!-- SIGN_PICKER -->\n' + picker + '\n<!-- END_SIGN_PICKER -->');
write('index.html', home);
let template = read('horoskopi.html');
// A crawlable directory remains available even without JavaScript.
const directory = '<section class="sign-profile"><h2>Eksploro shenjat e zodiakut</h2><div class="sign-picker">' + links + '</div></section>';
template = template.replace(/<!-- SIGN_PROFILE -->[\s\S]*?<!-- END_SIGN_PROFILE -->|<!-- SIGN_PROFILE -->/, '<!-- SIGN_PROFILE -->' + directory + '<!-- END_SIGN_PROFILE -->');
write('horoskopi.html', template);
for (let i=0; i<order.length; i++) {
 const key=order[i], sign=signData[key], url='https://yjetshqip.site/horoskopi/'+slugs[i]+'/';
 const title=sign.n+' — Horoskopi Ditor, Mujor dhe Vjetor | Yjet Shqip';
 const description='Horoskopi për shenjën '+sign.n+': lexo rezultatin ditor, mujor dhe vjetor në shqip. Ruaj shenjën tënde dhe shpërndaje lidhjen.';
 let html=template.replace('<body>', '<body data-sign="'+key+'">')
  .replace(/<title>.*?<\/title>/, '<title>'+title+'</title>')
  .replace(/(<meta name="description" content=")[^"]*/, '$1'+description)
  .replace(/(<link rel="canonical" href=")[^"]*/, '$1'+url)
  .replace(/(<meta property="og:url" content=")[^"]*/, '$1'+url)
  .replace(/(<meta property="og:title" content=")[^"]*/, '$1'+title)
  .replace(/(<meta property="og:description" content=")[^"]*/, '$1'+description)
  .replace(/<h1>.*?<\/h1>/, '<h1>'+sign.s+' '+sign.n+' — Horoskopi Shqip</h1>')
  .replace(/href="([a-z-]+\.html)/g, 'href="/$1');
 html=html.replace(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g, (whole, data) => {
   const schema=JSON.parse(data);
   if(schema['@type'] === 'Article') { schema.headline=title; schema.description=description; schema.url=url; delete schema.dateModified; }
   return '<script type="application/ld+json">'+JSON.stringify(schema,null,2)+'</script>';
 });
 const profile=`<section class="sign-profile"><h2>Rreth shenjës ${sign.n}</h2><p>${descriptions[i]}</p><p><strong>Datat tradicionale:</strong> ${sign.d}<br><strong>Elementi:</strong> ${sign.el}<br><strong>Planeti simbolik:</strong> ${sign.pl}</p><p>Këto përshkrime i përkasin traditës astrologjike dhe nuk përcaktojnë personalitetin e çdo njeriu. Datat janë orientuese për kufijtë mes shenjave.</p></section>`;
 html=html.replace(/<!-- SIGN_PROFILE -->[\s\S]*?<!-- END_SIGN_PROFILE -->/, '<!-- SIGN_PROFILE -->'+profile+directory+'<!-- END_SIGN_PROFILE -->');
 write('horoskopi/'+slugs[i]+'/index.html', html);
}
const pages=['','horoskopi.html','emra.html','mjete.html','cv.html','prompt.html','creator-tools.html','about.html','contact.html','privacy.html',...slugs.map(slug=>'horoskopi/'+slug+'/')];
write('sitemap.xml','<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+pages.map(page=>'  <url><loc>https://yjetshqip.site/'+page+'</loc></url>').join('\n')+'\n</urlset>\n');
console.log('Built 12 sign pages, homepage picker, directory and sitemap.');
