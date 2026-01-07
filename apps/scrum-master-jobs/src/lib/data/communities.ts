/**
 * Communities Data
 * =================
 *
 * Mock data for community entities in the platform.
 * Each community represents a focused topic area where users can post content.
 *
 * In production, this data would come from a database/API.
 *
 * Usage:
 * ```typescript
 * import { communities, getCommunityById, type Community } from '$lib/data/communities';
 *
 * // Get all communities
 * communities.forEach(c => console.log(c.name));
 *
 * // Get specific community
 * const dev = getCommunityById('dev');
 * ```
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

import type { Community } from '$lib/types';
export type { Community };

// ============================================
// MOCK DATA
// ============================================

/**
 * Array of all communities
 *
 * Communities represent different topic areas:
 * - DEV: General software development
 * - Design: UI/UX and visual design
 * - WebDev: Web development focus
 * - JavaScript: JS ecosystem
 * - Python: Python programming
 */
export const communities: Community[] = [
	{
		id: 'dev',
		name: 'DEV',
		icon: 'https://dev-to-uploads.s3.amazonaws.com/uploads/logos/resized_logo_UQww2soKuUsjaOGNB38o.png',
		color: '#000000',
		description: 'A constructive and inclusive social network for software developers.',
		membersCount: 1250000,
		postsCount: 450000
	},
	{
		id: 'design',
		name: 'Design',
		icon: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=40&h=40&fit=crop',
		color: '#FF6B6B',
		description: 'A community for designers sharing their work and knowledge.',
		membersCount: 85000,
		postsCount: 32000
	},
	{
		id: 'webdev',
		name: 'WebDev',
		icon: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=40&h=40&fit=crop',
		color: '#4ECDC4',
		description: 'Everything web development - HTML, CSS, JavaScript, and beyond.',
		membersCount: 320000,
		postsCount: 125000
	},
	{
		id: 'javascript',
		name: 'JavaScript',
		icon: 'https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=40&h=40&fit=crop',
		color: '#F7DF1E',
		description: 'The JavaScript community - from basics to advanced topics.',
		membersCount: 280000,
		postsCount: 98000
	},
	{
		id: 'python',
		name: 'Python',
		icon: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=40&h=40&fit=crop',
		color: '#3776AB',
		description: 'Python programming community for beginners and experts alike.',
		membersCount: 195000,
		postsCount: 72000
	}
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Find a community by its ID
 *
 * @param id - Community identifier
 * @returns Community object or undefined if not found
 *
 * @example
 * const community = getCommunityById('dev');
 * if (community) {
 *   console.log(community.name); // "DEV"
 * }
 */
export function getCommunityById(id: string): Community | undefined {
	return communities.find((c) => c.id === id);
}
