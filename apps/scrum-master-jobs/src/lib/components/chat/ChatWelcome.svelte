<!--
	ChatWelcome.svelte
	Welcome screen shown when there are no messages
-->

<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		onsuggestion?: (suggestion: string) => void;
		class?: string;
	}

	let { onsuggestion, class: className }: Props = $props();

	const suggestions = [
		{
			icon: '💡',
			title: 'Explain a concept',
			prompt: 'Explain how async/await works in JavaScript'
		},
		{
			icon: '🐛',
			title: 'Debug my code',
			prompt: 'Help me debug this error: TypeError: Cannot read property of undefined'
		},
		{
			icon: '✨',
			title: 'Write code',
			prompt: 'Write a function to validate email addresses in TypeScript'
		},
		{
			icon: '🔄',
			title: 'Refactor code',
			prompt: 'How can I refactor this code to be more maintainable?'
		}
	];

	function handleSuggestion(prompt: string) {
		if (onsuggestion) {
			onsuggestion(prompt);
		}
	}
</script>

<div class={cn('flex flex-col items-center justify-center px-4 py-12', className)}>
	<!-- Logo/Icon -->
	<div
		class="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="32"
			height="32"
			viewBox="0 0 24 24"
			fill="none"
			stroke="white"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
		</svg>
	</div>

	<!-- Welcome text -->
	<h1 class="mb-2 text-2xl font-semibold text-foreground">How can I help you today?</h1>
	<p class="mb-8 max-w-md text-center text-muted-foreground">
		I'm Claude, your AI coding assistant. Ask me anything about programming, debugging, or building
		software.
	</p>

	<!-- Suggestion chips -->
	<div class="grid w-full max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
		{#each suggestions as suggestion}
			<button
				type="button"
				onclick={() => handleSuggestion(suggestion.prompt)}
				class="group flex items-start gap-3 rounded-xl border border-border bg-card p-4 text-left transition-all hover:border-primary/50 hover:bg-accent hover:shadow-sm"
			>
				<span class="text-xl">{suggestion.icon}</span>
				<div class="flex-1">
					<p class="font-medium text-foreground group-hover:text-primary">{suggestion.title}</p>
					<p class="mt-0.5 line-clamp-1 text-sm text-muted-foreground">{suggestion.prompt}</p>
				</div>
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
					class="mt-1 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100"
				>
					<path d="m9 18 6-6-6-6" />
				</svg>
			</button>
		{/each}
	</div>
</div>
