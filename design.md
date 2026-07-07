# Sri Thirumala — Hero Landing Page Redesign Specification

## Goal

Transform the current landing page into a premium cinematic experience using the supplied 4K book video as the hero centerpiece.

The design should feel similar to Apple's product pages, Stripe, Linear, Framer, and premium publishing websites.

The hero content must never compete with the book video.

---

# Hero Layout

Viewport Height

100vh

The hero is divided into three visual zones.

────────────────────────────────────────

Top 15%

Navigation

────────────────────────────────────────

Middle 45%

Hero Content

────────────────────────────────────────

Bottom 40%

Video

────────────────────────────────────────

The book video remains visually dominant.

---

# Video Placement

DO NOT use the video as a stretched background.

Instead

position: absolute

bottom:0

left:50%

transform:translateX(-50%)

object-fit:contain

width:72vw

max-width:1250px

height:auto

The bottom edge of the video should extend slightly below the viewport to create depth.

---

# Overlay

Apply a soft overlay above the video.

background:

linear-gradient(

180deg,

rgba(255,255,255,.55),

rgba(255,255,255,.12)

)

This keeps the sky readable while preserving the cinematic look.

---

# Navigation

Transparent.

No background.

No border.

Maximum Width

1400px

Padding

32px

Logo Left

Menu Center

Icons Right

Items

Home

Categories

Best Sellers

New Arrivals

Stationery

Offers

Search

Cart

Profile

On scroll

Glass Morphism

backdrop-filter: blur(16px)

background:

rgba(255,255,255,.65)

---

# Hero Badge

Centered

Small capsule

PREMIUM BOOKS & STATIONERY

Font

Inter Medium

13px

Letter Spacing

0.18em

Border

1px solid rgba(15,42,90,.15)

Background

rgba(255,255,255,.75)

---

# Hero Heading

Centered

Font

Cormorant Garamond

Weight

600

Desktop

88px

Tablet

64px

Mobile

42px

Color

#102A56

Line Height

0.95

Text

Sri Thirumala

---

# Subtitle

BOOK SELLER & STATIONERY

Font

Inter

15px

Letter spacing

0.35em

Uppercase

Gold Accent

#B78939

Thin decorative lines left and right

---

# Description

Maximum Width

620px

Centered

Font

Inter

21px

Weight

400

Color

#505A68

Text

Discover thousands of books, stationery essentials and study materials—all in one place.

---

# Buttons

Centered

Gap

18px

Primary

Height

58px

Background

#102A56

Hover

#163E7A

Text

Explore Store →

Secondary

Height

58px

White

Border

1px solid rgba(0,0,0,.08)

Text

Sign In

Shadow

0 20px 60px rgba(16,42,86,.12)

---

# Left Floating Features

Position

Absolute

Left

5%

Vertical Center

Items

Premium Quality

Trusted by Thousands

Fast Delivery

5000+ Books

Each item

Icon

18px

Text

15px

Opacity

0.85

Glass Background

rgba(255,255,255,.42)

Border Radius

16px

Padding

14px 18px

---

# Right Floating CTA

Sticky

Explore Store

Sign In

Glass cards

Width

210px

Border Radius

20px

Blur

16px

Hidden on Mobile

---

# Scroll Indicator

Bottom Center

SCROLL TO EXPLORE

Animated Mouse Icon

Small bounce animation

Opacity

0.65

---

# Background

Solid

#F8F6F3

Add

Very subtle radial gradients

Top Left

rgba(255,233,195,.35)

Top Right

rgba(233,240,255,.22)

Noise texture

Opacity

2%

---

# Shadows

Soft only

Avoid large blurred shadows

Buttons

0 20px 50px rgba(16,42,86,.10)

Cards

0 12px 30px rgba(0,0,0,.06)

---

# Animations

Navbar

Fade

0.4s

Badge

Fade Up

0.6s

Heading

Fade Up

0.8s

Subtitle

Fade Up

0.9s

Description

Fade Up

1.0s

Buttons

Scale

1.1s

Video

Opacity

0→1

Duration

1.2s

Floating cards

Slide

Left

Right

Scroll Indicator

Infinite

TranslateY

6px

---

# Performance

Use

video.mp4

video.webm

Poster Image

poster.webp

Preload

metadata

Autoplay

Muted

Loop

Playsinline

Intersection Observer

Pause when hero leaves viewport

---

# Responsive

Desktop

Full Layout

Tablet

Hide floating right CTA

Reduce heading

64px

Mobile

Video width

100%

Heading

42px

Buttons

Stack vertically

Hide left floating feature cards

Navigation collapses into hamburger

---

# Design Rules

Never place text over the book.

Never cover the page edges.

Never stretch the video.

Maintain generous whitespace.

Keep all hero text within the upper 50% of the viewport.

Use premium typography.

Avoid colorful gradients.

Use subtle glassmorphism only.

The overall impression should be calm, elegant, and editorial rather than flashy.
