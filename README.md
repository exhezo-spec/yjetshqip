# Yjet Shqip

Faqe HTML/CSS/JavaScript me shfaqje të horoskopit nga serveri në Vercel. Publikimi përfshin skedarët HTML, `assets/`, `horoskopi/`, `api/`, `lib/`, `vercel.json`, `robots.txt` dhe `sitemap.xml`.

Pamja e kryefaqes dhe faqeve të horoskopit përcaktohet në `assets/celestial.css`. Kontrollet e përbashkëta dhe menuja në telefon përdorin `assets/site.css` dhe `assets/site.js`.

## Përditësimi i horoskopit

- `horoskopi.html`: modeli i faqeve dhe përmbajtja e përbashkët.
- `assets/horoscope.js`: tekstet, të dhënat dhe shfaqja e rezultateve.
- `assets/horoscope-actions.js`: ruajtja e shenjës dhe shpërndarja.
- `content/sign-guides.json`: përmbajtja e veçantë për secilën shenjë.
- `lib/horoscope-render.js` dhe `api/horoscope.js`: teksti i datës aktuale në HTML, edhe pa JavaScript.
- `scripts/build-sign-pages.js`: profilet statike dhe gjenerimi i 12 faqeve. Pas ndryshimit të modelit ose të dhënave, ekzekuto `node scripts/build-sign-pages.js`.

Faqet e gjeneruara ruhen në projekt si kopje me datën e gjenerimit. Në Vercel, rrugët e horoskopit kalojnë te funksioni Node.js që rifreskon tekstin sipas ditës në `Europe/Tirane`. Leximi është i njëjtë në server dhe shfletues; CDN mund të mbajë versionin e mëparshëm deri në 60 sekonda. Nuk kërkohet publikim i ri çdo ditë. Burimi i teksteve mbetet koleksioni i parapërgatitur, jo llogaritje planetare në kohë reale.

## Verifikimi

Ekzekuto `node scripts/verify-site.js`. Kontrollon sintaksën, lidhjet lokale, strukturën bazë, 36 rezultate, ruajtjen, shpërndarjen dhe përgjigjet sukses/gabim të formularit me kërkesa të simuluara. Nuk dërgon mesazhe reale.

Ekzekuto edhe `node scripts/verify-render.js` për përmbajtjen pa JavaScript, datën në mesnatë, ndërrimin e orës, metadata-t dhe funksionin Vercel. Pas publikimit, përgjigjet e `/horoskopi.html` dhe `/horoskopi/dashi/` duhet të kenë `X-Horoscope-Rendered: server` dhe tekst ditor në HTML.

Për parapamjen e kopjeve statike: `python -m http.server 8000`, pastaj hap `http://localhost:8000`. Ky server nuk ekzekuton funksionin Vercel. Rrugët që nisin me `/` kërkojnë server HTTP, jo hapje me `file://`.

Kontrolli vizual në shfletues dhe prova reale e dorëzimit te Formspree duhen bërë përpara publikimit. Kartela sociale gjenerohet me `python scripts/social-preview.py` (Pillow dhe fonti Segoe UI në Windows).
