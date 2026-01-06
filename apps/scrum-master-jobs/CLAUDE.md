# Jobs - SvelteKit 5 Job Board Platform

## Overview
- **Stack:** SvelteKit 5, Svelte 5, shadcn-svelte (bits-ui), Tailwind CSS v4
- **Purpose:** Multi-site job board ecosystem (5 sites: Scrum Master, iOS, Kotlin, Shopify, Alt Protein Jobs)
- **Themes:** Zinc (default B&W), Cursor, Catppuccin, Midnight, Cupertino, JetBrains, Airbnb

```bash
npm run dev      # Development server
npm run build    # Production build
npm run check    # Type checking
```

---

## CRITICAL: Svelte 5 Runes (NOT Svelte 4)

```svelte
<script lang="ts">
  let count = $state(0);                    // State
  let doubled = $derived(count * 2);        // Derived
  $effect(() => { console.log(count); });   // Effect

  interface Props { title: string; }
  let { title }: Props = $props();          // Props
</script>

<button onclick={() => count++}>Click</button>  <!-- onclick NOT on:click -->

{#snippet header()}<h1>Title</h1>{/snippet}     <!-- Snippets NOT slots -->
{@render header()}
```

---

## shadcn-svelte Components

```typescript
import { Button } from '$lib/components/ui/button';
import * as Card from '$lib/components/ui/card';  // <Card.Root>, <Card.Header>
import { cn } from '$lib/utils';
```

**Dropdown pattern:**
```svelte
<DropdownMenu.Root>
  <DropdownMenu.Trigger>
    {#snippet child({ props })}<Button {...props}>Open</Button>{/snippet}
  </DropdownMenu.Trigger>
  <DropdownMenu.Content><DropdownMenu.Item>Action</DropdownMenu.Item></DropdownMenu.Content>
</DropdownMenu.Root>
```

---

## File Structure

```
src/
├── lib/
│   ├── components/ui/        # shadcn-svelte primitives
│   ├── components/layout/    # Sidebars, navigation
│   ├── components/jobs/      # JobCard, JobDetail, JobFilters
│   ├── stores/               # theme.svelte.ts, navigation.svelte.ts
│   └── data/                 # Mock data (articles, jobs, videos)
└── routes/
    ├── jobs/                 # LinkedIn-style job board
    ├── matching/             # Tinder-style developer matching
    ├── videos/               # TikTok-style feed
    ├── maps/                 # Google Maps + restaurants
    ├── askai/                # AI chat interface
    └── [username]/[slug]/    # Article detail
```

---

## Routes

| Route | Layout | Route | Layout |
|-------|--------|-------|--------|
| `/` | 3-column | `/jobs` | Split view |
| `/matching` | Card stack | `/videos` | Player + playlist |
| `/maps` | Map + list | `/askai` | Chat |

---

## Theme System

7 themes via CSS vars on `data-theme`. Use: `getTheme()`, `setTheme()`, `initTheme()` from `$lib/stores/theme.svelte`.

| Theme | Font | Theme | Font |
|-------|------|-------|------|
| zinc | Geist | cupertino | SF Pro |
| cursor | CursorGothic | jetbrains | Product Sans |
| catppuccin | Geist | airbnb | Cereal |

---

## Troubleshooting

1. **Theme not persisting** → Call `initTheme()` in `onMount()`
2. **$derived returning function** → Call it: `items()` not `items`
3. **Route params undefined** → Use `page.params.slug ?? ''`

---

# Project Roadmap

## Vision
5 independent, sellable job board sites sharing infrastructure via Turborepo monorepo. Template updates propagate to all sites.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | SvelteKit 5 + SSR, shadcn-svelte, Tailwind v4, Geist font |
| Backend | Vapor (Swift) - API, scraping, matching |
| Database | Supabase Postgres + Row Level Security (1 project per site) |
| Auth | Supabase Auth per site + optional cross-site linking |
| Scraping | crawl4ai (LinkedIn, Indeed, niche boards, company pages) |
| Hosting | Vercel |
| Mobile (future) | Skip Fuse (SwiftUI → Android) |

## Architecture

```
jobboard-platform/
├── packages/           # @jobboard/ui, types, api-client, supabase, config, utils
├── apps/               # 5 SvelteKit apps (scrum-master, ios, kotlin, shopify, alt-protein)
├── services/vapor-api/ # Swift backend
├── database/supabase/  # Migrations (per-site)
└── mobile/             # Future iOS/Android
```

### Auth Model: Independent + Optional Linking (Sellable)

Each site has its **own Supabase project** (auth + data). This makes each site independently sellable - buyer gets the complete system with no dependencies.

```
┌─────────────┐  ┌─────────────┐  ┌─────────────┐
│ Scrum Jobs  │  │  iOS Jobs   │  │ Kotlin Jobs │  ...
│ Auth + DB   │◄─┼─►Auth + DB  │◄─┼─►Auth + DB  │
│ (1 project) │  │ (1 project) │  │ (1 project) │
└─────────────┘  └─────────────┘  └─────────────┘
      ▲                                    ▲
      └────────── Optional Link ───────────┘
```

**Why this approach:**
- **Sellable:** Transfer entire Supabase project to buyer. Clean break, no dependencies.
- **Optional SSO:** Users can link accounts across sites via email verification
- **Cross-site features:** "Import profile from iOS Jobs" works via API with user consent
- **On sale:** Delete `linked_accounts` table. Users keep their accounts, just unlinked.

### Account Linking Schema

```sql
-- Each site has this table
CREATE TABLE linked_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  linked_site TEXT NOT NULL,        -- e.g., 'ios-jobs', 'kotlin-jobs'
  linked_user_id UUID NOT NULL,     -- user_id on the other site
  linked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, linked_site)
);

-- RLS: users can only see/manage their own links
ALTER TABLE linked_accounts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Own links" ON linked_accounts FOR ALL USING (auth.uid() = user_id);
```

### Cross-Site Profile Import

```typescript
// User clicks "Import profile from iOS Jobs"
async function importProfile(consentToken: string) {
  const profile = await fetch('https://iosjobs.com/api/v1/export-profile', {
    headers: { Authorization: `Bearer ${consentToken}` }
  });
  // Copy relevant data (skills, bio, experience) to local profile
}
```

**DB Schema (per site):** `companies`, `jobs` (content_hash dedup), `profiles`, `bookmarks`, `articles`, `matches`, `linked_accounts`

---

## Security (#1 Priority)

### Environment Variables
```bash
# SAFE (server-only)               # SAFE (public)
SUPABASE_SERVICE_ROLE_KEY=xxx      PUBLIC_SUPABASE_URL=xxx
STRIPE_SECRET_KEY=xxx              PUBLIC_SUPABASE_ANON_KEY=xxx
ANTHROPIC_API_KEY=xxx

# DANGEROUS - Never use for secrets
VITE_SECRET_KEY=xxx  # ❌ Exposed to client!
```

### Pre-Commit Security Check
```bash
gitleaks detect --source . --verbose  # Install: brew install gitleaks
```

### Security Rules
1. Never commit API keys (use `.env.local`)
2. RLS enabled on ALL Supabase tables
3. Vapor validates all JWTs
4. Sanitize all user input
5. No `{@html}` without sanitization
6. Weekly `npm audit` + dependency updates

### RLS Pattern
```sql
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON jobs FOR SELECT USING (true);
CREATE POLICY "Own data" ON bookmarks FOR ALL USING (auth.uid() = user_id);
```

---

## Code Quality

### File Headers (Required)
```svelte
<!-- ComponentName.svelte - One-line description
     Props: job: Job, selected: boolean
     Usage: <ComponentName {job} {selected} /> -->
```

### Section Comments
```svelte
<script lang="ts">
  // ============ IMPORTS ============
  // ============ PROPS ============
  // ============ STATE ============
  // ============ HANDLERS ============
</script>
```

### Naming Conventions
| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `JobCard.svelte` |
| Functions | camelCase | `formatSalary()` |
| Constants | SCREAMING_SNAKE | `MAX_PAGE_SIZE` |
| DB tables | snake_case | `job_bookmarks` |

### Quality Checklist
- [ ] Header comments on all files
- [ ] JSDoc on exported functions
- [ ] No `any` types, no magic numbers
- [ ] No `console.log` or commented-out code

---

## SEO Strategy

### Programmatic Pages
```
/jobs/[role]-[location]    → /jobs/scrum-master-san-francisco
/jobs/[role]-remote        → /jobs/agile-coach-remote
/companies/[slug]/jobs     → /companies/stripe/jobs
```

### JSON-LD (every job page)
```json
{ "@type": "JobPosting", "title": "...", "hiringOrganization": {...}, "baseSalary": {...} }
```

### Technical SEO
- SSR for all pages, optimized Core Web Vitals
- XML sitemaps, robots.txt, canonical URLs
- Dynamic meta tags + Open Graph images
- Google Search Console integration

---

## Key Features
- Community switcher (5 sites)
- Companies table + detail pages
- Job deduplication via content_hash
- Bookmarks/save feature
- dev.to style articles
- Developer-to-developer matching
- Client dashboard ($199 job posting) - later

---

## Implementation Phases

### Phase 1: Foundation → MVP
Initialize Turborepo, extract shared packages, set up Scrum Master Jobs Supabase (auth + data), Vapor backend, deploy to Vercel

### Phase 2: Core Features
Companies module, crawl4ai scraping, user profiles, matching feature

### Phase 3: SEO
Programmatic routes, JSON-LD, sitemaps, Search Console

### Phase 4: Multi-Site
Site scaffolding script (creates new Supabase project per site), launch all 5 sites, site switcher, optional account linking

### Phase 5: Monetization
Client dashboard, Stripe, employer talent search, mobile apps

---

## UI Guidelines
- **Default:** Black & white (zinc theme), Geist font
- **Feed:** List view with square thumbnail on right
- **Style:** Minimal, dev.to/Reddit inspired
- **Components:** 100% shadcn-svelte
