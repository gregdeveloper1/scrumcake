<!--
	JobFilters.svelte - Inline Filter Bar
	======================================

	A horizontal filter bar with search input and dropdown filters.
	LinkedIn-style inline filters (not in a modal/sheet).

	Filters:
	- Search input
	- Location dropdown
	- Experience Level dropdown
	- Job Type dropdown (employment type)
	- Work Type dropdown (Remote/Hybrid/On-site)
-->

<script lang="ts">
	/**
	 * JobFilters Component Script
	 * ===========================
	 * Inline horizontal filter bar for job listings.
	 * LinkedIn-style filters using Popover dropdowns.
	 * Uses Svelte 5 runes for reactive state management.
	 */

	// ============================================
	// IMPORTS
	// ============================================
	import {
		getLocations,
		getLocationTypes,
		getEmploymentTypes,
		getExperienceLevels
	} from '$lib/data/jobs';
	import type { LocationType, EmploymentType, ExperienceLevel } from '$lib/data/jobs';
	import { cn } from '$lib/utils';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Badge } from '$lib/components/ui/badge';
	import * as Popover from '$lib/components/ui/popover';

	// ============================================
	// COMPONENT PROPS
	// ============================================
	interface Props {
		/** Current search query string */
		searchQuery?: string;
		/** Selected geographic location filter */
		selectedLocation?: string;
		/** Selected work arrangement (Remote/Hybrid/On-site) */
		selectedLocationType?: LocationType | null;
		/** Selected employment type (Full-time/Part-time/Contract/Internship) */
		selectedEmploymentType?: EmploymentType | null;
		/** Selected experience level (Entry/Mid/Senior/Lead/Executive) */
		selectedExperienceLevel?: ExperienceLevel | null;
		/** Callback when search query changes */
		onSearchChange?: (value: string) => void;
		/** Callback when location filter changes */
		onLocationChange?: (value: string) => void;
		/** Callback when work type filter changes */
		onLocationTypeChange?: (value: LocationType | null) => void;
		/** Callback when employment type filter changes */
		onEmploymentTypeChange?: (value: EmploymentType | null) => void;
		/** Callback when experience level filter changes */
		onExperienceLevelChange?: (value: ExperienceLevel | null) => void;
		/** Callback to clear all filters */
		onClearFilters?: () => void;
		/** Additional CSS classes */
		class?: string;
	}

	let {
		searchQuery = '',
		selectedLocation = '',
		selectedLocationType = null,
		selectedEmploymentType = null,
		selectedExperienceLevel = null,
		onSearchChange,
		onLocationChange,
		onLocationTypeChange,
		onEmploymentTypeChange,
		onExperienceLevelChange,
		onClearFilters,
		class: className
	}: Props = $props();

	// ============================================
	// FILTER OPTIONS
	// ============================================
	// Load available options from job data helpers
	const locations = getLocations();
	const locationTypes = getLocationTypes();
	const employmentTypes = getEmploymentTypes();
	const experienceLevels = getExperienceLevels();

	// ============================================
	// POPOVER STATES
	// ============================================
	// Each dropdown needs its own open state for independent control

	/** Whether the location dropdown is open */
	let locationOpen = $state(false);
	/** Whether the experience level dropdown is open */
	let experienceOpen = $state(false);
	/** Whether the job type dropdown is open */
	let typeOpen = $state(false);
	/** Whether the work type dropdown is open */
	let workTypeOpen = $state(false);

	// ============================================
	// DERIVED STATE
	// ============================================

	/**
	 * Whether any filter is currently active.
	 * Used to show/hide the "Clear" button.
	 */
	let hasActiveFilters = $derived(
		searchQuery !== '' ||
		selectedLocation !== '' ||
		selectedLocationType !== null ||
		selectedEmploymentType !== null ||
		selectedExperienceLevel !== null
	);

</script>

<!-- ============================================
     FILTER BAR CONTAINER
     ============================================
     Horizontal flex container with all filter controls.
     Border at bottom separates from job list below.
-->
<div class={cn('flex items-center gap-3 p-4 border-b border-border bg-card', className)}>

	<!-- ========================================
	     SEARCH INPUT
	     ========================================
	     Text search with magnifying glass icon prefix.
	     Filters jobs by title and company name.
	-->
	<div class="relative flex-1 max-w-xs">
		<!-- Search icon (positioned absolutely) -->
		<svg class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
			<circle cx="11" cy="11" r="8"/>
			<path d="m21 21-4.3-4.3"/>
		</svg>
		<Input
			type="text"
			placeholder="Search jobs..."
			value={searchQuery}
			oninput={(e) => onSearchChange?.(e.currentTarget.value)}
			class="pl-9 h-9"
		/>
	</div>

	<!-- ========================================
	     LOCATION FILTER DROPDOWN
	     ========================================
	     Geographic location selector.
	     Options: All Locations, or specific cities.
	     Highlights in primary color when active.
	-->
	<Popover.Root bind:open={locationOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					size="sm"
					class={cn(
						'h-9 gap-1.5',
						selectedLocation && 'border-primary text-primary'
					)}
				>
					<!-- MapPin icon -->
					<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
						<circle cx="12" cy="10" r="3"/>
					</svg>
					{selectedLocation || 'Location'}
					<!-- ChevronDown icon -->
					<svg class="h-3 w-3 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m6 9 6 6 6-6"/>
					</svg>
				</Button>
			{/snippet}
		</Popover.Trigger>
		<!-- Dropdown content with scrollable list -->
		<Popover.Content class="w-56 p-0" align="start">
			<div class="max-h-64 overflow-y-auto">
				<!-- "All Locations" option to clear filter -->
				<button
					type="button"
					class={cn(
						'w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors',
						!selectedLocation && 'bg-muted font-medium'
					)}
					onclick={() => {
						onLocationChange?.('');
						locationOpen = false;
					}}
				>
					All Locations
				</button>
				<!-- Individual location options -->
				{#each locations as location}
					<button
						type="button"
						class={cn(
							'w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors',
							selectedLocation === location && 'bg-muted font-medium'
						)}
						onclick={() => {
							onLocationChange?.(location);
							locationOpen = false;
						}}
					>
						{location}
					</button>
				{/each}
			</div>
		</Popover.Content>
	</Popover.Root>

	<!-- ========================================
	     EXPERIENCE LEVEL FILTER DROPDOWN
	     ========================================
	     Filters by seniority level.
	     Options: All Levels, Entry, Mid, Senior, Lead, Executive
	-->
	<Popover.Root bind:open={experienceOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					size="sm"
					class={cn(
						'h-9 gap-1.5',
						selectedExperienceLevel && 'border-primary text-primary'
					)}
				>
					<!-- Settings/cog icon representing experience -->
					<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z"/>
						<path d="M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
						<path d="M12 2v2"/>
						<path d="M12 22v-2"/>
						<path d="m17 20.66-1-1.73"/>
						<path d="M11 10.27 7 3.34"/>
						<path d="m20.66 17-1.73-1"/>
						<path d="m3.34 7 1.73 1"/>
						<path d="M14 12h8"/>
						<path d="M2 12h2"/>
						<path d="m20.66 7-1.73 1"/>
						<path d="m3.34 17 1.73-1"/>
						<path d="m17 3.34-1 1.73"/>
						<path d="m11 13.73-4 6.93"/>
					</svg>
					{selectedExperienceLevel || 'Experience'}
					<!-- ChevronDown icon -->
					<svg class="h-3 w-3 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m6 9 6 6 6-6"/>
					</svg>
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-48 p-0" align="start">
			<!-- "All Levels" option to clear filter -->
			<button
				type="button"
				class={cn(
					'w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors',
					!selectedExperienceLevel && 'bg-muted font-medium'
				)}
				onclick={() => {
					onExperienceLevelChange?.(null);
					experienceOpen = false;
				}}
			>
				All Levels
			</button>
			<!-- Individual experience level options -->
			{#each experienceLevels as level}
				<button
					type="button"
					class={cn(
						'w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors',
						selectedExperienceLevel === level && 'bg-muted font-medium'
					)}
					onclick={() => {
						onExperienceLevelChange?.(level);
						experienceOpen = false;
					}}
				>
					{level}
				</button>
			{/each}
		</Popover.Content>
	</Popover.Root>

	<!-- ========================================
	     EMPLOYMENT TYPE FILTER DROPDOWN
	     ========================================
	     Filters by employment arrangement.
	     Options: All Types, Full-time, Part-time, Contract, Internship
	-->
	<Popover.Root bind:open={typeOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					size="sm"
					class={cn(
						'h-9 gap-1.5',
						selectedEmploymentType && 'border-primary text-primary'
					)}
				>
					<!-- Briefcase icon -->
					<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
						<rect width="20" height="14" x="2" y="6" rx="2"/>
					</svg>
					{selectedEmploymentType || 'Job Type'}
					<!-- ChevronDown icon -->
					<svg class="h-3 w-3 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m6 9 6 6 6-6"/>
					</svg>
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-44 p-0" align="start">
			<!-- "All Types" option to clear filter -->
			<button
				type="button"
				class={cn(
					'w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors',
					!selectedEmploymentType && 'bg-muted font-medium'
				)}
				onclick={() => {
					onEmploymentTypeChange?.(null);
					typeOpen = false;
				}}
			>
				All Types
			</button>
			<!-- Individual employment type options -->
			{#each employmentTypes as type}
				<button
					type="button"
					class={cn(
						'w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors',
						selectedEmploymentType === type && 'bg-muted font-medium'
					)}
					onclick={() => {
						onEmploymentTypeChange?.(type);
						typeOpen = false;
					}}
				>
					{type}
				</button>
			{/each}
		</Popover.Content>
	</Popover.Root>

	<!-- ========================================
	     WORK TYPE FILTER DROPDOWN
	     ========================================
	     Filters by work arrangement.
	     Options: All Types, Remote, Hybrid, On-site
	-->
	<Popover.Root bind:open={workTypeOpen}>
		<Popover.Trigger>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					size="sm"
					class={cn(
						'h-9 gap-1.5',
						selectedLocationType && 'border-primary text-primary'
					)}
				>
					<!-- Home icon representing work location -->
					<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
						<polyline points="9 22 9 12 15 12 15 22"/>
					</svg>
					{selectedLocationType || 'Work Type'}
					<!-- ChevronDown icon -->
					<svg class="h-3 w-3 opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
						<path d="m6 9 6 6 6-6"/>
					</svg>
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-40 p-0" align="start">
			<!-- "All Types" option to clear filter -->
			<button
				type="button"
				class={cn(
					'w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors',
					!selectedLocationType && 'bg-muted font-medium'
				)}
				onclick={() => {
					onLocationTypeChange?.(null);
					workTypeOpen = false;
				}}
			>
				All Types
			</button>
			<!-- Individual work type options (Remote/Hybrid/On-site) -->
			{#each locationTypes as locationType}
				<button
					type="button"
					class={cn(
						'w-full text-left px-3 py-2 text-sm hover:bg-muted transition-colors',
						selectedLocationType === locationType && 'bg-muted font-medium'
					)}
					onclick={() => {
						onLocationTypeChange?.(locationType);
						workTypeOpen = false;
					}}
				>
					{locationType}
				</button>
			{/each}
		</Popover.Content>
	</Popover.Root>

	<!-- ========================================
	     CLEAR FILTERS BUTTON
	     ========================================
	     Only shows when at least one filter is active.
	     Resets all filters to their default state.
	-->
	{#if hasActiveFilters}
		<Button
			variant="ghost"
			size="sm"
			class="h-9 text-muted-foreground hover:text-foreground gap-1.5"
			onclick={onClearFilters}
		>
			<!-- X icon -->
			<svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
				<path d="M18 6 6 18"/>
				<path d="m6 6 12 12"/>
			</svg>
			Clear
		</Button>
	{/if}
</div>
