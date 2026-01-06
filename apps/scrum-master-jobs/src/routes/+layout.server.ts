/**
 * Root Layout Server
 * ==================
 *
 * Passes session and user data to all pages via PageData.
 */

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		session: locals.session,
		user: locals.user
	};
};
