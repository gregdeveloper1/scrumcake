<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { getTheme, setTheme, themes, type Theme } from '$lib/stores/theme.svelte';
	import { cn } from '$lib/utils';

	let currentTheme = $derived(getTheme());
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="h-9 w-9 rounded-full" aria-label="Switch theme">
				<!-- Sun/Contrast icon for theme switching -->
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
				>
					<circle cx="12" cy="12" r="4" />
					<path d="M12 2v2" />
					<path d="M12 20v2" />
					<path d="m4.93 4.93 1.41 1.41" />
					<path d="m17.66 17.66 1.41 1.41" />
					<path d="M2 12h2" />
					<path d="M20 12h2" />
					<path d="m6.34 17.66-1.41 1.41" />
					<path d="m19.07 4.93-1.41 1.41" />
				</svg>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content align="end" class="w-40">
		<DropdownMenu.Label>Theme</DropdownMenu.Label>
		<DropdownMenu.Separator />
		{#each Object.entries(themes) as [key, theme]}
			<DropdownMenu.Item
				class={cn('cursor-pointer', currentTheme === key && 'bg-accent')}
				onclick={() => setTheme(key as Theme)}
			>
				<div class="flex items-center gap-2">
					<div
						class="h-4 w-4 rounded-full border border-border/50"
						style="background: {theme.color};"
					></div>
					<span>{theme.name}</span>
				</div>
				{#if currentTheme === key}
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
						class="ml-auto"
					>
						<path d="M20 6 9 17l-5-5" />
					</svg>
				{/if}
			</DropdownMenu.Item>
		{/each}
	</DropdownMenu.Content>
</DropdownMenu.Root>
