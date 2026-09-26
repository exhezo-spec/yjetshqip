# Yjet Shqip

Faqe statike HTML/CSS/JavaScript. Publikimi duhet të përfshijë skedarët HTML në rrënjë, `assets/`, `horoskopi/`, `robots.txt` dhe `sitemap.xml`.

## Përditësimi i horoskopit

- `horoskopi.html`: modeli i faqeve dhe përmbajtja e përbashkët.
- `assets/horoscope.js`: tekstet, të dhënat dhe shfaqja e rezultateve.
- `assets/horoscope-actions.js`: ruajtja e shenjës dhe shpërndarja.
- `scripts/build-sign-pages.js`: profilet statike dhe gjenerimi i 12 faqeve. Pas ndryshimit të modelit ose të dhënave, ekzekuto `node scripts/build-sign-pages.js`.

Faqet e gjeneruara ruhen në projekt; hostimi nuk ka nevojë për Node.js. Teksti ditor llogaritet në shfletues nga data lokale. Profili i shenjës lexohet edhe pa JavaScript.

## Verifikimi

Ekzekuto `node scripts/verify-site.js`. Kontrollon sintaksën, lidhjet lokale, strukturën bazë, 36 rezultate, ruajtjen, shpërndarjen dhe përgjigjet sukses/gabim të formularit me kërkesa të simuluara. Nuk dërgon mesazhe reale.

Për parapamje nga rrënja: `python -m http.server 8000`, pastaj hap `http://localhost:8000`. Rrugët që nisin me `/` kërkojnë server HTTP, jo hapje me `file://`.

Kontrolli vizual në shfletues dhe prova reale e dorëzimit te Formspree duhen bërë përpara publikimit. Kartela sociale gjenerohet me `python scripts/social-preview.py` (Pillow dhe fonti Segoe UI në Windows).
