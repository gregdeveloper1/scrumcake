<!--
	Table Page - Alt Protein Companies Directory
	============================================

	A Crunchbase-style company directory for alternative protein companies.
	Features:
	- Full-width layout (no right sidebar)
	- Advanced filters sheet
	- Company detail drawer
	- Sortable columns with funding data
-->

<script lang="ts">
	import { setActiveSection } from '$lib/stores/navigation.svelte';
	import {
		altProteinCompanies,
		getCategories,
		getFundingStages,
		type AltProteinCompany,
		type Category,
		type FundingStage
	} from '$lib/data/alt-protein-companies';
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import * as Table from '$lib/components/ui/table';
	import * as Avatar from '$lib/components/ui/avatar';
	import CompanyFilters from '$lib/components/table/CompanyFilters.svelte';
	import CompanyDrawer from '$lib/components/table/CompanyDrawer.svelte';
	import { cn } from '$lib/utils';

	// Set active section on mount
	setActiveSection('table');

	// Filter state
	let searchQuery = $state('');
	let selectedCategories = $state<Category[]>([]);
	let selectedFundingStages = $state<FundingStage[]>([]);
	let selectedTechnologies = $state<string[]>([]);
	let selectedCountries = $state<string[]>([]);

	// UI state
	let showFiltersSheet = $state(false);
	let showCompanyDrawer = $state(false);
	let selectedCompany = $state<AltProteinCompany | null>(null);

	// Sorting state
	let sortColumn = $state<keyof AltProteinCompany | null>('name');
	let sortDirection = $state<'asc' | 'desc'>('asc');

	// Pagination state
	let currentPage = $state(1);
	let pageSize = $state(15);
	const pageSizeOptions = [10, 15, 25, 50];

	// Quick filter categories for pills
	const quickCategories = getCategories();

	// Parse funding string to number for sorting (e.g., "$1.5B" -> 1500000000)
	function parseFunding(funding: string): number {
		const match = funding.match(/\$([\d.]+)([BMK])?/);
		if (!match) return 0;
		let value = parseFloat(match[1]);
		const multiplier = match[2];
		if (multiplier === 'B') value *= 1_000_000_000;
		else if (multiplier === 'M') value *= 1_000_000;
		else if (multiplier === 'K') value *= 1_000;
		return value;
	}

	// Filter and sort companies
	let filteredCompanies = $derived(() => {
		let result = [...altProteinCompanies];

		// Apply search filter
		if (searchQuery.trim()) {
			const search = searchQuery.toLowerCase();
			result = result.filter(
				(c) =>
					c.name.toLowerCase().includes(search) ||
					c.description.toLowerCase().includes(search) ||
					c.headquarters.toLowerCase().includes(search) ||
					c.technology.toLowerCase().includes(search)
			);
		}

		// Apply category filter
		if (selectedCategories.length > 0) {
			result = result.filter((c) => selectedCategories.includes(c.category));
		}

		// Apply funding stage filter
		if (selectedFundingStages.length > 0) {
			result = result.filter((c) => selectedFundingStages.includes(c.fundingStage));
		}

		// Apply technology filter
		if (selectedTechnologies.length > 0) {
			result = result.filter((c) => selectedTechnologies.includes(c.technology));
		}

		// Apply country filter
		if (selectedCountries.length > 0) {
			result = result.filter((c) => selectedCountries.includes(c.country));
		}

		// Apply sorting
		if (sortColumn) {
			result.sort((a, b) => {
				let aVal: string | number | null = a[sortColumn!];
				let bVal: string | number | null = b[sortColumn!];

				// Special handling for funding columns
				if (sortColumn === 'totalFunding' || sortColumn === 'lastRoundAmount') {
					aVal = parseFunding(aVal as string);
					bVal = parseFunding(bVal as string);
				}

				// Handle valuation (can be null)
				if (sortColumn === 'valuation') {
					aVal = aVal ? parseFunding(aVal as string) : 0;
					bVal = bVal ? parseFunding(bVal as string) : 0;
				}

				if (typeof aVal === 'string' && typeof bVal === 'string') {
					return sortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
				}
				if (typeof aVal === 'number' && typeof bVal === 'number') {
					return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
				}
				return 0;
			});
		}

		return result;
	});

	// Paginated results
	let paginatedCompanies = $derived(() => {
		const filtered = filteredCompanies();
		const start = (currentPage - 1) * pageSize;
		const end = start + pageSize;
		return filtered.slice(start, end);
	});

	// Total pages
	let totalPages = $derived(() => Math.ceil(filteredCompanies().length / pageSize));

	// Reset to page 1 when filters change
	$effect(() => {
		searchQuery;
		selectedCategories;
		selectedFundingStages;
		selectedTechnologies;
		selectedCountries;
		pageSize;
		currentPage = 1;
	});

	// Handle sort
	function handleSort(column: keyof AltProteinCompany) {
		if (sortColumn === column) {
			sortDirection = sortDirection === 'asc' ? 'desc' : 'asc';
		} else {
			sortColumn = column;
			sortDirection = 'asc';
		}
	}

	// Toggle quick category filter
	function toggleQuickCategory(cat: Category) {
		if (selectedCategories.includes(cat)) {
			selectedCategories = selectedCategories.filter((c) => c !== cat);
		} else {
			selectedCategories = [...selectedCategories, cat];
		}
	}

	// Clear all filters
	function clearFilters() {
		searchQuery = '';
		selectedCategories = [];
		selectedFundingStages = [];
		selectedTechnologies = [];
		selectedCountries = [];
	}

	// Handle filters applied from sheet
	function handleFiltersApply(filters: {
		categories: Category[];
		fundingStages: FundingStage[];
		technologies: string[];
		countries: string[];
	}) {
		selectedCategories = filters.categories;
		selectedFundingStages = filters.fundingStages;
		selectedTechnologies = filters.technologies;
		selectedCountries = filters.countries;
	}

	// Handle company row click
	function handleCompanyClick(company: AltProteinCompany) {
		selectedCompany = company;
		showCompanyDrawer = true;
	}

	// Count active filters
	let activeFilterCount = $derived(
		selectedCategories.length +
			selectedFundingStages.length +
			selectedTechnologies.length +
			selectedCountries.length +
			(searchQuery ? 1 : 0)
	);

	// Category badge colors
	function getCategoryColor(cat: Category): string {
		const colors: Record<Category, string> = {
			'Plant-Based': 'bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30',
			'Cultivated Meat': 'bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/30',
			Fermentation: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
			Hybrid: 'bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/30',
			Ingredients: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30'
		};
		return colors[cat] || 'bg-muted';
	}

	// Funding stage badge colors
	function getFundingStageColor(stage: FundingStage): string {
		const colors: Record<FundingStage, string> = {
			Seed: 'bg-gray-500/10 text-gray-700 dark:text-gray-400',
			'Series A': 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
			'Series B': 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400',
			'Series C': 'bg-purple-500/10 text-purple-700 dark:text-purple-400',
			'Series D+': 'bg-violet-500/10 text-violet-700 dark:text-violet-400',
			IPO: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
			Acquired: 'bg-orange-500/10 text-orange-700 dark:text-orange-400'
		};
		return colors[stage] || 'bg-muted';
	}

	// Sort icon component
	function getSortIcon(column: keyof AltProteinCompany) {
		if (sortColumn !== column) return '';
		return sortDirection === 'asc' ? '↑' : '↓';
	}
</script>

<svelte:head>
	<title>Alt Protein Companies Directory | DevCommunity</title>
	<meta
		name="description"
		content="Explore leading alternative protein companies: plant-based, cultivated meat, fermentation, and more. View funding data, investors, and company details."
	/>
</svelte:head>

<div class="h-full flex flex-col overflow-hidden">
	<!-- Header Section -->
	<div class="flex-shrink-0 px-4 lg:px-6 pt-4 lg:pt-6 pb-3">
		<div class="flex items-start justify-between gap-4 mb-4">
			<div>
				<h1 class="text-2xl font-bold">Alt Protein Companies</h1>
				<p class="text-sm text-muted-foreground mt-1">
					{filteredCompanies().length} companies across plant-based, cultivated meat, fermentation & more
				</p>
			</div>
			<div class="flex items-center gap-2">
				<!-- Export button (placeholder) -->
				<Button variant="outline" size="sm" class="hidden sm:flex">
					<svg
						class="h-4 w-4 mr-2"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
						<polyline points="7 10 12 15 17 10" />
						<line x1="12" x2="12" y1="15" y2="3" />
					</svg>
					Export
				</Button>
			</div>
		</div>

		<!-- Filter Bar -->
		<div class="bg-card rounded-lg border border-border px-3 py-2.5 shadow-sm">
			<div class="flex flex-wrap items-center gap-3">
				<!-- Search Input -->
				<div class="relative flex-1 min-w-[200px] max-w-sm">
					<Input
						type="text"
						placeholder="Search companies..."
						bind:value={searchQuery}
						class="h-9 pl-9 text-sm"
					/>
					<svg
						class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<circle cx="11" cy="11" r="8" />
						<path d="m21 21-4.3-4.3" />
					</svg>
					{#if searchQuery}
						<button
							class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
							onclick={() => (searchQuery = '')}
							aria-label="Clear search"
						>
							<svg
								class="h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round"
							>
								<path d="M18 6 6 18" />
								<path d="m6 6 12 12" />
							</svg>
						</button>
					{/if}
				</div>

				<!-- Divider -->
				<div class="h-6 w-px bg-border hidden sm:block"></div>

				<!-- Quick Category Filters -->
				<div class="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
					{#each quickCategories as cat}
						{@const isSelected = selectedCategories.includes(cat)}
						<button
							onclick={() => toggleQuickCategory(cat)}
							class={cn(
								'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all border',
								isSelected
									? getCategoryColor(cat) + ' border-current'
									: 'bg-muted/50 text-muted-foreground border-transparent hover:bg-muted'
							)}
						>
							{cat}
						</button>
					{/each}
				</div>

				<!-- Spacer -->
				<div class="flex-1 hidden lg:block"></div>

				<!-- All Filters Button -->
				<Button
					variant={activeFilterCount > 0 ? 'default' : 'outline'}
					size="sm"
					class="h-9"
					onclick={() => (showFiltersSheet = true)}
				>
					<svg
						class="h-4 w-4 mr-2"
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
					Filters
					{#if activeFilterCount > 0}
						<Badge variant="secondary" class="ml-2 h-5 min-w-5 px-1.5 text-xs">
							{activeFilterCount}
						</Badge>
					{/if}
				</Button>

				<!-- Clear Filters -->
				{#if activeFilterCount > 0}
					<Button variant="ghost" size="sm" class="h-9 text-muted-foreground" onclick={clearFilters}>
						Clear
					</Button>
				{/if}
			</div>
		</div>
	</div>

	<!-- Data Table Container -->
	<div class="flex-1 flex flex-col overflow-hidden px-4 lg:px-6 pb-4 lg:pb-6 min-h-0">
		<div class="bg-card rounded-lg border border-border shadow-sm flex-1 flex flex-col overflow-hidden">
			<!-- Scrollable Table -->
			<div class="flex-1 overflow-auto min-h-0">
				<Table.Root class="text-sm">
					<Table.Header class="sticky top-0 bg-muted/90 backdrop-blur-sm z-10">
						<Table.Row class="hover:bg-transparent">
							<Table.Head class="w-[280px]">
								<button
									class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors"
									onclick={() => handleSort('name')}
								>
									Company
									<span class="text-primary">{getSortIcon('name')}</span>
								</button>
							</Table.Head>
							<Table.Head class="w-[120px]">
								<button
									class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors"
									onclick={() => handleSort('category')}
								>
									Category
									<span class="text-primary">{getSortIcon('category')}</span>
								</button>
							</Table.Head>
							<Table.Head class="w-[140px] hidden lg:table-cell">
								<button
									class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors"
									onclick={() => handleSort('technology')}
								>
									Technology
									<span class="text-primary">{getSortIcon('technology')}</span>
								</button>
							</Table.Head>
							<Table.Head class="w-[100px]">
								<button
									class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors"
									onclick={() => handleSort('fundingStage')}
								>
									Stage
									<span class="text-primary">{getSortIcon('fundingStage')}</span>
								</button>
							</Table.Head>
							<Table.Head class="w-[100px]">
								<button
									class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors"
									onclick={() => handleSort('totalFunding')}
								>
									Funding
									<span class="text-primary">{getSortIcon('totalFunding')}</span>
								</button>
							</Table.Head>
							<Table.Head class="w-[100px] hidden md:table-cell">
								<button
									class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors"
									onclick={() => handleSort('valuation')}
								>
									Valuation
									<span class="text-primary">{getSortIcon('valuation')}</span>
								</button>
							</Table.Head>
							<Table.Head class="w-[130px] hidden xl:table-cell">
								<button
									class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors"
									onclick={() => handleSort('headquarters')}
								>
									Headquarters
									<span class="text-primary">{getSortIcon('headquarters')}</span>
								</button>
							</Table.Head>
							<Table.Head class="w-[80px] hidden sm:table-cell">
								<button
									class="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider hover:text-foreground transition-colors"
									onclick={() => handleSort('foundedYear')}
								>
									Founded
									<span class="text-primary">{getSortIcon('foundedYear')}</span>
								</button>
							</Table.Head>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each paginatedCompanies() as company (company.id)}
							<Table.Row
								class="cursor-pointer hover:bg-muted/50 transition-colors"
								onclick={() => handleCompanyClick(company)}
							>
								<Table.Cell class="py-3">
									<div class="flex items-center gap-3">
										<Avatar.Root class="h-10 w-10 rounded-lg border border-border flex-shrink-0">
											<Avatar.Image src={company.logo} alt={company.name} />
											<Avatar.Fallback class="rounded-lg text-sm">{company.name[0]}</Avatar.Fallback>
										</Avatar.Root>
										<div class="min-w-0">
											<div class="font-medium truncate">{company.name}</div>
											<div class="text-xs text-muted-foreground line-clamp-1">{company.description}</div>
										</div>
									</div>
								</Table.Cell>
								<Table.Cell class="py-3">
									<Badge variant="outline" class={cn('text-xs whitespace-nowrap', getCategoryColor(company.category))}>
										{company.category}
									</Badge>
								</Table.Cell>
								<Table.Cell class="py-3 hidden lg:table-cell">
									<span class="text-sm text-muted-foreground truncate block">{company.technology}</span>
								</Table.Cell>
								<Table.Cell class="py-3">
									<Badge variant="secondary" class={cn('text-xs', getFundingStageColor(company.fundingStage))}>
										{company.fundingStage}
									</Badge>
								</Table.Cell>
								<Table.Cell class="py-3 font-medium tabular-nums">{company.totalFunding}</Table.Cell>
								<Table.Cell class="py-3 hidden md:table-cell tabular-nums text-muted-foreground">
									{company.valuation || '—'}
								</Table.Cell>
								<Table.Cell class="py-3 hidden xl:table-cell">
									<span class="text-sm text-muted-foreground truncate block">{company.headquarters}</span>
								</Table.Cell>
								<Table.Cell class="py-3 hidden sm:table-cell tabular-nums text-muted-foreground">
									{company.foundedYear}
								</Table.Cell>
							</Table.Row>
						{:else}
							<Table.Row>
								<Table.Cell colspan={8} class="h-40 text-center">
									<div class="flex flex-col items-center gap-3 text-muted-foreground">
										<svg
											class="h-12 w-12 opacity-40"
											xmlns="http://www.w3.org/2000/svg"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											stroke-width="1.5"
										>
											<circle cx="11" cy="11" r="8" />
											<path d="m21 21-4.3-4.3" />
										</svg>
										<div>
											<p class="font-medium">No companies found</p>
											<p class="text-sm">Try adjusting your filters</p>
										</div>
										<Button variant="outline" size="sm" onclick={clearFilters}>Clear all filters</Button>
									</div>
								</Table.Cell>
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</div>

			<!-- Pagination Footer -->
			{#if filteredCompanies().length > 0}
				<div class="flex-shrink-0 flex items-center justify-between gap-4 px-4 py-3 border-t border-border bg-muted/30 text-sm">
					<div class="flex items-center gap-2 text-muted-foreground">
						<span class="hidden sm:inline">Show</span>
						<select
							bind:value={pageSize}
							class="h-8 px-2 rounded-md border border-input bg-background text-sm"
						>
							{#each pageSizeOptions as size}
								<option value={size}>{size}</option>
							{/each}
						</select>
						<span class="hidden sm:inline">per page</span>
					</div>

					<div class="flex items-center gap-1">
						<Button
							variant="outline"
							size="sm"
							onclick={() => (currentPage = 1)}
							disabled={currentPage === 1}
							class="h-8 w-8 p-0"
							aria-label="First page"
						>
							<svg
								class="h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="m11 17-5-5 5-5" />
								<path d="m18 17-5-5 5-5" />
							</svg>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onclick={() => (currentPage = Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
							class="h-8 w-8 p-0"
							aria-label="Previous page"
						>
							<svg
								class="h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="m15 18-6-6 6-6" />
							</svg>
						</Button>

						<div class="flex items-center gap-1 px-2">
							{#each Array.from({ length: Math.min(5, totalPages()) }, (_, i) => {
								const total = totalPages();
								if (total <= 5) return i + 1;
								if (currentPage <= 3) return i + 1;
								if (currentPage >= total - 2) return total - 4 + i;
								return currentPage - 2 + i;
							}) as page}
								<Button
									variant={currentPage === page ? 'default' : 'ghost'}
									size="sm"
									onclick={() => (currentPage = page)}
									class="h-8 w-8 p-0 text-sm"
								>
									{page}
								</Button>
							{/each}
						</div>

						<Button
							variant="outline"
							size="sm"
							onclick={() => (currentPage = Math.min(totalPages(), currentPage + 1))}
							disabled={currentPage === totalPages()}
							class="h-8 w-8 p-0"
							aria-label="Next page"
						>
							<svg
								class="h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="m9 18 6-6-6-6" />
							</svg>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onclick={() => (currentPage = totalPages())}
							disabled={currentPage === totalPages()}
							class="h-8 w-8 p-0"
							aria-label="Last page"
						>
							<svg
								class="h-4 w-4"
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
							>
								<path d="m13 17 5-5-5-5" />
								<path d="m6 17 5-5-5-5" />
							</svg>
						</Button>
					</div>

					<span class="text-sm text-muted-foreground whitespace-nowrap">
						{(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredCompanies().length)} of {filteredCompanies().length}
					</span>
				</div>
			{/if}
		</div>
	</div>
</div>

<!-- Filters Sheet -->
<CompanyFilters
	bind:open={showFiltersSheet}
	{selectedCategories}
	{selectedFundingStages}
	{selectedTechnologies}
	{selectedCountries}
	onApply={handleFiltersApply}
	onClear={clearFilters}
/>

<!-- Company Detail Drawer -->
<CompanyDrawer bind:open={showCompanyDrawer} company={selectedCompany} />
