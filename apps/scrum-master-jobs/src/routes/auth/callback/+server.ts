/**
 * OAuth Callback Handler
 * ======================
 *
 * Handles OAuth redirects from Supabase Auth providers (GitHub, Google).
 * Exchanges the authorization code for a session and redirects to the app.
 *
 * Security:
 * - Validates the `next` parameter to prevent open redirect attacks
 * - Only allows relative URLs starting with `/`
 * - Rejects absolute URLs and protocol-relative URLs (`//`)
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

/**
 * Validates and sanitizes a redirect URL to prevent open redirect attacks.
 *
 * @param url - The URL to validate (from query parameter)
 * @returns Safe relative URL or '/' if invalid
 *
 * Security rules:
 * - Must start with '/' (relative URL)
 * - Must not start with '//' (protocol-relative URL)
 * - Must not contain '://' (absolute URL disguised as path)
 * - Defaults to '/' if validation fails
 */
function validateRedirectUrl(url: string | null): string {
	// Default to home if no URL provided
	if (!url) return '/';

	// SECURITY: Only allow relative URLs starting with single /
	// Reject protocol-relative URLs (//evil.com) and absolute URLs
	const isRelative = url.startsWith('/') && !url.startsWith('//');
	const hasProtocol = url.includes('://');

	if (!isRelative || hasProtocol) {
		console.warn(`[Auth] Blocked potentially malicious redirect: ${url}`);
		return '/';
	}

	return url;
}

export const GET: RequestHandler = async ({ url, locals }) => {
	const code = url.searchParams.get('code');

	// SECURITY: Validate redirect URL to prevent open redirect attacks
	const next = validateRedirectUrl(url.searchParams.get('next'));

	if (code) {
		const { error } = await locals.supabase.auth.exchangeCodeForSession(code);
		if (!error) {
			redirect(303, next);
		}
		// Log auth errors for debugging (don't expose to client)
		console.error('[Auth] Code exchange failed:', error.message);
	}

	// If there's an error or no code, redirect to login with error
	redirect(303, '/login?error=auth_callback_failed');
};
