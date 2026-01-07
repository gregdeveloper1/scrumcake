/**
 * videos.ts - Mock Video Data for TikTok-style Video Feed
 * ========================================================
 *
 * Developer-focused short-form video content.
 * Uses Google CDN sample videos for reliable playback.
 *
 * Used by:
 * - /videos route (TikTok-style video player)
 *
 * Data includes:
 * - 8 mock video creators with avatars
 * - 12 video entries with engagement metrics
 * - Helper functions for formatting
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Video creator/author information.
 */
export interface VideoCreator {
	/** Unique creator ID */
	id: string;
	/** Display name */
	name: string;
	/** Username handle (without @) */
	username: string;
	/** Avatar image URL */
	avatar: string;
	/** Whether creator is verified */
	verified: boolean;
	/** Follower count */
	followers: number;
}

/**
 * Complete video data structure.
 */
export interface Video {
	/** Unique video ID */
	id: string;
	/** Video title */
	title: string;
	/** Video description with hashtags */
	description: string;
	/** Creator who posted the video */
	creator: VideoCreator;
	/** Video thumbnail/poster image URL */
	thumbnail: string;
	/** Video source URL (MP4 from Google CDN) */
	videoUrl: string;
	/** Duration in seconds */
	duration: number;
	/** Number of likes */
	likes: number;
	/** Number of comments */
	comments: number;
	/** Number of shares */
	shares: number;
	/** Number of saves/bookmarks */
	saves: number;
	/** Total view count */
	views: number;
	/** Hashtag topics */
	tags: string[];
	/** ISO date string when posted */
	createdAt: string;
	/** Background color for loading state */
	bgColor: string;
}

// ============================================
// CREATOR DATA
// ============================================

/**
 * Mock video creators with developer-themed personas.
 * Avatars from Unsplash portraits.
 */
const creators: VideoCreator[] = [
	{
		id: 'c1',
		name: 'Sarah Chen',
		username: 'sarahcodes',
		avatar: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/avatars/creator-1.jpg',
		verified: true,
		followers: 125000
	},
	{
		id: 'c2',
		name: 'Marcus Dev',
		username: 'marcusdev',
		avatar: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/avatars/creator-2.jpg',
		verified: true,
		followers: 89000
	},
	{
		id: 'c3',
		name: 'Code with Priya',
		username: 'priyacodes',
		avatar: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/avatars/creator-3.jpg',
		verified: false,
		followers: 45000
	},
	{
		id: 'c4',
		name: 'DevOps Dan',
		username: 'devopsdan',
		avatar: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/avatars/creator-4.jpg',
		verified: true,
		followers: 67000
	},
	{
		id: 'c5',
		name: 'Emma TypeScript',
		username: 'emmats',
		avatar: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/avatars/creator-5.jpg',
		verified: false,
		followers: 32000
	},
	{
		id: 'c6',
		name: 'Rust Ryan',
		username: 'rustryan',
		avatar: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/avatars/creator-6.jpg',
		verified: true,
		followers: 98000
	},
	{
		id: 'c7',
		name: 'UI/UX Maya',
		username: 'mayaui',
		avatar: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/avatars/creator-7.jpg',
		verified: false,
		followers: 54000
	},
	{
		id: 'c8',
		name: 'Backend Bob',
		username: 'backendbob',
		avatar: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/avatars/creator-8.jpg',
		verified: true,
		followers: 112000
	}
];

// ============================================
// STYLING DATA
// ============================================

/**
 * Dark background colors for video loading states.
 * Used when video is loading or as fallback.
 */
const bgColors = [
	'#1a1a2e',
	'#16213e',
	'#0f3460',
	'#1b262c',
	'#2d132c',
	'#1e3d59',
	'#17252a',
	'#2b2d42',
	'#264653',
	'#2a2a72'
];

/**
 * Sample video URLs from Google's public CDN.
 * These are reliable test videos that work across browsers.
 * In production, these would be replaced with actual content.
 */
const sampleVideos = [
	'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
	'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
	'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
	'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
	'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
	'https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
	'https://storage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4',
	'https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
	'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
	'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
	'https://storage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4',
	'https://storage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4'
];

// ============================================
// VIDEO DATA
// ============================================

/**
 * Complete list of mock videos.
 * Each video has developer-focused content themes.
 * Engagement metrics are varied for realistic appearance.
 */
export const videos: Video[] = [
	{
		id: 'v1',
		title: 'CSS Grid in 60 seconds',
		description: 'Learn the basics of CSS Grid layout in under a minute! Perfect for beginners. #css #webdev #tutorial',
		creator: creators[0],
		thumbnail: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/thumbnails/video-1.jpg',
		videoUrl: sampleVideos[0],
		duration: 58,
		likes: 45200,
		comments: 892,
		shares: 3400,
		saves: 12000,
		views: 523000,
		tags: ['css', 'webdev', 'tutorial'],
		createdAt: '2024-01-15T10:30:00Z',
		bgColor: bgColors[0]
	},
	{
		id: 'v2',
		title: 'This JavaScript trick will blow your mind',
		description: 'Optional chaining + nullish coalescing = chef\'s kiss. Stop writing verbose null checks! #javascript #tips',
		creator: creators[1],
		thumbnail: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/thumbnails/video-2.jpg',
		videoUrl: sampleVideos[1],
		duration: 45,
		likes: 89300,
		comments: 2341,
		shares: 8900,
		saves: 34000,
		views: 1200000,
		tags: ['javascript', 'tips', 'coding'],
		createdAt: '2024-01-14T15:20:00Z',
		bgColor: bgColors[1]
	},
	{
		id: 'v3',
		title: 'Why I switched from React to Svelte',
		description: 'After 4 years of React, I made the switch. Here\'s what happened... #svelte #react #webdev',
		creator: creators[2],
		thumbnail: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/thumbnails/video-3.jpg',
		videoUrl: sampleVideos[2],
		duration: 87,
		likes: 67800,
		comments: 4521,
		shares: 5600,
		saves: 23000,
		views: 890000,
		tags: ['svelte', 'react', 'opinion'],
		createdAt: '2024-01-13T08:45:00Z',
		bgColor: bgColors[2]
	},
	{
		id: 'v4',
		title: 'Docker explained with food',
		description: 'Containers, images, and volumes explained using sandwich analogies. Trust me, it makes sense. #docker #devops',
		creator: creators[3],
		thumbnail: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/thumbnails/video-4.jpg',
		videoUrl: sampleVideos[3],
		duration: 76,
		likes: 112000,
		comments: 3200,
		shares: 15000,
		saves: 45000,
		views: 2100000,
		tags: ['docker', 'devops', 'tutorial'],
		createdAt: '2024-01-12T12:00:00Z',
		bgColor: bgColors[3]
	},
	{
		id: 'v5',
		title: 'TypeScript generics aren\'t scary',
		description: 'I was terrified of generics for years. Then I learned this simple mental model... #typescript #learning',
		creator: creators[4],
		thumbnail: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/thumbnails/video-5.jpg',
		videoUrl: sampleVideos[4],
		duration: 92,
		likes: 34500,
		comments: 1890,
		shares: 4200,
		saves: 18000,
		views: 456000,
		tags: ['typescript', 'learning', 'tips'],
		createdAt: '2024-01-11T16:30:00Z',
		bgColor: bgColors[4]
	},
	{
		id: 'v6',
		title: 'Rust is eating the world',
		description: 'Why every major tech company is rewriting their core infrastructure in Rust. #rust #performance',
		creator: creators[5],
		thumbnail: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/thumbnails/video-6.jpg',
		videoUrl: sampleVideos[5],
		duration: 65,
		likes: 78900,
		comments: 5600,
		shares: 9800,
		saves: 28000,
		views: 1450000,
		tags: ['rust', 'performance', 'trends'],
		createdAt: '2024-01-10T09:15:00Z',
		bgColor: bgColors[5]
	},
	{
		id: 'v7',
		title: '5 UI mistakes devs always make',
		description: 'Common design anti-patterns I see in developer portfolios. Easy fixes inside! #design #ux #tips',
		creator: creators[6],
		thumbnail: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/thumbnails/video-7.jpg',
		videoUrl: sampleVideos[6],
		duration: 83,
		likes: 56700,
		comments: 2100,
		shares: 7300,
		saves: 31000,
		views: 780000,
		tags: ['design', 'ux', 'tips'],
		createdAt: '2024-01-09T14:00:00Z',
		bgColor: bgColors[6]
	},
	{
		id: 'v8',
		title: 'SQL vs NoSQL: The real answer',
		description: 'It depends... but here\'s how to actually make the decision for your next project. #database #backend',
		creator: creators[7],
		thumbnail: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/thumbnails/video-8.jpg',
		videoUrl: sampleVideos[7],
		duration: 71,
		likes: 43200,
		comments: 3400,
		shares: 5100,
		saves: 19000,
		views: 620000,
		tags: ['database', 'backend', 'architecture'],
		createdAt: '2024-01-08T11:30:00Z',
		bgColor: bgColors[7]
	},
	{
		id: 'v9',
		title: 'Git rebase vs merge explained',
		description: 'Finally understand when to use each one. No more messy git history! #git #tutorial #devtools',
		creator: creators[0],
		thumbnail: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/thumbnails/video-9.jpg',
		videoUrl: sampleVideos[8],
		duration: 68,
		likes: 91000,
		comments: 2800,
		shares: 11000,
		saves: 42000,
		views: 1800000,
		tags: ['git', 'tutorial', 'devtools'],
		createdAt: '2024-01-07T17:45:00Z',
		bgColor: bgColors[8]
	},
	{
		id: 'v10',
		title: 'The one VSCode extension you need',
		description: 'This extension saved me hours every week. Can\'t believe I didn\'t know about it sooner. #vscode #productivity',
		creator: creators[1],
		thumbnail: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/thumbnails/video-10.jpg',
		videoUrl: sampleVideos[9],
		duration: 42,
		likes: 125000,
		comments: 4100,
		shares: 18000,
		saves: 56000,
		views: 2800000,
		tags: ['vscode', 'productivity', 'tools'],
		createdAt: '2024-01-06T13:20:00Z',
		bgColor: bgColors[9]
	},
	{
		id: 'v11',
		title: 'API design mistakes to avoid',
		description: 'These 5 mistakes make your API a nightmare to use. Learn from my failures! #api #backend #tips',
		creator: creators[7],
		thumbnail: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/thumbnails/video-11.jpg',
		videoUrl: sampleVideos[10],
		duration: 79,
		likes: 38900,
		comments: 1950,
		shares: 4800,
		saves: 21000,
		views: 510000,
		tags: ['api', 'backend', 'tips'],
		createdAt: '2024-01-05T10:00:00Z',
		bgColor: bgColors[0]
	},
	{
		id: 'v12',
		title: 'My $200k tech interview prep',
		description: 'The exact resources and schedule I used to land a senior role at a FAANG company. #career #interview',
		creator: creators[2],
		thumbnail: 'https://rptregzonzdcnaheupcp.supabase.co/storage/v1/object/public/thumbnails/video-12.jpg',
		videoUrl: sampleVideos[11],
		duration: 95,
		likes: 234000,
		comments: 8900,
		shares: 32000,
		saves: 89000,
		views: 4500000,
		tags: ['career', 'interview', 'faang'],
		createdAt: '2024-01-04T08:30:00Z',
		bgColor: bgColors[1]
	}
];

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Format view count for display.
 * Converts large numbers to abbreviated form.
 * @param views - Raw view count
 * @returns Formatted string (e.g., "1.2M", "45K", "523")
 */
export function formatViewCount(views: number): string {
	if (views >= 1000000) {
		return `${(views / 1000000).toFixed(1)}M`;
	} else if (views >= 1000) {
		return `${(views / 1000).toFixed(1)}K`;
	}
	return views.toString();
}

/**
 * Format duration in seconds to mm:ss format.
 * @param seconds - Duration in seconds
 * @returns Formatted string (e.g., "1:23", "0:45")
 */
export function formatDuration(seconds: number): string {
	const mins = Math.floor(seconds / 60);
	const secs = seconds % 60;
	return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Find a video by its ID.
 * @param id - Video ID to search for
 * @returns Video object or undefined if not found
 */
export function getVideoById(id: string): Video | undefined {
	return videos.find(v => v.id === id);
}
