# States Barbershop & Lounge

A premium, responsive website for States Barbershop & Lounge — a professional grooming destination in Umoja, Nairobi, Kenya.

**Live Site:** [https://states-barbershop.vercel.app/](https://states-barbershop.vercel.app/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Pages](#pages)
- [Brand Guidelines](#brand-guidelines)
- [Responsive Breakpoints](#responsive-breakpoints)
- [Performance](#performance)
- [Accessibility](#accessibility)
- [SEO](#seo)
- [Deployment](#deployment)
- [License](#license)

---

## Overview

States Barbershop & Lounge is a static, multi-page website built with semantic HTML, SCSS/CSS, and vanilla JavaScript. It showcases the barbershop's services, team, space, gallery, and client reviews with a polished, dark-luxe aesthetic.

---

## Features

- **Hero section** with autoplay background video and play/pause control
- **Animated fixed hero** that stays in place while content scrolls over it
- **Service cards** with hover effects and booking CTAs
- **Meet the Team** barber grid
- **Space showcase** with image grid
- **Experience section** with 4-step process
- **Gallery** with filterable masonry grid (All / Haircuts / Beard / Space / Team)
- **Client reviews** from Google Maps with star ratings and stats
- **Visit section** with location, hours, contact info, and embedded Google Map
- **Booking section** with WhatsApp and phone CTAs, plus pricing card
- **Full responsive footer** with navigation, social links, and copyright
- **Mobile menu** with smooth slide-in animation and staggered link reveals
- **Header** that auto-hides on scroll down and reappears on scroll up

---

## Tech Stack

| **LayerTechnology** |                                                    |
| ------------------- | -------------------------------------------------- |
| Markup              | HTML5 (semantic)                                   |
| Styling             | CSS3 (custom properties, grid, flexbox)            |
| Source CSS          | SCSS (compiled to CSS)                             |
| Scripts             | Vanilla JavaScript (ES6+)                          |
| Icons               | Font Awesome 7.3.1 (CDN)                           |
| Fonts               | SF Pro Display (self-hosted), Nevera (self-hosted) |
| Hosting             | Vercel                                             |

---

## Project Structure

```text
STATES/
├── index.html                  # Main homepage
├── gallery.html                # Full gallery page
├── assets/
│   ├── favicon/
│   │   └── states-brand-favicon.png
│   ├── fonts/
│   │   ├── SFPRODISPLAYREGULAR.OTF
│   │   ├── SFPRODISPLAYMEDIUM.OTF
│   │   ├── SFPRODISPLAYSEMIBOLDITALIC.OTF
│   │   ├── SFPRODISPLAYBOLD.OTF
│   │   ├── SFPRODISPLAYHEAVYITALIC.OTF
│   │   ├── SFPRODISPLAYBLACKITALIC.OTF
│   │   ├── SFPRODISPLAYLIGHTITALIC.OTF
│   │   ├── SFPRODISPLAYTHINITALIC.OTF
│   │   ├── SFPRODISPLAYULTRALIGHTITALIC.OTF
│   │   └── nevera/
│   │       └── Nevera-Regular.otf
│   ├── images/
│   │   ├── barbers/
│   │   │   ├── Michael_Scott.png
│   │   │   ├── Schandler_Rigs.png
│   │   │   ├── Isabella_Rodriguez.png
│   │   │   └── James_Arthur.png
│   │   ├── states-craft-cinematic-image.jpg
│   │   ├── states_barbershop-interior-view-of the -shop.jpg
│   │   ├── states_barbershop-detailed-image-with-a-barber-cutting-hair-with-tools.jpg
│   │   └── states_barbershop-operating-tools.jpg
│   ├── logo/
│   │   └── states-brand-logo.png
│   └── videos/
│       └── states-hero.mp4
├── static/
│   ├── css/
│   │   ├── global/
│   │   │   └── global.css          # Reset, header, footer, mobile menu
│   │   ├── style.css               # Main page styles
│   │   ├── style.scss              # SCSS source
│   │   └── style.css.map           # Source map
│   └── js/
│       ├── app.js                  # Hero animation, video control, section blends
│       └── global/
│           └── global.js           # Header scroll, mobile menu logic
└── README.md
```

---

## Pages

### index.html (Homepage)

| **SectionIDDescription** |                   |                                                     |
| ------------------------ | ----------------- | --------------------------------------------------- |
| Hero                     | —                 | Video background with headline and CTA              |
| Brand Statement          | —                 | Brand pillars: Craft, Experience, Personal          |
| Services                 | `#services`   | 4 service cards (Haircut, Beard, Hair+Beard, Shave) |
| Process                  | —                 | 3-step process (Consult, Craft, Finish)             |
| Craft Cinematic          | —                 | Full-width cinematic image with overlay             |
| Team                     | —                 | 4 barber profiles with images                       |
| Space                    | `#space`      | Interior and detail images                          |
| Experience               | `#experience` | 4-step experience journey                           |
| Gallery                  | `#gallery`    | 6-image grid with "View All" link                   |
| Reviews                  | `#reviews`    | Google rating, stats, 5 client reviews              |
| Visit                    | `#visit`      | Location, hours, contact cards + Google Maps        |
| Contact                  | `#contact`    | WhatsApp booking, phone, social links, pricing      |
| Footer                   | —                 | Navigation, social links, copyright                 |

### gallery.html

- Full gallery with 12 images
- Filter tabs: All / Haircuts / Beard / Space / Team
- CSS Grid with `grid-auto-rows` for consistent 10px gaps
- Back-to-home link

---

## Brand Guidelines

### Colors

| **TokenHexUsage**        |               |                             |
| ------------------------ | ------------- | --------------------------- |
| `--color-primary`    | `#1C1B19` | Dark backgrounds, text      |
| `--color-secondary`  | `#F3EEE5` | Light backgrounds, cream    |
| `--color-accent`     | `#A8895E` | Gold accent, CTAs, eyebrows |
| `--color-white`      | `#FCFCFA` | Off-white text on dark      |
| `--color-text`       | `#292724` | Body text                   |
| `--color-text-muted` | `#746F68` | Secondary text              |
| `--color-border`     | `#DED8CE` | Borders, dividers           |
| `--color-surface`    | `#FAF8F4` | Card surfaces               |

### Fonts

| **TokenFontUsage**     |                |                             |
| ---------------------- | -------------- | --------------------------- |
| `--font-primary`   | SF Pro Display | All body text, headings, UI |
| `--font-secondary` | Nevera         | Decorative / italic accents |

### Font Weights

| **TokenValue**       |     |
| -------------------- | --- |
| `--fw-regular`   | 400 |
| `--fw-medium`    | 500 |
| `--fw-bold`      | 600 |
| `--fw-semi-bold` | 700 |

---

## Responsive Breakpoints

| **BreakpointTarget** |                          |
| -------------------- | ------------------------ |
| 1200px               | Large laptops            |
| 1024px               | Tablets / small laptops  |
| 800px                | Mobile navigation toggle |
| 767px                | Mobile devices           |
| 600px                | Small mobile             |
| 480px                | Small phones             |
| 375px                | iPhone SE / compact      |

---

## Performance

- **Preconnect** to CDN domains (cdnjs.cloudflare.com, i.pinimg.com)
- **Lazy loading** on all below-fold images (`loading="lazy"`)
- **Eager loading** on above-fold logo
- **Explicit **`width`**/**`height` on all images to prevent CLS
- **Self-hosted fonts** with `font-display: swap`
- **Deferred scripts** (`defer` attribute on all `<script>` tags)
- **Minimal dependencies** — no frameworks, no build step required

---

## Accessibility

- **Skip-to-content link** (visible on keyboard focus)
- **Semantic HTML** — `<header>`, `<main>`, `<footer>`, `<nav>`, `<section>`, `<article>`
- **ARIA attributes** — `aria-label`, `aria-hidden`, `aria-expanded`, `aria-controls`, `aria-selected`
- **Focus management** — mobile menu focus trap, Escape key to close
- **Color contrast** — text meets WCAG AA on all backgrounds
- **Alt text** on all images
- **Keyboard navigable** — all interactive elements are focusable
- `role="contentinfo"` on footer, `role="dialog"` on mobile menu

---

## SEO

- **Title tag** and **meta description** per page
- **Open Graph** tags (og\:title, og\:description, og\:image, og\:url, og\:site_name, og\:locale)
- **Twitter Card** meta tags
- **Geo meta tags** (geo.region, geo.placename, geo.position, ICBM)
- **Canonical URLs**
- **JSON-LD structured data** (Barbershop schema with address, hours, aggregate rating)
- **Robots meta** (index, follow)
- **Semantic heading hierarchy** (h1 → h2 → h3)

---

## Deployment

This project is deployed on **Vercel** as a static site.

### Deploy your own

1. Fork or clone this repository
2. Push to a Git provider (GitHub, GitLab, Bitbucket)
3. Import the project on [vercel.com](https://vercel.com/)
4. Vercel auto-detects the static site — no build configuration needed
5. Deploy

```bash
# Local development
# Simply open index.html in a browser, or use a local server:
npx serve .
```

---

## Contact

**States Barbershop & Lounge** Umoja, Nairobi, Kenya

- Phone: [+254 757 851 301](tel:+254757851301)
- WhatsApp: [Chat on WhatsApp](https://wa.me/254757851301)
- Instagram: [@statesbarbershop](https://www.instagram.com/statesbarbershop)
- TikTok: [@statesbarbershop](https://www.tiktok.com/@statesbarbershop)
- Facebook: [States Barbershop](https://www.facebook.com/statesbarbershop)
- Google Maps: [View on Google Maps](https://www.google.com/maps/place/States+Barbershop/@-1.1383016,36.7554537,17z)

---

## License

All rights reserved. This project and its contents are owned by States Barbershop & Lounge.
