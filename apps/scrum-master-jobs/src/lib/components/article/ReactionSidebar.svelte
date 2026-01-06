<script lang="ts">
	import type { Article } from '$lib/data/articles';
	import { cn } from '$lib/utils';

	interface Props {
		article: Article;
		class?: string;
	}

	let { article, class: className }: Props = $props();

	let liked = $state(false);
	let saved = $state(false);
</script>

<aside class={cn('hidden lg:flex flex-col items-center gap-2 pt-4', className)}>
	<div class="sticky top-20 flex flex-col items-center gap-1">
		<!-- Like/Heart -->
		<button
			class={cn(
				'flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors hover:bg-muted group',
				liked && 'text-red-500'
			)}
			onclick={() => (liked = !liked)}
			aria-label="Like"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill={liked ? 'currentColor' : 'none'}
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="group-hover:scale-110 transition-transform"
			>
				<path
					d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"
				/>
			</svg>
			<span class="text-xs text-muted-foreground">
				{article.reactions.hearts + (liked ? 1 : 0)}
			</span>
		</button>

		<!-- Comments -->
		<a
			href="#comments"
			class="flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors hover:bg-muted group"
			aria-label="Jump to comments"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="group-hover:scale-110 transition-transform"
			>
				<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
			</svg>
			<span class="text-xs text-muted-foreground">{article.commentsCount}</span>
		</a>

		<!-- Save/Bookmark -->
		<button
			class={cn(
				'flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors hover:bg-muted group',
				saved && 'text-blue-500'
			)}
			onclick={() => (saved = !saved)}
			aria-label="Save"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill={saved ? 'currentColor' : 'none'}
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="group-hover:scale-110 transition-transform"
			>
				<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
			</svg>
			<span class="text-xs text-muted-foreground">
				{article.reactions.saves + (saved ? 1 : 0)}
			</span>
		</button>

		<!-- Share/Repost -->
		<button
			class="flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors hover:bg-muted group"
			aria-label="Share"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="group-hover:scale-110 transition-transform"
			>
				<path d="m17 2 4 4-4 4" />
				<path d="M3 11v-1a4 4 0 0 1 4-4h14" />
				<path d="m7 22-4-4 4-4" />
				<path d="M21 13v1a4 4 0 0 1-4 4H3" />
			</svg>
		</button>

		<!-- More Options -->
		<button
			class="flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors hover:bg-muted group"
			aria-label="More options"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
				stroke-linecap="round"
				stroke-linejoin="round"
				class="group-hover:scale-110 transition-transform"
			>
				<circle cx="12" cy="12" r="1" />
				<circle cx="12" cy="5" r="1" />
				<circle cx="12" cy="19" r="1" />
			</svg>
		</button>
	</div>
</aside>
