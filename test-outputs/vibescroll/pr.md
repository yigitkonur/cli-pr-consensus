# PR #1: Initial Repository Setup: Vibe Scroll Marketing Website

> **Status**: OPEN | **Review**: APPROVED | **Author**: @yigitkonur
> **Changes**: +1127 -20243 across 67 files

## Description

# Vibe Scroll Website - Initial Repository Setup

## Overview

This PR establishes the complete marketing website for **Vibe Scroll**, a native desktop application that enables hands-free social media browsing. The website serves as the primary marketing, documentation, and download portal for the application.

### What is Vibe Scroll?

Vibe Scroll is a native macOS/Windows desktop application that allows developers and professionals to consume social media content passively while working. It provides:

- **Auto-Scroll**: Automatic video advancement when content ends (TikTok, YouTube Shorts, Instagram Reels)
- **Cruise Control**: Speed-controlled continuous scrolling for feed-based platforms (Twitter/X, Reddit, LinkedIn, Facebook)
- **Media Keys**: Hardware media key support (⏮ ⏯ ⏭) for controlling playback without leaving your IDE
- **Boss Mode**: Instant window hide/show with keyboard shortcut
- **Always-On-Top**: Pin the window above your IDE
- **Window Opacity**: Adjustable transparency for overlay viewing
- **Native Performance**: Built with Tauri, ~15MB download, minimal RAM usage

---

## Technical Architecture

### Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| Framework | Next.js | 16.1.0 |
| React | React | 19.2.3 |
| Internationalization | next-intl | 4.6.1 |
| Styling | Tailwind CSS | v4 |
| UI Primitives | Radix UI | Various |
| Animations | framer-motion | 12.x |
| Icons | lucide-react | 0.562.0 |
| Package Manager | pnpm | Latest |
| Deployment | Vercel / Cloudflare Pages | - |

### Why These Choices?

**Next.js 16 with App Router**: Provides server components, streaming, and the latest React 19 features. The App Router enables route groups for clean organization and layouts per section.

**next-intl**: The most mature i18n solution for Next.js App Router. Supports 24 locales with type-safe message access, automatic locale detection, and SEO-friendly URL structure (`/{locale}/...`).

**Tailwind CSS v4**: Zero-runtime CSS with JIT compilation. The retro design system uses custom CSS variables for consistent theming.

**Radix UI**: Unstyled, accessible UI primitives. We wrap these in custom `retroui` components with the project's visual style.

**framer-motion**: Production-grade animations with layout animations and gesture support. Lazy-loaded to reduce initial bundle.

---

## Project Structure

```
vibe-scroll-website/
├── app/
│   └── [locale]/                    # Dynamic locale segment (24 locales)
│       ├── (marketing)/             # Marketing pages group
│       │   ├── page.tsx             # Home page
│       │   ├── about/page.tsx       # About page
│       │   ├── download/page.tsx    # Download page
│       │   ├── pricing/page.tsx     # Pricing page
│       │   ├── features/
│       │   │   ├── page.tsx         # Features overview
│       │   │   └── [feature]/page.tsx  # Dynamic feature pages
│       │   └── platforms/
│       │       ├── page.tsx         # Platforms overview
│       │       ├── [platform]/page.tsx  # Dynamic platform pages
│       │       └── [platform]/[feature]/page.tsx  # Nested pages
│       ├── (legal)/                 # Legal pages group
│       │   ├── privacy/page.tsx
│       │   ├── terms/page.tsx
│       │   └── refund-policy/page.tsx
│       ├── (support)/               # Support pages group
│       │   ├── faq/page.tsx
│       │   └── contact/page.tsx
│       └── (changelog)/             # Changelog pages
│           └── changelog/page.tsx
│
├── components/
│   ├── retroui/                     # Radix-based UI components
│   │   ├── Accordion.tsx
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Dialog.tsx
│   │   ├── Select.tsx
│   │   ├── Tabs.tsx
│   │   └── index.ts
│   ├── sections/                    # Page section components
│   │   ├── Hero.tsx
│   │   ├── Pricing.tsx
│   │   ├── FAQ.tsx
│   │   ├── Benefits.tsx
│   │   ├── HowItWorks.tsx
│   │   ├── PlatformCards.tsx
│   │   └── interactive-mockup/      # Interactive demo component
│   ├── layout/                      # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── LanguageSwitcher.tsx
│   ├── seo/                         # SEO components
│   │   └── JsonLd.tsx
│   └── lib/                         # Component utilities
│       ├── LazyMount.tsx
│       └── Skeletons.tsx
│
├── lib/
│   ├── content/                     # Content management system
│   │   ├── catalog.ts               # Type definitions
│   │   ├── types.ts                 # Interface definitions
│   │   ├── features/                # Feature page content
│   │   │   ├── auto-scroll.ts
│   │   │   ├── boss-mode.ts
│   │   │   ├── cruise-control.ts
│   │   │   ├── media-keys.ts
│   │   │   ├── always-on-top.ts
│   │   │   ├── native-performance.ts
│   │   │   ├── window-opacity.ts
│   │   │   └── index.ts
│   │   └── platforms/               # Platform page content
│   │       ├── tiktok.ts
│   │       ├── tiktok/
│   │       │   ├── auto-scroll.ts
│   │       │   ├── auto-advance.ts
│   │       │   └── media-keys.ts
│   │       ├── youtube.ts
│   │       ├── youtube/
│   │       ├── instagram.ts
│   │       ├── instagram/
│   │       ├── twitter.ts
│   │       ├── twitter/
│   │       ├── reddit.ts
│   │       ├── reddit/
│   │       ├── linkedin.ts
│   │       ├── linkedin/
│   │       ├── facebook.ts
│   │       ├── facebook/
│   │       └── index.tsx
│   ├── icons/                       # Icon system
│   │   └── registry.tsx
│   ├── motion/                      # Animation utilities
│   │   └── index.tsx
│   ├── schemas.ts                   # JSON-LD schema generators
│   └── i18n/                        # i18n utilities
│       └── country-languages.ts
│
├── i18n/                            # next-intl configuration
│   ├── config.ts                    # Locale list
│   ├── request.ts                   # Server request config
│   └── routing.ts                   # URL routing config
│
├── messages-src/                    # Translation source files (JSONC)
│   ├── en/
│   │   ├── index.jsonc              # Main translations
│   │   └── metadata.jsonc           # SEO metadata
│   ├── es/
│   ├── fr/
│   ├── de/
│   ├── ja/
│   ├── ko/
│   ├── zh/
│   └── ... (24 locales total)
│
├── messages/                        # Built translations (auto-generated)
│   └── {locale}/index.json
│
├── public/
│   ├── og/                          # OpenGraph images (51 images)
│   ├── _headers                     # Cloudflare cache headers
│   └── ...
│
├── scripts/                         # Build utilities
│   ├── jsonc-to-json.ts            # JSONC → JSON converter
│   ├── optimize-images.ts          # WebP generation
│   ├── generate-all-og-images.ts   # OG image generator
│   ├── i18n-audit.ts               # Translation key checker
│   ├── lint-translations.ts        # Translation linter
│   ├── translation-compare.ts      # Cross-locale comparison
│   ├── copy-default-locale.ts      # Cloudflare build helper
│   ├── lighthouse-all-pages.ts     # Performance testing
│   └── performance-test.ts         # Lighthouse runner
│
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── wrangler.toml                    # Cloudflare config
├── README.md
└── CLAUDE.md                        # AI agent navigation guide
```

---

## Internationalization (i18n) System

### Supported Locales (24)

| Code | Language | Code | Language |
|------|----------|------|----------|
| en | English | ja | Japanese |
| es | Spanish | ko | Korean |
| fr | French | zh | Chinese (Simplified) |
| de | German | zh-TW | Chinese (Traditional) |
| it | Italian | ar | Arabic |
| pt | Portuguese | hi | Hindi |
| pt-BR | Portuguese (Brazil) | th | Thai |
| nl | Dutch | vi | Vietnamese |
| pl | Polish | id | Indonesian |
| ru | Russian | ms | Malay |
| tr | Turkish | fil | Filipino |
| uk | Ukrainian | bg | Bulgarian |

### Architecture

The i18n system uses a three-layer architecture:

```
┌─────────────────────────────────────────────────────────────────┐
│                     Source Layer (JSONC)                         │
│  messages-src/{locale}/index.jsonc                              │
│  - Human-editable with comments                                  │
│  - Supports // comments for translator notes                     │
│  - Single source of truth                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼ pnpm i18n:build
┌─────────────────────────────────────────────────────────────────┐
│                     Build Layer (JSON)                           │
│  messages/{locale}/index.json                                    │
│  - Auto-generated, do not edit                                   │
│  - Consumed by next-intl at runtime                              │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Runtime Layer                                 │
│  useTranslations() hook / getTranslations() server function     │
│  - Type-safe key access                                          │
│  - Automatic locale detection                                    │
│  - SEO-friendly URLs (/{locale}/path)                            │
└─────────────────────────────────────────────────────────────────┘
```

### Translation Key Namespaces

```typescript
// UI translations
common.*              // Shared UI text (buttons, labels)
header.*              // Header navigation
footer.*              // Footer content
home.*                // Home page sections
pricing.*             // Pricing page
faq.*                 // FAQ content
download.*            // Download page

// Content translations (page-specific)
featureContent.{featureId}.*
  .metadata.title
  .metadata.description
  .heroTitle
  .heroSubtitle
  .whatItDoes.{item}.title
  .whatItDoes.{item}.description
  .howItWorks.step{N}.title
  .howItWorks.step{N}.description
  .keyBenefits.{benefit}.title
  .keyBenefits.{benefit}.description

platformContent.{platformId}.*
  .metadata.*
  .hero.title
  .hero.subtitle
  .problem.title
  .problem.points.{N}
  .solution.title
  .solution.features.{feature}.*
  .benefits.{benefit}.*

platformContent.{platformId}.features.{featureId}.*
  // Nested platform-feature pages
```

### Content System Integration

Content files define page structure using translation keys:

```typescript
// lib/content/features/auto-scroll.ts
export const autoScrollFeature: FeaturePageData = {
  metadata: {
    title: "featureContent.autoScroll.metadata.title",
    description: "featureContent.autoScroll.metadata.description",
  },
  props: {
    featureName: "featureContent.autoScroll.featureName",
    heroTitle: "featureContent.autoScroll.heroTitle",
    heroSubtitle: "featureContent.autoScroll.heroSubtitle",
    whatItDoes: [
      {
        title: "featureContent.autoScroll.whatItDoes.automaticAdvancement.title",
        description: "featureContent.autoScroll.whatItDoes.automaticAdvancement.description",
      },
      // ... more items
    ],
    howItWorks: [
      {
        step: 1,
        title: "featureContent.autoScroll.howItWorks.step1.title",
        description: "featureContent.autoScroll.howItWorks.step1.description",
      },
      // ... more steps
    ],
  },
};
```

Components resolve these keys at render time:

```tsx
// In page component
import { useTranslations } from "next-intl";
import { autoScrollFeature } from "@/lib/content/features/auto-scroll";

export default function AutoScrollPage() {
  const t = useTranslations();

  return (
    <Hero
      title={t(autoScrollFeature.props.heroTitle)}
      subtitle={t(autoScrollFeature.props.heroSubtitle)}
    />
  );
}
```

### i18n Build Pipeline

```bash
# Development flow
pnpm dev
  └── pnpm i18n:build     # Auto-runs first
      └── scripts/jsonc-to-json.ts
          ├── Reads messages-src/{locale}/*.jsonc
          ├── Strips // comments
          └── Outputs messages/{locale}/*.json

# Audit translations
pnpm i18n:audit
  └── scripts/i18n-audit.ts
      ├── Scans all .tsx/.ts files for hardcoded strings
      ├── Checks all translation keys exist
      └── Reports missing translations per locale

# Compare locales
pnpm i18n:compare
  └── scripts/translation-compare.ts
      ├── Compares en to all other locales
      └── Reports missing/extra keys
```

---

## Content Management System

### Type Definitions

```typescript
// lib/content/catalog.ts
export type PlatformId =
  | "tiktok"
  | "youtube"
  | "instagram"
  | "twitter"
  | "reddit"
  | "linkedin"
  | "facebook";

export type FeatureId =
  | "auto-scroll"
  | "boss-mode"
  | "cruise-control"
  | "media-keys"
  | "always-on-top"
  | "native-performance"
  | "window-opacity";

export type PlatformFeatureId =
  | "auto-scroll"
  | "auto-advance"
  | "media-keys"
  | "cruise-control"
  | "keyboard-control";

// Platform categories
export const PLATFORMS = [
  { id: "tiktok", type: "video", icon: "📱" },
  { id: "youtube", type: "video", icon: "▶️" },
  { id: "instagram", type: "video", icon: "📸" },
  { id: "twitter", type: "feed", icon: "𝕏" },
  { id: "reddit", type: "feed", icon: "🤖" },
  { id: "linkedin", type: "feed", icon: "💼" },
  { id: "facebook", type: "feed", icon: "📘" },
] as const;
```

### Page Data Interfaces

```typescript
// lib/content/types.ts
export interface FeaturePageData {
  metadata: {
    title: string;          // Translation key
    description: string;    // Translation key
    keywords?: string;      // Translation key
    openGraph?: { ... };
    twitter?: { ... };
  };
  props: {
    featureName: string;    // Translation key
    featureIconId: IconId;  // From icon registry
    heroTitle: string;      // Translation key
    heroSubtitle: string;   // Translation key
    heroColor: string;      // Tailwind class (literal)
    whatItDoes: Array<{
      title: string;        // Translation key
      description: string;  // Translation key
    }>;
    howItWorks: Array<{
      step: number;
      title: string;        // Translation key
      description: string;  // Translation key
    }>;
    keyBenefits: Array<{
      iconId: IconId;
      title: string;        // Translation key
      description: string;  // Translation key
    }>;
    shortcuts?: Array<{
      keys: string;         // Translation key
      action: string;       // Translation key
    }>;
    compatiblePlatforms?: Array<{ ... }>;
    relatedFeatures?: Array<{ ... }>;
  };
}

export interface PlatformPageData {
  metadata: { ... };
  props: {
    heroTitle: string;
    heroSubtitle: string;
    heroColor: string;
    problemTitle: string;
    problemPoints: string[];
    solutionTitle: string;
    solutionDescription: string;
    solutionFeatures: Array<{
      iconId: IconId;
      title: string;
      description: string;
    }>;
    howItWorks: Array<{ ... }>;
    benefits: Array<{ ... }>;
    relatedPages?: Array<{ ... }>;
  };
}
```

### Route Generation

Dynamic routes use `generateStaticParams` for static generation:

```typescript
// app/[locale]/(marketing)/features/[feature]/page.tsx
import { FEATURES } from "@/lib/content/catalog";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    FEATURES.map((feature) => ({
      locale,
      feature: feature.id,
    }))
  );
}
```

---

## Component Library (retroui)

### Design System

The retroui components implement a retro/brutalist design aesthetic:

- **Thick borders**: 2-4px solid borders
- **Bold shadows**: Offset drop shadows for depth
- **High contrast**: Black text on bright backgrounds
- **Pixelated feel**: Sharp corners, no border-radius by default
- **Color palette**: Bright pastels (pink, cyan, yellow, lime)

### Component Inventory

| Component | Radix Base | Purpose |
|-----------|------------|---------|
| Button | Slot | Primary actions |
| Card | - | Content containers |
| Accordion | @radix-ui/react-accordion | FAQ sections |
| Dialog | @radix-ui/react-dialog | Modals |
| Select | @radix-ui/react-select | Dropdowns |
| Tabs | @radix-ui/react-tabs | Tabbed content |
| Checkbox | @radix-ui/react-checkbox | Form inputs |
| Switch | @radix-ui/react-switch | Toggles |
| Tooltip | @radix-ui/react-tooltip | Hover hints |
| DropdownMenu | @radix-ui/react-dropdown-menu | Context menus |
| Avatar | @radix-ui/react-avatar | User avatars |

### Usage Pattern

```tsx
import { Button, Card, Accordion } from "@/components/retroui";

<Card className="p-6">
  <h2>Title</h2>
  <Button variant="primary" size="lg">
    Click Me
  </Button>
  <Accordion>
    <Accordion.Item value="item-1">
      <Accordion.Trigger>Question?</Accordion.Trigger>
      <Accordion.Content>Answer.</Accordion.Content>
    </Accordion.Item>
  </Accordion>
</Card>
```

### Accessibility

All components follow WAI-ARIA patterns via Radix UI:
- Keyboard navigation
- Screen reader support
- Focus management
- ARIA attributes

---

## Animation System

### Lazy-Loaded Motion

framer-motion is dynamically imported to reduce initial bundle:

```typescript
// lib/motion/index.tsx
import dynamic from "next/dynamic";

export const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  { ssr: false }
);

export const AnimatePresence = dynamic(
  () => import("framer-motion").then((mod) => mod.AnimatePresence),
  { ssr: false }
);
```

### Usage

```tsx
import { MotionDiv, AnimatePresence } from "@/lib/motion";

<AnimatePresence>
  <MotionDiv
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.3 }}
  >
    Animated content
  </MotionDiv>
</AnimatePresence>
```

### LazyMount Component

For deferred rendering of heavy components:

```tsx
// components/lib/LazyMount.tsx
import { LazyMount } from "@/components/lib/LazyMount";

<LazyMount rootMargin="200px">
  <HeavyComponent />
</LazyMount>
```

Uses IntersectionObserver to defer mounting until element approaches viewport.

---

## Icon System

### Type-Safe Icon Registry

```typescript
// lib/icons/registry.tsx
import {
  Keyboard,
  MousePointer,
  Zap,
  Eye,
  Play,
  Pause,
  // ... more icons
} from "lucide-react";

export const icons = {
  keyboard: Keyboard,
  "mouse-pointer": MousePointer,
  zap: Zap,
  eye: Eye,
  play: Play,
  pause: Pause,
  // ... more icons
} as const;

export type IconId = keyof typeof icons;

export function Icon({
  id,
  size = 24,
  className
}: {
  id: IconId;
  size?: number;
  className?: string;
}) {
  const IconComponent = icons[id];
  return <IconComponent size={size} className={className} />;
}
```

### Usage

```tsx
import { Icon, type IconId } from "@/lib/icons/registry";

// Type-safe - will error if id is invalid
<Icon id="keyboard" size={24} />
<Icon id="invalid" /> // TypeScript error!
```

---

## SEO Implementation

### JSON-LD Schemas

```typescript
// lib/schemas.ts
export function generateSoftwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Vibe Scroll",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "macOS, Windows",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    // ...
  };
}

export function generateFAQSchema(items: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
```

### OpenGraph Images

51 pre-generated OG images in `/public/og/`:
- `og-home.png` - Home page
- `og-feature-{feature}.png` - Feature pages
- `og-platform-{platform}.png` - Platform pages
- `og-platform-{platform}-{feature}.png` - Nested pages

Generated via `pnpm generate:og` using `@vercel/og`.

### Metadata Generation

```typescript
// app/[locale]/(marketing)/features/[feature]/page.tsx
export async function generateMetadata({ params }) {
  const { feature, locale } = await params;
  const t = await getTranslations({ locale, namespace: "featureContent" });

  return {
    title: t(`${feature}.metadata.title`),
    description: t(`${feature}.metadata.description`),
    openGraph: {
      images: [`/og/og-feature-${feature}.png`],
    },
  };
}
```

---

## Performance Optimizations

### Image Optimization

WebP variants generated for all PNG images:

```typescript
// scripts/optimize-images.ts
// Generates .webp for all .png files
// Average 62% size reduction
// Runs during build: pnpm optimize:images
```

Results:
- 56 WebP images generated
- 1.54MB total savings
- Average 62% reduction per image

### Cursor Icon Fix

Critical fix for `cursor-icon.png`:
- **Before**: 142KB, 1401x1376 pixels (displayed at 16x16)
- **After**: 1.3KB, 32x32 WebP
- **Reduction**: 99.08%

### Bundle Optimization

- framer-motion: Lazy-loaded (0KB initial)
- Icons: Tree-shaken via lucide-react
- Components: Code-split per route
- Images: Next.js Image with WebP

### Caching Strategy

```
# public/_headers (Cloudflare)
/og/*
  Cache-Control: public, max-age=31536000, immutable

/*.png
  Cache-Control: public, max-age=31536000, immutable

/*.webp
  Cache-Control: public, max-age=31536000, immutable
```

---

## Build System

### Scripts

| Script | Purpose |
|--------|---------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build (Vercel) |
| `pnpm build:cf` | Cloudflare Pages build |
| `pnpm lint` | ESLint check |
| `pnpm i18n:build` | JSONC → JSON conversion |
| `pnpm i18n:audit` | Check translation coverage |
| `pnpm optimize:images` | Generate WebP variants |
| `pnpm generate:og` | Generate OG images |
| `pnpm perf:test` | Run Lighthouse |

### Build Pipeline

```
pnpm build
  ├── pnpm i18n:build      # Convert JSONC → JSON
  ├── pnpm optimize:images # Generate WebP
  ├── pnpm generate:og     # Generate OG images
  └── next build           # Next.js production build
```

### Cloudflare Build

```
pnpm build:cf
  ├── pnpm i18n:build
  ├── next build           # With output: 'export'
  └── scripts/copy-default-locale.ts  # Copy /en to /
```

Output goes to `/out` for deployment.

---

## Deployment

### Vercel

Standard Next.js deployment:
1. Connect GitHub repo
2. Build command: `pnpm build`
3. Output directory: `.next`

### Cloudflare Pages

Static export deployment:
1. Build command: `pnpm build:cf`
2. Output directory: `out`
3. Configure `wrangler.toml` for edge functions

---

## File Statistics

| Category | Count |
|----------|-------|
| TypeScript/TSX files | 180+ |
| Translation keys (en) | 2,500+ |
| Locales | 24 |
| Feature pages | 7 |
| Platform pages | 7 |
| Platform-feature pages | 21 |
| UI components | 15+ |
| Build scripts | 10 |
| OG images | 51 |

---

## Changes in This PR

### Cleanup Performed

1. **Removed bloat documentation**
   - Deleted 15+ report/audit markdown files
   - Removed `docs/` directory (7 files)
   - Removed `refactor-plan/` directory

2. **Cleaned scripts**
   - Removed 12 one-off migration scripts
   - Removed `scripts/archive/` directory
   - Kept only 10 essential build scripts

3. **Updated .gitignore**
   - Added patterns for `*-report.md`, `*-audit.md`
   - Ignores `messages/` (auto-generated)
   - Ignores `docs/`, `refactor-plan/`

4. **Fixed code issues**
   - Removed unused `statSync` import
   - Fixed unused `error` variable in catch

5. **Rewrote documentation**
   - New `README.md` - developer-focused
   - New `CLAUDE.md` - AI agent navigation

### i18n Migration (Completed Prior)

All 22 content files migrated from hardcoded English to translation keys:
- `lib/content/features/native-performance.ts`
- `lib/content/platforms/reddit.ts`
- 21 nested platform-feature files

1,977 translation entries added to `messages-src/en/index.jsonc`.

### Image Optimization (Completed Prior)

- Created `scripts/optimize-images.ts`
- Generated 56 WebP images
- Added `public/_headers` for Cloudflare caching
- Fixed critical cursor-icon.png (142KB → 1.3KB)

---

## How to Contribute

1. Clone the repository
2. Run `pnpm install`
3. Run `pnpm dev`
4. Make changes
5. Run `pnpm lint` and `pnpm i18n:audit`
6. Submit PR

### Adding Translations

1. Edit `messages-src/en/index.jsonc`
2. Run `pnpm i18n:build`
3. Run `pnpm i18n:audit` to verify

### Adding a Feature Page

1. Create content file in `lib/content/features/`
2. Add to `lib/content/features/index.ts`
3. Add route in `app/[locale]/(marketing)/features/`
4. Add translation keys
5. Update `lib/content/catalog.ts`

---

## License

Private repository. All rights reserved.

<!-- devin-review-badge-begin -->

---

<a href="https://app.devin.ai/review/yigitkonur/website-vibescroll/pull/1">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.devin.ai/assets/gh-open-in-devin-review-dark.svg?v=1">
    <img src="https://static.devin.ai/assets/gh-open-in-devin-review-light.svg?v=1" alt="Open with Devin">
  </picture>
</a>
<!-- devin-review-badge-end -->


<!-- This is an auto-generated comment: release notes by coderabbit.ai -->
## Summary by CodeRabbit

* **Documentation**
  * Major cleanup: updated README and contributor guide; removed many legacy audit/reports and migration/performance docs.

* **Chores**
  * Simplified .gitignore entries and removed legacy middleware/config artifacts and numerous internal scripts/data.

* **Bug Fixes**
  * Improved component lazy-mount behavior to prevent state updates after unmount.
<!-- end of auto-generated comment: release notes by coderabbit.ai --> 
 <div id='description'>
<a href="https://bito.ai#summarystart"></a>
<h3>Summary by Bito</h3>

<p>This PR establishes the complete marketing website for Vibe Scroll, a native desktop application that enables hands-free social media browsing. The website serves as the primary marketing, documentation, and download portal for the application, featuring a comprehensive i18n system supporting 24 locales and a modern tech stack including Next.js 16, Tailwind CSS v4, and Radix UI components.</p>


<details>
<summary><i>Detailed Changes</i></summary>
<ul>

<li>Removed bloat documentation including 15+ report/audit markdown files and docs/ directory</li>

<li>Cleaned scripts by removing 12 one-off migration scripts and scripts/archive/ directory while keeping 10 essential build scripts</li>

<li>Updated .gitignore with patterns for *-report.md, *-audit.md and ignores for messages/, docs/, refactor-plan/</li>

<li>Fixed code issues by removing unused statSync import and fixing unused error variable in catch block</li>

<li>Rewrote documentation with new developer-focused README.md and AI agent navigation guide CLAUDE.md</li>

</ul>
</details>

</div>

## Files Changed

| File | Changes | Comments |
|------|---------|----------|
| `.gitignore` | +11 -13 | 2 |
| `ACCESSIBILITY_FIXES_APPLIED.md` | +0 -321 | 0 |
| `CLAUDE.md` | +117 -129 | 0 |
| `DESIGN_AUDIT.md` | +0 -169 | 0 |
| `I18N_DEEP_AUDIT_REPORT.md` | +0 -233 | 0 |
| `I18N_MIGRATION_COMPLETE.md` | +0 -181 | 0 |
| `PERFORMANCE_OPTIMIZATION_SUMMARY.md` | +0 -287 | 0 |
| `PR_DESCRIPTION.md` | +915 -0 | 0 |
| `README.md` | +78 -20 | 1 |
| `VISUAL_OPTIMIZATION_GUIDE.md` | +0 -390 | 0 |
| `app/[locale]/(marketing)/platforms/[platform]/[feature]/page.tsx` | +1 -1 | 1 |
| `components/lib/LazyMount.tsx` | +4 -5 | 0 |
| `docs/FINAL_PERFORMANCE_SUMMARY.md` | +0 -330 | 0 |
| `docs/I18N_STATUS.md` | +0 -166 | 0 |
| `docs/PERFORMANCE_OPTIMIZATIONS_IMPLEMENTED.md` | +0 -410 | 0 |
| `docs/RADIX_UI_TREE_SHAKING_AUDIT.md` | +0 -196 | 0 |
| `docs/VIDEO_LAZY_LOADING_IMPLEMENTATION.md` | +0 -228 | 0 |
| `docs/VIDEO_OPTIMIZATION_GUIDE.md` | +0 -202 | 0 |
| `docs/i18n-audit-report.md` | +0 -228 | 0 |
| `dutch-translation-summary.md` | +0 -84 | 0 |
| `feature-content-patch.txt` | +0 -102 | 0 |
| `get-missing-translations.ts` | +0 -40 | 0 |
| `i18n-enforcer-report.md` | +0 -474 | 0 |
| `interactive-mockup-report.md` | +0 -560 | 0 |
| `native-perf-insert.txt` | +0 -96 | 0 |
| `performance-report.md` | +0 -581 | 0 |
| `proxy.ts` | +0 -36 | 0 |
| `refactor-plan/README.md` | +0 -164 | 0 |
| `refactor-plan/architecture/03-server-client-component-boundary.md` | +0 -342 | 0 |
| `refactor-plan/architecture/06-routing-architecture.md` | +0 -342 | 0 |
| `refactor-plan/architecture/08-code-organization.md` | +0 -441 | 0 |
| `refactor-plan/components/01-file-size-component-splitting.md` | +0 -271 | 0 |
| `refactor-plan/components/05-icon-system-centralization.md` | +0 -315 | 0 |
| `refactor-plan/content/02-content-data-separation.md` | +0 -354 | 0 |
| `refactor-plan/performance/07-performance-optimization.md` | +0 -760 | 0 |
| `refactor-plan/state-management/04-state-management-refactor.md` | +0 -525 | 0 |
| `retroui-a11y-report.md` | +0 -696 | 0 |
| `scripts/add-content-translations.ts` | +0 -220 | 0 |
| `scripts/add-media-keys-i18n.mjs` | +0 -2129 | 0 |
| `scripts/add-missing-i18n.mjs` | +0 -367 | 0 |
| `scripts/add-missing-ko-translations.ts` | +0 -49 | 0 |
| `scripts/analyze-top30.js` | +0 -37 | 0 |
| `scripts/archive/add-bulgarian-translations.js` | +0 -167 | 0 |
| `scripts/archive/add-portuguese-translations.js` | +0 -156 | 0 |
| `scripts/archive/apply-german-translations.js` | +0 -99 | 0 |
| `scripts/archive/bulgarian-final-translations.js` | +0 -149 | 0 |
| `scripts/archive/bulgarian-translations-comprehensive.js` | +0 -217 | 0 |
| `scripts/archive/complete-german-translation.js` | +0 -301 | 0 |
| `scripts/archive/complete-hungarian-translation.js` | +0 -299 | 0 |
| `scripts/archive/content-translations-generated.json` | +0 -2186 | 0 |
| `scripts/archive/full-german-translations.js` | +0 -35 | 0 |
| `scripts/archive/german-translations-data.json` | +0 -142 | 0 |
| `scripts/filter-country-languages.js` | +0 -58 | 0 |
| `scripts/fix-all-i18n-issues.ts` | +0 -157 | 0 |
| `scripts/fix-content-i18n.ts` | +0 -512 | 0 |
| `scripts/media-session-tone-base64.txt` | +0 -1 | 0 |
| `scripts/media-session-tone.mp3` | +0 -0 | 0 |
| `scripts/optimize-images.ts` | +1 -1 | 0 |
| `scripts/translate-all-locales.ts` | +0 -471 | 0 |
| `scripts/translate-content-comprehensive.ts` | +0 -319 | 0 |
| `scripts/translate-full-content.ts` | +0 -848 | 0 |
| `scripts/translate-hindi-comprehensive.ts` | +0 -241 | 0 |
| `scripts/translate-hindi.ts` | +0 -246 | 0 |
| `scripts/translate-remaining.ts` | +0 -659 | 0 |
| `scripts/translate-thai-batch.ts` | +0 -290 | 0 |
| `spanish-translation-summary.md` | +0 -108 | 0 |
| `translate-ja-untranslated.ts` | +0 -87 | 0 |

## Reviews

### 💬 @copilot-pull-request-reviewer - COMMENTED

## Pull request overview

This pull request performs a major cleanup of the Vibe Scroll marketing website repository by removing temporary documentation, migration scripts, and audit reports while making minor code improvements. Despite being titled "Initial Repository Setup," this is clearly a cleanup operation on an existing, mature codebase with comprehensive functionality.

**Changes:**
- Removed 30+ temporary files including migration scripts, audit reports, and documentation artifacts
- Fixed unused import in `scripts/optimize-images.ts`
- Fixed unused error variable in platform feature page
- Updated `.gitignore` to prevent future documentation bloat
- Rewrote `README.md` and `CLAUDE.md` to be more concise and developer-focused

### Reviewed changes

Copilot reviewed 63 out of 66 changed files in this pull request and generated 2 comments.

<details>
<summary>Show a summary per file</summary>

| File | Description |
| ---- | ----------- |
| `translate-ja-untranslated.ts` | Removed one-off Japanese translation script |
| `spanish-translation-summary.md` | Removed translation summary report |
| `scripts/translate-*.ts` | Removed multiple translation migration scripts (Thai, Hindi) |
| `scripts/optimize-images.ts` | Fixed unused `statSync` import |
| `scripts/fix-all-i18n-issues.ts` | Removed i18n sync script |
| `scripts/filter-country-languages.js` | Removed language filtering utility |
| `scripts/archive/*.js` | Removed archived migration scripts (German, Bulgarian, Portuguese translations) |
| `refactor-plan/**/*.md` | Removed refactor planning documentation (8 files) |
| `docs/**/*.md` | Removed audit reports and optimization guides (7 files) |
| `*.md` (root) | Removed performance reports, i18n status, and design audits (11 files) |
| `app/[locale]/(marketing)/platforms/[platform]/[feature]/page.tsx` | Fixed unused error variable in catch block |
| `.gitignore` | Added patterns to ignore future report/audit files |
| `README.md` | Completely rewritten to be concise and developer-focused |
| `CLAUDE.md` | Simplified agent navigation guide |
</details>






---

💡 <a href="/yigitkonur/website-vibescroll/new/main/.github/instructions?filename=*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href="https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn how to get started</a>.

*2 inline comment(s)*

### 💬 @coderabbitai - COMMENTED

**Actionable comments posted: 2**

<details>
<summary>🤖 Fix all issues with AI agents</summary>

```
In @.gitignore:
- Around line 63-68: The .gitignore entries "docs/", "*-report.md",
"*-audit.md", "*-summary.md" and "refactor-plan/" are too broad and will ignore
any matching files anywhere; update them to be root-scoped or explicit so
legitimate docs and reports aren't silently dropped—replace "docs/" with
"/docs/" (or list specific paths), change "*-report.md", "*-audit.md",
"*-summary.md" to the exact filenames removed (e.g.,
PERFORMANCE_OPTIMIZATION_SUMMARY.md, I18N_DEEP_AUDIT_REPORT.md) or prefix with
"/" to scope to repo root, and similarly scope "refactor-plan/" to
"/refactor-plan/" or enumerate files under it; ensure you edit the .gitignore
patterns that currently read docs/, *-report.md, *-audit.md, *-summary.md, and
refactor-plan/ accordingly.
- Around line 57-61: Add a CI validation job (e.g., job name "i18n-validate")
that checks translations are regenerated before deploy: in the workflow create
steps to checkout code, set up Node and pnpm, run pnpm i18n:build to generate
messages/ (or generate into a temp folder), then diff the regenerated output
against the committed messages/ (or run a small script validate-i18n that
compares messages-src/ → messages/); if any differences exist exit non‑zero to
fail the run so stale messages/ cannot be merged or deployed. Ensure the job
runs on pull requests and pre-deploy branches and documents using the existing
pnpm i18n:build, messages/, and messages-src/ symbols.
```

</details>

<details>
<summary>🧹 Nitpick comments (2)</summary><blockquote>

<details>
<summary>PR_DESCRIPTION.md (1)</summary><blockquote>

`756-806`: **Optional: Add language specifiers to code blocks.**

The Cloudflare headers and build pipeline examples would benefit from language tags for syntax highlighting and linter compliance:


<details>
<summary>📝 Suggested fix</summary>

```diff
-```
+```text
 # public/_headers (Cloudflare)
 /og/*
   Cache-Control: public, max-age=31536000, immutable
```

```diff
-```
+```text
 pnpm build
   ├── pnpm i18n:build      # Convert JSONC → JSON
```

```diff
-```
+```text
 pnpm build:cf
   ├── pnpm i18n:build
```
</details>

</blockquote></details>
<details>
<summary>CLAUDE.md (1)</summary><blockquote>

`40-67`: **Optional: Specify language for directory structure block.**

Static analysis flags the directory structure code block. Using `text` silences the linter:


<details>
<summary>📝 Suggested fix</summary>

```diff
 ### Directory Structure

-```
+```text
 app/[locale]/
 ├── (marketing)/          # Home, about, download, pricing
```
</details>

</blockquote></details>

</blockquote></details>

<!-- This is an auto-generated comment by CodeRabbit for review status -->

*2 inline comment(s)*

### 💬 @devin-ai-integration - COMMENTED

## ✅ Devin Review: No Issues Found

Devin Review analyzed this PR and found no potential bugs to report.

View in Devin Review to see 2 additional flags.

<!-- devin-review-badge-begin -->
<a href="https://app.devin.ai/review/yigitkonur/website-vibescroll/pull/1">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://static.devin.ai/assets/gh-open-in-devin-review-dark.svg?v=1">
    <img src="https://static.devin.ai/assets/gh-open-in-devin-review-light.svg?v=1" alt="Open in Devin Review">
  </picture>
</a>
<!-- devin-review-badge-end -->

### ✅ @bito-code-review - APPROVED

## Discussion

### @coderabbitai (Feb 3, 2026, 12:29 AM)

<details>
<summary>📝 Walkthrough</summary>

## Walkthrough

Large cleanup: removal of many audits, refactor plans, translation scripts/data, and optimization docs; major README/CLAUDE.md rewrites and new PR_DESCRIPTION.md added. Minor code edits: simplified catch clause, LazyMount mount-safety guard, .gitignore cleanup, and removal of Next.js middleware `proxy.ts`.

## Changes

|Cohort / File(s)|Summary|
|---|---|
|**Docs Rewrites & Addition** <br> `README.md`, `CLAUDE.md`, `PR_DESCRIPTION.md`|Rewrote README and CLAUDE.md; added comprehensive `PR_DESCRIPTION.md` consolidating architecture, i18n, deployment, and contributor guidance.|
|**Mass Documentation Deletions** <br> `ACCESSIBILITY_FIXES_APPLIED.md`, `DESIGN_AUDIT.md`, `I18N_DEEP_AUDIT_REPORT.md`, `I18N_MIGRATION_COMPLETE.md`, `PERFORMANCE_OPTIMIZATION_SUMMARY.md`, `VISUAL_OPTIMIZATION_GUIDE.md`, `docs/*`, `retroui-a11y-report.md`, `i18n-enforcer-report.md`, `interactive-mockup-report.md`, `dutch-translation-summary.md`, `spanish-translation-summary.md`|Removed numerous audit, optimization, translation-status, and planning docs across project; no code behavior changes.|
|**Refactor Plan Removal** <br> `refactor-plan/*`|Deleted entire `refactor-plan` directory and all architecture/component/performance/state-management planning docs.|
|**Translation Scripts & Data Removed** <br> `scripts/*`, `scripts/archive/*`, `content-translations-generated.json`, `feature-content-patch.txt`, `native-perf-insert.txt`|Removed 20+ translation automation scripts, archived translation tools/data, and generated translation JSON. Verify no runtime dependency on these scripts.|
|**Performance Reports Removed** <br> `performance-report.md`, `docs/FINAL_PERFORMANCE_SUMMARY.md`, `docs/PERFORMANCE_OPTIMIZATIONS_IMPLEMENTED.md`, `PERFORMANCE_OPTIMIZATION_SUMMARY.md`|Deleted multiple performance reports and guides; implementation code may still exist but docs removed.|
|**Middleware Removal** <br> `proxy.ts`|Removed Next.js middleware that wrapped next-intl middleware and set geo-country cookie. Impact: geo cookie and middleware export (`default proxy`, `config.matcher`) removed — verify routing/middleware replacement.|
|**.gitignore Update** <br> `.gitignore`|Normalized generated-files comment, simplified `messages/` ignore, removed Python/venv patterns, added audit/report ignore patterns.|
|**Minor Code Changes** <br> `app/[locale]/(marketing)/platforms/[platform]/[feature]/page.tsx`, `components/lib/LazyMount.tsx`, `scripts/optimize-images.ts`|Small functional tweaks: bare `catch { }` (removed error binding), LazyMount adds mounted-guard to observer callback, and removed unused statSync import.|
|**Removed Analysis Helpers** <br> `get-missing-translations.ts`, `scripts/analyze-top30.js`, `scripts/filter-country-languages.js`|Deleted analysis and helper scripts used for translation/language prioritization.|

## Estimated code review effort

🎯 3 (Moderate) | ⏱️ ~20 minutes

## Poem
Docs depart like leaves in wind, plans fold away,  
Scripts once humming now sleep in the clay.  
README reborn, a single lantern lit,  
Middleware gone — check cookies, routes that fit.  
Cleaner repo, lighter steps, onward we play.

</details>

<details>
<summary>🚥 Pre-merge checks | ✅ 2 | ❌ 1</summary>

<details>
<summary>❌ Failed checks (1 warning)</summary>

|     Check name     | Status     | Explanation                                                                           | Resolution                                                                         |
| :----------------: | :--------- | :------------------------------------------------------------------------------------ | :--------------------------------------------------------------------------------- |
| Docstring Coverage | ⚠️ Warning | Docstring coverage is 50.00% which is insufficient. The required threshold is 80.00%. | Write docstrings for the functions missing them to satisfy the coverage threshold. |

</details>
<details>
<summary>✅ Passed checks (2 passed)</summary>

|     Check name    | Status   | Explanation                                                                                                                                                                       |
| :---------------: | :------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Description Check | ✅ Passed | Check skipped - CodeRabbit’s high-level summary is enabled.                                                                                                                       |
|    Title check    | ✅ Passed | The PR title clearly and concisely summarizes the main change: establishing the initial repository setup for the Vibe Scroll marketing website with all necessary infrastructure. |

</details>

<sub>✏️ Tip: You can configure your own custom pre-merge checks in the settings.</sub>

</details>

<details>
<summary>✨ Finishing touches</summary>

- [ ]  📝 Generate docstrings
<details>
<summary>🧪 Generate unit tests (beta)</summary>

- [ ]    Create PR with unit tests
- [ ]    Post copyable unit tests in a comment
- [ ]    Commit unit tests in branch `cleanup/codebase-optimization`

</details>

</details>

---

<sub>Comment `@coderabbitai help` to get the list of available commands and usage tips.</sub>

### @bito-code-review (Feb 3, 2026, 01:02 AM)

Code Review Agent Run #cf3135 Actionable Suggestions - 0 Review Details Files reviewed - 31 · Commit Range: 3f3f028..3f3f028 app/[locale]/(marketing)/platforms/[platform]/[feature]/page.tsxfeature-content-patch.txtget-missing-translations.tsnative-perf-insert.txtproxy.tsscripts/add-content-translations.tsscripts/add-media-keys-i18n.mjsscripts/add-missing-i18n.mjsscripts/add-missing-ko-translations.tsscripts/analyze-top30.jsscripts/archive/add-bulgarian-translations.jsscripts/archive/add-portuguese-translations.jsscripts/archive/apply-german-translations.jsscripts/archive/bulgarian-final-translations.jsscripts/archive/bulgarian-translations-comprehensive.jsscripts/archive/complete-german-translation.jsscripts/archive/complete-hungarian-translation.jsscripts/archive/full-german-translations.jsscripts/filter-country-languages.jsscripts/fix-all-i18n-issues.tsscripts/fix-content-i18n.tsscripts/media-session-tone-base64.txtscripts/optimize-images.tsscripts/translate-all-locales.tsscripts/translate-content-comprehensive.tsscripts/translate-full-content.tsscripts/translate-hindi-comprehensive.tsscripts/translate-hindi.tsscripts/translate-remaining.tsscripts/translate-thai-batch.tstranslate-ja-untranslated.ts Files skipped - 34 .gitignore - Reason: Filter setting ACCESSIBILITY_FIXES_APPLIED.md - Reason: Filter setting CLAUDE.md - Reason: Filter setting DESIGN_AUDIT.md - Reason: Filter setting I18N_DEEP_AUDIT_REPORT.md - Reason: Filter setting I18N_MIGRATION_COMPLETE.md - Reason: Filter setting PERFORMANCE_OPTIMIZATION_SUMMARY.md - Reason: Filter setting PR_DESCRIPTION.md - Reason: Filter setting README.md - Reason: Filter setting VISUAL_OPTIMIZATION_GUIDE.md - Reason: Filter setting docs/FINAL_PERFORMANCE_SUMMARY.md - Reason: Filter setting docs/I18N_STATUS.md - Reason: Filter setting docs/PERFORMANCE_OPTIMIZATIONS_IMPLEMENTED.md - Reason: Filter setting docs/RADIX_UI_TREE_SHAKING_AUDIT.md - Reason: Filter setting docs/VIDEO_LAZY_LOADING_IMPLEMENTATION.md - Reason: Filter setting docs/VIDEO_OPTIMIZATION_GUIDE.md - Reason: Filter setting docs/i18n-audit-report.md - Reason: Filter setting dutch-translation-summary.md - Reason: Filter setting i18n-enforcer-report.md - Reason: Filter setting interactive-mockup-report.md - Reason: Filter setting performance-report.md - Reason: Filter setting refactor-plan/README.md - Reason: Filter setting refactor-plan/architecture/03-server-client-component-boundary.md - Reason: Filter setting refactor-plan/architecture/06-routing-architecture.md - Reason: Filter setting refactor-plan/architecture/08-code-organization.md - Reason: Filter setting refactor-plan/components/01-file-size-component-splitting.md - Reason: Filter setting refactor-plan/components/05-icon-system-centralization.md - Reason: Filter setting refactor-plan/content/02-content-data-separation.md - Reason: Filter setting refactor-plan/performance/07-performance-optimization.md - Reason: Filter setting refactor-plan/state-management/04-state-management-refactor.md - Reason: Filter setting retroui-a11y-report.md - Reason: Filter setting scripts/archive/content-translations-generated.json - Reason: Filter setting scripts/archive/german-translations-data.json - Reason: Filter setting spanish-translation-summary.md - Reason: Filter setting Tools Eslint (Linter) - ✔︎ SuccessfulWhispers (Secret Scanner) - ✔︎ SuccessfulDetect-secrets (Secret Scanner) - ✔︎ Successful Bito Usage Guide **Commands** Type the following command in the pull request comment and save the comment. - `/review` - Manually triggers a full AI review. - `/pause` - Pauses automatic reviews on this pull request. - `/resume` - Resumes automatic reviews. - `/resolve` - Marks all Bito-posted review comments as resolved. - `/abort` - Cancels all in-progress reviews. Refer to the documentation for additional commands. **Configuration** This repository uses `full-review` You can customize the agent settings here or contact your Bito workspace admin at yigit@zeo.org. **Documentation & Help** - Customize agent settings - Review rules - General documentation - FAQ AI Code Review powered by

### @copilot-pull-request-reviewer (Feb 3, 2026, 12:32 AM)

## Pull request overview

This pull request performs a major cleanup of the Vibe Scroll marketing website repository by removing temporary documentation, migration scripts, and audit reports while making minor code improvements. Despite being titled "Initial Repository Setup," this is clearly a cleanup operation on an existing, mature codebase with comprehensive functionality.

**Changes:**
- Removed 30+ temporary files including migration scripts, audit reports, and documentation artifacts
- Fixed unused import in `scripts/optimize-images.ts`
- Fixed unused error variable in platform feature page
- Updated `.gitignore` to prevent future documentation bloat
- Rewrote `README.md` and `CLAUDE.md` to be more concise and developer-focused

### Reviewed changes

Copilot reviewed 63 out of 66 changed files in this pull request and generated 2 comments.

<details>
<summary>Show a summary per file</summary>

| File | Description |
| ---- | ----------- |
| `translate-ja-untranslated.ts` | Removed one-off Japanese translation script |
| `spanish-translation-summary.md` | Removed translation summary report |
| `scripts/translate-*.ts` | Removed multiple translation migration scripts (Thai, Hindi) |
| `scripts/optimize-images.ts` | Fixed unused `statSync` import |
| `scripts/fix-all-i18n-issues.ts` | Removed i18n sync script |
| `scripts/filter-country-languages.js` | Removed language filtering utility |
| `scripts/archive/*.js` | Removed archived migration scripts (German, Bulgarian, Portuguese translations) |
| `refactor-plan/**/*.md` | Removed refactor planning documentation (8 files) |
| `docs/**/*.md` | Removed audit reports and optimization guides (7 files) |
| `*.md` (root) | Removed performance reports, i18n status, and design audits (11 files) |
| `app/[locale]/(marketing)/platforms/[platform]/[feature]/page.tsx` | Fixed unused error variable in catch block |
| `.gitignore` | Added patterns to ignore future report/audit files |
| `README.md` | Completely rewritten to be concise and developer-focused |
| `CLAUDE.md` | Simplified agent navigation guide |
</details>






---

💡 <a href="/yigitkonur/website-vibescroll/new/main/.github/instructions?filename=*.instructions.md" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Add Copilot custom instructions</a> for smarter, more guided reviews. <a href="https://docs.github.com/en/copilot/customizing-copilot/adding-repository-custom-instructions-for-github-copilot" class="Link--inTextBlock" target="_blank" rel="noopener noreferrer">Learn how to get started</a>.

### @coderabbitai (Feb 3, 2026, 12:33 AM)

**Actionable comments posted: 2**

<details>
<summary>🤖 Fix all issues with AI agents</summary>

```
In @.gitignore:
- Around line 63-68: The .gitignore entries "docs/", "*-report.md",
"*-audit.md", "*-summary.md" and "refactor-plan/" are too broad and will ignore
any matching files anywhere; update them to be root-scoped or explicit so
legitimate docs and reports aren't silently dropped—replace "docs/" with
"/docs/" (or list specific paths), change "*-report.md", "*-audit.md",
"*-summary.md" to the exact filenames removed (e.g.,
PERFORMANCE_OPTIMIZATION_SUMMARY.md, I18N_DEEP_AUDIT_REPORT.md) or prefix with
"/" to scope to repo root, and similarly scope "refactor-plan/" to
"/refactor-plan/" or enumerate files under it; ensure you edit the .gitignore
patterns that currently read docs/, *-report.md, *-audit.md, *-summary.md, and
refactor-plan/ accordingly.
- Around line 57-61: Add a CI validation job (e.g., job name "i18n-validate")
that checks translations are regenerated before deploy: in the workflow create
steps to checkout code, set up Node and pnpm, run pnpm i18n:build to generate
messages/ (or generate into a temp folder), then diff the regenerated output
against the committed messages/ (or run a small script validate-i18n that
compares messages-src/ → messages/); if any differences exist exit non‑zero to
fail the run so stale messages/ cannot be merged or deployed. Ensure the job
runs on pull requests and pre-deploy branches and documents using the existing
pnpm i18n:build, messages/, and messages-src/ symbols.
```

</details>

<details>
<summary>🧹 Nitpick comments (2)</summary><blockquote>

<details>
<summary>PR_DESCRIPTION.md (1)</summary><blockquote>

`756-806`: **Optional: Add language specifiers to code blocks.**

The Cloudflare headers and build pipeline examples would benefit from language tags for syntax highlighting and linter compliance:

<details>
<summary>📝 Suggested fix</summary>

```diff
-```
+```text
 # public/_headers (Cloudflare)
 /og/*
   Cache-Control: public, max-age=31536000, immutable
```

```diff
-```
+```text
 pnpm build
   ├── pnpm i18n:build      # Convert JSONC → JSON
```

```diff
-```
+```text
 pnpm build:cf
   ├── pnpm i18n:build
```
</details>

</blockquote></details>
<details>
<summary>CLAUDE.md (1)</summary><blockquote>

`40-67`: **Optional: Specify language for directory structure block.**

Static analysis flags the directory structure code block. Using `text` silences the linter:

<details>
<summary>📝 Suggested fix</summary>

```diff
 ### Directory Structure

-```
+```text
 app/[locale]/
 ├── (marketing)/          # Home, about, download, pricing
```
</details>

</blockquote></details>

</blockquote></details>

### @devin-ai-integration (Feb 3, 2026, 12:35 AM)

## ✅ Devin Review: No Issues Found

Devin Review analyzed this PR and found no potential bugs to report.

View in Devin Review to see 2 additional flags.

## Inline Comments

### `app/[locale]/(marketing)/platforms/[platform]/[feature]/page.tsx`

#### @copilot-pull-request-reviewer (Line 57)

```diff
@@ -54,7 +54,7 @@ export async function generateMetadata({
       description: t("description"),
       keywords: t("keywords"),
     };
-  } catch (error) {
+  } catch {
```

The unused error variable in the catch block has been correctly removed. This is a good practice to avoid ESLint warnings for unused variables. However, consider logging errors for debugging purposes in development, or at least add a comment explaining why the error is intentionally ignored.

*(See code suggestion below)*

**Suggestion:**
```suggestion
} catch (error) {
    // Log translation metadata errors in non-production for debugging, but fall back gracefully.
    if (process.env.NODE_ENV !== "production") {
      console.error(
        `Failed to load localized metadata for platform: ${platform}, feature: ${feature}, locale: ${locale}`,
        error,
      );
    }
```

### `README.md`

#### @copilot-pull-request-reviewer (Line 1)

```diff
@@ -1,36 +1,94 @@
-This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).
+# Vibe Scroll Website
 
-## Getting Started
+Marketing website for Vibe Scroll - a native desktop app for hands-free social media browsing.
 
-First, run the development server:
+## Tech Stack
+
+- **Next.js 16** (App Router, React 19)
+- **next-intl** for i18n (24 locales)
+- **Tailwind CSS v4**
+- **Radix UI** primitives
+- **pnpm** package manager
+
+## Quick Start
 
 ```bash
-npm run dev
-# or
-yarn dev
-# or
+pnpm install
 pnpm dev
-# or
-bun dev
 ```
 
-Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
+Open [http://localhost:3000](http://localhost:3000)
+
+## Build Commands
 
-You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
+| Command | Description |
+|---------|-------------|
+| `pnpm dev` | Development server |
+| `pnpm build` | Production build (Vercel) |
+| `pnpm build:cf` | Cloudflare Pages build |
+| `pnpm lint` | ESLint check |
+| `pnpm i18n:audit` | Check for missing translation keys |
 
-This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.
+## Project Structure
+
+```
+app/
+├── [locale]/                    # All routes are locale-prefixed
+│   ├── (marketing)/            # Home, about, download, pricing
+│   │   ├── features/           # Feature pages (auto-scroll, boss-mode, etc.)
+│   │   └── platforms/          # Platform pages (tiktok, youtube, etc.)
+│   ├── (legal)/                # Privacy, terms
+│   └── (support)/              # FAQ, contact
 
-## Learn More
+components/
+├── retroui/                    # Radix-based UI components
+├── sections/                   # Page sections (Hero, Pricing, etc.)
+└── layout/                     # Header, Footer
+
+lib/
+├── content/                    # Page content definitions
+│   ├── features/              # Feature page content
+│   └── platforms/             # Platform page content
+└── icons/                     # Icon registry
+
+messages-src/                   # Translation source files (JSONC)
+messages/                       # Built translations (auto-generated)
+
+scripts/                        # Build utilities
+```
 
-To learn more about Next.js, take a look at the following resources:
+## i18n Workflow
 
-- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
+1. Edit `messages-src/{locale}/index.jsonc`
+2. Run `pnpm i18n:build` (auto-runs with dev/build)
+3. Translations appear in `messages/{locale}/index.json`
+
+Content files use translation keys like `"featureContent.autoScroll.heroTitle"` which resolve at render time.
+
+## Deployment
+
+### Vercel
+```bash
+pnpm build
+# Deploy via Vercel dashboard or CLI
+```
+
+### Cloudflare Pages
+```bash
+pnpm build:cf
+# Outputs to /out directory
+# Configure in wrangler.toml
+```
 
-You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
+## Key Files
 
-## Deploy on Vercel
+| File | Purpose |
+|------|---------|
+| `lib/content/catalog.ts` | Platform/Feature IDs |
+| `lib/content/types.ts` | TypeScript types for content |
+| `i18n/config.ts` | Locale configuration |
+| `public/_headers` | Cloudflare cache rules |
 
-The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
+## Environment
 
-Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
+No environment variables required for development.
```

The PR title describes this as "Initial Repository Setup" but the changes show this is actually a cleanup of an existing, fully-built repository with extensive functionality. The PR removes documentation, reports, and migration scripts from what appears to be a mature codebase. Consider updating the PR title and description to accurately reflect that this is a "Repository Cleanup" or "Documentation Cleanup" rather than initial setup.

### `.gitignore`

#### @coderabbitai (Line 57)

```diff
@@ -54,27 +54,25 @@ Thumbs.db
 coverage/
 .nyc_output/
 
-# Generated files
+# Generated files (rebuilt from source)
 .og-cache.json
 og-metadata.json
 performance-reports/
-messages/  # Generated from messages-src/*.jsonc
+messages/
```

_⚠️ Potential issue_ | _🔴 Critical_

<details>
<summary>🧩 Analysis chain</summary>

🏁 Script executed:

```shell
#!/bin/bash
# Verify messages/ is purely generated and all locales have source files

echo "=== Checking package.json for i18n:build script ==="
if [ -f package.json ]; then
  jq -r '.scripts | to_entries[] | select(.key | contains("i18n")) | "\(.key): \(.value)"' package.json 2>/dev/null || \
  grep -i "i18n" package.json | head -10
else
  echo "package.json not found"
fi

echo -e "\n=== Checking for messages and messages-src directories ==="
[ -d messages ] && echo "✓ messages/ exists" || echo "✗ messages/ not found"
[ -d messages-src ] && echo "✓ messages-src/ exists" || echo "✗ messages-src/ not found"

echo -e "\n=== Locales in messages/ ==="
if [ -d messages ]; then
  ls -1 messages/ 2>/dev/null | head -20
else
  echo "N/A - directory not present"
fi

echo -e "\n=== Locales in messages-src/ ==="
if [ -d messages-src ]; then
  ls -1 messages-src/ 2>/dev/null | head -20
else
  echo "N/A - directory not present"
fi

echo -e "\n=== Git status: is messages/ tracked? ==="
git ls-files messages/ 2>/dev/null | head -3
echo -e "\n=== Git status: is messages-src/ tracked? ==="
git ls-files messages-src/ 2>/dev/null | head -3

echo -e "\n=== Current .gitignore entries for messages ==="
grep -n "messages" .gitignore
```

Repository: yigitkonur/website-vibescroll

Length of output: 925

---

🏁 Script executed:

```shell
#!/bin/bash
# Check for CI/CD workflows and build documentation

echo "=== GitHub workflows ==="
if [ -d .github/workflows ]; then
  ls -1 .github/workflows/
else
  echo "No workflows found"
fi

echo -e "\n=== Checking CI workflow content for i18n:build ==="
if [ -d .github/workflows ]; then
  find .github/workflows -name "*.yml" -o -name "*.yaml" | xargs grep -l "i18n:build\|jsonc-to-json" 2>/dev/null || echo "No i18n:build in workflows"
fi

echo -e "\n=== README or CONTRIBUTING for build steps ==="
[ -f README.md ] && grep -i "build\|messages" README.md | head -10 || echo "README.md not found or no matches"

echo -e "\n=== Check if messages-src is the source of truth in code comments ==="
grep -r "messages-src\|messages/" --include="*.ts" --include="*.js" --include="*.json" scripts/ 2>/dev/null | head -5

echo -e "\n=== What does jsonc-to-json.ts do? ==="
if [ -f scripts/jsonc-to-json.ts ]; then
  head -30 scripts/jsonc-to-json.ts | cat -n
else
  echo "Script not found"
fi
```

Repository: yigitkonur/website-vibescroll

Length of output: 2316

---

</details>

**Add CI enforcement: messages/ must regenerate + validate before deploy.**

messages/ ignore is correct—it's purely built from messages-src/ via `pnpm i18n:build`. Locales match perfectly (20 in each), build script exists, and README documents the pipeline. No manual fixes risk.

**What breaks?** Developer forgets `pnpm i18n:build` locally or CI doesn't validate. Stale translation files (20 locales) ship to prod. Users see untranslated keys or outdated text.

**Blast radius?** All 20 locales + international users see broken translations. Immediate support volume from broken UX + loss of trust in international market.

**Where to fix?**
No CI workflows exist (.github/workflows is empty). Need to add a pre-deploy validation that runs `pnpm i18n:build` and diffs messages/ against regenerated output. Catch stale builds before they land.

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
In @.gitignore around lines 57 - 61, Add a CI validation job (e.g., job name
"i18n-validate") that checks translations are regenerated before deploy: in the
workflow create steps to checkout code, set up Node and pnpm, run pnpm
i18n:build to generate messages/ (or generate into a temp folder), then diff the
regenerated output against the committed messages/ (or run a small script
validate-i18n that compares messages-src/ → messages/); if any differences exist
exit non‑zero to fail the run so stale messages/ cannot be merged or deployed.
Ensure the job runs on pull requests and pre-deploy branches and documents using
the existing pnpm i18n:build, messages/, and messages-src/ symbols.
```

</details>

#### @coderabbitai (Line 63)

```diff
@@ -54,27 +54,25 @@ Thumbs.db
 coverage/
 .nyc_output/
 
-# Generated files
+# Generated files (rebuilt from source)
 .og-cache.json
 og-metadata.json
 performance-reports/
-messages/  # Generated from messages-src/*.jsonc
+messages/
+
+# Audit/Report artifacts (don't commit these)
+*-report.md
+*-audit.md
+*-summary.md
+docs/
+refactor-plan/
```

_⚠️ Potential issue_ | _🟠 Major_

**Overly broad ignore patterns will silently drop legitimate files.**

**What breaks?**
1. Any `docs/` directory anywhere in the repo is ignored (not just root-level)
2. Files like `api-integration-report.md` or `security-audit.md` won't commit—no error, just silent ignore

**Blast radius?** Anyone creating documentation or technical reports loses work without realizing it. Git won't warn them.

**Where else?** Check if you already have:
- Existing docs/ folders (like docs/architecture/ for engineering specs)
- Any markdown files matching those patterns that SHOULD be tracked (business reports, compliance audits)

**Fix:** Scope these patterns to avoid overmatch:

<details>
<summary>🎯 Scoped patterns to prevent accidental ignores</summary>

```diff
 # Audit/Report artifacts (don't commit these)
-*-report.md
-*-audit.md
-*-summary.md
-docs/
-refactor-plan/
+# Performance/optimization snapshot reports
+/PERFORMANCE_*
+/I18N_*
+/*_AUDIT_REPORT.md
+/*_SUMMARY.md
+# Development planning artifacts
+/refactor-plan/
+# Exclude temporary doc snapshots (keep real docs)
+/docs/snapshots/
```

This targets the specific files you removed (PERFORMANCE_OPTIMIZATION_SUMMARY.md, I18N_DEEP_AUDIT_REPORT.md, refactor-plan/*) without nuking all docs or any file ending in -report.md.

</details>

<details>
<summary>📝 Committable suggestion</summary>
‼️ **IMPORTANT**
Carefully review the code before committing. Ensure that it accurately replaces the highlighted code, contains no missing lines, and has no issues with indentation. Thoroughly test & benchmark the code to ensure it meets the requirements.

```suggestion
# Audit/Report artifacts (don't commit these)
# Performance/optimization snapshot reports
/PERFORMANCE_*
/I18N_*
/*_AUDIT_REPORT.md
/*_SUMMARY.md
# Development planning artifacts
/refactor-plan/
# Exclude temporary doc snapshots (keep real docs)
/docs/snapshots/
```

</details>

<details>
<summary>🤖 Prompt for AI Agents</summary>

```
In @.gitignore around lines 63 - 68, The .gitignore entries "docs/",
"*-report.md", "*-audit.md", "*-summary.md" and "refactor-plan/" are too broad
and will ignore any matching files anywhere; update them to be root-scoped or
explicit so legitimate docs and reports aren't silently dropped—replace "docs/"
with "/docs/" (or list specific paths), change "*-report.md", "*-audit.md",
"*-summary.md" to the exact filenames removed (e.g.,
PERFORMANCE_OPTIMIZATION_SUMMARY.md, I18N_DEEP_AUDIT_REPORT.md) or prefix with
"/" to scope to repo root, and similarly scope "refactor-plan/" to
"/refactor-plan/" or enumerate files under it; ensure you edit the .gitignore
patterns that currently read docs/, *-report.md, *-audit.md, *-summary.md, and
refactor-plan/ accordingly.
```

</details>

**Suggestion:**
```suggestion
# Audit/Report artifacts (don't commit these)
-*-report.md
-*-audit.md
-*-summary.md
-docs/
-refactor-plan/
+# Performance/optimization snapshot reports
+/PERFORMANCE_*
+/I18N_*
+/*_AUDIT_REPORT.md
+/*_SUMMARY.md
+# Development planning artifacts
+/refactor-plan/
+# Exclude temporary doc snapshots (keep real docs)
+/docs/snapshots/
```

---
*Generated by pr-consensus v1.0.0 at 2026-02-03T10:17:48.196Z*