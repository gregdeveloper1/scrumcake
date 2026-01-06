<script lang="ts">
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	import { getArticleBySlug } from '$lib/data/articles';
	import ArticleContent from '$lib/components/article/ArticleContent.svelte';
	import AuthorCard from '$lib/components/article/AuthorCard.svelte';
	import { Button } from '$lib/components/ui/button';

	let slug = $derived(page.params.slug ?? '');
	let article = $derived(getArticleBySlug(slug));

	function goBack() {
		if (window.history.length > 1) {
			window.history.back();
		} else {
			goto('/');
		}
	}

	// Share functions
	function shareToTwitter() {
		if (!article) return;
		const url = encodeURIComponent(window.location.href);
		const text = encodeURIComponent(article.title);
		window.open(`https://twitter.com/intent/tweet?url=${url}&text=${text}`, '_blank');
	}

	function shareToLinkedIn() {
		const url = encodeURIComponent(window.location.href);
		window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
	}

	function shareToFacebook() {
		const url = encodeURIComponent(window.location.href);
		window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
	}

	let copied = $state(false);
	function copyLink() {
		navigator.clipboard.writeText(window.location.href);
		copied = true;
		setTimeout(() => copied = false, 2000);
	}
</script>

<svelte:head>
	{#if article}
		<title>{article.title} - {article.author.name}</title>
		<meta name="description" content={article.excerpt} />
	{/if}
</svelte:head>

{#if article}
	<!-- Sticky Back Button & Share Bar -->
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

			<!-- Share Bar -->
			<div class="flex items-center gap-1">
				<span class="text-xs text-muted-foreground mr-2 hidden sm:inline">Share:</span>

				<!-- Twitter/X -->
				<Button
					variant="ghost"
					size="icon"
					class="h-8 w-8 text-muted-foreground hover:text-foreground"
					onclick={shareToTwitter}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
					</svg>
				</Button>

				<!-- LinkedIn -->
				<Button
					variant="ghost"
					size="icon"
					class="h-8 w-8 text-muted-foreground hover:text-foreground"
					onclick={shareToLinkedIn}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
						<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
					</svg>
				</Button>

				<!-- Facebook -->
				<Button
					variant="ghost"
					size="icon"
					class="h-8 w-8 text-muted-foreground hover:text-foreground"
					onclick={shareToFacebook}
				>
					<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
						<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
					</svg>
				</Button>

				<!-- Copy Link -->
				<Button
					variant="ghost"
					size="icon"
					class="h-8 w-8 text-muted-foreground hover:text-foreground"
					onclick={copyLink}
				>
					{#if copied}
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-green-500">
							<path d="M20 6 9 17l-5-5"/>
						</svg>
					{:else}
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
							<path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
						</svg>
					{/if}
				</Button>
			</div>
		</div>
	</div>

	<div class="p-4 lg:p-6 max-w-3xl mx-auto">
		<!-- Article Content (includes reaction bars) -->
		<ArticleContent {article} />

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
{:else}
	<div class="flex items-center justify-center min-h-[400px]">
		<div class="text-center">
			<h1 class="text-2xl font-bold mb-2">Article not found</h1>
			<p class="text-muted-foreground">The article you're looking for doesn't exist.</p>
			<a href="/" class="text-primary hover:underline mt-4 inline-block">
				← Back to home
			</a>
		</div>
	</div>
{/if}
