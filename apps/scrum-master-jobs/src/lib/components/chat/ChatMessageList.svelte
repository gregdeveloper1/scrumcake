<!--
	ChatMessageList.svelte
	Scrollable list of chat messages with smart auto-scroll
-->

<script lang="ts">
	import { cn } from '$lib/utils';
	import ChatMessage from './ChatMessage.svelte';
	import ChatWelcome from './ChatWelcome.svelte';
	import ChatTypingIndicator from './ChatTypingIndicator.svelte';
	import type { UIMessage } from 'ai';

	interface Props {
		messages: UIMessage[];
		isLoading?: boolean;
		onsuggestion?: (suggestion: string) => void;
		class?: string;
	}

	let { messages, isLoading = false, onsuggestion, class: className }: Props = $props();

	let scrollContainer: HTMLElement;
	let isUserScrolledUp = $state(false);

	// Track if user has scrolled up from bottom
	function handleScroll() {
		if (!scrollContainer) return;
		const { scrollTop, scrollHeight, clientHeight } = scrollContainer;
		const distanceFromBottom = scrollHeight - scrollTop - clientHeight;
		isUserScrolledUp = distanceFromBottom > 100;
	}

	// Get the last message's text content for tracking changes during streaming
	let lastMessageContent = $derived.by(() => {
		if (messages.length === 0) return '';
		const lastMsg = messages[messages.length - 1];
		if (Array.isArray(lastMsg?.parts)) {
			return lastMsg.parts
				.filter((p): p is { type: 'text'; text: string } => p?.type === 'text')
				.map((p) => p.text)
				.join('');
		}
		return typeof lastMsg?.content === 'string' ? lastMsg.content : '';
	});

	// Auto-scroll during streaming - tracks content changes
	$effect(() => {
		// Dependencies: message count AND last message content (for streaming updates)
		const _ = messages.length;
		const __ = lastMessageContent;

		if (!isUserScrolledUp && scrollContainer) {
			requestAnimationFrame(() => {
				scrollContainer?.scrollTo({
					top: scrollContainer.scrollHeight,
					behavior: 'instant' // Use instant for smoother streaming follow
				});
			});
		}
	});

	// Scroll to bottom when AI starts responding
	$effect(() => {
		if (isLoading && scrollContainer && !isUserScrolledUp) {
			requestAnimationFrame(() => {
				scrollContainer?.scrollTo({
					top: scrollContainer.scrollHeight,
					behavior: 'instant'
				});
			});
		}
	});

	let hasMessages = $derived(messages.length > 0);
	let showTypingIndicator = $derived(
		isLoading && messages.length > 0 && messages[messages.length - 1]?.role === 'user'
	);
</script>

<div
	bind:this={scrollContainer}
	onscroll={handleScroll}
	class={cn('flex-1 overflow-y-auto', className)}
>
	<div class="mx-auto max-w-3xl">
		{#if !hasMessages}
			<!-- Welcome screen when no messages -->
			<ChatWelcome {onsuggestion} class="min-h-full" />
		{:else}
			<!-- Message list -->
			<div class="py-4">
				{#each messages as message (message.id)}
					<ChatMessage {message} />
				{/each}

				{#if showTypingIndicator}
					<ChatTypingIndicator />
				{/if}
			</div>
		{/if}
	</div>
</div>
