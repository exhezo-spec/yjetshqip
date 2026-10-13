#!/usr/bin/env python3
"""
Yjet Shqip — marrja automatike e lajmeve.

Lexon RSS-të e burimeve, gjen artikujt e rinj, i dërgon te Claude API që të
shkruajë një titull dhe një përmbledhje ORIGJINALE në shqip (jo përkthim fjalë
për fjalë), dhe i ruan te data/news.json. Çdo lajm mban linkun e burimit.

Përdorimi:
    ANTHROPIC_API_KEY=sk-... python scripts/fetch_news.py

Varësitë: pip install feedparser anthropic
"""

import json
import os
import re
import sys
import time
import hashlib
from datetime import datetime, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path

import feedparser

try:
    import anthropic
except ImportError:  # lejon testimin pa API
    anthropic = None

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "data" / "news.json"
MODEL = os.environ.get("NEWS_MODEL", "claude-sonnet-4-5")
MAX_NEW_PER_RUN = int(os.environ.get("NEWS_MAX_NEW", "30"))   # kontroll kostoje
KEEP_ITEMS = int(os.environ.get("NEWS_KEEP", "120"))           # sa lajme ruhen gjithsej
PER_FEED = 8                                                   # sa artikuj lexohen nga çdo feed

# ---------------------------------------------------------------------------
# Burimet. "lang": "sq" = tashmë në shqip (vetëm përmblidhet, nuk përkthehet).
# Nëse një feed nuk punon, kalohet dhe shënohet në log — ndrysho/shto lirisht.
# ---------------------------------------------------------------------------
FEEDS = [
    # Lajme nga vendi (shqip)
    {"cat": "vendi",   "name": "Balkanweb",   "lang": "sq", "url": "https://www.balkanweb.com/feed/"},
    {"cat": "vendi",   "name": "A2 CNN",      "lang": "sq", "url": "https://a2news.com/feed/"},
    {"cat": "vendi",   "name": "Top Channel", "lang": "sq", "url": "https://top-channel.tv/feed/"},
    # Bota
    {"cat": "bota",    "name": "BBC News",    "lang": "en", "url": "https://feeds.bbci.co.uk/news/world/rss.xml"},
    {"cat": "bota",    "name": "Reuters via Google News", "lang": "en",
     "url": "https://news.google.com/rss/search?q=site:reuters.com+world&hl=en-US&gl=US&ceid=US:en"},
    # Showbiz / VIP
    {"cat": "showbiz", "name": "Variety",     "lang": "en", "url": "https://variety.com/feed/"},
    {"cat": "showbiz", "name": "E! News",     "lang": "en", "url": "https://www.eonline.com/syndication/feeds/rssfeeds/topstories.xml"},
    {"cat": "showbiz", "name": "Billboard",   "lang": "en", "url": "https://www.billboard.com/feed/"},
    # Sport
    {"cat": "sport",   "name": "BBC Sport",   "lang": "en", "url": "https://feeds.bbci.co.uk/sport/football/rss.xml"},
    {"cat": "sport",   "name": "ESPN FC",     "lang": "en", "url": "https://www.espn.com/espn/rss/soccer/news"},
    # Teknologji
    {"cat": "tech",    "name": "The Verge",   "lang": "en", "url": "https://www.theverge.com/rss/index.xml"},
    {"cat": "tech",    "name": "TechCrunch",  "lang": "en", "url": "https://techcrunch.com/feed/"},
    # Jeta & Shëndeti
    {"cat": "jeta",    "name": "The Guardian Lifestyle", "lang": "en", "url": "https://www.theguardian.com/uk/lifeandstyle/rss"},
    {"cat": "jeta",    "name": "BBC Health",  "lang": "en", "url": "https://feeds.bbci.co.uk/news/health/rss.xml"},
]

CATEGORIES = {
    "vendi":   "Vendi",
    "bota":    "Bota",
    "showbiz": "Showbiz",
    "sport":   "Sport",
    "tech":    "Teknologji",
    "jeta":    "Jeta & Shëndeti",
}

SYSTEM_PROMPT = """Ti je redaktor lajmesh për një portal shqiptar. Merr një artikull (titull + përmbledhje nga burimi)
dhe shkruaj për lexuesin shqiptar:
- "title": titull i ri në shqip, maksimumi 80 karaktere, stil gazete, pa clickbait, pa pikëçuditje.
- "summary": përmbledhje ORIGJINALE në shqip, 2–3 fjali (40–70 fjalë), me faktet kryesore (kush, çfarë, ku, kur).
  Shkruaje me fjalët e tua, mos përkthe fjali për fjali. Shqipe standarde, e natyrshme, me ë dhe ç.
- "kicker": 1–3 fjalë etiketë (p.sh. "Champions League", "Hollywood", "AI").
Mos shto fakte që nuk janë në tekst. Mos shkruaj opinion. Kthe VETËM JSON me këto tri fusha."""


def log(msg):
    print(msg, file=sys.stderr, flush=True)


def clean_html(s):
    s = re.sub(r"<[^>]+>", " ", s or "")
    s = re.sub(r"&nbsp;|&#160;", " ", s)
    s = re.sub(r"&amp;", "&", s)
    return re.sub(r"\s+", " ", s).strip()


def item_id(link):
    return hashlib.sha1(link.encode("utf-8")).hexdigest()[:12]


def entry_date(e):
    for k in ("published", "updated"):
        v = e.get(k)
        if v:
            try:
                return parsedate_to_datetime(v).astimezone(timezone.utc)
            except Exception:
                pass
    for k in ("published_parsed", "updated_parsed"):
        v = e.get(k)
        if v:
            return datetime(*v[:6], tzinfo=timezone.utc)
    return datetime.now(timezone.utc)


def entry_image(e):
    for m in e.get("media_content", []) or []:
        if m.get("url") and ("image" in m.get("type", "") or m.get("medium") == "image"):
            return m["url"]
    for m in e.get("media_thumbnail", []) or []:
        if m.get("url"):
            return m["url"]
    for enc in e.get("enclosures", []) or []:
        if "image" in enc.get("type", ""):
            return enc.get("href")
    m = re.search(r'<img[^>]+src="([^"]+)"', e.get("summary", "") or "")
    return m.group(1) if m else None


def og_image(url):
    """Rezervë: merr og:image nga faqja e artikullit kur feed-i s'ka foto."""
    try:
        import urllib.request
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 (YjetShqipNews)"})
        with urllib.request.urlopen(req, timeout=8) as r:
            html = r.read(200_000).decode("utf-8", "ignore")
        m = re.search(r'<meta[^>]+property=["\']og:image["\'][^>]+content=["\']([^"\']+)', html, re.I) \
            or re.search(r'<meta[^>]+content=["\']([^"\']+)["\'][^>]+property=["\']og:image["\']', html, re.I) \
            or re.search(r'<meta[^>]+name=["\']twitter:image["\'][^>]+content=["\']([^"\']+)', html, re.I)
        return m.group(1) if m else None
    except Exception:
        return None


def fetch_feed(f):
    try:
        d = feedparser.parse(f["url"], request_headers={"User-Agent": "YjetShqipNews/1.0"})
    except Exception as ex:
        log(f"  ! {f['name']}: {ex}")
        return []
    if d.bozo and not d.entries:
        log(f"  ! {f['name']}: feed i palexueshëm ({getattr(d, 'bozo_exception', '')})")
        return []
    items = []
    for e in d.entries[:PER_FEED]:
        link = e.get("link")
        title = clean_html(e.get("title"))
        if not link or not title:
            continue
        items.append({
            "id": item_id(link),
            "cat": f["cat"],
            "source": f["name"],
            "lang": f["lang"],
            "url": link,
            "src_title": title,
            "src_summary": clean_html(e.get("summary") or e.get("description") or "")[:1200],
            "image": entry_image(e),
            "published": entry_date(e).isoformat(),
        })
    log(f"  ✓ {f['name']}: {len(items)} artikuj")
    return items


def rewrite_with_claude(client, item):
    user = (
        f"Kategoria: {CATEGORIES[item['cat']]}\n"
        f"Gjuha e burimit: {'shqip' if item['lang'] == 'sq' else 'anglisht'}\n"
        f"Burimi: {item['source']}\n\n"
        f"TITULLI: {item['src_title']}\n\n"
        f"TEKSTI: {item['src_summary'] or '(vetëm titulli)'}"
    )
    for attempt in range(3):
        try:
            msg = client.messages.create(
                model=MODEL,
                max_tokens=400,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user}],
            )
            text = "".join(b.text for b in msg.content if getattr(b, "type", "") == "text")
            m = re.search(r"\{.*\}", text, re.S)
            data = json.loads(m.group(0) if m else text)
            if data.get("title") and data.get("summary"):
                return {
                    "title": data["title"].strip(),
                    "summary": data["summary"].strip(),
                    "kicker": (data.get("kicker") or CATEGORIES[item["cat"]]).strip(),
                }
        except Exception as ex:
            log(f"    retry {attempt + 1}: {ex}")
            time.sleep(2 * (attempt + 1))
    return None


def main():
    existing = {"updated": None, "items": []}
    if OUT.exists():
        existing = json.loads(OUT.read_text(encoding="utf-8"))
    known = {it["id"]: it for it in existing.get("items", [])}

    log("Duke lexuar feed-et…")
    fresh = []
    for f in FEEDS:
        fresh.extend(fetch_feed(f))

    new_items = [it for it in fresh if it["id"] not in known]
    new_items.sort(key=lambda x: x["published"], reverse=True)
    new_items = new_items[:MAX_NEW_PER_RUN]
    log(f"{len(new_items)} lajme të reja për t'u shkruar në shqip")

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if new_items and (not api_key or anthropic is None):
        log("! Mungon ANTHROPIC_API_KEY ose paketa anthropic — lajmet e reja nuk u përpunuan.")
        new_items = []

    client = anthropic.Anthropic(api_key=api_key) if new_items else None
    written = []
    for it in new_items:
        if not it["image"]:
            it["image"] = og_image(it["url"])
        out = rewrite_with_claude(client, it)
        if not out:
            log(f"    x u kapërcye: {it['src_title'][:60]}")
            continue
        written.append({
            "id": it["id"], "cat": it["cat"], "kicker": out["kicker"],
            "title": out["title"], "summary": out["summary"],
            "source": it["source"], "url": it["url"], "image": it["image"],
            "published": it["published"],
        })
        log(f"    → {out['title']}")

    items = written + list(known.values())
    items.sort(key=lambda x: x["published"], reverse=True)
    items = items[:KEEP_ITEMS]

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(json.dumps({
        "updated": datetime.now(timezone.utc).isoformat(),
        "categories": CATEGORIES,
        "items": items,
    }, ensure_ascii=False, indent=2), encoding="utf-8")
    log(f"U ruajtën {len(items)} lajme te {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
