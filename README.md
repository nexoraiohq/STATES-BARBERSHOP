States Barbershop & Lounge

Premium Grooming Website — Umoja, Nairobi, Kenya

A polished, responsive website for States Barbershop & Lounge, designed to showcase its services, team, space, gallery, reviews, and booking options.

Live Site
https://states-barbershop.vercel.app/


Table of Contents

Overview

Features

Tech Stack

Project Structure

Pages

Brand Guidelines

Colors

Typography

Font Weights

Responsive Breakpoints

Performance

Accessibility

SEO

Deployment

Contact

License

Overview

States Barbershop & Lounge is a static, multi-page website built with semantic HTML, SCSS/CSS, and vanilla JavaScript.

The website uses a polished dark-luxe visual direction to present:

Services

Barbers

Interior and space

Gallery

Client reviews

Location and opening hours

Booking and contact options

Features

Hero

Autoplay background video

Play/pause video control

Animated fixed hero

Content scrolling over the hero

Primary booking CTA

Services

Service cards

Hover interactions

Booking CTAs

Haircut

Beard

Hair + Beard

Shave

Team

Dedicated barber grid

Individual barber images

Professional team presentation

Space

Interior image showcase

Detail photography

Premium visual presentation

Experience

Four-step customer journey

Clear process presentation

Gallery

Filterable masonry-style gallery

All

Haircuts

Beard

Space

Team

Dedicated gallery page

Reviews

Google review presentation

Star ratings

Review statistics

Client testimonials

Visit

Location information

Opening hours

Contact information

Embedded Google Maps

Booking

WhatsApp booking CTA

Phone CTA

Pricing card

Social links

Navigation

Responsive header

Mobile navigation

Smooth slide-in mobile menu

Staggered mobile link animations

Header auto-hides on scroll down

Header reappears on scroll up

Footer

Responsive footer

Navigation links

Social links

Copyright information

Tech Stack

Layer

Technology

Markup

HTML5

Styling

CSS3

Source Styling

SCSS

Layout

CSS Grid + Flexbox

Scripts

Vanilla JavaScript (ES6+)

Icons

Font Awesome 7.3.1

Fonts

SF Pro Display + Nevera

Hosting

Vercel

Project Structure

STATES/
│
├── index.html
│
├── gallery.html
│
├── assets/
│   │
│   ├── favicon/
│   │   └── states-brand-favicon.png
│   │
│   ├── fonts/
│   │   │
│   │   ├── SFPRODISPLAYREGULAR.OTF
│   │   ├── SFPRODISPLAYMEDIUM.OTF
│   │   ├── SFPRODISPLAYSEMIBOLDITALIC.OTF
│   │   ├── SFPRODISPLAYBOLD.OTF
│   │   ├── SFPRODISPLAYHEAVYITALIC.OTF
│   │   ├── SFPRODISPLAYBLACKITALIC.OTF
│   │   ├── SFPRODISPLAYLIGHTITALIC.OTF
│   │   ├── SFPRODISPLAYTHINITALIC.OTF
│   │   ├── SFPRODISPLAYULTRALIGHTITALIC.OTF
│   │   │
│   │   └── nevera/
│   │       └── Nevera-Regular.otf
│   │
│   ├── images/
│   │   │
│   │   ├── barbers/
│   │   │   ├── Michael_Scott.png
│   │   │   ├── Schandler_Rigs.png
│   │   │   ├── Isabella_Rodriguez.png
│   │   │   └── James_Arthur.png
│   │   │
│   │   ├── states-craft-cinematic-image.jpg
│   │   ├── states_barbershop-interior-view-of the -shop.jpg
│   │   ├── states_barbershop-detailed-image-with-a-barber-cutting-hair-with-tools.jpg
│   │   └── states_barbershop-operating-tools.jpg
│   │
│   ├── logo/
│   │   └── states-brand-logo.png
│   │
│   └── videos/
│       └── states-hero.mp4
│
├── static/
│   │
│   ├── css/
│   │   │
│   │   ├── global/
│   │   │   └── global.css
│   │   │
│   │   ├── style.css
│   │   ├── style.scss
│   │   └── style.css.map
│   │
│   └── js/
│       │
│       ├── app.js
│       │
│       └── global/
│           └── global.js
│
└── README.md

Key Files

File

Purpose

index.html

Main homepage

gallery.html

Full gallery page

static/css/global/global.css

Global reset, header, footer, and mobile menu

static/css/style.css

Main compiled styles

static/css/style.scss

SCSS source

static/js/app.js

Hero animation, video controls, and section effects

static/js/global/global.js

Header scroll behavior and mobile menu logic

assets/videos/states-hero.mp4

Hero background video

assets/logo/states-brand-logo.png

Brand logo

Pages

index.html — Homepage

Section

ID

Description

Hero

—

Video background with headline and CTA

Brand Statement

—

Brand pillars: Craft, Experience, Personal

Services

#services

Four service cards

Process

—

Three-step process: Consult, Craft, Finish

Craft Cinematic

—

Full-width cinematic image with overlay

Team

—

Four barber profiles

Space

#space

Interior and detail images

Experience

#experience

Four-step experience journey

Gallery

#gallery

Six-image preview with View All link

Reviews

#reviews

Google rating, statistics, and five reviews

Visit

#visit

Location, hours, contact cards, and Google Maps

Contact

#contact

WhatsApp booking, phone, social links, and pricing

Footer

—

Navigation, social links, and copyright

gallery.html — Gallery

Full gallery with 12 images

Filter tabs:

All

Haircuts

Beard

Space

Team

CSS Grid layout

Consistent 10px grid gaps using grid-auto-rows

Back-to-home link

Brand Guidelines

Colors

Token

Value

Usage

--color-primary

#1C1B19

Dark backgrounds and text

--color-secondary

#F3EEE5

Light backgrounds and cream surfaces

--color-accent

#A8895E

Gold accent, CTAs, and eyebrows

--color-white

#FCFCFA

Off-white text on dark backgrounds

--color-text

#292724

Primary body text

--color-text-muted

#746F68

Secondary text

--color-border

#DED8CE

Borders and dividers

--color-surface

#FAF8F4

Card surfaces

Typography

Token

Font

Usage

--font-primary

SF Pro Display

Body text, headings, and UI

--font-secondary

Nevera

Decorative and italic accents

Font Weights

Token

Value

--fw-regular

400

--fw-medium

500

--fw-bold

600

--fw-semi-bold

700

Responsive Breakpoints

Breakpoint

Target

1200px

Large laptops

1024px

Tablets and small laptops

800px

Mobile navigation toggle

767px

Mobile devices

600px

Small mobile devices

480px

Small phones

375px

iPhone SE / compact screens

Performance

Preconnects to CDN domains

Lazy loading on below-the-fold images using loading="lazy"

Eager loading for the above-the-fold logo

Explicit width and height attributes to reduce layout shift

Self-hosted fonts with font-display: swap

Deferred JavaScript using the defer attribute

Minimal dependencies

No JavaScript framework

No build step required

Accessibility

Skip-to-content link

Semantic HTML structure

Keyboard-navigable interactive elements

ARIA attributes where required

Mobile menu focus management

Escape-key support for closing the mobile menu

WCAG AA color contrast

Alt text on images

role="contentinfo" on the footer

role="dialog" on the mobile menu

Semantic Elements

<header>
<main>
<footer>
<nav>
<section>
<article>

ARIA Support

aria-label
aria-hidden
aria-expanded
aria-controls
aria-selected

SEO

Unique title tag per page

Meta descriptions

Open Graph metadata

Twitter Card metadata

Geo metadata

Canonical URLs

JSON-LD structured data

Barbershop schema

Address information

Opening hours

Aggregate rating

Robots metadata

Semantic heading hierarchy

H1
└── H2
    └── H3

Deployment

The project is deployed on Vercel as a static website.

Deploy Your Own

Fork or clone the repository.

Push the project to GitHub, GitLab, or Bitbucket.

Import the project into Vercel.

Allow Vercel to detect the static project.

Deploy.

No build configuration is required.

Local Development

Open index.html directly in a browser, or run a local development server:

npx serve .

Contact

States Barbershop & Lounge

Location: Umoja, Nairobi, Kenya

Channel

Contact

Phone

+254 757 851 301

WhatsApp

Chat on WhatsApp

Instagram

@statesbarbershop

TikTok

@statesbarbershop

Facebook

States Barbershop

Google Maps

View on Google Maps

License

All rights reserved.

This project and its contents are owned by States Barbershop & Lounge.
