# Khairasa Studio

Landing site for **Khairasa Studio**, a creative and technology studio by Khairi and Zalza.
One studio, two crafts: **wedding content creation** and **website / digital system development**.

It is a plain static site (HTML, CSS, vanilla JS). No build step, no framework, no backend.
That makes it fast, cheap to host, and easy to edit.

---

## Preview it locally

Easiest: double-click `index.html`.

Or run a tiny local server (so paths and the manifest behave exactly like production):

```bash
# from the project folder
python -m http.server 8080
# then open http://localhost:8080
```

Demo pages live at:
- `demo/reservasi-resto/index.html` (restaurant reservation demo)
- `demo/petcare/index.html` (pet grooming booking demo)

---

## Project structure

```
khairasa-studio/
  index.html                      main landing page
  site.webmanifest, robots.txt, netlify.toml
  assets/
    css/styles.css                full design system
    js/main.js                    nav, scroll reveals, WhatsApp links, FAQ, etc.
    img/                          logo, founder photos, favicons, OG cover
      wedding/                    wedding mood + reel photos (stock, see notes)
      demo/resto, demo/pet        photos used by the demo pages
    portfolio/                    screenshots of real shipped work
  demo/
    reservasi-resto/index.html    live, self-contained demo
    petcare/index.html            live, self-contained demo
  tools/                          one-off Python helpers (logo cutout, OG image)
```

---

## Before you go live (checklist)

Everything works as-is, but these are the spots only you can finalize:

1. **Prices are starting estimates / placeholders.** Set your real numbers.
   - Wedding: in `index.html`, search `id="wedding-packages"`.
   - Websites: search `id="website-packages"`.
   - Demo service prices: inside each `demo/*/index.html`.

2. **WhatsApp number** is Zalza's `+62 851-2152-5015` (`wa.me/6285121525015`).
   If it ever changes, update `WA_BASE` in `assets/js/main.js` and the `href`s in `index.html`.

3. **Instagram and TikTok links** in the footer are placeholders (`#`).
   Add the real URLs (search `data-social` in `index.html`).

4. **Wedding reel photos** in `assets/img/wedding/` are royalty-free **stock used only as mood / illustration**.
   They are never labelled as your own client work, and the copy says real samples are sent on WhatsApp.
   Keep it that way for trust, and swap them for your own real reels as you shoot weddings.

5. **Demos are intentionally fictional** ("Senja" restaurant, "Petala" pet salon) and labelled as demos.
   They store nothing; a real build saves bookings to the client's dashboard. Leave the demo banners in place.

6. **Domain + meta URLs.** The head of `index.html` assumes `https://khairasa.studio/`.
   Once you have the real domain, update `canonical`, the Open Graph URLs, and `robots.txt`.

7. **WhatsApp notifications / payments are NOT promised** as turnkey, on purpose.
   The copy frames payments as "on request" and reservations as "saved to your dashboard".
   Update only once those integrations are actually ready.

---

## Deploy (pick one, all free tiers work)

This is a static site, so any static host works with zero config.

- **Netlify Drop (fastest, no setup)**: open app.netlify.com/drop and drag this whole folder in. You get a live public URL in seconds. Best for a quick preview before the custom domain.
- **Netlify (from Git)**: connect the GitHub repo. `netlify.toml` is included.
- **Vercel**: import the repo, framework preset = "Other", output dir = project root.
- **Cloudflare Pages**: connect the repo, build command empty, output dir = `/`.
- **GitHub Pages**: push to GitHub, then Settings to Pages to deploy from the `main` branch root.

---

## Put it on GitHub + GitHub Pages

A brand-new, separate repo is the right move (this is not part of any client project).
A local git repo is already initialized with commits. To publish and auto-deploy:

```bash
# 1. Create an EMPTY repo named "khairasa-studio" at https://github.com/new (no README, no license)
# 2. From this folder, run (uses your existing GitHub login):
git remote add origin https://github.com/khairihr/khairasa-studio.git
git branch -M main
git push -u origin main
```

Then enable Pages once: repo **Settings > Pages > Source: "GitHub Actions"**.
The included workflow (`.github/workflows/deploy.yml`) redeploys the site on every push.
Live URL: `https://khairihr.github.io/khairasa-studio/`

### When the custom domain (khairasa.studio) is ready
The base URL is currently the github.io address. Update it in: `index.html`, `about.html`,
`service.html` (canonical + og:url + og:image + twitter:image), plus `robots.txt` and `sitemap.xml`,
then set it under Settings > Pages > Custom domain.

---

## Image credits

- Founder photos and the Khairasa logo are owned by the studio.
- Portfolio screenshots are of real systems built by the team (Innovasia, ZiswafHub).
- Wedding, restaurant, and pet photos are from **Unsplash** (Unsplash License: free for commercial use,
  no attribution required, attribution appreciated). Replace with your own work over time.

---

Built by hand, with care.
