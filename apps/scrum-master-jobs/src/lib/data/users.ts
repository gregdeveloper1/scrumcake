/**
 * Users Data
 * ===========
 *
 * Mock data for user/author entities in the platform.
 * Contains 15 diverse user profiles used as article authors.
 *
 * In production, this data would come from a database/API.
 *
 * Usage:
 * ```typescript
 * import { users, getUserByUsername, getUserById, type User } from '$lib/data/users';
 *
 * // Get all users
 * users.forEach(u => console.log(u.name));
 *
 * // Find specific user
 * const user = getUserByUsername('sarahchen');
 * ```
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

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
	/** Avatar image URL (Unsplash) */
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

export const users: User[] = [
	{
		id: 'u1',
		name: 'Sarah Chen',
		username: 'sarahchen',
		avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
		bio: 'Full-stack developer passionate about Svelte and TypeScript. Building the future one component at a time.',
		location: 'San Francisco, CA',
		education: 'BS Computer Science, Stanford',
		work: 'Senior Engineer at TechCorp',
		website: 'https://sarahchen.dev',
		github: 'sarahchen',
		twitter: 'sarahchendev',
		joinedAt: '2023-06-15',
		followers: 12340,
		following: 289,
		postsCount: 142
	},
	{
		id: 'u2',
		name: 'Marcus Johnson',
		username: 'marcusj',
		avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
		bio: 'DevOps engineer by day, open source contributor by night. Kubernetes enthusiast.',
		location: 'Austin, TX',
		education: 'MS Software Engineering, UT Austin',
		work: 'DevOps Lead at CloudScale',
		website: 'https://marcus.io',
		github: 'marcusj',
		twitter: 'marcusjdev',
		joinedAt: '2022-03-20',
		followers: 8920,
		following: 456,
		postsCount: 89
	},
	{
		id: 'u3',
		name: 'Emily Rodriguez',
		username: 'emilydev',
		avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
		bio: 'Frontend developer and UX enthusiast. Creating delightful user experiences.',
		location: 'New York, NY',
		education: 'Design + CS, NYU',
		work: 'Senior Frontend at DesignHub',
		website: 'https://emilydev.com',
		github: 'emilydev',
		twitter: 'emilydevs',
		joinedAt: '2021-11-08',
		followers: 15670,
		following: 892,
		postsCount: 234
	},
	{
		id: 'u4',
		name: 'David Kim',
		username: 'davidkim',
		avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop',
		bio: 'Machine learning engineer exploring the intersection of AI and web development.',
		location: 'Seattle, WA',
		education: 'PhD Computer Science, UW',
		work: 'ML Engineer at AIStartup',
		website: 'https://davidkim.ml',
		github: 'davidkim',
		twitter: 'davidkim_ml',
		joinedAt: '2022-07-12',
		followers: 6780,
		following: 234,
		postsCount: 67
	},
	{
		id: 'u5',
		name: 'Priya Patel',
		username: 'priyacode',
		avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop',
		bio: 'Backend developer specializing in Node.js and Go. Performance optimization expert.',
		location: 'London, UK',
		education: 'MEng Imperial College',
		work: 'Staff Engineer at FinTech Co',
		website: 'https://priyapatel.dev',
		github: 'priyacode',
		twitter: 'priyacodes',
		joinedAt: '2020-09-25',
		followers: 21340,
		following: 567,
		postsCount: 312
	},
	{
		id: 'u6',
		name: 'Alex Thompson',
		username: 'alexthompson',
		avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
		bio: 'Technical writer and developer advocate. Making complex topics accessible.',
		location: 'Toronto, Canada',
		education: 'BA English + CS Minor',
		work: 'Developer Advocate at BigTech',
		website: 'https://alexwrites.tech',
		github: 'alexthompson',
		twitter: 'alexwrites',
		joinedAt: '2021-04-18',
		followers: 18900,
		following: 1234,
		postsCount: 456
	},
	{
		id: 'u7',
		name: 'Nina Kowalski',
		username: 'ninadev',
		avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop',
		bio: 'Svelte and TypeScript developer. Building accessible web applications.',
		location: 'Berlin, Germany',
		education: 'BS Informatik, TU Berlin',
		work: 'Frontend Lead at EuroTech',
		website: 'https://nina.codes',
		github: 'ninadev',
		twitter: 'nina_codes',
		joinedAt: '2022-01-30',
		followers: 9870,
		following: 345,
		postsCount: 178
	},
	{
		id: 'u8',
		name: 'James Wilson',
		username: 'jameswilson',
		avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop',
		bio: 'Indie hacker and solopreneur. Building SaaS products and sharing the journey.',
		location: 'Denver, CO',
		education: 'Self-taught developer',
		work: 'Founder at IndieHacker.io',
		website: 'https://jameswilson.dev',
		github: 'jameswilson',
		twitter: 'james_builds',
		joinedAt: '2020-06-14',
		followers: 34560,
		following: 890,
		postsCount: 567
	},
	{
		id: 'u9',
		name: 'Maya Singh',
		username: 'mayasingh',
		avatar: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop',
		bio: 'Mobile developer focusing on Swift and Flutter. Cross-platform enthusiast.',
		location: 'Mumbai, India',
		education: 'BTech IIT Bombay',
		work: 'Mobile Lead at AppCraft',
		website: 'https://mayasingh.dev',
		github: 'mayasingh',
		twitter: 'maya_mobile',
		joinedAt: '2021-08-22',
		followers: 11230,
		following: 456,
		postsCount: 198
	},
	{
		id: 'u10',
		name: 'Chris Anderson',
		username: 'chrisanderson',
		avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop',
		bio: 'Security researcher and ethical hacker. Keeping the web safe one bug at a time.',
		location: 'Chicago, IL',
		education: 'MS Cybersecurity, Northwestern',
		work: 'Security Engineer at SecureCorp',
		website: 'https://chrisanderson.security',
		github: 'chrisanderson',
		twitter: 'chris_security',
		joinedAt: '2019-12-05',
		followers: 28900,
		following: 234,
		postsCount: 289
	},
	{
		id: 'u11',
		name: 'Luna Martinez',
		username: 'lunacode',
		avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop',
		bio: 'Game developer and creative coder. Making interactive experiences with WebGL.',
		location: 'Los Angeles, CA',
		education: 'MFA Interactive Media, UCLA',
		work: 'Creative Developer at StudioX',
		website: 'https://luna.games',
		github: 'lunacode',
		twitter: 'luna_creates',
		joinedAt: '2022-05-10',
		followers: 7650,
		following: 567,
		postsCount: 89
	},
	{
		id: 'u12',
		name: 'Tom Baker',
		username: 'tombaker',
		avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop',
		bio: 'Database architect and SQL expert. Optimizing queries since 2008.',
		location: 'Boston, MA',
		education: 'MS Database Systems, MIT',
		work: 'Principal DBA at DataScale',
		website: 'https://tombaker.db',
		github: 'tombaker',
		twitter: 'tom_queries',
		joinedAt: '2020-02-28',
		followers: 15670,
		following: 123,
		postsCount: 234
	},
	{
		id: 'u13',
		name: 'Aisha Mohammed',
		username: 'aishadev',
		avatar: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=100&h=100&fit=crop',
		bio: 'Cloud architect specializing in AWS and GCP. Building scalable infrastructure.',
		location: 'Dubai, UAE',
		education: 'MSc Cloud Computing, UAE University',
		work: 'Cloud Architect at GlobalTech',
		website: 'https://aisha.cloud',
		github: 'aishadev',
		twitter: 'aisha_cloud',
		joinedAt: '2021-10-15',
		followers: 13450,
		following: 345,
		postsCount: 156
	},
	{
		id: 'u14',
		name: 'Ryan O\'Connor',
		username: 'ryanoconnor',
		avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&h=100&fit=crop',
		bio: 'Open source maintainer and contributor. Rust and Go enthusiast.',
		location: 'Dublin, Ireland',
		education: 'BSc Computer Science, Trinity College',
		work: 'OSS Maintainer',
		website: 'https://ryanoconnor.dev',
		github: 'ryanoconnor',
		twitter: 'ryan_oss',
		joinedAt: '2019-07-20',
		followers: 42100,
		following: 1567,
		postsCount: 678
	},
	{
		id: 'u15',
		name: 'Yuki Tanaka',
		username: 'yukitanaka',
		avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100&h=100&fit=crop',
		bio: 'Full-stack developer and technical lead. Mentoring the next generation of devs.',
		location: 'Tokyo, Japan',
		education: 'MEng Tokyo University',
		work: 'Tech Lead at TokyoTech',
		website: 'https://yukitanaka.dev',
		github: 'yukitanaka',
		twitter: 'yuki_codes',
		joinedAt: '2020-11-12',
		followers: 19800,
		following: 678,
		postsCount: 345
	}
];

export function getUserByUsername(username: string): User | undefined {
	return users.find((u) => u.username === username);
}

export function getUserById(id: string): User | undefined {
	return users.find((u) => u.id === id);
}
