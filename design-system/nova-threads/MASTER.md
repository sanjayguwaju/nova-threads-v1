# Nova Threads — Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** Nova Threads
**Generated:** 2026-04-19 08:30:00
**Category:** Editorial Luxury Fashion E-commerce

---

## Brand Overview

**Aesthetic direction:** Editorial luxury fashion — clean, confident, modern minimalism. Think high-end fashion magazine meets Scandinavian restraint. Every pixel earns its place. Negative space is an asset, not emptiness.

**Tone:** Authoritative, refined, aspirational — but never loud. The brand whispers, it does not shout.

---

## Global Rules

### Color Palette

All colors are defined as CSS custom properties. Always use these variables — never hard-coded hex.

```css
:root {
  /* Core Neutrals */
  --nt-black:       #0A0A0A;   /* Primary text, logo, bold CTAs */
  --nt-off-black:   #1A1A1A;   /* Nav background, dark sections */
  --nt-charcoal:    #2C2C2C;   /* Secondary dark elements */
  --nt-mid-gray:    #888780;   /* Muted labels, secondary text */
  --nt-light-gray:  #D3D1C7;   /* Borders, dividers, placeholders */
  --nt-off-white:   #F1EFE8;   /* Page background, light surfaces */
  --nt-white:       #FFFFFF;   /* Card backgrounds, pure surfaces */

  /* Accent Colors */
  --nt-sale-red:    #D63B2F;   /* Sale badges, urgent CTAs only */
  --nt-badge-blue:  #1A73E8;   /* "New" badge highlight */
  --nt-badge-hot:   #E07B00;   /* "Hot" badge highlight */

  /* Semantic */
  --nt-text-primary:   var(--nt-black);
  --nt-text-secondary: var(--nt-mid-gray);
  --nt-text-inverse:   var(--nt-white);
  --nt-border:         var(--nt-light-gray);
  --nt-bg-page:        var(--nt-off-white);
  --nt-bg-card:        var(--nt-white);
}
```

### Color Usage Rules
- **Black on white** is the dominant pairing. No gradients, no color washes on body content.
- **Sale red** (`--nt-sale-red`) is reserved exclusively for sale/clearance labels. Never use for general UI.
- **Badge colors** appear only in small pill shapes (≤ 20px height) above nav links or on product cards. Never on body text.
- **Off-white** (`--nt-off-white`) is the page background, not pure white. Cards and modals lift to `--nt-white`.
- Gray range is used for all secondary/tertiary information — never colorize secondary content.

---

## Typography

### Font Stack

```css
:root {
  --font-display:  'Neue Haas Grotesk Display', 'Helvetica Neue', 'Arial', sans-serif;
  --font-body:     'Neue Haas Grotesk Text', 'Helvetica Neue', 'Arial', sans-serif;
  /* Fallback if Neue Haas unavailable: */
  --font-display:  'Futura PT', 'Trebuchet MS', sans-serif;
  --font-body:     'Futura PT', 'Trebuchet MS', sans-serif;
}
```

> **Recommended Google Fonts fallback:** Use `DM Sans` (display) + `DM Sans` (body) — closest open-source match to the clean grotesque style.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet">
```

```css
:root {
  --font-display: 'DM Sans', sans-serif;
  --font-body:    'DM Sans', sans-serif;
}
```

### Type Scale

| Token | Size | Weight | Line-height | Usage |
|---|---|---|---|---|
| `--type-hero` | 48–72px | 700 | 1.0 | Hero banners ("TIMELESS STYLE FOR MODERN LIVES") |
| `--type-heading-xl` | 32px | 700 | 1.1 | Section headings (COLLECTIONS) |
| `--type-heading-lg` | 22px | 700 | 1.2 | Product names, collection titles |
| `--type-heading-md` | 16px | 600 | 1.3 | Sub-labels, card titles (CLASSIC · COATS) |
| `--type-label` | 11px | 600 | 1.4 | Product count labels (7 PRODUCTS) — always UPPERCASE |
| `--type-body` | 14px | 400 | 1.6 | Collection descriptions, footer copy |
| `--type-small` | 12px | 400 | 1.5 | Caption text, fine print |
| `--type-nav` | 13px | 500 | 1.0 | Navigation links |
| `--type-cta` | 13px | 600 | 1.0 | Button labels — always UPPERCASE, letter-spacing: 0.08em |

```css
:root {
  --type-hero:       clamp(40px, 6vw, 72px);
  --type-heading-xl: 32px;
  --type-heading-lg: 22px;
  --type-heading-md: 16px;
  --type-label:      11px;
  --type-body:       14px;
  --type-small:      12px;
  --type-nav:        13px;
  --type-cta:        13px;
}
```

### Typography Rules
- **Collection/product titles** are BOLD + ALL CAPS with `letter-spacing: 0.05em` 
- **"# PRODUCTS" labels** are ALL CAPS, mid-gray (`--nt-text-secondary`), small size
- **Body descriptions** are normal case, regular weight, mid-gray, centered under titles
- **Button text** is ALL CAPS with `letter-spacing: 0.08em` 
- **No italic** in UI elements. Italics appear only in editorial quotes ("LIGHT LAYERS FOR EVERYDAY")
- **Hero text** overlaid on images uses `--nt-white` with no text-shadow — photography provides contrast

---

## Spacing System

All spacing is based on a 4px base unit.

```css
:root {
  --space-1:  4px;
  --space-2:  8px;
  --space-3:  12px;
  --space-4:  16px;
  --space-5:  20px;
  --space-6:  24px;
  --space-8:  32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;

  /* Section padding */
  --section-padding-y: var(--space-16);
  --section-padding-x: var(--space-8);

  /* Content max-width */
  --content-max-width: 1200px;
  --content-padding:   0 var(--space-8);
}
```

---

## Layout Grid

### Product / Collection Grid
```css
.collection-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  max-width: var(--content-max-width);
  margin: 0 auto;
  padding: var(--content-padding);
}

@media (max-width: 900px) {
  .collection-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 600px) {
  .collection-grid { grid-template-columns: 1fr; }
}
```

---

## Component Specs

### Navigation Bar

```css
.nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--nt-white);
  border-bottom: 0.5px solid var(--nt-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-8);
  height: 56px;
}

.nav-logo {
  font-size: 24px;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: var(--nt-black);
  text-transform: uppercase;
}

.nav-links {
  display: flex;
  gap: var(--space-6);
  list-style: none;
  font-size: var(--type-nav);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.nav-links a { color: var(--nt-black); text-decoration: none; }
.nav-links a:hover { opacity: 0.6; }
```

### Buttons

```css
/* Primary — black fill (main CTA: SHOP NOW) */
.btn--primary {
  display: inline-block;
  background: var(--nt-black);
  color: var(--nt-white);
  font-size: var(--type-cta);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 14px 32px;
  border: 1.5px solid var(--nt-black);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
  white-space: nowrap;
}
.btn--primary:hover {
  background: var(--nt-charcoal);
  border-color: var(--nt-charcoal);
}

/* Secondary — white fill, black border */
.btn--secondary {
  display: inline-block;
  background: var(--nt-white);
  color: var(--nt-black);
  font-size: var(--type-cta);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  text-decoration: none;
  padding: 14px 32px;
  border: 1.5px solid var(--nt-black);
  cursor: pointer;
  transition: background 0.2s, color 0.2s;
}
.btn--secondary:hover {
  background: var(--nt-black);
  color: var(--nt-white);
}
```

### Product Card

```css
.product-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  position: relative;
}

.product-card__image-wrap {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  background: var(--nt-off-white);
}

.product-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}
.product-card:hover .product-card__image {
  transform: scale(1.04);
}

.product-card__name {
  font-size: var(--type-heading-md);
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--nt-black);
  margin: 0;
}

.product-card__price {
  font-size: 13px;
  font-weight: 400;
  color: var(--nt-text-secondary);
  margin: 0;
}

.product-card__price--sale {
  color: var(--nt-sale-red);
}
```

### Badge

```css
.badge {
  display: inline-block;
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 3px 6px;
  border-radius: 2px;
  line-height: 1.2;
}
.badge--sale { background: var(--nt-sale-red); color: var(--nt-white); }
.badge--new  { background: var(--nt-badge-blue); color: var(--nt-white); }
.badge--hot  { background: var(--nt-badge-hot); color: var(--nt-white); }
```

### Footer

```css
.footer {
  background: var(--nt-white);
  border-top: 0.5px solid var(--nt-border);
  padding: var(--space-16) var(--space-8);
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.5fr repeat(4, 1fr);
  gap: var(--space-8);
  max-width: var(--content-max-width);
  margin: 0 auto;
}

.footer__email-form {
  display: flex;
  border-bottom: 1.5px solid var(--nt-black);
  margin-bottom: var(--space-6);
}

.footer__email-input {
  flex: 1;
  border: none;
  outline: none;
  font-size: 13px;
  padding: var(--space-2) 0;
  background: transparent;
  color: var(--nt-black);
}

.footer__col-heading {
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--nt-black);
  margin-bottom: var(--space-4);
}

.footer__links {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.footer__links a {
  font-size: 13px;
  color: var(--nt-text-secondary);
  text-decoration: none;
}
.footer__links a:hover { color: var(--nt-black); }
```

---

## Motion & Transitions

```css
:root {
  --transition-fast:   0.15s ease;
  --transition-medium: 0.25s ease;
  --transition-slow:   0.5s ease;
}

/* Image hover zoom */
.image-zoom {
  overflow: hidden;
}
.image-zoom img {
  transition: transform var(--transition-slow);
}
.image-zoom:hover img {
  transform: scale(1.04);
}
```

---

## Photography / Image Style

- **Ratio:** 3:4 portrait for all product and collection images
- **Background:** Always neutral — off-white (`#F1EFE8`), light warm gray, or clean white
- **Models:** Centered or slightly off-center; model should fill ~70–85% of frame height
- **Lighting:** Flat, soft, diffused natural light. No harsh shadows, no dramatic mood lighting.
- **Color treatment:** Muted, desaturated. No vibrant / saturated photography.
- **Cropping:** Tight on product, loose on model. Never crop at joints (wrists, knees, neck).
- **Hero images:** Full-width, portrait or landscape, model in motion or in a confident stance.

---

## Iconography

- **Style:** 1.5px stroke weight, rounded caps, no fill — consistent with Feather Icons or Heroicons Outline
- **Size:** 20px standard, 16px compact, 24px max
- **Icons used:** User (account), Search, Heart (wishlist), ShoppingBag (cart), Menu, X (close)

---

## Design Principles (Quick Reference)

1. **All caps for headings and CTAs.** Body descriptions stay sentence case.
2. **No decorative color.** Only black, white, and grays in UI. Color = semantic only (red = sale).
3. **Negative space > density.** When in doubt, add more whitespace, not more content.
4. **Images carry the brand.** Let photography be the hero — keep UI chrome minimal.
5. **Borders are 0.5px**, never thicker unless it's an active state or button border (1.5px).
6. **No rounded corners on images.** Only slight radius (2–4px) on badges/pills.
7. **One font family.** Size, weight, and spacing do the typographic work — no display vs body switch.
8. **Sticky nav always visible.**
9. **Product images always 3:4 portrait ratio** with `object-fit: cover`.
10. **Hover states:** Images scale 1.03–1.04. Links fade to 60% opacity. Buttons invert fill.

---

## Mobile Design System

> Applies to viewports ≤ 430px (iPhone/Android). All desktop rules apply unless overridden here.

### Mobile Viewport & Base

```css
/* Mobile base — always include */
@media (max-width: 430px) {
  :root {
    --mobile-page-padding: 16px;
    --mobile-nav-height:   56px;
    --mobile-tab-bar-height: 60px;
    --type-hero: clamp(28px, 8vw, 40px);  /* smaller hero on mobile */
  }

  body {
    padding-bottom: var(--mobile-tab-bar-height); /* reserve space for tab bar */
  }
}
```

### Mobile Navigation Bar

On mobile, nav collapses to: **hamburger (left) · search · centered LOGO · account · cart (right)**. No text links visible.

```css
.mobile-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: var(--nt-white);
  height: var(--mobile-nav-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--mobile-page-padding);
  border-bottom: 0.5px solid var(--nt-border);
}

.mobile-nav__logo {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 22px;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-transform: uppercase;
  color: var(--nt-black);
  text-decoration: none;
}

.mobile-nav__left,
.mobile-nav__right {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Hamburger icon (3 horizontal lines, 1.5px stroke) */
.mobile-nav__hamburger {
  display: flex;
  flex-direction: column;
  gap: 5px;
  cursor: pointer;
  width: 22px;
}
.mobile-nav__hamburger span {
  display: block;
  height: 1.5px;
  background: var(--nt-black);
  border-radius: 1px;
}

/* Cart badge counter */
.mobile-nav__cart {
  position: relative;
}
.mobile-nav__cart-count {
  position: absolute;
  top: -6px;
  right: -8px;
  font-size: 9px;
  font-weight: 700;
  background: var(--nt-black);
  color: var(--nt-white);
  width: 14px;
  height: 14px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
```

### Mobile Bottom Tab Bar

Fixed at the bottom of the screen. 5 tabs: Home · Search · Account · Cart · Wishlist.

```html
<nav class="mobile-tab-bar">
  <a href="/" class="mobile-tab-bar__item mobile-tab-bar__item--active">
    <!-- home icon SVG -->
    <span>Home</span>
  </a>
  <a href="/search" class="mobile-tab-bar__item">
    <!-- search icon SVG -->
    <span>Search</span>
  </a>
  <a href="/account" class="mobile-tab-bar__item">
    <!-- user icon SVG -->
    <span>Account</span>
  </a>
  <a href="/cart" class="mobile-tab-bar__item">
    <!-- bag icon SVG with cart count badge -->
    <span>Cart</span>
  </a>
  <a href="/wishlist" class="mobile-tab-bar__item">
    <!-- heart icon SVG -->
    <span>Wishlist</span>
  </a>
</nav>
```

```css
.mobile-tab-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 200;
  background: var(--nt-white);
  border-top: 0.5px solid var(--nt-border);
  height: var(--mobile-tab-bar-height);
  display: flex;
  align-items: center;
}

.mobile-tab-bar__item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 400;
  color: var(--nt-mid-gray);
  text-decoration: none;
  padding: 8px 0;
}

.mobile-tab-bar__item svg {
  width: 22px;
  height: 22px;
  stroke: var(--nt-mid-gray);
  stroke-width: 1.5;
  fill: none;
}

.mobile-tab-bar__item--active,
.mobile-tab-bar__item--active svg {
  color: var(--nt-black);
  stroke: var(--nt-black);
}
```

### Mobile Drawer Menu (Hamburger Open State)

Slides in from the left as a full-height panel. Two-panel design: main list → drill-in submenu with image grid.

```html
<!-- Main menu panel -->
<div class="mobile-menu">
  <div class="mobile-menu__header">
    <div class="mobile-menu__title-group">
      <span class="mobile-menu__label">Menu</span>
      <span class="mobile-menu__subtitle">Nova Threads</span>
    </div>
    <button class="mobile-menu__close">×</button>
  </div>

  <ul class="mobile-menu__list">
    <li class="mobile-menu__item">
      <img src="..." class="mobile-menu__item-thumb" alt="" />
      <span>Home</span>
    </li>
    <li class="mobile-menu__item mobile-menu__item--has-children">
      <img src="..." class="mobile-menu__item-thumb" alt="" />
      <span>New In</span>
      <span class="mobile-menu__chevron">→</span>
    </li>
    <!-- more items -->
  </ul>

  <div class="mobile-menu__region">
    <p class="mobile-menu__region-label">REGION AND LANGUAGE</p>
    <a class="mobile-menu__region-row">
      <img src="flag.png" width="20" /> NPR / EN
      <span>›</span>
    </a>
  </div>
</div>
```

```css
.mobile-menu {
  position: fixed;
  top: 0;
  left: 0;
  width: 88vw;
  max-width: 340px;
  height: 100vh;
  background: var(--nt-white);
  z-index: 300;
  overflow-y: auto;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}
.mobile-menu.open { transform: translateX(0); }

.mobile-menu__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--mobile-page-padding);
  height: var(--mobile-nav-height);
  border-bottom: 0.5px solid var(--nt-border);
}

.mobile-menu__label {
  display: inline-block;
  background: var(--nt-black);
  color: var(--nt-white);
  font-size: 14px;
  font-weight: 700;
  padding: 4px 12px;
  margin-right: 8px;
}

.mobile-menu__subtitle {
  font-size: 16px;
  font-weight: 700;
  color: var(--nt-black);
}

.mobile-menu__close {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: var(--nt-black);
  line-height: 1;
}

.mobile-menu__list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-menu__item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px var(--mobile-page-padding);
  border-bottom: 0.5px solid var(--nt-border);
  font-size: 15px;
  color: var(--nt-black);
  cursor: pointer;
}

.mobile-menu__item-thumb {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.mobile-menu__chevron {
  margin-left: auto;
  color: var(--nt-mid-gray);
  font-size: 16px;
}

/* Overlay behind drawer */
.mobile-menu-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  z-index: 299;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s;
}
.mobile-menu-overlay.open {
  opacity: 1;
  pointer-events: all;
}
```

### Mobile Product Grid (2-column)

```css
@media (max-width: 430px) {
  .collection-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    padding: 0 var(--mobile-page-padding);
  }

  /* On mobile, product cards show NEW badge as outlined text box */
  .product-card__badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--nt-white);
    border: 1px solid var(--nt-black);
    color: var(--nt-black);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.06em;
    padding: 3px 8px;
  }

  /* Horizontal scroll product strip (Best Seller) */
  .product-scroll-strip {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding: 0 var(--mobile-page-padding);
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .product-scroll-strip::-webkit-scrollbar { display: none; }

  .product-scroll-strip .product-card {
    min-width: 48vw;
    flex-shrink: 0;
    scroll-snap-align: start;
  }
}
```

### Mobile Cart Drawer

Slides in from the right as a full-screen white panel.

```css
.cart-drawer {
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: var(--nt-white);
  z-index: 300;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}
.cart-drawer.open { transform: translateX(0); }

.cart-drawer__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) var(--mobile-page-padding);
  border-bottom: 0.5px solid var(--nt-border);
}

.cart-drawer__title {
  font-size: var(--type-heading-md);
  font-weight: 700;
  color: var(--nt-black);
}

.cart-drawer__close {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  color: var(--nt-black);
}

/* Empty cart state */
.cart-drawer__empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-8) var(--mobile-page-padding);
}

.cart-drawer__empty-title {
  font-size: 24px;
  font-weight: 700;
  color: var(--nt-black);
  text-align: center;
  margin-bottom: var(--space-6);
}

.cart-item {
  display: flex;
  gap: var(--space-4);
  padding: var(--space-4) var(--mobile-page-padding);
  border-bottom: 0.5px solid var(--nt-border);
}

.cart-item__image {
  width: 80px;
  height: 100px;
  object-fit: cover;
  background: var(--nt-off-white);
}

.cart-item__details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.cart-item__name {
  font-size: 14px;
  font-weight: 500;
  color: var(--nt-black);
}

.cart-item__meta {
  font-size: 12px;
  color: var(--nt-mid-gray);
}

.cart-item__quantity {
  display: flex;
  align-items: center;
  gap: 0;
  border: 1px solid var(--nt-border);
  width: fit-content;
  margin-top: auto;
}

.cart-item__qty-btn {
  width: 36px;
  height: 36px;
  background: none;
  border: none;
  font-size: 16px;
  cursor: pointer;
  color: var(--nt-black);
}

.cart-item__qty-val {
  width: 36px;
  text-align: center;
  font-size: 14px;
  color: var(--nt-black);
}

.cart-drawer__footer {
  padding: var(--space-4) var(--mobile-page-padding);
  border-top: 0.5px solid var(--nt-border);
  background: var(--nt-white);
}

.cart-drawer__total {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
  font-weight: 700;
  color: var(--nt-black);
  margin-bottom: var(--space-4);
}

.cart-drawer__checkout {
  width: 100%;
  background: var(--nt-black);
  color: var(--nt-white);
  border: none;
  font-size: var(--type-cta);
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  padding: 16px;
  cursor: pointer;
}
```

### Mobile Footer

On mobile, the footer collapses. The newsletter section sits above accordion link groups.

```css
@media (max-width: 430px) {
  .footer__grid {
    grid-template-columns: 1fr;
    gap: 0;
  }

  /* Newsletter block stays visible */
  .footer__newsletter {
    padding: var(--space-6) var(--mobile-page-padding);
    border-bottom: 0.5px solid var(--nt-border);
  }

  /* Link groups become accordions */
  .footer__col {
    border-bottom: 0.5px solid var(--nt-border);
  }
  .footer__col-heading {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--space-4) var(--mobile-page-padding);
    margin: 0;
    cursor: pointer;
  }
  .footer__col-heading::after {
    content: '∨';
    font-size: 12px;
    color: var(--nt-mid-gray);
  }
  .footer__links {
    display: none;
    padding: 0 var(--mobile-page-padding) var(--space-4);
  }
  .footer__col.open .footer__links { display: flex; }

  /* Giant wordmark at bottom */
  .footer__wordmark {
    font-size: clamp(60px, 20vw, 100px);
    font-weight: 700;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: var(--nt-black);
    line-height: 0.9;
    padding: 0 8px;
    margin: var(--space-6) 0 var(--space-4);
  }

  /* Copyright */
  .footer__copyright {
    font-size: 11px;
    color: var(--nt-mid-gray);
    text-align: center;
    padding: var(--space-3) var(--mobile-page-padding) var(--space-6);
    line-height: 1.6;
  }
}
```

### Mobile Page Templates

#### Homepage (Mobile)
```
[Announcement Bar]
[Mobile Nav: ☰ · 🔍 · LOGO · 👤 · 🛍]
[Full-bleed Hero image — 100vw, ~90vh]
[Hero text overlay bottom-left: white bold uppercase + white CTA button]
[2-column Category Strip (tight 2px gap)]
[BEST SELLER heading + Shop For Men / Shop For Women tabs]
[2-card horizontal scroll strip with progress bar]
[Full-bleed editorial banner: dark image + bold white text overlay + DISCOVER link]
[2-column stacked images (Men / Women) with text overlay CTAs]
[Testimonial: large italic quote, author name, ★★★★★]
[Full-bleed blog/article card]
[NEW ARRIVALS marquee ticker]
[2-column product scroll]
[Partner logos strip]
[Newsletter: label + tagline + email input with → button]
[Social icons: X · FB · Pinterest · Instagram · YouTube]
[Footer accordion: SHOP ∨ · ABOUT ∨ · HELP ∨]
[CONTACT US block: phone / email / address]
[Giant NOVA THREADS wordmark]
[Payment icons]
[Copyright]
[Mobile Tab Bar: Home · Search · Account · Cart · Wishlist]
```

#### Product Detail Page (Mobile)
```
[Announcement Bar]
[Mobile Nav]
[Product image carousel — full width, 3:4 ratio]
[4-image thumbnail strip]
[Product title + Vendor + Availability]
[Price]
[Color: label + swatch squares]
[Size: label + size squares]
[Quantity stepper: – 1 +]
[Add to Cart btn + ♡ + Share icon row]
[Accordion tabs: Description / Shipping & Return]
[RELATED PRODUCTS heading]
[2-column related product grid]
[Newsletter block]
[Mobile Tab Bar]
```

---

### Mobile Design Rules (Additions to Core Principles)

1. **Nav always shows hamburger + centered logo + cart.** Never show text links on mobile.
2. **Tab bar is always fixed at bottom.** All page content has `padding-bottom: 60px`.
3. **Product grids are always 2 columns** on mobile. Never 1 or 3 unless it's a single featured item.
4. **Horizontal scroll strips use snap scrolling** and show a thin progress bar below — no arrows.
5. **Drawer menus slide in from the left.** Cart comes from the right.
6. **Footer collapses to accordions.** Only newsletter, contact info, and wordmark remain expanded.
7. **NEW badge on mobile** uses a bordered white box (not colored fill).
8. **Swatches (color/size) are minimum 44×44px** touch targets.
9. **All tap targets minimum 44px** in height or width per accessibility standards.
10. **No hover states on mobile.** Remove all `:hover` transforms from touch viewports.
11. **Hero on mobile** text is bottom-left aligned and uses `clamp(28px, 8vw, 40px)`.

---

## Anti-Patterns (Do NOT Use)

- ❌ **Emojis as icons** — Use SVG icons (Lucide)
- ❌ **Missing cursor:pointer** — All clickable elements must have cursor:pointer
- ❌ **Layout-shifting hovers** — Avoid transforms that shift layout
- ❌ **Low contrast text** — Maintain 4.5:1 minimum contrast ratio
- ❌ **Instant state changes** — Always use transitions (150-300ms)
- ❌ **Glassmorphism** — No frosted glass effects
- ❌ **Gold accent colors** — Only black, white, grays, and semantic colors
- ❌ **Rounded corners on images** — Keep images sharp, no border-radius
- ❌ **Multiple font families** — Use only DM Sans throughout

---

## Pre-Delivery Checklist

Before delivering any UI code, verify:

- [ ] No emojis used as icons (use SVG/Lucide instead)
- [ ] All icons 1.5px stroke, rounded caps
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected
- [ ] Responsive: 375px, 768px, 1024px, 1440px
- [ ] No content hidden behind fixed navbars
- [ ] No horizontal scroll on mobile
- [ ] All images 3:4 portrait ratio
- [ ] No rounded corners on product images
- [ ] Proper CSS custom properties used for colors
