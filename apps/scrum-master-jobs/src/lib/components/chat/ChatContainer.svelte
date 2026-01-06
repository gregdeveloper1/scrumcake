<!--
	ChatContainer.svelte
	Main chat container with AI SDK integration
-->

<script lang="ts">
	import { cn } from '$lib/utils';
	import { Chat, type UIMessage } from '@ai-sdk/svelte';
	import { DefaultChatTransport } from 'ai';
	import ChatMessageList from './ChatMessageList.svelte';
	import ChatInput from './ChatInput.svelte';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		class?: string;
	}

	let { class: className }: Props = $props();

	// Create transport for chat API (DefaultChatTransport for UI message stream)
	const transport = new DefaultChatTransport({
		api: '/askai'
	});

	// Initialize AI SDK Chat class
	const chat = new Chat({
		transport,
		onError: (error) => {
			console.error('Chat error:', error);
		}
	});

	// Input state
	let inputValue = $state('');

	// Reactive derived states from chat
	let messages = $derived(chat.messages);
	let status = $derived(chat.status);
	let error = $derived(chat.error);
	let isLoading = $derived(status === 'streaming' || status === 'submitted');
	let hasMessages = $derived(messages.length > 0);

	// Handle form submission
	async function handleSend(value: string) {
		if (!value.trim()) return;
		inputValue = '';
		await chat.sendMessage({ text: value });
	}

	// Handle suggestion click from welcome screen
	async function handleSuggestion(suggestion: string) {
		inputValue = '';
		await chat.sendMessage({ text: suggestion });
	}

	// Handle stop button - not directly supported, but we can track abort
	function handleStop() {
		// The Chat class handles abort internally
		// For now, just let the stream complete
	}

	// Handle retry after error
	async function handleRetry() {
		chat.clearError();
		await chat.regenerate();
	}

	// Start a new chat
	function handleNewChat() {
		chat.messages = [];
	}
</script>

<div class={cn('flex h-full flex-col', className)}>
	<!-- Header (only shown when there are messages) -->
	{#if hasMessages}
		<div class="flex items-center justify-between border-b border-border bg-card/50 px-4 py-3">
			<div class="flex items-center gap-2">
				<div
					class="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-purple-600"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="14"
						height="14"
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
				<span class="font-medium text-foreground">Claude</span>
				<span class="text-sm text-muted-foreground">Sonnet 4</span>
			</div>

			<Button variant="ghost" size="sm" onclick={handleNewChat} class="gap-2">
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
					<path d="M12 5v14" />
					<path d="M5 12h14" />
				</svg>
				New Chat
			</Button>
		</div>
	{/if}

	<!-- Messages area -->
	<ChatMessageList
		{messages}
		{isLoading}
		onsuggestion={handleSuggestion}
		class="flex-1"
	/>

	<!-- Error display -->
	{#if error}
		<div class="mx-auto w-full max-w-3xl px-4 pb-2">
			<div
				class="flex items-center justify-between rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-3"
			>
				<div class="flex items-center gap-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="18"
						height="18"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
						class="text-destructive"
					>
						<circle cx="12" cy="12" r="10" />
						<line x1="12" x2="12" y1="8" y2="12" />
						<line x1="12" x2="12.01" y1="16" y2="16" />
					</svg>
					<span class="text-sm text-destructive">
						{error.message || 'Something went wrong. Please try again.'}
					</span>
				</div>
				<Button variant="ghost" size="sm" onclick={handleRetry} class="text-destructive">
					Retry
				</Button>
			</div>
		</div>
	{/if}

	<!-- Input area -->
	<div class="border-t border-border bg-background">
		<div class="mx-auto max-w-3xl px-4 py-4">
			<ChatInput
				bind:value={inputValue}
				{isLoading}
				onsubmit={handleSend}
				onstop={handleStop}
			/>
		</div>
	</div>
</div>
