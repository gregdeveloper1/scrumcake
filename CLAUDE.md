# JobBoard Platform - Turborepo Monorepo

## Overview
Multi-site job board ecosystem with independent, sellable sites sharing infrastructure.

```bash
pnpm dev                                    # Run all apps
pnpm dev --filter @jobboard/scrum-master-jobs  # Run specific app
pnpm build                                  # Build all
pnpm check                                  # TypeScript check all
```

---

## Live URLs

| Service | URL |
|---------|-----|
| **Frontend** | https://scrumcake.vercel.app |
| **Vapor API** | https://jobboard-vapor-api.fly.dev |
| **Supabase** | https://rptregzonzdcnaheupcp.supabase.co |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     SvelteKit Frontend                          │
│                  (apps/scrum-master-jobs)                       │
│                     Vercel Deployment                           │
└─────────────────────┬───────────────────────┬───────────────────┘
                      │                       │
                      ▼                       ▼
┌─────────────────────────────┐   ┌───────────────────────────────┐
│      Supabase (Auth + DB)    │   │      Vapor API (Compute)      │
│  • User authentication       │   │  • Job listing & search       │
│  • RLS-protected CRUD        │   │  • Job deduplication          │
│  • Bookmarks, profiles       │   │  • Matching algorithm         │
│  • Articles                  │   │  • Bulk import (admin)        │
│                              │   │  • Full-text search           │
│  supabase.co                 │   │  fly.dev                      │
└─────────────────────────────┘   └───────────────────────────────┘
                      │                       │
                      └───────────┬───────────┘
                                  ▼
                    ┌─────────────────────────┐
                    │   Supabase PostgreSQL   │
                    │   (Shared Database)     │
                    └─────────────────────────┘
```

---

## Project Structure

```
jobboard-platform/
├── apps/
│   └── scrum-master-jobs/       # SvelteKit app (Vercel)
├── packages/
│   ├── types/                   # @jobboard/types - Shared interfaces
│   └── utils/                   # @jobboard/utils - cn(), utilities
├── services/
│   └── vapor-api/               # Vapor 4 backend (Fly.io)
│       ├── Package.swift
│       ├── Dockerfile
│       ├── fly.toml
│       └── Sources/App/
├── turbo.json
├── pnpm-workspace.yaml
└── package.json
```

---

## Quick Start

### Frontend Development
```bash
cd apps/scrum-master-jobs
pnpm dev                         # http://localhost:5173
```

### Vapor API Development
```bash
cd services/vapor-api
swift build
swift run App serve              # http://localhost:8080
curl http://localhost:8080/health
```

---

## Vapor 4 Backend (`services/vapor-api/`)

### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/health` | Public | Health check |
| GET | `/api/v1/jobs` | Public | List jobs (paginated, filtered) |
| GET | `/api/v1/jobs/:id` | Public | Job by ID |
| GET | `/api/v1/jobs/slug/:slug` | Public | Job by slug |
| GET | `/api/v1/jobs/search?q=` | Public | Full-text PostgreSQL search |
| POST | `/api/v1/jobs/bulk` | API Key | Bulk import with deduplication |
| DELETE | `/api/v1/jobs/expired` | API Key | Clean expired jobs |
| GET | `/api/v1/matching/jobs` | JWT | Matched jobs for authenticated user |

### Query Parameters (`/api/v1/jobs`)

| Param | Type | Example |
|-------|------|---------|
| `page` | int | `?page=2` |
| `perPage` | int | `?perPage=10` (max 100) |
| `locationType` | string | `?locationType=Remote` |
| `employmentType` | string | `?employmentType=Full-time` |
| `experienceLevel` | string | `?experienceLevel=Senior` |
| `skills` | string[] | `?skills=Swift&skills=iOS` |
| `search` | string | `?search=scrum` |

### Authentication

**Supabase JWT** (for `/matching` endpoints):
```bash
curl -H "Authorization: Bearer <supabase-access-token>" \
  https://jobboard-vapor-api.fly.dev/api/v1/matching/jobs
```

**API Key** (for admin endpoints):
```bash
curl -H "X-API-Key: jobboard-admin-2025" \
  -X POST https://jobboard-vapor-api.fly.dev/api/v1/jobs/bulk \
  -d '[{"title": "...", "companyName": "...", ...}]'
```

### Project Structure

```
services/vapor-api/Sources/App/
├── entrypoint.swift              # @main async entry
├── configure.swift               # DB, JWT, CORS setup
├── routes.swift                  # Route registration
├── Controllers/
│   ├── JobsController.swift      # CRUD + search + bulk import
│   └── MatchingController.swift  # JWT-protected matching
├── Models/
│   ├── Job.swift                 # Fluent model + enums
│   ├── Company.swift             # Company model
│   └── Profile.swift             # Profile model (read-only)
├── Services/
│   ├── DeduplicationService.swift # SHA-256 content hashing
│   └── MatchingService.swift      # Job-profile scoring
├── Middleware/
│   ├── SupabaseJWTMiddleware.swift # HS256 JWT validation
│   └── APIKeyMiddleware.swift      # X-API-Key header auth
└── DTOs/
    └── JobDTO.swift              # Response types, filters
```

### Environment Variables

```bash
# Required
DATABASE_URL=postgresql://postgres.xxx:password@aws-0-us-west-2.pooler.supabase.com:5432/postgres
SUPABASE_JWT_SECRET=your-jwt-secret-from-dashboard

# Admin
API_KEYS=jobboard-admin-2025
```

### Deployment (Fly.io)

```bash
cd services/vapor-api

# Deploy
fly deploy

# Set secrets
fly secrets set DATABASE_URL="..." SUPABASE_JWT_SECRET="..." API_KEYS="..."

# View logs
fly logs

# Status
fly status
```

### Vapor 5 Migration Notes

All code uses Vapor 5-compatible patterns for easy migration (~Feb 2025):
- `async/await` exclusively (no EventLoopFuture)
- `@Sendable` annotations on route handlers
- `any Database` existential syntax
- No deprecated APIs

---

## Frontend-API Integration

The SvelteKit frontend fetches jobs from Vapor API with fallback chain:

```
Vapor API → Supabase Direct → Mock Data
```

### Jobs Page (`/jobs`)

**File**: `apps/scrum-master-jobs/src/routes/jobs/+page.server.ts`

```typescript
const VAPOR_API_URL = 'https://jobboard-vapor-api.fly.dev';

// Fetches from Vapor API first, falls back to Supabase
const response = await fetch(`${VAPOR_API_URL}/api/v1/jobs`);
const { items, metadata } = await response.json();
```

**Response shape from Vapor:**
```json
{
  "items": [...],
  "metadata": {
    "page": 1,
    "perPage": 20,
    "total": 11,
    "totalPages": 1
  }
}
```

---

## Packages

### @jobboard/types
```typescript
import type { Job, Company, Article, User, Community } from '@jobboard/types';
```

### @jobboard/utils
```typescript
import { cn } from '@jobboard/utils';
import type { WithoutChild, WithElementRef } from '@jobboard/utils';
```

---

## Adding a New Site

1. Copy `apps/scrum-master-jobs` to `apps/new-site-name`
2. Update `package.json` name to `@jobboard/new-site-name`
3. Run `pnpm install`
4. Create new Supabase project or reuse existing
5. Configure environment variables
6. Deploy to Vercel

---

## Key Commands

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all dev servers |
| `pnpm build` | Build all packages and apps |
| `pnpm check` | TypeScript check |
| `swift build` | Build Vapor API |
| `swift run App serve` | Run Vapor locally |
| `fly deploy` | Deploy Vapor to Fly.io |

---

## Environment Variables

### Frontend (Vercel)
```
PUBLIC_SUPABASE_URL=https://rptregzonzdcnaheupcp.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### Vapor API (Fly.io)
```
DATABASE_URL=postgresql://...
SUPABASE_JWT_SECRET=nwH2fg...
API_KEYS=jobboard-admin-2025
```

---

## Phase 2 (Deferred)

- [ ] Web scraping with crawl4ai
- [ ] Background job queues (Redis)
- [ ] Developer-to-developer matching
- [ ] Admin dashboard
- [ ] Email notifications

---

## See Also

- `apps/scrum-master-jobs/CLAUDE.md` - Frontend-specific docs
- `services/vapor-api/.env.example` - Vapor env template
- `packages/types/src/` - Type definitions
