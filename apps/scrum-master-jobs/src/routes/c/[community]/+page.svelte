<script lang="ts">
	import { page } from '$app/state';
	import { getCommunityById } from '$lib/data/communities';
	import { getArticlesByCommunity } from '$lib/data/articles';
	import ArticleCard from '$lib/components/feed/ArticleCard.svelte';
	import FeedTabs from '$lib/components/feed/FeedTabs.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';

	let communityId = $derived(page.params.community ?? '');
	let community = $derived(getCommunityById(communityId));
	let communityArticles = $derived(
		community ? getArticlesByCommunity(community.id) : []
	);

	let activeTab = $state<'relevant' | 'latest' | 'top'>('relevant');

	let sortedArticles = $derived(() => {
		const articles = [...communityArticles];
		switch (activeTab) {
			case 'latest':
				return articles.sort(
					(a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
				);
			case 'top':
				return articles.sort(
					(a, b) => b.reactions.hearts + b.reactions.unicorns - (a.reactions.hearts + a.reactions.unicorns)
				);
			default:
				return articles;
		}
	});
</script>

{#if community}
	<div class="p-4 lg:p-6">
		<!-- Community Header -->
		<div class="rounded-lg border border-border bg-card overflow-hidden mb-6">
			<!-- Cover/Banner -->
			<div class="h-24 bg-gradient-to-r from-primary/20 to-primary/5 relative">
				<div class="absolute inset-0 flex items-center justify-center">
					<h1 class="text-3xl font-bold text-foreground/80">{community.name}</h1>
				</div>
			</div>

			<div class="p-6">
				<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
					<div class="flex items-center gap-4">
						<img
							src={community.icon}
							alt={community.name}
							class="h-16 w-16 rounded-lg object-cover border-2 border-background shadow-sm"
						/>
						<div>
							<h2 class="text-xl font-bold">{community.name}</h2>
							<p class="text-sm text-muted-foreground">{community.description}</p>
						</div>
					</div>
					<Button>Join Community</Button>
				</div>

				<Separator class="my-4" />

				<!-- Community Stats -->
				<div class="flex flex-wrap gap-6 text-sm">
					<div>
						<span class="font-bold">{community.membersCount.toLocaleString()}</span>
						<span class="text-muted-foreground ml-1">Members</span>
					</div>
					<div>
						<span class="font-bold">{community.postsCount.toLocaleString()}</span>
						<span class="text-muted-foreground ml-1">Posts</span>
					</div>
					<div>
						<span class="font-bold">{communityArticles.length}</span>
						<span class="text-muted-foreground ml-1">Articles shown</span>
					</div>
				</div>
			</div>
		</div>

		<!-- Feed Tabs -->
		<FeedTabs bind:activeTab />

		<!-- Articles -->
		<div class="space-y-4 mt-4">
			{#each sortedArticles() as article (article.id)}
				<ArticleCard {article} communitySlug={community.id} />
			{:else}
				<div class="rounded-lg border border-border bg-card p-8 text-center">
					<p class="text-muted-foreground">No articles in this community yet.</p>
					<p class="text-sm text-muted-foreground mt-1">Be the first to post!</p>
				</div>
			{/each}
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center min-h-[400px]">
		<div class="text-center">
			<h1 class="text-2xl font-bold mb-2">Community not found</h1>
			<p class="text-muted-foreground">The community you're looking for doesn't exist.</p>
			<a href="/" class="text-primary hover:underline mt-4 inline-block">← Back to home</a>
		</div>
	</div>
{/if}
