<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getArticleBySlug } from '$lib/data/articles';
	import { getCommunityById } from '$lib/data/communities';
	import ArticleContent from '$lib/components/article/ArticleContent.svelte';
	import AuthorCard from '$lib/components/article/AuthorCard.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';

	let slug = $derived(page.params.slug ?? '');
	let communityId = $derived(page.params.community ?? '');
	let article = $derived(getArticleBySlug(slug));
	let community = $derived(getCommunityById(communityId));

	function goBack() {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			goto(`/c/${communityId}`);
		}
	}
</script>

<svelte:head>
	{#if article && community}
		<title>{article.title} - {community.name}</title>
		<meta name="description" content={article.excerpt} />
	{/if}
</svelte:head>

{#if article && community}
	<!-- Sticky Back Button -->
	<div class="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
		<div class="max-w-3xl mx-auto px-4 lg:px-6 py-3 flex items-center justify-between">
			<Button
				variant="ghost"
				size="sm"
				class="gap-2 text-muted-foreground hover:text-foreground"
				onclick={goBack}
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
					<path d="m12 19-7-7 7-7"/>
					<path d="M19 12H5"/>
				</svg>
				Back
			</Button>
			<!-- Community Context Badge -->
			<a
				href="/c/{community.id}"
				class="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
			>
				<img
					src={community.icon}
					alt={community.name}
					class="h-5 w-5 rounded object-cover"
				/>
				<Badge variant="secondary">{community.name}</Badge>
			</a>
		</div>
	</div>

	<div class="p-4 lg:p-6 max-w-3xl mx-auto">

		<!-- Article Content (includes reaction bars) -->
		<ArticleContent {article} />

		<!-- Community Info Card -->
		<div class="mt-8 rounded-lg border border-border bg-card p-4">
			<a href="/c/{community.id}" class="flex items-center gap-3 group">
				<img
					src={community.icon}
					alt={community.name}
					class="h-10 w-10 rounded-lg object-cover"
				/>
				<div>
					<h3 class="font-semibold group-hover:text-primary transition-colors">
						{community.name}
					</h3>
					<p class="text-xs text-muted-foreground">
						{community.membersCount.toLocaleString()} members
					</p>
				</div>
			</a>
			<p class="mt-3 text-sm text-muted-foreground">{community.description}</p>
		</div>

		<!-- Author Bio Card -->
		<div class="mt-8">
			<AuthorCard author={article.author} />
		</div>

		<!-- Comments Section -->
		<div id="comments" class="mt-8 rounded-lg border border-border bg-card p-6">
			<h2 class="text-xl font-bold mb-4">
				Discussion ({article.commentsCount})
			</h2>
			<div class="rounded-lg border border-dashed border-border p-8 text-center text-muted-foreground">
				<p>Comments would appear here</p>
				<p class="text-sm mt-1">Sign in to join the discussion</p>
			</div>
		</div>
	</div>
{:else if !community}
	<div class="flex items-center justify-center min-h-[400px]">
		<div class="text-center">
			<h1 class="text-2xl font-bold mb-2">Community not found</h1>
			<p class="text-muted-foreground">The community you're looking for doesn't exist.</p>
			<a href="/" class="text-primary hover:underline mt-4 inline-block">
				← Back to home
			</a>
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center min-h-[400px]">
		<div class="text-center">
			<h1 class="text-2xl font-bold mb-2">Article not found</h1>
			<p class="text-muted-foreground">The article you're looking for doesn't exist.</p>
			<a href="/c/{page.params.community}" class="text-primary hover:underline mt-4 inline-block">
				← Back to {page.params.community}
			</a>
		</div>
	</div>
{/if}
