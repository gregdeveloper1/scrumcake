<script lang="ts">
	import { articles } from '$lib/data/articles';
	import ArticleCard from '$lib/components/feed/ArticleCard.svelte';
	import FeedTabs from '$lib/components/feed/FeedTabs.svelte';

	let activeTab = $state<'relevant' | 'latest' | 'top'>('relevant');

	let sortedArticles = $derived(() => {
		const sorted = [...articles];
		switch (activeTab) {
			case 'latest':
				return sorted.sort(
					(a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
				);
			case 'top':
				return sorted.sort(
					(a, b) =>
						b.reactions.hearts +
						b.reactions.unicorns -
						(a.reactions.hearts + a.reactions.unicorns)
				);
			case 'relevant':
			default:
				// Mix of engagement and recency
				return sorted.sort((a, b) => {
					const aScore =
						(a.reactions.hearts + a.reactions.unicorns + a.commentsCount) *
						(1 / (Date.now() - new Date(a.publishedAt).getTime()));
					const bScore =
						(b.reactions.hearts + b.reactions.unicorns + b.commentsCount) *
						(1 / (Date.now() - new Date(b.publishedAt).getTime()));
					return bScore - aScore;
				});
		}
	});
</script>

<div class="p-4 lg:p-6">
	<!-- Feed Header -->
	<FeedTabs {activeTab} onTabChange={(tab) => (activeTab = tab)} />

	<!-- Article Feed -->
	<div class="mt-4 space-y-4">
		{#each sortedArticles() as article (article.id)}
			<ArticleCard {article} />
		{/each}
	</div>
</div>
