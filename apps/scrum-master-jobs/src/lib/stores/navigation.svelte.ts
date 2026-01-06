/**
 * Navigation Store - Section-Based Navigation Management
 * =======================================================
 *
 * This store manages the application's main section navigation using Svelte 5 runes.
 * It tracks which top-level section is active and provides configuration for
 * the NavigationSidebar component.
 *
 * The app has 5 main sections, each with:
 * - Unique navigation links in the sidebar
 * - Section-specific tags/categories
 * - Custom title and description
 *
 * Sections:
 * 1. Community - Main content feed (articles, discussions)
 * 2. Jobs - Job listings and career resources
 * 3. Matching - Developer collaboration and mentorship
 * 4. Videos - TikTok-style short-form developer content
 * 5. Ask AI - AI-powered assistance
 *
 * Usage:
 * ```typescript
 * import { getActiveSection, setActiveSection, sidebarMenus } from '$lib/stores/navigation.svelte';
 *
 * // Get current section reactively
 * let section = $derived(getActiveSection());
 *
 * // Change section
 * setActiveSection('jobs');
 *
 * // Get sidebar config for current section
 * let menu = $derived(sidebarMenus[getActiveSection()]);
 * ```
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

/**
 * Available section identifiers
 * These map to the pill buttons in the header
 */
export type Section = 'community' | 'jobs' | 'matching' | 'videos' | 'table' | 'maps' | 'askai';

/**
 * Sidebar link configuration
 */
interface SidebarLink {
	/** Route path */
	href: string;
	/** Display label */
	label: string;
	/** Icon identifier (maps to SVG in NavigationSidebar) */
	icon: string;
}

/**
 * Sidebar menu configuration for a section
 */
interface SidebarMenu {
	/** Section title displayed at top of sidebar */
	title: string;
	/** Section description/subtitle */
	description: string;
	/** Navigation links for this section */
	links: readonly SidebarLink[];
	/** Whether to show tags section */
	showTags: boolean;
	/** Tags/categories relevant to this section */
	tags: readonly string[];
}

// ============================================
// REACTIVE STATE
// ============================================

/**
 * Currently active section
 * Uses Svelte 5 $state rune for reactivity
 * Default: 'community' (main content feed)
 */
let activeSection = $state<Section>('community');

// ============================================
// PUBLIC API
// ============================================

/**
 * Get the current active section
 * Use with $derived for reactive access:
 * `let section = $derived(getActiveSection());`
 *
 * @returns Current section identifier
 */
export function getActiveSection(): Section {
	return activeSection;
}

/**
 * Set the active section
 * Updates the header pill selection and sidebar content
 *
 * @param section - Section identifier to activate
 */
export function setActiveSection(section: Section): void {
	activeSection = section;
}

// ============================================
// SIDEBAR MENU CONFIGURATIONS
// ============================================

/**
 * Sidebar menu configurations for each section
 *
 * Each section defines:
 * - title: Displayed at top of NavigationSidebar
 * - description: Subtitle explaining the section
 * - links: Navigation items with href, label, and icon
 * - showTags: Whether to display the tags section
 * - tags: Relevant tags/categories for the section
 *
 * Icons are string identifiers that map to SVG icons in NavigationSidebar.
 * Available icons: home, compass, headphones, play, hash, help, briefcase,
 * building, dollar, globe, bookmark, bell, users, user, link, graduation,
 * folder, message, shopping-bag, shirt, gift, sticker, cart, package, info,
 * heart, newspaper, mail, settings
 */
export const sidebarMenus: Record<Section, SidebarMenu> = {
	/**
	 * Community Section
	 * Main content feed with articles, discussions, and resources
	 */
	community: {
		title: 'Community',
		description: 'Connect with developers worldwide',
		links: [
			{ href: '/', label: 'Home', icon: 'home' },
			{ href: '/explore', label: 'Explore', icon: 'compass' },
			{ href: '/podcasts', label: 'Podcasts', icon: 'headphones' },
			{ href: '/videos', label: 'Videos', icon: 'play' },
			{ href: '/tags', label: 'Tags', icon: 'hash' },
			{ href: '/faq', label: 'FAQ', icon: 'help' },
			{ href: '/about', label: 'About', icon: 'info' }
		],
		showTags: true,
		tags: [
			'javascript',
			'webdev',
			'beginners',
			'svelte',
			'tutorial',
			'programming',
			'python',
			'css'
		]
	},

	/**
	 * Jobs Section
	 * Job listings, company profiles, and career resources
	 */
	jobs: {
		title: 'Jobs',
		description: 'Find your next opportunity',
		links: [
			{ href: '/jobs', label: 'Browse Jobs', icon: 'briefcase' },
			{ href: '/jobs/companies', label: 'Companies', icon: 'building' },
			{ href: '/jobs/salaries', label: 'Salaries', icon: 'dollar' },
			{ href: '/jobs/remote', label: 'Remote Jobs', icon: 'globe' },
			{ href: '/jobs/saved', label: 'Saved Jobs', icon: 'bookmark' },
			{ href: '/jobs/alerts', label: 'Job Alerts', icon: 'bell' }
		],
		showTags: true,
		tags: ['frontend', 'backend', 'fullstack', 'devops', 'mobile', 'data', 'design', 'product']
	},

	/**
	 * Matching Section
	 * Developer collaboration, mentorship, and networking
	 */
	matching: {
		title: 'Matching',
		description: 'Find collaborators and mentors',
		links: [
			{ href: '/matching', label: 'Find Matches', icon: 'users' },
			{ href: '/matching/profile', label: 'My Profile', icon: 'user' },
			{ href: '/matching/connections', label: 'Connections', icon: 'link' },
			{ href: '/matching/mentorship', label: 'Mentorship', icon: 'graduation' },
			{ href: '/matching/projects', label: 'Projects', icon: 'folder' },
			{ href: '/matching/messages', label: 'Messages', icon: 'message' }
		],
		showTags: true,
		tags: [
			'mentorship',
			'collaboration',
			'pair-programming',
			'code-review',
			'open-source',
			'startup',
			'freelance',
			'learning'
		]
	},

	/**
	 * Videos Section
	 * TikTok-style short-form developer content
	 */
	videos: {
		title: 'Videos',
		description: 'Watch dev content shorts',
		links: [
			{ href: '/videos', label: 'For You', icon: 'play' },
			{ href: '/videos/following', label: 'Following', icon: 'users' },
			{ href: '/videos/trending', label: 'Trending', icon: 'hash' },
			{ href: '/videos/saved', label: 'Saved', icon: 'bookmark' },
			{ href: '/videos/history', label: 'History', icon: 'folder' },
			{ href: '/videos/upload', label: 'Upload', icon: 'plus' }
		],
		showTags: true,
		tags: ['tutorials', 'tips', 'debugging', 'live-coding', 'reviews', 'career', 'humor', 'tools']
	},

	/**
	 * Table Section
	 * Data table with vegan companies directory
	 */
	table: {
		title: 'Data Table',
		description: 'Explore vegan companies directory',
		links: [
			{ href: '/table', label: 'All Companies', icon: 'building' },
			{ href: '/table/food', label: 'Food & Beverage', icon: 'shopping-bag' },
			{ href: '/table/fashion', label: 'Fashion', icon: 'shirt' },
			{ href: '/table/beauty', label: 'Beauty', icon: 'heart' },
			{ href: '/table/tech', label: 'Tech', icon: 'globe' },
			{ href: '/table/saved', label: 'Saved', icon: 'bookmark' }
		],
		showTags: true,
		tags: ['plant-based', 'cruelty-free', 'sustainable', 'organic', 'eco-friendly', 'vegan', 'ethical', 'green']
	},

	/**
	 * Maps Section
	 * Vegan restaurant discovery with Google Maps
	 */
	maps: {
		title: 'Vegan Restaurants',
		description: 'Discover plant-based dining',
		links: [
			{ href: '/maps', label: 'Explore Map', icon: 'compass' },
			{ href: '/maps/nearby', label: 'Nearby', icon: 'globe' },
			{ href: '/maps/favorites', label: 'Favorites', icon: 'heart' },
			{ href: '/maps/reviews', label: 'My Reviews', icon: 'message' },
			{ href: '/maps/lists', label: 'My Lists', icon: 'folder' },
			{ href: '/maps/help', label: 'Help', icon: 'help' }
		],
		showTags: true,
		tags: ['vegan', 'vegetarian', 'plant-based', 'organic', 'gluten-free', 'raw', 'juice-bar', 'cafe']
	},

	/**
	 * Ask AI Section
	 * AI-powered coding assistance and learning
	 */
	askai: {
		title: 'Ask AI',
		description: 'Get answers from AI assistants',
		links: [
			{ href: '/askai', label: 'New Chat', icon: 'message' },
			{ href: '/askai/history', label: 'Chat History', icon: 'folder' },
			{ href: '/askai/saved', label: 'Saved Responses', icon: 'bookmark' },
			{ href: '/askai/prompts', label: 'Prompt Library', icon: 'sticker' },
			{ href: '/askai/settings', label: 'AI Settings', icon: 'settings' },
			{ href: '/askai/help', label: 'How to Use', icon: 'help' }
		],
		showTags: true,
		tags: ['coding', 'debugging', 'explain', 'refactor', 'review', 'generate', 'optimize', 'learn']
	}
} as const;
