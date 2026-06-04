"""
Process the Khairasa Studio logo:
  1. Remove the cream/solid background (color-key with feathered edges) -> transparent PNG
  2. Auto-trim to content bounds
  3. Export a clean wordmark PNG + a square "K" monogram favicon
  4. Report the exact brand blue/red hex so they can be used in CSS
"""
from PIL import Image
import os

SRC = r"D:\khrd\khairasa-studio\assets\img\logo-source.jpg"
OUT_DIR = r"D:\khrd\khairasa-studio\assets\img"

img = Image.open(SRC).convert("RGB")
w, h = img.size
px = img.load()

# --- sample background from the 4 corners (median-ish via average) ---
corners = []
s = max(4, min(w, h) // 25)
for (cx, cy) in [(0, 0), (w - s, 0), (0, h - s), (w - s, h - s)]:
    rs = gs = bs = 0
    n = 0
    for x in range(cx, cx + s):
        for y in range(cy, cy + s):
            r, g, b = px[x, y]
            rs += r; gs += g; bs += b; n += 1
    corners.append((rs / n, gs / n, bs / n))
bg = tuple(sum(c[i] for c in corners) / len(corners) for i in range(3))
print(f"BG color: rgb({int(bg[0])},{int(bg[1])},{int(bg[2])})  #{int(bg[0]):02X}{int(bg[1]):02X}{int(bg[2]):02X}")

# --- build alpha by distance from bg, with feathering on the edges ---
T_LOW = 45.0    # <= this distance => fully transparent (background)
T_HIGH = 95.0   # >= this distance => fully opaque (ink)
rgba = Image.new("RGBA", (w, h))
out = rgba.load()

blue_r = blue_g = blue_b = blue_n = 0
red_r = red_g = red_b = red_n = 0

for y in range(h):
    for x in range(w):
        r, g, b = px[x, y]
        dr = r - bg[0]; dg = g - bg[1]; db = b - bg[2]
        dist = (dr * dr + dg * dg + db * db) ** 0.5
        if dist <= T_LOW:
            a = 0
        elif dist >= T_HIGH:
            a = 255
        else:
            a = int(255 * (dist - T_LOW) / (T_HIGH - T_LOW))
        out[x, y] = (r, g, b, a)
        # collect ink colour samples (only strong, opaque ink)
        if a > 200:
            if b > r + 25:       # bluish
                blue_r += r; blue_g += g; blue_b += b; blue_n += 1
            elif r > b + 25:     # reddish
                red_r += r; red_g += g; red_b += b; red_n += 1

if blue_n:
    bR, bG, bB = blue_r // blue_n, blue_g // blue_n, blue_b // blue_n
    print(f"BLUE ink: rgb({bR},{bG},{bB})  #{bR:02X}{bG:02X}{bB:02X}  (n={blue_n})")
if red_n:
    rR, rG, rB = red_r // red_n, red_g // red_n, red_b // red_n
    print(f"RED ink:  rgb({rR},{rG},{rB})  #{rR:02X}{rG:02X}{rB:02X}  (n={red_n})")

# --- auto-trim to content (alpha > 8) ---
bbox = rgba.getbbox()
if bbox:
    # getbbox uses any non-zero channel; refine with alpha channel only
    alpha = rgba.split()[3]
    bbox = alpha.getbbox()
pad = 24
l, t, r2, b2 = bbox
l = max(0, l - pad); t = max(0, t - pad)
r2 = min(w, r2 + pad); b2 = min(h, b2 + pad)
trimmed = rgba.crop((l, t, r2, b2))
trimmed.save(os.path.join(OUT_DIR, "logo.png"))
print(f"Saved logo.png  size={trimmed.size}")

# --- square "K" monogram favicon: crop the left glyph region ---
tw, th = trimmed.size
k_w = int(th * 0.95)
k = trimmed.crop((0, 0, min(k_w, tw), th))
# re-trim and center on a square transparent canvas
ka = k.split()[3].getbbox()
if ka:
    k = k.crop(ka)
kw, kh = k.size
side = int(max(kw, kh) * 1.25)
canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
canvas.paste(k, ((side - kw) // 2, (side - kh) // 2), k)
canvas.resize((512, 512)).save(os.path.join(OUT_DIR, "favicon-512.png"))
canvas.resize((180, 180)).save(os.path.join(OUT_DIR, "apple-touch-icon.png"))
canvas.resize((32, 32)).save(os.path.join(OUT_DIR, "favicon-32.png"))
print(f"Saved favicon set (K monogram), source side={side}")
print("DONE")
