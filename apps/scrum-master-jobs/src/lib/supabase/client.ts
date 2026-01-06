/**
 * Supabase Client Setup
 * =====================
 *
 * Creates Supabase clients for browser and server contexts.
 * Uses @supabase/ssr for proper cookie handling in SvelteKit.
 *
 * Usage:
 * ```typescript
 * // In +page.svelte or components
 * import { supabase } from '$lib/supabase/client';
 * const { data } = await supabase.from('jobs').select();
 *
 * // In +page.server.ts or +server.ts
 * import { createServerClient } from '$lib/supabase/client';
 * const supabase = createServerClient(cookies);
 * ```
 */

import { createBrowserClient, createServerClient as createSSRServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Cookies } from '@sveltejs/kit';

/**
 * Browser client - use in Svelte components
 * Automatically handles auth state and token refresh
 */
export const supabase = createBrowserClient(
	PUBLIC_SUPABASE_URL,
	PUBLIC_SUPABASE_ANON_KEY
);

/**
 * Server client factory - use in server routes and load functions
 * Requires cookies for auth session handling
 *
 * @param cookies - SvelteKit cookies object from RequestEvent
 * @returns Supabase client configured for server-side use
 */
export function createServerClient(cookies: Cookies) {
	return createSSRServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});
}

/**
 * Type exports for Supabase
 */
export type { User, Session } from '@supabase/supabase-js';
