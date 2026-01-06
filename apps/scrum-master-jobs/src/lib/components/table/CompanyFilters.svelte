<!--
	CompanyFilters.svelte - Advanced Filters Modal
	===============================================

	A modal dialog with blur background and smooth transitions for filtering companies.
	Filters: Category, Funding Stage, Technology, Country
-->

<script lang="ts">
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import * as ScrollArea from '$lib/components/ui/scroll-area';
	import {
		getCategories,
		getFundingStages,
		getTechnologies,
		getCountries,
		type Category,
		type FundingStage
	} from '$lib/data/alt-protein-companies';

	// Props
	interface Props {
		open?: boolean;
		selectedCategories?: Category[];
		selectedFundingStages?: FundingStage[];
		selectedTechnologies?: string[];
		selectedCountries?: string[];
		onApply?: (filters: {
			categories: Category[];
			fundingStages: FundingStage[];
			technologies: string[];
			countries: string[];
		}) => void;
		onClear?: () => void;
	}

	let {
		open = $bindable(false),
		selectedCategories = [],
		selectedFundingStages = [],
		selectedTechnologies = [],
		selectedCountries = [],
		onApply,
		onClear
	}: Props = $props();

	// Local filter state (synced from props when modal opens)
	let localCategories = $state<Category[]>([]);
	let localFundingStages = $state<FundingStage[]>([]);
	let localTechnologies = $state<string[]>([]);
	let localCountries = $state<string[]>([]);

	// Get available options
	const categories = getCategories();
	const fundingStages = getFundingStages();
	const technologies = getTechnologies();
	const countries = getCountries();

	// Sync local state when modal opens
	$effect(() => {
		if (open) {
			localCategories = [...selectedCategories];
			localFundingStages = [...selectedFundingStages];
			localTechnologies = [...selectedTechnologies];
			localCountries = [...selectedCountries];
		}
	});

	// Toggle functions
	function toggleCategory(cat: Category) {
		if (localCategories.includes(cat)) {
			localCategories = localCategories.filter((c) => c !== cat);
		} else {
			localCategories = [...localCategories, cat];
		}
	}

	function toggleFundingStage(stage: FundingStage) {
		if (localFundingStages.includes(stage)) {
			localFundingStages = localFundingStages.filter((s) => s !== stage);
		} else {
			localFundingStages = [...localFundingStages, stage];
		}
	}

	function toggleTechnology(tech: string) {
		if (localTechnologies.includes(tech)) {
			localTechnologies = localTechnologies.filter((t) => t !== tech);
		} else {
			localTechnologies = [...localTechnologies, tech];
		}
	}

	function toggleCountry(country: string) {
		if (localCountries.includes(country)) {
			localCountries = localCountries.filter((c) => c !== country);
		} else {
			localCountries = [...localCountries, country];
		}
	}

	// Count active filters
	let activeFilterCount = $derived(
		localCategories.length +
			localFundingStages.length +
			localTechnologies.length +
			localCountries.length
	);

	// Apply filters
	function handleApply() {
		onApply?.({
			categories: localCategories,
			fundingStages: localFundingStages,
			technologies: localTechnologies,
			countries: localCountries
		});
		open = false;
	}

	// Clear all filters
	function handleClear() {
		localCategories = [];
		localFundingStages = [];
		localTechnologies = [];
		localCountries = [];
		onClear?.();
	}

	// Category colors
	function getCategoryColor(cat: Category): string {
		const colors: Record<Category, string> = {
			'Plant-Based': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
			'Cultivated Meat': 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30',
			Fermentation: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
			Hybrid: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
			Ingredients: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30'
		};
		return colors[cat] || 'bg-muted text-muted-foreground';
	}

	// Funding stage colors
	function getFundingStageColor(stage: FundingStage): string {
		const colors: Record<FundingStage, string> = {
			Seed: 'bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/30',
			'Series A': 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
			'Series B': 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
			'Series C': 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
			'Series D+': 'bg-violet-500/10 text-violet-700 dark:text-violet-400 border-violet-500/30',
			IPO: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
			Acquired: 'bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/30'
		};
		return colors[stage] || 'bg-muted text-muted-foreground';
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-xl max-h-[85vh] flex flex-col p-0 gap-0 overflow-hidden">
		<!-- Header -->
		<Dialog.Header class="px-6 pt-6 pb-4 border-b border-border">
			<Dialog.Title class="flex items-center gap-2 text-lg">
				<svg
					class="h-5 w-5 text-primary"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 24 24"
					fill="none"
					stroke="currentColor"
					stroke-width="2"
					stroke-linecap="round"
					stroke-linejoin="round"
				>
					<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
				</svg>
				Filter Companies
				{#if activeFilterCount > 0}
					<Badge variant="secondary" class="ml-1 text-xs">{activeFilterCount} active</Badge>
				{/if}
			</Dialog.Title>
			<Dialog.Description class="text-sm text-muted-foreground">
				Select filters to narrow down the company list
			</Dialog.Description>
		</Dialog.Header>

		<!-- Scrollable Content -->
		<ScrollArea.Root class="flex-1 min-h-0">
			<div class="px-6 py-5 space-y-6">
				<!-- Category Filter -->
				<div class="filter-section">
					<h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
						<svg
							class="h-4 w-4 text-muted-foreground"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
							<path d="M7 7h.01" />
						</svg>
						Category
						{#if localCategories.length > 0}
							<span class="text-xs text-primary">({localCategories.length})</span>
						{/if}
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each categories as cat}
							{@const isSelected = localCategories.includes(cat)}
							<button
								type="button"
								onclick={() => toggleCategory(cat)}
								class="filter-pill {isSelected
									? getCategoryColor(cat) + ' border-2 scale-[1.02]'
									: 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:scale-[1.02]'}"
							>
								{#if isSelected}
									<svg class="h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
										<path d="M20 6 9 17l-5-5" />
									</svg>
								{/if}
								{cat}
							</button>
						{/each}
					</div>
				</div>

				<Separator />

				<!-- Funding Stage Filter -->
				<div class="filter-section">
					<h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
						<svg
							class="h-4 w-4 text-muted-foreground"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<line x1="12" x2="12" y1="2" y2="22" />
							<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
						</svg>
						Funding Stage
						{#if localFundingStages.length > 0}
							<span class="text-xs text-primary">({localFundingStages.length})</span>
						{/if}
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each fundingStages as stage}
							{@const isSelected = localFundingStages.includes(stage)}
							<button
								type="button"
								onclick={() => toggleFundingStage(stage)}
								class="filter-pill {isSelected
									? getFundingStageColor(stage) + ' border-2 scale-[1.02]'
									: 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:scale-[1.02]'}"
							>
								{#if isSelected}
									<svg class="h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
										<path d="M20 6 9 17l-5-5" />
									</svg>
								{/if}
								{stage}
							</button>
						{/each}
					</div>
				</div>

				<Separator />

				<!-- Technology Filter -->
				<div class="filter-section">
					<h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
						<svg
							class="h-4 w-4 text-muted-foreground"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<path d="M12 2v8" />
							<path d="m4.93 10.93 1.41 1.41" />
							<path d="M2 18h2" />
							<path d="M20 18h2" />
							<path d="m19.07 10.93-1.41 1.41" />
							<path d="M22 22H2" />
							<path d="m8 22 4-10 4 10" />
						</svg>
						Technology
						{#if localTechnologies.length > 0}
							<span class="text-xs text-primary">({localTechnologies.length})</span>
						{/if}
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each technologies as tech}
							{@const isSelected = localTechnologies.includes(tech)}
							<button
								type="button"
								onclick={() => toggleTechnology(tech)}
								class="filter-pill {isSelected
									? 'bg-primary/10 text-primary border-primary/30 border-2 scale-[1.02]'
									: 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:scale-[1.02]'}"
							>
								{#if isSelected}
									<svg class="h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
										<path d="M20 6 9 17l-5-5" />
									</svg>
								{/if}
								{tech}
							</button>
						{/each}
					</div>
				</div>

				<Separator />

				<!-- Country Filter -->
				<div class="filter-section">
					<h3 class="text-sm font-semibold mb-3 flex items-center gap-2">
						<svg
							class="h-4 w-4 text-muted-foreground"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							stroke-width="2"
							stroke-linecap="round"
							stroke-linejoin="round"
						>
							<circle cx="12" cy="12" r="10" />
							<path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
							<path d="M2 12h20" />
						</svg>
						Country
						{#if localCountries.length > 0}
							<span class="text-xs text-primary">({localCountries.length})</span>
						{/if}
					</h3>
					<div class="flex flex-wrap gap-2">
						{#each countries as country}
							{@const isSelected = localCountries.includes(country)}
							<button
								type="button"
								onclick={() => toggleCountry(country)}
								class="filter-pill {isSelected
									? 'bg-primary/10 text-primary border-primary/30 border-2 scale-[1.02]'
									: 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted hover:scale-[1.02]'}"
							>
								{#if isSelected}
									<svg class="h-3.5 w-3.5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
										<path d="M20 6 9 17l-5-5" />
									</svg>
								{/if}
								{country}
							</button>
						{/each}
					</div>
				</div>
			</div>
		</ScrollArea.Root>

		<!-- Footer -->
		<Dialog.Footer class="flex-row gap-3 border-t border-border px-6 py-4 bg-muted/30">
			<Button
				variant="ghost"
				class="text-muted-foreground hover:text-foreground"
				onclick={handleClear}
				disabled={activeFilterCount === 0}
			>
				<svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
					<path d="M3 6h18" />
					<path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
					<path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
				</svg>
				Clear All
			</Button>
			<div class="flex-1"></div>
			<Dialog.Close>
				{#snippet child({ props })}
					<Button variant="outline" {...props}>Cancel</Button>
				{/snippet}
			</Dialog.Close>
			<Button onclick={handleApply} class="min-w-[120px]">
				Apply Filters
				{#if activeFilterCount > 0}
					<Badge variant="secondary" class="ml-2 bg-primary-foreground/20 text-primary-foreground text-xs">
						{activeFilterCount}
					</Badge>
				{/if}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>

<style>
	.filter-pill {
		display: inline-flex;
		align-items: center;
		padding: 0.5rem 0.875rem;
		font-size: 0.8125rem;
		font-weight: 500;
		border-radius: 9999px;
		border: 1px solid;
		transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1);
		cursor: pointer;
	}

	.filter-pill:active {
		transform: scale(0.98);
	}

	.filter-section {
		animation: fadeSlideIn 0.3s ease-out backwards;
	}

	.filter-section:nth-child(1) { animation-delay: 0ms; }
	.filter-section:nth-child(3) { animation-delay: 50ms; }
	.filter-section:nth-child(5) { animation-delay: 100ms; }
	.filter-section:nth-child(7) { animation-delay: 150ms; }

	@keyframes fadeSlideIn {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
