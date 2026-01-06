<!--
	MarkdownRenderer.svelte
	Renders markdown content with syntax-highlighted code blocks
-->

<script lang="ts">
	import { cn } from '$lib/utils';
	import CodeBlock from './CodeBlock.svelte';

	interface Props {
		content: string;
		class?: string;
	}

	let { content, class: className }: Props = $props();

	interface ParsedBlock {
		type: 'html' | 'code';
		content: string;
		language?: string;
	}

	let blocks = $state<ParsedBlock[]>([]);

	// Parse markdown and extract code blocks
	$effect(() => {
		parseContent(content);
	});

	async function parseContent(markdown: string) {
		try {
			const { marked } = await import('marked');
			const DOMPurify = (await import('dompurify')).default;

			// Store code blocks and replace with placeholders
			const codeBlocks: { code: string; language: string }[] = [];

			// Configure marked for GFM (tables, strikethrough, etc.)
			marked.setOptions({
				gfm: true,
				breaks: true
			});

			// Custom renderer to extract code blocks
			const renderer = new marked.Renderer();

			// Use a div with data attribute as placeholder (survives DOMPurify)
			renderer.code = function ({ text, lang }) {
				const index = codeBlocks.length;
				codeBlocks.push({
					code: text,
					language: lang || 'text'
				});
				return `<div data-code-block="${index}"></div>`;
			};

			// Parse markdown
			const html = await marked.parse(markdown, { renderer });

			// Sanitize HTML - allow our placeholder divs with data attributes
			const sanitized = DOMPurify.sanitize(html, {
				ALLOWED_TAGS: [
					'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'del', 'code', 'pre',
					'blockquote', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
					'a', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'hr',
					'div', 'span', 'sup', 'sub', 'mark'
				],
				ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'colspan', 'rowspan', 'data-code-block']
			});

			// Split by code block placeholder divs
			const parts = sanitized.split(/<div data-code-block="(\d+)"><\/div>/);
			const newBlocks: ParsedBlock[] = [];

			for (let i = 0; i < parts.length; i++) {
				if (i % 2 === 0) {
					// HTML content
					const trimmed = parts[i].trim();
					if (trimmed) {
						newBlocks.push({ type: 'html', content: trimmed });
					}
				} else {
					// Code block index
					const index = parseInt(parts[i], 10);
					const block = codeBlocks[index];
					if (block) {
						newBlocks.push({
							type: 'code',
							content: block.code,
							language: block.language
						});
					}
				}
			}

			blocks = newBlocks;
		} catch (err) {
			console.error('Markdown parse error:', err);
			blocks = [{ type: 'html', content: escapeHtml(markdown) }];
		}
	}

	function escapeHtml(text: string): string {
		return text
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;');
	}
</script>

<div class={cn('markdown-content', className)}>
	{#each blocks as block}
		{#if block.type === 'code'}
			<CodeBlock code={block.content} language={block.language} />
		{:else}
			<div class="prose-block">
				{@html block.content}
			</div>
		{/if}
	{/each}
</div>

<style>
	.markdown-content {
		font-size: 0.9375rem;
		line-height: 1.7;
	}

	/* Paragraphs */
	.prose-block :global(p) {
		margin-bottom: 1em;
	}

	.prose-block :global(p:last-child) {
		margin-bottom: 0;
	}

	/* Headings */
	.prose-block :global(h1),
	.prose-block :global(h2),
	.prose-block :global(h3),
	.prose-block :global(h4),
	.prose-block :global(h5),
	.prose-block :global(h6) {
		font-weight: 600;
		margin-top: 1.5em;
		margin-bottom: 0.5em;
		line-height: 1.3;
	}

	.prose-block :global(h1) {
		font-size: 1.5em;
		border-bottom: 1px solid var(--border);
		padding-bottom: 0.3em;
	}

	.prose-block :global(h2) {
		font-size: 1.3em;
		border-bottom: 1px solid var(--border);
		padding-bottom: 0.3em;
	}

	.prose-block :global(h3) {
		font-size: 1.15em;
	}

	.prose-block :global(h4) {
		font-size: 1em;
	}

	/* Bold & Italic */
	.prose-block :global(strong),
	.prose-block :global(b) {
		font-weight: 600;
		color: var(--foreground);
	}

	.prose-block :global(em),
	.prose-block :global(i) {
		font-style: italic;
	}

	/* Strikethrough */
	.prose-block :global(del),
	.prose-block :global(s) {
		text-decoration: line-through;
		opacity: 0.7;
	}

	/* Lists */
	.prose-block :global(ul),
	.prose-block :global(ol) {
		margin: 1em 0;
		padding-left: 1.5em;
	}

	.prose-block :global(ul) {
		list-style-type: disc;
	}

	.prose-block :global(ol) {
		list-style-type: decimal;
	}

	.prose-block :global(li) {
		margin: 0.35em 0;
	}

	.prose-block :global(li > ul),
	.prose-block :global(li > ol) {
		margin: 0.25em 0;
	}

	/* Inline code */
	.prose-block :global(code) {
		font-family: 'SF Mono', SFMono-Regular, ui-monospace, 'Geist Mono', monospace;
		font-size: 0.85em;
		font-weight: 500;
		padding: 0.2em 0.4em;
		background-color: var(--muted);
		border-radius: 0.25rem;
		color: var(--foreground);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	/* Blockquotes */
	.prose-block :global(blockquote) {
		margin: 1em 0;
		padding: 0.5em 1em;
		border-left: 4px solid var(--primary);
		background-color: var(--muted);
		border-radius: 0 0.25rem 0.25rem 0;
		color: var(--muted-foreground);
	}

	.prose-block :global(blockquote p) {
		margin: 0;
	}

	/* Links */
	.prose-block :global(a) {
		color: var(--primary);
		text-decoration: underline;
		text-underline-offset: 2px;
	}

	.prose-block :global(a:hover) {
		opacity: 0.8;
	}

	/* Horizontal Rule */
	.prose-block :global(hr) {
		margin: 1.5em 0;
		border: none;
		border-top: 1px solid var(--border);
	}

	/* Tables */
	.prose-block :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1em 0;
		font-size: 0.9em;
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		overflow: hidden;
	}

	.prose-block :global(thead) {
		background-color: var(--muted);
	}

	.prose-block :global(th) {
		padding: 0.75em 1em;
		text-align: left;
		font-weight: 600;
		border-bottom: 2px solid var(--border);
		color: var(--foreground);
	}

	.prose-block :global(td) {
		padding: 0.75em 1em;
		border-bottom: 1px solid var(--border);
	}

	.prose-block :global(tr:last-child td) {
		border-bottom: none;
	}

	.prose-block :global(tbody tr:hover) {
		background-color: var(--muted);
	}

	/* Images */
	.prose-block :global(img) {
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
		margin: 1em 0;
	}

	/* Mark/Highlight */
	.prose-block :global(mark) {
		background-color: oklch(0.9 0.1 100);
		padding: 0.1em 0.2em;
		border-radius: 0.2em;
	}
</style>
