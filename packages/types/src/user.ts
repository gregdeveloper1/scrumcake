/**
 * User-related type definitions
 * @module @jobboard/types/user
 */

/**
 * User entity type
 * Represents a user/author profile in the platform
 */
export interface User {
	/** Unique identifier */
	id: string;
	/** Display name */
	name: string;
	/** Username (used in URLs: /{username}) */
	username: string;
	/** Avatar image URL */
	avatar: string;
	/** User biography */
	bio: string;
	/** Location */
	location: string;
	/** Education background */
	education: string;
	/** Current work/employer */
	work: string;
	/** Personal website URL */
	website: string;
	/** GitHub username */
	github: string;
	/** Twitter/X username */
	twitter: string;
	/** ISO date string of account creation */
	joinedAt: string;
	/** Follower count */
	followers: number;
	/** Following count */
	following: number;
	/** Number of posts authored */
	postsCount: number;
}
