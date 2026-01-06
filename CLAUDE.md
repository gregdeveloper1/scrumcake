# JobBoard Platform - Turborepo Monorepo

## Overview
Multi-site job board ecosystem with 5 independent, sellable sites sharing infrastructure.

```bash
pnpm dev                                    # Run all apps
pnpm dev --filter @jobboard/scrum-master-jobs  # Run specific app
pnpm build                                  # Build all
pnpm check                                  # TypeScript check all
```

---

## Structure

```
jobboard-platform/
├── apps/
│   └── scrum-master-jobs/    # SvelteKit app (first site)
├── packages/
│   ├── types/                # @jobboard/types - Shared interfaces
│   └── utils/                # @jobboard/utils - cn(), TypeScript utilities
├── turbo.json                # Turborepo config
├── pnpm-workspace.yaml       # Workspace config
└── package.json              # Root scripts
```

---

## Packages

### @jobboard/types
Shared TypeScript interfaces:
```typescript
import type { Job, Company, Article, User, Community } from '@jobboard/types';
```

### @jobboard/utils
Shared utilities:
```typescript
import { cn } from '@jobboard/utils';
import type { WithoutChild, WithElementRef } from '@jobboard/utils';
```

---

## Adding a New Site

1. Copy `apps/scrum-master-jobs` to `apps/new-site-name`
2. Update `package.json` name to `@jobboard/new-site-name`
3. Run `pnpm install`
4. Create new Supabase project for auth + data
5. Configure environment variables

---

## Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all dev servers |
| `pnpm dev --filter @jobboard/scrum-master-jobs` | Start specific app |
| `pnpm build` | Build all packages and apps |
| `pnpm check` | TypeScript check |
| `pnpm clean` | Clean all build artifacts |

---

## Tech Stack
- **Monorepo**: Turborepo + pnpm workspaces
- **Frontend**: SvelteKit 5, Svelte 5, shadcn-svelte, Tailwind v4
- **Backend**: Supabase (Auth + Postgres + RLS)
- **Deployment**: Vercel
- **Packages**: TypeScript, shared as workspace dependencies

---

## Frontend Design System

### Design Principles

1. **Clean & Minimal** - Generous whitespace, clear hierarchy, no visual clutter
2. **Accessible First** - WCAG 2.1 AA compliance, keyboard navigation, screen reader support
3. **Responsive** - Mobile-first design, fluid layouts, adaptive components
4. **Consistent** - Reuse components, follow established patterns, unified spacing scale
5. **Fast** - Lazy loading, optimized images, minimal JavaScript

### Component Patterns

```svelte
<!-- Always use shadcn-svelte components -->
import { Button } from '$lib/components/ui/button';
import * as Card from '$lib/components/ui/card';
import * as Avatar from '$lib/components/ui/avatar';
import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

<!-- Use cn() for conditional classes -->
import { cn } from '$lib/utils';
<div class={cn('base-class', condition && 'conditional-class')} />
```

### Spacing Scale (Tailwind)

| Size | Class | Use Case |
|------|-------|----------|
| 4px | `p-1` | Tight spacing (icons, badges) |
| 8px | `p-2` | Compact elements |
| 12px | `p-3` | Default component padding |
| 16px | `p-4` | Card padding, section gaps |
| 24px | `p-6` | Large section spacing |
| 32px | `p-8` | Page sections |

### Typography

- **Headings**: `text-3xl font-bold` (h1), `text-2xl font-semibold` (h2), `text-xl font-medium` (h3)
- **Body**: `text-base` (default), `text-sm` (secondary), `text-xs` (captions)
- **Colors**: `text-foreground` (primary), `text-muted-foreground` (secondary)

### Color Usage

| Color | Variable | Use Case |
|-------|----------|----------|
| Primary | `bg-primary` | CTAs, active states, links |
| Muted | `bg-muted` | Backgrounds, disabled states |
| Destructive | `bg-destructive` | Errors, delete actions |
| Border | `border-border` | Dividers, card borders |
| Card | `bg-card` | Elevated surfaces |

### Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

### Accessibility Checklist

- [ ] All images have `alt` text
- [ ] Buttons have accessible labels (`aria-label` if icon-only)
- [ ] Forms have associated labels
- [ ] Color contrast ratio ≥ 4.5:1
- [ ] Focus states visible on all interactive elements
- [ ] Keyboard navigation works (Tab, Enter, Escape)

### Animation Guidelines

- Use `transition-colors` for hover states (150ms default)
- Use `transition-all` sparingly (can cause layout thrashing)
- Prefer CSS transitions over JavaScript animations
- Respect `prefers-reduced-motion` media query

---

## Deployment

### URLs
- **Production**: https://scrumcake.vercel.app
- **Supabase**: https://rptregzonzdcnaheupcp.supabase.co

### Environment Variables (Vercel)
```
PUBLIC_SUPABASE_URL
PUBLIC_SUPABASE_ANON_KEY
```

---

## See Also
- `apps/scrum-master-jobs/CLAUDE.md` - App-specific documentation
- `packages/types/src/` - Type definitions
- `packages/utils/src/` - Utility functions
