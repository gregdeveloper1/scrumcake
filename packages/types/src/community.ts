/**
 * Community-related type definitions
 * @module @jobboard/types/community
 */

/**
 * Community entity type
 * Represents a community/group within the platform
 */
export interface Community {
	/** Unique identifier (used in URLs: /c/{id}) */
	id: string;
	/** Display name */
	name: string;
	/** Icon image URL (displayed in CommunityIconBar) */
	icon: string;
	/** Brand color (hex format) */
	color: string;
	/** Short description of the community */
	description: string;
	/** Total member count */
	membersCount: number;
	/** Total posts/articles count */
	postsCount: number;
}
