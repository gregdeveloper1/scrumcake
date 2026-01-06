<script lang="ts">
	import type { Article } from '$lib/data/articles';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import ReactionBar from './ReactionBar.svelte';
	import MarkdownRenderer from '$lib/components/chat/MarkdownRenderer.svelte';
	import { cn } from '$lib/utils';

	interface Props {
		article: Article;
		class?: string;
	}

	let { article, class: className }: Props = $props();

	let following = $state(false);

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const now = new Date();
		const diffTime = Math.abs(now.getTime() - date.getTime());
		const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

		if (diffDays === 0) return 'Today';
		if (diffDays === 1) return 'Yesterday';
		if (diffDays < 7) return `${diffDays} days ago`;

		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
	}
</script>

<article class={cn('', className)}>
	<!-- Header Section (Medium style) -->
	<header class="mb-6">
		<!-- Title -->
		<h1 class="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight mb-4">
			{article.title}
		</h1>

		<!-- Subtitle/Excerpt -->
		<p class="text-xl text-muted-foreground mb-6">
			{article.excerpt}
		</p>

		<!-- Author Row -->
		<div class="flex items-center gap-3 mb-4">
			<a href="/{article.author.username}" class="shrink-0">
				<Avatar.Root class="h-11 w-11">
					<Avatar.Image src={article.author.avatar} alt={article.author.name} />
					<Avatar.Fallback>{article.author.name[0]}</Avatar.Fallback>
				</Avatar.Root>
			</a>
			<div class="flex flex-wrap items-center gap-x-3 gap-y-1">
				<div class="flex items-center gap-2">
					<a
						href="/{article.author.username}"
						class="font-medium hover:underline"
					>
						{article.author.name}
					</a>
					<Button
						variant="outline"
						size="sm"
						class="h-7 rounded-full px-3 text-xs"
						onclick={() => (following = !following)}
					>
						{following ? 'Following' : 'Follow'}
					</Button>
				</div>
				<div class="flex items-center gap-1.5 text-sm text-muted-foreground">
					<span>{article.readingTime} min read</span>
					<span>·</span>
					<span>{formatDate(article.publishedAt)}</span>
				</div>
			</div>
		</div>

		<!-- Reaction Bar (above cover image) -->
		<ReactionBar {article} class="border-y border-border" />
	</header>

	<!-- Cover Image -->
	{#if article.coverImage}
		<img
			src={article.coverImage}
			alt={article.title}
			class="w-full rounded-lg object-cover mb-8"
			style="aspect-ratio: 16/9;"
		/>
	{/if}

	<!-- Content -->
	<div class="article-content">
		<MarkdownRenderer content={article.content} />
	</div>

	<!-- Tags -->
	<div class="flex flex-wrap gap-2 mt-10 pt-6 border-t border-border">
		{#each article.tags as tag}
			<a
				href="/t/{tag}"
				class="px-3 py-1.5 rounded-full bg-muted text-sm text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors"
			>
				{tag}
			</a>
		{/each}
	</div>

	<!-- Reaction Bar (bottom) -->
	<ReactionBar {article} class="border-t border-border mt-6" />
</article>
