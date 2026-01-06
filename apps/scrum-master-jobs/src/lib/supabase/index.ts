/**
 * Supabase Module
 * ===============
 *
 * Re-exports all Supabase utilities from a single entry point.
 *
 * Usage:
 * ```typescript
 * import { supabase, createServerClient } from '$lib/supabase';
 * import type { Job, Company, Profile } from '$lib/supabase';
 * ```
 */

export { supabase, createServerClient } from './client';
export type { User, Session } from './client';
export type * from './types';
