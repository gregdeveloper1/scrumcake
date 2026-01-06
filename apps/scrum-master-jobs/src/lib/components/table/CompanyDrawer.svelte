<!--
	CompanyDrawer.svelte - Company Detail Drawer
	=============================================

	A slide-out sheet panel showing detailed company information.
	Displays: logo, overview, funding timeline, investors, partners, team info.
-->

<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { Button } from '$lib/components/ui/button';
	import { Badge } from '$lib/components/ui/badge';
	import { Separator } from '$lib/components/ui/separator';
	import * as ScrollArea from '$lib/components/ui/scroll-area';
	import * as Avatar from '$lib/components/ui/avatar';
	import type { AltProteinCompany, Category, FundingStage, Status } from '$lib/data/alt-protein-companies';
	import { cn } from '$lib/utils';

	// Props
	interface Props {
		company: AltProteinCompany | null;
		open?: boolean;
	}

	let { company, open = $bindable(false) }: Props = $props();

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

	// Status badge colors
	function getStatusColor(status: Status): string {
		const colors: Record<Status, string> = {
			Active: 'bg-green-500/10 text-green-700 dark:text-green-400',
			IPO: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
			Acquired: 'bg-blue-500/10 text-blue-700 dark:text-blue-400',
			Shutdown: 'bg-red-500/10 text-red-700 dark:text-red-400'
		};
		return colors[status] || 'bg-muted';
	}

	// Format date
	function formatDate(dateStr: string): string {
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Content side="right" class="w-full sm:max-w-lg">
		{#if company}
			<Sheet.Header class="pb-4">
				<!-- Company Logo & Name -->
				<div class="flex items-start gap-4">
					<Avatar.Root class="h-16 w-16 rounded-xl border border-border">
						<Avatar.Image src={company.logo} alt={company.name} />
						<Avatar.Fallback class="rounded-xl text-lg">{company.name[0]}</Avatar.Fallback>
					</Avatar.Root>
					<div class="flex-1 min-w-0">
						<Sheet.Title class="text-xl truncate">{company.name}</Sheet.Title>
						<div class="flex flex-wrap items-center gap-2 mt-1">
							<Badge variant="outline" class={cn('text-xs', getCategoryColor(company.category))}>
								{company.category}
							</Badge>
							<Badge variant="outline" class={cn('text-xs', getStatusColor(company.status))}>
								{company.status}
							</Badge>
						</div>
					</div>
				</div>
			</Sheet.Header>

			<ScrollArea.Root class="flex-1 -mx-6 px-6">
				<div class="space-y-6 py-4">
					<!-- Description -->
					<div>
						<p class="text-sm text-muted-foreground leading-relaxed">
							{company.description}
						</p>
					</div>

					<Separator />

					<!-- Key Metrics Grid -->
					<div class="grid grid-cols-2 gap-4">
						<div class="rounded-lg border border-border p-3">
							<div class="text-xs text-muted-foreground mb-1">Total Funding</div>
							<div class="text-lg font-semibold">{company.totalFunding}</div>
						</div>
						<div class="rounded-lg border border-border p-3">
							<div class="text-xs text-muted-foreground mb-1">Valuation</div>
							<div class="text-lg font-semibold">{company.valuation || 'Undisclosed'}</div>
						</div>
						<div class="rounded-lg border border-border p-3">
							<div class="text-xs text-muted-foreground mb-1">Funding Stage</div>
							<Badge variant="secondary" class={cn('text-xs mt-1', getFundingStageColor(company.fundingStage))}>
								{company.fundingStage}
							</Badge>
						</div>
						<div class="rounded-lg border border-border p-3">
							<div class="text-xs text-muted-foreground mb-1">Last Round</div>
							<div class="text-sm font-medium">{company.lastRoundAmount}</div>
							<div class="text-xs text-muted-foreground">{formatDate(company.lastRoundDate)}</div>
						</div>
					</div>

					<Separator />

					<!-- Company Info -->
					<div>
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
								<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
								<path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2" />
								<path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2" />
								<path d="M10 6h4" />
								<path d="M10 10h4" />
								<path d="M10 14h4" />
								<path d="M10 18h4" />
							</svg>
							Company Info
						</h3>
						<div class="space-y-2.5">
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Founded</span>
								<span class="font-medium">{company.foundedYear}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Headquarters</span>
								<span class="font-medium">{company.headquarters}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Country</span>
								<span class="font-medium">{company.country}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Employees</span>
								<span class="font-medium">{company.employees}</span>
							</div>
							<div class="flex items-center justify-between text-sm">
								<span class="text-muted-foreground">Technology</span>
								<span class="font-medium">{company.technology}</span>
							</div>
						</div>
					</div>

					<Separator />

					<!-- Product Focus -->
					<div>
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
							Product Focus
						</h3>
						<div class="flex flex-wrap gap-2">
							{#each company.productFocus as product}
								<Badge variant="secondary" class="text-xs">
									{product}
								</Badge>
							{/each}
						</div>
					</div>

					<Separator />

					<!-- Investors -->
					<div>
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
								<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
								<circle cx="9" cy="7" r="4" />
								<path d="M22 21v-2a4 4 0 0 0-3-3.87" />
								<path d="M16 3.13a4 4 0 0 1 0 7.75" />
							</svg>
							Key Investors ({company.investors.length})
						</h3>
						<div class="flex flex-wrap gap-2">
							{#each company.investors as investor}
								<div class="px-3 py-1.5 text-sm rounded-lg bg-muted/50 text-muted-foreground">
									{investor}
								</div>
							{/each}
						</div>
					</div>

					<!-- Key Partners (if available) -->
					{#if company.keyPartners && company.keyPartners.length > 0}
						<Separator />
						<div>
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
									<path d="m11 17 2 2a1 1 0 1 0 3-3" />
									<path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-.88.88a1 1 0 1 1-3-3l2.81-2.81a5.79 5.79 0 0 1 7.06-.87l.47.28a2 2 0 0 0 1.42.25L21 4" />
									<path d="m21 3 1 11h-2" />
									<path d="M3 3 2 14l6.5 6.5a1 1 0 1 0 3-3" />
									<path d="M3 4h8" />
								</svg>
								Key Partners
							</h3>
							<div class="flex flex-wrap gap-2">
								{#each company.keyPartners as partner}
									<Badge variant="outline" class="text-xs">
										{partner}
									</Badge>
								{/each}
							</div>
						</div>
					{/if}

					<!-- Certifications (if available) -->
					{#if company.certifications && company.certifications.length > 0}
						<Separator />
						<div>
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
									<circle cx="12" cy="8" r="6" />
									<path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
								</svg>
								Certifications
							</h3>
							<div class="flex flex-wrap gap-2">
								{#each company.certifications as cert}
									<Badge variant="secondary" class="text-xs bg-emerald-500/10 text-emerald-700 dark:text-emerald-400">
										{cert}
									</Badge>
								{/each}
							</div>
						</div>
					{/if}
				</div>
			</ScrollArea.Root>

			<Sheet.Footer class="flex-row gap-2 border-t border-border pt-4 -mx-6 px-6">
				<Button variant="outline" class="flex-1" onclick={() => (open = false)}>
					Close
				</Button>
				<Button class="flex-1" onclick={() => window.open(company.website, '_blank')}>
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
						<path d="M15 3h6v6" />
						<path d="M10 14 21 3" />
						<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
					</svg>
					Visit Website
				</Button>
			</Sheet.Footer>
		{/if}
	</Sheet.Content>
</Sheet.Root>
