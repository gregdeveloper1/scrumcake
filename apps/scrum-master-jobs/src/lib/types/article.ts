/**
 * Article-related type definitions
 */

import type { User } from './user';

export interface Article {
	id: string;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	coverImage: string | null;
	author: User;
	tags: string[];
	reactions: {
		hearts: number;
		unicorns: number;
		saves: number;
	};
	commentsCount: number;
	readingTime: number;
	publishedAt: string;
	community: string;
}
