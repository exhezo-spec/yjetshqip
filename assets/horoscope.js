
// ─── UTILS ───────────────────────────────────────────────
const MO = ['Janar','Shkurt','Mars','Prill','Maj','Qershor','Korrik','Gusht','Shtator','Tetor','Nëntor','Dhjetor'];
// One publishing day for readers and the server, regardless of their timezone.
const dayParts = Object.fromEntries(new Intl.DateTimeFormat('en', {timeZone:'Europe/Tirane',year:'numeric',month:'numeric',day:'numeric'}).formatToParts(new Date()).map(p => [p.type,p.value]));
const now = new Date(Number(dayParts.year), Number(dayParts.month)-1, Number(dayParts.day), 12);
const doy = Math.floor((Date.UTC(now.getFullYear(),now.getMonth(),now.getDate()) - Date.UTC(now.getFullYear(),0,0))/864e5);
const mon = now.getMonth();
const yr  = now.getFullYear();

function stars(n){let s='';for(let i=1;i<=5;i++) s+=i<=n?'★':'☆';return s;}

function showSection(id, btn) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('nav button').forEach(b => b.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  btn.classList.add('active');
}

// ─── SIGNS DATA ───────────────────────────────────────────────────────────────
const S = {
  dash:{n:'Dashi',s:'♈',d:'21 Mar – 19 Apr',el:'Zjarri 🔥',pl:'Marsi ♂',ln:9,ld:'E martë',lc:'E kuqe',
    daily:[
      {r:[4,4,5,3],t:'Marsi, planeti juaj sundues, është sot në pozicion të fuqishëm dhe ju dhuron energji të jashtëzakonshme. Ndjeheni të gatshëm të përballoni çdo sfidë dhe yjet ju inkurajojnë ta bëni pikërisht këtë. Në dashuri, hapini zemrën — gestet e sinqerta do të vlerësohen. Profesionalisht, ky është momenti ideal për të paraqitur idetë tuaja ose për të marrë iniciativën. Financiarisht, shmangni shpenzimet impulsive — mendoni afatgjatë.'},
      {r:[3,5,4,4],t:'Fuqia juaj profesionale sot është në kulm absolut. Idetë vijnë si rrebesh dhe kolegët do t\'ju dëgjojnë me respekt të shtuar. Paraqisni propozimin që keni mbajtur në sirtar — koha është e duhur. Megjithatë, mos i neglizhoni marrëdhëniet personale. Financiarisht, një vendim i mençur sot mund të japë fryte brenda muajit.'},
      {r:[5,3,4,3],t:'Yjet sot e vendosin dashurinë në qendër të universit tuaj. Nëse jeni beqarë, universi po përgatit një takim të paharrueshëm — jini të hapur. Nëse jeni në çift, një gjest i thjeshtë dashurie sot do të forcojë lidhjen tuaj si asnjëherë. Profesionalisht jeni pak të shpërqendruar — fokusohuni te detyrat e domosdoshme. Shmangni vendimet e mëdha financiare.'},
    ],
    monthly:['Prill ju sjell Dashit një vrull të jashtëzakonshëm energjie. Jupiteri ndikon direkt sektorin tuaj të karrierës dhe mundësitë e reja po trokasin — mos i lini të ikin. Në dashuri, muaji favorizon komunikimin e hapur dhe vendosjen e kornizave të qarta në marrëdhënie. Financiarisht, është kohë e mirë për investime të matura dhe kursime. Shëndeti është i qëndrueshëm por kini kujdes me lodhjen fizike.','Gushti nxeh energjinë e Dashit me intensitet diellor. Projektet e nisura herët po japin fryte dhe njohja profesionale është e garantuar. Në dashuri, pasioni është në kulm — çiftet forcohen dhe beqarët tërhiqen fuqishëm nga dikush i veçantë. Bëni investime të mençura ky muaj — planetet financiare janë favorshëm. Shmangni konfliktet e panevojshme.','Dhjetori sjell reflektim të thellë për Dashin. Pas një viti intensiv, yjet ju ftojnë të bëni bilanc. Karriera kërkon planifikim për vitin e ardhshëm — viziononi dhe shkruajini qëllimet. Marrëdhëniet kanë nevojë për vëmendje dhe kohë cilësore. Financiarisht, kurseni për periudhën e ardhshme. Shëndeti kërkon pushim dhe aktivitet fizik të moderuar.'],
    yearly:'Viti 2026 shënon një kapitull të ri dhe transformues në jetën e Dashit. Jupiteri hap dyert e mundësive profesionale të mëdha — nëse keni ëndërruar të ndryshoni karrierë ose të nisni diçka të re, ky është viti. Marrëdhëniet do të kalojnë teste të rëndësishme: ato autentike dalin më të forta, ndërsa ato sipërfaqësore shpërbëhen natyrshëm. Mesi i vitit (Qershor–Gusht) sjell mundësi financiare konkrete. Shëndeti do të jetë i mirë nëse menaxhoni stresin dhe gjumit i kushtoni prioritet. <strong>Fjalë kyçe për 2026: Guxim, Transformim, Autenticitet.</strong>'},

  dem:{n:'Demi',s:'♉',d:'20 Apr – 20 Maj',el:'Toka 🌿',pl:'Venusi ♀',ln:6,ld:'E premte',lc:'E gjelbër',
    daily:[
      {r:[4,3,5,5],t:'Venusi, planeti juaj, ju dhuron sot një qetësi të brendshme të çmuar. Marrëdhëniet me njerëzit e dashur janë harmonike dhe ndiheni të sigurt. Financiarisht, ky është një nga ditët më të favorshme të muajit — analizoni mundësi investimi. Shëndeti është shkëlqyer. Profesionalisht, puna me ritmin tuaj të qëndrueshëm sjell rezultate.'},
      {r:[5,4,4,4],t:'Energjia sensuale e Venusit është sot e paprecedentë. Nëse jeni në çift, planifikoni diçka romantike — partneri do ta vlerësojë. Profesionalisht, qëndrueshmëria juaj tregon rezultate konkrete dhe eprorët e vënë re. Financiarisht, kursimi i mirëmenduar po sjell frytet e para. Mos u grindni sot — kokëfortësia juaj mund ta dëmtojë një marrëdhënie të çmuar.'},
      {r:[3,5,5,3],t:'Sot kreativiteti dhe përpikëria juaj në punë shkëlqejnë. Detajet që të tjerët i lënë anash, ju i kapni dhe kjo bën dallimin. Shëndeti kërkon aktivitet fizik — një shëtitje në natyrë do t\'ju rigjallërojë. Në dashuri, tregoni pak fleksibilitet — jo gjithçka duhet të jetë sipas planit tuaj. Financiarisht, shmangni shpenzimet për gjëra jo-thelbësore.'},
    ],
    monthly:['Prill sjell Demit një periudhë qetësie dhe produktiviteti. Venusi ndikon pozitivisht marrëdhëniet dhe atmosfera në shtëpi është harmonike. Karriera kërkon durim — rezultatet e punës intensive janë duke u pjekur dhe do të shfaqen shpejt. Financiarisht, ky muaj favorizon kursimin dhe planifikimin afatgjatë. Shëndeti është i mirë — kushtojini vëmendje ushqyerjes.','Gushti ngjall potencialin financiar të Demit. Planet janë të rreshtuar në favorin tuaj ekonomik — mundësi investimi konkrete do të paraqiten. Marrëdhëniet janë të ngrohta dhe dashuritë e vjetra mund të rinxehen. Profesionalisht, bashkëpunimet e reja sjellin rezultate. Shëndeti kërkon moderim — mos u teproni me ushqimet e pasura.','Dhjetori i Demit është plot reflektim dhe kënaqësi. Ju e vlerësoni qetësinë dhe yjet po ju e ofrojnë pikërisht këtë. Karriera mbyllet me nota pozitive — njohja juaj është e merituar. Financiarisht, bëni bilanc dhe planifikoni vitin e ardhshëm. Marrëdhëniet janë harmonike. Dedikojuni pushimit cilësor.'],
    yearly:'Viti 2026 sjell stabilitet dhe rritje graduale për Demin. Saturni ju mëson durimin dhe disiplinën — dhe rezultatet do t\'i shihni. Karriera ecën me ritme të vazhdueshme dhe mesi i vitit sjell një promovim ose projekt të rëndësishëm. Financiarisht, 2026 është vit ideal për investime në pronë ose kursime afatgjata. Marrëdhëniet dashurie thellohen — çiftet e ngurta forcohen. Shëndeti kërkon vëmendje ndaj regjimit të gjumit dhe ushqyerjes. <strong>Fjalë kyçe për 2026: Durim, Stabilitet, Begatia.</strong>'},

  bin:{n:'Binjakët',s:'♊',d:'21 Maj – 20 Qer',el:'Ajri 💨',pl:'Mërkuri ☿',ln:5,ld:'E mërkurë',lc:'E verdhë',
    daily:[
      {r:[4,5,4,3],t:'Mërkuri, planeti juaj, ndez mendjen tuaj sot me ide të shkëlqyera. Komunikimi është dhurata juaj dhe sot shndritë — prezantime, negociata, biseda të rëndësishme, çdo fjalë juaj godet. Profesionalisht jeni të pamposhtur. Në dashuri, inteligjenca juaj tërheq. Financiarisht, shmangni vendime të nxituara.'},
      {r:[3,4,5,4],t:'Natyra juaj e dyfishtë sot është avantazh — mund të trajtoni situata të ndryshme me efikasitet. Bashkëpunimet dhe partneritetet janë shumë të favorshme. Shëndeti kërkon pak qetësi — mendja juaj punon gjithmonë dhe ka nevojë për pushim. Financiarisht, rishikoni shpenzimet e fundit — ka vend për optimizim.'},
      {r:[5,3,4,4],t:'Dashuria sot është elektrifikuese për Binjakët. Një bisedë e thellë me partnerin ose një takim i papritur mund të ndryshojë perspektivën tuaj. Profesionalisht, ritmi i ngadaltë ju lodh — kërkoni stimulim intelektual. Financiarisht, rishikoni buxhetin — disciplina e sotme sjell liri të nesërme.'},
    ],
    monthly:['Prill aktivizon Binjakët në mënyrë të jashtëzakonshme. Mërkuri lëviz fuqishëm dhe komunikimi juaj është i pashoq. Mundësi profesionale vijnë nëpërmjet rrjetit tuaj social — mbani kontaktet aktive. Marrëdhëniet janë dinamike dhe interesuese. Financiarisht, shmangni shpenzime impulsive — frenojeni dorën.','Gushti nxit aventurën intelektuale të Binjakëve. Kurset, librat, udhëtimet — çdo stimulim i ri ju bën të lumtur dhe produktiv. Karriera njeh një ngritje — idetë tuaja origjinale vlerësohen. Në dashuri, komunikimi i hapur thyen mure. Financiarisht, qëndroni vigjilentë ndaj shpenzimeve të fshehura.','Dhjetori kërkon fokusin e Binjakëve. Me kaq shumë mendime dhe projekte, yjet ju sugjerojnë të zgjidhni dy-tre gjëra dhe t\'i bëni mirë. Karriera fiton nga specializimi. Marrëdhëniet kanë nevojë për prani fizike, jo vetëm mesazhe. Financiarisht, mbylleni vitin me bilanc pozitiv.'],
    yearly:'Viti 2026 është vit ekspansioni intelektual dhe social për Binjakët. Mërkuri ju çon drejt mundësive të komunikimit, medias, shkrimit ose arsimit — fushat ku ju shkëlqeni. Karriera merr hov të ri nga partneritete të papritura. Marrëdhëniet dashurie thellohen kur Binjakët mësojnë të qëndrojnë, jo vetëm të fluturojnë. Financiarisht, gjysma e dytë e vitit sjell rritje të të ardhurave. Mos shpërdoroni energjinë tuaj mbi shumë drejtime njëherësh. <strong>Fjalë kyçe për 2026: Fokus, Komunikim, Thellësi.</strong>'},

  gaf:{n:'Gaforrja',s:'♋',d:'21 Qer – 22 Kor',el:'Uji 🌊',pl:'Hëna ☽',ln:2,ld:'E hënë',lc:'Argjend',
    daily:[
      {r:[5,3,5,4],t:'Hëna, planeti juaj sundues, ju dhuron sot intuitë të jashtëzakonshme. Ndiheni çdo gjë më thellë se zakonisht — ky është superpower-i juaj. Dashuria është e ngrohtë dhe lidhjet familjare forcohen. Profesionalisht, emocionet mund të ndikojnë vendimet — tentoni të balanconi zemrën me mendjen. Financiarisht, intuitës tuaj mund t\'i besoni.'},
      {r:[4,5,4,3],t:'Karriera sot është fokus kryesor. Empatiia dhe kujdesi juaj ndaj ekipit ju bëjnë lider të dashur dhe efektiv. Mundësi profesionale vijnë nga njerëz që ju njohin mirë. Në dashuri, kini kujdes të mos jeni shumë të mbyllur — hapjuni. Financiarisht, shmangni shpenzime emocionale.'},
      {r:[4,4,3,5],t:'Financat janë sot nën reflektorin e planeteve. Mundësi të reja të ardhurash ose investimi tërhiqin vëmendjen tuaj — analizojini me kujdes. Shëndeti kërkon vëmendje — stresi emocional i pa-shprehur ndikon trupin. Dilni me miqtë, qeshni, çlodhuni. Marrëdhëniet janë të mira kur komunikoni hapur.'},
    ],
    monthly:['Prilli i Gaforrjes është plot ndjesi dhe kreativitet. Hëna e re sjell mundësi të freskëta në jetën profesionale dhe personale. Marrëdhëniet familjare janë harmonike dhe ndiheni të mbrojtur e të dashur. Karriera kërkon vendosmëri — shmangni hezitimin. Financiarisht, bëni kursime inteligjente.','Gushti ndriçon jetën e brendshme të Gaforrjes. Proceset kreative dhe artistike janë shumë produktive. Dashuritë thellohen — nëse keni hezituar të shprehni ndjenjat, ky muaj e kërkon. Profesionalisht, projektet e nisura juve muaj arrijnë pikun. Kini kujdes me shëndetin — pushoni mjaftueshëm.','Dhjetori sjell ngrohësinë e shtëpisë dhe familjes si prioritet për Gaforrjen. Festimet dhe momentet e ndarë me të dashurit ju mbushur me energji. Karriera ka nevojë për planifikim të vitit të ardhshëm. Financiarisht, buxhetoni me kujdes shpenzimet festive. Shëndeti kërkon ngrohje dhe pushim.'],
    yearly:'Viti 2026 është vit i thellimit dhe sigurisë emocionale për Gaforrjen. Neptuni forcon intuitën tuaj natyrore — besoni instikteve dhe do t\'i shmangni grackat. Karriera favorizon pozicione ku kujdesi dhe empatia janë vlera — mjekësi, edukim, psikologji, art. Marrëdhëniet dashurie marrin seriozitet të ri: disa çifte vendosin të ndërtojnë familje. Financiarisht, investimet në shtëpi dhe prona janë shumë të favorshme gjatë 2026. <strong>Fjalë kyçe për 2026: Siguri, Thellësi, Shtëpie.</strong>'},

  luan:{n:'Luani',s:'♌',d:'23 Kor – 22 Gus',el:'Zjarri 🔥',pl:'Dielli ☀',ln:1,ld:'E diel',lc:'Ari',
    daily:[
      {r:[5,5,4,4],t:'Dielli, planeti juaj sundues, ndriçon sot çdo gjë që prekni. Jeni qendra e vëmendjes — dhe e meritoni plotësisht. Profesionalisht, idetë tuaja ndezin entuziazmin e ekipit. Njohja që keni pritur po vjen. Në dashuri, magnetizmi juaj është i papërmbajtshëm. Financiarisht, mundësi të mira janë duke u lajmëruar.'},
      {r:[4,5,5,3],t:'Kreativiteti juaj sot është në pik të pashembullt. Nëse punoni në art, muzikë, dizajn ose shkrim — produktet tuaja sot do të jenë të jashtëzakonshme. Shëndeti është i shkëlqyer — trupi juaj buzon me energji. Financiarisht, kini kujdes të mos shpenzoni për imazh kur ekziston nevojë për kursim.'},
      {r:[5,4,4,5],t:'Romantizmi i Luanit sot gjen shprehje perfekte. Bëni surpriza të mëdha — ju i doni dhe të tjerët i presin. Çiftet forcohen nëpërmjet aventurës dhe lojës. Financiarisht, Dielli favorizon të ardhura shtesë sot. Profesionalisht, prezantohuni me besim — vendimet po merren nga lart dhe ju jeni kandidat i duhur.'},
    ],
    monthly:['Prilli i Luanit është plot kreativitet dhe njohje. Dielli në pozicion të favorshëm ju jep dritë jeshile për të ndjekur ambiciet. Projektet artistike dhe komunikuese shkëlqejnë. Marrëdhëniet janë romantike dhe të nxehta. Financiarisht, rishikoni shpenzimet e imazhit — gjeni balancin.','Gushti është muaji juaj — Luani ndriçon kur Dielli është në shtëpinë e tij! Energjia, pasioni, suksesi — të gjitha janë në kulm. Karriera njeh arritje historike. Dashuria është e papërmbajtshme. Bëni shënime — ky muaj ju jep mundësi jetëgjatë.','Dhjetori kërkon modesti nga Luani — diçka që nuk ju vjen lehtë. Por yjet ju mësojnë se edhe reharia e brendshme ka vlerë. Karriera planifikon hapin e ardhshëm. Dashuritë janë të ngrohta. Financiarisht, buxhetoni festat me elegancë.'],
    yearly:'Viti 2026 ndriçon Luanin me madhështi të zakonshme. Jupiteri ndikon karrierën tuaj drejtpërdrejt dhe mundësi të mëdha po vijnë — duhet vetëm të zgjidhni cilin derë të hapni. Marrëdhëniet dashurie janë mes ciklit të ri: romanca e re ose thellim i asaj ekzistueses. Financiarisht, të ardhurat rriten nëse investoni në talentin tuaj personal. Shëndeti kërkon aktivitet fizik dhe menaxhim të energjisë. <strong>Fjalë kyçe për 2026: Madhështi, Njohje, Bujari.</strong>'},

  vir:{n:'Virgjëresha',s:'♍',d:'23 Gus – 22 Sht',el:'Toka 🌿',pl:'Mërkuri ☿',ln:5,ld:'E mërkurë',lc:'Kafe',
    daily:[
      {r:[3,5,5,4],t:'Aftësia juaj analitike sot arrin kulmin. Probleme komplekse që i kanë mbetur të tjerëve pa zgjidhje — ju i shihni me rrugëdalje të qarta. Profesionalisht jeni i pamposhtur dhe kolegët vijnë te ju për këshilla. Shëndeti kërkon vëmendje ndaj detajeve: ushqim, ujë, gjumë. Financiarisht, rishikoni kontratën ose marrëveshjet ekzistuese.'},
      {r:[4,4,5,3],t:'Shëndeti është prioriteti i yjetëve për ju sot. Trupi juaj ju dërgon sinjale — dëgjojini. Çdo rutinë shëndetësore që nisni sot do të ketë rezultate të jashtëzakonshme. Profesionalisht, detajet janë çelësi i suksesit tuaj. Financiarisht, kini kujdes me shpenzime të fshehura — kontrolloni llogaritë.'},
      {r:[5,3,4,5],t:'Dashuria sot ju surprizon në mënyrë të papritur, Virgjëreshë. Dikush që nuk e kishit vënë re po tregon interes të sinqertë. Hapjuni! Profesionalisht, shmangni perfeksionizmin e tepërt sot — "mjaftueshëm i mirë" është vërtet i mirë. Financiarisht, mundësi të reja të ardhurash tërhiqin vëmendjen.'},
    ],
    monthly:['Prilli i Virgjëreshës kërkon organizim dhe plan. Mërkuri ndikon komunikimin tuaj dhe keni aftësinë të zgjidhni keqkuptimet e vjetra. Karriera kërkon vëmendje ndaj detajeve — mos lini asgjë rastësisht. Marrëdhëniet fitojnë nga komunikimi i sinqertë. Financiarisht, auditoni shpenzimet mujore.','Gushti nxjerr më të mirën nga Virgjëresha. Produktiviteti është i lartë, analiza e saktë dhe rezultatet janë të dukshme. Karriera njeh suksese konkrete. Shëndeti kërkon vakancë — trupi dhe mendja kanë nevojë për pushim. Marrëdhëniet fitojnë nga cilësia e kohës, jo sasia.','Dhjetori sjell reflektim dhe vlerësim për Virgjëreshën. Sa keni arritur gjatë vitit? Shumë — edhe nëse nuk e pranoj me zë të lartë. Karriera planifikon synimet e vitit të ri me precizion. Financiarisht, mbyllni vitin me bilanc pozitiv. Marrëdhëniet kanë nevojë për ngrohësi.'],
    yearly:'Viti 2026 është vit i arritjeve profesionale konkrete për Virgjëreshën. Saturni shpërblen disiplinën — dhe ju keni disiplinë mbi të gjithë. Karriera njeh njohje dhe promovim të merituar. Marrëdhëniet dashurie kërkojnë që Virgjëresha të lëshojë kontrollin dhe t\'i besojë partnerit. Financiarisht, investimet e menduara sjellin kthime solide. Shëndeti — zona juaj e fokusit — do të jetë i mirë nëse mos obsesionoheni. <strong>Fjalë kyçe për 2026: Arritje, Besim, Precizion.</strong>'},

  pel:{n:'Peshorja',s:'♎',d:'23 Sht – 22 Tet',el:'Ajri 💨',pl:'Venusi ♀',ln:6,ld:'E premte',lc:'Rozë',
    daily:[
      {r:[5,4,4,4],t:'Venusi, planeti juaj sundues, sjell harmoni dhe bukuri sot. Të gjithë ndiejnë prezencën tuaj pozitive dhe tërhiqen nga energjia juaj ekuilibruese. Në dashuri, ky është një nga ditët më romantike të muajit. Profesionalisht, talentet tuaja diplomatike zgjidhin konflikte komplekse. Financiarisht, balansi është çelësi.'},
      {r:[4,5,4,3],t:'Karriera sot ju kërkon të merrni një vendim të rëndësishëm — dhe Peshorja nuk e do këtë! Por yjet konfirmojnë: jeni gati. Besojini analizës tuaj dhe veproni. Komunikimi është i shkëlqyer — prezantoni, negocioni, bindni. Në dashuri, shmangni indecizionin. Financiarisht, kontrolloni shpenzimet e shtëpisë.'},
      {r:[4,4,5,5],t:'Shëndeti dhe financat janë sot nën rrezet e planeteve favorshme. Vendosni rutinë shëndetësore dhe do t\'i ndjeni ndryshimet shpejt. Financiarisht, mundësi investimi prekin pragjet tuaja — analizoni dhe vendosni. Dashuritë janë harmonike. Profesionalisht, bashkëpunimet japin rezultate.'},
    ],
    monthly:['Prilli sjell ekuilibër dhe rifillim për Peshorjen. Venusi ju ndriçon marrëdhëniet dhe atmosfera është e ngrohtë. Karriera kërkon iniciativë — mos prisni mundësinë, krijoni atë. Financiarisht, balansi income/shpenzime është i favorshëm ky muaj. Shëndeti kërkon lëvizje.','Gushti aktivizon natyrën sociale të Peshorjes. Eventet, takimet, bashkëpunimet — të gjitha japin rezultate. Karriera njeh njohje publike. Dashuritë janë pasionante dhe komunikimi i lirë. Financiarisht, mundësi partnerships ose investime bashkëpunuese.','Dhjetori sjell kënaqësinë estetike të Peshorjes. Doni që gjithçka të jetë e bukur — dhe po e arrini. Karriera planifikon hapin e ardhshëm me elegancë. Dashuritë janë romantike. Financiarisht, shmangni shpenzimet festive të tepruara.'],
    yearly:'Viti 2026 sjell partneritime transformuese për Peshorjen — profesionale dhe personale. Jupiteri ndikon sektorin e marrëdhënieve dhe nëse keni pritur dikë special, viti 2026 mund të jetë ai vit. Karriera fiton nga aftësia juaj e bashkëpunimit — pozicione udhëheqëse apo menaxhuese janë të hapura. Financiarisht, partneritetet e biznesit janë shumë të favorshme. Kujdesuni të mos humbisni veten duke u kujdesur për të tjerët. <strong>Fjalë kyçe për 2026: Partneritet, Harmoni, Lulëzim.</strong>'},

  akr:{n:'Akrepi',s:'♏',d:'23 Tet – 21 Nën',el:'Uji 🌊',pl:'Plutoni ♇',ln:9,ld:'E martë',lc:'E kuqe e errët',
    daily:[
      {r:[4,5,3,5],t:'Plutoni ju dhuron sot forcë transformuese të paprecedentë. Situata që dukeshin të bllokuara do të lëvizin — por keni nevojë t\'i shtytni. Financiarisht, intuita juaj mbi investimet sot është e jashtëzakonshme — besojini. Profesionalisht, strategjia e fshehtë që keni planifikuar është gati për zbatim. Shëndeti kërkon kujdes — mos mbani shumë brenda.'},
      {r:[5,4,5,4],t:'Pasioni dhe intuita sot janë armatët e Akrepit. Marrëdhëniet thellohen në mënyrë dramatike — bisedat e sinqerta ndryshojnë gjithçka. Shëndeti është i fortë kur jeni të balancuar emocionalisht. Profesionalisht, hulumtimi dhe analiza e thellë ju japin avantazh konkurrues. Financiarisht, veprimet strategjike sjellin fitim.'},
      {r:[3,5,4,3],t:'Karriera kërkon gjithë vëmendjen tuaj sot. Projektet komplekse dhe analitike janë terreni juaj i preferuar — dhe rezultatet do të tregojnë se pse. Financiarisht, kini kujdes me partnerë të pabindur. Dashuritë kanë nevojë për transparencë — misteroziteti ndonjëherë largon njerëzit. Shëndeti kërkon relaksim.'},
    ],
    monthly:['Prilli nxit transformimin e thellë të Akrepit. Plutoni ndikon zona të fshehta të jetës suaj — situata të vjetra mbyllen dhe rrugë të reja hapen. Karierra favorizon hulumtimin dhe analizën. Financiarisht, investimet afatgjata janë shumë të favorshme. Dashuritë janë intensive dhe autentike.','Gushti intensifikon pasionin e Akrepit. Marrëdhëniet janë elektrike — ose thellohen dramatikisht ose mbyllen definitivisht. Karriera kërkon vendosmëri dhe guxim. Financiarisht, strategji të kujdesshme sjellin fitim. Shëndeti kërkon shprehje emocionale.','Dhjetori sjell fuqi introspektive të Akrepit. Kjo është koha e perfekte për meditim, vetë-analizë dhe vendosje qëllimesh të thella. Karriera bën bilanc. Dashuritë janë serioze dhe të thella. Financiarisht, planifikoni vitin e ardhshëm me strategji.'],
    yearly:'Viti 2026 është viti i transformimit të plotë për Akrepin. Plutoni — planeti juaj — krijon kushte për largimin e gjithçkaje që nuk ju shërben më dhe hapësirë për diçka shumë më të fuqishme. Karriera mund të ndryshojë drejtim, por në drejtimin e duhur. Marrëdhëniet dashurie kërkojnë autenticitet total — nuk ka hapësirë për maska. Financiarisht, viti sjell mundësi të fshehta: hetimet tuaja do të zbulojnë burime të reja. <strong>Fjalë kyçe për 2026: Transformim, Autenticitet, Fuqi.</strong>'},

  she:{n:'Shigjetari',s:'♐',d:'22 Nën – 21 Dhj',el:'Zjarri 🔥',pl:'Jupiteri ♃',ln:3,ld:'E enjte',lc:'Blu',
    daily:[
      {r:[4,4,5,5],t:'Jupiteri, planeti juaj sundues, hap dyert e mundësive të reja sot. Aventura intelektuale dhe fizike ju thërrësin — shkoni drejt saj. Financiarisht, mundësi fitimi nga burime të papritura janë shumë realiste. Shëndeti është i shkëlqyer — energjia juaj është ngjitëse. Profesionalisht, optimizmi juaj ndez entuziazmin e ekipit.'},
      {r:[5,4,4,3],t:'Dashuria sot aventuron Shigjetarin. Takime të reja, udhëtime, eksperienca të pashpjegueshme — ky është terreni juaj. Nëse jeni në çift, planifikoni diçka të re bashkë — rutina e vret shpirtin tuaj. Financiarisht, kini kujdes me excitimet e momentit. Profesionalisht, qëndroni të fokusuar në vizionin afatgjatë.'},
      {r:[4,5,3,4],t:'Filozofia dhe urtësia e Shigjetarit sot gjejnë shprehje. Njerëzit vijnë tek ju për këshilla — dhe keni pse. Karriera fiton nga perspektiva juaj e gjerë. Shëndeti kërkon pushim — keni bërë shumë. Financiarisht, llogaritni me kujdes para çdo veprimi të ri.'},
    ],
    monthly:['Prilli ndez aventurën e Shigjetarit. Jupiteri hap mundësi udhëtimi, arsimimi dhe zgjerimi. Karriera favorizon projektet internacionale. Dashuritë janë aventuroze dhe të lira. Financiarisht, mundësi investimi nga larg ose online janë pozitive.','Gushti çliron energjinë e Shigjetarit plotësisht. Kjo është koha juaj — udhëtoni, eksploroni, ndani. Karriera njeh arritje madhore. Dashuritë janë spontane dhe pasionante. Financiarisht, Jupiteri sjell bujari.','Dhjetori kërkon nga Shigjetari të ngadaltësohet — ndoshta nuk doni, por keni nevojë. Reflektoni mbi vitin. Karriera planifikon hapin tjetër të madh. Dashuritë fitojnë nga qetësia dhe ngrohësia. Financiarisht, buxhetoni festat dhe dhuratat.'],
    yearly:'Viti 2026 ndriçon Shigjetarin me mundësi zgjerimi global. Jupiteri është planeti juaj dhe ky vit ai është plotësisht aktiv — mundësi karriere, udhëtime, arsimim të avancuar, projektet ndërkombëtare, të gjitha janë të hapura. Marrëdhëniet dashurie janë plot aventurë dhe liri — por Shigjetari duhet të mësojë edhe të qëndrojë. Financiarisht, burime të reja të ardhurash shfaqen pas qershorit. <strong>Fjalë kyçe për 2026: Ekspansion, Liri, Mbëritje.</strong>'},

  bri:{n:'Bricjapi',s:'♑',d:'22 Dhj – 19 Jan',el:'Toka 🌿',pl:'Saturni ♄',ln:8,ld:'E shtunë',lc:'Kafe e errët',
    daily:[
      {r:[4,5,4,5],t:'Saturni, planeti juaj sundues, shpërblen sot disiplinën dhe punën tuaj të vazhdueshme. Njohja profesionale që keni pritur duket në horizont. Financiarisht, kjo është ndoshta dita më e mirë e muajit për vendime ekonomike. Shëndeti kërkon pushim të merituar. Dashuritë janë të qëndrueshme dhe të besueshme — ashtu si ju.'},
      {r:[3,5,5,4],t:'Disiplina juaj sot tejkalon të gjithë. Projektet që të tjerët i kanë braktisur, ju i sillni në fund. Kjo sot vihet re dhe vlerësohet. Shëndeti kërkon lëvizje fizike — hapni dritaren ose bëni një shëtitje. Marrëdhëniet fitojnë nga ngrohësia e vogël — jo gjithmonë keni nevojë për seriozitet.'},
      {r:[5,4,4,3],t:'Dashuria sot kapet Bricjapin nga ana e papritur — e buta dhe e ngrohtë. Lejojeni veten të tregoni sentimentin — partneri e pritet. Profesionalisht, ambicia juaj sot gjen kanalin e duhur. Financiarisht, kini kujdes me shpenzime të reja — analizoni mirë para se të veproni.'},
    ],
    monthly:['Prilli teston durimin e Bricjapit — por shpërblen ata që qëndrojnë. Saturni ndikon karrierën dhe vë nën presion — por kjo është mundësia juaj të shkëlqeni. Financiarisht, ky muaj kërkon disiplinë. Dashuritë janë serioze dhe të thella. Shëndeti kërkon aktivitet.','Gushti sjell njohje të merituar për Bricjapin. Puna e gjatë dhe e durueshme fillon të shoh rezultate konkrete. Karriera njeh ngritje. Dashuritë janë të qëndrueshme dhe siguruese. Financiarisht, investimet sjellin kthime pozitive.','Dhjetori është muaji juaj natal — Bricjapi feston dhe planifikon! Energjia është e lartë, qëllimet janë të qarta dhe viti i ardhshëm duket premtues. Financiarisht, bëni planin vjetor. Dashuritë janë ngrohëse.'],
    yearly:'Viti 2026 është ndoshta viti juaj më i rëndësishëm profesional i dekadës, Bricjap. Saturni, planeti juaj, ndodhet në pozicion shumë të favorshëm dhe shpërblen me kthim enorm gjithë punën e viteve të kaluara. Promovime, kontrata të mëdha, njohje publike — gjithçka është e mundur. Marrëdhëniet dashurie fitojnë nga e buta dhe spontaniteti — harroni seriozitetin ndonjëherë. Financiarisht, viti 2026 mund të jetë transformues nëse investoni inteligjentisht. <strong>Fjalë kyçe për 2026: Arritje, Njohje, Trashëgimi.</strong>'},

  uju:{n:'Ujori',s:'♒',d:'20 Jan – 18 Shk',el:'Ajri 💨',pl:'Uranusi ♅',ln:4,ld:'E shtunë',lc:'Blu elektrik',
    daily:[
      {r:[4,5,4,4],t:'Uranusi, planeti juaj, ndez sot inovacionin dhe originalitetin tuaj. Idetë revolucionare que keni mbajtur private janë gati të del — njerëzit janë gati t\'i dëgjojnë. Profesionalisht, teknologjia dhe inovacioni janë fushat tuaja. Marrëdhëniet fitojnë nga autenticiteti juaj unik. Financiarisht, mundësi deri digitale janë aktive.'},
      {r:[5,4,5,3],t:'Liria dhe autenticiteti juaj sot tërhiqin njerëz të jashtëzakonshëm. Rrjeti social zgjerohet me njerëz me mendje si e juaja. Shëndeti kërkon aktivitet të papritur — provoni diçka të re. Profesionalisht, idetë tuaja jo-konvencionale janë pikërisht çfarë kërkon ekipi. Financiarisht, kini kujdes me investimet shumë rrezikuese.'},
      {r:[4,4,3,5],t:'Financiarisht, Uranusi sjell mundësi të papritura sot — mund të jetë diçka dixhitale ose inovative. Shëndeti kërkon vëmendje ndaj gjumit. Karierra fiton nga perspektiva e gjerë dhe mentaliteti i hapur i Ujorit. Dashuritë janë jokonvencionale dhe ngjitëse. Ndjehuni të lirë të jeni vetvete.'},
    ],
    monthly:['Prilli aktivizon Ujorin intelektualisht. Uranusi ndikon mendjen dhe idetë tuaja janë në avangardë. Karriera favorizon teknologjinë dhe inovacionin. Bashkëpunimet me njerëz nga fusha të ndryshme japin rezultate të jashtëzakonshme. Dashuritë janë origjinale dhe të papritura.','Gushti çliron humanizmin e Ujorit. Kontributi shoqëror, aktivizmi, projektet komunitative — keni energji të jashtëzakonshme. Karriera fiton nga lidershipi i lirë. Dashuritë janë autentike dhe të lira. Financiarisht, projektet inovative japin kthime.','Dhjetori reflekton vizionin e Ujorit. Ku dëshironi të jeni vitin tjetër? Karriera planifikon me vizion të gjerë. Dashuritë kanë nevojë për komunikim të hapur. Financiarisht, investimet teknologjike janë premtuese.'],
    yearly:'Viti 2026 është vit historik për Ujorin. Jupiteri dhe Uranusi krijojnë një sinergji të jashtëzakonshme që hap mundësi revolucionare — teknologji, inovacion, media, aktivizëm. Karriera mund të ndryshojë plotësisht drejtim — dhe kjo nuk është gjë e keqe, është evolucion. Marrëdhëniet dashurie kërkojnë ndershmëri totale dhe liri reciproke. Financiarisht, investimet dixhitale dhe teknologjike janë shumë të favorshme. <strong>Fjalë kyçe për 2026: Revolucion, Autenticitet, E Ardhme.</strong>'},

  pesh:{n:'Peshqit',s:'♓',d:'19 Shk – 20 Mar',el:'Uji 🌊',pl:'Neptuni ♆',ln:7,ld:'E premte',lc:'Jeshile deti',
    daily:[
      {r:[5,3,5,4],t:'Neptuni, planeti juaj, zgjon sot intuitën tuaj në nivele të pashpjegueshme. Ndjeni gjëra para se të ndodhin — besojini këtij superpoweri. Dashuria është e thellë dhe poetike. Kreativiteti është në kulm — çdo projekt artistik i nisur sot do të jetë i mrekullueshëm. Profesionalisht, shmangni vendimet e mëdha — prisni qartësinë e nesërme.'},
      {r:[4,4,4,5],t:'Financiarisht, intuita e Peshqve sot është aseti kryesor. Mundësi të papritura ekonomike mund të vijnë nga burime jo-konvencionale — besojini instiktit. Kreativiteti ndihmon karrierën. Shëndeti kërkon hidratim dhe pushim. Marrëdhëniet janë të ngrohta dhe shpirtërore.'},
      {r:[5,5,3,4],t:'Karriera dhe dashuria bashkohen sot për Peshqit — mund të takoni dikë special në mjedisin profesional ose një projekt krijues të sjellë njohje. Shëndeti kërkon vëmendje ndaj energjisë emocionale — mbrojeni veten nga njerëzit negativë. Financiarisht, planifikoni me kujdes.'},
    ],
    monthly:['Prilli thellëson botën e brendshme të Peshqve. Neptuni ndikon krijimtarinë dhe shpirtërorësinë — ky muaj është i mrekullueshëm për art, meditim dhe qartësi shpirtërore. Karriera fiton nga intuita dhe empatiia. Dashuritë janë poetike dhe thellësuese. Financiarisht, shmangni shpenzimet emocionale.','Gushti aktivizon magjinë e Peshqve. Kreativiteti dhe shpirtërorësia arrijnë kulmin. Projekt artistik ose shpirtëror i nisur tani do të ketë ndikim të madh. Dashuritë janë cinematike. Karriera fiton nga empatia unike. Financiarisht, besoni intuitës.','Dhjetori fton Peshqit të mbyllin ciklin vjetor me mirënjohje. Çfarë keni mësuar? Kë keni dashur? Sa keni krijuar? Karriera planifikon me vizion poetik. Dashuritë janë ngrohëse dhe të thella. Shëndeti kërkon pushim dhe meditim.'],
    yearly:'Viti 2026 është vit i bashkimit të ëndrrave dhe realitetit për Peshqit. Neptuni forcon dhuratën tuaj natyrore dhe krijimtaria juaj do të gjejë audience. Karriera favorizon fushat artistike, shëndetësore dhe shpirtërore. Marrëdhëniet dashurie janë mes ciklit më të bukur — nëse keni hapur zemrën, dikush i jashtëzakonshëm do t\'i përgjigjet. Financiarisht, besojini intuitës tuaj ekonomike dhe shmangni njerëzit që duan të përfitojnë. <strong>Fjalë kyçe për 2026: Ëndrra, Krijim, Dashuri.</strong>'},
};

const ORDER = ['dash','dem','bin','gaf','luan','vir','pel','akr','she','bri','uju','pesh'];

// ─── SECTION PHRASES ─────────────────────────────────────────────────────────
const SEC_PHRASES = {
  love:   ['Dashuria kërkon sot vëmendje të shtuar.','Marrëdhëniet janë të qëndrueshme — kohë cilësore.','Energjia romantike është e mirë — hapini zemrën.','Dashuria shkëlqen — gestet e vogla lënë gjurmë.','Magnetizmi juaj romantik është i papërmbajtshëm!'],
  career: ['Karriera kërkon fokus — shmangni shpërqendrimin.','Puna ecën me ritëm të qëndrueshëm — jini durimtar.','Mundësi profesionale po shfaqen — jini gati.','Kolegët ju respektojnë — shfrytëzojeni avantazhin.','Karriera juaj sot është në kulm — veproni me guxim!'],
  health: ['Shëndeti kërkon kujdes — pushoni mjaftueshëm.','Trupi kërkon lëvizje — bëni një shëtitje.','Energjia fizike është e mirë — mbajeni ritmin.','Ndiheni mirë — vazhdoni rutinën shëndetësore.','Vitaliteti juaj sot është i shkëlqyer!'],
  finance:['Financat kërkojnë kujdes — shmangni impulset.','Buxheti nën kontroll — mbeteni vigjilentë.','Situata financiare e qëndrueshme — planifikoni.','Mundësi financiare po shfaqen — analizoni mirë.','Financat janë sot shumë të favorshme — veproni!']
};
const ADVICE_POOL = [
  'Besojini intuitës suaj sot — zemra shpesh e di përgjigjen para mendjes.',
  'Qëndroni të pranishëm — momentet e vogla janë ato që mbeten.',
  'Komunikoni hapur — fjalët e sinqerta ndërtojnë ura.',
  'Një veprim i vogël sot mund të ndryshojë rrjedhën e javës.',
  'Faleni veten dhe të tjerët — liria e vërtetë fillon me falje.',
  'Ndjekni energjinë e gëzimit — ajo ju çon drejt së vërtetës.',
  'Pushoni pak nga teknologjia — natyra dhe qetësia shërojnë.',
  'Shkruani tre gjëra për të cilat jeni mirënjohës sot.',
  'Mos krahasoni rrugën tuaj me të tjerëve — secili ka hapat e vet.',
  'Investoni në marrëdhëniet që ju ngritën — ato janë thesari juaj.'
];

// ─── DAILY SEED ───────────────────────────────────────────────────────────────
function dailySeed(si,d){return((si*173+d*59+si*d*7)^(d*13))>>>0;}
function seedPick(arr,s){return arr[s%arr.length];}

// ─── DAILY OVERVIEW — 6 variants per sign ────────────────────────────────────
const DAILY_OV={
  dash:[
    'Marsi të dhuron sot energji ndezëse dhe vullnet të çeliktë. Çdo sfidë para teje sot duket e mundur. Yjet inkurajojnë hapin që ke shtyrë — koha është tani.',
    'Dita ka karakter të veçantë energjik për Dashin. Impulset tuaja janë të sakta — besojini tyre dhe vepro me guxim. Mundësia e ditës shfaqet aty ku s\'e pret.',
    'Yjet e vendosin Dashin në pozicion fitues sot. Forca juaj natyrale tregon rezultate dhe të tjerët e vënë re. Komunikimi sjell zgjidhje — mos lini asgjë pa u thënë.',
    'Energjia planetare sot favorizon iniciativën dhe vendosmërinë. Projektet e papërfunduara gjejnë rrugëdalje dhe lidhjet e reja hapen natyrshëm. Besimi ndez entuziazmin.',
    'Dielli ndriçon rrugën e Dashit me qartësi dhe fuqi. Mundësi të reja po shfaqen dhe ndjesia e lëvizjes përpara është e fortë. Veproni me vendosmëri.',
    'Planetët anojnë favorshëm ndaj Dashit — dita është e mirë për fillime dhe guxim. Çdo gjë e bërë me entuziazëm sot do të ketë ndikim afatgjatë.',
  ],
  dem:[
    'Venusi ndriçon botën e Demit me harmoni dhe rehatë të brendshme. Marrëdhëniet janë të ngrohta dhe produktiviteti i qëndrueshëm. Dita favorizon çdo gjë praktike.',
    'Qetësia e Demit është sot aseti kryesor. Yjet konfirmojnë se puna e vazhdueshme po jep frytet e para. Besojini rrugës — mos u shpërqendroni.',
    'Energjia e Demit sot është e rrënjëzuar dhe e qëndrueshme. Situata financiare merr vëmendje të favorshme dhe marrëdhëniet janë harmonike.',
    'Venusi ju fton të gëzoheni me gjërat e thjeshta dhe të bukura. Kolegët dhe të dashurit ndiejnë praninë tuaj qetësuese. Dita e mirë për vendime afatgjata.',
    'Demi ndihet i qetë dhe produktiv — kombinim perfekt sot. Yjet favorizojnë planet praktike, financiare dhe familjare.',
    'Frytet e punës dhe besnikërisë ndaj vlerave janë të dukshme sot. Venusi sjell harmoni dhe çdo sipërmarrje ecën me ritëm të mirë.',
  ],
  bin:[
    'Mërkuri ndez mendjen e Binjakëve me ide të shkëlqyera dhe biseda ndriçuese. Komunikimi juaj sot është i papërmbajtshëm.',
    'Energjia intelektuale e Binjakëve sot është në kulm. Çdo fjalë ka peshë dhe të tjerët dëgjojnë. Bashkëpunimet e reja hapen natyrshëm.',
    'Planetët aktivizojnë anën më të mprehtë — analizën, kreativitetin dhe komunikimin. Dita favorizon takime dhe nisme të reja intelektuale.',
    'Vrull i jashtëzakonshëm për Binjakët sot. Idetë origjinale gjejnë veshë të gatshëm dhe mundësi profesionale vijnë nga lidhjet sociale.',
    'Mërkuri favorizon çdo formë komunikimi sot. Shprehuni lirshëm — idetë janë të vlefshme. Dita e mirë për negociata dhe marrëveshje.',
    'Natyra dinamike e Binjakëve sot bën dallimin. Çdo bisedë mund të çojë diku interesant. Jini kurioz dhe të hapur ndaj papriturës.',
  ],
  gaf:[
    'Hëna amplifikoën intuitën dhe ndjeshmërinë e Gaforrjes sot. Emocionet janë udhëzues i saktë — besojini tyre.',
    'Gaforrja ndihet e fortë dhe e qëndrueshme sot. Intuitës i vijnë sinjale të qarta — dëgjojini dhe veproni me besim.',
    'Planetët favorizojnë jetën e brendshme dhe krijuese. Kreativiteti është i lartë dhe lidhjet dashurie thellohen natyrshëm.',
    'Hëna sjell sot ndjeshmëri dhe përforcim intuitiv. Kini besim ndaj vetes — emocionet ju udhëzojnë drejt gjërave të duhura.',
    'Gaforrja sot ka aftësinë e rrallë të leximit të situatave me thellësi. Intuita është superiore — mos e kontrolloni shumë.',
    'Yjet i dhurojnë Gaforrjes qetësi dhe ëmbëlsi të brendshme sot. Marrëdhëniet me të dashurit janë burim force dhe gëzimi.',
  ],
  luan:[
    'Dielli ndriçon sot çdo gjë që preket nga Luani. Jeni qendra e vëmendjes — dhe e meritoni. Kreativiteti dhe njohja janë tema yjesore.',
    'Magnetizmi i Luanit është sot në nivel maksimal. Njerëzit tërhiqen nga prania juaj dhe mundësi të reja shfaqen. Veproni me guxim.',
    'Energjia kreative e Luanit sot gjen kanalin e duhur. Projektet me dimension publik janë shumë të favorshme. Besojini shprehjes natyrore.',
    'Dielli ndriçon rrugën dhe çdo hap i bërë me besim sjell rezultate. Karisma është armë e fuqishme dhe njerëzit e ndjejnë praninë tuaj.',
    'Luani gjen harmoninë mes pasionit dhe urtësisë sot. Vendimmarrja reflekton maturinë. Yjet konfirmojnë: njohja ka ardhur — pranojeni.',
    'Planetët i dhurojnë Luanit forcë të brendshme të jashtëzakonshme sot. Guximi dhe entuziazmi janë të papërmbajtshëm.',
  ],
  vir:[
    'Mërkuri sot e çon aftësinë analitike të Virgjëreshës në nivel superior. Problemet komplekse gjejnë zgjidhje elegante dhe puna e kujdesur sjell respekt.',
    'Yjet favorizojnë përpikmërinë dhe organizimin sot. Çdo detaj i kujdesur sot kursen probleme nesër. Eficienca juaj sot është e paprecedentë.',
    'Energjia e Virgjëreshës sot është praktike dhe produktive. Sektori profesional fiton nga preciziteti juaj karakteristik.',
    'Mërkuri aktivizon aftësinë komunikuese dhe analitike. Solucionet e ofruara sot do të mbahen në kujtesë. Puna me detaje sjell rezultate afatgjata.',
    'Virgjëresha shndrit sot me efikasitetin dhe besueshmërinë e zakonshme. Disiplina po jep frytet e merituar.',
    'Planetët i japin Virgjëreshës qartësi mendore dhe produktivitet. Projektet e komplikuara bëhen të menaxhueshme.',
  ],
  pel:[
    'Venusi sjell harmoni dhe bukuri në çdo aspekt të jetës së Peshorjes sot. Marrëdhëniet janë të ekuilibruar.',
    'Energjia balancuese e Peshorjes sot është pasuri reale. Çdo konflikt zgjidhet me taktin dhe elegancën natyrore.',
    'Venusi ndriçon Peshorjen me bukuri dhe ekuilibër. Vendimmarrja bëhet e duhur. Marrëdhëniet dashurie dhe profesionale janë shumë të favorshme.',
    'Peshorja gjen balancin e brendshëm sot. Çdo ndërveprim ka cilësi dhe elegancë natyrale.',
    'Planetët favorizojnë rolin harmonizues dhe diplomatik. Çdo situatë e vështirë transformohet nëpërmjet taktit tuaj.',
    'Energjia e Peshorjes sot ka elegancë dhe mprehtësi. Marrëdhëniet fitojnë nga komunikimi i sinqertë dhe i ekuilibruar.',
  ],
  akr:[
    'Plutoni aktivizon forcën transformuese dhe intuitive të Akrepit sot. Situatat e bllokuara lëvizin — besojini instiktit.',
    'Akrepi ndihet sot në terrenin e vet të preferuar — thellësi, analizë dhe strategji. Pasioni sjell rezultate konkrete.',
    'Plutoni amplifikohet sot dhe fuqia e brendshme është e jashtëzakonshme. Ndërveprimet e thella prodhojnë rezultate të rëndësishme.',
    'Energjia e Akrepit sot është magnetike dhe transformuese. Njerëzit ndiejnë prezencën tuaj të fuqishme. Dita favorizon strategjinë.',
    'Yjet i dhurojnë Akrepit perceptim të mprehtë dhe forcë veprimi. Situata komplekse bëhen të qarta dhe vendimmarrja e sigurt.',
    'Planetët favorizojnë intensitetin dhe thellësinë karakteristike. Transformimet pozitive janë aty ku besoni plotësisht.',
  ],
  she:[
    'Jupiteri hap horizonte të reja dhe mundësi të bollshme për Shigjetarin sot. Optimizmi juaj është ngjitës.',
    'Shigjetari ndihet i lirë dhe i frymëzuar sot. Aventura intelektuale dhe fizike ju thërret — ndiqni thirrjen.',
    'Jupiteri amplifikohet sot. Guximi karakteristik sjell rezultate dhe njerëzit ndiejnë entuziazmit tuaj.',
    'Energjia e Shigjetarit sot është ndezëse dhe aventuroze. Çdo hap i ri sjell frymëzim dhe çdo bisedë hap horizonte.',
    'Planetët i japin Shigjetarit vizion të qartë dhe energji zbatimi. Projektet ambicioze gjejnë hov.',
    'Yjet favorizojnë filozofinë dhe urtësinë natyrore. Perspektiva e gjerë e Shigjetarit zgjidh probleme të pathyeshëm.',
  ],
  bri:[
    'Saturni sot shpërblen disiplinën dhe punën e vazhdueshme të Bricjapit. Njohja profesionale është e merituar.',
    'Bricjapi ndihet i qëndrueshëm dhe i vendosur sot. Rruga juaj është e duhur dhe hapat me disiplinë japin frytet e para.',
    'Saturni amplifikohet sot. Fuqia organizuese e Bricjapit ndihet kudo dhe kolegët ju respektojnë.',
    'Energjia praktike dhe e fokusuese e Bricjapit sot prodhon rezultate. Çdo vendim financiar i llogaritur favorizohet.',
    'Planetët i dhurojnë Bricjapit qartësi dhe besim në aftësitë e veta. Karriera merr hov sot.',
    'Ambicia dhe disiplina e Bricjapit po japin frytet e merituar sot. Njohja dhe respekti janë në rrugën e tyre.',
  ],
  uju:[
    'Uranusi ndez inovacionin dhe originalitetin e Ujorit sot. Idetë revolucionare gjejnë vesh të gatshëm.',
    'Ujori ndihet i lirë dhe i frymëzuar sot. Yjet favorizojnë çdo gjë inovative dhe autentike.',
    'Uranusi amplifikohet sot. Potenciali inovativ i Ujorit është i papërmbajtshëm. Bashkëpunimet kreative japin rezultate.',
    'Energjia e Ujorit sot është e freskët dhe revolucionare. Idetë jo-konvencionale janë çfarë kërkohet.',
    'Planetët i japin Ujorit vizion dhe fuqi realizimi. Projektet inovative gjejnë mbështetje.',
    'Vizioni i Ujorit është dekada përpara kohës — por realizimi ndodh sot. Besojini instikteve inovative.',
  ],
  pesh:[
    'Neptuni zgjon intuitën dhe kreativitetin e Peshqve sot në nivele të pashpjegueshme. Çdo projekt artistik ka ndikim të thellë.',
    'Peshqit ndiejnë lidhje të thellë me botën dhe njerëzit sot. Intuita është superiore dhe kreativiteti gjen shprehje.',
    'Neptuni amplifikohet sot. Dhurata artistike dhe empatike është e jashtëzakonshme. Marrëdhëniet thellohen papritur.',
    'Energjia e Peshqve sot është poetike dhe ndriçuese. Ëndrrat dhe intuita janë burime informacioni. Yjet favorizojnë shprehjen.',
    'Planetët i dhurojnë Peshqve ndjeshmëri dhe kreativitet të lartë. Projektet artistike janë shumë të favorshme.',
    'Bujarisë dhe empatisë suaj u kthehet me interes sot. Dashuritë janë autentike dhe kreativiteti gjen rrugë shprehjeje.',
  ],
};
const DAILY_LOVE=[
  'Yjet favorizojnë bashkimet e reja dhe thellimin e atyre ekzistuese. Hapini zemrën — dashuria nuk ka afat.',
  'Romantizmi ka ngrohtësi të veçantë sot. Nëse jeni beqar, takim i papritur mund të ndryshojë perspektivën. Çiftet forcohen nëpërmjet komunikimit.',
  'Dashuria sot kërkon prezencë dhe vëmendje. Surprizat e vogla lënë gjurmë të mëdha. Partneri/ja ka nevojë t\'u ndjejë të pranishëm.',
  'Energjia romantike është e lartë dhe magnetike. Nëse mendoni për dikë, koha e veprimit është sot. Çiftet gëzojnë momente cilësore.',
  'Bisedat e sinqerta dhe të hapura zgjidhin tensione të akumuluara. Lajeni ndjenjat t\'u shprehën — shprehja emocionale forcon lidhjet.',
  'Autenticiteti tërhek autenticitet sot. Shprehni ndjenjat pa hezitim — marrëdhëniet genuinë janë dhuratë e çmuar.',
];
const DAILY_CAREER=[
  'Iniciativa dhe vendosmëria juaj do të vërehet sot. Mos lejoni mundësinë të kalojë pa vepruar.',
  'Çdo ide e shprehur me besim tërheq mbështetje sot. Kolegët janë receptiv — prezantohuni me autoritet dhe qartësi.',
  'Mundësi profesionale shfaqen atje ku nuk i prisnit. Mbani rrjetin social aktiv — bashkëpunimet e reja transformojnë.',
  'Kreativiteti dhe inovacioni favorizohen sot. Idetë jo-konvencionale janë çfarë kërkohet — guxoni të propozoni.',
  'Produktiviteti juaj sot është i lartë dhe i dukshëm. Ky është momenti për të kërkuar atë që meritoni.',
  'Karriera sot kërkon strategji dhe qëllim të qartë. Çdo hap i bërë me vetëdije ka ndikim afatgjatë.',
];
const DAILY_FINANCE=[
  'Mundësi të reja të ardhurash mund të shfaqen — analizoni me kujdes. Vendimet e matura japin frytet.',
  'Situata financiare kërkon vëmendje sot. Rishikoni buxhetin dhe gjeni mundësi kursimi. Disiplina sot sjell fryte afatgjata.',
  'Yjet favorizojnë investimet e matura. Shmangni shpenzimet impulsive — çdo para e kursyer sot është investim i nesërmes.',
  'Mundësi financiare vijnë nga drejtim i papritur — mbani vëmendje dhe analizojeni me seriozitet.',
  'Hapat financiarë të mençur po japin rezultate konkrete. Yjet konfirmojnë: rruga financiare është e duhur.',
  'Financat sot janë të qëndrueshme por kërkojnë planifikim proaktiv. Çdo vendim i sotëm ka ndikim të nesërmes.',
];
const DAILY_HEALTH=[
  'Trupi juaj dëgjohet sot — jepini atë çfarë i nevojitet. Pushimi i mjaftueshëm është prioritet.',
  'Energjia fizike është e mirë sot, por kini kujdes me tejlodhjen. Balanconi aktivitetin me pushimin.',
  'Yjet favorizojnë aktivitetin fizik dhe kujdesin ndaj shëndetit mendor. Gjeni momentin tuaj të qetësisë.',
  'Nëse ndiheni të lodhur, pushoni pa faj. Rifuqizimi i qëllimshëm është investim, jo humbje kohe.',
  'Vitaliteti sot është i mirë — shfrytëzojeni me aktivitete pozitive dhe kohë me njerëz ndriçues.',
  'Ndjenjat e mbajtura brenda reflektohen fizikisht. Gjeni mënyrën tuaj të shprehjes — art, bisedë apo lëvizje.',
];
const DAILY_ADVICE2=[
  'Besojini intuitës suaj sot — zemra shpesh e di përgjigjen para mendjes.',
  'Qëndroni të pranishëm — momentet e vogla janë ato që mbeten.',
  'Komunikoni hapur — fjalët e sinqerta ndërtojnë ura të qëndrueshme.',
  'Një veprim i vogël sot mund të ndryshojë rrjedhën e gjithë javës.',
  'Faleni veten dhe të tjerët — liria e vërtetë fillon me falje.',
  'Ndjekni energjinë e gëzimit — ajo ju çon drejt të vërtetës suaj.',
  'Pushoni pak nga teknologjia — natyra dhe heshtja shërojnë thellë.',
  'Shkruani tre gjëra për të cilat jeni mirënjohës sot.',
  'Mos krahasoni rrugën tuaj me të tjerëve — secili ka hapat e vet.',
  'Investoni në marrëdhëniet që ju ngritin — ato janë thesari juaj real.',
  'Çdo sfidë ka mësimin e vet — pyesni çfarë ju mëson.',
  'Sot bëni diçka të vogël për veten — kujdesi ndaj vetes nuk është egoizëm.',
];
const DAILY_COLORS={
  dash:['E kuqe','Portokalli','E verdhë e nxehtë','Bakri','E kuqe mavi','Portokalli i thellë'],
  dem: ['E gjelbër','Kafe e ngrohtë','Krem','Jeshile deti','Okri','E gjelbër e errët'],
  bin: ['E verdhë','Turkuaz','Argjend','E kaltër e lehtë','Limon','E verdhë-jeshile'],
  gaf: ['Argjend','E bardhë','Blu i lehtë','Rozë i lehtë','Jeshile ujë','Lavandë'],
  luan:['Ari','E kuqe mbretërore','Portokalli i ndezur','E verdhë diell','Ari i thellë','Bronz'],
  vir: ['Kafe','E gjelbër e errët','Krem','Ngjyrë preshi','Okri','Jeshile ulliri'],
  pel: ['Rozë','E kaltër qiell','Jeshile i lehtë','E bardhë kremi','Lavandë','Rozë i çelur'],
  akr: ['E kuqe e errët','Bordeaux','E zezë me shkëlqim','Burgundy','Vjollcë e errët','Kafe-e zezë'],
  she: ['Blu','Vjollcë','Portokalli','Ngjyrë indigo','Turkuaz','Blu e çelur'],
  bri: ['Kafe e errët','Gri me cilësi','E zezë elegante','Ngjyrë guri','Ari antik','Olive'],
  uju: ['Blu elektrik','Argjend-blu','Cian','Vjollcë elektrike','Ngjyrë metali','E kaltër neon'],
  pesh:['Jeshile deti','Blu oqean','Argjend-ujë','Lavandë i ndezur','Turkuaz i thellë','Rozë detar'],
};

function buildDailyHTML(key,sign,doy){
  const si=ORDER.indexOf(key);
  const s0=dailySeed(si,doy),s1=dailySeed(si+12,doy),s2=dailySeed(si,doy+100);
  const s3=dailySeed(si*2+1,doy),s4=dailySeed(si,doy*3+1),s5=dailySeed(si+5,doy+50);
  const r=[2+(s0%4),2+(s1%4),2+(s2%4),2+(s3%4)];
  const ln=1+(dailySeed(si*3,doy+7)%9);
  const lc=seedPick(DAILY_COLORS[key],s5);
  const ad=seedPick(DAILY_ADVICE2,s5);
  const html=`
    <h4>✦ Përmbledhja</h4><p>${seedPick(DAILY_OV[key],s0)}</p>
    <h4>❤️ Dashuria</h4><p>${seedPick(DAILY_LOVE,s1)}</p>
    <h4>💼 Karriera</h4><p>${seedPick(DAILY_CAREER,s2)}</p>
    <h4>💰 Financat</h4><p>${seedPick(DAILY_FINANCE,s3)}</p>
    <h4>🌿 Shëndeti</h4><p>${seedPick(DAILY_HEALTH,s4)}</p>
    <h4>✨ Këshilla</h4><p><em>${ad}</em></p>
    <h4>🔢 Numri me fat</h4><p><strong>${ln}</strong></p>
    <h4>🎨 Ngjyra me fat</h4><p><strong>${lc}</strong></p>`;
  return{html,r,ln,lc,ad};
}

// Monthly ratings [love, career, health, finance]
const MR = {dash:[4,5,3,4],dem:[5,3,4,5],bin:[3,5,4,3],gaf:[5,4,5,3],luan:[5,5,4,3],vir:[3,5,5,4],pel:[5,4,4,4],akr:[4,5,3,5],she:[3,4,5,5],bri:[4,5,4,5],uju:[4,5,4,4],pesh:[5,4,5,4]};
// Yearly ratings [love, career, health, finance]
const YR = {dash:[5,5,4,4],dem:[4,4,5,5],bin:[4,5,3,4],gaf:[5,3,5,4],luan:[5,5,4,5],vir:[4,5,5,4],pel:[5,5,3,4],akr:[4,5,3,5],she:[4,5,4,5],bri:[4,5,4,5],uju:[4,5,4,5],pesh:[5,4,5,4]};
const AREA_NAMES = ['dashurinë','karrierën','shëndetin','financat'];
function topArea(r){return AREA_NAMES[r.indexOf(Math.max(...r))];}
function renderSecs(id, r){
  const defs=[{k:'love',i:'❤️',l:'Dashuria'},{k:'career',i:'💼',l:'Karriera'},{k:'health',i:'🌿',l:'Shëndeti'},{k:'finance',i:'💰',l:'Financat'}];
  document.getElementById(id).innerHTML=defs.map((d,idx)=>`<div class="horo-sec"><div class="horo-sec-icon">${d.i}</div><div class="horo-sec-label">${d.l}</div><div class="horo-sec-stars">${stars(r[idx])}</div><div class="horo-sec-text">${SEC_PHRASES[d.k][r[idx]-1]}</div></div>`).join('');
}

// ─── MONTHLY RICH DATA (detailed, per-sign, month-aware) ──────────────────────
const MONTHLY_RICH = {
  dash: mn => ({
    ov: `Muaji ${mn} e vendos Dashin në pozicion të fuqishëm dhe aktiv. Marsi, planeti sundues, ju jep energji të jashtëzakonshme dhe vullnet të çeliktë për të arritur qëllimet tuaja. Ky nuk është muaj për të pritur — çdo hap i ndërmarrë me vendosmëri do të prodhojë rezultate konkrete. Megjithatë, kujdes: shpejtësia e Dashit ndonjëherë shkakton gabime që mund të shmangen me pak reflektim. Balanconi veprimin me mençurinë dhe ${mn} do të jetë ndër muajt më produktivë të vitit. Mundësitë janë reale dhe të prekshme — thjesht duhet t'i kapni.`,
    lo: `Jeta romantike është e gjallë dhe intensive. Beqarët do të kenë mundësi të jashtëzakonshme — dikush që ju admiron nga larg do të marrë guximin të afrohet; mos e injoroni. Nëse jeni në çift, pasioni rinxitet nëpërmjet surprizave dhe aventurave të përbashkëta. Komunikimi i hapur do të forcojë lidhjen si asnjëherë tjetër. Shmangni kokëfortësinë gjatë mosmarrëveshjeve — kompromisi nuk është dobësi, por mençuri e vërtetë.`,
    ca: `Sektori profesional është zona juaj e shkëlqimit këtë muaj. Mos hezitoni të prezantoni ide të reja ose të merrni iniciativën — autoriteti juaj natyral do të tërhiqë vëmendjen e eprorëve. Nëse keni pritur momentin e duhur për të kërkuar promovim ose rritje page, ${mn} ju favorizon fuqishëm. Projektet me risk të llogaritur janë shumë të rekomandueshme.`,
    mo: `Financat kërkojnë planifikim aktiv dhe disiplinë. Shpenzimet impulsive — dobësi klasike e Dashit — duhet kontrolluar me vetëdisiplinë të ndërgjegjshme. Bëni listën e shpenzimeve thelbësore dhe jo-esenciale. Nga ana pozitive, mundësi të reja të ardhurash mund të vijnë nga projekte anësore ose bonuse të papritura. Analizoni para se të veproni.`,
    he: `Energjia fizike është e lartë, por kini kujdes me tejlodhjen. Jeni të prirur të sforcoheni kur jeni në lëvizje, por trupi ka nevojë për pushim të rregullt. Prioritizoni gjumin e mjaftueshëm, hidratimin dhe vaktet e rregullta. Aktiviteti fizik si vrapimi ose yoga ju ndihmon të kanalizoni energjinë e tepërt në mënyrë konstruktive.`,
    da: `5, 9, 14, 22 dhe 28 — ditët kur planetet janë në pozicion më favorshëm për Dashin`,
    ad: `Fuqia juaj më e madhe është vendosmëria — por çdo vendim i madh meriton të paktën një natë gjumë para se të veproni. Guximi kur bashkohet me strategjinë bëhet absolutisht i papërmbajtshëm.`
  }),
  dem: mn => ({
    ov: `Muaji ${mn} i sjell Demit një periudhë qetësie, produktiviteti dhe rritjeje të qëndrueshme. Venusi, planeti sundues, ndriçon njëkohësisht marrëdhëniet dhe financat. Ndiheni të rrënjëzuar dhe të qartë në qëllimet tuaja — ky nuk është muaj për ndryshime drastike, por për konsolidimin e gjithçkaje të nisur. Puna e vazhdueshme dhe besnikëria ndaj vlerave tuaja do të sjellin shpërblime reale dhe të prekshme. Universi po ju tregon se durimi është strategjia fituese.`,
    lo: `Dashuria ka ngrohtësi dhe thellësi. Çiftet konsolidojnë lidhjen nëpërmjet komunikimit të sinqertë dhe planeve të përbashkëta — diskutoni ëndrrat dhe gjërat që doni të ndërtoni bashkë. Beqarët do të tërhiqen nga persona të qëndrueshëm dhe të besuar; evitoni ata me personalitete të paqëndrueshme. Romantizmi i vërtetë fillon me besueshmërinë dhe respektin reciprok.`,
    ca: `Karriera ecën me ritëm të qëndrueshëm dhe rezultate reale. Projektet afatgjata fillojnë të tregojnë fryte. Nëse keni investuar kohë dhe energji në një projekt specifik, ${mn} mund të jetë momenti i korrjes. Bashkëpunimet me kolegë të besueshëm sjellin rezultate sinergjike — zgjidhni partnerët tuaj me kujdes dhe mençuri.`,
    mo: `Ky është ndër muajt financiare më të favorshëm. Venusi favorizon akumulimin dhe investimet afatgjata. Nëse keni menduar të bëni investim — pronë, fond kursimi ose biznes të vogël — ${mn} ju jep energji favorable. Kini kujdes me huadhëniet ndaj miqve — kjo mund të ndikojë negativisht marrëdhëniet e çmuara.`,
    he: `Shëndeti është i mirë kur lidheni me natyrën dhe ruani rutinën. Shëtitjet, ushqimi i shëndetshëm dhe gjumi cilësor janë themelet tuaja. Ky muaj, vini re si reagoni ndaj stresit — nëse simptoma fizike shfaqen, zakonisht kanë burim emocional. Masazhi ose aktivitete relaksuese si noti japin rezultate të mrekullueshme.`,
    da: `4, 10, 18, 24 dhe 30 janë ditët kur yjet favorizojnë Demin në mënyrë të veçantë`,
    ad: `Qëndrueshmëria juaj është dhurata më e vlefshme që i jepni vetes dhe të tjerëve. Mos u tundni nga gjërat që duken të shpejta dhe të lehta — lumturia juaj fillon me themele të forta.`
  }),
  bin: mn => ({
    ov: `Muaji ${mn} ndez mendjen e Binjakëve me ide, bashkëpunime dhe mundësi komunikuese të bollshme. Mërkuri, planeti juaj sundues, lëviz fuqishëm dhe çdo fjalë juaj godet me saktësi dhe elegancë. Ky muaj ju fton të zgjeroni rrjetin social, të prezantoni ide të reja dhe të eksploroni fusha që ju kanë tërhequr prej kohësh. Dinamizmi juaj natyral do të tërhiqë mundësi nga drejtimi ku nuk i pritni. Mbajini sytë hapur — bashkëpunimet e papritura shpesh janë ato më transformuese.`,
    lo: `Dashuria ka karakter intelektual dhe emocionues. Bisedat e thella do t'ju afrojnë me partnerin ose do t'ju bëjnë të dashuroheni me dikë të ri dhe interesant. Beqarët do të kenë takime sociale ku ndodhin lidhjet e papritura. Nëse jeni në çift, provoni diçka krejtësisht të re bashkë — kurs, udhëtim spontan ose aktivitet i ri që asnjëri prej jush nuk ka provuar.`,
    ca: `Prezantime, negociata, propozime — çdo gjë e shprehur me gojë ose shkrim do të ketë ndikim të madh këtë muaj. Rrjeti juaj social hap dyer konkrete dhe të papritura. Nëse keni projekt krijues ose komunikues, ${mn} është koha ideale për ta nisur ose çuar përpara. Kini kujdes me angazhimet e shumta — zgjidhni ato me prioritet të qartë.`,
    mo: `Financat janë të ndryshueshme — mundësi të papritura mund të vijnë, por kjo kërkon vigilancë. Shmangni vendime financiare të nxituara bazuar vetëm mbi entuziazëm të momentit. Konsultohuni me dikë të besuar para investimeve të mëdha. Kontrolloni kontratat dhe marrëveshjet me kujdes — detajet bëjnë dallimin.`,
    he: `Mendja juaj kurrë nuk ndalon — dhe kjo mund të bëhet burim lodhje kronike. Ky muaj, praktikat e qetësisë si meditimi, shëtitjet e qeta apo leximi janë shumë të rëndësishme. Shmangni ndërrimin e orarit të gjumit — ritmi i rregullt ju jep qartësi mendore të çmuar.`,
    da: `3, 7, 15, 21 dhe 27 janë ditët me energji favorizuese dhe komunikim të lartë`,
    ad: `Mendjemprehtësia juaj është forcë, por thellësia është çelësi tjetër i suksesit. Zgjidhni një gjë dhe bëjeni mirë — suksesi rritet me fokus të qëndrueshëm, jo me shumësi.`
  }),
  gaf: mn => ({
    ov: `Muaji ${mn} fton Gaforrjen të ndërtojë siguri dhe të investojë në marrëdhëniet kryesore. Hëna, planeti sundues, sjell valë emocionale që mund të jenë gjithashtu burim i madh kreativiteti. Kjo periudhë është ideale për të forcuar lidhjet familjare, për të rishikuar qëllimet e shtëpisë dhe karijerës, dhe për të marrë vendime bazuar mbi intuitën tuaj të pazakontë. Çdo gjë e ndërtuar me zemër dhe sinqeritet këtë muaj ka qëndrueshmëri të jashtëzakonshme.`,
    lo: `Dashuria ka thellësi dhe sinqeritet të rrallë. Nëse jeni në çift, biseda të hapura do të afrojnë dy shpirtrat — thoni ato gjëra që i keni mbajtur brenda prej kohësh. Beqarët do të jenë shumë tërheqës për partnerë që kërkojnë ndershmëri dhe ngrohtësi. Familja luan rol të rëndësishëm në jetën romantike të Gaforrjes këtë muaj.`,
    ca: `Karriera ecën mirë kur keni mbështetje ekipore. ${mn} favorizon lidershipin empatik — aftësia juaj për të kuptuar nevojat e ekipit prodhon rezultate të jashtëzakonshme. Nëse jeni në kërkim pune, mundësi vijnë nga rekomandime personale të besuara. Kreativiteti dhe intuita janë asetet tuaja kryesore profesionale.`,
    mo: `Financat kërkojnë kujdes emocional — shpenzimet për qetësi emocionale mund të jenë të tepruara dhe jo-efektive. Krijoni dallim të qartë mes asaj që "doni" dhe asaj që "keni nevojë". Kursimet për shtëpinë ose familjen janë shumë të favorshme. Evitoni huamarrjet për gjëra jo-thelbësore.`,
    he: `Shëndeti lidhet ngushtë me gjendjen emocionale të Gaforrjes. Kur jeni të lumtur dhe të sigurt, trupi juaj funksionon shkëlqyeshëm. Ky muaj, investoni në marrëdhënie që ju ngrisin dhe largohuni nga ato që ju lodhin. Uji — breg deti, pishinë, banjo të gjata — ka efekt shërues të veçantë për ju.`,
    da: `2, 8, 16, 20 dhe 25 janë ditët kur intuita dhe mundësitë janë në kulmin e tyre`,
    ad: `Ndjenjat tuaja janë burim informacioni — jo dobësi. Dëgjojini me vëmendje dhe veproni sipas tyre me guxim dhe vetëbesim.`
  }),
  luan: mn => ({
    ov: `Muaji ${mn} e vendos Luanin pikërisht aty ku i pëlqen — në qendër të vëmendjes dhe mundësive. Dielli, planeti sundues, ndriçon sektorin e karijerës dhe kreativitetit duke ju dhuruar magnetizëm të shtuar dhe energji rivolucionuese. Ky muaj kërkon nga ju të shprehni potencialin e plotë — nëse keni ëndërruar të bëni diçka të madhe, tani është koha e duhur. Njohja dhe respekti që meritoni janë në rrugën e tyre drejt jush.`,
    lo: `Romantizmi kap intensitetin maksimal. Beqarët do të bëhen objekt admirimi nga disa persona njëkohësisht — kini durimin të zgjidhni me mençuri dhe jo vetëm emocion. Çiftet kalojnë momente mbresëlënëse të paharrueshme — planifikoni diçka ekstravagante dhe spektakolare. Ekspresiviteti juaj emocional forcën lidhjen dhe krijon kujtime të paçmueshme.`,
    ca: `Jupiteri ndikon karrierën e Luanit drejtpërdrejt. Mundësi promovimi, projekte me profil të lartë, prezantime para auditorëve të rëndësishëm — të gjitha janë aktive dhe të mundshme. Besojini instinktit kreativ dhe mos lini idetë tuaja të gjumosën. Kini kujdes me egon — suksesi shijohet më plotësisht kur ndahet me të tjerët.`,
    mo: `Të ardhurat mund të rriten nga burime kreative ose projekte anësore të talentit tuaj. Shmangni shpenzimet ekstravagante për imazh dhe status — autenticiteti juaj është tashmë i mjaftueshëm. Investimet në zhvillim personal si kurse dhe trajnime sjellin kthim financiar afatmesëm të qëndrueshëm.`,
    he: `Vitaliteti është i shkëlqyer, por zemra si organ dhe emocion kërkon kujdes të veçantë. Aktiviteti fizik i rregullt dhe shprehja emocionale e lirë janë thelbësore për mirëqenien tuaj. Gjumi i mjaftueshëm është i domosdoshëm — pa pushim, energjia juaj dramatike kthehet në nervozizëm.`,
    da: `1, 8, 14, 19 dhe 27 janë ditët e fuqisë maksimale solare për Luanin`,
    ad: `Madhështia juaj e vërtetë nuk qëndron vetëm në skenën e jashtme — por në ndjeshmërinë me të cilën trajtoni ata afër jush. Jepuni kohë cilësore njerëzve të dashur.`
  }),
  vir: mn => ({
    ov: `Muaji ${mn} i ofron Virgjëreshës mundësinë e rrallë për të korrur frytet e punës sistematike dhe të planifikuar. Mërkuri shton aftësinë analitike dhe komunikuese — jeni në gjendje të zgjidhni probleme komplekse me efikasitet të jashtëzakonshëm. Kjo periudhë favorizon organizimin, planifikimin afatmesëm dhe vendosjen e kufijve të shëndetshëm. Çdo detaj i kujdesur tani do të kursejë probleme dhe kohë në muajt e ardhshëm.`,
    lo: `Marrëdhëniet romantike fitojnë thellësi kur komunikimi është i sinqertë dhe direkt. Çiftet mund të diskutojnë tema serioze me qartësi dhe qetësi. Beqarët do të tërhiqen nga persona intelektualë dhe të organizuar — ndoshta nga mjedisi i punës ose studimit. Shmangni perfeksionizmin edhe në dashuri — askush nuk është i përsosur, por dikush mund të jetë i duhuri.`,
    ca: `Saturni shpërblen disiplinën me njohje konkrete dhe profesionale. Nëse keni investuar kohë dhe energji në projekte specifike, ${mn} sjell konfirmimin e vlerës suaj. Eprorët e vënë re saktësinë dhe besueshmërinë tuaj. Kini kujdes me perfeksionizmin e tepërt — "mjaftueshëm mirë dhe në kohë" shpesh i kalon "perfekt por me vonesë".`,
    mo: `Financat janë të mira kur menaxhohen me disiplinë — çfarë bëni ju shumë mirë. Rishikoni buxhetin dhe gjeni hapësira optimizimi. Investimet konservative dhe të bazuara në fakte janë ide të mira. Evitoni me rigorozitet skema fitim-të-shpejtë — analizoni çdo propozim me skepticizëm konstruktiv.`,
    he: `Rishikoni zakonet tuaja shëndetësore — ushqimi, gjumi, ushtrimet. Stresi i akumuluar mund të shfaqet si simptoma fizike — merrni vlerësim mjekësor nëse keni shtyrë kontrollet. Aktiviteti i moderuar fizik dhe pushimi i mjaftueshëm janë armët kryesore të shëndetit tuaj.`,
    da: `6, 12, 17, 23 dhe 29 janë ditët kur qartësia dhe produktiviteti janë në maksimum`,
    ad: `Nuk keni nevojë të kontrolloni çdo detaj për të qenë efektiv. Ky muaj, praktikoni lënien e vogëlsirave dhe koncentrohuni në tablonë e madhe.`
  }),
  pel: mn => ({
    ov: `Muaji ${mn} fton Peshorjen të gjejë ekuilibrin e brendshëm dhe të forcojë marrëdhëniet kryesore. Venusi, planeti sundues, sjell harmoni dhe bukuri në çdo aspekt të jetës — nga ambientet ku jetoni deri te mënyra si komunikoni. Ky nuk është muaj për konflikte dhe tension — është muaj për ndërtim të qëndrueshëm dhe kujdes reciprok. Talenti juaj unik për të gjetur kompromise do të jetë dhuratë e papagueshme.`,
    lo: `Dashuria ka elegancë dhe thellësi karakteristike. Çiftet gëzojnë momente të bukura bashkëjetese — planifikoni diçka estetikisht të bukur: darkë me kerzë, muzikë live ose piknik romantik. Beqarët do të kenë mundësi të takojnë persona të cilësueshëm nëpërmjet ngjarjeve sociale ose artistike. Mos hezitoni të shprehni ndjenjat — hezitimi i prolongon gjërat pa asnjë arsye.`,
    ca: `Peshorja shkëlqen në mjedise bashkëpunuese dhe diplomatike. Roli juaj si ndërmjetës dhe ndërtues konsensusi do të vlerësohet shumë nga ekipi. Projektet që kërkojnë menaxhim marrëdhëniesh ose prezencë publike janë shumë të favorshme. Merrni vendime me vendosmëri — eprorët respektojnë ata që vendosin me siguri.`,
    mo: `Financat janë të qëndrueshme kur shmanget tepria në të dy drejtimet. Ky muaj, gjeni balancin tuaj financiar personal. Mundësi partnershipesh financiare ose investime bashkëpunuese janë shumë favorshme. Shmangni vendimet financiare nën presion social ose për të kënaqur të tjerët.`,
    he: `Shëndeti lidhet ngushtë me harmoninë e mjedisit dhe marrëdhënieve. Stresi nga konfliktet e pa-zgjidhura reflektohet fizikisht — qyrtisni çdo tension dhe gjeni rrugëdalje konstruktive. Aktiviteti i moderuar si yoga, shëtitje ose dans kombinuar me ushqim të ekuilibruar jep rezultate optimale.`,
    da: `5, 11, 18, 24 dhe 30 janë ditët kur harmonia dhe mundësitë janë në kulmin e tyre`,
    ad: `Vendimet e vështira nuk bëhen asnjëherë më të lehta me shtyrje të pafundme. Zgjidhni me vendosmëri dhe besojini gjykimit tuaj — keni informacionin e nevojshëm.`
  }),
  akr: mn => ({
    ov: `Muaji ${mn} aktivizon forcën transformuese të Akrepit. Plutoni, planeti sundues, krijon kushtet për largimin e gjithçkaje të kalbur dhe hapësirën për diçka autentike dhe të fuqishme. Kjo periudhë mund të sjellë ndryshime të mëdha — në karrierë, marrëdhënie ose perspektivë të brendshme shpirtërore. Mos i rezistoni ndryshimit — Akrepi lulëzon pikërisht kur transformohet dhe sheddon lëkurën e vjetër me guxim.`,
    lo: `Dashuria ka intensitetin karakteristik — thellësi, pasion dhe autenticitet të rrallë. Biseda kulmante me partnerin mund t'i qartësojnë gjëra shumë të rëndësishme: a jeni në të njëjtin drejtim? Beqarët do të tërhiqen nga persona misterioz dhe kompleks — besojini intuitës suaj mbi karakterin e njerëzve, jo vetëm pamjes së jashtme.`,
    ca: `${mn} favorizon hulumtimin, analizën e thellë dhe strategjitë afatgjata. Akrepi punon me efikasitet maksimal kur ka liri të plotë veprimi — kërkojeni atë hapësirë. Mundësi fshehura mund të zbulohen nëpërmjet informacionit ose kontakteve të neglizhura. Mos tregoni të gjitha kartat tuaja menjëherë — strategjia e planifikuar do t'ju japë avantazh.`,
    mo: `Financat kërkojnë inteligjencë strategjike të rreptë. Mundësi investimi jo-konvencionale mund të jenë shumë profitabile nëse hulumtohen seriozisht dhe plotësisht. Kini kujdes me partnerët financiare të paqartë dhe të errët. Burime të reja të ardhurash mund të vijnë nga shkathtësi specifike që keni.`,
    he: `Shëndeti ka lidhje të thellë me botën emocionale të Akrepit. Ndjenjat e pa-shprehura ose trauma të pa-procesuar shfaqen si probleme fizike. Ky muaj, jepini vetes hapësirë për të shprehur dhe procesuar — qoftë nëpërmjet terapisë, journaling apo bisedave të besuara. Ushtrimet intensive janë kanal i shkëlqyer shkarkues.`,
    da: `4, 10, 17, 23 dhe 28 janë ditët kur intuita dhe forca transformuese janë maksimale`,
    ad: `Çdo gjë që nuk ju shërben ka kohë të largohet pa keqardhje. Bëni guximin e lëshimit — hapësira e lirë është pikërisht aty ku mbijnë gjërat e reja dhe të fuqishme.`
  }),
  she: mn => ({
    ov: `Muaji ${mn} zgjon aventurierin dhe filozofin e brendshëm të Shigjetarit. Jupiteri, planeti sundues, hap horizonte të reja — mendore, fizike dhe shpirtërore. Kjo periudhë është ideale për të mësuar diçka të re, për të udhëtuar dhe për të rishikuar besimet dhe vlerat tuaja. Optimizmi juaj karakteristik është dhuratë e çmuar — ndajeni me të tjerët dhe do të ktheheni shumëfish.`,
    lo: `Dashuria ka liri dhe aventurë si themel të qëndrueshëm. Beqarët do të kenë mundësi romantike gjatë udhëtimeve, kurseve ose ngjarjeve kulturore stimuluese. Nëse jeni në çift, planifikoni diçka aventuroze bashkë — rutina e mërzitshme është armiku juaj kryesor. ${mn} favorizon dashuritë që ju lënë të lirë të rriteni si individ brenda marrëdhënies.`,
    ca: `Karriera fiton nga guximi dhe perspektiva e gjerë e Shigjetarit. Mundësi ndërkombëtare ose projekte me dimension global janë shumë të favorshme. Nëse keni ëndërruar të punoni me partnerë nga vendet e tjera, ${mn} hap rrugët konkrete. Certifikimet e reja dhe arsimimi i vazhdueshëm rrisin vlerën tuaj profesionale ndjeshëm.`,
    mo: `Jupiteri sjell bujari financiare, por menaxhojeni me mençuri dhe kujdes. Paratë vijnë lehtë — dhe mund të ikin po aq lehtë. Bëni dallim të qartë mes shpenzimit të gëzueshëm dhe atij impulsiv. Investimet afatgjata si fondet e pensionit janë shumë të rekomandueshme.`,
    he: `Energjia juaj është ndër më të lartat e zodiakut, por kini kujdes me aktivitete shumë rrezikuese — jeni të prirur drejt lëndimeve nga mosmarrja parasysh e limiteve fizike. Aktivitetet si gjimnastikë ose sporte ekipore janë ideale. Sigurohuni që dieta mbështetë nivelin e lartë të aktivitetit tuaj.`,
    da: `3, 9, 15, 21 dhe 26 janë ditët kur Jupiteri ndriçon rrugën e Shigjetarit`,
    ad: `Jo çdo mundësi meriton "po" të menjëhershëm. Ky muaj, praktikoni prioritizimin — zgjidhni aventurat që ju çojnë drejt qëllimeve tuaja afatgjata.`
  }),
  bri: mn => ({
    ov: `Muaji ${mn} shpërblen Bricjapin për çdo orë të investuar me seriozitet dhe dedikrim të plotë. Saturni, planeti sundues, ndodhet në pozicion të favorshëm dhe çdo punë e bërë me disiplinë prodhon rezultate konkrete dhe afatgjata. Ky muaj mund të sjellë njohje profesionale të merituar, konfirmim financiar ose thellim të rëndësishëm të marrëdhënieve kryesore. Jeni gati — e keni fituar me mund dhe durim.`,
    lo: `Dashuria është serioze, e qëndrueshme dhe me thellësi karakteristike. Çiftet e ngurta konsolidojnë lidhjen nëpërmjet vendimeve të rëndësishme të përbashkëta. Beqarët do të tërhiqen nga persona ambiciozë dhe të qëndrueshëm. Çelësi këtë muaj është autenticiteti — tregohuni ashtu siç jeni, pa maska dhe pa pretendime.`,
    ca: `Saturni shpërblen Bricjapin me njohje dhe mundësi karriere të mëdha. Nëse keni punuar me dedikrim ndër vite, tani vjen konfirmimi i plotë. Pozicione udhëheqëse, kontrata të reja ose projekte strategjike janë shumë të mundshme. Qëndroni profesional dhe të fokusuar — mos u shpërqendroni nga politikat e brendshme.`,
    mo: `Financat janë në gjendje shumë të favorshme. Investimet konservative dhe afatgjata kanë potencial kthimi të mirë. Rishikoni portofolin financiar dhe bëni rregullimet e nevojshme. Kursimi sistematik vazhdon të jetë strategjia juaj fituese afatgjatë.`,
    he: `Shëndeti kërkon vëmendje ndaj eshtrave, nyjeve dhe sistemit muskuloskeletal. Aktiviteti i strukturuar si stërvitja me pesha ose pilates është ideal. Mos neglizhoni pushimin — Bricjapi ka tendencën të punojë deri në rraskapitje. Bilansi punë-pushim është çelësi i shëndetit.`,
    da: `7, 13, 20, 25 dhe 31 janë ditët kur Saturni rreshton fuqitë e tij për Bricjapin`,
    ad: `Keni punuar shumë për të arritur këtu. Lejojeni veten të festoni arritjet — dhe ndajini me ata që ju kanë mbështetur. Mirënjohja e hapur forcën lidhjet.`
  }),
  uju: mn => ({
    ov: `Muaji ${mn} aktivizon potencialin revolucionar dhe inovativ të Ujorit. Uranusi, planeti sundues, krijon kushte për ndryshime befasuese dhe mundësi të papritura dhe frymëzuese. Kjo periudhë është ideale për të sjellë idetë tuaja të avancuara në praktikë, për të ndërtuar aleanca me njerëz me mendje të ngjashme dhe për të kontribuar në diçka që i kalon kufijtë e interesit personal. Inovacioni juaj ka vlerë reale dhe të prekshme.`,
    lo: `Dashuria ka autenticitet dhe liri si baza. Çiftet që respektojnë individualitetin e njëri-tjetrit do të gëzojnë momente të jashtëzakonshme. Beqarët do të takojnë persona unikalë dhe interesantë — ndoshta në ngjarje kulturore ose diskutime intelektuale. Shmangni marrëdhëniet kufizuese — Ujori lulëzon me partnerë që kuptojnë nevojën për hapësirë.`,
    ca: `Teknologjia, inovacioni dhe projektet humanitare janë fushat tuaja të shkëlqimit. Idetë jo-konvencionale do të gjejnë mbështetje nga kolegë me mendjemprehtësi. Mundësitë e lidershipit vijnë nëpërmjet iniciativave të reja dhe kurajuese. Tregoni vlerat dhe vizionin tuaj — jo vetëm aftësi teknike.`,
    mo: `Financat mund të kenë surpriza pozitive nga burime dixhitale ose inovative. Investimet në teknologji mund të jenë shumë profitabile nëse hulumtohen me kujdes. Kini kujdes me skemat e paqarta dhe premtimet e mëdha — analizoni me skepticizëm dhe konsultohuni me ekspertë.`,
    he: `Ujori neglizhon trupin kur mendja është e zënë me ide. Ky muaj, sigurohuni për rutinë minimale shëndetësore — gjumë i rregullt, hidratim dhe lëvizje fizike. Aktivitetet sociale si sporte ekipore ose klasa grupore kombinojnë socialin me fizikun në mënyrë ideale.`,
    da: `2, 8, 14, 20 dhe 26 janë ditët kur Uranusi aktivizon potencialin tuaj inovativ`,
    ad: `Idetë tuaja janë dekada përpara kohës — por realizimi ndodh sot. Zgjidhni një ide dhe çoni atë nga vizion abstrakt në plan konkret dhe të realizueshëm.`
  }),
  pesh: mn => ({
    ov: `Muaji ${mn} thellohet bota e brendshme dhe krijuese e Peshqve. Neptuni, planeti sundues, amplifikohet dhe intuita juaj arrin nivele mbresëlënëse dhe të pashpjegueshme. Kjo periudhë është ideale për projekte artistike, shpirtërore dhe krijuese — çdo gjë e krijuar tani ka potencial të jashtëzakonshëm dhe të qëndrueshëm. Marrëdhëniet dashurie dhe shpirtërore marrin thellësi të re dhe kuptim të ri. Ëndrrat tuaja janë mesazhe — dëgjojini me vëmendje.`,
    lo: `Dashuria ka dimensione poetike dhe shpirtërore. Lidhjet romantike thellohen nëpërmjet kuptimit të ndërsjelltë dhe shprehjes emocionale të guximshme. Beqarët do të jenë shumë tërheqës për persona artistikë dhe ndijshëm. Mos u frikësoni nga vulnerabiliteti — ajo që e bën dashurinë autentike është saktësisht kjo hapje e plotë.`,
    ca: `Sektorët kreativë, shëndetësorë dhe artistikë janë fushat tuaja optimale. Intuita juaj e jashtëzakonshme ju jep avantazh kudo që empatia dhe krijimtaria janë vlera. Nëse keni projekt krijues të papërfunduar, ${mn} ju jep energji dhe qartësi për ta çuar deri në fund.`,
    mo: `Financat kërkojnë kufi të qartë dhe vetëdisiplinë të ndërgjegjshme. Tendenca për të dhënë pa llogaritur ose për të shpenzuar emocionalisht duhet kontrolluar. Besojini intuitës suaj mbi investimet, por verifikoni gjithmonë me fakte objektive. Bashkëpunimet financiare me persona të besueshëm janë shumë të favorshme.`,
    he: `Shëndeti është shumë i ndjeshëm ndaj energjisë së mjedisit dhe njerëzve rreth tyre. Ky muaj, bëni "pastrimin" e mjedisit emocional — largohuni nga marrëdhëniet kullues dhe vendosni kufij të qartë. Praktika shpirtërore si meditimi, yoga ose kohë pranë ujit janë terapeutike dhe shëruese.`,
    da: `1, 7, 13, 19 dhe 25 janë ditët kur Neptuni shtrin magjinë e tij`,
    ad: `Ndjeshmëria juaj është superfuqi — jo dobësi. Besojini intuitës dhe kreativitetit — ato janë udhëzuesit tuaj më të besueshëm dhe autentikë.`
  })
};

function buildMonthlyHTML(sign, key, mIdx) {
  const mn = MO[mIdx];
  const d = MONTHLY_RICH[key] ? MONTHLY_RICH[key](mn) : null;
  if (!d) return `<p>${mn} sjell mundësi dhe sfida interesante për ${sign.n}. Kjo është koha për të vepruar me mençuri dhe vendosmëri.</p>`;
  return `
    <h4>✦ Panorama e Muajit</h4>
    <p>${d.ov}</p>
    <h4>❤️ Dashuria &amp; Marrëdhëniet</h4>
    <p>${d.lo}</p>
    <h4>💼 Karriera &amp; Puna</h4>
    <p>${d.ca}</p>
    <h4>💰 Paratë &amp; Financat</h4>
    <p>${d.mo}</p>
    <h4>🌿 Shëndeti &amp; Energjia</h4>
    <p>${d.he}</p>
    <h4>📅 Ditët e Rëndësishme të ${mn}</h4>
    <div class="m-days">✦ ${d.da}</div>
    <h4>✨ Këshilla e Muajit</h4>
    <p><em>${d.ad}</em></p>
  `;
}

// ─── BUILD SIGN GRIDS ─────────────────────────────────────
function buildGrid(containerId, fn) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = ORDER.map(k => {
    const s = S[k];
    return `<button type="button" class="sign-card" data-sign="${k}" aria-pressed="false" onclick="${fn}('${k}',this)">
      <span class="sign-emoji" aria-hidden="true">${s.s}\uFE0E</span>
      <span class="sign-name">${s.n}</span>
      <span class="sign-dates">${s.d}</span>
    </button>`;
  }).join('');
}

// ─── SHOW HOROSCOPE ───────────────────────────────────────
function showHoroImpl(key, type, btn) {
  if (document.body.dataset.sign && document.body.dataset.sign !== key) {
    const target = new URL('/horoskopi/' + SIGN_SLUGS[key] + '/', location.origin);
    if (type !== 'ditor') target.searchParams.set('period', type);
    location.assign(target.href);
    return;
  }
  const sect = type === 'ditor' ? 'horoskopi' : type;
  document.querySelectorAll(`#${sect} .sign-card`).forEach(c => { c.classList.remove('selected'); c.setAttribute('aria-pressed', 'false'); });
  btn.classList.add('selected');
  btn.setAttribute('aria-pressed', 'true');
  const loading = document.getElementById(type + 'Loading');
  const result  = document.getElementById(type + 'Result');
  loading.classList.add('visible');
  result.classList.remove('visible');
  {
    loading.classList.remove('visible');
    const sign = S[key];
    document.getElementById(type + 'Sym').textContent   = sign.s;
    document.getElementById(type + 'Name').textContent  = sign.n;
    document.getElementById(type + 'Dates').textContent = sign.d;
    if (type === 'ditor') {
      const dr = buildDailyHTML(key, sign, doy);
      document.getElementById('ditorText').innerHTML = dr.html;
      document.getElementById('sLove').textContent   = stars(dr.r[0]);
      document.getElementById('sWork').textContent   = stars(dr.r[1]);
      document.getElementById('sHealth').textContent = stars(dr.r[2]);
      document.getElementById('sMoney').textContent  = stars(dr.r[3]);
      document.getElementById('ditorPlanet').textContent = `Planeti: ${sign.pl}  ·  Element: ${sign.el}`;
      document.getElementById('ditorLucky').innerHTML =
        `<span class="lucky-tag">✦ Numri me fat: ${dr.ln}</span>
         <span class="lucky-tag">✦ Dita me fat: ${sign.ld}</span>
         <span class="lucky-tag">✦ Ngjyra me fat: ${dr.lc}</span>`;
      renderSecs('ditorSecs', dr.r);
      document.getElementById('ditorAdvice').textContent = dr.ad;
    } else if (type === 'mujor') {
      document.getElementById('mujorText').innerHTML = buildMonthlyHTML(sign, key, mon);
      renderSecs('mujorSecs', MR[key]);
      document.getElementById('mujorFocus').textContent = 'Ky muaj favorizon veçanërisht ' + topArea(MR[key]) + ' — çoni energjinë atje.';
      document.getElementById('mujorLucky').innerHTML =
        `<span class="lucky-tag">✦ Numri: ${sign.ln}</span>
         <span class="lucky-tag">✦ Ngjyra: ${sign.lc}</span>
         <span class="lucky-tag">✦ Element: ${sign.el}</span>
         <span class="lucky-tag">✦ Planeti: ${sign.pl}</span>`;
    } else if (type === 'vjetor') {
      document.getElementById('vjetorText').innerHTML = `<p>${sign.yearly}</p>`;
      renderSecs('vjetorSecs', YR[key]);
      document.getElementById('vjetorFocus').textContent = 'Viti 2026 favorizon ' + topArea(YR[key]) + ' — kjo është fusha juaj kryesore e rritjes.';
      document.getElementById('vjetorLucky').innerHTML =
        `<span class="lucky-tag">✦ Numri: ${sign.ln}</span>
         <span class="lucky-tag">✦ Ngjyra: ${sign.lc}</span>
         <span class="lucky-tag">✦ Element: ${sign.el}</span>
         <span class="lucky-tag">✦ Planeti: ${sign.pl}</span>`;
    }
    result.classList.add('visible');
    updateResultActions(key, type);
    if (!restoringSign) result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block:'nearest'});
  }
}

function showHoro (k, b) { showHoroImpl(k, 'ditor',  b); }
function showHoroM(k, b) { showHoroImpl(k, 'mujor',  b); }
function showHoroV(k, b) { showHoroImpl(k, 'vjetor', b); }

// ─── INIT ─────────────────────────────────────────────────
document.getElementById('mujorBadge').textContent = '✦ ' + MO[mon] + ' ' + yr;
buildGrid('gridDitor',  'showHoro');
buildGrid('gridMujor',  'showHoroM');
buildGrid('gridVjetor', 'showHoroV');
