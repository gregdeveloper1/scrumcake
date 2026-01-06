<!--
	NavigationSidebar.svelte - Section-Aware Left Sidebar
	======================================================

	The second sidebar (left of main content) providing context-aware navigation.
	Updates its content based on the active section (Community, Jobs, Matching, etc.).

	Features:
	- Dynamic navigation links per section (from navigation store)
	- Community-specific header when on `/c/[community]` routes
	- Section title and description
	- Icon mapping for ~30 different link icons
	- Tags/categories section for each section
	- Footer links (Code of Conduct, Privacy, Terms)
	- Social media links

	Layout:
	- Hidden on mobile (lg:flex)
	- Fixed width: 240px (w-60)
	- Full height with scrollable content
-->

<script lang="ts">
	/**
	 * NavigationSidebar Component Script
	 * ===================================
	 * Manages context-aware sidebar navigation based on active section.
	 */

	// ============================================
	// IMPORTS
	// ============================================
	import { page } from '$app/state';
	import { getCommunityById } from '$lib/data/communities';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import { cn } from '$lib/utils';
	import { getActiveSection, sidebarMenus } from '$lib/stores/navigation.svelte';

	// ============================================
	// DERIVED STATE
	// ============================================

	/**
	 * Current community (if viewing a community page like `/c/dev`).
	 * null when not on a community route.
	 */
	let currentCommunity = $derived(
		page.params.community ? getCommunityById(page.params.community) : null
	);

	/** Active section from navigation store (community, jobs, matching, etc.) */
	let activeSection = $derived(getActiveSection());

	/** Sidebar menu configuration for the active section */
	let currentMenu = $derived(sidebarMenus[activeSection]);

	// ============================================
	// STATIC DATA
	// ============================================

	/**
	 * Footer links shown at the bottom of all sections
	 */
	const otherLinks = [
		{ href: '/code-of-conduct', label: 'Code of Conduct' },
		{ href: '/privacy', label: 'Privacy Policy' },
		{ href: '/terms', label: 'Terms of Use' }
	];
</script>

<!-- ============================================
     SIDEBAR CONTAINER
     ============================================
     Hidden on mobile (lg:flex), fixed width 240px.
     Full height with scrollable content area.
-->
<aside class="hidden w-60 shrink-0 flex-col border-r border-border bg-card lg:flex">
	<div class="flex flex-1 flex-col overflow-y-auto p-4">
		<!-- ========================================
		     SECTION HEADER
		     ========================================
		     Shows either:
		     - Community info (icon, name, member count) when on /c/[community] routes
		     - Generic section title/description when on other routes
		-->
		<div class="mb-4">
			{#if currentCommunity}
				<div class="flex items-center gap-3">
					<img
						src={currentCommunity.icon}
						alt={currentCommunity.name}
						class="h-10 w-10 rounded-lg object-cover"
					/>
					<div>
						<h2 class="font-semibold">{currentCommunity.name}</h2>
						<p class="text-xs text-muted-foreground">
							{currentCommunity.membersCount.toLocaleString()} members
						</p>
					</div>
				</div>
				<p class="mt-2 text-sm text-muted-foreground">{currentCommunity.description}</p>
			{:else}
				<h2 class="text-lg font-semibold">{currentMenu.title}</h2>
				<p class="mt-1 text-sm text-muted-foreground">
					{currentMenu.description}
				</p>
			{/if}
		</div>

		<Separator class="mb-4" />

		<!-- ========================================
		     DYNAMIC NAVIGATION LINKS
		     ========================================
		     Main navigation links for the active section.
		     Links are configured in sidebarMenus (navigation.svelte.ts).
		     Each link has: href, label, icon (string key).
		     Active link is highlighted based on current pathname.
		-->
		<nav class="mb-4 space-y-1">
			{#each currentMenu.links as link}
				<a
					href={link.href}
					class={cn(
						'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
						page.url.pathname === link.href
							? 'bg-muted font-medium text-foreground'
							: 'text-muted-foreground hover:bg-muted hover:text-foreground'
					)}
				>
					<!-- ----------------------------------------
					     ICON MAPPING
					     ----------------------------------------
					     Maps link.icon string to SVG icons.
					     Supports ~30 different icons.
					     Falls back to a generic circle icon.
					-->
					{#if link.icon === 'home'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
							<polyline points="9 22 9 12 15 12 15 22" />
						</svg>
					{:else if link.icon === 'compass'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10" />
							<polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
						</svg>
					{:else if link.icon === 'headphones'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" />
						</svg>
					{:else if link.icon === 'play'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<polygon points="5 3 19 12 5 21 5 3" />
						</svg>
					{:else if link.icon === 'hash'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="4" x2="20" y1="9" y2="9" />
							<line x1="4" x2="20" y1="15" y2="15" />
							<line x1="10" x2="8" y1="3" y2="21" />
							<line x1="16" x2="14" y1="3" y2="21" />
						</svg>
					{:else if link.icon === 'help'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10" />
							<path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
							<path d="M12 17h.01" />
						</svg>
					{:else if link.icon === 'briefcase'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
							<path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
						</svg>
					{:else if link.icon === 'building'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
							<path d="M9 22v-4h6v4" />
							<path d="M8 6h.01" />
							<path d="M16 6h.01" />
							<path d="M12 6h.01" />
							<path d="M12 10h.01" />
							<path d="M12 14h.01" />
							<path d="M16 10h.01" />
							<path d="M16 14h.01" />
							<path d="M8 10h.01" />
							<path d="M8 14h.01" />
						</svg>
					{:else if link.icon === 'dollar'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<line x1="12" x2="12" y1="2" y2="22" />
							<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
						</svg>
					{:else if link.icon === 'globe'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10" />
							<line x1="2" x2="22" y1="12" y2="12" />
							<path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
						</svg>
					{:else if link.icon === 'bookmark'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
						</svg>
					{:else if link.icon === 'bell'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
							<path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
						</svg>
					{:else if link.icon === 'users'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
							<circle cx="9" cy="7" r="4" />
							<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
							<path d="M16 3.13a4 4 0 0 1 0 7.75" />
						</svg>
					{:else if link.icon === 'user'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
							<circle cx="12" cy="7" r="4" />
						</svg>
					{:else if link.icon === 'link'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
							<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
						</svg>
					{:else if link.icon === 'graduation'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M22 10v6M2 10l10-5 10 5-10 5z" />
							<path d="M6 12v5c3 3 9 3 12 0v-5" />
						</svg>
					{:else if link.icon === 'folder'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z" />
						</svg>
					{:else if link.icon === 'message'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
						</svg>
					{:else if link.icon === 'shopping-bag'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
							<path d="M3 6h18" />
							<path d="M16 10a4 4 0 0 1-8 0" />
						</svg>
					{:else if link.icon === 'shirt'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23Z" />
						</svg>
					{:else if link.icon === 'gift'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect x="3" y="8" width="18" height="4" rx="1" />
							<path d="M12 8v13" />
							<path d="M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7" />
							<path d="M7.5 8a2.5 2.5 0 0 1 0-5A4.8 8 0 0 1 12 8a4.8 8 0 0 1 4.5-5 2.5 2.5 0 0 1 0 5" />
						</svg>
					{:else if link.icon === 'sticker'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M15.5 3H5a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3Z" />
							<path d="M15 3v6h6" />
						</svg>
					{:else if link.icon === 'cart'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="8" cy="21" r="1" />
							<circle cx="19" cy="21" r="1" />
							<path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
						</svg>
					{:else if link.icon === 'package'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="m7.5 4.27 9 5.15" />
							<path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
							<path d="m3.3 7 8.7 5 8.7-5" />
							<path d="M12 22V12" />
						</svg>
					{:else if link.icon === 'info'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10" />
							<path d="M12 16v-4" />
							<path d="M12 8h.01" />
						</svg>
					{:else if link.icon === 'heart'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
						</svg>
					{:else if link.icon === 'newspaper'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2" />
							<path d="M18 14h-8" />
							<path d="M15 18h-5" />
							<path d="M10 6h8v4h-8V6Z" />
						</svg>
					{:else if link.icon === 'mail'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect width="20" height="16" x="2" y="4" rx="2" />
							<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
						</svg>
					{:else if link.icon === 'settings'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
							<circle cx="12" cy="12" r="3" />
						</svg>
					{:else if link.icon === 'plus'}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M5 12h14" />
							<path d="M12 5v14" />
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<circle cx="12" cy="12" r="10" />
						</svg>
					{/if}
					{link.label}
				</a>
			{/each}
		</nav>

		<Separator class="mb-4" />

		<!-- ========================================
		     FOOTER LINKS
		     ========================================
		     Static links shown on all sections.
		     Includes: Code of Conduct, Privacy, Terms.
		     Uses GitHub icon for all (simple style choice).
		-->
		<div class="mb-4">
			<h3 class="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">Other</h3>
			<nav class="space-y-1">
				{#each otherLinks as link}
					<a
						href={link.href}
						class="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
					>
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
							<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
							<path d="M9 18c-4.51 2-5-2-7-2" />
						</svg>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>

		<Separator class="mb-4" />

		<!-- ========================================
		     SOCIAL MEDIA LINKS
		     ========================================
		     Icon buttons linking to social platforms.
		     Includes: Twitter, GitHub, Instagram.
		-->
		<div class="mb-4 flex items-center gap-2 px-3">
			<a
				href="https://twitter.com"
				aria-label="Twitter"
				class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
			>
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
					<path
						d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"
					/>
				</svg>
			</a>
			<a
				href="https://github.com"
				aria-label="GitHub"
				class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
			>
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
					<path
						d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"
					/>
					<path d="M9 18c-4.51 2-5-2-7-2" />
				</svg>
			</a>
			<a
				href="https://instagram.com"
				aria-label="Instagram"
				class="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
			>
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
					<rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
					<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
					<line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
				</svg>
			</a>
		</div>

		<Separator class="mb-4" />

		<!-- ========================================
		     DYNAMIC TAGS SECTION
		     ========================================
		     Shows tags/categories relevant to active section.
		     - Community: "Popular Tags" (javascript, react, etc.)
		     - Jobs: "Job Categories" (engineering, design, etc.)
		     - Other sections: "Topics"
		     Only shows if currentMenu.showTags is true.
		-->
		{#if currentMenu.showTags}
			<div>
				<h3 class="mb-2 px-3 text-xs font-semibold uppercase text-muted-foreground">
					{activeSection === 'community' ? 'Popular Tags' : activeSection === 'jobs' ? 'Job Categories' : 'Topics'}
				</h3>
				<nav class="space-y-1">
					{#each currentMenu.tags as tag}
						<a
							href="/t/{tag}"
							class="flex items-center gap-2 rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
						>
							<span class="text-muted-foreground/60">#</span>
							{tag}
						</a>
					{/each}
				</nav>
			</div>
		{/if}
	</div>
</aside>
