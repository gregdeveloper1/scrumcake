/**
 * Sign Out Handler
 * ================
 *
 * Signs out the user and redirects to home.
 */

import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ locals }) => {
	await locals.supabase.auth.signOut();
	redirect(303, '/');
};
