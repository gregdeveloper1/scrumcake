# Database Setup

## Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Name it `scrum-master-jobs` (or similar)
3. Choose a strong database password and save it
4. Wait for the project to initialize (~2 minutes)

## Run Migrations

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy the contents of `supabase/migrations/001_initial_schema.sql`
4. Click **Run** (or Cmd+Enter)
5. Verify tables were created in **Table Editor**

## Get Your Keys

1. Go to **Settings** > **API**
2. Copy these values to your `.env.local`:

```bash
# Public (safe to expose)
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJ...

# Secret (server-side only)
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

## Tables Created

| Table | Description |
|-------|-------------|
| `profiles` | User profiles (auto-created on signup) |
| `companies` | Company listings |
| `jobs` | Job postings with deduplication |
| `bookmarks` | Saved jobs per user |
| `articles` | Community feed posts |
| `matches` | Developer-to-developer matching |
| `linked_accounts` | Cross-site account linking |

## Row Level Security (RLS)

All tables have RLS enabled with these patterns:
- **Public read** for jobs, companies, articles, profiles
- **User owns their data** for bookmarks, matches, linked_accounts
- **Admin role** for managing companies and jobs

## Enums

```sql
location_type: 'Remote' | 'Hybrid' | 'On-site'
employment_type: 'Full-time' | 'Part-time' | 'Contract' | 'Internship'
experience_level: 'Entry' | 'Mid' | 'Senior' | 'Lead' | 'Executive'
match_action: 'like' | 'pass' | 'superlike'
```
