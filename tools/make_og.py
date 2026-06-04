"""Generate a 1200x630 Open Graph share image from the logo + tagline."""
from PIL import Image, ImageDraw, ImageFont
import os

OUT = r"D:\khrd\khairasa-studio\assets\img\og-cover.png"
LOGO = r"D:\khrd\khairasa-studio\assets\img\logo.png"

W, H = 1200, 630
bg = (245, 238, 225)
blue = (49, 88, 167)
muted = (91, 97, 114)

img = Image.new("RGB", (W, H), bg)
draw = ImageDraw.Draw(img)

# soft brand glows
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([-260, -320, 360, 240], fill=(49, 88, 167, 16))
gd.ellipse([900, 420, 1500, 960], fill=(188, 58, 56, 14))
img.paste(Image.alpha_composite(img.convert("RGBA"), glow).convert("RGB"), (0, 0))
draw = ImageDraw.Draw(img)

# logo
logo = Image.open(LOGO).convert("RGBA")
lw = 540
lh = int(logo.height * lw / logo.width)
logo = logo.resize((lw, lh))
img.paste(logo, ((W - lw) // 2, 96), logo)

def font(paths, size):
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except Exception:
            continue
    return ImageFont.load_default()

serif = font([r"C:\Windows\Fonts\georgiai.ttf", r"C:\Windows\Fonts\georgia.ttf"], 46)
sans = font([r"C:\Windows\Fonts\segoeui.ttf", r"C:\Windows\Fonts\arial.ttf"], 30)

def center(text, fnt, y, fill):
    w = draw.textlength(text, font=fnt)
    draw.text(((W - w) / 2, y), text, font=fnt, fill=fill)

center("One studio, two crafts.", serif, 392, blue)
center("Wedding content   .   Websites & systems that work", sans, 470, muted)

img.save(OUT)
print("Saved", OUT, img.size)
