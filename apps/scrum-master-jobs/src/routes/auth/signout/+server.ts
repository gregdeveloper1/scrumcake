/**
 * Sign Out Handler
 * ================
 *
 * Signs out the authenticated user and redirects to home.
 *
 * Security:
 * - Only accepts POST requests (prevents CSRF via GET)
 * - Validates user is authenticated before signing out
 * - Clears session cookies via Supabase SSR
 */

import { redirect, error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	// SECURITY: Verify user is authenticated before attempting signout
	// This prevents unnecessary database calls for unauthenticated requests
	if (!locals.user) {
		// User is not authenticated - nothing to sign out
		// Still redirect to home (don't expose auth state)
		redirect(303, '/');
	}

	// Sign out the authenticated user
	const { error: signOutError } = await locals.supabase.auth.signOut();

	if (signOutError) {
		// Log error but don't expose to client
		console.error('[Auth] Sign out error:', signOutError.message);
	}

	// Always redirect to home after signout attempt
	redirect(303, '/');
};
