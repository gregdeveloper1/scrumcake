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
- **Packages**: TypeScript, shared as workspace dependencies

---

## See Also
- `apps/scrum-master-jobs/CLAUDE.md` - App-specific documentation
- `packages/types/src/` - Type definitions
- `packages/utils/src/` - Utility functions
