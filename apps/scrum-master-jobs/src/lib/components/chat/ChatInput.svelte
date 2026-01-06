<!--
	ChatInput.svelte
	Auto-resizing textarea with send button for chat input
-->

<script lang="ts">
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';

	interface Props {
		value?: string;
		placeholder?: string;
		disabled?: boolean;
		isLoading?: boolean;
		onsubmit?: (value: string) => void;
		onstop?: () => void;
		class?: string;
	}

	let {
		value = $bindable(''),
		placeholder = 'Message Claude...',
		disabled = false,
		isLoading = false,
		onsubmit,
		onstop,
		class: className
	}: Props = $props();

	let textareaRef: HTMLTextAreaElement;

	// Auto-resize textarea
	function adjustHeight() {
		if (textareaRef) {
			textareaRef.style.height = 'auto';
			textareaRef.style.height = Math.min(textareaRef.scrollHeight, 200) + 'px';
		}
	}

	function handleInput(e: Event) {
		const target = e.target as HTMLTextAreaElement;
		value = target.value;
		adjustHeight();
	}

	function handleKeydown(e: KeyboardEvent) {
		// Enter to send (without Shift)
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			handleSubmit();
		}
	}

	function handleSubmit() {
		const trimmed = value.trim();
		if (trimmed && !disabled && !isLoading && onsubmit) {
			onsubmit(trimmed);
			value = '';
			// Reset height after clearing
			if (textareaRef) {
				textareaRef.style.height = 'auto';
			}
		}
	}

	function handleStop() {
		if (onstop) {
			onstop();
		}
	}

	let canSend = $derived(value.trim().length > 0 && !disabled && !isLoading);
</script>

<div class={cn('relative', className)}>
	<div
		class="flex items-end gap-2 rounded-xl border border-border bg-card px-2 py-1.5 shadow-sm transition-shadow focus-within:shadow-md focus-within:ring-2 focus-within:ring-ring/20"
	>
		<textarea
			bind:this={textareaRef}
			{value}
			{placeholder}
			disabled={disabled || isLoading}
			rows={1}
			oninput={handleInput}
			onkeydown={handleKeydown}
			class="max-h-[200px] min-h-[36px] flex-1 resize-none bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
		></textarea>

		{#if isLoading}
			<!-- Stop button -->
			<Button
				type="button"
				size="icon"
				variant="ghost"
				onclick={handleStop}
				class="h-8 w-8 shrink-0 rounded-lg hover:bg-destructive/10 hover:text-destructive"
				aria-label="Stop generating"
			>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="16"
					height="16"
					viewBox="0 0 24 24"
					fill="currentColor"
					stroke="none"
				>
					<rect x="6" y="6" width="12" height="12" rx="2" />
				</svg>
			</Button>
		{:else}
			<!-- Send button -->
			<Button
				type="button"
				size="icon"
				onclick={handleSubmit}
				disabled={!canSend}
				class={cn(
					'h-8 w-8 shrink-0 rounded-lg transition-all',
					canSend
						? 'bg-primary text-primary-foreground hover:bg-primary/90'
						: 'bg-muted text-muted-foreground'
				)}
				aria-label="Send message"
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
					<path d="m5 12 7-7 7 7" />
					<path d="M12 19V5" />
				</svg>
			</Button>
		{/if}
	</div>

	<!-- Helper text -->
	<p class="mt-2 text-center text-xs text-muted-foreground">
		Press <kbd class="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs"
			>Enter</kbd
		>
		to send,
		<kbd class="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-xs"
			>Shift + Enter</kbd
		> for new line
	</p>
</div>
