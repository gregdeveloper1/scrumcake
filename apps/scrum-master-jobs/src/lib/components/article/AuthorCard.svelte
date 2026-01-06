<script lang="ts">
	import type { User } from '$lib/data/users';
	import { articles } from '$lib/data/articles';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	interface Props {
		author: User;
		class?: string;
	}

	let { author, class: className }: Props = $props();

	let following = $state(false);

	// Get more articles from this author
	let moreFromAuthor = $derived(
		articles.filter((a) => a.author.username === author.username).slice(0, 3)
	);

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
	}
</script>

<aside class={cn('rounded-lg border border-border bg-card overflow-hidden', className)}>
	<!-- Header with Avatar and Name -->
	<div class="bg-muted/30 p-4 pb-0">
		<div class="flex items-start gap-3">
			<a href="/{author.username}" class="-mt-2">
				<Avatar.Root class="h-12 w-12 border-2 border-background">
					<Avatar.Image src={author.avatar} alt={author.name} />
					<Avatar.Fallback>{author.name[0]}</Avatar.Fallback>
				</Avatar.Root>
			</a>
			<a href="/{author.username}" class="font-bold text-lg hover:text-primary transition-colors">
				{author.name}
			</a>
		</div>
	</div>

	<!-- Follow Button -->
	<div class="px-4 py-3">
		<Button
			variant={following ? 'outline' : 'default'}
			class="w-full"
			onclick={() => (following = !following)}
		>
			{following ? 'Following' : 'Follow'}
		</Button>
	</div>

	<!-- Bio & Info -->
	<div class="px-4 pb-4 space-y-4">
		<p class="text-sm text-muted-foreground">{author.bio}</p>

		<div class="space-y-3">
			{#if author.education}
				<div>
					<dt class="text-xs font-bold uppercase text-muted-foreground tracking-wide">Education</dt>
					<dd class="text-sm mt-0.5">{author.education}</dd>
				</div>
			{/if}

			{#if author.work}
				<div>
					<dt class="text-xs font-bold uppercase text-muted-foreground tracking-wide">Work</dt>
					<dd class="text-sm mt-0.5">{author.work}</dd>
				</div>
			{/if}

			{#if author.location}
				<div>
					<dt class="text-xs font-bold uppercase text-muted-foreground tracking-wide">Location</dt>
					<dd class="text-sm mt-0.5">{author.location}</dd>
				</div>
			{/if}

			<div>
				<dt class="text-xs font-bold uppercase text-muted-foreground tracking-wide">Joined</dt>
				<dd class="text-sm mt-0.5">{formatDate(author.joinedAt)}</dd>
			</div>
		</div>
	</div>

	<!-- More from Author -->
	{#if moreFromAuthor.length > 0}
		<div class="border-t border-border">
			<h3 class="px-4 py-3 text-sm font-semibold">
				More from <a href="/{author.username}" class="text-primary hover:underline">{author.name}</a>
			</h3>
			<div class="divide-y divide-border">
				{#each moreFromAuthor as post}
					<a
						href="/{post.author.username}/{post.slug}"
						class="block px-4 py-3 transition-colors hover:bg-muted/50"
					>
						<h4 class="text-sm font-medium leading-snug text-muted-foreground hover:text-foreground transition-colors">
							{post.title}
						</h4>
						<div class="mt-1 flex flex-wrap gap-1.5">
							{#each post.tags.slice(0, 4) as tag}
								<span class="text-xs text-muted-foreground">#{tag}</span>
							{/each}
						</div>
					</a>
				{/each}
			</div>
		</div>
	{/if}
</aside>
