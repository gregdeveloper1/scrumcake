/**
 * OAuth Callback Handler
 * ======================
 *
 * Handles OAuth redirects from Supabase Auth providers (GitHub, Google).
 * Exchanges the code for a session and redirects to home.
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');
	const next = url.searchParams.get('next') ?? '/';

	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			redirect(303, next);
		}
	}

	// If there's an error or no code, redirect to login with error
	redirect(303, '/login?error=auth_callback_failed');
};
