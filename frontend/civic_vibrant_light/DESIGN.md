---
name: Civic Vibrant Light
colors:
  surface: '#f5faff'
  surface-dim: '#b4e0fc'
  surface-bright: '#f5faff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#e9f5ff'
  surface-container: '#ddf1ff'
  surface-container-high: '#d1ecff'
  surface-container-highest: '#c4e7ff'
  on-surface: '#001e2c'
  on-surface-variant: '#3c494e'
  inverse-surface: '#00344a'
  inverse-on-surface: '#e3f3ff'
  outline: '#6c797f'
  outline-variant: '#bbc9cf'
  surface-tint: '#00677f'
  primary: '#00677f'
  on-primary: '#ffffff'
  primary-container: '#00cffd'
  on-primary-container: '#005469'
  inverse-primary: '#4dd6ff'
  secondary: '#006689'
  on-secondary: '#ffffff'
  secondary-container: '#1bc0fe'
  on-secondary-container: '#004b66'
  tertiary: '#3658ba'
  on-tertiary: '#ffffff'
  tertiary-container: '#aabcff'
  on-tertiary-container: '#2045a8'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#b7eaff'
  primary-fixed-dim: '#4dd6ff'
  on-primary-fixed: '#001f28'
  on-primary-fixed-variant: '#004e60'
  secondary-fixed: '#c3e8ff'
  secondary-fixed-dim: '#79d1ff'
  on-secondary-fixed: '#001e2c'
  on-secondary-fixed-variant: '#004c68'
  tertiary-fixed: '#dce1ff'
  tertiary-fixed-dim: '#b5c4ff'
  on-tertiary-fixed: '#00164e'
  on-tertiary-fixed-variant: '#163ea1'
  background: '#f5faff'
  on-background: '#001e2c'
  surface-variant: '#c4e7ff'
typography:
  h1:
    fontFamily: Public Sans
    fontSize: 2.5rem
    fontWeight: '700'
    lineHeight: '1.2'
  h2:
    fontFamily: Public Sans
    fontSize: 2rem
    fontWeight: '600'
    lineHeight: '1.25'
  h3:
    fontFamily: Public Sans
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Public Sans
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Public Sans
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Public Sans
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.5'
  label-md:
    fontFamily: Public Sans
    fontSize: 0.875rem
    fontWeight: '600'
    lineHeight: '1.2'
  label-sm:
    fontFamily: Public Sans
    fontSize: 0.75rem
    fontWeight: '500'
    lineHeight: '1.1'
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max-width: 1280px
  gutter: 24px
  margin: 32px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The ethos of this design system is rooted in **Institutional Trust** and **Modern Transparency**, now reimagined for a high-energy, **Light Mode** environment. It serves a diverse population, requiring a UI that feels authoritative yet approachable and digitally native. The visual direction follows a **Corporate Modern** aesthetic—prioritizing function, legibility, and a sense of fresh, active governance.

By leveraging a structured grid and generous whitespace within a clean light canvas, the system promotes clarity and ease of use. This allows citizens to navigate complex bureaucratic processes with speed and confidence. The style utilizes a vibrant color palette to communicate innovation, efficiency, and a proactive approach to public service.

## Colors
The palette is anchored by a high-energy **Vibrant Cyan** foundation. This choice represents clarity, modern technology, and forward-thinking administration within a bright, accessible interface.

- **Primary (#00cffd):** A vivid electric cyan used for key branding elements and primary actions, ensuring high visibility against white surfaces.
- **Secondary (#10bdfb):** A bright sky blue reserved for sub-headers and structural accents, providing a professional yet energetic anchor.
- **Tertiary (#5171d5):** A bold periwinkle-blue used for informational callouts and secondary indicators.
- **Neutrals:** A range of slate blues and grays (#517c95) used to create UI boundaries and text hierarchy.

The system defaults to **Light Mode** to ensure maximum accessibility and a clean, daylight-ready feel for administrative workflows.

## Typography
This design system utilizes **Public Sans**, an open-source typeface specifically designed for government platforms. It is highly legible, neutral, and performs exceptionally well across various screen resolutions. In Light Mode, text uses deep slate grays to maintain high contrast and readability without being as harsh as pure black.

The typographic hierarchy is strictly enforced to guide users through information-dense pages. Headlines use a heavier weight to provide clear section anchors, while body text maintains a generous line height (1.5 - 1.6) to ensure long-form reading comfort. Labels and captions use slightly tighter tracking and medium weights to differentiate them from standard body copy.

## Layout & Spacing
The system employs a **Fixed Grid** philosophy for desktop layouts, centering content within a 1280px maximum width container. This prevents line lengths from becoming unreadable on ultra-wide monitors.

A 12-column grid is used with 24px gutters to allow for flexible data presentation. Vertical rhythm is maintained through an **8px scale**, ensuring consistent margins between form fields, paragraphs, and components. White space is used intentionally to group related content, relying on spatial relationships rather than heavy borders.

## Elevation & Depth
In Light Mode, depth is communicated through **Soft Ambient Shadows** and subtle surface variances. This creates a clean, layered look that guides the eye toward primary content.

- **Level 0 (Base):** The primary light background color, typically a clean white or subtle off-white (#f8fafb).
- **Level 1 (Cards/Containers):** Defined by a very subtle 1px border or an extremely soft, diffused shadow to lift content off the base.
- **Level 2 (Modals/Dropdowns):** Utilizes a more pronounced shadow to indicate significant elevation and focus, often accompanied by a semi-transparent neutral overlay on the backdrop.

This approach maintains a crisp, modern profile that feels lightweight and accessible.

## Shapes
The shape language is **Rounded** (Level 2), utilizing an 8px (0.5rem) base radius. This rounding softens the interface significantly, making the environment feel more inviting and modern—while maintaining a professional, structured appearance that conveys precision and order. Larger components like modals or hero sections may scale up to a 16px radius for a more prominent visual hierarchy.

## Components

### Data Tables
Tables are optimized for scanning in light environments. They feature high-contrast headers in Secondary Blue, subtle row separators, and condensed padding to maximize data density. Action items within rows use text links or primary-colored icon buttons.

### Forms
Form fields utilize the Rounded corner radius (8px) with a clear 1px neutral border. The focus state uses the Primary Cyan with a 2px outer glow. Labels are positioned above the input for clarity, and validation messages are optimized for high-contrast visibility.

### Modals
Modals appear centered over a semi-transparent neutral overlay. They use the highest elevation level with soft shadows and clear headers. The primary action is always a solid Cyan button, while secondary actions use an outlined style.

### Buttons
- **Primary:** Solid #00cffd with high-contrast text.
- **Secondary:** Outlined with #00cffd border and text.
- **Tertiary:** Ghost style for low-emphasis actions.

### Status Badges
Used for application statuses (e.g., "Pending", "Approved"). These use soft, desaturated background colors with high-contrast text to ensure they don't distract from primary content but remain easily scannable on light surfaces.