# Bacuña Architecture

Marketing website for **Bacuña Architecture** — a design-and-build studio.
Static site (HTML / CSS / vanilla JS), no build step.

## Pages
- `index.html` — landing (hero render + scroll-scrubbed exploded-house anatomy)
- `portfolio.html` — studio & case studies
- `services.html` — services + process
- `projects.html` — filterable project index + anatomy reel
- `contact.html` — enquiry form + studio info

## Structure
```
css/style.css      global design system
js/main.js         nav, footer, reveals, counters, cinematic + scrub interactions
assets/            rendered videos (exploded.mp4, rotating-explode.mp4)
```

## Local preview
Open `index.html` directly in a browser, or serve the folder:
```bash
npx serve .
```

## Deployment
Deployed as a static site on **Cloudflare Pages** — no build command, output directory is the repository root.
