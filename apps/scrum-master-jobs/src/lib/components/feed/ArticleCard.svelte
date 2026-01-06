<!--
	ArticleCard.svelte - Article Preview Card Component
	=====================================================

	A card component for displaying article previews in the feed.
	Shows author info, title, tags, reactions, comments, and thumbnail.

	Features:
	- Author avatar, name, and publish date
	- Article title with hover effect
	- Tag pills (up to 4 shown)
	- Reaction count (hearts + unicorns combined)
	- Comment count with link to comments section
	- Reading time badge
	- Save/bookmark button with toggle state
	- Thumbnail image with zoom effect on hover

	Props:
	- article: Article - The article data to display
	- communitySlug?: string - Optional community context for URL building
	- class?: string - Additional CSS classes

	URL Behavior:
	- Default: /{username}/{slug}
	- In community: /c/{community}/{username}/{slug}

	Styling:
	- Uses hover-lift utility for card hover effect
	- Uses image-zoom utility for thumbnail hover effect
	- Uses heart-btn utility for save button animation
-->

<script lang="ts">
	// ============================================
	// IMPORTS
	// ============================================

	// Type definition for article data
	import type { Article } from '$lib/data/articles';

	// UI Components
	import * as Avatar from '$lib/components/ui/avatar';

	// Utilities
	import { cn } from '$lib/utils';

	// ============================================
	// PROPS
	// ============================================

	interface Props {
		/** Article data to display */
		article: Article;
		/** Community slug for URL context (optional) */
		communitySlug?: string;
		/** Additional CSS classes */
		class?: string;
	}

	let { article, communitySlug, class: className }: Props = $props();

	// ============================================
	// LOCAL STATE
	// ============================================

	/**
	 * Track whether user has saved/bookmarked this article
	 * In production, this would sync with user's saved articles
	 */
	let saved = $state(false);

	// ============================================
	// DERIVED STATE
	// ============================================

	/**
	 * Build article URL based on context
	 * - In community: /c/{community}/{username}/{slug}
	 * - Default: /{username}/{slug}
	 */
	let articleUrl = $derived(
		communitySlug
			? `/c/${communitySlug}/${article.author.username}/${article.slug}`
			: `/${article.author.username}/${article.slug}`
	);

	// ============================================
	// HELPER FUNCTIONS
	// ============================================

	/**
	 * Format ISO date string to readable format
	 * @param dateString - ISO date string (e.g., "2024-01-15T10:30:00Z")
	 * @returns Formatted date (e.g., "Jan 15")
	 */
	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
</script>

<!--
	ARTICLE CARD
	Uses hover-lift utility for subtle elevation on hover
	Rounded corners and border for card appearance
-->
<article class={cn('rounded-xl border border-border bg-card overflow-hidden hover-lift', className)}>
	<div class="flex p-4 gap-4">

		<!-- ========================================
		     CONTENT AREA
		     ========================================
		     Left side: author info, title, tags, footer
		     flex-1 makes it take remaining space
		     min-w-0 prevents flex item from overflowing
		-->
		<div class="flex-1 min-w-0">

			<!-- Author Info Row -->
			<div class="flex items-center gap-2 mb-2">
				<!-- Author Avatar (links to profile) -->
				<a href="/{article.author.username}" class="shrink-0">
					<Avatar.Root class="h-7 w-7 ring-2 ring-background">
						<Avatar.Image src={article.author.avatar} alt={article.author.name} />
						<Avatar.Fallback class="text-xs">{article.author.name[0]}</Avatar.Fallback>
					</Avatar.Root>
				</a>
				<!-- Author Name and Date -->
				<div class="flex items-center gap-1.5 text-sm min-w-0">
					<a
						href="/{article.author.username}"
						class="font-medium hover:text-primary transition-colors truncate"
					>
						{article.author.name}
					</a>
					<span class="text-muted-foreground shrink-0">·</span>
					<span class="text-muted-foreground shrink-0">{formatDate(article.publishedAt)}</span>
				</div>
			</div>

			<!-- Article Title -->
			<h2 class="mb-1.5">
				<a
					href={articleUrl}
					class="text-lg font-semibold leading-snug hover:text-primary transition-colors line-clamp-2"
				>
					{article.title}
				</a>
			</h2>

			<!-- Tags (max 4 shown) -->
			<div class="flex flex-wrap gap-1.5 mb-3">
				{#each article.tags.slice(0, 4) as tag}
					<a
						href="/t/{tag}"
						class="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
					>
						{tag}
					</a>
				{/each}
			</div>

			<!-- Footer: Reactions, Comments, Meta -->
			<div class="flex items-center justify-between">

				<!-- Left: Reactions & Comments -->
				<div class="flex items-center gap-3">
					<!-- Reactions (hearts + unicorns combined) -->
					<a
						href={articleUrl}
						class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
					>
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
							<path
								d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
							/>
						</svg>
						<span class="font-medium">{article.reactions.hearts + article.reactions.unicorns}</span>
					</a>

					<!-- Comments (links to comments section) -->
					<a
						href="{articleUrl}#comments"
						class="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors"
					>
						<!-- Message bubble icon -->
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
							<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
						</svg>
						<span class="font-medium">{article.commentsCount}</span>
					</a>
				</div>

				<!-- Right: Reading Time & Save Button -->
				<div class="flex items-center gap-2">
					<!-- Reading Time Badge -->
					<span class="text-xs text-muted-foreground px-2 py-1 bg-muted rounded-full">
						{article.readingTime} min
					</span>

					<!-- Save/Bookmark Button -->
					<button
						onclick={() => (saved = !saved)}
						class={cn(
							'p-2 rounded-full transition-all heart-btn',
							saved
								? 'text-primary bg-primary/10'
								: 'text-muted-foreground hover:text-primary hover:bg-muted'
						)}
						aria-label="Save"
					>
						<!-- Heart icon (filled when saved) -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							width="16"
							height="16"
							viewBox="0 0 24 24"
							fill={saved ? 'currentColor' : 'none'}
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
						</svg>
					</button>
				</div>
			</div>
		</div>

		<!-- ========================================
		     THUMBNAIL IMAGE
		     ========================================
		     Right side: article cover image
		     - Hidden on small screens (sm:block)
		     - Uses image-zoom utility for hover effect
		-->
		{#if article.coverImage}
			<a href={articleUrl} class="shrink-0 hidden sm:block image-zoom rounded-xl">
				<img
					src={article.coverImage}
					alt={article.title}
					class="w-24 h-24 md:w-32 md:h-32 rounded-xl object-cover"
				/>
			</a>
		{/if}
	</div>
</article>
