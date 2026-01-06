<!--
	CommunityIconBar.svelte - Community Quick Access Sidebar
	=========================================================

	The leftmost narrow sidebar showing community icons for quick navigation.
	This component provides fast access to different communities without
	needing to navigate through menus.

	Features:
	- Home button (returns to main feed)
	- Community icons with active state indication
	- Tooltips showing community names
	- "Create Community" button at bottom
	- Auto-highlights based on current route

	Layout Position:
	┌─────────┬─────────────────────────────────┐
	│ [THIS]  │  Rest of the app                │
	│  Icon   │                                 │
	│  Bar    │                                 │
	└─────────┴─────────────────────────────────┘

	Visual Structure:
	┌─────┐
	│ 🏠  │  Home (highlighted when not in community)
	├─────┤
	│ DEV │  Community icons (from communities data)
	│ 🎨  │  (highlighted with ring when active)
	│ 🌐  │
	├─────┤
	│  +  │  Create Community button
	└─────┘
-->

<script lang="ts">
	// ============================================
	// IMPORTS
	// ============================================

	// SvelteKit state for accessing current route
	import { page } from '$app/state';

	// Community data for rendering icons
	import { communities } from '$lib/data/communities';

	// Utilities
	import { cn } from '$lib/utils';

	// UI Components
	import * as Tooltip from '$lib/components/ui/tooltip';

	// ============================================
	// DERIVED STATE
	// ============================================

	/**
	 * Current community from URL params
	 * null when on home page or non-community routes
	 * Used to highlight the active community icon
	 */
	let currentCommunity = $derived(page.params.community || null);
</script>

<!--
	ASIDE CONTAINER
	Fixed width (w-14 = 56px) narrow vertical bar
	Full height with border on right side
-->
<aside class="hidden h-screen w-14 shrink-0 flex-col items-center border-r border-border bg-card py-3 lg:flex">

	<!-- ========================================
	     HOME BUTTON
	     ========================================
	     Returns to main feed (/)
	     Highlighted (primary bg) when not in any community
	-->
	<Tooltip.Root>
		<Tooltip.Trigger>
			<a
				href="/"
				class={cn(
					'mb-2 flex h-10 w-10 items-center justify-center rounded-lg transition-colors',
					!currentCommunity
						? 'bg-primary text-primary-foreground'
						: 'hover:bg-muted text-muted-foreground hover:text-foreground'
				)}
			>
				<!-- Home icon (Lucide) -->
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="20"
					height="20"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
					<polyline points="9 22 9 12 15 12 15 22" />
				</svg>
			</a>
		</Tooltip.Trigger>
		<Tooltip.Content side="right">
			<p>Home</p>
		</Tooltip.Content>
	</Tooltip.Root>

	<!-- Visual separator -->
	<div class="my-2 h-px w-8 bg-border"></div>

	<!-- ========================================
	     COMMUNITY ICONS
	     ========================================
	     Scrollable list of community icons
	     Each links to /c/[communityId]
	     Active community shown with ring highlight
	-->
	<nav class="flex flex-1 flex-col items-center gap-2 overflow-y-auto">
		{#each communities as community}
			<Tooltip.Root>
				<Tooltip.Trigger>
					<a
						href="/c/{community.id}"
						class={cn(
							'flex h-10 w-10 items-center justify-center rounded-lg transition-all',
							currentCommunity === community.id
								? 'ring-2 ring-primary ring-offset-2 ring-offset-background'
								: 'opacity-70 hover:opacity-100'
						)}
					>
						<img
							src={community.icon}
							alt={community.name}
							class="h-8 w-8 rounded-md object-cover"
						/>
					</a>
				</Tooltip.Trigger>
				<Tooltip.Content side="right">
					<p>{community.name}</p>
				</Tooltip.Content>
			</Tooltip.Root>
		{/each}
	</nav>

	<!-- ========================================
	     BOTTOM ACTIONS
	     ========================================
	     Pinned to bottom of sidebar
	     Currently just "Create Community" button
	-->
	<div class="mt-auto flex flex-col items-center gap-2">
		<!-- Visual separator -->
		<div class="h-px w-8 bg-border"></div>

		<!-- Create Community Button -->
		<Tooltip.Root>
			<Tooltip.Trigger>
				<button
					class="flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
				>
					<!-- Plus circle icon (Lucide) -->
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="20"
						height="20"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="12" cy="12" r="10" />
						<path d="M12 8v8" />
						<path d="M8 12h8" />
					</svg>
				</button>
			</Tooltip.Trigger>
			<Tooltip.Content side="right">
				<p>Create Community</p>
			</Tooltip.Content>
		</Tooltip.Root>
	</div>
</aside>
