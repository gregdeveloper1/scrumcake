/**
 * Article-related type definitions
 * @module @jobboard/types/article
 */

import type { User } from './user';

/**
 * Article entity type
 * Represents a blog post/article in the platform
 */
export interface Article {
	/** Unique identifier */
	id: string;
	/** Article title */
	title: string;
	/** URL-friendly slug (used in routes) */
	slug: string;
	/** Short preview text */
	excerpt: string;
	/** Full article content (markdown/HTML) */
	content: string;
	/** Cover image URL or null */
	coverImage: string | null;
	/** Article author (User reference) */
	author: User;
	/** Topic tags */
	tags: string[];
	/** Reaction counts */
	reactions: {
		hearts: number;
		unicorns: number;
		saves: number;
	};
	/** Number of comments */
	commentsCount: number;
	/** Estimated reading time in minutes */
	readingTime: number;
	/** ISO date string of publication */
	publishedAt: string;
	/** Community ID this article belongs to */
	community: string;
}
