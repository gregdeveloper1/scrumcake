<script lang="ts">
	import { getTheme, setTheme, themes, type Theme } from '$lib/stores/theme.svelte';
	import { Button } from '$lib/components/ui/button';
	import { cn } from '$lib/utils';

	let currentTheme = $derived(getTheme());

	function handleThemeSelect(theme: Theme) {
		setTheme(theme);
	}

	function resetToDefault() {
		setTheme('cursor');
	}
</script>

<svelte:head>
	<title>Settings - DevCommunity</title>
	<meta name="description" content="Customize your DevCommunity experience" />
</svelte:head>

<div class="max-w-3xl mx-auto px-6 py-8">
	<h1 class="text-3xl font-bold mb-2">Settings</h1>
	<p class="text-muted-foreground mb-8">Customize your experience</p>

	<!-- Theme Section -->
	<section class="mb-12">
		<div class="flex items-center justify-between mb-4">
			<div>
				<h2 class="text-xl font-semibold">Theme</h2>
				<p class="text-sm text-muted-foreground">Choose your preferred color theme. Your selection is saved automatically.</p>
			</div>
			<Button variant="ghost" size="sm" onclick={resetToDefault} class="text-muted-foreground hover:text-foreground">
				Reset to default
			</Button>
		</div>

		<div class="grid grid-cols-2 md:grid-cols-3 gap-4">
			{#each Object.entries(themes) as [id, theme]}
				{@const themeId = id as Theme}
				<button
					onclick={() => handleThemeSelect(themeId)}
					class={cn(
						'relative p-4 rounded-xl border-2 transition-all duration-200 text-left',
						'hover:shadow-lg hover:scale-[1.02]',
						currentTheme === themeId
							? 'border-primary bg-primary/5 shadow-md'
							: 'border-border hover:border-muted-foreground/50'
					)}
				>
					<!-- Color Preview -->
					<div
						class="w-full h-16 rounded-lg mb-3 shadow-sm"
						style="background: {theme.color};"
					></div>

					<!-- Theme Info -->
					<div class="flex items-start justify-between">
						<div>
							<p class="font-semibold">{theme.name}</p>
							<p class="text-xs text-muted-foreground">{theme.description}</p>
						</div>

						<!-- Selected Indicator -->
						{#if currentTheme === themeId}
							<div class="flex-shrink-0 w-5 h-5 rounded-full bg-primary flex items-center justify-center">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									width="12"
									height="12"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="3"
									stroke-linecap="round"
									stroke-linejoin="round"
									class="text-primary-foreground"
								>
									<polyline points="20 6 9 17 4 12" />
								</svg>
							</div>
						{/if}
					</div>
				</button>
			{/each}
		</div>

		<p class="text-xs text-muted-foreground mt-4">
			Your theme preference is automatically saved and will be restored when you return.
		</p>
	</section>

	<!-- Additional Settings Placeholder -->
	<section class="border-t border-border pt-8">
		<h2 class="text-xl font-semibold mb-4">Display</h2>
		<div class="space-y-4">
			<div class="flex items-center justify-between p-4 rounded-lg bg-muted/50">
				<div>
					<p class="font-medium">Reduce motion</p>
					<p class="text-sm text-muted-foreground">Minimize animations throughout the site</p>
				</div>
				<div class="w-10 h-6 bg-muted rounded-full relative cursor-not-allowed opacity-50">
					<div class="absolute left-1 top-1 w-4 h-4 bg-background rounded-full shadow"></div>
				</div>
			</div>
			<div class="flex items-center justify-between p-4 rounded-lg bg-muted/50">
				<div>
					<p class="font-medium">Compact view</p>
					<p class="text-sm text-muted-foreground">Show more content with less spacing</p>
				</div>
				<div class="w-10 h-6 bg-muted rounded-full relative cursor-not-allowed opacity-50">
					<div class="absolute left-1 top-1 w-4 h-4 bg-background rounded-full shadow"></div>
				</div>
			</div>
		</div>
		<p class="text-xs text-muted-foreground mt-4">More display options coming soon.</p>
	</section>
</div>
