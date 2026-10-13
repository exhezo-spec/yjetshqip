#!/usr/bin/env python3
"""
Faqe evergreen për SEO: përputhshmëria e shenjave (78 çifte) dhe numerologjia (12 numra).
Teksti shkruhet nga Claude dhe ruhet te data/evergreen.json, kështu që ekzekutimet e
mëvonshme vetëm rindërtojnë HTML-në (pa kosto) nëse nuk ka seksione që mungojnë.

    ANTHROPIC_API_KEY=... python scripts/build_evergreen.py
"""
import json, os, re, sys, time
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = "https://yjetshqip.site"
DATA = ROOT / "data" / "evergreen.json"
TPL = (ROOT / "templates" / "evergreen.html").read_text(encoding="utf-8")
MODEL = os.environ.get("NEWS_MODEL", "claude-sonnet-4-5")

SIGNS = [
    ("dashi", "Dashi", "♈", "Zjarr", "Marsi", "21 mars – 19 prill"),
    ("demi", "Demi", "♉", "Tokë", "Venusi", "20 prill – 20 maj"),
    ("binjaket", "Binjakët", "♊", "Ajër", "Mërkuri", "21 maj – 20 qershor"),
    ("gaforrja", "Gaforrja", "♋", "Ujë", "Hëna", "21 qershor – 22 korrik"),
    ("luani", "Luani", "♌", "Zjarr", "Dielli", "23 korrik – 22 gusht"),
    ("virgjeresha", "Virgjëresha", "♍", "Tokë", "Mërkuri", "23 gusht – 22 shtator"),
    ("peshorja", "Peshorja", "♎", "Ajër", "Venusi", "23 shtator – 22 tetor"),
    ("akrepi", "Akrepi", "♏", "Ujë", "Plutoni", "23 tetor – 21 nëntor"),
    ("shigjetari", "Shigjetari", "♐", "Zjarr", "Jupiteri", "22 nëntor – 21 dhjetor"),
    ("bricjapi", "Bricjapi", "♑", "Tokë", "Saturni", "22 dhjetor – 19 janar"),
    ("ujori", "Ujori", "♒", "Ajër", "Urani", "20 janar – 18 shkurt"),
    ("peshqit", "Peshqit", "♓", "Ujë", "Neptuni", "19 shkurt – 20 mars"),
]
NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 22, 33]

SYS = """Ti je autor për një faqe shqiptare horoskopi dhe numerologjie. Shkruan shqipe standarde, të ngrohtë,
konkrete, pa clickbait dhe pa premtime absolute ("do të", "gjithmonë"). Ton: argëtim dhe reflektim.
Kthe VETËM JSON me fushat e kërkuara. Çdo fushë teksti: 60–110 fjalë, një paragraf, pa titull brenda."""

PAIR_PROMPT = """Shkruaj faqen "Përputhshmëria {a} dhe {b}" (elementet: {ea} + {eb}).
Fushat: "intro" (si funksionon kjo lidhje në përgjithësi), "dashuria", "miqesia", "puna",
"sfidat" (ku lindin konfliktet), "keshilla" (3 këshilla praktike, si një paragraf),
"pikat" (numër i plotë 1–10, sa përputhen në dashuri), "fjalia" (një fjali përmbledhëse, max 20 fjalë)."""

NUM_PROMPT = """Shkruaj faqen për numrin {n} në numerologji (numri i rrugës së jetës).
Fushat: "intro" (çfarë përfaqëson numri), "personaliteti", "dashuria", "karriera",
"sfidat", "keshilla" (3 këshilla praktike si një paragraf), "fjalia" (një fjali përmbledhëse, max 20 fjalë),
"fjalet" (listë me 5 fjalë kyçe në shqip)."""


def log(m): print(m, file=sys.stderr, flush=True)
def esc(x): return str(x or "").replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace('"', "&quot;")


def ask(client, prompt):
    for i in range(3):
        try:
            r = client.messages.create(model=MODEL, max_tokens=1600, system=SYS, messages=[{"role": "user", "content": prompt}])
            t = "".join(b.text for b in r.content if getattr(b, "type", "") == "text")
            return json.loads(re.search(r"\{.*\}", t, re.S).group(0))
        except Exception as ex:
            log(f"  retry {i+1}: {ex}"); time.sleep(2 * (i + 1))
    return None


def page(path, title, desc, h1, eyebrow, lede, sections, aside, jsonld_extra=None):
    body = "".join(f'<section class="ev-sec"><h2>{esc(h)}</h2><p>{esc(t)}</p></section>' for h, t in sections if t)
    jsonld = {"@context": "https://schema.org", "@graph": [
        {"@type": "Article", "headline": title, "description": desc, "inLanguage": "sq",
         "mainEntityOfPage": SITE + path, "author": {"@type": "Organization", "name": "Yjet Shqip"},
         "publisher": {"@type": "Organization", "name": "Yjet Shqip", "url": SITE}},
        {"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": "Yjet Shqip", "item": SITE + "/"},
            {"@type": "ListItem", "position": 2, "name": eyebrow, "item": SITE + path.rsplit("/", 2)[0] + "/"},
            {"@type": "ListItem", "position": 3, "name": h1}]}] + ([jsonld_extra] if jsonld_extra else [])}
    html = TPL
    for k, v in {"title": esc(title), "description": esc(desc), "path": path, "h1": esc(h1), "eyebrow": esc(eyebrow),
                 "lede": esc(lede), "sections": body, "aside": aside, "jsonld": json.dumps(jsonld, ensure_ascii=False)}.items():
        html = html.replace("{{" + k + "}}", v)
    out = ROOT / path.strip("/")
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(html, encoding="utf-8")


def main():
    data = json.loads(DATA.read_text(encoding="utf-8")) if DATA.exists() else {"pairs": {}, "numbers": {}}
    pairs = [(SIGNS[i], SIGNS[j]) for i in range(12) for j in range(i, 12)]
    missing_pairs = [(a, b) for a, b in pairs if f"{a[0]}-{b[0]}" not in data["pairs"]]
    missing_nums = [n for n in NUMBERS if str(n) not in data["numbers"]]
    if missing_pairs or missing_nums:
        key = os.environ.get("ANTHROPIC_API_KEY")
        if not key:
            log("! Mungon ANTHROPIC_API_KEY; ndërtoj vetëm faqet që kanë tekst."); missing_pairs, missing_nums = [], []
        else:
            import anthropic
            client = anthropic.Anthropic(api_key=key)
            for a, b in missing_pairs:
                r = ask(client, PAIR_PROMPT.format(a=a[1], b=b[1], ea=a[3], eb=b[3]))
                if r: data["pairs"][f"{a[0]}-{b[0]}"] = r; log(f"  ✓ {a[1]} + {b[1]}")
                DATA.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")
            for n in missing_nums:
                r = ask(client, NUM_PROMPT.format(n=n))
                if r: data["numbers"][str(n)] = r; log(f"  ✓ numri {n}")
                DATA.write_text(json.dumps(data, ensure_ascii=False, indent=1), encoding="utf-8")

    # ---- faqet e përputhshmërisë ----
    urls = []
    for a, b in pairs:
        d = data["pairs"].get(f"{a[0]}-{b[0]}")
        if not d: continue
        path = f"/perputhshmeria/{a[0]}-{b[0]}/index.html"
        title = f"Përputhshmëria {a[1]} dhe {b[1]} — Dashuri, Miqësi, Punë"
        desc = f"{d.get('fjalia','')} Sa përputhen {a[1]} ({a[3]}) dhe {b[1]} ({b[3]}) në dashuri, miqësi dhe punë. Pikët: {d.get('pikat','-')}/10."
        others = "".join(f'<li><a href="/perputhshmeria/{(a[0] if a[0]<=s[0] else s[0])}-{(s[0] if a[0]<=s[0] else a[0])}/">{a[1]} dhe {s[1]}</a></li>' for s in SIGNS if s[0] != b[0])
        aside = (f'<div class="ev-score"><span class="count">Pikët në dashuri</span><strong>{esc(d.get("pikat","-"))}<small>/10</small></strong></div>'
                 f'<div class="ev-meta"><p><b>{a[2]} {a[1]}</b> · {a[3]} · {a[4]} · {a[5]}</p><p><b>{b[2]} {b[1]}</b> · {b[3]} · {b[4]} · {b[5]}</p></div>'
                 f'<span class="count">{a[1]} me shenjat e tjera</span><ul class="ev-links">{others}</ul>'
                 f'<p><a class="link" href="/horoskopi/{a[0]}/">Horoskopi i {a[1]} sot →</a></p>')
        secs = [("Si funksionon kjo lidhje", d.get("intro")), ("Në dashuri", d.get("dashuria")), ("Në miqësi", d.get("miqesia")),
                ("Në punë", d.get("puna")), ("Sfidat", d.get("sfidat")), ("Këshilla", d.get("keshilla"))]
        page(path, title, desc[:158], f"{a[1]} dhe {b[1]}", "Përputhshmëria e shenjave", d.get("fjalia", ""), secs, aside)
        urls.append(path.replace("index.html", ""))

    # index i përputhshmërisë
    grid = "".join(f'<li><a href="/perputhshmeria/{a[0]}-{b[0]}/">{a[2]} {a[1]} + {b[2]} {b[1]}</a></li>'
                   for a, b in pairs if f"{a[0]}-{b[0]}" in data["pairs"])
    page("/perputhshmeria/index.html", "Përputhshmëria e shenjave të zodiakut — 78 çifte",
         "Sa përputhen dy shenja të zodiakut në dashuri, miqësi dhe punë. Të 78 kombinimet, në shqip, falas.",
         "Përputhshmëria e shenjave", "Horoskopi", "Zgjidh çiftin e shenjave dhe lexo si funksionon lidhja në dashuri, miqësi dhe punë.",
         [], f'<span class="count">78 kombinime</span><ul class="ev-grid">{grid}</ul>')
    urls.append("/perputhshmeria/")

    # ---- numerologjia ----
    for n in NUMBERS:
        d = data["numbers"].get(str(n))
        if not d: continue
        path = f"/numerologjia/numri-{n}/index.html"
        title = f"Numri {n} në numerologji — kuptimi, personaliteti, dashuria"
        fjalet = ", ".join(d.get("fjalet", [])[:5]) if isinstance(d.get("fjalet"), list) else ""
        desc = f"{d.get('fjalia','')} Çfarë do të thotë numri {n} i rrugës së jetës: personaliteti, dashuria, karriera dhe sfidat."
        others = "".join(f'<li><a href="/numerologjia/numri-{m}/">Numri {m}</a></li>' for m in NUMBERS if m != n)
        aside = (f'<div class="ev-score"><span class="count">Numri i rrugës së jetës</span><strong>{n}</strong></div>'
                 + (f'<p class="ev-tags">{esc(fjalet)}</p>' if fjalet else "")
                 + f'<span class="count">Numrat e tjerë</span><ul class="ev-links">{others}</ul>'
                 f'<p><a class="link" href="/mjete.html">Llogarit numrin tënd →</a></p>')
        secs = [("Çfarë përfaqëson", d.get("intro")), ("Personaliteti", d.get("personaliteti")), ("Në dashuri", d.get("dashuria")),
                ("Karriera", d.get("karriera")), ("Sfidat", d.get("sfidat")), ("Këshilla", d.get("keshilla"))]
        page(path, title, desc[:158], f"Numri {n}", "Numerologjia", d.get("fjalia", ""), secs, aside)
        urls.append(path.replace("index.html", ""))
    grid = "".join(f'<li><a href="/numerologjia/numri-{n}/">Numri {n}</a></li>' for n in NUMBERS if str(n) in data["numbers"])
    page("/numerologjia/index.html", "Numerologjia në shqip — kuptimi i numrave 1–9, 11, 22, 33",
         "Kuptimi i çdo numri të rrugës së jetës në numerologji: personaliteti, dashuria, karriera. Në shqip, falas.",
         "Numerologjia", "Mjetet", "Mblidh shifrat e datës së lindjes deri në një shifër (ose 11, 22, 33) dhe lexo kuptimin.",
         [], f'<span class="count">12 numra</span><ul class="ev-grid">{grid}</ul>')
    urls.append("/numerologjia/")

    (ROOT / "sitemap-evergreen.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        + "\n".join(f"<url><loc>{SITE}{u}</loc><changefreq>monthly</changefreq></url>" for u in urls) + "\n</urlset>\n", encoding="utf-8")
    log(f"U ndërtuan {len(urls)} faqe evergreen")


if __name__ == "__main__":
    main()
