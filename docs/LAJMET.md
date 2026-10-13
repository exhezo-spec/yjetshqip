# Yjet Shqip — lajmet automatike

## Skedarët
- `index.html` — faqja kryesore e re (me seksionin e lajmeve)
- `lajme.html` — faqja e plotë e lajmeve me kategori
- `data/news.json` — lajmet (gjenerohet automatikisht; tani ka lajme shembull)
- `scripts/fetch_news.py` — merr RSS-të, i rishkruan në shqip me Claude, ruan `news.json`
- `.github/workflows/news.yml` — ekzekuton scriptin çdo orë në GitHub Actions

## Instalimi (5 minuta)
1. Kopjo këta skedarë në repo-n e sitit (ruaj strukturën e dosjeve).
2. Në GitHub → **Settings → Secrets and variables → Actions → New repository secret**:
   `ANTHROPIC_API_KEY` = çelësi nga console.anthropic.com
3. Push. Workflow-i niset vetë çdo orë; për ta provuar menjëherë: **Actions → "Lajmet (çdo orë)" → Run workflow**.
4. Pas ekzekutimit të parë, `data/news.json` mbushet me lajme reale dhe shënimi "lajme shembull" zhduket vetë.

Nëse siti është në Netlify/Vercel, çdo commit i bot-it bën deploy automatik.

## Kostoja
Çdo lajm = 1 thirrje e shkurtër te Claude (~500 tokena). Me 30 lajme/orë maksimum
(`NEWS_MAX_NEW`) dhe Sonnet, kosto rreth 1–3 $/muaj. Ule `NEWS_MAX_NEW` ose
ndrysho `NEWS_MODEL` te `claude-haiku-4-5` për ta bërë edhe më lirë.

## Burimet
Lista është te `FEEDS` në `scripts/fetch_news.py`. Shto/hiq feed-e lirisht; një feed që
nuk punon kapërcehet dhe shënohet në log-un e Actions. Për burimet shqip vendos `"lang": "sq"`.

## Shënim
Scripti shkruan titull dhe përmbledhje **origjinale** (2–3 fjali) dhe lidh te burimi,
jo kopjon artikullin. Kjo e mban portalin në rregull me të drejtat e autorit.
