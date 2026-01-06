<!--
	Jobs Page - LinkedIn-Style Job Board
	=====================================

	A two-column job board layout inspired by LinkedIn:
	- Left: Scrollable job listings
	- Right: Selected job detail panel

	Features:
	- Inline filters across the top
	- Job count display
	- No right sidebar (full-width)
	- Responsive design (on mobile, detail hidden)
-->

<script lang="ts">
	import { onMount } from 'svelte';
	import { setActiveSection } from '$lib/stores/navigation.svelte';
	import { jobs } from '$lib/data/jobs';
	import type { Job, LocationType, EmploymentType, ExperienceLevel } from '$lib/data/jobs';

	// Components
	import JobCard from '$lib/components/jobs/JobCard.svelte';
	import JobDetail from '$lib/components/jobs/JobDetail.svelte';
	import JobFilters from '$lib/components/jobs/JobFilters.svelte';
	import * as ScrollArea from '$lib/components/ui/scroll-area';

	// Set active section on mount
	onMount(() => {
		setActiveSection('jobs');
	});

	// Filter state
	let searchQuery = $state('');
	let selectedLocation = $state('');
	let selectedLocationType = $state<LocationType | null>(null);
	let selectedEmploymentType = $state<EmploymentType | null>(null);
	let selectedExperienceLevel = $state<ExperienceLevel | null>(null);

	// Selected job state
	let selectedJobId = $state<string | null>(null);

	// Filtered jobs
	let filteredJobs = $derived(() => {
		return jobs.filter((job) => {
			// Search filter
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const matchesSearch =
					job.title.toLowerCase().includes(query) ||
					job.company.name.toLowerCase().includes(query) ||
					job.skills.some((skill) => skill.toLowerCase().includes(query)) ||
					job.description.toLowerCase().includes(query);
				if (!matchesSearch) return false;
			}

			// Location filter
			if (selectedLocation && job.location !== selectedLocation) {
				return false;
			}

			// Location type filter
			if (selectedLocationType && job.locationType !== selectedLocationType) {
				return false;
			}

			// Employment type filter
			if (selectedEmploymentType && job.employmentType !== selectedEmploymentType) {
				return false;
			}

			// Experience level filter
			if (selectedExperienceLevel && job.experienceLevel !== selectedExperienceLevel) {
				return false;
			}

			return true;
		});
	});

	// Selected job object
	let selectedJob = $derived<Job | null>(() => {
		if (!selectedJobId) return filteredJobs().length > 0 ? filteredJobs()[0] : null;
		return jobs.find((job) => job.id === selectedJobId) ?? null;
	});

	// Auto-select first job when filters change
	$effect(() => {
		const currentJobs = filteredJobs();
		if (currentJobs.length > 0 && (!selectedJobId || !currentJobs.some((j) => j.id === selectedJobId))) {
			selectedJobId = currentJobs[0].id;
		}
	});

	// Clear all filters
	function clearFilters() {
		searchQuery = '';
		selectedLocation = '';
		selectedLocationType = null;
		selectedEmploymentType = null;
		selectedExperienceLevel = null;
	}

	// Handle job selection
	function selectJob(jobId: string) {
		selectedJobId = jobId;
	}

	// Get current job index for pagination
	let currentJobIndex = $derived(() => {
		const jobs = filteredJobs();
		const current = selectedJob();
		if (!current) return 0;
		return jobs.findIndex(j => j.id === current.id);
	});

	// Navigate to previous job
	function prevJob() {
		const jobs = filteredJobs();
		const idx = currentJobIndex();
		if (idx > 0) {
			selectedJobId = jobs[idx - 1].id;
		}
	}

	// Navigate to next job
	function nextJob() {
		const jobs = filteredJobs();
		const idx = currentJobIndex();
		if (idx < jobs.length - 1) {
			selectedJobId = jobs[idx + 1].id;
		}
	}
</script>

<svelte:head>
	<title>Jobs | Community</title>
	<meta name="description" content="Find your next job opportunity" />
</svelte:head>

<!--
	LinkedIn-style fixed split view:
	- Uses calc(100vh - 4rem) to fill viewport minus 64px header
	- Both columns scroll independently
	- Filters and job count are sticky at the top
-->
<div class="flex h-[calc(100vh-4rem-36px)] flex-col">
	<!-- Inline Filters -->
	<JobFilters
		{searchQuery}
		{selectedLocation}
		{selectedLocationType}
		{selectedEmploymentType}
		{selectedExperienceLevel}
		onSearchChange={(value) => (searchQuery = value)}
		onLocationChange={(value) => (selectedLocation = value)}
		onLocationTypeChange={(value) => (selectedLocationType = value)}
		onEmploymentTypeChange={(value) => (selectedEmploymentType = value)}
		onExperienceLevelChange={(value) => (selectedExperienceLevel = value)}
		onClearFilters={clearFilters}
	/>

	<!-- Job Count with Pagination Arrows - constrained to job list column width -->
	<div class="border-b border-border bg-muted/30 text-sm text-muted-foreground shrink-0">
		<div class="w-[420px] px-4 py-2 flex items-center justify-between border-r border-border">
			<span>{filteredJobs().length} job{filteredJobs().length !== 1 ? 's' : ''} found</span>
			{#if filteredJobs().length > 0}
				<div class="flex items-center gap-1">
					<button
						type="button"
						onclick={prevJob}
						disabled={currentJobIndex() === 0}
						class="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						aria-label="Previous job"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="m15 18-6-6 6-6"/>
						</svg>
					</button>
					<span class="text-xs tabular-nums">
						{currentJobIndex() + 1} of {filteredJobs().length}
					</span>
					<button
						type="button"
						onclick={nextJob}
						disabled={currentJobIndex() >= filteredJobs().length - 1}
						class="p-1 rounded hover:bg-muted disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
						aria-label="Next job"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="m9 18 6-6-6-6"/>
						</svg>
					</button>
				</div>
			{/if}
		</div>
	</div>

	<!-- Main Content: Split View - Both columns independently scrollable -->
	<div class="flex-1 flex min-h-0 overflow-hidden">
		<!-- Left Panel: Job List - Independent scroll -->
		<div class="w-[420px] shrink-0 border-r border-border overflow-hidden">
			<ScrollArea.Root class="h-full">
				<div>
					{#each filteredJobs() as job (job.id)}
						<JobCard
							{job}
							isActive={selectedJob()?.id === job.id}
							onclick={() => selectJob(job.id)}
						/>
					{:else}
						<!-- Empty State -->
						<div class="flex flex-col items-center justify-center p-8 text-center">
							<div class="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
								<svg class="h-6 w-6 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
									<circle cx="11" cy="11" r="8"/>
									<path d="m21 21-4.3-4.3"/>
								</svg>
							</div>
							<h3 class="font-medium text-foreground">No jobs found</h3>
							<p class="text-sm text-muted-foreground mt-1">
								Try adjusting your filters
							</p>
							<button
								type="button"
								class="mt-3 text-sm text-primary hover:underline"
								onclick={clearFilters}
							>
								Clear all filters
							</button>
						</div>
					{/each}
				</div>
			</ScrollArea.Root>
		</div>

		<!-- Right Panel: Job Detail - Independent scroll -->
		<div class="flex-1 min-w-0 hidden lg:block overflow-hidden">
			<JobDetail job={selectedJob()} class="h-full" />
		</div>
	</div>
</div>
