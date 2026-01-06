<script lang="ts">
	import type { Article } from '$lib/data/articles';
	import { cn } from '$lib/utils';

	interface Props {
		article: Article;
		class?: string;
	}

	let { article, class: className }: Props = $props();

	let clapped = $state(false);
	let saved = $state(false);
</script>

<div class={cn('flex items-center justify-between py-3', className)}>
	<!-- Left side: Claps & Comments -->
	<div class="flex items-center gap-4">
		<!-- Clap -->
		<button
			class={cn(
				'flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors',
				clapped && 'text-foreground'
			)}
			onclick={() => (clapped = !clapped)}
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
			>
				<path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
			</svg>
			<span class="text-sm">{article.reactions.hearts + (clapped ? 1 : 0)}</span>
		</button>

		<!-- Comments -->
		<a
			href="#comments"
			class="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
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
			>
				<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
			</svg>
			<span class="text-sm">{article.commentsCount}</span>
		</a>
	</div>

	<!-- Right side: Save, Listen, Share, More -->
	<div class="flex items-center gap-1">
		<!-- Save/Bookmark -->
		<button
			class={cn(
				'p-2 rounded-full hover:bg-muted transition-colors',
				saved ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
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
			>
				<path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
			</svg>
		</button>

		<!-- Listen/Play -->
		<button
			class="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
			aria-label="Listen"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="none"
				stroke="currentColor"
				stroke-width="1.5"
			>
				<circle cx="12" cy="12" r="10" />
				<polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
			</svg>
		</button>

		<!-- Share -->
		<button
			class="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
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
			>
				<path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
				<polyline points="16 6 12 2 8 6" />
				<line x1="12" x2="12" y1="2" y2="15" />
			</svg>
		</button>

		<!-- More Options -->
		<button
			class="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
			aria-label="More options"
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				width="24"
				height="24"
				viewBox="0 0 24 24"
				fill="currentColor"
				stroke="none"
			>
				<circle cx="12" cy="12" r="1.5" />
				<circle cx="19" cy="12" r="1.5" />
				<circle cx="5" cy="12" r="1.5" />
			</svg>
		</button>
	</div>
</div>
