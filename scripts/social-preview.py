"""Generate the site's shared social card (requires Pillow)."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import math

root = Path(__file__).resolve().parent.parent
im = Image.new('RGB', (1200, 630), '#0d081b')
d = ImageDraw.Draw(im)
for r in range(440, 0, -2):
    t = 1 - r / 440
    d.ellipse((840-r, 315-r, 840+r, 315+r), fill=(int(13+20*t), int(8+8*t), int(27+28*t)))
for r in [125, 180, 235]:
    d.ellipse((890-r, 315-r, 890+r, 315+r), outline='#665037', width=2)
for i in range(12):
    a = i * math.pi / 6
    x, y = 890 + 235 * math.cos(a), 315 + 235 * math.sin(a)
    d.ellipse((x-5, y-5, x+5, y+5), fill='#e8c97a')
d.ellipse((850, 275, 930, 355), fill='#e8c97a')
def font(n, bold=False):
    return ImageFont.truetype('C:/Windows/Fonts/segoeui' + ('b' if bold else '') + '.ttf', n)
d.text((72, 68), 'YJET SHQIP', font=font(25, True), fill='#e8c97a')
d.text((68, 194), 'Horoskopi yt', font=font(68, True), fill='#f5efff')
d.text((68, 274), 'për sot.', font=font(68, True), fill='#e8c97a')
d.text((72, 390), '12 shenja · Në shqip · Falas', font=font(27), fill='#d1c4e9')
d.text((72, 540), 'yjetshqip.site', font=font(24), fill='#d1c4e9')
im.save(root / 'assets/social-preview.png', optimize=True)
