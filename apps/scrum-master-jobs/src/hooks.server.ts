/**
 * SvelteKit Server Hooks
 * ======================
 *
 * Handles auth session on every request.
 * Creates a Supabase client and attaches user to event.locals.
 *
 * Usage in +page.server.ts:
 * ```typescript
 * export const load = async ({ locals }) => {
 *   const { user, supabase } = locals;
 *   if (!user) redirect(303, '/login');
 *   const { data } = await supabase.from('jobs').select();
 *   return { jobs: data };
 * };
 * ```
 */

import { createServerClient } from '@supabase/ssr';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	// Create Supabase client for this request
	const supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY, {
		cookies: {
			getAll() {
				return event.cookies.getAll();
			},
			setAll(cookiesToSet) {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	// Get the session (validates and refreshes if needed)
	const {
		data: { session }
	} = await supabase.auth.getSession();

	// Attach to locals for use in load functions and actions
	event.locals.supabase = supabase;
	event.locals.session = session;
	event.locals.user = session?.user ?? null;

	return resolve(event, {
		filterSerializedResponseHeaders(name) {
			// Allow Supabase auth headers through
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
};
