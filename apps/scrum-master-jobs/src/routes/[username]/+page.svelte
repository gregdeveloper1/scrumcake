<script lang="ts">
	import { page } from '$app/state';
	import { getUserByUsername } from '$lib/data/users';
	import { getArticlesByAuthor } from '$lib/data/articles';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { Separator } from '$lib/components/ui/separator';
	import ArticleCard from '$lib/components/feed/ArticleCard.svelte';

	let username = $derived(page.params.username ?? '');
	let user = $derived(getUserByUsername(username));
	let userArticles = $derived(user ? getArticlesByAuthor(user.username) : []);

	let following = $state(false);

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
	}
</script>

<svelte:head>
	{#if user}
		<title>{user.name} (@{user.username})</title>
		<meta name="description" content={user.bio} />
	{/if}
</svelte:head>

{#if user}
	<div class="p-4 lg:p-6">
		<!-- Profile Header -->
		<div class="rounded-lg border border-border bg-card overflow-hidden mb-6">
			<!-- Cover -->
			<div class="h-24 bg-gradient-to-r from-primary/20 to-primary/5"></div>

			<!-- Profile Info -->
			<div class="px-6 pb-6">
				<div class="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10">
					<Avatar.Root class="h-24 w-24 border-4 border-background">
						<Avatar.Image src={user.avatar} alt={user.name} />
						<Avatar.Fallback class="text-2xl">{user.name[0]}</Avatar.Fallback>
					</Avatar.Root>

					<div class="flex-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
						<div>
							<h1 class="text-2xl font-bold">{user.name}</h1>
							<p class="text-muted-foreground">@{user.username}</p>
						</div>
						<Button
							variant={following ? 'outline' : 'default'}
							onclick={() => (following = !following)}
						>
							{following ? 'Following' : 'Follow'}
						</Button>
					</div>
				</div>

				<p class="mt-4 text-muted-foreground">{user.bio}</p>

				<!-- Stats -->
				<div class="flex flex-wrap gap-6 mt-4">
					<div class="text-center">
						<div class="font-bold">{user.postsCount}</div>
						<div class="text-sm text-muted-foreground">Posts</div>
					</div>
					<div class="text-center">
						<div class="font-bold">{user.followers.toLocaleString()}</div>
						<div class="text-sm text-muted-foreground">Followers</div>
					</div>
					<div class="text-center">
						<div class="font-bold">{user.following}</div>
						<div class="text-sm text-muted-foreground">Following</div>
					</div>
				</div>

				<Separator class="my-4" />

				<!-- Details -->
				<dl class="flex flex-wrap gap-x-6 gap-y-2 text-sm">
					{#if user.location}
						<div class="flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted-foreground">
								<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
								<circle cx="12" cy="10" r="3" />
							</svg>
							<dd class="text-muted-foreground">{user.location}</dd>
						</div>
					{/if}
					{#if user.work}
						<div class="flex items-center gap-2">
							<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted-foreground">
								<rect width="20" height="14" x="2" y="6" rx="2" />
								<path d="M16 6V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
							</svg>
							<dd class="text-muted-foreground">{user.work}</dd>
						</div>
					{/if}
					<div class="flex items-center gap-2">
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="text-muted-foreground">
							<rect x="3" y="4" width="18" height="18" rx="2" />
							<path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
						</svg>
						<dd class="text-muted-foreground">Joined {formatDate(user.joinedAt)}</dd>
					</div>
				</dl>
			</div>
		</div>

		<!-- User's Articles -->
		<h2 class="text-lg font-semibold mb-4">Posts by {user.name}</h2>
		<div class="space-y-4">
			{#each userArticles as article (article.id)}
				<ArticleCard {article} />
			{:else}
				<p class="text-muted-foreground">No posts yet.</p>
			{/each}
		</div>
	</div>
{:else}
	<div class="flex items-center justify-center min-h-[400px]">
		<div class="text-center">
			<h1 class="text-2xl font-bold mb-2">User not found</h1>
			<p class="text-muted-foreground">The user you're looking for doesn't exist.</p>
			<a href="/" class="text-primary hover:underline mt-4 inline-block">← Back to home</a>
		</div>
	</div>
{/if}
