<!--
	+layout.svelte - Root Layout Component
	======================================

	This is the root layout that wraps all pages in the application.
	It provides the main app shell structure including:
	- Three-column layout (icon bar, navigation sidebar, main content + right sidebar)
	- Top header with section navigation and user actions
	- Theme initialization and persistence
	- Custom scroll restoration for SPA navigation

	Layout Structure:
	┌─────────────────────────────────────────────────────────────────┐
	│ CommunityIconBar │ NavigationSidebar │ Header                   │
	│                  │                   │─────────────────────────│
	│                  │                   │ Main Content │ RightSidebar │
	└─────────────────────────────────────────────────────────────────┘
-->

<script lang="ts">
	// ============================================
	// IMPORTS
	// ============================================

	// Global styles - must be imported first
	import '../app.css';

	// Svelte lifecycle and navigation hooks
	import { onMount } from 'svelte';
	import { beforeNavigate, afterNavigate } from '$app/navigation';

	// Layout components - the three-column structure
	import CommunityIconBar from '$lib/components/layout/CommunityIconBar.svelte';
	import NavigationSidebar from '$lib/components/layout/NavigationSidebar.svelte';
	import RightSidebar from '$lib/components/layout/RightSidebar.svelte';

	// UI components
	import ThemeSwitcher from '$lib/components/ThemeSwitcher.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';

	// State management
	import {
		getActiveSection,
		setActiveSection,
		type Section
	} from '$lib/stores/navigation.svelte';
	import { initTheme } from '$lib/stores/theme.svelte';

	// Utilities
	import { cn } from '$lib/utils';

	// Page data (session/user from +layout.server.ts)
	import type { LayoutData } from './$types';
	let { data, children } = $props<{ data: LayoutData; children: any }>();

	// ============================================
	// COMPONENT STATE
	// ============================================

	/** Reference to main scrollable element for scroll restoration */
	let mainElement: HTMLElement;

	/** Reactive derived state for current active section */
	let activeSection = $derived(getActiveSection());

	/**
	 * Scroll Position Cache
	 * Stores scroll positions by URL pathname to enable proper back/forward navigation
	 * Key: URL pathname (e.g., "/", "/username/article-slug")
	 * Value: scrollTop position in pixels
	 */
	const scrollPositions = new Map<string, number>();

	// ============================================
	// LIFECYCLE & NAVIGATION HANDLERS
	// ============================================

	/**
	 * Initialize theme and cart on component mount
	 * Reads saved theme from localStorage or defaults to 'cursor'
	 * Loads cart from localStorage for persistence
	 */
	onMount(() => {
		initTheme();
	});

	/**
	 * Save scroll position before navigating away from current page
	 * This enables scroll restoration when using browser back/forward buttons
	 */
	beforeNavigate((navigation) => {
		if (mainElement && navigation.from?.url) {
			scrollPositions.set(navigation.from.url.pathname, mainElement.scrollTop);
		}
	});

	/**
	 * Handle scroll position after navigation completes
	 * - Back/Forward (popstate): Restore previously saved scroll position
	 * - Forward navigation (link clicks): Scroll to top of page
	 *
	 * Uses requestAnimationFrame to ensure DOM has updated before scrolling
	 */
	afterNavigate((navigation) => {
		if (navigation.type === 'popstate' && navigation.to?.url) {
			// Back/forward button pressed - restore saved position
			const savedPosition = scrollPositions.get(navigation.to.url.pathname);
			if (savedPosition !== undefined) {
				requestAnimationFrame(() => {
					mainElement?.scrollTo(0, savedPosition);
				});
			}
		} else {
			// Forward navigation (clicked a link) - scroll to top
			mainElement?.scrollTo(0, 0);
		}
	});

	// ============================================
	// STATIC DATA
	// ============================================

	/**
	 * Main section navigation items
	 * These appear as pill buttons in the header
	 * Each section changes the NavigationSidebar content
	 */
	const sections: { id: Section; label: string; href: string }[] = [
		{ id: 'community', label: 'Community', href: '/' },
		{ id: 'jobs', label: 'Jobs', href: '/jobs' },
		{ id: 'matching', label: 'Matching', href: '/matching' },
		{ id: 'videos', label: 'Videos', href: '/videos' },
		{ id: 'table', label: 'Table', href: '/table' },
		{ id: 'askai', label: 'Ask AI', href: '/askai' }
	];
</script>

<!-- ============================================
     HEAD - Page metadata
     ============================================ -->
<svelte:head>
	<title>DevCommunity</title>
	<meta name="description" content="A developer community platform" />
</svelte:head>

<!-- ============================================
     MAIN LAYOUT STRUCTURE
     ============================================

     Wrapped in Tooltip.Provider to enable tooltips throughout the app.
     Uses CSS Grid with three main columns:
     1. CommunityIconBar (fixed width, leftmost)
     2. NavigationSidebar (fixed width)
     3. Main content area (flexible, contains header + content + right sidebar)
-->
<Tooltip.Provider>
<div class="flex h-screen bg-background">

	<!-- ========================================
	     COLUMN 1: Community Icon Bar
	     ========================================
	     Leftmost narrow column showing:
	     - Home icon
	     - Community icons (DEV, Design, etc.)
	     - Create community button
	-->
	<CommunityIconBar />

	<!-- ========================================
	     COLUMN 2: Navigation Sidebar
	     ========================================
	     Context-aware sidebar that changes based on:
	     - Active section (Community, Jobs, etc.)
	     - Current community (when on /c/[community] routes)
	     Shows navigation links, tags, and other resources
	-->
	<NavigationSidebar />

	<!-- ========================================
	     COLUMN 3: Main Content Area
	     ========================================
	     Contains the header and scrollable content area
	     overflow-hidden prevents double scrollbars
	-->
	<div class="flex flex-1 flex-col overflow-hidden">

		<!-- ====================================
		     TOP HEADER BAR
		     ====================================
		     Fixed height header with:
		     - Left: Section navigation pills (desktop) / Logo (mobile)
		     - Right: Action icons and auth buttons
		-->
		<header class="flex h-14 md:h-16 items-center justify-between border-b border-border bg-card px-4 md:px-6">

			<!-- Mobile: Logo -->
			<div class="flex md:hidden items-center gap-2">
				<span class="font-bold text-lg">DevCommunity</span>
			</div>

			<!-- Desktop: Section Navigation Pills with Sliding Highlight -->
			<nav class="relative hidden md:flex items-center rounded-full bg-muted/50 p-1">
				<!-- Sliding highlight background -->
				<div
					class="absolute top-1 bottom-1 w-[124px] rounded-full bg-background shadow-sm transition-all duration-300 ease-out"
					style="left: calc(4px + {sections.findIndex(s => s.id === activeSection)} * 124px);"
				></div>

				{#each sections as section}
					<a
						href={section.href}
						onclick={() => setActiveSection(section.id)}
						class={cn(
							'relative z-10 w-[124px] flex items-center justify-center gap-2 py-2 rounded-full font-medium text-sm transition-colors duration-200 no-underline whitespace-nowrap',
							activeSection === section.id
								? 'text-foreground'
								: 'text-muted-foreground hover:text-foreground'
						)}
					>
						<!-- Section Icons - each section has a unique icon -->
						{#if section.id === 'community'}
							<!-- Users/Community icon -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
						{:else if section.id === 'jobs'}
							<!-- Briefcase icon -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
								<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
							</svg>
						{:else if section.id === 'matching'}
							<!-- Heart icon -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
							</svg>
						{:else if section.id === 'videos'}
							<!-- Play/Video icon -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<polygon points="6 3 20 12 6 21 6 3" />
							</svg>
						{:else if section.id === 'table'}
							<!-- Table/Grid icon -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M12 3v18" />
								<rect width="18" height="18" x="3" y="3" rx="2" />
								<path d="M3 9h18" />
								<path d="M3 15h18" />
							</svg>
						{:else if section.id === 'askai'}
							<!-- Sparkles/AI icon -->
							<svg
								xmlns="http://www.w3.org/2000/svg"
								width="16"
								height="16"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
								<path d="M20 3v4" />
								<path d="M22 5h-4" />
							</svg>
						{/if}
						{section.label}
					</a>
				{/each}
			</nav>

			<!-- Right Side Action Icons & Auth Buttons -->
			<div class="flex items-center gap-1">

				<!-- Search Button -->
				<Button variant="ghost" size="icon" class="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground" aria-label="Search">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
				</Button>

				<!-- Messages Button (with notification indicator) -->
				<Button variant="ghost" size="icon" class="h-9 w-9 rounded-full relative text-muted-foreground hover:text-foreground" aria-label="Messages">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
					</svg>
					<!-- Red notification dot indicating unread messages -->
					<span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
				</Button>

				<!-- Notifications Button (with notification indicator) -->
				<Button variant="ghost" size="icon" class="h-9 w-9 rounded-full relative text-muted-foreground hover:text-foreground" aria-label="Notifications">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
						<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
					</svg>
					<!-- Red notification dot indicating unread notifications -->
					<span class="absolute top-1 right-1 h-2 w-2 rounded-full bg-primary"></span>
				</Button>

				<!-- Settings Link - Hidden on mobile -->
				<a href="/settings" class="hidden sm:inline-flex items-center justify-center h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-accent transition-colors" aria-label="Settings">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
						<circle cx="12" cy="12" r="3" />
					</svg>
				</a>

				<!-- Theme Switcher Dropdown - Hidden on mobile -->
				<div class="hidden sm:block">
					<ThemeSwitcher />
				</div>

				<!-- Vertical Divider - Hidden on mobile -->
				<div class="hidden sm:block w-px h-6 bg-border mx-1"></div>

				<!-- Authentication: Show user menu if logged in, otherwise show login/signup -->
				{#if data.user}
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							{#snippet child({ props })}
								<button {...props} class="flex items-center gap-2 rounded-full p-1 hover:bg-accent transition-colors">
									<Avatar.Root class="h-8 w-8">
										<Avatar.Image src={data.user?.user_metadata?.avatar_url} alt={data.user?.email ?? 'User'} />
										<Avatar.Fallback class="bg-primary text-primary-foreground text-sm">
											{(data.user?.email?.[0] ?? 'U').toUpperCase()}
										</Avatar.Fallback>
									</Avatar.Root>
								</button>
							{/snippet}
						</DropdownMenu.Trigger>
						<DropdownMenu.Content align="end" class="w-56">
							<DropdownMenu.Label>
								<div class="flex flex-col">
									<span class="font-medium">{data.user?.user_metadata?.name ?? data.user?.email?.split('@')[0]}</span>
									<span class="text-xs text-muted-foreground">{data.user?.email}</span>
								</div>
							</DropdownMenu.Label>
							<DropdownMenu.Separator />
							<DropdownMenu.Item href="/profile">
								<svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
									<circle cx="12" cy="7" r="4"/>
								</svg>
								Profile
							</DropdownMenu.Item>
							<DropdownMenu.Item href="/bookmarks">
								<svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
								</svg>
								Saved Jobs
							</DropdownMenu.Item>
							<DropdownMenu.Item href="/settings">
								<svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
									<circle cx="12" cy="12" r="3"/>
								</svg>
								Settings
							</DropdownMenu.Item>
							<DropdownMenu.Separator />
							<form action="/auth/signout" method="POST">
								<DropdownMenu.Item>
									{#snippet child({ props })}
										<button {...props} type="submit" class="w-full flex items-center text-destructive">
											<svg class="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
												<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
												<polyline points="16 17 21 12 16 7"/>
												<line x1="21" x2="9" y1="12" y2="12"/>
											</svg>
											Sign out
										</button>
									{/snippet}
								</DropdownMenu.Item>
							</form>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
				{:else}
					<a href="/login">
						<Button variant="ghost" size="sm" class="rounded-full px-3 md:px-4 font-medium text-sm">Log in</Button>
					</a>
					<a href="/signup" class="hidden sm:inline-flex">
						<Button variant="outline" size="sm" class="rounded-full px-5 font-medium border-2 border-foreground hover:bg-foreground hover:text-background transition-colors">Sign up</Button>
					</a>
				{/if}
			</div>
		</header>

		<!-- ====================================
		     SCROLLABLE CONTENT AREA
		     ====================================
		     Contains the main page content and right sidebar
		     - main: Scrollable area for page content (bound for scroll restoration)
		     - RightSidebar: Fixed sidebar with #discuss, #watercooler, listings
		-->
		<div class="flex flex-1 overflow-hidden">
			<main bind:this={mainElement} class="flex-1 overflow-y-auto pb-16 md:pb-0">
				{@render children()}
			</main>

			<!-- Right Sidebar - visible on xl screens and up -->
			<RightSidebar />
		</div>
	</div>

	<!-- Mobile Bottom Navigation -->
	<nav class="fixed bottom-0 left-0 right-0 z-50 flex md:hidden items-center justify-around h-16 bg-card border-t border-border safe-area-bottom">
		{#each sections as section}
			<a
				href={section.href}
				onclick={() => setActiveSection(section.id)}
				class={cn(
					'flex flex-col items-center justify-center gap-0.5 px-3 py-2 rounded-lg transition-colors min-w-[60px]',
					activeSection === section.id
						? 'text-primary'
						: 'text-muted-foreground'
				)}
			>
				{#if section.id === 'community'}
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
						<circle cx="9" cy="7" r="4" />
						<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
						<path d="M16 3.13a4 4 0 0 1 0 7.75" />
					</svg>
				{:else if section.id === 'jobs'}
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
						<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
					</svg>
				{:else if section.id === 'matching'}
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
					</svg>
				{:else if section.id === 'videos'}
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<polygon points="6 3 20 12 6 21 6 3" />
					</svg>
				{:else if section.id === 'table'}
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 3v18" />
						<rect width="18" height="18" x="3" y="3" rx="2" />
						<path d="M3 9h18" />
						<path d="M3 15h18" />
					</svg>
				{:else if section.id === 'askai'}
					<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
						<path d="M20 3v4" />
						<path d="M22 5h-4" />
					</svg>
				{/if}
				<span class="text-[10px] font-medium">{section.label}</span>
			</a>
		{/each}
	</nav>
</div>
</Tooltip.Provider>
