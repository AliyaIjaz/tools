# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # start dev server (defaults to localhost:3000)
npm run build    # production build + type check + lint
npm run lint     # run ESLint
```

No test suite is configured yet.

## Stack

- **Next.js 15** with App Router (`app/` directory)
- **React 19**, **TypeScript** strict mode, path alias `@/*` → repo root
- **Tailwind CSS v4** (configured via `postcss.config.mjs`; `@import "tailwindcss"` in `globals.css`)
- **Lucide React** for icons
- **clsx + tailwind-merge** → `cn()` helper in `lib/utils.ts`
- **marked + dompurify** for Markdown (text tools)
- **diff** npm package for line diffing (diff-viewer)
- **jszip** for zip downloads (favicon generator, future)

## Architecture

### Site structure

ToolKit is a multi-category browser-only utility site. All tools run client-side — no backend.

```
lib/
  types.ts        ← Category + ToolDefinition types
  constants.ts    ← CATEGORIES record (label, color, icon, href per category)
  tools.ts        ← TOOLS[] master registry + AVAILABLE_HREFS set + helpers
  utils.ts        ← cn(), copyToClipboard(), downloadBlob(), formatBytes()

components/
  layout/
    Navbar.tsx    ← sticky dark top nav, active route highlighting ("use client")
    Footer.tsx    ← server component
  ui/
    ToolCard.tsx  ← glassmorphism link card ("use client" — uses style tags for hover)
    ToolLayout.tsx← breadcrumb + title + related tools strip (server component)
    CopyButton.tsx← clipboard copy with 2s checkmark state ("use client")
    Tabs.tsx      ← controlled pill tabs ("use client")
    Textarea.tsx  ← styled textarea with optional label/count ("use client")

app/
  layout.tsx      ← root layout: Navbar + Footer wrapping <main>
  page.tsx        ← home: hero + search + 4 category sections ("use client")
  globals.css     ← Tailwind v4 + dark theme CSS vars + category color tokens
  not-found.tsx   ← 404 page ("use client")
  dev/            ← Developer Tools (8 tools, all built)
  text/           ← Text Tools (planned, not built yet)
  web/            ← Web Dev Tools (planned, not built yet)
  image/          ← Image Tools (planned, not built yet)
```

### Adding a new tool

1. Add an entry to `TOOLS[]` in `lib/tools.ts`
2. Add the route to `AVAILABLE_HREFS` in `lib/tools.ts`
3. Create `app/<category>/<tool-id>/page.tsx` with `'use client'` and use `<ToolLayout>`
4. All listings (home, category page, search, related) update automatically from the registry

### Theme

Dark-always (no system preference). CSS custom properties in `globals.css`:
- `--background` / `--foreground` / `--surface` / `--surface-hover` / `--border` / `--border-hover`
- `--color-image` (blue), `--color-dev` (violet), `--color-web` (emerald), `--color-text-tool` (amber)
- `--color-<category>-dim` variants for icon backgrounds

### Lucide icon casting

Dynamic icon lookup requires `as unknown as Record<string, ComponentType<...>>`. Pattern used in `ToolCard`, `ToolLayout`, and `app/page.tsx`.

## Image Tools — Typography & Visibility Standards

These values are the current standard across all `app/image/` tool pages and `components/ui/FileDropZone.tsx`. Match them when adding new image tools or editing existing ones.

### FileDropZone (`components/ui/FileDropZone.tsx`)
- Drop zone: `aspectRatio: '4/3'`, `width: '50%'`, centered, `border: 2px dashed var(--color-image)` always
- Upload icon: `size={28}`, color `var(--color-image)`
- Label text: `text-base font-semibold`, `rgba(255,255,255,0.9)`
- Hint text: `text-sm`, `var(--color-image)`

### Text sizes in image tool pages
| Role | Size class | Opacity / color |
|---|---|---|
| File name / primary label | `text-base font-semibold` | `text-white` |
| Body / info text | `text-base` | `rgba(255,255,255,0.75–0.85)` |
| Secondary info (dims, size) | `text-sm` | `rgba(255,255,255,0.65)` |
| Section labels (Quality, Convert to…) | `text-sm font-medium` | `rgba(255,255,255,0.7)` |
| Muted / tertiary text | `text-sm` | `rgba(255,255,255,0.6)` |
| Change / Reset buttons | `text-sm` | `rgba(255,255,255,0.65)` |
| Slider end labels | `text-sm` | `rgba(255,255,255,0.6)` |
| Monospace values (px, %) | `text-base font-mono` | `rgba(255,255,255,0.95)` or `text-white` |

### What NOT to use
- `text-xs` — too small; minimum is `text-sm` anywhere visible
- Opacity below `0.6` for any readable text
- `rgba(255,255,255,0.25–0.4)` — was the old standard, now replaced

## Input & Textarea — Border & Placeholder Standards

These values apply to **all tool pages** (dev, text, web, image). Match when adding or editing any tool with inputs or textareas.

### CSS variables (globals.css)
| Variable | Value | Use |
|---|---|---|
| `--border` | `rgba(255,255,255,0.2)` | Generic neutral idle border (avoid in tool pages) |
| `--border-hover` | `rgba(255,255,255,0.32)` | Generic neutral active border (avoid in tool pages) |
| `--border-focus` | `rgba(255,255,255,0.55)` | Generic sharp focus (avoid in tool pages) |
| `--border-dev-idle` | `oklch(0.6 0.2 290 / 0.22)` | Dev tool idle borders |
| `--border-dev` | `oklch(0.6 0.2 290 / 0.35)` | Dev tool active/input borders |
| `--border-image-idle` | `oklch(0.6 0.2 240 / 0.22)` | Image tool idle borders |
| `--border-image` | `oklch(0.6 0.2 240 / 0.35)` | Image tool active/input borders |
| `--border-web-idle` | `oklch(0.6 0.18 160 / 0.22)` | Web tool idle borders |
| `--border-web` | `oklch(0.6 0.18 160 / 0.35)` | Web tool active/input borders |
| `--border-text-idle` | `oklch(0.7 0.18 80 / 0.22)` | Text tool idle borders |
| `--border-text` | `oklch(0.7 0.18 80 / 0.35)` | Text tool active/input borders |

### Textarea / input borders — per category
Every tool's borders must use its category brand color, not neutral white. Pattern:

| Category | Idle (container/card) | Input idle | onFocus | onBlur |
|---|---|---|---|---|
| dev | `var(--border-dev-idle)` | `var(--border-dev)` | `var(--color-dev)` | `var(--border-dev-idle)` |
| text | `var(--border-text-idle)` | `var(--border-text)` | `var(--color-text-tool)` | `var(--border-text-idle)` |
| web | `var(--border-web-idle)` | `var(--border-web)` | `var(--color-web)` | `var(--border-web-idle)` |
| image | `var(--border-image-idle)` | `var(--border-image)` | `var(--color-image)` | `var(--border-image-idle)` |

- Always use `2px solid` — never `1px solid` for interactive inputs
- onBlur restores to the **idle** variant so borders stay visible when unfocused
- Error/success borders stay as-is (red/green semantic colors)

### Placeholder text
- Tailwind class: `placeholder:text-white/50` — never below `/50`
- Old values `/20`, `/15`, `/25`, `/30` are too dim — do not use

### What NOT to use for inputs
- `1px solid` borders on interactive inputs — too thin to see on dark backgrounds
- `placeholder:text-white/20` or any value below `/50`
- Neutral `rgba(255,255,255,...)` borders inside category tool pages — use the brand-colored CSS vars instead

### Server vs client components

- Tool pages: always `'use client'` (interactive)
- `ToolCard`: `'use client'` (uses `<style>` tag for hover; can't use `onMouseEnter` in server components)
- `Navbar`: `'use client'` (needs `usePathname`)
- `ToolLayout`, `Footer`, category `layout.tsx` / `page.tsx`: server components (no interactivity)
- Never put `onMouseEnter`/`onMouseLeave` in server components — use CSS hover via Tailwind or `<style>` tags
