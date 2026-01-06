<!--
	RightSidebar.svelte - Trending Content & Listings Sidebar
	==========================================================

	The rightmost sidebar displaying trending discussions, watercooler posts,
	job listings, and help resources. Only visible on extra-large screens (xl+).

	Features:
	- Section-aware content (different content for different sections)
	- #discuss section (trending discussion threads)
	- #watercooler section (casual/off-topic posts)
	- Listings section (jobs and collaborations)
	- Subscribe box and stock prices for Table section
-->

<script lang="ts">
	/**
	 * RightSidebar Component Script
	 * ==============================
	 * Manages right sidebar content with section-awareness.
	 * Shows different content based on active navigation section.
	 * Hidden entirely for full-width sections (maps, table, jobs, videos, matching).
	 */

	// ============================================
	// IMPORTS
	// ============================================
	import { articles } from '$lib/data/articles';
	import { getActiveSection } from '$lib/stores/navigation.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';

	// ============================================
	// DERIVED STATE
	// ============================================

	/** Active section from navigation store (determines sidebar content) */
	let activeSection = $derived(getActiveSection());

	// ============================================
	// STATIC DATA - Community Section
	// ============================================

	/**
	 * Trending discussion posts.
	 * Filters articles with #discuss tag or high comment count.
	 */
	const discussPosts = articles
		.filter((a) => a.tags.includes('discuss') || a.commentsCount > 50)
		.slice(0, 5);

	/**
	 * Watercooler (casual) posts.
	 * Filters articles with #career or #advice tags.
	 */
	const watercoolerPosts = articles
		.filter((a) => a.tags.includes('career') || a.tags.includes('advice'))
		.slice(0, 5);

	/**
	 * Mock job listings and collaboration opportunities.
	 */
	const listings = [
		{ title: 'Senior Svelte Developer', type: 'job', company: 'TechCorp' },
		{ title: 'Full-Stack Engineer', type: 'job', company: 'StartupXYZ' },
		{ title: 'Looking for co-founder', type: 'collabs', company: 'IndieProject' }
	];

	// ============================================
	// STATIC DATA - Table Section
	// ============================================

	/**
	 * Mock stock prices for vegan/sustainable companies.
	 * Displayed only in the Table section.
	 */
	const stockPrices = [
		{ symbol: 'BYND', name: 'Beyond Meat', price: 8.42, change: -2.34, changePercent: -21.75 },
		{ symbol: 'OTLY', name: 'Oatly Group', price: 1.23, change: 0.08, changePercent: 6.96 },
		{ symbol: 'TTCF', name: 'Tattooed Chef', price: 0.45, change: -0.02, changePercent: -4.26 },
		{ symbol: 'ELF', name: 'e.l.f. Beauty', price: 112.50, change: 3.45, changePercent: 3.16 },
		{ symbol: 'BIRD', name: 'Allbirds', price: 7.82, change: 0.24, changePercent: 3.17 },
		{ symbol: 'HAIN', name: 'Hain Celestial', price: 6.89, change: -0.15, changePercent: -2.13 }
	];

	// ============================================
	// LOCAL STATE
	// ============================================

	/** Email input for newsletter subscription */
	let email = $state('');

	/** Whether subscription was successful (shows success message) */
	let subscribed = $state(false);

	// ============================================
	// EVENT HANDLERS
	// ============================================

	/**
	 * Handle newsletter subscription form submission.
	 * Shows success message for 3 seconds, then resets.
	 */
	function handleSubscribe(e: Event) {
		e.preventDefault();
		if (email) {
			subscribed = true;
			setTimeout(() => {
				subscribed = false;
				email = '';
			}, 3000);
		}
	}
</script>

<!-- ============================================
     CONDITIONAL RENDERING
     ============================================
     Hidden for full-width sections: maps, table, jobs, videos, matching.
     These sections need the full width for their content.
-->
{#if activeSection === 'maps' || activeSection === 'table' || activeSection === 'jobs' || activeSection === 'videos' || activeSection === 'matching'}
	<!-- Empty for full-width sections -->
{:else}
<!-- ============================================
     SIDEBAR CONTAINER
     ============================================
     Only visible on xl screens (1280px+).
     Fixed width: 320px. Full height with scroll.
-->
<aside class="hidden w-80 shrink-0 overflow-y-auto xl:block">
	<div class="space-y-4 p-4">

		{#if activeSection === 'table'}
			<!-- ========================================
			     SUBSCRIBE BOX (Table Section)
			     ======================================== -->
			<div class="rounded-lg border border-border bg-card overflow-hidden">
				<div class="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-4">
					<div class="flex items-center gap-2 mb-2">
						<svg class="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<rect width="20" height="16" x="2" y="4" rx="2" />
							<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
						</svg>
						<h2 class="font-semibold">Stay Updated</h2>
					</div>
					<p class="text-sm text-muted-foreground mb-4">
						Get weekly updates on new vegan companies and industry news.
					</p>
					{#if subscribed}
						<div class="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
							<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20 6 9 17l-5-5" />
							</svg>
							<span>Thanks for subscribing!</span>
						</div>
					{:else}
						<form onsubmit={handleSubscribe} class="space-y-2">
							<Input
								type="email"
								placeholder="your@email.com"
								bind:value={email}
								class="h-9 text-sm"
								required
							/>
							<Button type="submit" class="w-full h-9 text-sm">
								Subscribe
							</Button>
						</form>
					{/if}
				</div>
			</div>

			<!-- ========================================
			     STOCK PRICES (Table Section)
			     ======================================== -->
			<div class="rounded-lg border border-border bg-card">
				<div class="border-b border-border px-4 py-3">
					<div class="flex items-center justify-between">
						<h2 class="font-semibold">Stock Prices</h2>
						<span class="text-xs text-muted-foreground">Delayed 15min</span>
					</div>
					<p class="text-xs text-muted-foreground">Vegan & sustainable companies</p>
				</div>
				<div class="divide-y divide-border">
					{#each stockPrices as stock}
						<div class="px-4 py-2.5 hover:bg-muted/30 transition-colors">
							<div class="flex items-center justify-between">
								<div>
									<span class="font-medium text-sm">{stock.symbol}</span>
									<span class="text-xs text-muted-foreground ml-1.5">{stock.name}</span>
								</div>
								<div class="text-right">
									<div class="font-medium text-sm tabular-nums">${stock.price.toFixed(2)}</div>
									<div class={`text-xs tabular-nums ${stock.change >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
										{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.change >= 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%)
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
				<div class="border-t border-border px-4 py-2">
					<a href="#" class="text-sm text-muted-foreground hover:text-foreground transition-colors">
						View all stocks →
					</a>
				</div>
			</div>

			<!-- ========================================
			     MARKET NEWS (Table Section)
			     ======================================== -->
			<div class="rounded-lg border border-border bg-card p-4">
				<h2 class="font-semibold mb-2">Market News</h2>
				<div class="space-y-3">
					<div>
						<h3 class="text-sm font-medium hover:text-primary cursor-pointer">Beyond Meat announces new product line</h3>
						<p class="text-xs text-muted-foreground">2 hours ago</p>
					</div>
					<div>
						<h3 class="text-sm font-medium hover:text-primary cursor-pointer">Oatly expands to Asian markets</h3>
						<p class="text-xs text-muted-foreground">5 hours ago</p>
					</div>
					<div>
						<h3 class="text-sm font-medium hover:text-primary cursor-pointer">Plant-based sector sees Q4 growth</h3>
						<p class="text-xs text-muted-foreground">Yesterday</p>
					</div>
				</div>
			</div>

		{:else}
			<!-- ========================================
			     DEFAULT CONTENT (Other Sections)
			     ======================================== -->

			<!-- #DISCUSS SECTION -->
			<div class="rounded-lg border border-border bg-card">
				<div class="border-b border-border px-4 py-3">
					<h2 class="font-semibold">#discuss</h2>
					<p class="text-xs text-muted-foreground">Discussion threads targeting the whole community</p>
				</div>
				<div class="divide-y divide-border">
					{#each discussPosts as post}
						<a
							href="/{post.author.username}/{post.slug}"
							class="block px-4 py-3 transition-colors hover:bg-muted/50"
						>
							<h3 class="text-sm font-medium leading-snug text-foreground hover:text-primary">
								{post.title}
							</h3>
							<p class="mt-1 text-xs text-muted-foreground">
								{post.commentsCount} comments
							</p>
						</a>
					{/each}
				</div>
			</div>

			<!-- #WATERCOOLER SECTION -->
			<div class="rounded-lg border border-border bg-card">
				<div class="border-b border-border px-4 py-3">
					<h2 class="font-semibold">#watercooler</h2>
					<p class="text-xs text-muted-foreground">Light, and off-topic conversation</p>
				</div>
				<div class="divide-y divide-border">
					{#each watercoolerPosts as post}
						<a
							href="/{post.author.username}/{post.slug}"
							class="block px-4 py-3 transition-colors hover:bg-muted/50"
						>
							<h3 class="text-sm font-medium leading-snug text-foreground hover:text-primary">
								{post.title}
							</h3>
							<p class="mt-1 text-xs text-muted-foreground">
								{post.commentsCount} comments
							</p>
						</a>
					{/each}
				</div>
			</div>

			<!-- LISTINGS SECTION -->
			<div class="rounded-lg border border-border bg-card">
				<div class="border-b border-border px-4 py-3">
					<h2 class="font-semibold">Listings</h2>
					<p class="text-xs text-muted-foreground">Job opportunities and collaborations</p>
				</div>
				<div class="divide-y divide-border">
					{#each listings as listing}
						<a href="/listings" class="block px-4 py-3 transition-colors hover:bg-muted/50">
							<div class="flex items-start justify-between gap-2">
								<h3 class="text-sm font-medium leading-snug text-foreground hover:text-primary">
									{listing.title}
								</h3>
								<Badge variant="secondary" class="shrink-0 text-xs">
									{listing.type}
								</Badge>
							</div>
							<p class="mt-1 text-xs text-muted-foreground">
								{listing.company}
							</p>
						</a>
					{/each}
				</div>
				<div class="border-t border-border px-4 py-2">
					<a
						href="/listings"
						class="text-sm text-muted-foreground transition-colors hover:text-foreground"
					>
						See all listings →
					</a>
				</div>
			</div>

			<!-- HELP SECTION -->
			<div class="rounded-lg border border-border bg-card p-4">
				<h2 class="font-semibold">Need help?</h2>
				<p class="mt-1 text-sm text-muted-foreground">
					Check out our <a href="/faq" class="text-primary hover:underline">FAQ</a> or
					<a href="/contact" class="text-primary hover:underline">contact us</a>.
				</p>
			</div>
		{/if}
	</div>
</aside>
{/if}
