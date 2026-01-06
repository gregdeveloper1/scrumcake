<!--
	CodeBlock.svelte
	Syntax-highlighted code block with copy button
-->

<script lang="ts">
	import { cn } from '$lib/utils';
	import type { ThemeRegistration } from 'shiki';

	interface Props {
		code: string;
		language?: string;
		class?: string;
	}

	let { code, language = 'text', class: className }: Props = $props();

	let highlightedHtml = $state('');
	let displayedCode = $state('');
	let copied = $state(false);
	let isLoading = $state(true);
	let debounceTimer: ReturnType<typeof setTimeout> | null = null;

	// Xcode Dark theme (Apple-style colors)
	const xcodeTheme: ThemeRegistration = {
		name: 'xcode-dark',
		type: 'dark',
		colors: {
			'editor.background': '#1F1F24',
			'editor.foreground': '#FFFFFF'
		},
		tokenColors: [
			// Comments - muted gray-green
			{
				scope: ['comment', 'punctuation.definition.comment'],
				settings: { foreground: '#6C7986' }
			},
			// Keywords - pink/magenta (func, let, var, if, else, return, etc.)
			{
				scope: ['keyword', 'storage.type', 'storage.modifier'],
				settings: { foreground: '#FC5FA3' }
			},
			// Strings - red/coral
			{
				scope: ['string', 'punctuation.definition.string'],
				settings: { foreground: '#FC6A5D' }
			},
			// Numbers - yellow
			{
				scope: ['constant.numeric'],
				settings: { foreground: '#D0BF69' }
			},
			// Types/Classes - cyan
			{
				scope: ['entity.name.type', 'entity.name.class', 'support.type', 'support.class', 'entity.other.inherited-class'],
				settings: { foreground: '#5DD8FF' }
			},
			// Functions - purple/lavender
			{
				scope: ['entity.name.function', 'support.function', 'meta.function-call'],
				settings: { foreground: '#A167E6' }
			},
			// Variables and parameters - white
			{
				scope: ['variable', 'variable.parameter', 'variable.other'],
				settings: { foreground: '#FFFFFF' }
			},
			// Properties - light cyan
			{
				scope: ['variable.other.property', 'variable.other.object.property'],
				settings: { foreground: '#5DD8FF' }
			},
			// Constants and booleans - cyan
			{
				scope: ['constant.language', 'constant.other'],
				settings: { foreground: '#5DD8FF' }
			},
			// Operators - white
			{
				scope: ['keyword.operator'],
				settings: { foreground: '#FFFFFF' }
			},
			// Punctuation - white/gray
			{
				scope: ['punctuation'],
				settings: { foreground: '#FFFFFF' }
			},
			// Attributes/decorators - orange
			{
				scope: ['entity.other.attribute-name', 'meta.attribute'],
				settings: { foreground: '#D0A857' }
			},
			// Tags (HTML/XML) - cyan
			{
				scope: ['entity.name.tag'],
				settings: { foreground: '#5DD8FF' }
			},
			// Regex - red
			{
				scope: ['string.regexp'],
				settings: { foreground: '#FC6A5D' }
			}
		]
	};

	// Re-highlight when code or language changes (debounced)
	$effect(() => {
		// Track dependencies
		const currentCode = code;
		const currentLang = language;

		// Always update displayed code immediately for smooth streaming
		displayedCode = currentCode;

		// Debounce the expensive Shiki highlighting
		if (debounceTimer) {
			clearTimeout(debounceTimer);
		}

		debounceTimer = setTimeout(() => {
			highlightCode(currentCode, currentLang);
		}, 150); // Wait 150ms after last update before highlighting

		return () => {
			if (debounceTimer) {
				clearTimeout(debounceTimer);
			}
		};
	});

	async function highlightCode(codeText: string, lang: string) {
		try {
			const { codeToHtml } = await import('shiki');
			const html = await codeToHtml(codeText, {
				lang: lang || 'text',
				theme: xcodeTheme
			});
			// Only update if the code hasn't changed since we started highlighting
			if (codeText === displayedCode) {
				highlightedHtml = html;
				isLoading = false;
			}
		} catch (err) {
			// Fallback to plain text if language not supported
			if (codeText === displayedCode) {
				highlightedHtml = `<pre class="shiki"><code>${escapeHtml(codeText)}</code></pre>`;
				isLoading = false;
			}
		}
	}

	function escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#039;');
	}

	async function copyToClipboard() {
		try {
			await navigator.clipboard.writeText(code);
			copied = true;
			setTimeout(() => (copied = false), 2000);
		} catch (err) {
			console.error('Failed to copy:', err);
		}
	}

	// Format language display name
	let displayLanguage = $derived(
		language
			? language.charAt(0).toUpperCase() + language.slice(1)
			: 'Plain Text'
	);
</script>

<div class={cn('group relative my-4 overflow-hidden rounded-lg', className)}>
	<!-- Header bar -->
	<div
		class="flex items-center justify-between border-b border-white/10 bg-[#0d1117] px-4 py-2 text-xs"
	>
		<span class="font-medium text-gray-400">{displayLanguage}</span>
		<button
			type="button"
			onclick={copyToClipboard}
			class="flex items-center gap-1.5 rounded px-2 py-1 text-gray-400 transition-colors hover:bg-white/10 hover:text-gray-200"
		>
			{#if copied}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<path d="M20 6 9 17l-5-5" />
				</svg>
				<span>Copied!</span>
			{:else}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					width="14"
					height="14"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
					<path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
				</svg>
				<span>Copy</span>
			{/if}
		</button>
	</div>

	<!-- Code content -->
	<div class="overflow-x-auto bg-[#0d1117]">
		{#if highlightedHtml && !isLoading}
			<div class="code-block-content">
				{@html highlightedHtml}
			</div>
		{:else}
			<!-- Show plain text while streaming/loading - no flicker -->
			<pre class="m-0 p-4 text-sm text-white leading-relaxed bg-transparent" style="font-family: 'SF Mono', SFMono-Regular, ui-monospace, monospace; font-weight: 500;"><code>{displayedCode || code}</code></pre>
		{/if}
	</div>
</div>

<style>
	.code-block-content :global(pre) {
		margin: 0;
		padding: 1rem;
		background: transparent !important;
		overflow-x: auto;
	}

	.code-block-content :global(code) {
		font-family:
			'SF Mono',
			SFMono-Regular,
			ui-monospace,
			'Geist Mono',
			Menlo,
			Consolas,
			monospace !important;
		font-size: 0.875rem;
		font-weight: 500 !important;
		line-height: 1.6;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		opacity: 1 !important;
	}

	.code-block-content :global(.line) {
		display: inline;
	}

	/* Ensure Shiki spans have full opacity */
	.code-block-content :global(span) {
		opacity: 1 !important;
	}

	/* Force text visibility */
	.code-block-content :global(*) {
		text-shadow: none !important;
	}
</style>
