---
name: Amazonian Vitality
colors:
  surface: '#f9f9f8'
  surface-dim: '#d9dad9'
  surface-bright: '#f9f9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f3'
  surface-container: '#edeeed'
  surface-container-high: '#e7e8e7'
  surface-container-highest: '#e1e3e2'
  on-surface: '#191c1c'
  on-surface-variant: '#4c444d'
  inverse-surface: '#2e3131'
  inverse-on-surface: '#f0f1f0'
  outline: '#7e747d'
  outline-variant: '#cfc3cd'
  surface-tint: '#775080'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#2e0c38'
  on-primary-container: '#9f75a8'
  inverse-primary: '#e5b7ee'
  secondary: '#46672b'
  on-secondary: '#ffffff'
  secondary-container: '#c7efa3'
  on-secondary-container: '#4c6e30'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#001d34'
  on-tertiary-container: '#6487ac'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#fbd7ff'
  primary-fixed-dim: '#e5b7ee'
  on-primary-fixed: '#2e0c38'
  on-primary-fixed-variant: '#5d3967'
  secondary-fixed: '#c7efa3'
  secondary-fixed-dim: '#abd289'
  on-secondary-fixed: '#0c2000'
  on-secondary-fixed-variant: '#2f4f15'
  tertiary-fixed: '#d0e4ff'
  tertiary-fixed-dim: '#a7caf2'
  on-tertiary-fixed: '#001d34'
  on-tertiary-fixed-variant: '#25496b'
  background: '#f9f9f8'
  on-background: '#191c1c'
  surface-variant: '#e1e3e2'
  passion-yellow: '#F7D8AD'
  berry-red: '#F5CDC3'
  amazon-green: '#2D4B28'
  citrus-bright: '#D9F99D'
typography:
  hero-lg:
    fontFamily: Playfair Display
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.02em
  hero-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.01em
  headline-display:
    fontFamily: Playfair Display
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1280px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 64px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
  stack-xl: 64px
---

## Brand & Style

This design system translates the artisanal soul of the Amazon into a premium digital experience. The brand personality is rooted in the concept of "Functional Vitality"—a balance between the wild, raw energy of the rainforest and a sophisticated, modern approach to wellness. It avoids the austerity of medical brands and the clutter of mass-market sodas, opting instead for a **Clean & Premium** aesthetic with a **Tactile** influence.

The visual direction emphasizes:
- **Natural Sophistication:** High-contrast serif typography paired with generous whitespace.
- **Organic Fluidity:** Soft, rounded shapes and subtle transitions that mimic the flow of liquid and the curves of nature.
- **Freshness:** A vibrant but controlled use of color that feels edible and refreshing.

## Colors

The palette is anchored by a deep, sophisticated indigo-plum (`#23022E`) which provides a premium foundation, moving away from standard blacks or greys. This is balanced by "Amazon Green" and "Fresh Citrus" tones that evoke the lush rainforest canopy and the sharp acidity of kombucha.

- **Primary:** Used for high-contrast typography, branding elements, and primary buttons.
- **Secondary & Tertiary:** Used for background washes, decorative accents, and subtle UI grouping.
- **Flavor Accents:** Specific hex codes are reserved for product-specific context (e.g., Passion Fruit, Berry).
- **Surface Strategy:** Use white (#FFFFFF) for the deepest background layers and "Bone" (#F8F9F8) for subtle surface separation.

## Typography

The typography strategy uses a **Dual-Voice** approach. **Playfair Display** provides the artisanal, premium "Storytelling" voice, used for editorial headings and product names. **Plus Jakarta Sans** provides the "Functional" voice, offering high legibility and a friendly, modern tone for descriptions and interface elements.

- **Headlines:** Use tighter letter-spacing for large display sizes to create a "custom logo" feel.
- **Body Text:** Use an increased line-height for better readability in Portuguese, which often has longer word counts.
- **Labels:** Always uppercase with slight tracking for a refined, organized appearance in buttons and small metadata.

## Layout & Spacing

This design system employs a **Fluid Grid** with generous, "breathable" margins to reinforce the premium aesthetic. 

- **Desktop:** 12-column grid with 64px outer margins. Use offset columns for editorial content to create a more organic, less rigid feel.
- **Mobile:** 4-column grid with 16px outer margins.
- **Rhythm:** Spacing follows a 4px base unit. Vertical rhythm should prioritize large gaps (stack-xl) between major sections to emphasize whitespace as a "luxury" design element.
- **Reflow:** On smaller screens, side-by-side card layouts should collapse into a vertical stack, maintaining a consistent 16px gutter.

## Elevation & Depth

To maintain a "Natural & Fresh" feel, this system avoids harsh drop shadows. Instead, it uses **Tonal Layers** and **Soft Ambient Occlusion**.

- **Surface Levels:** Depth is primarily communicated through color shifts (e.g., a white card on a `#F8F9F8` background).
- **Shadow Character:** When elevation is necessary (like a floating checkout button), use a multi-layered, low-opacity shadow tinted with the primary plum color (`#23022E` at 4% opacity) rather than pure black. This keeps the shadows feeling "earthy."
- **Glassmorphism:** Use subtle backdrop blurs (12px to 20px) for navigation bars to suggest the translucency of a glass bottle.

## Shapes

The shape language is **Organic and Rounded**. Sharp corners are strictly avoided to maintain the brand's approachable and healthy personality.

- **Standard Elements:** Buttons and input fields use the `rounded` (0.5rem) setting.
- **Containers:** Product cards and hero sections should use `rounded-lg` or `rounded-xl` to feel soft and inviting.
- **Interactive Details:** Hover states should involve a slight expansion of the corner radius or a fluid "squish" effect to mimic the physical property of liquids.

## Components

- **Buttons:** Primary buttons use the deep primary color with white text. Secondary buttons should be "ghost" style with a 1.5px border or use the Citrus/Berry accent colors for promotional calls-to-action.
- **Product Cards:** Large border-radius, subtle ambient shadow, and a background color that matches the flavor of the kombucha (using the named accent colors at 20% opacity).
- **Chips:** Used for nutrition labels (e.g., "Sem Glúten", "Orgânico"). Use a pill shape with a low-saturation background and high-contrast text.
- **Input Fields:** Soft grey backgrounds instead of heavy outlines. Focus states should use a subtle glow of the secondary "Pear Green" color.
- **Lists:** Use custom icons for bullets, such as a stylized leaf or a water droplet, rather than standard dots.
- **Specialty Component - "The Flavor Swatch":** A circular or organic-shaped component used to display the ingredients of each bottle, using the vivid accent colors.