<!--
	ChatTypingIndicator.svelte
	Animated typing indicator shown while AI is generating a response
-->

<script lang="ts">
	import { cn } from '$lib/utils';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();
</script>

<div class={cn('flex items-center gap-3 px-4 py-3', className)}>
	<!-- AI Avatar -->
	<div
		class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600"
	>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="white"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<path
				d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"
				class="animate-pulse"
				style="animation-delay: 0ms;"
			/>
		</svg>
	</div>

	<!-- Typing dots -->
	<div class="flex items-center gap-1">
		<span class="typing-dot" style="animation-delay: 0ms;"></span>
		<span class="typing-dot" style="animation-delay: 150ms;"></span>
		<span class="typing-dot" style="animation-delay: 300ms;"></span>
	</div>
</div>

<style>
	.typing-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background-color: var(--muted-foreground);
		opacity: 0.6;
		animation: typing-bounce 1.4s infinite ease-in-out both;
	}

	@keyframes typing-bounce {
		0%,
		80%,
		100% {
			transform: scale(0.8);
			opacity: 0.4;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}
</style>
