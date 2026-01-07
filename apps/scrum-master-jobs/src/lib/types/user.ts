/**
 * User-related type definitions
 */

export interface User {
	id: string;
	name: string;
	username: string;
	avatar: string;
	bio: string;
	location: string;
	education: string;
	work: string;
	website: string;
	github: string;
	twitter: string;
	joinedAt: string;
	followers: number;
	following: number;
	postsCount: number;
}
