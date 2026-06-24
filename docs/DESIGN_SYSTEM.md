# PageCue — Design System

## Visual principles

Calm, literary, editorial. Paper-inspired warmth over corporate-dashboard chrome. Generous spacing over density. Restrained motion over decoration. No chat-bubble UI for the recap — it reads like a page, not a conversation.

Avoid: gradients, glowing "AI" effects, glassmorphism, heavy drop shadows, dense tables, carousels, small or low-contrast text.

## Tokens

Defined as CSS variables in `src/app/globals.css` using Tailwind v4's `@theme` directive, then exposed via Tailwind utility classes (`bg-surface`, `text-foreground`, etc.) through `@theme inline` mappings. Both a `:root` (light) and `.dark` block are defined; theme switching toggles the `dark` class on `<html>`.

| Token                         | Light                   | Dark                                 | Used for                      |
| ----------------------------- | ----------------------- | ------------------------------------ | ----------------------------- |
| `--background`                | warm ivory              | deep charcoal-brown                  | page background               |
| `--surface`                   | paper white             | raised charcoal                      | cards, panels                 |
| `--surface-elevated`          | slightly brighter paper | lighter raised charcoal              | modals, popovers              |
| `--foreground`                | charcoal                | warm off-white                       | primary text                  |
| `--muted`                     | soft parchment grey     | muted charcoal                       | secondary surfaces            |
| `--muted-foreground`          | warm grey               | warm grey-blue                       | secondary text                |
| `--border`                    | warm light grey         | low-contrast warm grey               | dividers, outlines            |
| `--primary`                   | brand navy (`#1c2a66`)  | brand teal (`#34d8c8`)               | primary actions, links        |
| `--primary-foreground`        | near-white              | near-black teal tint                 | text on primary               |
| `--accent`                    | brand teal (`#0e8c8a`)  | lighter brand teal (`#4fd8d4`)       | brand highlight (recap badge) |
| `--accent-foreground`         | near-white              | near-black teal tint                 | text on accent                |
| `--success`                   | subdued green           | subdued green (lighter)              | confirmations                 |
| `--warning`                   | warm amber              | warm amber (lighter)                 | approximate/uncertain states  |
| `--danger`                    | restrained brick red    | restrained red (lighter)             | errors, destructive actions   |
| `--focus-ring`                | high-contrast navy      | high-contrast amber                  | focus indicator               |
| `--radius-sm/md/lg`           | 6 / 10 / 16px           | same                                 | corner radius scale           |
| `--shadow-sm/md`              | soft, low-opacity       | soft, low-opacity, slightly stronger | depth                         |
| `--motion-fast/standard/slow` | 120 / 200 / 360ms       | same                                 | animation durations           |

## Typography

- **Editorial serif** (`--font-serif`, system-fallback-first, e.g. Georgia/"Iowan Old Style"/serif stack via `next/font` if a webfont is later added) for the wordmark, page headings, recap headings, and book titles.
- **Sans-serif** (`--font-sans`, system UI stack) for navigation, buttons, forms, metadata, and utility text.
- No client-blocking large font payload in Phase 1; system font stacks are used until a deliberate, performance-budgeted webfont decision is made.

## Components

Built incrementally under `src/components/{book,layout,progress,recap,shelf,ui}`. Phase 1 introduces a small shared `ui` set (Button, Card, Badge, Field) rather than pulling in a full shadcn/ui install up front, to avoid unused generated component bloat before there are real consumers; shadcn/ui primitives can be added selectively as concrete needs arise, per build prompt §9.

## Motion

Used sparingly and only for: bookmark/progress movement, soft page transitions, recap section reveal, cover hover lift. All transition durations reference `--motion-*` tokens. `prefers-reduced-motion: reduce` disables non-essential transitions globally via a CSS media query in `globals.css`.

## Accessibility

See `docs/ACCESSIBILITY.md`. Design-system-level commitments: minimum AA contrast for all token pairings, a visible 2px focus ring using `--focus-ring` (never `outline: none` without replacement), and no information conveyed by color alone (icons/text accompany status colors).

## Light and dark themes

Both themes are first-class, not an inverted afterthought — token values are tuned independently per theme rather than mechanically inverted, particularly for `--warning`/`--danger` which need to stay legible on dark surfaces.

## Mobile behavior

Mobile-first layout: single-column by default, responsive navigation that collapses to a bottom or top bar rather than a full-screen-covering sidebar, and touch targets sized ≥44px per build prompt §27.
