<!--
	ChatMessage.svelte
	Individual chat message (user or assistant)
-->

<script lang="ts">
	import { cn } from '$lib/utils';
	import MarkdownRenderer from './MarkdownRenderer.svelte';
	import type { UIMessage } from 'ai';

	interface Props {
		message: UIMessage;
		class?: string;
	}

	let { message, class: className }: Props = $props();

	let isUser = $derived(message.role === 'user');

	// Get text content from message parts (AI SDK 6 format)
	let textContent = $derived.by(() => {
		// AI SDK 6 uses parts array
		if (Array.isArray(message.parts)) {
			const textParts = message.parts
				.filter((part): part is { type: 'text'; text: string } =>
					part && typeof part === 'object' && part.type === 'text' && 'text' in part
				)
				.map((part) => part.text);

			if (textParts.length > 0) {
				return textParts.join('');
			}
		}

		// Fallback: check if content exists (older format or direct string)
		if (typeof message.content === 'string') {
			return message.content;
		}

		// Last resort: stringify if it's an object
		if (message.content) {
			return JSON.stringify(message.content);
		}

		return '';
	});
</script>

<div class={cn('flex gap-3 px-4 py-4', isUser ? 'justify-end' : 'justify-start', className)}>
	{#if !isUser}
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
				<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
			</svg>
		</div>
	{/if}

	<!-- Message content -->
	<div
		class={cn(
			'max-w-[85%] md:max-w-[75%]',
			isUser
				? 'rounded-2xl rounded-br-md bg-primary px-4 py-3 text-primary-foreground'
				: 'flex-1'
		)}
	>
		{#if isUser}
			<!-- User message - plain text -->
			<p class="whitespace-pre-wrap text-sm">{textContent}</p>
		{:else}
			<!-- AI message - markdown rendered -->
			<div class="text-foreground">
				{#if textContent}
					<MarkdownRenderer content={textContent} />
				{:else}
					<span class="text-muted-foreground italic">Thinking...</span>
				{/if}
			</div>
		{/if}
	</div>

	{#if isUser}
		<!-- User Avatar -->
		<div
			class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground"
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
				<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
				<circle cx="12" cy="7" r="4" />
			</svg>
		</div>
	{/if}
</div>
